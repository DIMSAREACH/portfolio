import jwt, { SignOptions } from 'jsonwebtoken';
import config from '../config/environment';

export interface AccessTokenPayload {
  userId: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface RefreshTokenPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

/**
 * Generate a short-lived JWT access token
 * @param userId User MongoDB ID
 * @param role User authorization role
 */
export function generateAccessToken(userId: string, role: string): string {
  const payload: AccessTokenPayload = { userId, role };
  const signOptions: SignOptions = {
    expiresIn: config.JWT_ACCESS_EXPIRATION as unknown as SignOptions['expiresIn'],
  };

  return jwt.sign(payload, config.JWT_SECRET, signOptions);
}

/**
 * Generate a long-lived JWT refresh token
 * @param userId User MongoDB ID
 */
export function generateRefreshToken(userId: string): string {
  const payload: RefreshTokenPayload = { userId };
  const signOptions: SignOptions = {
    expiresIn: config.JWT_REFRESH_EXPIRATION as unknown as SignOptions['expiresIn'],
  };

  return jwt.sign(payload, config.JWT_REFRESH_SECRET, signOptions);
}

/**
 * Verify and decode an access token using JWT_SECRET
 * @param token JWT token string
 * @throws JsonWebTokenError | TokenExpiredError
 */
export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, config.JWT_SECRET) as AccessTokenPayload;
}

/**
 * Verify and decode a refresh token using JWT_REFRESH_SECRET
 * @param token JWT token string
 * @throws JsonWebTokenError | TokenExpiredError
 */
export function verifyRefreshToken(token: string): RefreshTokenPayload {
  return jwt.verify(token, config.JWT_REFRESH_SECRET) as RefreshTokenPayload;
}

export default {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
