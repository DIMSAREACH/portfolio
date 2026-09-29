import { CorsOptions } from 'cors';
import config from './environment';

/**
 * CORS configuration matching PRD Section 18.3
 * Whitelists configured frontend origin(s) and enables credentials for cookies
 */
export const corsOptions: CorsOptions = {
  origin: config.CORS_ORIGIN.includes(',')
    ? config.CORS_ORIGIN.split(',').map((s) => s.trim())
    : config.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['RateLimit-Limit', 'RateLimit-Remaining', 'RateLimit-Reset'],
  maxAge: 86400, // 24 hours preflight cache
};

export default corsOptions;
