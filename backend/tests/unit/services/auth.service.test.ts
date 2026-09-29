import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import mongoose from 'mongoose';
import User from '../../../src/models/User';
import authService from '../../../src/services/auth.service';
import { UnauthorizedError, NotFoundError } from '../../../src/utils/AppError';
import * as jwtUtils from '../../../src/utils/jwt';

describe('AuthService', () => {
  const dummyUserId = new mongoose.Types.ObjectId();
  const mockUserInstance: any = {
    _id: dummyUserId,
    email: 'admin@portfolio.dev',
    fullName: 'Admin Developer',
    role: 'admin',
    isActive: true,
    lastLogin: undefined,
    password: 'hashedpassword123',
    comparePassword: jest.fn(),
    save: jest.fn(),
    toObject: () => ({
      _id: dummyUserId,
      email: 'admin@portfolio.dev',
      fullName: 'Admin Developer',
      role: 'admin',
      isActive: true,
      password: 'hashedpassword123',
    }),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUserInstance.comparePassword.mockResolvedValue(true);
    mockUserInstance.save.mockResolvedValue(mockUserInstance);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('login', () => {
    it('should authenticate user and return sanitized user with tokens', async () => {
      jest.spyOn(User, 'findOne').mockResolvedValue(mockUserInstance as any);

      const result = await authService.login('ADMIN@PORTFOLIO.DEV', 'password123');

      expect(User.findOne).toHaveBeenCalledWith({ email: 'admin@portfolio.dev' });
      expect(mockUserInstance.comparePassword).toHaveBeenCalledWith('password123');
      expect(mockUserInstance.save).toHaveBeenCalled();
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.user).not.toHaveProperty('password');
      expect(result.user.email).toBe('admin@portfolio.dev');
    });

    it('should throw UnauthorizedError if user is not found', async () => {
      jest.spyOn(User, 'findOne').mockResolvedValue(null);

      await expect(authService.login('unknown@portfolio.dev', 'secret')).rejects.toThrow(
        UnauthorizedError,
      );
    });

    it('should throw UnauthorizedError if user is inactive', async () => {
      const inactiveUser = { ...mockUserInstance, isActive: false };
      jest.spyOn(User, 'findOne').mockResolvedValue(inactiveUser as any);

      await expect(authService.login('admin@portfolio.dev', 'password123')).rejects.toThrow(
        UnauthorizedError,
      );
    });

    it('should throw UnauthorizedError if password comparison fails', async () => {
      mockUserInstance.comparePassword.mockResolvedValue(false);
      jest.spyOn(User, 'findOne').mockResolvedValue(mockUserInstance as any);

      await expect(authService.login('admin@portfolio.dev', 'wrongpassword')).rejects.toThrow(
        UnauthorizedError,
      );
    });
  });

  describe('refreshAccessToken', () => {
    it('should return a new access token for a valid refresh token', async () => {
      const refreshToken = jwtUtils.generateRefreshToken(dummyUserId.toString());
      jest.spyOn(User, 'findById').mockResolvedValue(mockUserInstance as any);

      const result = await authService.refreshAccessToken(refreshToken);

      expect(User.findById).toHaveBeenCalledWith(dummyUserId.toString());
      expect(result.accessToken).toBeDefined();

      const decoded = jwtUtils.verifyAccessToken(result.accessToken);
      expect(decoded.userId).toBe(dummyUserId.toString());
    });

    it('should throw UnauthorizedError if refresh token is missing', async () => {
      await expect(authService.refreshAccessToken('')).rejects.toThrow(UnauthorizedError);
    });

    it('should throw UnauthorizedError if refresh token is invalid', async () => {
      await expect(authService.refreshAccessToken('invalid.token.signature')).rejects.toThrow(
        UnauthorizedError,
      );
    });

    it('should throw UnauthorizedError if user is not found or inactive', async () => {
      const refreshToken = jwtUtils.generateRefreshToken(dummyUserId.toString());
      jest.spyOn(User, 'findById').mockResolvedValue(null);

      await expect(authService.refreshAccessToken(refreshToken)).rejects.toThrow(
        UnauthorizedError,
      );
    });
  });

  describe('getCurrentUser', () => {
    it('should return user profile without password', async () => {
      const selectMock = {
        select: jest.fn().mockImplementation(() => Promise.resolve(mockUserInstance)),
      };
      jest.spyOn(User, 'findById').mockReturnValue(selectMock as any);

      const result = await authService.getCurrentUser(dummyUserId.toString());

      expect(User.findById).toHaveBeenCalledWith(dummyUserId.toString());
      expect(selectMock.select).toHaveBeenCalledWith('-password');
      expect(result).not.toHaveProperty('password');
      expect(result.email).toBe('admin@portfolio.dev');
    });

    it('should throw NotFoundError if user does not exist', async () => {
      const selectMock = {
        select: jest.fn().mockImplementation(() => Promise.resolve(null)),
      };
      jest.spyOn(User, 'findById').mockReturnValue(selectMock as any);

      await expect(authService.getCurrentUser(dummyUserId.toString())).rejects.toThrow(
        NotFoundError,
      );
    });
  });

  describe('changePassword', () => {
    it('should update user password when current password matches', async () => {
      jest.spyOn(User, 'findById').mockResolvedValue(mockUserInstance as any);

      await authService.changePassword(
        dummyUserId.toString(),
        'oldPassword123',
        'newSecurePassword456',
      );

      expect(mockUserInstance.comparePassword).toHaveBeenCalledWith('oldPassword123');
      expect(mockUserInstance.password).toBe('newSecurePassword456');
      expect(mockUserInstance.save).toHaveBeenCalled();
    });

    it('should throw NotFoundError if user is not found', async () => {
      jest.spyOn(User, 'findById').mockResolvedValue(null);

      await expect(
        authService.changePassword(dummyUserId.toString(), 'old', 'new'),
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw UnauthorizedError if current password does not match', async () => {
      mockUserInstance.comparePassword.mockResolvedValue(false);
      jest.spyOn(User, 'findById').mockResolvedValue(mockUserInstance as any);

      await expect(
        authService.changePassword(dummyUserId.toString(), 'wrongPassword', 'newPassword'),
      ).rejects.toThrow(UnauthorizedError);
    });
  });
});
