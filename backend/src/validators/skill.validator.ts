import { body, param, ValidationChain } from 'express-validator';

const sanitizeCategory = body('category').customSanitizer((val) => {
  if (typeof val === 'string') {
    try {
      return JSON.parse(val);
    } catch {
      return { en: val, kh: val };
    }
  }
  return val;
});

/**
 * Validation rules for POST /api/v1/admin/skills
 */
export const createSkillValidator: ValidationChain[] = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Skill name is required')
    .isLength({ max: 100 })
    .withMessage('Skill name cannot exceed 100 characters'),

  sanitizeCategory,
  body('category.en')
    .trim()
    .notEmpty()
    .withMessage('English skill category is required')
    .isLength({ max: 100 })
    .withMessage('Category cannot exceed 100 characters'),
  body('category.kh')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 }),

  body('icon')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 200 })
    .withMessage('Icon cannot exceed 200 characters'),

  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a non-negative integer')
    .toInt(),

  body('isVisible')
    .optional()
    .isBoolean()
    .withMessage('isVisible must be a boolean')
    .toBoolean(),
];

/**
 * Validation rules for PATCH /api/v1/admin/skills/:id
 */
export const updateSkillValidator: ValidationChain[] = [
  param('id')
    .isMongoId()
    .withMessage('Invalid skill ID'),

  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Skill name cannot be empty')
    .isLength({ max: 100 }),

  sanitizeCategory,
  body('category.en')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('English skill category cannot be empty')
    .isLength({ max: 100 }),
  body('category.kh')
    .optional()
    .trim()
    .isLength({ max: 100 }),

  body('icon')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 200 }),

  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a non-negative integer')
    .toInt(),

  body('isVisible')
    .optional()
    .isBoolean()
    .withMessage('isVisible must be a boolean')
    .toBoolean(),
];

/**
 * Validation rules for skill ID param
 */
export const skillIdParamValidator: ValidationChain[] = [
  param('id')
    .isMongoId()
    .withMessage('Invalid skill ID'),
];

export default {
  createSkillValidator,
  updateSkillValidator,
  skillIdParamValidator,
};
