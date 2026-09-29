import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError, ForbiddenError } from '../utils/AppError';
import { verifyAccessToken } from '../utils/jwt';

/**
 * Middleware to verify JWT access token from Authorization header (Bearer scheme)
 * Attaches decoded payload to req.user
 */
export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Access token required');
  }

  const token = authHeader.substring(7).trim();
  if (!token) {
    throw new UnauthorizedError('Access token required');
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      userId: payload.userId,
      role: payload.role,
    };
    next();
  } catch {
    throw new UnauthorizedError('Invalid or expired token');
  }
};

/**
 * Middleware factory to authorize users by role(s)
 * @param roles Allowed roles (e.g. 'admin')
 */
export const authorize = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ForbiddenError('You do not have permission to perform this action');
    }
    next();
  };
};

export default {
  authenticate,
  authorize,
};
