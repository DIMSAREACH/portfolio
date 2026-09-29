import { Router } from 'express';
import dashboardController from '../../controllers/admin/dashboard.controller';

const router = Router();

/**
 * GET /api/v1/admin/dashboard/stats
 * Retrieve dashboard counts across all entities
 */
router.get('/stats', dashboardController.getStats);

/**
 * GET /api/v1/admin/dashboard/
 * Retrieve dashboard counts
 */
router.get('/', dashboardController.getStats);

export default router;
