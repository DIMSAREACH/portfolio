import { Request, Response } from 'express';
import { mediaService } from '../../services/media.service';
import catchAsync from '../../utils/catchAsync';
import { sendSuccess, sendCreated, sendPaginated } from '../../utils/apiResponse';

export class MediaController {
  /**
   * GET /api/v1/admin/media
   */
  getAll = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await mediaService.getAll(req.query);
    sendPaginated(res, result.items, result.pagination, 'Media files retrieved successfully');
  });

  /**
   * GET /api/v1/admin/media/:id
   */
  getById = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const media = await mediaService.getById(id);
    sendSuccess(res, media, 'Media file retrieved successfully');
  });

  /**
   * POST /api/v1/admin/media/upload
   */
  upload = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const media = await mediaService.upload(req.file, req.body.folder, req.body.altText);
    sendCreated(res, media, 'Media uploaded successfully');
  });

  /**
   * DELETE /api/v1/admin/media/:id
   */
  delete = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    await mediaService.delete(id);
    sendSuccess(res, null, 'Media file deleted successfully');
  });
}

export const mediaController = new MediaController();
export default mediaController;
