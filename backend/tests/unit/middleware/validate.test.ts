import { describe, it, expect, jest } from '@jest/globals';
import express, { Request, Response, NextFunction } from 'express';
import request from 'supertest';
import { body } from 'express-validator';
import { validate } from '../../../src/middleware/validate.middleware';

describe('Validation Middleware', () => {
  it('should call next() when input passes validation', async () => {
    const middleware = validate([
      body('email').isEmail().withMessage('Invalid email format'),
    ]);

    const req = {
      body: { email: 'developer@example.com' },
    } as unknown as Request;
    const res = {} as Response;
    const next = jest.fn() as unknown as NextFunction;

    await middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  it('should return 400 with field errors when input fails validation', async () => {
    const middleware = validate([
      body('email').isEmail().withMessage('Invalid email format'),
    ]);

    const req = {
      body: { email: 'not-an-email' },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn() as unknown as NextFunction;

    await middleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Validation failed',
      errors: [
        {
          field: 'email',
          message: 'Invalid email format',
        },
      ],
    });
  });

  it('should collect multiple field validation errors', async () => {
    const middleware = validate([
      body('email').isEmail().withMessage('Invalid email address'),
      body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters'),
    ]);

    const req = {
      body: { email: 'invalid', password: '123' },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn() as unknown as NextFunction;

    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Validation failed',
      errors: [
        { field: 'email', message: 'Invalid email address' },
        { field: 'password', message: 'Password must be at least 8 characters' },
      ],
    });
  });

  it('should support a single validation chain passed directly', async () => {
    const middleware = validate(
      body('username').notEmpty().withMessage('Username is required'),
    );

    const req = {
      body: {},
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn() as unknown as NextFunction;

    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Validation failed',
      errors: [{ field: 'username', message: 'Username is required' }],
    });
  });

  it('should work seamlessly in an Express application route', async () => {
    const testApp = express();
    testApp.use(express.json());

    testApp.post(
      '/test-validation',
      validate([
        body('title').isString().notEmpty().withMessage('Title is required'),
        body('score').isInt({ min: 0 }).withMessage('Score must be non-negative'),
      ]),
      (_req: Request, res: Response) => {
        res.status(200).json({ success: true, data: 'passed' });
      },
    );

    // 1. Invalid request
    const invalidRes = await request(testApp)
      .post('/test-validation')
      .send({ title: '', score: -5 });

    expect(invalidRes.status).toBe(400);
    expect(invalidRes.body.success).toBe(false);
    expect(invalidRes.body.message).toBe('Validation failed');
    expect(invalidRes.body.errors).toHaveLength(2);
    expect(invalidRes.body.errors).toEqual([
      { field: 'title', message: 'Title is required' },
      { field: 'score', message: 'Score must be non-negative' },
    ]);

    // 2. Valid request
    const validRes = await request(testApp)
      .post('/test-validation')
      .send({ title: 'Full-Stack Portfolio', score: 100 });

    expect(validRes.status).toBe(200);
    expect(validRes.body).toEqual({ success: true, data: 'passed' });
  });
});
