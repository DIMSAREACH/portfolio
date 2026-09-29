import { body, param, ValidationChain } from 'express-validator';

const VALID_CATEGORY_TYPES = ['project', 'blog', 'both'];

/**
 * Validation rules for POST /api/v1/admin/categories
 */
export const createCategoryValidator: ValidationChain[] = [
  body('name.en')
    .trim()
    .notEmpty()
    .withMessage('English category name is required')
    .isLength({ max: 100 })
    .withMessage('Category name cannot exceed 100 characters'),
  body('name.kh')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage('Khmer category name cannot exceed 100 characters'),
  body('type')
    .trim()
    .notEmpty()
    .withMessage('Category type is required')
    .isIn(VALID_CATEGORY_TYPES)
    .withMessage(`Category type must be one of: ${VALID_CATEGORY_TYPES.join(', ')}`),
  body('description.en')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('description.kh')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage('Khmer description cannot exceed 500 characters'),
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a non-negative integer')
    .toInt(),
  body('slug')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage('Slug must be URL-friendly (lowercase letters, numbers, and hyphens)'),
];

/**
 * Validation rules for PATCH /api/v1/admin/categories/:id
 */
export const updateCategoryValidator: ValidationChain[] = [
  param('id')
    .isMongoId()
    .withMessage('Invalid category ID'),
  body('name.en')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('English category name cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Category name cannot exceed 100 characters'),
  body('name.kh')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Khmer category name cannot exceed 100 characters'),
  body('type')
    .optional()
    .trim()
    .isIn(VALID_CATEGORY_TYPES)
    .withMessage(`Category type must be one of: ${VALID_CATEGORY_TYPES.join(', ')}`),
  body('description.en')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('description.kh')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Khmer description cannot exceed 500 characters'),
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a non-negative integer')
    .toInt(),
  body('slug')
    .optional()
    .trim()
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage('Slug must be URL-friendly (lowercase letters, numbers, and hyphens)'),
];

/**
 * Validation rules for endpoints taking category :id in params
 */
export const categoryIdParamValidator: ValidationChain[] = [
  param('id')
    .isMongoId()
    .withMessage('Invalid category ID'),
];

export default {
  createCategoryValidator,
  updateCategoryValidator,
  categoryIdParamValidator,
};
