import { describe, it, expect, jest } from '@jest/globals';
import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../../../src/utils/catchAsync';
import {
  sendSuccess,
  sendCreated,
  sendNoContent,
  sendPaginated,
} from '../../../src/utils/apiResponse';
import { slugify } from '../../../src/utils/slugify';
import {
  getPaginationParams,
  buildPaginationMetadata,
} from '../../../src/utils/pagination';
import { calculateReadingTime } from '../../../src/utils/readingTime';

describe('Backend Utility Functions', () => {
  describe('catchAsync', () => {
    it('should invoke async handler and forward resolution', async () => {
      const mockHandler = jest.fn().mockResolvedValue('success' as never);
      const req = {} as Request;
      const res = {} as Response;
      const next = jest.fn() as NextFunction;

      const wrapped = catchAsync(mockHandler as any);
      wrapped(req, res, next);

      expect(mockHandler).toHaveBeenCalledWith(req, res, next);
      expect(next).not.toHaveBeenCalled();
    });

    it('should catch rejection and forward to next()', async () => {
      const error = new Error('Async failure');
      const mockHandler = jest.fn().mockRejectedValue(error as never);
      const req = {} as Request;
      const res = {} as Response;
      const next = jest.fn() as NextFunction;

      const wrapped = catchAsync(mockHandler as any);
      wrapped(req, res, next);

      // wait for microtask queue
      await Promise.resolve();

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('apiResponse', () => {
    const createMockRes = () => {
      const res = {} as Response;
      res.status = jest.fn().mockReturnValue(res) as any;
      res.json = jest.fn().mockReturnValue(res) as any;
      res.send = jest.fn().mockReturnValue(res) as any;
      return res;
    };

    it('sendSuccess should send 200 with standard envelope', () => {
      const res = createMockRes();
      sendSuccess(res, { item: 1 }, 'Success message');

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { item: 1 },
        message: 'Success message',
      });
    });

    it('sendCreated should send 201 status code', () => {
      const res = createMockRes();
      sendCreated(res, { id: 'new-id' });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { id: 'new-id' },
        message: 'Resource created successfully',
      });
    });

    it('sendNoContent should send 204 status without body', () => {
      const res = createMockRes();
      sendNoContent(res);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('sendPaginated should return items and pagination metadata', () => {
      const res = createMockRes();
      const pagination = {
        page: 1,
        limit: 10,
        total: 25,
        totalPages: 3,
        hasNextPage: true,
        hasPrevPage: false,
      };

      sendPaginated(res, ['a', 'b'], pagination);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: {
          items: ['a', 'b'],
          pagination,
        },
        message: 'Resources retrieved successfully',
      });
    });
  });

  describe('slugify', () => {
    it('should format normal strings to lowercase hyphenated slugs', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('CamTraffic AI!')).toBe('camtraffic-ai');
    });

    it('should remove accents and special characters', () => {
      expect(slugify('Café & Restaurant')).toBe('cafe-restaurant');
      expect(slugify('Multiple   Spaces -- and symbols @@!!')).toBe('multiple-spaces-and-symbols');
    });

    it('should handle empty and invalid values', () => {
      expect(slugify('')).toBe('');
      expect(slugify(null as any)).toBe('');
      expect(slugify(undefined as any)).toBe('');
    });
  });

  describe('pagination', () => {
    it('should parse page and limit and compute skip correctly', () => {
      const params = getPaginationParams({ page: '2', limit: '6' });
      expect(params).toEqual({ page: 2, limit: 6, skip: 6 });
    });

    it('should apply defaults when parameters are absent', () => {
      const params = getPaginationParams({});
      expect(params).toEqual({ page: 1, limit: 10, skip: 0 });
    });

    it('should enforce min page 1 and max limit 20', () => {
      const params = getPaginationParams({ page: '-5', limit: '100' });
      expect(params).toEqual({ page: 1, limit: 20, skip: 0 });
    });

    it('buildPaginationMetadata should calculate totalPages and flags', () => {
      const meta = buildPaginationMetadata(50, 1, 10);
      expect(meta).toEqual({
        page: 1,
        limit: 10,
        total: 50,
        totalPages: 5,
        hasNextPage: true,
        hasPrevPage: false,
      });

      const lastPageMeta = buildPaginationMetadata(50, 5, 10);
      expect(lastPageMeta.hasNextPage).toBe(false);
      expect(lastPageMeta.hasPrevPage).toBe(true);
    });
  });

  describe('readingTime', () => {
    it('should calculate 2 minutes for 400 words', () => {
      const text = 'word '.repeat(400);
      expect(calculateReadingTime(text)).toBe(2);
    });

    it('should return minimum 1 minute for small text', () => {
      expect(calculateReadingTime('Short paragraph with a few words.')).toBe(1);
    });

    it('should return 0 for empty or whitespace-only text', () => {
      expect(calculateReadingTime('')).toBe(0);
      expect(calculateReadingTime('   \n  ')).toBe(0);
      expect(calculateReadingTime(null as any)).toBe(0);
    });
  });
});
