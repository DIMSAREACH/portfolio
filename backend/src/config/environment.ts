import dotenv from 'dotenv';
dotenv.config();

export interface Config {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  CORS_ORIGIN: string;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_ACCESS_EXPIRATION: string;
  JWT_REFRESH_EXPIRATION: string;
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  EMAIL_HOST: string;
  EMAIL_PORT: number;
  EMAIL_USER: string;
  EMAIL_PASS: string;
  EMAIL_FROM: string;
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX_REQUESTS: number;
  LOG_LEVEL: string;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const missingVars: string[] = [];

  const databaseUrl = env.DATABASE_URL;
  const jwtSecret = env.JWT_SECRET;
  const jwtRefreshSecret = env.JWT_REFRESH_SECRET;

  if (!databaseUrl) {
    missingVars.push('DATABASE_URL');
  }
  if (!jwtSecret) {
    missingVars.push('JWT_SECRET');
  }
  if (!jwtRefreshSecret) {
    missingVars.push('JWT_REFRESH_SECRET');
  }

  if (missingVars.length > 0 || !databaseUrl || !jwtSecret || !jwtRefreshSecret) {
    throw new Error(
      `Missing required environment variable(s): ${missingVars.join(', ')}. Please check your .env file.`,
    );
  }

  return {
    NODE_ENV: (env.NODE_ENV as Config['NODE_ENV']) || 'development',
    PORT: env.PORT ? parseInt(env.PORT, 10) : 3000,
    CORS_ORIGIN: env.CORS_ORIGIN || 'http://localhost:4200',
    DATABASE_URL: databaseUrl,
    JWT_SECRET: jwtSecret,
    JWT_REFRESH_SECRET: jwtRefreshSecret,
    JWT_ACCESS_EXPIRATION: env.JWT_ACCESS_EXPIRATION || '15m',
    JWT_REFRESH_EXPIRATION: env.JWT_REFRESH_EXPIRATION || '7d',
    CLOUDINARY_CLOUD_NAME: env.CLOUDINARY_CLOUD_NAME || '',
    CLOUDINARY_API_KEY: env.CLOUDINARY_API_KEY || '',
    CLOUDINARY_API_SECRET: env.CLOUDINARY_API_SECRET || '',
    EMAIL_HOST: env.EMAIL_HOST || '',
    EMAIL_PORT: env.EMAIL_PORT ? parseInt(env.EMAIL_PORT, 10) : 587,
    EMAIL_USER: env.EMAIL_USER || '',
    EMAIL_PASS: env.EMAIL_PASS || '',
    EMAIL_FROM: env.EMAIL_FROM || '"Portfolio" <no-reply@portfolio.example.com>',
    RATE_LIMIT_WINDOW_MS: env.RATE_LIMIT_WINDOW_MS
      ? parseInt(env.RATE_LIMIT_WINDOW_MS, 10)
      : 900000,
    RATE_LIMIT_MAX_REQUESTS: env.RATE_LIMIT_MAX_REQUESTS
      ? parseInt(env.RATE_LIMIT_MAX_REQUESTS, 10)
      : 100,
    LOG_LEVEL: env.LOG_LEVEL || 'debug',
  };
}

export const config: Config = loadConfig();
export default config;
