import { body, ValidationChain } from 'express-validator';

/**
 * Validation rules for POST /api/v1/contact
 * Per PRD Section 8.11 and 12.2:
 * - name: Required, 2-100 chars
 * - email: Required, valid email format
 * - subject: Required, 5-200 chars
 * - message: Required, 10-2000 chars
 * - honeypot: Optional string (spam protection)
 */
export const contactFormValidator: ValidationChain[] = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Subject is required')
    .isLength({ min: 5, max: 200 })
    .withMessage('Subject must be between 5 and 200 characters'),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters'),
  body('honeypot')
    .optional()
    .isString()
    .withMessage('Honeypot must be a string'),
];

export default {
  contactFormValidator,
};
