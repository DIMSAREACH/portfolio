import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import app from '../../src/app';
import config from '../../src/config/environment';

describe('Security Headers & CORS Middleware Integration', () => {
  it('should include Helmet security headers in HTTP responses', async () => {
    const res = await request(app).get('/api/v1/health');

    expect(res.status).toBe(200);
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-dns-prefetch-control']).toBe('off');
    expect(res.headers['x-frame-options']).toBe('SAMEORIGIN');
    expect(res.headers['strict-transport-security']).toBeDefined();
  });

  it('should allow whitelisted CORS origin and support credentials', async () => {
    const origin = config.CORS_ORIGIN.split(',')[0].trim();

    const res = await request(app)
      .get('/api/v1/health')
      .set('Origin', origin);

    expect(res.status).toBe(200);
    expect(res.headers['access-control-allow-origin']).toBe(origin);
    expect(res.headers['access-control-allow-credentials']).toBe('true');
  });

  it('should respond to CORS OPTIONS preflight requests', async () => {
    const origin = config.CORS_ORIGIN.split(',')[0].trim();

    const res = await request(app)
      .options('/api/v1/health')
      .set('Origin', origin)
      .set('Access-Control-Request-Method', 'POST')
      .set('Access-Control-Request-Headers', 'Content-Type,Authorization');

    expect(res.status).toBe(204);
    expect(res.headers['access-control-allow-origin']).toBe(origin);
    expect(res.headers['access-control-allow-methods']).toMatch(/POST/);
    expect(res.headers['access-control-allow-headers']).toMatch(/Content-Type/);
  });

  it('should return 404 JSON for unknown routes', async () => {
    const res = await request(app).get('/api/v1/undefined-endpoint');

    expect(res.status).toBe(404);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.body).toEqual({
      success: false,
      message: 'Route GET /api/v1/undefined-endpoint not found',
    });
  });

  it('should accept and parse JSON bodies up to 10MB', async () => {
    // A 100KB payload well within the 10MB limit
    const largeString = 'a'.repeat(100 * 1024);
    const res = await request(app)
      .post('/api/v1/health')
      .send({ data: largeString });

    // Since /api/v1/health is GET only, POST is intercepted by 404 handler,
    // confirming the body parser passed it along without 413 error
    expect(res.status).toBe(404);
  });

  it('should compress HTTP responses with gzip or deflate (SEO-001 / PRD Section 24.2)', async () => {
    const res = await request(app)
      .get('/api/docs.json')
      .set('Accept-Encoding', 'gzip, deflate');

    expect(res.status).toBe(200);
    expect(res.headers['content-encoding']).toMatch(/gzip|deflate/);
  });
});
