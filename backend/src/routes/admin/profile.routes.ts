import { Router } from 'express';
import profileController from '../../controllers/admin/profile.controller';
import { uploadProfileImages } from '../../middleware/upload.middleware';
import { validate } from '../../middleware/validate.middleware';
import { upsertProfileValidator } from '../../validators/profile.validator';

const router = Router();

/**
 * GET /api/v1/admin/profile
 * Retrieve current profile
 */
router.get('/', profileController.getProfile);

/**
 * PUT /api/v1/admin/profile
 * Create or update (upsert) current profile with optional image uploads
 */
router.put(
  '/',
  uploadProfileImages,
  validate(upsertProfileValidator),
  profileController.upsertProfile,
);

export default router;
