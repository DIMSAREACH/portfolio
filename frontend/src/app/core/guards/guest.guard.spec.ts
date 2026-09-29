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
import { guestGuard } from './guest.guard';
import { AuthService } from '../services/auth.service';
import { User, ApiResponse, AuthResponse } from '../models';

describe('guestGuard', () => {
  let router: Router;
  let authServiceMock: {
    isAuthenticated: ReturnType<typeof vi.fn>;
    refreshToken: ReturnType<typeof vi.fn>;
  };

  const mockUser: User = {
    _id: 'user123',
    email: 'admin@portfolio.dev',
    fullName: 'Admin User',
    role: 'admin',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockRoute = {} as ActivatedRouteSnapshot;
  const mockState = { url: '/admin/login' } as RouterStateSnapshot;

  beforeEach(() => {
    authServiceMock = {
      isAuthenticated: vi.fn(),
      refreshToken: vi.fn(),
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
    route: ActivatedRouteSnapshot = mockRoute,
    state: RouterStateSnapshot = mockState,
  ): Promise<GuardResult> {
    const result = TestBed.runInInjectionContext(() => guestGuard(route, state));
    if (isObservable(result)) {
      return firstValueFrom(result);
    }
    return result;
  }

  it('should redirect to /admin/dashboard if already authenticated in memory', async () => {
    authServiceMock.isAuthenticated.mockReturnValue(true);

    const result = await runGuard();

    expect(result instanceof UrlTree).toBe(true);
    const targetUrl = router.serializeUrl(result as UrlTree);
    expect(targetUrl).toBe('/admin/dashboard');
    expect(authServiceMock.refreshToken).not.toHaveBeenCalled();
  });

  it('should redirect to /admin/dashboard if silent refreshToken succeeds', async () => {
    authServiceMock.isAuthenticated.mockReturnValue(false);
    authServiceMock.refreshToken.mockReturnValue(
      of({
        success: true,
        data: {
          accessToken: 'fresh_jwt',
          user: mockUser,
        },
      } as ApiResponse<AuthResponse>),
    );

    const result = await runGuard();

    expect(result instanceof UrlTree).toBe(true);
    const targetUrl = router.serializeUrl(result as UrlTree);
    expect(targetUrl).toBe('/admin/dashboard');
    expect(authServiceMock.refreshToken).toHaveBeenCalled();
  });

  it('should allow access (return true) if refreshToken fails', async () => {
    authServiceMock.isAuthenticated.mockReturnValue(false);
    authServiceMock.refreshToken.mockReturnValue(
      throwError(() => new Error('No active session')),
    );

    const result = await runGuard();

    expect(result).toBe(true);
  });

  it('should allow access (return true) if refreshToken returns without session', async () => {
    authServiceMock.isAuthenticated.mockReturnValue(false);
    authServiceMock.refreshToken.mockReturnValue(
      of({
        success: false,
        data: undefined,
      } as unknown as ApiResponse<AuthResponse>),
    );

    const result = await runGuard();

    expect(result).toBe(true);
  });
});
