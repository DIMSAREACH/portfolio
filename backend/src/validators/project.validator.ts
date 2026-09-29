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
 * Validation rules for POST /api/v1/admin/projects
 */
export const createProjectValidator: ValidationChain[] = [
  sanitizeJsonOrString('title'),
  body('title.en')
    .trim()
    .notEmpty()
    .withMessage('English project title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('title.kh')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 200 }),

  sanitizeJsonOrString('shortDescription'),
  body('shortDescription.en')
    .trim()
    .notEmpty()
    .withMessage('English short description is required')
    .isLength({ max: 500 })
    .withMessage('Short description cannot exceed 500 characters'),
  body('shortDescription.kh')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 }),

  sanitizeJsonOrString('fullDescription'),
  body('fullDescription.en')
    .trim()
    .notEmpty()
    .withMessage('English full description is required'),
  body('fullDescription.kh')
    .optional({ checkFalsy: true })
    .trim(),

  sanitizeArray('technologies'),
  body('technologies')
    .isArray({ min: 1 })
    .withMessage('At least one technology is required'),
  body('technologies.*')
    .trim()
    .notEmpty()
    .withMessage('Technology cannot be empty'),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isMongoId()
    .withMessage('Category must be a valid ID'),

  body('status')
    .optional()
    .trim()
    .isIn(['draft', 'published'])
    .withMessage("Status must be either 'draft' or 'published'"),

  body('featured')
    .optional()
    .toBoolean(),

  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a non-negative integer')
    .toInt(),

  body('githubUrl')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('GitHub URL must be a valid URL'),

  body('liveUrl')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('Live URL must be a valid URL'),

  body('videoUrl')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('Video URL must be a valid URL'),

  body('startDate')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Start date must be a valid ISO date'),

  body('completionDate')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Completion date must be a valid ISO date'),

  body('slug')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage('Slug must be URL-friendly (lowercase letters, numbers, and hyphens)'),
];

/**
 * Validation rules for PATCH /api/v1/admin/projects/:id
 */
export const updateProjectValidator: ValidationChain[] = [
  param('id')
    .isMongoId()
    .withMessage('Invalid project ID'),

  sanitizeJsonOrString('title'),
  body('title.en')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('English project title cannot be empty')
    .isLength({ max: 200 }),
  body('title.kh')
    .optional()
    .trim()
    .isLength({ max: 200 }),

  sanitizeJsonOrString('shortDescription'),
  body('shortDescription.en')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('English short description cannot be empty')
    .isLength({ max: 500 }),

  sanitizeJsonOrString('fullDescription'),
  body('fullDescription.en')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('English full description cannot be empty'),

  sanitizeArray('technologies'),
  body('technologies')
    .optional()
    .isArray({ min: 1 })
    .withMessage('Technologies must be a non-empty array'),

  body('category')
    .optional()
    .trim()
    .isMongoId()
    .withMessage('Category must be a valid ID'),

  body('status')
    .optional()
    .trim()
    .isIn(['draft', 'published'])
    .withMessage("Status must be either 'draft' or 'published'"),

  body('featured')
    .optional()
    .toBoolean(),

  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a non-negative integer')
    .toInt(),

  body('githubUrl')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('GitHub URL must be a valid URL'),

  body('liveUrl')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('Live URL must be a valid URL'),

  body('videoUrl')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('Video URL must be a valid URL'),

  body('startDate')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Start date must be a valid ISO date'),

  body('completionDate')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Completion date must be a valid ISO date'),

  body('slug')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage('Slug must be URL-friendly (lowercase letters, numbers, and hyphens)'),
];

/**
 * Validation rules for project ID param
 */
export const projectIdParamValidator: ValidationChain[] = [
  param('id')
    .isMongoId()
    .withMessage('Invalid project ID'),
];

export default {
  createProjectValidator,
  updateProjectValidator,
  projectIdParamValidator,
};
