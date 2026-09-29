import { Request, Response } from 'express';
import socialLinkService from '../../services/socialLink.service';
import catchAsync from '../../utils/catchAsync';
import { sendSuccess, sendCreated } from '../../utils/apiResponse';

export class SocialLinkController {
  /**
   * GET /api/v1/admin/social-links
   */
  getAll = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const links = await socialLinkService.getAll(req.query);
    sendSuccess(res, links, 'Social links retrieved successfully');
  });

  /**
   * GET /api/v1/admin/social-links/:id
   */
  getById = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const link = await socialLinkService.getById(id);
    sendSuccess(res, link, 'Social link retrieved successfully');
  });

  /**
   * POST /api/v1/admin/social-links
   */
  create = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const link = await socialLinkService.create(req.body);
    sendCreated(res, link, 'Social link created successfully');
  });

  /**
   * PATCH /api/v1/admin/social-links/:id
   */
  update = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const link = await socialLinkService.update(id, req.body);
    sendSuccess(res, link, 'Social link updated successfully');
  });

  /**
   * DELETE /api/v1/admin/social-links/:id
   */
  delete = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    await socialLinkService.delete(id);
    sendSuccess(res, null, 'Social link deleted successfully');
  });

  /**
   * PATCH /api/v1/admin/social-links/reorder
   */
  reorder = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const links = await socialLinkService.reorder(req.body.items);
    sendSuccess(res, links, 'Social links reordered successfully');
  });
}

export const socialLinkController = new SocialLinkController();
export default socialLinkController;
