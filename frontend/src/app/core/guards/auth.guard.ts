import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { of, map, catchError, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Functional Route Guard to protect admin routes per PRD Section 10.3.
 * Redirects unauthenticated users to `/admin/login` with the return URL preserved.
 */
export const authGuard: CanActivateFn = (
  _route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): Observable<boolean | UrlTree> | boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // If already authenticated in memory, allow immediate access
  if (authService.isAuthenticated()) {
    return true;
  }

  // If user has no active session hint, redirect directly to login without triggering 401
  if (typeof authService.hasSessionHint === 'function' && !authService.hasSessionHint()) {
    return router.createUrlTree(['/admin/login'], {
      queryParams: { returnUrl: state.url },
    });
  }

  // Attempt silent refresh via HTTP-only cookie (e.g. on full page reload with active session)
  return authService.refreshToken().pipe(
    map((response) => {
      if (response?.data?.accessToken && response?.data?.user) {
        return true;
      }
      if (typeof authService.clearSession === 'function') {
        authService.clearSession();
      }
      return router.createUrlTree(['/admin/login'], {
        queryParams: { returnUrl: state.url },
      });
    }),
    catchError(() => {
      if (typeof authService.clearSession === 'function') {
        authService.clearSession();
      }
      return of(
        router.createUrlTree(['/admin/login'], {
          queryParams: { returnUrl: state.url },
        }),
      );
    }),
  );
};
