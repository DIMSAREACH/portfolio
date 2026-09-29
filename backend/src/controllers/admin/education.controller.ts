import { Request, Response } from 'express';
import educationService from '../../services/education.service';
import catchAsync from '../../utils/catchAsync';
import { sendSuccess, sendCreated, sendPaginated } from '../../utils/apiResponse';

export class EducationController {
  /**
   * GET /api/v1/admin/education
   */
  getAll = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await educationService.getAll(req.query);
    if ('pagination' in result) {
      sendPaginated(res, result.items, result.pagination, 'Education entries retrieved successfully');
    } else {
      sendSuccess(res, result, 'Education entries retrieved successfully');
    }
  });

  /**
   * GET /api/v1/admin/education/:id
   */
  getById = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const education = await educationService.getById(id);
    sendSuccess(res, education, 'Education entry retrieved successfully');
  });

  /**
   * POST /api/v1/admin/education
   */
  create = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const education = await educationService.create(req.body);
    sendCreated(res, education, 'Education entry created successfully');
  });

  /**
   * PATCH /api/v1/admin/education/:id
   */
  update = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const education = await educationService.update(id, req.body);
    sendSuccess(res, education, 'Education entry updated successfully');
  });

  /**
   * DELETE /api/v1/admin/education/:id
   */
  delete = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    await educationService.delete(id);
    sendSuccess(res, null, 'Education entry deleted successfully');
  });
}

export const educationController = new EducationController();
export default educationController;
