import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, tap, catchError, throwError, finalize } from 'rxjs';
import { ApiService } from './api.service';
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

  /**
   * Signal-based state management per PRD Section 10.2
   * Access token is stored strictly IN MEMORY (never localStorage)
   */
  public readonly currentUser = signal<User | null>(null);
  public readonly accessToken = signal<string | null>(null);
  public readonly isLoading = signal<boolean>(false);

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
            this.setSession(response.data.user, response.data.accessToken);
          }
        }),
        finalize(() => this.isLoading.set(false)),
      );
  }

  /**
   * Clear session and revoke refresh token on backend
   */
  public logout(): Observable<ApiResponse<null>> {
    this.isLoading.set(true);
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
   * Silent refresh token using HTTP-only cookie
   */
  public refreshToken(): Observable<ApiResponse<AuthResponse>> {
    return this.apiService.post<ApiResponse<AuthResponse>>('/auth/refresh', {}).pipe(
      tap((response) => {
        if (response?.data?.accessToken && response?.data?.user) {
          this.setSession(response.data.user, response.data.accessToken);
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
   * Internal session setters
   */
  public setSession(user: User, token: string): void {
    this.currentUser.set(user);
    this.accessToken.set(token);
  }

  public clearSession(): void {
    this.currentUser.set(null);
    this.accessToken.set(null);
  }
}
