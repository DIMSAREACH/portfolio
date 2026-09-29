import { Router } from 'express';
import messageController from '../../controllers/admin/message.controller';
import { validate } from '../../middleware/validate.middleware';
import {
  messageIdParamValidator,
  listMessagesValidator,
} from '../../validators/message.validator';

const router = Router();

/**
 * GET /api/v1/admin/messages
 * List messages with filters and pagination
 */
router.get('/', validate(listMessagesValidator), messageController.getAll);

/**
 * GET /api/v1/admin/messages/:id
 * Retrieve message details
 */
router.get('/:id', validate(messageIdParamValidator), messageController.getById);

/**
 * PATCH /api/v1/admin/messages/:id/read
 * Mark message as read
 */
router.patch('/:id/read', validate(messageIdParamValidator), messageController.markAsRead);

/**
 * PATCH /api/v1/admin/messages/:id/unread
 * Mark message as unread
 */
router.patch('/:id/unread', validate(messageIdParamValidator), messageController.markAsUnread);

/**
 * PATCH /api/v1/admin/messages/:id/archive
 * Archive message
 */
router.patch('/:id/archive', validate(messageIdParamValidator), messageController.archive);

/**
 * PATCH /api/v1/admin/messages/:id/unarchive
 * Unarchive message
 */
router.patch('/:id/unarchive', validate(messageIdParamValidator), messageController.unarchive);

/**
 * DELETE /api/v1/admin/messages/:id
 * Delete message
 */
router.delete('/:id', validate(messageIdParamValidator), messageController.delete);

export default router;
