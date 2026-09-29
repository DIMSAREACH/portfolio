import { param, query, ValidationChain } from 'express-validator';

/**
 * Validation rules for message ID param
 */
export const messageIdParamValidator: ValidationChain[] = [
  param('id')
    .isMongoId()
    .withMessage('Invalid message ID'),
];

/**
 * Validation rules for querying messages
 */
export const listMessagesValidator: ValidationChain[] = [
  query('isRead')
    .optional()
    .isBoolean()
    .withMessage('isRead must be a boolean'),
  query('isArchived')
    .optional()
    .isBoolean()
    .withMessage('isArchived must be a boolean'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('limit must be between 1 and 100'),
  query('search')
    .optional()
    .isString()
    .trim(),
];

export default {
  messageIdParamValidator,
  listMessagesValidator,
};
