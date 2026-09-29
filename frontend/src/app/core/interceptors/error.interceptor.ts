import {
  HttpInterceptorFn,
  HttpErrorResponse,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

/**
 * Functional HTTP Error Interceptor
 * Handles 401 token refresh queueing, global errors, and user notifications.
 * Aligned with PRD Section 10.3 and 14.2
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const notificationService = inject(NotificationService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        // 1. Handle 401 Unauthorized
        if (error.status === 401) {
          const isAuthEndpoint =
            req.url.includes('/auth/login') ||
            req.url.includes('/auth/refresh') ||
            req.url.includes('/auth/logout');

          if (isAuthEndpoint) {
            if (req.url.includes('/auth/refresh')) {
              authService.clearSession();
              redirectToLogin(router);
            }
            return throwError(() => error);
          }

          return handle401Error(req, next, authService, router);
        }

        // 2. Handle 403 Forbidden
        if (error.status === 403) {
          notificationService.error(
            error.error?.message || 'You do not have permission to perform this action.',
          );
          return throwError(() => error);
        }

        // 3. Handle Network Connection Error (status 0)
        if (error.status === 0) {
          notificationService.error(
            'Unable to connect to the server. Please check your network connection.',
          );
          return throwError(() => error);
        }

        // 4. Handle 5xx Server Errors
        if (error.status >= 500) {
          notificationService.error(
            error.error?.message || 'A server error occurred. Please try again later.',
          );
          return throwError(() => error);
        }
      }

      return throwError(() => error);
    }),
  );
};

/**
 * Queue concurrent 401 errors and retry with refreshed access token
 */
function handle401Error(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService,
  router: Router,
): Observable<HttpEvent<unknown>> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap((response) => {
        isRefreshing = false;
        const newToken = response?.data?.accessToken;
        if (newToken) {
          refreshTokenSubject.next(newToken);
          const clonedReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${newToken}`,
            },
          });
          return next(clonedReq);
        }

        authService.clearSession();
        redirectToLogin(router);
        return throwError(() => new Error('Failed to obtain new access token'));
      }),
      catchError((refreshError) => {
        isRefreshing = false;
        refreshTokenSubject.next(null);
        authService.clearSession();
        redirectToLogin(router);
        return throwError(() => refreshError);
      }),
    );
  }

  // If already refreshing, wait for new token to emit from subject
  return refreshTokenSubject.pipe(
    filter((token): token is string => token !== null),
    take(1),
    switchMap((token) => {
      const clonedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      return next(clonedReq);
    }),
  );
}

function redirectToLogin(router: Router): void {
  const currentUrl = router.url;
  if (currentUrl.startsWith('/admin') && !currentUrl.includes('/admin/login')) {
    router.navigate(['/admin/login'], { queryParams: { returnUrl: currentUrl } });
  }
}
