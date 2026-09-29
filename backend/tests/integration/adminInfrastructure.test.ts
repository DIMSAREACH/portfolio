import request from 'supertest';
import { describe, it, expect } from '@jest/globals';
import app from '../../src/app';
import { generateAccessToken } from '../../src/utils/jwt';

describe('Admin Route Infrastructure Integration Tests (/api/v1/admin)', () => {
  const dummyAdminId = 'admin-user-id-12345';
  const dummyRegularUserId = 'regular-user-id-67890';

  it('should return 401 Unauthorized when requesting admin route without token', async () => {
    const res = await request(app).get('/api/v1/admin');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Access token required');
  });

  it('should return 401 Unauthorized when requesting with invalid token', async () => {
    const res = await request(app)
      .get('/api/v1/admin')
      .set('Authorization', 'Bearer invalid.token.payload');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Invalid or expired token');
  });

  it('should return 403 Forbidden when user does not have admin role', async () => {
    const nonAdminToken = generateAccessToken(dummyRegularUserId, 'viewer');

    const res = await request(app)
      .get('/api/v1/admin')
      .set('Authorization', `Bearer ${nonAdminToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Insufficient permissions');
  });

  it('should return 200 OK when valid admin access token is provided', async () => {
    const adminToken = generateAccessToken(dummyAdminId, 'admin');

    const res = await request(app)
      .get('/api/v1/admin')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Admin API root');
  });
});
