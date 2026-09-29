import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { loginLimiter } from '../middleware/rateLimiter.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  loginValidator,
  changePasswordValidator,
} from '../validators/auth.validator';

const router = Router();

/**
 * @route   POST /api/v1/auth/login
 * @desc    Authenticate user and get access token + refresh token cookie
 * @access  Public (Rate limited: 5 req/15min)
 */
router.post(
  '/login',
  loginLimiter,
  validate(loginValidator),
  authController.login,
);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Clear refresh token cookie
 * @access  Public
 */
router.post('/logout', authController.logout);

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Refresh access token using HTTP-only cookie
 * @access  Public (Cookie required)
 */
router.post('/refresh', authController.refresh);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current authenticated user profile
 * @access  Private (JWT Bearer token required)
 */
router.get('/me', authenticate, authController.me);

/**
 * @route   PATCH /api/v1/auth/change-password
 * @desc    Change current user's password
 * @access  Private (JWT Bearer token required)
 */
router.patch(
  '/change-password',
  authenticate,
  validate(changePasswordValidator),
  authController.changePassword,
);

export default router;
