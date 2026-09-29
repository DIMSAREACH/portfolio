import { Request, Response } from 'express';
import dashboardService from '../../services/dashboard.service';
import catchAsync from '../../utils/catchAsync';
import { sendSuccess } from '../../utils/apiResponse';

export class DashboardController {
  /**
   * GET /api/v1/admin/dashboard/stats
   */
  getStats = catchAsync(async (_req: Request, res: Response): Promise<void> => {
    const stats = await dashboardService.getStats();
    sendSuccess(res, stats, 'Dashboard statistics retrieved successfully');
  });
}

export const dashboardController = new DashboardController();
export default dashboardController;
