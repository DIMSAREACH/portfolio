import { Request, Response } from 'express';
import experienceService from '../../services/experience.service';
import catchAsync from '../../utils/catchAsync';
import { sendSuccess, sendCreated, sendPaginated } from '../../utils/apiResponse';

export class ExperienceController {
  /**
   * GET /api/v1/admin/experiences
   */
  getAll = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await experienceService.getAll(req.query);
    if ('pagination' in result) {
      sendPaginated(res, result.items, result.pagination, 'Experiences retrieved successfully');
    } else {
      sendSuccess(res, result, 'Experiences retrieved successfully');
    }
  });

  /**
   * GET /api/v1/admin/experiences/:id
   */
  getById = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const experience = await experienceService.getById(id);
    sendSuccess(res, experience, 'Experience retrieved successfully');
  });

  /**
   * POST /api/v1/admin/experiences
   */
  create = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const experience = await experienceService.create(req.body);
    sendCreated(res, experience, 'Experience created successfully');
  });

  /**
   * PATCH /api/v1/admin/experiences/:id
   */
  update = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const experience = await experienceService.update(id, req.body);
    sendSuccess(res, experience, 'Experience updated successfully');
  });

  /**
   * DELETE /api/v1/admin/experiences/:id
   */
  delete = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    await experienceService.delete(id);
    sendSuccess(res, null, 'Experience deleted successfully');
  });
}

export const experienceController = new ExperienceController();
export default experienceController;
