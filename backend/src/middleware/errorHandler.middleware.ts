import { Request, Response, NextFunction } from 'express';
import { FieldError } from '../utils/AppError';
import config from '../config/environment';
import logger from '../utils/logger';

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: FieldError[];
  stack?: string;
}

export interface ExtendedError extends Partial<Error> {
  name?: string;
  message?: string;
  stack?: string;
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
  errors?: FieldError[] | Record<string, { message?: string }>;
  code?: number;
  keyValue?: Record<string, unknown>;
  path?: string;
  value?: unknown;
}

export function errorHandler(
  err: ExtendedError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors: FieldError[] | undefined = undefined;
  let isOperational = err.isOperational || false;

  // 1. Mongoose Validation Error (or custom ValidationError with errors)
  if (err.name === 'ValidationError' && err.errors) {
    statusCode = 400;
    message = err.message || 'Validation failed';
    isOperational = true;
    if (Array.isArray(err.errors)) {
      errors = err.errors;
    } else {
      errors = Object.keys(err.errors).map((key) => ({
        field: key,
        message: (err.errors as Record<string, { message?: string }>)[key]?.message || 'Invalid value',
      }));
    }
  } else if (Array.isArray(err.errors)) {
    errors = err.errors;
  }

  // 2. Mongoose CastError (e.g. invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
    isOperational = true;
  }

  // 3. Mongoose Duplicate Key Error (E11000)
  if (err.code === 11000) {
    statusCode = 409;
    const duplicateFields = err.keyValue ? Object.keys(err.keyValue).join(', ') : 'field';
    message = `Duplicate field value entered: ${duplicateFields}`;
    isOperational = true;
  }

  // 4. JWT Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please log in again.';
    isOperational = true;
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Your token has expired. Please log in again.';
    isOperational = true;
  }

  // Log non-operational or 500 server errors
  if (!isOperational || statusCode >= 500) {
    logger.error(`${err.name || 'Error'}: ${err.message}`, {
      statusCode,
      stack: err.stack,
    });
  }

  // Non-operational errors in production should not leak internal details
  if (config.NODE_ENV === 'production' && !isOperational && statusCode === 500) {
    message = 'Something went wrong. Please try again later.';
  }

  const responseBody: ErrorResponse = {
    success: false,
    message,
    ...(errors && errors.length > 0 ? { errors } : {}),
  };

  if (config.NODE_ENV === 'development' && err.stack) {
    responseBody.stack = err.stack;
  }

  res.status(statusCode).json(responseBody);
}

export default errorHandler;
