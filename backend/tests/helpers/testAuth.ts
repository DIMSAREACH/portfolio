import { generateAccessToken, generateRefreshToken } from '../../src/utils/jwt';

export interface TestAuthResult {
  userId: string;
  accessToken: string;
  refreshToken: string;
  authHeader: { Authorization: string };
}

/**
 * Generate authenticated test admin credentials and headers
 */
export function createTestAdminToken(userId = 'test-admin-id-12345'): TestAuthResult {
  const accessToken = generateAccessToken(userId, 'admin');
  const refreshToken = generateRefreshToken(userId);
  return {
    userId,
    accessToken,
    refreshToken,
    authHeader: { Authorization: `Bearer ${accessToken}` },
  };
}

/**
 * Generate bearer authorization header from token
 */
export function getAuthHeaders(token: string): { Authorization: string } {
  return { Authorization: `Bearer ${token}` };
}
