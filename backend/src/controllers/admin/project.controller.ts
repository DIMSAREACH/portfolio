import { Request, Response } from 'express';
import projectService, { UploadedProjectFiles } from '../../services/project.service';
import catchAsync from '../../utils/catchAsync';
import { sendSuccess, sendCreated, sendPaginated } from '../../utils/apiResponse';

export class ProjectController {
  /**
   * GET /api/v1/admin/projects
   */
  getAll = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await projectService.getAll(req.query);
    sendPaginated(res, result.items, result.pagination, 'Projects retrieved successfully');
  });

  /**
   * GET /api/v1/admin/projects/:id
   */
  getById = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const project = await projectService.getById(id);
    sendSuccess(res, project, 'Project retrieved successfully');
  });

  /**
   * POST /api/v1/admin/projects
   */
  create = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const files = req.files as UploadedProjectFiles | undefined;
    const project = await projectService.create(req.body, files);
    sendCreated(res, project, 'Project created successfully');
  });

  /**
   * PATCH /api/v1/admin/projects/:id
   */
  update = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const files = req.files as UploadedProjectFiles | undefined;
    const project = await projectService.update(id, req.body, files);
    sendSuccess(res, project, 'Project updated successfully');
  });

  /**
   * DELETE /api/v1/admin/projects/:id
   */
  delete = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    await projectService.delete(id);
    sendSuccess(res, null, 'Project deleted successfully');
  });
}

export const projectController = new ProjectController();
export default projectController;
