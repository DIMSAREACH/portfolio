import { Request, Response } from 'express';
import config from '../config/environment';
import authService from '../services/auth.service';
import { sendSuccess } from '../utils/apiResponse';
import catchAsync from '../utils/catchAsync';
import { UnauthorizedError } from '../utils/AppError';

export class AuthController {
  login = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/v1/auth',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    sendSuccess(
      res,
      { user: result.user, accessToken: result.accessToken },
      'Login successful',
    );
  });

  logout = catchAsync(async (_req: Request, res: Response): Promise<void> => {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/v1/auth',
    });

    sendSuccess(res, null, 'Logged out successfully');
  });

  refresh = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedError('Refresh token is required');
    }

    const result = await authService.refreshAccessToken(refreshToken);
    sendSuccess(res, { accessToken: result.accessToken }, 'Token refreshed successfully');
  });

  me = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const user = await authService.getCurrentUser(req.user!.userId);
    sendSuccess(res, user, 'Current user profile retrieved');
  });

  changePassword = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { currentPassword, newPassword } = req.body;
    await authService.changePassword(req.user!.userId, currentPassword, newPassword);
    sendSuccess(res, null, 'Password changed successfully');
  });
}

export const authController = new AuthController();
export default authController;
