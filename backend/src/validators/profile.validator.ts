import { body, ValidationChain } from 'express-validator';

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
        return { en: [val], kh: [] };
      }
    }
    return val;
  });

/**
 * Validation rules for PUT /api/v1/admin/profile (upsert)
 */
export const upsertProfileValidator: ValidationChain[] = [
  sanitizeBilingual('fullName'),
  body('fullName.en')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('English full name cannot be empty')
    .isLength({ max: 100 }),
  body('fullName.kh')
    .optional()
    .trim()
    .isLength({ max: 100 }),

  sanitizeBilingual('title'),
  body('title.en')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('English title cannot be empty')
    .isLength({ max: 150 }),
  body('title.kh')
    .optional()
    .trim()
    .isLength({ max: 150 }),

  sanitizeBilingual('introduction'),
  body('introduction.en')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('English introduction cannot be empty')
    .isLength({ max: 500 }),
  body('introduction.kh')
    .optional()
    .trim()
    .isLength({ max: 500 }),

  sanitizeBilingual('about'),
  body('about.en')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('English about section cannot be empty'),
  body('about.kh')
    .optional()
    .trim(),

  sanitizeBilingual('professionalSummary'),
  body('professionalSummary.en').optional().trim(),
  body('professionalSummary.kh').optional().trim(),

  sanitizeBilingual('careerInterests'),
  body('careerInterests.en').optional().trim(),
  body('careerInterests.kh').optional().trim(),

  sanitizeBilingual('background'),
  body('background.en').optional().trim(),
  body('background.kh').optional().trim(),

  sanitizeBilingualArray('strengths'),
  body('strengths.en').optional().isArray().withMessage('strengths.en must be an array of strings'),
  body('strengths.kh').optional().isArray().withMessage('strengths.kh must be an array of strings'),

  sanitizeBilingual('goals'),
  body('goals.en').optional().trim(),
  body('goals.kh').optional().trim(),

  sanitizeBilingual('location'),
  body('location.en').optional().trim(),
  body('location.kh').optional().trim(),

  body('email')
    .optional({ checkFalsy: true })
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address'),

  body('phone')
    .optional({ checkFalsy: true })
    .trim(),

  body('profileImage')
    .optional({ checkFalsy: true })
    .trim(),

  body('aboutImage')
    .optional({ checkFalsy: true })
    .trim(),
];

export default {
  upsertProfileValidator,
};
