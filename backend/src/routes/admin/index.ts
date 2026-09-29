import { Router, Request, Response } from 'express';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import categoryRoutes from './category.routes';
import projectRoutes from './project.routes';
import skillRoutes from './skill.routes';
import experienceRoutes from './experience.routes';
import educationRoutes from './education.routes';

const router = Router();

// All admin routes require authentication and admin authorization
router.use(authenticate, authorize('admin'));

/**
 * Admin API status / root
 * GET /api/v1/admin
 */
router.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Admin API root',
  });
});

// Admin resource mounting points (Phase 4):
router.use('/categories', categoryRoutes);       // API-004
router.use('/projects', projectRoutes);           // API-005
router.use('/skills', skillRoutes);               // API-006
router.use('/experiences', experienceRoutes);     // API-007
router.use('/education', educationRoutes);         // API-008
// router.use('/certifications', certRoutes);        // API-009
// router.use('/blog', blogRoutes);                   // API-010
// router.use('/messages', messageRoutes);           // API-011
// router.use('/profile', profileRoutes);             // API-012
// router.use('/social-links', socialLinkRoutes);     // API-013
// router.use('/settings', settingsRoutes);           // API-014
// router.use('/stats', statsRoutes);                 // API-015
// router.use('/media', mediaRoutes);                 // API-016

export default router;
