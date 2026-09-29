import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { errorInterceptor } from './error.interceptor';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { AuthResponse, ApiResponse, User } from '../models';

describe('errorInterceptor', () => {
  let http: HttpClient;
  let httpTesting: HttpTestingController;
  let authServiceMock: {
    refreshToken: ReturnType<typeof vi.fn>;
    clearSession: ReturnType<typeof vi.fn>;
  };
  let notificationServiceMock: {
    error: ReturnType<typeof vi.fn>;
    success: ReturnType<typeof vi.fn>;
    warning: ReturnType<typeof vi.fn>;
    info: ReturnType<typeof vi.fn>;
  };
  let routerMock: {
    navigate: ReturnType<typeof vi.fn>;
    url: string;
  };

  const mockUser: User = {
    _id: 'u1',
    email: 'admin@portfolio.dev',
    fullName: 'Admin',
    role: 'admin',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    authServiceMock = {
      refreshToken: vi.fn(),
      clearSession: vi.fn(),
    };

    notificationServiceMock = {
      error: vi.fn(),
      success: vi.fn(),
      warning: vi.fn(),
      info: vi.fn(),
    };

    routerMock = {
      navigate: vi.fn(),
      url: '/admin/dashboard',
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should attempt token refresh and retry request on 401 error', () => {
    const refreshResponse: ApiResponse<AuthResponse> = {
      success: true,
      message: 'Refreshed',
      data: {
        accessToken: 'new_token_789',
        user: mockUser,
      },
    };
    authServiceMock.refreshToken.mockReturnValue(of(refreshResponse));

    http.get('/api/v1/admin/stats').subscribe((res) => {
      expect(res).toEqual({ count: 42 });
    });

    // Initial request fails with 401
    const req1 = httpTesting.expectOne('/api/v1/admin/stats');
    req1.flush({ message: 'Token expired' }, { status: 401, statusText: 'Unauthorized' });

    expect(authServiceMock.refreshToken).toHaveBeenCalled();

    // Retried request with new token
    const req2 = httpTesting.expectOne('/api/v1/admin/stats');
    expect(req2.request.headers.get('Authorization')).toBe('Bearer new_token_789');
    req2.flush({ count: 42 });
  });

  it('should clear session and redirect on failed token refresh', () => {
    authServiceMock.refreshToken.mockReturnValue(throwError(() => new Error('Refresh expired')));

    http.get('/api/v1/admin/projects').subscribe({
      error: (err) => {
        expect(err).toBeTruthy();
      },
    });

    const req = httpTesting.expectOne('/api/v1/admin/projects');
    req.flush({ message: 'Token expired' }, { status: 401, statusText: 'Unauthorized' });

    expect(authServiceMock.clearSession).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/admin/login'], {
      queryParams: { returnUrl: '/admin/dashboard' },
    });
  });

  it('should not attempt token refresh if 401 occurs on /auth/login', () => {
    http.post('/api/v1/auth/login', {}).subscribe({
      error: (err) => {
        expect(err.status).toBe(401);
      },
    });

    const req = httpTesting.expectOne('/api/v1/auth/login');
    req.flush({ message: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });

    expect(authServiceMock.refreshToken).not.toHaveBeenCalled();
  });

  it('should show error notification on 403 Forbidden', () => {
    http.get('/api/v1/admin/secure').subscribe({
      error: (err) => {
        expect(err.status).toBe(403);
      },
    });

    const req = httpTesting.expectOne('/api/v1/admin/secure');
    req.flush({ message: 'Access denied' }, { status: 403, statusText: 'Forbidden' });

    expect(notificationServiceMock.error).toHaveBeenCalledWith('Access denied');
  });

  it('should show connection error notification on status 0', () => {
    http.get('/api/v1/data').subscribe({
      error: (err) => {
        expect(err.status).toBe(0);
      },
    });

    const req = httpTesting.expectOne('/api/v1/data');
    req.error(new ProgressEvent('error'), { status: 0, statusText: 'Unknown Error' });

    expect(notificationServiceMock.error).toHaveBeenCalledWith(
      expect.stringContaining('Unable to connect to the server'),
    );
  });

  it('should show server error notification on 500 Internal Server Error', () => {
    http.get('/api/v1/crash').subscribe({
      error: (err) => {
        expect(err.status).toBe(500);
      },
    });

    const req = httpTesting.expectOne('/api/v1/crash');
    req.flush({ message: 'Database crash' }, { status: 500, statusText: 'Server Error' });

    expect(notificationServiceMock.error).toHaveBeenCalledWith('Database crash');
  });
});
