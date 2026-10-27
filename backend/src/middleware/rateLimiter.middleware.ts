import { Request, Response, NextFunction } from 'express';
import rateLimit, { Options } from 'express-rate-limit';
import config from '../config/environment';

export interface RateLimitResponseBody {
  success: false;
  message: string;
}

/**
 * Standard JSON response handler for rate limited requests.
 */
const rateLimitHandler = (
  _req: Request,
  res: Response,
  _next: NextFunction,
  options: Options,
): void => {
  const message =
    typeof options.message === 'string'
      ? options.message
      : (options.message as { message?: string })?.message ||
        'Too many requests, please try again later.';

  res.status(options.statusCode).json({
    success: false,
    message,
  });
};

/**
 * Factory function to create custom rate limiters with unified options and JSON error response.
 */
export const createRateLimiter = (options: Partial<Options> = {}) => {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    statusCode: 429,
    handler: rateLimitHandler,
    ...options,
  });
};

/**
 * Global API rate limiter.
 * Default: 100 requests per 15 minutes per IP (configurable via env).
 */
export const globalLimiter = createRateLimiter({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX_REQUESTS,
  message: 'Too many requests, please try again later.',
  skip: () => config.NODE_ENV === 'test' || config.NODE_ENV === 'development',
});

/**
 * Strict rate limiter for authentication endpoints (login, register).
 * Limit: 5 requests per 15 minutes per IP to prevent brute force attacks in production.
 */
export const loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts, please try again after 15 minutes.',
  skip: () => config.NODE_ENV === 'development',
});

/**
 * Rate limiter for public contact form / messaging endpoints.
 * Limit: 5 requests per hour per IP to prevent spam in production.
 */
export const contactLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: 'Too many contact requests from this IP, please try again after an hour.',
  skip: () => config.NODE_ENV === 'development',
});

/**
 * Strict rate limiter for forgot password requests.
 * Limit: 5 requests per 15 minutes per IP.
 */
export const forgotPasswordLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many password reset requests, please try again after 15 minutes.',
  skip: () => config.NODE_ENV === 'development',
});

/**
 * Strict rate limiter for reset password verification/updates.
 * Limit: 5 requests per 15 minutes per IP.
 */
export const resetPasswordLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many password reset attempts, please try again after 15 minutes.',
  skip: () => config.NODE_ENV === 'development',
});

export const passwordResetLimiter = resetPasswordLimiter;

export default {
  createRateLimiter,
  globalLimiter,
  loginLimiter,
  contactLimiter,
  forgotPasswordLimiter,
  resetPasswordLimiter,
  passwordResetLimiter,
};
