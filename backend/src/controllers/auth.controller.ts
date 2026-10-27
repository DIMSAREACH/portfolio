import { Request, Response, CookieOptions } from 'express';
import config from '../config/environment';
import authService from '../services/auth.service';
import { sendSuccess } from '../utils/apiResponse';
import catchAsync from '../utils/catchAsync';
import { UnauthorizedError } from '../utils/AppError';

/**
 * Cookie options tailored for cross-site hosting (e.g. Vercel frontend <-> Render backend)
 */
const getRefreshCookieOptions = (): CookieOptions => {
  const isProd = config.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/api/v1/auth',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };
};

export class AuthController {
  login = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    res.cookie('refreshToken', result.refreshToken, getRefreshCookieOptions());

    sendSuccess(
      res,
      {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
      'Login successful',
    );
  });

  firebaseLogin = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { idToken } = req.body;
    const result = await authService.loginWithFirebase(idToken);

    res.cookie('refreshToken', result.refreshToken, getRefreshCookieOptions());

    sendSuccess(
      res,
      {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
      'Firebase login successful',
    );
  });

  logout = catchAsync(async (_req: Request, res: Response): Promise<void> => {
    res.clearCookie('refreshToken', getRefreshCookieOptions());
    sendSuccess(res, null, 'Logged out successfully');
  });

  refresh = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedError('Refresh token is required');
    }

    const result = await authService.refreshAccessToken(refreshToken);

    if (result.refreshToken) {
      res.cookie('refreshToken', result.refreshToken, getRefreshCookieOptions());
    }

    sendSuccess(
      res,
      {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken || refreshToken,
        user: result.user,
      },
      'Token refreshed successfully',
    );
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

  forgotPassword = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;
    const origin =
      (req.headers.origin as string) ||
      (req.headers.host ? `${req.protocol}://${req.headers.host}` : undefined);
    const result = await authService.forgotPassword(email, origin);
    sendSuccess(res, result, result.message);
  });

  resetPassword = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { token, password } = req.body;
    await authService.resetPassword(token, password);
    sendSuccess(res, null, 'Password has been reset successfully. You may now log in.');
  });
}

export const authController = new AuthController();
export default authController;
