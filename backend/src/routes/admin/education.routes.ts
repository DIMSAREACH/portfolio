import { Router } from 'express';
import educationController from '../../controllers/admin/education.controller';
import { validate } from '../../middleware/validate.middleware';
import {
  createEducationValidator,
  updateEducationValidator,
  educationIdParamValidator,
} from '../../validators/education.validator';

const router = Router();

/**
 * @route   GET /api/v1/admin/education
 * @desc    List all education entries (with optional search and pagination)
 * @access  Private (Admin)
 */
router.get('/', educationController.getAll);

/**
 * @route   GET /api/v1/admin/education/:id
 * @desc    Get education entry by ID
 * @access  Private (Admin)
 */
router.get('/:id', validate(educationIdParamValidator), educationController.getById);

/**
 * @route   POST /api/v1/admin/education
 * @desc    Create a new education entry
 * @access  Private (Admin)
 */
router.post('/', validate(createEducationValidator), educationController.create);

/**
 * @route   PATCH /api/v1/admin/education/:id
 * @desc    Update education entry by ID
 * @access  Private (Admin)
 */
router.patch('/:id', validate(updateEducationValidator), educationController.update);

/**
 * @route   DELETE /api/v1/admin/education/:id
 * @desc    Delete education entry by ID
 * @access  Private (Admin)
 */
router.delete('/:id', validate(educationIdParamValidator), educationController.delete);

export default router;
