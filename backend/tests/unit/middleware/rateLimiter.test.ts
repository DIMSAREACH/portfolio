import { describe, it, expect } from '@jest/globals';
import express, { Request, Response } from 'express';
import request from 'supertest';
import {
  createRateLimiter,
  loginLimiter,
  contactLimiter,
  globalLimiter,
} from '../../../src/middleware/rateLimiter.middleware';
import config from '../../../src/config/environment';

describe('Rate Limiter Middleware', () => {
  it('should allow requests under the limit and block subsequent requests with 429', async () => {
    const testApp = express();
    const customLimiter = createRateLimiter({
      windowMs: 60 * 1000,
      max: 2,
      message: 'Custom rate limit exceeded',
    });

    testApp.use(customLimiter);
    testApp.get('/test-limit', (_req: Request, res: Response) => {
      res.status(200).json({ success: true, message: 'ok' });
    });

    // Request 1: Allowed
    const res1 = await request(testApp).get('/test-limit');
    expect(res1.status).toBe(200);
    expect(res1.body.success).toBe(true);

    // Request 2: Allowed
    const res2 = await request(testApp).get('/test-limit');
    expect(res2.status).toBe(200);
    expect(res2.body.success).toBe(true);

    // Request 3: Blocked (429)
    const res3 = await request(testApp).get('/test-limit');
    expect(res3.status).toBe(429);
    expect(res3.headers['content-type']).toMatch(/json/);
    expect(res3.body).toEqual({
      success: false,
      message: 'Custom rate limit exceeded',
    });
  });

  it('should enforce loginLimiter with max 5 requests', async () => {
    const testApp = express();
    testApp.post('/login', loginLimiter, (_req: Request, res: Response) => {
      res.status(200).json({ success: true });
    });

    // Make 5 successful requests
    for (let i = 0; i < 5; i++) {
      const res = await request(testApp).post('/login');
      expect(res.status).toBe(200);
    }

    // 6th request must be rate limited
    const resBlocked = await request(testApp).post('/login');
    expect(resBlocked.status).toBe(429);
    expect(resBlocked.body).toEqual({
      success: false,
      message: 'Too many login attempts, please try again after 15 minutes.',
    });
  });

  it('should export contactLimiter and globalLimiter as middleware functions', () => {
    expect(typeof contactLimiter).toBe('function');
    expect(typeof globalLimiter).toBe('function');
    expect(typeof loginLimiter).toBe('function');
    expect(typeof createRateLimiter).toBe('function');
  });

  it('should configure globalLimiter with environment settings', () => {
    expect(config.RATE_LIMIT_WINDOW_MS).toBeDefined();
    expect(config.RATE_LIMIT_MAX_REQUESTS).toBeDefined();
    expect(typeof globalLimiter).toBe('function');
  });
});
