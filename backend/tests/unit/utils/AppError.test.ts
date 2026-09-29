import { describe, it, expect } from '@jest/globals';
import {
  AppError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  RateLimitError,
} from '../../../src/utils/AppError';

describe('Custom Error Classes', () => {
  describe('AppError', () => {
    it('should set status to fail for 4xx status codes', () => {
      const error = new AppError('Client error', 400);

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Client error');
      expect(error.statusCode).toBe(400);
      expect(error.status).toBe('fail');
      expect(error.isOperational).toBe(true);
    });

    it('should set status to error for 5xx status codes', () => {
      const error = new AppError('Server error', 500);

      expect(error.statusCode).toBe(500);
      expect(error.status).toBe('error');
      expect(error.isOperational).toBe(true);
    });
  });

  describe('ValidationError', () => {
    it('should create a 400 ValidationError with default message', () => {
      const error = new ValidationError();

      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(400);
      expect(error.status).toBe('fail');
      expect(error.message).toBe('Validation failed');
    });

    it('should attach field errors when provided', () => {
      const fieldErrors = [{ field: 'email', message: 'Email is invalid' }];
      const error = new ValidationError('Invalid inputs', fieldErrors);

      expect(error.statusCode).toBe(400);
      expect(error.message).toBe('Invalid inputs');
      expect(error.errors).toEqual(fieldErrors);
    });
  });

  describe('UnauthorizedError', () => {
    it('should create a 401 UnauthorizedError', () => {
      const error = new UnauthorizedError('Token expired');

      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(401);
      expect(error.status).toBe('fail');
      expect(error.message).toBe('Token expired');
    });
  });

  describe('ForbiddenError', () => {
    it('should create a 403 ForbiddenError', () => {
      const error = new ForbiddenError();

      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(403);
      expect(error.status).toBe('fail');
      expect(error.message).toBe('Forbidden access');
    });
  });

  describe('NotFoundError', () => {
    it('should create a 404 NotFoundError', () => {
      const error = new NotFoundError('Project not found');

      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(404);
      expect(error.status).toBe('fail');
      expect(error.message).toBe('Project not found');
    });
  });

  describe('ConflictError', () => {
    it('should create a 409 ConflictError', () => {
      const error = new ConflictError('Slug already exists');

      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(409);
      expect(error.status).toBe('fail');
      expect(error.message).toBe('Slug already exists');
    });
  });

  describe('RateLimitError', () => {
    it('should create a 429 RateLimitError', () => {
      const error = new RateLimitError();

      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(429);
      expect(error.status).toBe('fail');
      expect(error.message).toBe('Too many requests, please try again later');
    });
  });
});
