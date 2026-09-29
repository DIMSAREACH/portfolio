import { body, param, ValidationChain } from 'express-validator';

const sanitizeBilingual = (field: string) =>
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

const sanitizeBilingualArray = (field: string) =>
  body(field).customSanitizer((val) => {
    if (typeof val === 'string') {
      try {
        return JSON.parse(val);
      } catch {
        return { en: [val] };
      }
    }
    return val;
  });

const validTypes = ['work', 'volunteer', 'internship', 'freelance'];

/**
 * Validation rules for POST /api/v1/admin/experiences
 */
export const createExperienceValidator: ValidationChain[] = [
  sanitizeBilingual('title'),
  body('title.en')
    .trim()
    .notEmpty()
    .withMessage('English job/role title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('title.kh')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 200 }),

  sanitizeBilingual('organization'),
  body('organization.en')
    .trim()
    .notEmpty()
    .withMessage('English organization is required')
    .isLength({ max: 200 })
    .withMessage('Organization cannot exceed 200 characters'),
  body('organization.kh')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 200 }),

  sanitizeBilingual('location'),
  body('location.en')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 200 }),
  body('location.kh')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 200 }),

  body('type')
    .trim()
    .notEmpty()
    .withMessage('Experience type is required')
    .isIn(validTypes)
    .withMessage(`Type must be one of: ${validTypes.join(', ')}`),

  body('startDate')
    .notEmpty()
    .withMessage('Start date is required')
    .isISO8601()
    .withMessage('Start date must be a valid ISO8601 date'),

  body('endDate')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('End date must be a valid ISO8601 date'),

  body('isCurrent')
    .optional()
    .isBoolean()
    .withMessage('isCurrent must be a boolean')
    .toBoolean(),

  sanitizeBilingual('description'),
  body('description.en')
    .optional({ checkFalsy: true })
    .trim(),
  body('description.kh')
    .optional({ checkFalsy: true })
    .trim(),

  sanitizeBilingualArray('responsibilities'),
  body('responsibilities.en')
    .optional()
    .isArray()
    .withMessage('English responsibilities must be an array'),
  body('responsibilities.kh')
    .optional()
    .isArray()
    .withMessage('Khmer responsibilities must be an array'),

  sanitizeArray('technologies'),
  body('technologies')
    .optional()
    .isArray()
    .withMessage('Technologies must be an array'),

  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a non-negative integer')
    .toInt(),
];

/**
 * Validation rules for PATCH /api/v1/admin/experiences/:id
 */
export const updateExperienceValidator: ValidationChain[] = [
  param('id')
    .isMongoId()
    .withMessage('Invalid experience ID'),

  sanitizeBilingual('title'),
  body('title.en')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('English job/role title cannot be empty')
    .isLength({ max: 200 }),
  body('title.kh')
    .optional()
    .trim()
    .isLength({ max: 200 }),

  sanitizeBilingual('organization'),
  body('organization.en')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('English organization cannot be empty')
    .isLength({ max: 200 }),
  body('organization.kh')
    .optional()
    .trim()
    .isLength({ max: 200 }),

  sanitizeBilingual('location'),
  body('location.en')
    .optional()
    .trim()
    .isLength({ max: 200 }),
  body('location.kh')
    .optional()
    .trim()
    .isLength({ max: 200 }),

  body('type')
    .optional()
    .trim()
    .isIn(validTypes)
    .withMessage(`Type must be one of: ${validTypes.join(', ')}`),

  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO8601 date'),

  body('endDate')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('End date must be a valid ISO8601 date'),

  body('isCurrent')
    .optional()
    .isBoolean()
    .withMessage('isCurrent must be a boolean')
    .toBoolean(),

  sanitizeBilingual('description'),
  body('description.en')
    .optional()
    .trim(),
  body('description.kh')
    .optional()
    .trim(),

  sanitizeBilingualArray('responsibilities'),
  body('responsibilities.en')
    .optional()
    .isArray()
    .withMessage('English responsibilities must be an array'),
  body('responsibilities.kh')
    .optional()
    .isArray()
    .withMessage('Khmer responsibilities must be an array'),

  sanitizeArray('technologies'),
  body('technologies')
    .optional()
    .isArray()
    .withMessage('Technologies must be an array'),

  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a non-negative integer')
    .toInt(),
];

/**
 * Validation rules for experience ID param
 */
export const experienceIdParamValidator: ValidationChain[] = [
  param('id')
    .isMongoId()
    .withMessage('Invalid experience ID'),
];

export default {
  createExperienceValidator,
  updateExperienceValidator,
  experienceIdParamValidator,
};
