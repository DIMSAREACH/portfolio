import { body, param, ValidationChain } from 'express-validator';

const validPlatforms = [
  'github',
  'linkedin',
  'facebook',
  'email',
  'twitter',
  'youtube',
  'other',
];

/**
 * Validation rules for POST /api/v1/admin/social-links
 */
export const createSocialLinkValidator: ValidationChain[] = [
  body('platform')
    .trim()
    .notEmpty()
    .withMessage('Platform is required')
    .isIn(validPlatforms)
    .withMessage(`Platform must be one of: ${validPlatforms.join(', ')}`),

  body('label')
    .trim()
    .notEmpty()
    .withMessage('Label is required')
    .isLength({ max: 100 })
    .withMessage('Label cannot exceed 100 characters'),

  body('url')
    .trim()
    .notEmpty()
    .withMessage('URL is required')
    .isLength({ max: 500 })
    .withMessage('URL cannot exceed 500 characters'),

  body('icon')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 }),

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
 * Validation rules for PATCH /api/v1/admin/social-links/:id
 */
export const updateSocialLinkValidator: ValidationChain[] = [
  param('id')
    .isMongoId()
    .withMessage('Invalid social link ID'),

  body('platform')
    .optional()
    .trim()
    .isIn(validPlatforms)
    .withMessage(`Platform must be one of: ${validPlatforms.join(', ')}`),

  body('label')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Label cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Label cannot exceed 100 characters'),

  body('url')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('URL cannot be empty')
    .isLength({ max: 500 })
    .withMessage('URL cannot exceed 500 characters'),

  body('icon')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 }),

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
 * Validation rules for PATCH /api/v1/admin/social-links/reorder
 */
export const reorderSocialLinksValidator: ValidationChain[] = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('items must be a non-empty array'),

  body('items.*.id')
    .isMongoId()
    .withMessage('Each item must contain a valid mongo ID'),

  body('items.*.order')
    .isInt({ min: 0 })
    .withMessage('Each item order must be a non-negative integer')
    .toInt(),
];

/**
 * Validation rules for social link ID param
 */
export const socialLinkIdParamValidator: ValidationChain[] = [
  param('id')
    .isMongoId()
    .withMessage('Invalid social link ID'),
];

export default {
  createSocialLinkValidator,
  updateSocialLinkValidator,
  reorderSocialLinksValidator,
  socialLinkIdParamValidator,
};
