import { Router, Request, Response } from 'express';

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

// Future Route Mounting Points:
// router.use('/auth', authRoutes);      // Phase 3 — Authentication & Authorization
// router.use('/', publicRoutes);         // Phase 5 — Public API (Portfolio, Blog, Contact)
// router.use('/admin', adminRoutes);     // Phase 4 — Admin API (Content Management)

export default router;
