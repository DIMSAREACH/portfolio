import request from 'supertest';
import { describe, it, expect } from '@jest/globals';
import app from '../../src/app';

describe('API Route Structure & Health Check', () => {
  it('should return 200 with status ok and timestamp on /api/v1/health', async () => {
    const res = await request(app).get('/api/v1/health');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('timestamp');
    expect(typeof res.body.timestamp).toBe('string');
  });

  it('should return 404 for unversioned /health route', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('should return 404 for non-existent /api/v1 routes', async () => {
    const res = await request(app).get('/api/v1/unknown-endpoint');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Route GET /api/v1/unknown-endpoint not found');
  });
});
