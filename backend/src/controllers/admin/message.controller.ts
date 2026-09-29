import { Request, Response } from 'express';
import messageService from '../../services/message.service';
import catchAsync from '../../utils/catchAsync';
import { sendSuccess, sendPaginated } from '../../utils/apiResponse';

export class MessageController {
  /**
   * GET /api/v1/admin/messages
   */
  getAll = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await messageService.getAll(req.query);
    sendPaginated(res, result.items, result.pagination, 'Messages retrieved successfully');
  });

  /**
   * GET /api/v1/admin/messages/:id
   */
  getById = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const message = await messageService.getById(id);
    sendSuccess(res, message, 'Message retrieved successfully');
  });

  /**
   * PATCH /api/v1/admin/messages/:id/read
   */
  markAsRead = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const message = await messageService.markAsRead(id);
    sendSuccess(res, message, 'Message marked as read successfully');
  });

  /**
   * PATCH /api/v1/admin/messages/:id/unread
   */
  markAsUnread = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const message = await messageService.markAsUnread(id);
    sendSuccess(res, message, 'Message marked as unread successfully');
  });

  /**
   * PATCH /api/v1/admin/messages/:id/archive
   */
  archive = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const message = await messageService.archive(id);
    sendSuccess(res, message, 'Message archived successfully');
  });

  /**
   * PATCH /api/v1/admin/messages/:id/unarchive
   */
  unarchive = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const message = await messageService.unarchive(id);
    sendSuccess(res, message, 'Message unarchived successfully');
  });

  /**
   * DELETE /api/v1/admin/messages/:id
   */
  delete = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    await messageService.delete(id);
    sendSuccess(res, null, 'Message deleted successfully');
  });
}

export const messageController = new MessageController();
export default messageController;
