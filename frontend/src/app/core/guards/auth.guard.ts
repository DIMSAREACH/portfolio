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

  // Attempt silent refresh via HTTP-only cookie (e.g. on full page reload)
  return authService.refreshToken().pipe(
    map((response) => {
      if (response?.data?.accessToken && response?.data?.user) {
        return true;
      }
      return router.createUrlTree(['/admin/login'], {
        queryParams: { returnUrl: state.url },
      });
    }),
    catchError(() => {
      return of(
        router.createUrlTree(['/admin/login'], {
          queryParams: { returnUrl: state.url },
        }),
      );
    }),
  );
};
