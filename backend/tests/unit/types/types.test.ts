import { describe, it, expect } from '@jest/globals';
import { Request } from 'express';
import {
  AuthUser,
  BilingualField,
  BilingualArrayField,
  PaginationQuery,
  PaginationResult,
  ApiResponse,
  PaginatedApiResponse,
  FieldError,
  ApiErrorResponse,
} from '../../../src/types';

describe('TypeScript Type Definitions', () => {
  it('should support AuthUser on Express Request via declaration merging', () => {
    const mockReq = {} as Request;
    const testUser: AuthUser = {
      userId: 'user_67890',
      role: 'admin',
    };

    mockReq.user = testUser;

    expect(mockReq.user).toBeDefined();
    expect(mockReq.user?.userId).toBe('user_67890');
    expect(mockReq.user?.role).toBe('admin');
  });

  it('should instantiate BilingualField correctly with en and kh properties', () => {
    const title: BilingualField = {
      en: 'Senior Full Stack Developer',
      kh: 'អ្នកអភិវឌ្ឍន៍ Full Stack ជាន់ខ្ពស់',
    };

    expect(title.en).toBe('Senior Full Stack Developer');
    expect(title.kh).toBe('អ្នកអភិវឌ្ឍន៍ Full Stack ជាន់ខ្ពស់');
  });

  it('should instantiate BilingualArrayField with string arrays', () => {
    const responsibilities: BilingualArrayField = {
      en: ['Architected microservices', 'Mentored juniors'],
      kh: ['រៀបចំរចនាសម្ព័ន្ធ microservices', 'ជួយបង្ហាត់បង្រៀនសមាជិកថ្មី'],
    };

    expect(responsibilities.en).toHaveLength(2);
    expect(responsibilities.kh).toHaveLength(2);
  });

  it('should structure PaginationQuery and PaginationResult correctly', () => {
    const query: PaginationQuery = {
      page: '1',
      limit: '10',
      sort: '-createdAt',
      filter: 'active',
    };

    const result: PaginationResult = {
      page: 1,
      limit: 10,
      total: 42,
      totalPages: 5,
      hasNextPage: true,
      hasPrevPage: false,
    };

    expect(query.page).toBe('1');
    expect(query.limit).toBe('10');
    expect(result.totalPages).toBe(5);
    expect(result.hasNextPage).toBe(true);
    expect(result.hasPrevPage).toBe(false);
  });

  it('should structure ApiResponse and PaginatedApiResponse envelopes', () => {
    const successRes: ApiResponse<{ name: string }> = {
      success: true,
      data: { name: 'Portfolio CMS' },
      message: 'Project loaded successfully',
    };

    const paginatedRes: PaginatedApiResponse<string> = {
      success: true,
      data: {
        items: ['project-1', 'project-2'],
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        },
      },
      message: 'Projects retrieved',
    };

    expect(successRes.success).toBe(true);
    expect(successRes.data?.name).toBe('Portfolio CMS');
    expect(paginatedRes.data.items).toHaveLength(2);
    expect(paginatedRes.data.pagination.total).toBe(2);
  });

  it('should structure FieldError and ApiErrorResponse envelopes', () => {
    const fieldErr: FieldError = {
      field: 'email',
      message: 'Email is required',
    };

    const errorRes: ApiErrorResponse = {
      success: false,
      message: 'Validation failed',
      errors: [fieldErr],
    };

    expect(errorRes.success).toBe(false);
    expect(errorRes.errors?.[0].field).toBe('email');
  });
});
