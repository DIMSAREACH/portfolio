import mongoose from 'mongoose';
import User, { IUser } from '../models/User';
import Profile from '../models/Profile';
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

    return { accessToken, user: sanitizeUser(user) };
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
}

export const authService = new AuthService();
export default authService;
