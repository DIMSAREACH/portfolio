import { param, query, ValidationChain } from 'express-validator';

/**
 * Validation rules for media ID param
 */
export const mediaIdParamValidator: ValidationChain[] = [
  param('id')
    .isMongoId()
    .withMessage('Invalid media ID'),
];

/**
 * Validation rules for querying media files
 */
export const listMediaValidator: ValidationChain[] = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('limit must be between 1 and 100'),
  query('folder')
    .optional()
    .isString()
    .trim(),
  query('mimeType')
    .optional()
    .isString()
    .trim(),
];

export default {
  mediaIdParamValidator,
  listMediaValidator,
};
