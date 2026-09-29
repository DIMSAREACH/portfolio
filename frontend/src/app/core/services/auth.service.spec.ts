import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { ApiService } from './api.service';
import { User, AuthResponse, ApiResponse } from '../models';

describe('AuthService', () => {
  let service: AuthService;
  let apiServiceMock: {
    get: ReturnType<typeof vi.fn>;
    post: ReturnType<typeof vi.fn>;
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
    apiServiceMock = {
      get: vi.fn(),
      post: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: ApiService, useValue: apiServiceMock },
      ],
    });

    service = TestBed.inject(AuthService);
  });

  it('should initialize with null user, null token, and isAuthenticated = false', () => {
    expect(service.currentUser()).toBeNull();
    expect(service.accessToken()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should authenticate user and store token in memory on successful login', () => {
    const mockResponse: ApiResponse<AuthResponse> = {
      success: true,
      message: 'Login successful',
      data: {
        user: mockUser,
        accessToken: 'jwt_mock_token_123',
      },
    };
    apiServiceMock.post.mockReturnValue(of(mockResponse));

    service.login({ email: 'admin@portfolio.dev', password: 'password' }).subscribe((res) => {
      expect(res.data.accessToken).toBe('jwt_mock_token_123');
    });

    expect(apiServiceMock.post).toHaveBeenCalledWith('/auth/login', {
      email: 'admin@portfolio.dev',
      password: 'password',
    });
    expect(service.currentUser()).toEqual(mockUser);
    expect(service.accessToken()).toBe('jwt_mock_token_123');
    expect(service.isAuthenticated()).toBe(true);
  });

  it('should clear session on logout', () => {
    service.setSession(mockUser, 'token_xyz');
    expect(service.isAuthenticated()).toBe(true);

    apiServiceMock.post.mockReturnValue(of({ success: true, message: 'Logged out', data: null }));

    service.logout().subscribe();

    expect(service.currentUser()).toBeNull();
    expect(service.accessToken()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should clear session on logout even if server request fails', () => {
    service.setSession(mockUser, 'token_xyz');

    apiServiceMock.post.mockReturnValue(throwError(() => new Error('Server error')));

    service.logout().subscribe({
      error: () => {
        expect(service.currentUser()).toBeNull();
        expect(service.accessToken()).toBeNull();
        expect(service.isAuthenticated()).toBe(false);
      },
    });
  });

  it('should update session on successful refreshToken', () => {
    const refreshResponse: ApiResponse<AuthResponse> = {
      success: true,
      message: 'Token refreshed',
      data: {
        user: mockUser,
        accessToken: 'new_token_456',
      },
    };
    apiServiceMock.post.mockReturnValue(of(refreshResponse));

    service.refreshToken().subscribe((res) => {
      expect(res.data.accessToken).toBe('new_token_456');
    });

    expect(service.accessToken()).toBe('new_token_456');
    expect(service.currentUser()).toEqual(mockUser);
    expect(service.isAuthenticated()).toBe(true);
  });

  it('should clear session on failed refreshToken', () => {
    service.setSession(mockUser, 'old_token');

    apiServiceMock.post.mockReturnValue(throwError(() => new Error('Invalid refresh token')));

    service.refreshToken().subscribe({
      error: () => {
        expect(service.accessToken()).toBeNull();
        expect(service.currentUser()).toBeNull();
        expect(service.isAuthenticated()).toBe(false);
      },
    });
  });

  it('should update currentUser on getMe()', () => {
    const meResponse: ApiResponse<User> = {
      success: true,
      message: 'Profile retrieved',
      data: mockUser,
    };
    apiServiceMock.get.mockReturnValue(of(meResponse));

    service.getMe().subscribe();

    expect(service.currentUser()).toEqual(mockUser);
  });
});
