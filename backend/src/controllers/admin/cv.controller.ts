import { Request, Response } from 'express';
import { cvService } from '../../services/media.service';
import catchAsync from '../../utils/catchAsync';
import { sendSuccess, sendCreated } from '../../utils/apiResponse';

export class CvController {
  /**
   * GET /api/v1/admin/cv
   */
  getCv = catchAsync(async (_req: Request, res: Response): Promise<void> => {
    const cv = await cvService.getCv();
    const data = cv
      ? {
          url: cv.url,
          cvUrl: cv.url,
          publicId: cv.publicId,
          cvPublicId: cv.publicId,
          fileName: cv.fileName,
        }
      : null;
    sendSuccess(res, data, 'CV information retrieved successfully');
  });

  /**
   * POST /api/v1/admin/cv/upload
   */
  uploadCv = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const cv = await cvService.uploadCv(req.file);
    const data = {
      url: cv.url,
      cvUrl: cv.url,
      publicId: cv.publicId,
      cvPublicId: cv.publicId,
      fileName: cv.fileName,
    };
    sendCreated(res, data, 'CV uploaded and activated successfully');
  });

  /**
   * DELETE /api/v1/admin/cv
   */
  deleteCv = catchAsync(async (_req: Request, res: Response): Promise<void> => {
    await cvService.deleteCv();
    sendSuccess(res, null, 'CV deleted successfully');
  });
}

export const cvController = new CvController();
export default cvController;
