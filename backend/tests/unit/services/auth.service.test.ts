import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import mongoose from 'mongoose';
import User from '../../../src/models/User';
import authService from '../../../src/services/auth.service';
import { UnauthorizedError, NotFoundError, BadRequestError } from '../../../src/utils/AppError';
import * as jwtUtils from '../../../src/utils/jwt';
import * as firebaseConfig from '../../../src/config/firebase';

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

  describe('loginWithFirebase', () => {
    it('should authenticate user with valid Firebase token and link firebaseUid', async () => {
      const mockDecodedToken: any = {
        uid: 'firebase-uid-123',
        email: 'admin@portfolio.dev',
        name: 'Dim Sareach',
      };
      jest.spyOn(firebaseConfig, 'verifyFirebaseIdToken').mockResolvedValue(mockDecodedToken);
      jest.spyOn(User, 'findOne').mockResolvedValue(mockUserInstance as any);

      const result = await authService.loginWithFirebase('mock-id-token');

      expect(firebaseConfig.verifyFirebaseIdToken).toHaveBeenCalledWith('mock-id-token');
      expect(User.findOne).toHaveBeenCalledWith({ email: 'admin@portfolio.dev' });
      expect(mockUserInstance.firebaseUid).toBe('firebase-uid-123');
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(result.user.email).toBe('admin@portfolio.dev');
    });

    it('should throw BadRequestError if token does not contain an email', async () => {
      const mockDecodedToken: any = {
        uid: 'firebase-uid-123',
      };
      jest.spyOn(firebaseConfig, 'verifyFirebaseIdToken').mockResolvedValue(mockDecodedToken);

      await expect(authService.loginWithFirebase('token-without-email')).rejects.toThrow(
        BadRequestError,
      );
    });

    it('should throw UnauthorizedError if user is not in database and count > 0', async () => {
      const mockDecodedToken: any = {
        uid: 'firebase-uid-999',
        email: 'unregistered@portfolio.dev',
      };
      jest.spyOn(firebaseConfig, 'verifyFirebaseIdToken').mockResolvedValue(mockDecodedToken);
      jest.spyOn(User, 'findOne').mockResolvedValue(null);
      jest.spyOn(User, 'countDocuments').mockResolvedValue(1 as any);

      await expect(authService.loginWithFirebase('unregistered-token')).rejects.toThrow(
        UnauthorizedError,
      );
    });

    it('should auto-create initial admin user if user table is empty', async () => {
      const mockDecodedToken: any = {
        uid: 'firebase-uid-new',
        email: 'initial-admin@portfolio.dev',
        name: 'Initial Admin',
      };
      jest.spyOn(firebaseConfig, 'verifyFirebaseIdToken').mockResolvedValue(mockDecodedToken);
      jest.spyOn(User, 'findOne').mockResolvedValue(null);
      jest.spyOn(User, 'countDocuments').mockResolvedValue(0 as any);
      jest.spyOn(User, 'create').mockResolvedValue({
        ...mockUserInstance,
        email: 'initial-admin@portfolio.dev',
        fullName: 'Initial Admin',
      } as any);

      const result = await authService.loginWithFirebase('initial-admin-token');
      expect(User.create).toHaveBeenCalled();
      expect(result.accessToken).toBeDefined();
    });
  });
});

