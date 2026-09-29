import { Response } from 'express';

export interface PaginationMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T = unknown> {
  success: true;
  data: T;
  message: string;
}

export interface PaginatedData<T> {
  items: T[];
  pagination: PaginationMetadata;
}

export function sendSuccess<T = unknown>(
  res: Response,
  data: T,
  message = 'Operation completed successfully',
  statusCode = 200,
): Response {
  const body: ApiResponse<T> = {
    success: true,
    data,
    message,
  };
  return res.status(statusCode).json(body);
}

export function sendCreated<T = unknown>(
  res: Response,
  data: T,
  message = 'Resource created successfully',
): Response {
  return sendSuccess(res, data, message, 201);
}

export function sendNoContent(res: Response): Response {
  return res.status(204).send();
}

export function sendPaginated<T>(
  res: Response,
  items: T[],
  pagination: PaginationMetadata,
  message = 'Resources retrieved successfully',
): Response {
  return sendSuccess<PaginatedData<T>>(
    res,
    {
      items,
      pagination,
    },
    message,
    200,
  );
}
