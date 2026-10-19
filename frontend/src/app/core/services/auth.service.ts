import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, from, tap, catchError, throwError, finalize, switchMap } from 'rxjs';
import { ApiService } from './api.service';
import { FirebaseAuthService } from './firebase-auth.service';
import {
  User,
  LoginCredentials,
  AuthResponse,
  ChangePasswordRequest,
  ApiResponse,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiService = inject(ApiService);
  private readonly firebaseAuthService = inject(FirebaseAuthService);

  /**
   * Signal-based state management per PRD Section 10.2
   * Access token is stored strictly IN MEMORY (never localStorage)
   */
  public readonly currentUser = signal<User | null>(null);
  public readonly accessToken = signal<string | null>(null);
  public readonly isLoading = signal<boolean>(false);
  public readonly isExplicitlyLoggedOut = signal<boolean>(false);

  /**
   * Computed boolean indicating if user is currently authenticated
   */
  public readonly isAuthenticated = computed<boolean>(
    () => !!this.currentUser() && !!this.accessToken(),
  );

  /**
   * Authenticate admin user
   */
  public login(credentials: LoginCredentials): Observable<ApiResponse<AuthResponse>> {
    this.isLoading.set(true);
    return this.apiService
      .post<ApiResponse<AuthResponse>>('/auth/login', credentials)
      .pipe(
        tap((response) => {
          if (response?.data?.accessToken && response?.data?.user) {
            this.setSession(
              response.data.user,
              response.data.accessToken,
              response.data.refreshToken,
            );
          }
        }),
        finalize(() => this.isLoading.set(false)),
      );
  }

  /**
   * Authenticate admin user with Firebase ID Token
   */
  public loginWithFirebaseToken(idToken: string): Observable<ApiResponse<AuthResponse>> {
    this.isLoading.set(true);
    return this.apiService
      .post<ApiResponse<AuthResponse>>('/auth/firebase', { idToken })
      .pipe(
        tap((response) => {
          if (response?.data?.accessToken && response?.data?.user) {
            this.setSession(
              response.data.user,
              response.data.accessToken,
              response.data.refreshToken,
            );
          }
        }),
        finalize(() => this.isLoading.set(false)),
      );
  }

  /**
   * Authenticate admin user with Firebase Email and Password
   */
  public loginWithFirebase(email: string, password: string): Observable<ApiResponse<AuthResponse>> {
    this.isLoading.set(true);
    return from(this.firebaseAuthService.signInWithEmail(email, password)).pipe(
      switchMap((idToken) => this.loginWithFirebaseToken(idToken)),
      finalize(() => this.isLoading.set(false)),
    );
  }

  /**
   * Clear session and revoke refresh token on backend
   */
  public logout(): Observable<ApiResponse<null>> {
    this.isLoading.set(true);
    this.isExplicitlyLoggedOut.set(true);
    this.firebaseAuthService.logout();
    return this.apiService.post<ApiResponse<null>>('/auth/logout', {}).pipe(
      tap(() => this.clearSession()),
      catchError((err) => {
        // Even if server logout fails, clear local memory session
        this.clearSession();
        return throwError(() => err);
      }),
      finalize(() => {
        this.clearSession();
        this.isLoading.set(false);
      }),
    );
  }

  /**
   * Retrieve cached refresh token from client storage
   */
  public getStoredRefreshToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        return localStorage.getItem('portfolio_refresh_token');
      } catch {
        return null;
      }
    }
    return null;
  }

  public setStoredRefreshToken(token: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem('portfolio_refresh_token', token);
      } catch {
        // Silently continue
      }
    }
  }

  /**
   * Silent refresh token using HTTP-only cookie or body payload fallback
   */
  public refreshToken(): Observable<ApiResponse<AuthResponse>> {
    const storedToken = this.getStoredRefreshToken();
    const payload = storedToken ? { refreshToken: storedToken } : {};

    return this.apiService.post<ApiResponse<AuthResponse>>('/auth/refresh', payload).pipe(
      tap((response) => {
        if (response?.data?.accessToken) {
          this.accessToken.set(response.data.accessToken);
          if (response.data.user) {
            this.currentUser.set(response.data.user);
          }
          if (response.data.refreshToken) {
            this.setStoredRefreshToken(response.data.refreshToken);
          }
          this.isExplicitlyLoggedOut.set(false);
        }
      }),
      catchError((error) => {
        this.clearSession();
        return throwError(() => error);
      }),
    );
  }

  /**
   * Fetch current authenticated user profile
   */
  public getMe(): Observable<ApiResponse<User>> {
    return this.apiService.get<ApiResponse<User>>('/auth/me').pipe(
      tap((response) => {
        if (response?.data) {
          this.currentUser.set(response.data);
        }
      }),
    );
  }

  /**
   * Change admin password
   */
  public changePassword(request: ChangePasswordRequest): Observable<ApiResponse<null>> {
    return this.apiService.post<ApiResponse<null>>('/auth/change-password', request);
  }

  /**
   * Request password reset instructions
   */
  public forgotPassword(
    email: string,
  ): Observable<ApiResponse<{ message: string; resetUrl?: string }>> {
    return this.apiService.post<ApiResponse<{ message: string; resetUrl?: string }>>(
      '/auth/forgot-password',
      { email },
    );
  }

  /**
   * Complete password reset with token
   */
  public resetPassword(token: string, password: string): Observable<ApiResponse<null>> {
    return this.apiService.post<ApiResponse<null>>('/auth/reset-password', {
      token,
      password,
    });
  }

  /**
   * Check whether an active session hint exists in client storage
   */
  public hasSessionHint(): boolean {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        return (
          localStorage.getItem('portfolio_has_session') === '1' ||
          !!localStorage.getItem('portfolio_refresh_token')
        );
      } catch {
        return false;
      }
    }
    return false;
  }

  /**
   * Internal session setters
   */
  public setSession(user: User, token: string, refreshToken?: string): void {
    this.isExplicitlyLoggedOut.set(false);
    this.currentUser.set(user);
    this.accessToken.set(token);
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem('portfolio_has_session', '1');
        if (refreshToken) {
          localStorage.setItem('portfolio_refresh_token', refreshToken);
        }
      } catch {
        // Silently continue in environments without localStorage
      }
    }
  }

  public clearSession(): void {
    this.currentUser.set(null);
    this.accessToken.set(null);
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.removeItem('portfolio_has_session');
        localStorage.removeItem('portfolio_refresh_token');
      } catch {
        // Silently continue in environments without localStorage
      }
    }
  }
}
