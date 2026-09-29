import { describe, it, expect } from '@jest/globals';
import jwt from 'jsonwebtoken';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from '../../../src/utils/jwt';
import config from '../../../src/config/environment';

describe('JWT Token Utility', () => {
  const dummyUserId = '64b1f8e29a1b2c3d4e5f6789';
  const dummyRole = 'admin';

  describe('generateAccessToken & verifyAccessToken', () => {
    it('should generate an access token that can be verified with correct payload', () => {
      const token = generateAccessToken(dummyUserId, dummyRole);
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);

      const decoded = verifyAccessToken(token);
      expect(decoded.userId).toBe(dummyUserId);
      expect(decoded.role).toBe(dummyRole);
      expect(decoded.exp).toBeDefined();
      expect(decoded.iat).toBeDefined();
    });

    it('should reject when verifying an access token signed with a different secret', () => {
      const fakeToken = jwt.sign(
        { userId: dummyUserId, role: dummyRole },
        'wrong-secret-key',
      );

      expect(() => verifyAccessToken(fakeToken)).toThrow(jwt.JsonWebTokenError);
    });

    it('should reject an access token when verified with verifyRefreshToken', () => {
      const accessToken = generateAccessToken(dummyUserId, dummyRole);

      expect(() => verifyRefreshToken(accessToken)).toThrow(jwt.JsonWebTokenError);
    });

    it('should throw TokenExpiredError for an expired access token', () => {
      const expiredToken = jwt.sign(
        { userId: dummyUserId, role: dummyRole },
        config.JWT_SECRET,
        { expiresIn: -10 },
      );

      expect(() => verifyAccessToken(expiredToken)).toThrow(jwt.TokenExpiredError);
    });

    it('should throw JsonWebTokenError for a malformed token', () => {
      expect(() => verifyAccessToken('not.a.valid.jwt.token')).toThrow(
        jwt.JsonWebTokenError,
      );
    });
  });

  describe('generateRefreshToken & verifyRefreshToken', () => {
    it('should generate a refresh token that can be verified with correct payload', () => {
      const token = generateRefreshToken(dummyUserId);
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);

      const decoded = verifyRefreshToken(token);
      expect(decoded.userId).toBe(dummyUserId);
      expect(decoded.exp).toBeDefined();
      expect(decoded.iat).toBeDefined();
    });

    it('should reject a refresh token when verified with verifyAccessToken', () => {
      const refreshToken = generateRefreshToken(dummyUserId);

      expect(() => verifyAccessToken(refreshToken)).toThrow(jwt.JsonWebTokenError);
    });

    it('should throw TokenExpiredError for an expired refresh token', () => {
      const expiredToken = jwt.sign(
        { userId: dummyUserId },
        config.JWT_REFRESH_SECRET,
        { expiresIn: -10 },
      );

      expect(() => verifyRefreshToken(expiredToken)).toThrow(jwt.TokenExpiredError);
    });

    it('should throw JsonWebTokenError for an invalid refresh token', () => {
      expect(() => verifyRefreshToken('malformed-token')).toThrow(
        jwt.JsonWebTokenError,
      );
    });
  });
});
