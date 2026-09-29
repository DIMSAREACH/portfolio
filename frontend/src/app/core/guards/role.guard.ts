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
 * Functional Route Guard to verify user roles per PRD Section 10.3 & 10.5.
 * Expected route data: { role?: string; roles?: string[] }
 */
export const roleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): Observable<boolean | UrlTree> | boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const checkRole = (): boolean | UrlTree => {
    const user = authService.currentUser();
    if (!user) {
      return router.createUrlTree(['/admin/login'], {
        queryParams: { returnUrl: state.url },
      });
    }

    const expectedRole = route.data['role'] as string | undefined;
    const expectedRoles = route.data['roles'] as string[] | undefined;

    const allowedRoles: string[] = [];
    if (expectedRole) {
      allowedRoles.push(expectedRole);
    }
    if (Array.isArray(expectedRoles)) {
      allowedRoles.push(...expectedRoles);
    }

    // If no specific role requirements, grant access to any authenticated user
    if (allowedRoles.length === 0) {
      return true;
    }

    if (allowedRoles.includes(user.role)) {
      return true;
    }

    // User is authenticated but lacks required role
    return router.createUrlTree(['/admin/dashboard']);
  };

  if (authService.isAuthenticated()) {
    return checkRole();
  }

  // Attempt silent refresh first
  return authService.refreshToken().pipe(
    map(() => checkRole()),
    catchError(() => {
      return of(
        router.createUrlTree(['/admin/login'], {
          queryParams: { returnUrl: state.url },
        }),
      );
    }),
  );
};
