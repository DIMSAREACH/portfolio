import { body, param, ValidationChain } from 'express-validator';

const sanitizeJsonOrString = (field: string) =>
  body(field).customSanitizer((val) => {
    if (typeof val === 'string') {
      try {
        return JSON.parse(val);
      } catch {
        return { en: val };
      }
    }
    return val;
  });

const sanitizeArray = (field: string) =>
  body(field).customSanitizer((val) => {
    if (typeof val === 'string') {
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        return val.split(',').map((item) => item.trim()).filter(Boolean);
      }
    }
    return val;
  });

/**
 * Validation rules for POST /api/v1/admin/blog
 */
export const createBlogPostValidator: ValidationChain[] = [
  sanitizeJsonOrString('title'),
  body('title.en')
    .trim()
    .notEmpty()
    .withMessage('English blog title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('title.kh')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 200 }),

  sanitizeJsonOrString('excerpt'),
  body('excerpt.en')
    .trim()
    .notEmpty()
    .withMessage('English excerpt is required')
    .isLength({ max: 500 })
    .withMessage('Excerpt cannot exceed 500 characters'),
  body('excerpt.kh')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 }),

  sanitizeJsonOrString('content'),
  body('content.en')
    .trim()
    .notEmpty()
    .withMessage('English content is required'),
  body('content.kh')
    .optional({ checkFalsy: true })
    .trim(),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isMongoId()
    .withMessage('Category must be a valid ID'),

  sanitizeArray('tags'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),

  body('status')
    .optional()
    .trim()
    .isIn(['draft', 'published'])
    .withMessage("Status must be either 'draft' or 'published'"),

  body('featured')
    .optional()
    .isBoolean()
    .withMessage('featured must be a boolean')
    .toBoolean(),

  body('coverImage')
    .optional({ checkFalsy: true })
    .trim(),

  body('slug')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage('Slug must be URL-friendly (lowercase letters, numbers, and hyphens)'),
];

/**
 * Validation rules for PATCH /api/v1/admin/blog/:id
 */
export const updateBlogPostValidator: ValidationChain[] = [
  param('id')
    .isMongoId()
    .withMessage('Invalid blog post ID'),

  sanitizeJsonOrString('title'),
  body('title.en')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('English blog title cannot be empty')
    .isLength({ max: 200 }),
  body('title.kh')
    .optional()
    .trim()
    .isLength({ max: 200 }),

  sanitizeJsonOrString('excerpt'),
  body('excerpt.en')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('English excerpt cannot be empty')
    .isLength({ max: 500 }),
  body('excerpt.kh')
    .optional()
    .trim()
    .isLength({ max: 500 }),

  sanitizeJsonOrString('content'),
  body('content.en')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('English content cannot be empty'),
  body('content.kh')
    .optional()
    .trim(),

  body('category')
    .optional()
    .trim()
    .isMongoId()
    .withMessage('Category must be a valid ID'),

  sanitizeArray('tags'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),

  body('status')
    .optional()
    .trim()
    .isIn(['draft', 'published'])
    .withMessage("Status must be either 'draft' or 'published'"),

  body('featured')
    .optional()
    .isBoolean()
    .withMessage('featured must be a boolean')
    .toBoolean(),

  body('coverImage')
    .optional({ checkFalsy: true })
    .trim(),

  body('slug')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage('Slug must be URL-friendly (lowercase letters, numbers, and hyphens)'),
];

/**
 * Validation rules for blog post ID param
 */
export const blogPostIdParamValidator: ValidationChain[] = [
  param('id')
    .isMongoId()
    .withMessage('Invalid blog post ID'),
];

export default {
  createBlogPostValidator,
  updateBlogPostValidator,
  blogPostIdParamValidator,
};
