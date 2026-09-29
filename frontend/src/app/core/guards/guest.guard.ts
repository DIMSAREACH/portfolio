import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { of, map, catchError, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Functional Route Guard for guest routes (e.g., /admin/login).
 * If user is already authenticated, redirects them to /admin/dashboard.
 */
export const guestGuard: CanActivateFn = (
): Observable<boolean | UrlTree> | boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // If already authenticated in memory, redirect away from guest route
  if (authService.isAuthenticated()) {
    return router.createUrlTree(['/admin/dashboard']);
  }

  // Attempt silent refresh to check for active cookie session
  return authService.refreshToken().pipe(
    map((response) => {
      if (response?.data?.accessToken && response?.data?.user) {
        return router.createUrlTree(['/admin/dashboard']);
      }
      return true;
    }),
    catchError(() => {
      return of(true);
    }),
  );
};
