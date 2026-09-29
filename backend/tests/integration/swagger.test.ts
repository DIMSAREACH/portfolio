import request from 'supertest';
import { describe, it, expect } from '@jest/globals';
import app from '../../src/app';
import swaggerSpec from '../../src/config/swagger';

describe('Swagger / OpenAPI Documentation Tests', () => {
  describe('GET /api/docs.json', () => {
    it('should return 200 and OpenAPI 3.0 specification JSON', async () => {
      const res = await request(app).get('/api/docs.json');

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch(/json/);
      expect(res.body.openapi).toBe('3.0.0');
      expect(res.body.info.title).toBe('Developer Portfolio & Content Management API');
      expect(res.body.components.securitySchemes.bearerAuth).toBeDefined();
    });

    it('should include parsed route endpoints in Swagger spec', async () => {
      const spec = swaggerSpec as Record<string, any>;
      expect(spec.paths).toBeDefined();
      expect(spec.paths['/health']).toBeDefined();
      expect(spec.paths['/auth/login']).toBeDefined();
      expect(spec.paths['/auth/me']).toBeDefined();
    });
  });

  describe('GET /api/docs/', () => {
    it('should return HTML for Swagger UI', async () => {
      const res = await request(app).get('/api/docs/');

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch(/html/);
      expect(res.text).toContain('swagger-ui');
    });

    it('should redirect /api/docs to /api/docs/ with trailing slash', async () => {
      const res = await request(app).get('/api/docs');

      expect([200, 301, 302]).toContain(res.status);
    });
  });
});
