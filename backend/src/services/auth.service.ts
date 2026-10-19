import crypto from 'crypto';
import mongoose from 'mongoose';
import User, { IUser } from '../models/User';
import Profile from '../models/Profile';
import config from '../config/environment';
import logger from '../utils/logger';
import emailService from './email.service';
import { UnauthorizedError, NotFoundError, BadRequestError } from '../utils/AppError';
import { verifyFirebaseIdToken } from '../config/firebase';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt';

export interface LoginResult {
  user: Record<string, unknown>;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshResult {
  accessToken: string;
  refreshToken?: string;
  user?: Record<string, unknown>;
}

/**
 * Remove sensitive password field from user document
 */
export const sanitizeUser = (user: IUser): Record<string, unknown> => {
  const userObj = user.toObject ? user.toObject() : { ...user };
  delete (userObj as { password?: string }).password;
  return userObj;
};

export class AuthService {
  /**
   * Authenticate user with email and password
   */
  async login(email: string, password: string): Promise<LoginResult> {
    const normalizedEmail = email ? email.toLowerCase().trim() : '';
    const user = await User.findOne({ email: normalizedEmail });

    if (!user || !user.isActive) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const userId = user._id.toString();
    const accessToken = generateAccessToken(userId, user.role);
    const refreshToken = generateRefreshToken(userId);

    await this.ensureUserAvatar(user);

    user.lastLogin = new Date();
    await user.save();

    return {
      user: sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  }

  /**
   * Authenticate user with verified Firebase ID token
   */
  async loginWithFirebase(idToken: string): Promise<LoginResult> {
    const decodedToken = await verifyFirebaseIdToken(idToken);
    const email = decodedToken.email?.toLowerCase().trim();

    if (!email) {
      throw new BadRequestError('Firebase account does not have an associated email address');
    }

    let user = await User.findOne({ email });

    if (!user) {
      // Check if this is the initial admin or if user table is empty
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        user = await User.create({
          email,
          fullName: decodedToken.name || 'Admin',
          password: Math.random().toString(36).slice(-10) + 'A1!random',
          role: 'admin',
          avatar: decodedToken.picture,
          firebaseUid: decodedToken.uid,
          isActive: true,
        });
      } else {
        throw new UnauthorizedError(
          `User with email ${email} is not authorized as an administrator`,
        );
      }
    } else {
      if (!user.isActive) {
        throw new UnauthorizedError('User account is inactive');
      }

      if (!user.firebaseUid) {
        user.firebaseUid = decodedToken.uid;
      }
      if (!user.avatar && decodedToken.picture) {
        user.avatar = decodedToken.picture;
      }
    }

    await this.ensureUserAvatar(user);

    user.lastLogin = new Date();
    await user.save();

    const userId = user._id.toString();
    const accessToken = generateAccessToken(userId, user.role);
    const refreshToken = generateRefreshToken(userId);

    return {
      user: sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  }

  /**
   * Backfill user avatar from Profile if not set
   */
  private async ensureUserAvatar(user: IUser): Promise<void> {
    if (!user.avatar && mongoose.connection?.readyState === 1) {
      try {
        const profile = await Profile.findOne();
        if (profile?.profileImage) {
          user.avatar = profile.profileImage;
          await user.save();
        }
      } catch {
        // Silently continue if profile lookup fails
      }
    }
  }

  /**
   * Issue a new access token using a valid refresh token
   */
  async refreshAccessToken(token: string): Promise<RefreshResult> {
    if (!token) {
      throw new UnauthorizedError('Refresh token is required');
    }

    let payload;
    try {
      payload = verifyRefreshToken(token);
    } catch {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    const user = await User.findById(payload.userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    await this.ensureUserAvatar(user);

    const accessToken = generateAccessToken(user._id.toString(), user.role);
    const newRefreshToken = generateRefreshToken(user._id.toString());

    return { accessToken, refreshToken: newRefreshToken, user: sanitizeUser(user) };
  }

  /**
   * Get user profile by userId without password
   */
  async getCurrentUser(userId: string): Promise<Record<string, unknown>> {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new NotFoundError('User not found');
    }

    await this.ensureUserAvatar(user);

    return sanitizeUser(user);
  }

  /**
   * Change current authenticated user's password
   */
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new UnauthorizedError('Current password is incorrect');
    }

    user.password = newPassword;
    await user.save();
  }

  /**
   * Request password reset token for given email.
   * Always resolves with success message to protect against user enumeration.
   */
  async forgotPassword(
    email: string,
    hostOrOrigin?: string,
  ): Promise<{ message: string; resetUrl?: string }> {
    const normalizedEmail = email ? email.toLowerCase().trim() : '';
    const user = await User.findOne({ email: normalizedEmail, isActive: true });

    // Always prepare a generic success response to prevent email harvesting
    const successMessage =
      'If an account with that email exists, password reset instructions have been sent.';

    if (!user) {
      return { message: successMessage };
    }

    // Generate cryptographically secure random token (32 bytes = 64 hex characters)
    const rawResetToken = crypto.randomBytes(32).toString('hex');

    // Hash the token before storing in MongoDB
    const hashedToken = crypto.createHash('sha256').update(rawResetToken).digest('hex');

    // Token expires in 1 hour
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    // Determine frontend origin for the reset link
    let frontendOrigin = config.CORS_ORIGIN.split(',')[0].trim() || 'http://localhost:4200';
    if (
      hostOrOrigin &&
      (hostOrOrigin.startsWith('http://') || hostOrOrigin.startsWith('https://'))
    ) {
      frontendOrigin = hostOrOrigin.replace(/\/$/, '');
    }

    const resetUrl = `${frontendOrigin}/admin/reset-password?token=${rawResetToken}`;

    // Dispatch email
    await emailService.sendPasswordResetEmail(user.email, resetUrl, user.fullName);

    // In non-production environments, log the reset URL for developer convenience
    if (config.NODE_ENV !== 'production') {
      logger.info(`[Dev Password Reset Link]: ${resetUrl}`);
    }

    return {
      message: successMessage,
      ...(config.NODE_ENV !== 'production' ? { resetUrl } : {}),
    };
  }

  /**
   * Reset user password using token
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    if (!token) {
      throw new BadRequestError('Password reset token is required');
    }

    if (!newPassword || newPassword.length < 8) {
      throw new BadRequestError('New password must be at least 8 characters long');
    }

    const hashedToken = crypto.createHash('sha256').update(token.trim()).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user || !user.isActive) {
      throw new BadRequestError('Password reset token is invalid or has expired');
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    logger.info(`Password reset successfully for user: ${user.email}`);
  }
}

export const authService = new AuthService();
export default authService;
