import { PaginationMetadata } from './apiResponse';

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export interface PaginationQuery {
  page?: string | number;
  limit?: string | number;
}

/**
 * Parses page and limit parameters with boundary checks.
 * Enforces min page = 1, default limit = 10, max limit = 20.
 */
export function getPaginationParams(query: PaginationQuery = {}): PaginationParams {
  let page = parseInt(String(query.page), 10);
  if (isNaN(page) || page < 1) {
    page = 1;
  }

  let limit = parseInt(String(query.limit), 10);
  if (isNaN(limit) || limit < 1) {
    limit = 10;
  } else if (limit > 20) {
    limit = 20;
  }

  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

/**
 * Computes pagination metadata given total item count, current page, and page limit.
 */
export function buildPaginationMetadata(
  total: number,
  page: number,
  limit: number,
): PaginationMetadata {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage,
    hasPrevPage,
  };
}

export default getPaginationParams;
