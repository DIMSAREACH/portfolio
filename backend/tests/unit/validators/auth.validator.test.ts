import { describe, it, expect } from '@jest/globals';
import { Request, Response, NextFunction } from 'express';
import { loginValidator, changePasswordValidator } from '../../../src/validators/auth.validator';
import { validate } from '../../../src/middleware/validate.middleware';

describe('Auth Validators', () => {
  const createMockReqRes = (body: Record<string, unknown>) => {
    const req = { body } as unknown as Request;
    let statusCode = 200;
    let jsonResponse: any = null;

    const res = {
      status: (code: number) => {
        statusCode = code;
        return res;
      },
      json: (data: any) => {
        jsonResponse = data;
        return res;
      },
    } as unknown as Response;

    const next = (() => {}) as unknown as NextFunction;

    return { req, res, next, getStatus: () => statusCode, getJson: () => jsonResponse };
  };

  describe('loginValidator', () => {
    const middleware = validate(loginValidator);

    it('should pass validation with valid email and password', async () => {
      let nextCalled = false;
      const { req, res } = createMockReqRes({
        email: 'admin@portfolio.dev',
        password: 'securePassword123',
      });

      await middleware(req, res, () => {
        nextCalled = true;
      });

      expect(nextCalled).toBe(true);
    });

    it('should fail when email is missing or empty', async () => {
      let nextCalled = false;
      const { req, res, getStatus, getJson } = createMockReqRes({
        password: 'securePassword123',
      });

      await middleware(req, res, () => {
        nextCalled = true;
      });

      expect(nextCalled).toBe(false);
      expect(getStatus()).toBe(400);
      expect(getJson().errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'email', message: 'Email is required' }),
        ]),
      );
    });

    it('should fail when email has an invalid format', async () => {
      let nextCalled = false;
      const { req, res, getStatus, getJson } = createMockReqRes({
        email: 'not-an-email',
        password: 'securePassword123',
      });

      await middleware(req, res, () => {
        nextCalled = true;
      });

      expect(nextCalled).toBe(false);
      expect(getStatus()).toBe(400);
      expect(getJson().errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'email', message: 'Please provide a valid email address' }),
        ]),
      );
    });

    it('should fail when password is missing or empty', async () => {
      let nextCalled = false;
      const { req, res, getStatus, getJson } = createMockReqRes({
        email: 'admin@portfolio.dev',
        password: '',
      });

      await middleware(req, res, () => {
        nextCalled = true;
      });

      expect(nextCalled).toBe(false);
      expect(getStatus()).toBe(400);
      expect(getJson().errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'password', message: 'Password is required' }),
        ]),
      );
    });
  });

  describe('changePasswordValidator', () => {
    const middleware = validate(changePasswordValidator);

    it('should pass with valid current and new password (min 8 chars)', async () => {
      let nextCalled = false;
      const { req, res } = createMockReqRes({
        currentPassword: 'oldPassword123',
        newPassword: 'newStrongPassword456',
      });

      await middleware(req, res, () => {
        nextCalled = true;
      });

      expect(nextCalled).toBe(true);
    });

    it('should fail when currentPassword is missing', async () => {
      let nextCalled = false;
      const { req, res, getStatus, getJson } = createMockReqRes({
        newPassword: 'newStrongPassword456',
      });

      await middleware(req, res, () => {
        nextCalled = true;
      });

      expect(nextCalled).toBe(false);
      expect(getStatus()).toBe(400);
      expect(getJson().errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'currentPassword', message: 'Current password is required' }),
        ]),
      );
    });

    it('should fail when newPassword is less than 8 characters', async () => {
      let nextCalled = false;
      const { req, res, getStatus, getJson } = createMockReqRes({
        currentPassword: 'oldPassword123',
        newPassword: 'short',
      });

      await middleware(req, res, () => {
        nextCalled = true;
      });

      expect(nextCalled).toBe(false);
      expect(getStatus()).toBe(400);
      expect(getJson().errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'newPassword',
            message: 'New password must be at least 8 characters long',
          }),
        ]),
      );
    });
  });
});
