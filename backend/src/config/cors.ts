import { CorsOptions } from 'cors';
import config from './environment';
import { isOriginAllowed } from '../utils/sanitize';

/**
 * CORS configuration matching PRD Section 18.3
 * Whitelists configured frontend origin(s) and enables credentials for cookies
 */
export const corsOptions: CorsOptions = {
  origin: (requestOrigin, callback) => {
    // Allow non-browser requests (mobile apps, curl, server-to-server)
    if (!requestOrigin) {
      return callback(null, true);
    }

    if (isOriginAllowed(requestOrigin, config.CORS_ORIGIN, config.NODE_ENV === 'production')) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${requestOrigin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Cache-Control',
    'Pragma',
    'Expires',
  ],
  exposedHeaders: ['RateLimit-Limit', 'RateLimit-Remaining', 'RateLimit-Reset'],
  maxAge: 86400, // 24 hours preflight cache
};

export default corsOptions;
