import User, { IUser } from '../models/User';
import { UnauthorizedError, NotFoundError } from '../utils/AppError';
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

    user.lastLogin = new Date();
    await user.save();

    return {
      user: sanitizeUser(user),
      accessToken,
      refreshToken,
    };
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

    const accessToken = generateAccessToken(user._id.toString(), user.role);

    return { accessToken };
  }

  /**
   * Get user profile by userId without password
   */
  async getCurrentUser(userId: string): Promise<Record<string, unknown>> {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new NotFoundError('User not found');
    }

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
