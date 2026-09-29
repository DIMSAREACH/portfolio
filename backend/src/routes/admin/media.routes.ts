import { Router } from 'express';
import mediaController from '../../controllers/admin/media.controller';
import { uploadMediaFile } from '../../middleware/upload.middleware';
import { validate } from '../../middleware/validate.middleware';
import {
  mediaIdParamValidator,
  listMediaValidator,
} from '../../validators/media.validator';

const router = Router();

/**
 * GET /api/v1/admin/media
 * List media files with pagination and filtering
 */
router.get('/', validate(listMediaValidator), mediaController.getAll);

/**
 * POST /api/v1/admin/media/upload
 * Upload media image file to Cloudinary and database
 */
router.post('/upload', uploadMediaFile, mediaController.upload);

/**
 * GET /api/v1/admin/media/:id
 * Retrieve a single media item
 */
router.get('/:id', validate(mediaIdParamValidator), mediaController.getById);

/**
 * DELETE /api/v1/admin/media/:id
 * Delete media file from Cloudinary and database
 */
router.delete('/:id', validate(mediaIdParamValidator), mediaController.delete);

export default router;
