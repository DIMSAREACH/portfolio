import { describe, it, expect, jest } from '@jest/globals';
import { Request, Response, NextFunction } from 'express';
import request from 'supertest';
import { errorHandler } from '../../../src/middleware/errorHandler.middleware';
import { AppError, ValidationError } from '../../../src/utils/AppError';
import app from '../../../src/app';

describe('Global Error Handler Middleware', () => {
  const mockReq = {} as Request;
  const mockNext = jest.fn() as unknown as NextFunction;

  const createMockRes = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res) as any;
    res.json = jest.fn().mockReturnValue(res) as any;
    return res;
  };

  it('should handle AppError correctly', () => {
    const res = createMockRes();
    const error = new AppError('Forbidden action', 403);

    errorHandler(error, mockReq, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Forbidden action',
      }),
    );
  });

  it('should handle ValidationError with field errors', () => {
    const res = createMockRes();
    const fieldErrors = [{ field: 'email', message: 'Email required' }];
    const error = new ValidationError('Validation failed', fieldErrors);

    errorHandler(error, mockReq, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Validation failed',
        errors: fieldErrors,
      }),
    );
  });

  it('should transform Mongoose ValidationError into 400 with fields array', () => {
    const res = createMockRes();
    const mongooseErr = {
      name: 'ValidationError',
      errors: {
        title: { message: 'Title is required' },
        slug: { message: 'Slug is invalid' },
      },
    };

    errorHandler(mongooseErr, mockReq, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Validation failed',
        errors: [
          { field: 'title', message: 'Title is required' },
          { field: 'slug', message: 'Slug is invalid' },
        ],
      }),
    );
  });

  it('should transform Mongoose CastError into 400', () => {
    const res = createMockRes();
    const castErr = {
      name: 'CastError',
      path: '_id',
      value: 'invalid-id-123',
    };

    errorHandler(castErr, mockReq, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Invalid _id: invalid-id-123',
      }),
    );
  });

  it('should transform duplicate key error (code 11000) into 409', () => {
    const res = createMockRes();
    const duplicateErr = {
      code: 11000,
      keyValue: { slug: 'my-project' },
    };

    errorHandler(duplicateErr, mockReq, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: expect.stringContaining('Duplicate field value entered: slug'),
      }),
    );
  });

  it('should transform JsonWebTokenError into 401', () => {
    const res = createMockRes();
    const jwtErr = { name: 'JsonWebTokenError' };

    errorHandler(jwtErr, mockReq, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Invalid token. Please log in again.',
      }),
    );
  });

  it('should transform TokenExpiredError into 401', () => {
    const res = createMockRes();
    const expiredErr = { name: 'TokenExpiredError' };

    errorHandler(expiredErr, mockReq, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Your token has expired. Please log in again.',
      }),
    );
  });

  it('should handle unhandled routes with 404 response via app middleware', async () => {
    const res = await request(app).get('/api/v1/unknown-route');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body.message).toContain('Route GET /api/v1/unknown-route not found');
  });
});
