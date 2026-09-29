import { Router } from 'express';
import experienceController from '../../controllers/admin/experience.controller';
import { validate } from '../../middleware/validate.middleware';
import {
  createExperienceValidator,
  updateExperienceValidator,
  experienceIdParamValidator,
} from '../../validators/experience.validator';

const router = Router();

/**
 * @route   GET /api/v1/admin/experiences
 * @desc    List all experiences (with optional filtering)
 * @access  Private (Admin)
 */
router.get('/', experienceController.getAll);

/**
 * @route   GET /api/v1/admin/experiences/:id
 * @desc    Get experience by ID
 * @access  Private (Admin)
 */
router.get('/:id', validate(experienceIdParamValidator), experienceController.getById);

/**
 * @route   POST /api/v1/admin/experiences
 * @desc    Create a new experience
 * @access  Private (Admin)
 */
router.post('/', validate(createExperienceValidator), experienceController.create);

/**
 * @route   PATCH /api/v1/admin/experiences/:id
 * @desc    Update experience by ID
 * @access  Private (Admin)
 */
router.patch('/:id', validate(updateExperienceValidator), experienceController.update);

/**
 * @route   DELETE /api/v1/admin/experiences/:id
 * @desc    Delete experience by ID
 * @access  Private (Admin)
 */
router.delete('/:id', validate(experienceIdParamValidator), experienceController.delete);

export default router;
