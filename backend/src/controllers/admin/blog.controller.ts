import { Request, Response } from 'express';
import blogService from '../../services/blog.service';
import catchAsync from '../../utils/catchAsync';
import { sendSuccess, sendCreated, sendPaginated } from '../../utils/apiResponse';

export class BlogController {
  /**
   * GET /api/v1/admin/blog
   */
  getAll = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await blogService.getAll(req.query);
    sendPaginated(res, result.items, result.pagination, 'Blog posts retrieved successfully');
  });

  /**
   * GET /api/v1/admin/blog/:id
   */
  getById = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const post = await blogService.getById(id);
    sendSuccess(res, post, 'Blog post retrieved successfully');
  });

  /**
   * POST /api/v1/admin/blog
   */
  create = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const authorId = req.user?.userId || req.body.author;
    const post = await blogService.create(req.body, authorId, req.file);
    sendCreated(res, post, 'Blog post created successfully');
  });

  /**
   * PATCH /api/v1/admin/blog/:id
   */
  update = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const post = await blogService.update(id, req.body, req.file);
    sendSuccess(res, post, 'Blog post updated successfully');
  });

  /**
   * DELETE /api/v1/admin/blog/:id
   */
  delete = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    await blogService.delete(id);
    sendSuccess(res, null, 'Blog post deleted successfully');
  });

  /**
   * PATCH /api/v1/admin/blog/:id/publish
   */
  publish = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const post = await blogService.publish(id);
    sendSuccess(res, post, 'Blog post published successfully');
  });

  /**
   * PATCH /api/v1/admin/blog/:id/unpublish
   */
  unpublish = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const post = await blogService.unpublish(id);
    sendSuccess(res, post, 'Blog post unpublished successfully');
  });
}

export const blogController = new BlogController();
export default blogController;
