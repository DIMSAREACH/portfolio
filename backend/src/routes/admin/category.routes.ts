import { Router } from 'express';
import categoryController from '../../controllers/admin/category.controller';
import { validate } from '../../middleware/validate.middleware';
import {
  createCategoryValidator,
  updateCategoryValidator,
  categoryIdParamValidator,
} from '../../validators/category.validator';

const router = Router();

/**
 * @route   GET /api/v1/admin/categories
 * @desc    List all categories
 * @access  Private (Admin)
 */
router.get('/', categoryController.getAll);

/**
 * @route   GET /api/v1/admin/categories/:id
 * @desc    Get category by ID
 * @access  Private (Admin)
 */
router.get('/:id', validate(categoryIdParamValidator), categoryController.getById);

/**
 * @route   POST /api/v1/admin/categories
 * @desc    Create category
 * @access  Private (Admin)
 */
router.post('/', validate(createCategoryValidator), categoryController.create);

/**
 * @route   PATCH /api/v1/admin/categories/:id
 * @desc    Update category
 * @access  Private (Admin)
 */
router.patch('/:id', validate(updateCategoryValidator), categoryController.update);

/**
 * @route   DELETE /api/v1/admin/categories/:id
 * @desc    Delete category (if not referenced)
 * @access  Private (Admin)
 */
router.delete('/:id', validate(categoryIdParamValidator), categoryController.delete);

export default router;
