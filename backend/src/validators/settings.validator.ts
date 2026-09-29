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

/**
 * Validation rules for PUT /api/v1/admin/settings (upsert)
 */
export const updateSettingsValidator: ValidationChain[] = [
  sanitizeBilingual('siteTitle'),
  body('siteTitle.en')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('English site title cannot be empty')
    .isLength({ max: 100 }),
  body('siteTitle.kh')
    .optional()
    .trim()
    .isLength({ max: 100 }),

  sanitizeBilingual('siteDescription'),
  body('siteDescription.en')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('English site description cannot be empty')
    .isLength({ max: 300 }),
  body('siteDescription.kh')
    .optional()
    .trim()
    .isLength({ max: 300 }),

  body('enableCvDownload')
    .optional()
    .isBoolean()
    .withMessage('enableCvDownload must be a boolean')
    .toBoolean(),

  body('enableContactForm')
    .optional()
    .isBoolean()
    .withMessage('enableContactForm must be a boolean')
    .toBoolean(),

  body('emailNotifications')
    .optional()
    .isBoolean()
    .withMessage('emailNotifications must be a boolean')
    .toBoolean(),

  body('notificationEmail')
    .optional({ checkFalsy: true })
    .trim()
    .isEmail()
    .withMessage('Please provide a valid notification email address'),

  body('maintenanceMode')
    .optional()
    .isBoolean()
    .withMessage('maintenanceMode must be a boolean')
    .toBoolean(),
];

export default {
  updateSettingsValidator,
};
