import { describe, it, expect } from '@jest/globals';
import { loadConfig } from '../../../src/config/environment';

describe('Environment Configuration Module', () => {
  const validMockEnv: NodeJS.ProcessEnv = {
    NODE_ENV: 'test',
    PORT: '4000',
    CORS_ORIGIN: 'http://localhost:4200',
    DATABASE_URL: 'mongodb://localhost:27017/portfolio-test',
    JWT_SECRET: 'test-secret',
    JWT_REFRESH_SECRET: 'test-refresh-secret',
  };

  it('should load typed configuration with valid env vars', () => {
    const config = loadConfig(validMockEnv);

    expect(config.NODE_ENV).toBe('test');
    expect(config.PORT).toBe(4000);
    expect(config.CORS_ORIGIN).toBe('http://localhost:4200');
    expect(config.DATABASE_URL).toBe('mongodb://localhost:27017/portfolio-test');
    expect(config.JWT_SECRET).toBe('test-secret');
    expect(config.JWT_REFRESH_SECRET).toBe('test-refresh-secret');
    expect(config.JWT_ACCESS_EXPIRATION).toBe('15m');
    expect(config.JWT_REFRESH_EXPIRATION).toBe('7d');
    expect(config.RATE_LIMIT_WINDOW_MS).toBe(900000);
    expect(config.RATE_LIMIT_MAX_REQUESTS).toBe(100);
    expect(config.LOG_LEVEL).toBe('debug');
  });

  it('should apply sensible defaults when non-critical env vars are omitted', () => {
    const minimalEnv: NodeJS.ProcessEnv = {
      DATABASE_URL: 'mongodb://localhost:27017/portfolio',
      JWT_SECRET: 'test-secret',
      JWT_REFRESH_SECRET: 'test-refresh-secret',
    };

    const config = loadConfig(minimalEnv);

    expect(config.NODE_ENV).toBe('development');
    expect(config.PORT).toBe(3000);
    expect(config.CORS_ORIGIN).toBe('http://localhost:4200');
    expect(config.RATE_LIMIT_WINDOW_MS).toBe(900000);
    expect(config.RATE_LIMIT_MAX_REQUESTS).toBe(100);
    expect(config.LOG_LEVEL).toBe('debug');
  });

  it('should throw descriptive error when DATABASE_URL is missing', () => {
    const invalidEnv = { ...validMockEnv };
    delete invalidEnv.DATABASE_URL;

    expect(() => loadConfig(invalidEnv)).toThrow(
      'Missing required environment variable(s): DATABASE_URL',
    );
  });

  it('should throw descriptive error when JWT_SECRET is missing', () => {
    const invalidEnv = { ...validMockEnv };
    delete invalidEnv.JWT_SECRET;

    expect(() => loadConfig(invalidEnv)).toThrow(
      'Missing required environment variable(s): JWT_SECRET',
    );
  });

  it('should throw descriptive error when JWT_REFRESH_SECRET is missing', () => {
    const invalidEnv = { ...validMockEnv };
    delete invalidEnv.JWT_REFRESH_SECRET;

    expect(() => loadConfig(invalidEnv)).toThrow(
      'Missing required environment variable(s): JWT_REFRESH_SECRET',
    );
  });
});
