import { Router } from 'express';
import cvController from '../../controllers/admin/cv.controller';
import { uploadPdf } from '../../middleware/upload.middleware';

const router = Router();

/**
 * GET /api/v1/admin/cv
 * Retrieve active CV file info
 */
router.get('/', cvController.getCv);

/**
 * POST /api/v1/admin/cv/upload
 * Upload and activate new CV (PDF file, max 10MB)
 */
router.post('/upload', uploadPdf, cvController.uploadCv);

/**
 * DELETE /api/v1/admin/cv
 * Delete active CV file
 */
router.delete('/', cvController.deleteCv);

export default router;
