import { Request, Response } from 'express';
import certificationService from '../../services/certification.service';
import catchAsync from '../../utils/catchAsync';
import { sendSuccess, sendCreated, sendPaginated } from '../../utils/apiResponse';

export class CertificationController {
  /**
   * GET /api/v1/admin/certifications
   */
  getAll = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await certificationService.getAll(req.query);
    if ('pagination' in result) {
      sendPaginated(res, result.items, result.pagination, 'Certifications retrieved successfully');
    } else {
      sendSuccess(res, result, 'Certifications retrieved successfully');
    }
  });

  /**
   * GET /api/v1/admin/certifications/:id
   */
  getById = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const cert = await certificationService.getById(id);
    sendSuccess(res, cert, 'Certification retrieved successfully');
  });

  /**
   * POST /api/v1/admin/certifications
   */
  create = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const cert = await certificationService.create(req.body, req.file);
    sendCreated(res, cert, 'Certification created successfully');
  });

  /**
   * PATCH /api/v1/admin/certifications/:id
   */
  update = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const cert = await certificationService.update(id, req.body, req.file);
    sendSuccess(res, cert, 'Certification updated successfully');
  });

  /**
   * DELETE /api/v1/admin/certifications/:id
   */
  delete = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    await certificationService.delete(id);
    sendSuccess(res, null, 'Certification deleted successfully');
  });
}

export const certificationController = new CertificationController();
export default certificationController;
