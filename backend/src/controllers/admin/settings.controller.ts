import { Request, Response } from 'express';
import settingsService from '../../services/settings.service';
import catchAsync from '../../utils/catchAsync';
import { sendSuccess } from '../../utils/apiResponse';

export class SettingsController {
  /**
   * GET /api/v1/admin/settings
   */
  getSettings = catchAsync(async (_req: Request, res: Response): Promise<void> => {
    const settings = await settingsService.getSettings();
    sendSuccess(res, settings, 'Settings retrieved successfully');
  });

  /**
   * PUT /api/v1/admin/settings
   */
  updateSettings = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const settings = await settingsService.updateSettings(req.body);
    sendSuccess(res, settings, 'Settings updated successfully');
  });
}

export const settingsController = new SettingsController();
export default settingsController;
