import request from 'supertest';
import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import app from '../../src/app';
import User from '../../src/models/User';
import { generateAccessToken, generateRefreshToken } from '../../src/utils/jwt';

describe('Auth Endpoints Integration Tests (/api/v1/auth)', () => {
  const dummyUserId = '654321654321654321654321';
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

  describe('POST /api/v1/auth/login', () => {
    it('should return 200, access token, and HTTP-only refresh cookie on valid credentials', async () => {
      jest.spyOn(User, 'findOne').mockResolvedValue(mockUserInstance as any);

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'admin@portfolio.dev',
          password: 'CorrectPassword123!',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('accessToken');
      expect(res.body.data).toHaveProperty('user');
      expect(res.body.data.user.email).toBe('admin@portfolio.dev');
      expect(res.body.data.user).not.toHaveProperty('password');
      expect(res.body.message).toBe('Login successful');

      // Check cookie headers
      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      const cookieStr = Array.isArray(cookies) ? cookies.join(';') : cookies;
      expect(cookieStr).toContain('refreshToken=');
      expect(cookieStr).toMatch(/Path=\/api\/v1\/auth/i);
      expect(cookieStr).toMatch(/HttpOnly/i);
    });

    it('should return 400 when body fails validation', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'invalid-email',
          password: '',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Validation failed');
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'email' }),
          expect.objectContaining({ field: 'password' }),
        ]),
      );
    });

    it('should return 401 when user credentials are invalid', async () => {
      mockUserInstance.comparePassword.mockResolvedValue(false);
      jest.spyOn(User, 'findOne').mockResolvedValue(mockUserInstance as any);

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'admin@portfolio.dev',
          password: 'WrongPassword!',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Invalid email or password');
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    it('should clear refresh token cookie and return 200', async () => {
      const res = await request(app).post('/api/v1/auth/logout');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeNull();
      expect(res.body.message).toBe('Logged out successfully');

      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      const cookieStr = Array.isArray(cookies) ? cookies.join(';') : cookies;
      expect(cookieStr).toMatch(/refreshToken=;/);
    });
  });

  describe('POST /api/v1/auth/refresh', () => {
    it('should return new access token when valid refresh cookie is provided', async () => {
      const validRefreshToken = generateRefreshToken(dummyUserId);
      jest.spyOn(User, 'findById').mockResolvedValue(mockUserInstance as any);

      const res = await request(app)
        .post('/api/v1/auth/refresh')
        .set('Cookie', [`refreshToken=${validRefreshToken}`]);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('accessToken');
      expect(typeof res.body.data.accessToken).toBe('string');
      expect(res.body.message).toBe('Token refreshed successfully');
    });

    it('should return 401 when no refresh cookie is provided', async () => {
      const res = await request(app).post('/api/v1/auth/refresh');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Refresh token is required');
    });

    it('should return 401 when refresh token is invalid', async () => {
      const res = await request(app)
        .post('/api/v1/auth/refresh')
        .set('Cookie', ['refreshToken=invalid.token.signature']);

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Invalid or expired refresh token');
    });
  });

  describe('GET /api/v1/auth/me', () => {
    it('should return 200 and current user profile when valid access token is provided', async () => {
      const validAccessToken = generateAccessToken(dummyUserId, 'admin');

      const selectMock = {
        select: jest.fn().mockImplementation(() => Promise.resolve(mockUserInstance)),
      };
      jest.spyOn(User, 'findById').mockReturnValue(selectMock as any);

      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${validAccessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe('admin@portfolio.dev');
      expect(res.body.data).not.toHaveProperty('password');
      expect(res.body.message).toBe('Current user profile retrieved');
    });

    it('should return 401 when Authorization header is missing', async () => {
      const res = await request(app).get('/api/v1/auth/me');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Access token required');
    });

    it('should return 401 when token is invalid or expired', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Invalid or expired token');
    });
  });

  describe('PATCH /api/v1/auth/change-password', () => {
    it('should return 200 on successful password change', async () => {
      const validAccessToken = generateAccessToken(dummyUserId, 'admin');

      jest.spyOn(User, 'findById').mockResolvedValue(mockUserInstance as any);

      const res = await request(app)
        .patch('/api/v1/auth/change-password')
        .set('Authorization', `Bearer ${validAccessToken}`)
        .send({
          currentPassword: 'CurrentPassword123!',
          newPassword: 'BrandNewSecurePassword456!',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeNull();
      expect(res.body.message).toBe('Password changed successfully');
      expect(mockUserInstance.save).toHaveBeenCalled();
    });

    it('should return 400 when new password is too short', async () => {
      const validAccessToken = generateAccessToken(dummyUserId, 'admin');

      const res = await request(app)
        .patch('/api/v1/auth/change-password')
        .set('Authorization', `Bearer ${validAccessToken}`)
        .send({
          currentPassword: 'CurrentPassword123!',
          newPassword: 'short',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Validation failed');
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'newPassword' }),
        ]),
      );
    });

    it('should return 401 when current password is wrong', async () => {
      const validAccessToken = generateAccessToken(dummyUserId, 'admin');

      mockUserInstance.comparePassword.mockResolvedValue(false);
      jest.spyOn(User, 'findById').mockResolvedValue(mockUserInstance as any);

      const res = await request(app)
        .patch('/api/v1/auth/change-password')
        .set('Authorization', `Bearer ${validAccessToken}`)
        .send({
          currentPassword: 'WrongCurrentPassword!',
          newPassword: 'BrandNewSecurePassword456!',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Current password is incorrect');
    });

    it('should return 401 when not authenticated', async () => {
      const res = await request(app)
        .patch('/api/v1/auth/change-password')
        .send({
          currentPassword: 'CurrentPassword123!',
          newPassword: 'BrandNewSecurePassword456!',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
