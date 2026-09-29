import { Router, Request, Response } from 'express';

import authRoutes from './auth.routes';
import adminRoutes from './admin';

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: System health check
 *     description: Returns the health status and current server timestamp.
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is running normally
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
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
