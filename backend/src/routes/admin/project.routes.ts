import { Router } from 'express';
import projectController from '../../controllers/admin/project.controller';
import { validate } from '../../middleware/validate.middleware';
import { uploadProjectImages } from '../../middleware/upload.middleware';
import {
  createProjectValidator,
  updateProjectValidator,
  projectIdParamValidator,
} from '../../validators/project.validator';

const router = Router();

/**
 * @route   GET /api/v1/admin/projects
 * @desc    List all projects (with filtering, pagination, text search)
 * @access  Private (Admin)
 */
router.get('/', projectController.getAll);

/**
 * @route   GET /api/v1/admin/projects/:id
 * @desc    Get project by ID
 * @access  Private (Admin)
 */
router.get('/:id', validate(projectIdParamValidator), projectController.getById);

/**
 * @route   POST /api/v1/admin/projects
 * @desc    Create a new project with optional images
 * @access  Private (Admin)
 */
router.post(
  '/',
  uploadProjectImages,
  validate(createProjectValidator),
  projectController.create,
);

/**
 * @route   PATCH /api/v1/admin/projects/:id
 * @desc    Update project by ID with optional new images
 * @access  Private (Admin)
 */
router.patch(
  '/:id',
  uploadProjectImages,
  validate(updateProjectValidator),
  projectController.update,
);

/**
 * @route   DELETE /api/v1/admin/projects/:id
 * @desc    Delete project and clean up Cloudinary images
 * @access  Private (Admin)
 */
router.delete('/:id', validate(projectIdParamValidator), projectController.delete);

export default router;
