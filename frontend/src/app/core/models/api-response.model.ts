/**
 * Standard API Response and Pagination Models
 * Aligned with PRD Sections 13 and 14
 */

export interface BilingualField {
  en: string;
  kh: string;
}

export interface BilingualArrayField {
  en: string[];
  kh: string[];
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  [key: string]: unknown;
}

export interface PaginationResult {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedData<T> {
  items: T[];
  pagination: PaginationResult;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message: string;
}

export type PaginatedResponse<T> = ApiResponse<PaginatedData<T>>;

export interface FieldError {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: FieldError[];
  stack?: string;
}
