import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Functional HTTP Interceptor to attach JWT Bearer token and enforce credentials
 * Aligned with PRD Section 10.3
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.accessToken();

  let modifiedReq = req;

  // Always enable credentials for cookie passing (refresh tokens)
  if (!modifiedReq.withCredentials) {
    modifiedReq = modifiedReq.clone({
      withCredentials: true,
    });
  }

  // Attach Authorization header if access token exists in memory and header isn't already present
  if (token && !modifiedReq.headers.has('Authorization')) {
    modifiedReq = modifiedReq.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(modifiedReq);
};
