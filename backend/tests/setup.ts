import dotenv from 'dotenv';

// Ensure test environment variables are initialized
process.env.NODE_ENV = 'test';
process.env.PORT = '5001';
process.env.DATABASE_URL = 'mongodb://localhost:27017/portfolio_test';
process.env.JWT_SECRET = 'test-jwt-secret-key-at-least-32-chars-long';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key-at-least-32-chars-long';
process.env.JWT_EXPIRES_IN = '15m';
process.env.JWT_REFRESH_EXPIRES_IN = '7d';
process.env.CORS_ORIGIN = 'http://localhost:4200';
process.env.RATE_LIMIT_WINDOW_MS = '900000';
process.env.RATE_LIMIT_MAX = '100';

dotenv.config();

// Suppress Winston/Morgan noise during test runs unless DEBUG is set
if (!process.env.DEBUG) {
  jest.spyOn(console, 'info').mockImplementation(() => {});
}
