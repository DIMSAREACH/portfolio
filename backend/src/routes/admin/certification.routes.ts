import { Router } from 'express';
import certificationController from '../../controllers/admin/certification.controller';
import { validate } from '../../middleware/validate.middleware';
import { uploadSingleImage } from '../../middleware/upload.middleware';
import {
  createCertificationValidator,
  updateCertificationValidator,
  certificationIdParamValidator,
} from '../../validators/certification.validator';

const router = Router();

/**
 * @route   GET /api/v1/admin/certifications
 * @desc    List all certifications
 * @access  Private (Admin)
 */
router.get('/', certificationController.getAll);

/**
 * @route   GET /api/v1/admin/certifications/:id
 * @desc    Get certification by ID
 * @access  Private (Admin)
 */
router.get('/:id', validate(certificationIdParamValidator), certificationController.getById);

/**
 * @route   POST /api/v1/admin/certifications
 * @desc    Create a new certification
 * @access  Private (Admin)
 */
router.post(
  '/',
  uploadSingleImage,
  validate(createCertificationValidator),
  certificationController.create,
);

/**
 * @route   PATCH /api/v1/admin/certifications/:id
 * @desc    Update certification by ID
 * @access  Private (Admin)
 */
router.patch(
  '/:id',
  uploadSingleImage,
  validate(updateCertificationValidator),
  certificationController.update,
);

/**
 * @route   DELETE /api/v1/admin/certifications/:id
 * @desc    Delete certification by ID
 * @access  Private (Admin)
 */
router.delete('/:id', validate(certificationIdParamValidator), certificationController.delete);

export default router;
