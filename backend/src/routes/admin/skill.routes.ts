import { Router } from 'express';
import skillController from '../../controllers/admin/skill.controller';
import { validate } from '../../middleware/validate.middleware';
import {
  createSkillValidator,
  updateSkillValidator,
  skillIdParamValidator,
} from '../../validators/skill.validator';

const router = Router();

/**
 * @route   GET /api/v1/admin/skills
 * @desc    List all skills (with optional filtering)
 * @access  Private (Admin)
 */
router.get('/', skillController.getAll);

/**
 * @route   GET /api/v1/admin/skills/:id
 * @desc    Get skill by ID
 * @access  Private (Admin)
 */
router.get('/:id', validate(skillIdParamValidator), skillController.getById);

/**
 * @route   POST /api/v1/admin/skills
 * @desc    Create a new skill
 * @access  Private (Admin)
 */
router.post('/', validate(createSkillValidator), skillController.create);

/**
 * @route   PATCH /api/v1/admin/skills/:id
 * @desc    Update skill by ID
 * @access  Private (Admin)
 */
router.patch('/:id', validate(updateSkillValidator), skillController.update);

/**
 * @route   DELETE /api/v1/admin/skills/:id
 * @desc    Delete skill by ID
 * @access  Private (Admin)
 */
router.delete('/:id', validate(skillIdParamValidator), skillController.delete);

export default router;
