import './express';

/**
 * Shared Type Definitions for Developer Portfolio & CMS Platform
 */

/**
 * User payload attached to authenticated Express requests
 */
export interface AuthUser {
  userId: string;
  role: 'admin' | string;
}

/**
 * Bilingual text field supporting English (en) and Khmer (kh)
 */
export interface BilingualField {
  en: string;
  kh: string;
}

/**
 * Bilingual array of strings supporting English (en) and Khmer (kh)
 */
export interface BilingualArrayField {
  en: string[];
  kh: string[];
}

/**
 * Query parameters for paginated endpoints
 */
export interface PaginationQuery {
  page?: string;
  limit?: string;
  sort?: string;
  [key: string]: unknown;
}

/**
 * Calculated pagination metadata returned in responses
 */
export interface PaginationResult {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Standard API response envelope
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message: string;
}

/**
 * Paginated data payload container
 */
export interface PaginatedData<T> {
  items: T[];
  pagination: PaginationResult;
}

/**
 * Standard paginated API response
 */
export interface PaginatedApiResponse<T> {
  success: boolean;
  data: PaginatedData<T>;
  message: string;
}

/**
 * Field-level validation or domain error
 */
export interface FieldError {
  field: string;
  message: string;
}

/**
 * Standard API error response envelope
 */
export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: FieldError[];
  stack?: string;
}
