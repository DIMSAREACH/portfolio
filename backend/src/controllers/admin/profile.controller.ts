import { Request, Response } from 'express';
import profileService, { UploadedProfileFiles } from '../../services/profile.service';
import catchAsync from '../../utils/catchAsync';
import { sendSuccess } from '../../utils/apiResponse';

export class ProfileController {
  /**
   * GET /api/v1/admin/profile
   */
  getProfile = catchAsync(async (_req: Request, res: Response): Promise<void> => {
    const profile = await profileService.getProfile();
    sendSuccess(res, profile, 'Profile retrieved successfully');
  });

  /**
   * PUT /api/v1/admin/profile
   */
  upsertProfile = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const files = req.files as UploadedProfileFiles | undefined;
    const profile = await profileService.upsertProfile(req.body, files);
    sendSuccess(res, profile, 'Profile updated successfully');
  });
}

export const profileController = new ProfileController();
export default profileController;
