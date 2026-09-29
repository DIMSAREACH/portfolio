import { Request, Response } from 'express';
import skillService from '../../services/skill.service';
import catchAsync from '../../utils/catchAsync';
import { sendSuccess, sendCreated, sendPaginated } from '../../utils/apiResponse';

export class SkillController {
  /**
   * GET /api/v1/admin/skills
   */
  getAll = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await skillService.getAll(req.query);
    if ('pagination' in result) {
      sendPaginated(res, result.items, result.pagination, 'Skills retrieved successfully');
    } else {
      sendSuccess(res, result, 'Skills retrieved successfully');
    }
  });

  /**
   * GET /api/v1/admin/skills/:id
   */
  getById = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const skill = await skillService.getById(id);
    sendSuccess(res, skill, 'Skill retrieved successfully');
  });

  /**
   * POST /api/v1/admin/skills
   */
  create = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const skill = await skillService.create(req.body);
    sendCreated(res, skill, 'Skill created successfully');
  });

  /**
   * PATCH /api/v1/admin/skills/:id
   */
  update = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const skill = await skillService.update(id, req.body);
    sendSuccess(res, skill, 'Skill updated successfully');
  });

  /**
   * DELETE /api/v1/admin/skills/:id
   */
  delete = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    await skillService.delete(id);
    sendSuccess(res, null, 'Skill deleted successfully');
  });
}

export const skillController = new SkillController();
export default skillController;
