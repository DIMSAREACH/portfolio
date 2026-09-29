import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
  GuardResult,
  provideRouter,
} from '@angular/router';
import { isObservable, firstValueFrom, of, throwError } from 'rxjs';
import { roleGuard } from './role.guard';
import { AuthService } from '../services/auth.service';
import { User, ApiResponse, AuthResponse } from '../models';

describe('roleGuard', () => {
  let router: Router;
  let authServiceMock: {
    isAuthenticated: ReturnType<typeof vi.fn>;
    refreshToken: ReturnType<typeof vi.fn>;
    currentUser: ReturnType<typeof vi.fn>;
  };

  const mockAdminUser: User = {
    _id: 'user123',
    email: 'admin@portfolio.dev',
    fullName: 'Admin User',
    role: 'admin',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockState = { url: '/admin/settings' } as RouterStateSnapshot;

  beforeEach(() => {
    authServiceMock = {
      isAuthenticated: vi.fn(),
      refreshToken: vi.fn(),
      currentUser: vi.fn().mockReturnValue(mockAdminUser),
    };

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
      ],
    });

    router = TestBed.inject(Router);
  });

  async function runGuard(
    route: Partial<ActivatedRouteSnapshot>,
    state: RouterStateSnapshot = mockState,
  ): Promise<GuardResult> {
    const result = TestBed.runInInjectionContext(() =>
      roleGuard(route as ActivatedRouteSnapshot, state),
    );
    if (isObservable(result)) {
      return firstValueFrom(result);
    }
    return result;
  }

  it('should allow access if user has the single specified role', async () => {
    authServiceMock.isAuthenticated.mockReturnValue(true);
    const route = { data: { role: 'admin' } };

    const result = await runGuard(route);

    expect(result).toBe(true);
  });

  it('should allow access if user role is in the specified roles array', async () => {
    authServiceMock.isAuthenticated.mockReturnValue(true);
    const route = { data: { roles: ['editor', 'admin'] } };

    const result = await runGuard(route);

    expect(result).toBe(true);
  });

  it('should allow access if no role requirement is specified on the route', async () => {
    authServiceMock.isAuthenticated.mockReturnValue(true);
    const route = { data: {} };

    const result = await runGuard(route);

    expect(result).toBe(true);
  });

  it('should redirect to /admin/dashboard if user does not match the required role', async () => {
    authServiceMock.isAuthenticated.mockReturnValue(true);
    const route = { data: { role: 'superadmin' } };

    const result = await runGuard(route);

    expect(result instanceof UrlTree).toBe(true);
    const targetUrl = router.serializeUrl(result as UrlTree);
    expect(targetUrl).toBe('/admin/dashboard');
  });

  it('should attempt silent refreshToken when not yet authenticated in memory', async () => {
    authServiceMock.isAuthenticated.mockReturnValue(false);
    authServiceMock.refreshToken.mockReturnValue(
      of({
        success: true,
        data: {
          accessToken: 'refreshed_token',
          user: mockAdminUser,
        },
      } as ApiResponse<AuthResponse>),
    );
    const route = { data: { role: 'admin' } };

    const result = await runGuard(route);

    expect(result).toBe(true);
    expect(authServiceMock.refreshToken).toHaveBeenCalled();
  });

  it('should redirect to /admin/login if unauthenticated and refreshToken fails', async () => {
    authServiceMock.isAuthenticated.mockReturnValue(false);
    authServiceMock.refreshToken.mockReturnValue(
      throwError(() => new Error('Refresh error')),
    );
    const route = { data: { role: 'admin' } };

    const result = await runGuard(route);

    expect(result instanceof UrlTree).toBe(true);
    const targetUrl = router.serializeUrl(result as UrlTree);
    expect(targetUrl).toBe('/admin/login?returnUrl=%2Fadmin%2Fsettings');
  });
});
