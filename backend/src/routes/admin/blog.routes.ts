import { Router } from 'express';
import blogController from '../../controllers/admin/blog.controller';
import { validate } from '../../middleware/validate.middleware';
import { uploadSingleImage } from '../../middleware/upload.middleware';
import {
  createBlogPostValidator,
  updateBlogPostValidator,
  blogPostIdParamValidator,
} from '../../validators/blog.validator';

const router = Router();

/**
 * @route   GET /api/v1/admin/blog
 * @desc    List all blog posts (including drafts, with pagination)
 * @access  Private (Admin)
 */
router.get('/', blogController.getAll);

/**
 * @route   GET /api/v1/admin/blog/:id
 * @desc    Get blog post by ID
 * @access  Private (Admin)
 */
router.get('/:id', validate(blogPostIdParamValidator), blogController.getById);

/**
 * @route   POST /api/v1/admin/blog
 * @desc    Create a new blog post
 * @access  Private (Admin)
 */
router.post(
  '/',
  uploadSingleImage,
  validate(createBlogPostValidator),
  blogController.create,
);

/**
 * @route   PATCH /api/v1/admin/blog/:id
 * @desc    Update blog post by ID
 * @access  Private (Admin)
 */
router.patch(
  '/:id',
  uploadSingleImage,
  validate(updateBlogPostValidator),
  blogController.update,
);

/**
 * @route   DELETE /api/v1/admin/blog/:id
 * @desc    Delete blog post by ID
 * @access  Private (Admin)
 */
router.delete('/:id', validate(blogPostIdParamValidator), blogController.delete);

/**
 * @route   PATCH /api/v1/admin/blog/:id/publish
 * @desc    Publish blog post
 * @access  Private (Admin)
 */
router.patch('/:id/publish', validate(blogPostIdParamValidator), blogController.publish);

/**
 * @route   PATCH /api/v1/admin/blog/:id/unpublish
 * @desc    Unpublish blog post
 * @access  Private (Admin)
 */
router.patch('/:id/unpublish', validate(blogPostIdParamValidator), blogController.unpublish);

export default router;
