import request from 'supertest';
import { describe, it, expect } from '@jest/globals';
import app from '../../src/app';

describe('GET /api/v1/health', () => {
  it('should return 200 with status ok and timestamp', async () => {
    const res = await request(app).get('/api/v1/health');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('timestamp');
    expect(typeof res.body.timestamp).toBe('string');
  });
});
