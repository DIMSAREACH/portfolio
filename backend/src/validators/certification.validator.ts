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

const validTypes = ['certification', 'award', 'achievement'];

/**
 * Validation rules for POST /api/v1/admin/certifications
 */
export const createCertificationValidator: ValidationChain[] = [
  sanitizeBilingual('name'),
  body('name.en')
    .trim()
    .notEmpty()
    .withMessage('English certification/award name is required')
    .isLength({ max: 200 })
    .withMessage('Name cannot exceed 200 characters'),
  body('name.kh')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 200 }),

  body('type')
    .trim()
    .notEmpty()
    .withMessage('Certification type is required')
    .isIn(validTypes)
    .withMessage(`Type must be one of: ${validTypes.join(', ')}`),

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

  body('issueDate')
    .notEmpty()
    .withMessage('Issue date is required')
    .isISO8601()
    .withMessage('Issue date must be a valid ISO8601 date'),

  body('expirationDate')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Expiration date must be a valid ISO8601 date'),

  body('credentialId')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 200 }),

  body('credentialUrl')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('Credential URL must be a valid URL'),

  body('image')
    .optional({ checkFalsy: true })
    .trim(),

  sanitizeBilingual('description'),
  body('description.en')
    .optional({ checkFalsy: true })
    .trim(),
  body('description.kh')
    .optional({ checkFalsy: true })
    .trim(),

  body('isVisible')
    .optional()
    .isBoolean()
    .withMessage('isVisible must be a boolean')
    .toBoolean(),

  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a non-negative integer')
    .toInt(),
];

/**
 * Validation rules for PATCH /api/v1/admin/certifications/:id
 */
export const updateCertificationValidator: ValidationChain[] = [
  param('id')
    .isMongoId()
    .withMessage('Invalid certification ID'),

  sanitizeBilingual('name'),
  body('name.en')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('English certification/award name cannot be empty')
    .isLength({ max: 200 }),
  body('name.kh')
    .optional()
    .trim()
    .isLength({ max: 200 }),

  body('type')
    .optional()
    .trim()
    .isIn(validTypes)
    .withMessage(`Type must be one of: ${validTypes.join(', ')}`),

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

  body('issueDate')
    .optional()
    .isISO8601()
    .withMessage('Issue date must be a valid ISO8601 date'),

  body('expirationDate')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Expiration date must be a valid ISO8601 date'),

  body('credentialId')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 200 }),

  body('credentialUrl')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('Credential URL must be a valid URL'),

  body('image')
    .optional({ checkFalsy: true })
    .trim(),

  sanitizeBilingual('description'),
  body('description.en')
    .optional()
    .trim(),
  body('description.kh')
    .optional()
    .trim(),

  body('isVisible')
    .optional()
    .isBoolean()
    .withMessage('isVisible must be a boolean')
    .toBoolean(),

  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a non-negative integer')
    .toInt(),
];

/**
 * Validation rules for certification ID param
 */
export const certificationIdParamValidator: ValidationChain[] = [
  param('id')
    .isMongoId()
    .withMessage('Invalid certification ID'),
];

export default {
  createCertificationValidator,
  updateCertificationValidator,
  certificationIdParamValidator,
};
