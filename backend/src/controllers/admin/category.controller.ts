import { Request, Response } from 'express';
import categoryService from '../../services/category.service';
import catchAsync from '../../utils/catchAsync';
import { sendSuccess, sendCreated } from '../../utils/apiResponse';
import { CategoryType } from '../../models/Category';

export class CategoryController {
  /**
   * GET /api/v1/admin/categories
   */
  getAll = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const type = req.query.type as CategoryType | undefined;
    const categories = await categoryService.getAll({ type });
    sendSuccess(res, categories, 'Categories retrieved successfully');
  });

  /**
   * GET /api/v1/admin/categories/:id
   */
  getById = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const category = await categoryService.getById(id);
    sendSuccess(res, category, 'Category retrieved successfully');
  });

  /**
   * POST /api/v1/admin/categories
   */
  create = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const category = await categoryService.create(req.body);
    sendCreated(res, category, 'Category created successfully');
  });

  /**
   * PATCH /api/v1/admin/categories/:id
   */
  update = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const category = await categoryService.update(id, req.body);
    sendSuccess(res, category, 'Category updated successfully');
  });

  /**
   * DELETE /api/v1/admin/categories/:id
   */
  delete = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    await categoryService.delete(id);
    sendSuccess(res, null, 'Category deleted successfully');
  });
}

export const categoryController = new CategoryController();
export default categoryController;
