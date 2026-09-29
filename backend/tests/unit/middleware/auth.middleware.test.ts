import { Request, Response, NextFunction } from 'express';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { authenticate, authorize } from '../../../src/middleware/auth.middleware';
import { UnauthorizedError, ForbiddenError } from '../../../src/utils/AppError';
import * as jwtUtils from '../../../src/utils/jwt';

describe('Auth Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      headers: {},
    };
    mockRes = {};
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('authenticate', () => {
    it('should extract and verify token, set req.user, and call next()', () => {
      const mockPayload = { userId: 'user-12345', role: 'admin' };
      jest.spyOn(jwtUtils, 'verifyAccessToken').mockReturnValue(mockPayload as any);

      mockReq.headers = {
        authorization: 'Bearer valid.jwt.token',
      };

      authenticate(mockReq as Request, mockRes as Response, mockNext);

      expect(jwtUtils.verifyAccessToken).toHaveBeenCalledWith('valid.jwt.token');
      expect(mockReq.user).toEqual({
        userId: 'user-12345',
        role: 'admin',
      });
      expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it('should throw UnauthorizedError when Authorization header is missing', () => {
      mockReq.headers = {};

      expect(() => {
        authenticate(mockReq as Request, mockRes as Response, mockNext);
      }).toThrow(UnauthorizedError);

      expect(() => {
        authenticate(mockReq as Request, mockRes as Response, mockNext);
      }).toThrow('Access token required');

      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedError when Authorization header does not use Bearer scheme', () => {
      mockReq.headers = {
        authorization: 'Basic dXNlcjpwYXNz',
      };

      expect(() => {
        authenticate(mockReq as Request, mockRes as Response, mockNext);
      }).toThrow(UnauthorizedError);

      expect(() => {
        authenticate(mockReq as Request, mockRes as Response, mockNext);
      }).toThrow('Access token required');

      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedError when Bearer token is empty or whitespace', () => {
      mockReq.headers = {
        authorization: 'Bearer    ',
      };

      expect(() => {
        authenticate(mockReq as Request, mockRes as Response, mockNext);
      }).toThrow(UnauthorizedError);

      expect(() => {
        authenticate(mockReq as Request, mockRes as Response, mockNext);
      }).toThrow('Access token required');

      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedError when token is invalid or expired', () => {
      jest.spyOn(jwtUtils, 'verifyAccessToken').mockImplementation(() => {
        throw new Error('jwt expired');
      });

      mockReq.headers = {
        authorization: 'Bearer expired.jwt.token',
      };

      expect(() => {
        authenticate(mockReq as Request, mockRes as Response, mockNext);
      }).toThrow(UnauthorizedError);

      expect(() => {
        authenticate(mockReq as Request, mockRes as Response, mockNext);
      }).toThrow('Invalid or expired token');

      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('authorize', () => {
    it('should call next() when user has the required role', () => {
      mockReq.user = {
        userId: 'user-12345',
        role: 'admin',
      };

      const adminOnly = authorize('admin');
      adminOnly(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it('should allow user if their role is in the list of allowed roles', () => {
      mockReq.user = {
        userId: 'user-12345',
        role: 'editor',
      };

      const multiRoleAuth = authorize('admin', 'editor', 'moderator');
      multiRoleAuth(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it('should throw ForbiddenError when user role is not permitted', () => {
      mockReq.user = {
        userId: 'user-12345',
        role: 'guest',
      };

      const adminOnly = authorize('admin');

      expect(() => {
        adminOnly(mockReq as Request, mockRes as Response, mockNext);
      }).toThrow(ForbiddenError);

      expect(() => {
        adminOnly(mockReq as Request, mockRes as Response, mockNext);
      }).toThrow('Insufficient permissions');

      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenError when req.user is undefined', () => {
      mockReq.user = undefined;

      const adminOnly = authorize('admin');

      expect(() => {
        adminOnly(mockReq as Request, mockRes as Response, mockNext);
      }).toThrow(ForbiddenError);

      expect(() => {
        adminOnly(mockReq as Request, mockRes as Response, mockNext);
      }).toThrow('Insufficient permissions');

      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
