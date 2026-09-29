import { Router, Request, Response } from 'express';

import authRoutes from './auth.routes';
import adminRoutes from './admin';

const router = Router();

/**
 * Health check endpoint
 * GET /api/v1/health
 */
router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// Authentication & Authorization routes (Phase 3)
router.use('/auth', authRoutes);

// Core Admin API routes (Phase 4)
router.use('/admin', adminRoutes);

// Future Route Mounting Points:
// router.use('/', publicRoutes);         // Phase 5 — Public API (Portfolio, Blog, Contact)

export default router;
