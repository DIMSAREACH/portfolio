import { body, param, ValidationChain } from 'express-validator';

const sanitizeBilingual = (fieldName: string) =>
  body(fieldName).customSanitizer((val) => {
    if (typeof val === 'string') {
      try {
        return JSON.parse(val);
      } catch {
        return { en: val };
      }
    }
    return val;
  });

const sanitizeBilingualArray = (fieldName: string) =>
  body(fieldName).customSanitizer((val) => {
    if (typeof val === 'string') {
      try {
        return JSON.parse(val);
      } catch {
        return { en: [val] };
      }
    }
    return val;
  });

/**
 * Validation rules for POST /api/v1/admin/education
 */
export const createEducationValidator: ValidationChain[] = [
  sanitizeBilingual('institution'),
  body('institution.en')
    .trim()
    .notEmpty()
    .withMessage('English institution name is required')
    .isLength({ max: 200 })
    .withMessage('Institution name cannot exceed 200 characters'),
  body('institution.kh')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 200 }),

  sanitizeBilingual('degree'),
  body('degree.en')
    .trim()
    .notEmpty()
    .withMessage('English degree is required')
    .isLength({ max: 200 })
    .withMessage('Degree cannot exceed 200 characters'),
  body('degree.kh')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 200 }),

  sanitizeBilingual('field'),
  body('field.en')
    .trim()
    .notEmpty()
    .withMessage('English field of study is required')
    .isLength({ max: 200 })
    .withMessage('Field of study cannot exceed 200 characters'),
  body('field.kh')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 200 }),

  body('startYear')
    .notEmpty()
    .withMessage('Start year is required')
    .isInt({ min: 1950, max: 2100 })
    .withMessage('Start year must be a valid four-digit year')
    .toInt(),

  body('endYear')
    .optional({ checkFalsy: true })
    .isInt({ min: 1950, max: 2100 })
    .withMessage('End year must be a valid four-digit year')
    .toInt(),

  sanitizeBilingual('description'),
  body('description.en')
    .optional({ checkFalsy: true })
    .trim(),
  body('description.kh')
    .optional({ checkFalsy: true })
    .trim(),

  sanitizeBilingualArray('activities'),
  body('activities.en')
    .optional()
    .isArray()
    .withMessage('English activities must be an array'),
  body('activities.kh')
    .optional()
    .isArray()
    .withMessage('Khmer activities must be an array'),

  body('gpa')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 50 })
    .withMessage('GPA string cannot exceed 50 characters'),

  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a non-negative integer')
    .toInt(),
];

/**
 * Validation rules for PATCH /api/v1/admin/education/:id
 */
export const updateEducationValidator: ValidationChain[] = [
  param('id')
    .isMongoId()
    .withMessage('Invalid education ID'),

  sanitizeBilingual('institution'),
  body('institution.en')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('English institution name cannot be empty')
    .isLength({ max: 200 }),
  body('institution.kh')
    .optional()
    .trim()
    .isLength({ max: 200 }),

  sanitizeBilingual('degree'),
  body('degree.en')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('English degree cannot be empty')
    .isLength({ max: 200 }),
  body('degree.kh')
    .optional()
    .trim()
    .isLength({ max: 200 }),

  sanitizeBilingual('field'),
  body('field.en')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('English field of study cannot be empty')
    .isLength({ max: 200 }),
  body('field.kh')
    .optional()
    .trim()
    .isLength({ max: 200 }),

  body('startYear')
    .optional()
    .isInt({ min: 1950, max: 2100 })
    .withMessage('Start year must be a valid four-digit year')
    .toInt(),

  body('endYear')
    .optional({ checkFalsy: true })
    .isInt({ min: 1950, max: 2100 })
    .withMessage('End year must be a valid four-digit year')
    .toInt(),

  sanitizeBilingual('description'),
  body('description.en')
    .optional()
    .trim(),
  body('description.kh')
    .optional()
    .trim(),

  sanitizeBilingualArray('activities'),
  body('activities.en')
    .optional()
    .isArray()
    .withMessage('English activities must be an array'),
  body('activities.kh')
    .optional()
    .isArray()
    .withMessage('Khmer activities must be an array'),

  body('gpa')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 50 }),

  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a non-negative integer')
    .toInt(),
];

/**
 * Validation rules for education ID param
 */
export const educationIdParamValidator: ValidationChain[] = [
  param('id')
    .isMongoId()
    .withMessage('Invalid education ID'),
];

export default {
  createEducationValidator,
  updateEducationValidator,
  educationIdParamValidator,
};
