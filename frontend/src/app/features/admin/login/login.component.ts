import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
      <div class="w-full max-w-md space-y-8">
        <!-- Logo and Title Header -->
        <div class="text-center space-y-3">
          <a
            routerLink="/"
            class="inline-flex items-center gap-2 group text-decoration-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 rounded-xl p-1"
          >
            <div
              class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform"
            >
              S
            </div>
          </a>

          <h1 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Admin Portal
          </h1>

          <p class="text-sm text-slate-500 dark:text-slate-400">
            Sign in to manage your portfolio content, projects, and articles.
          </p>
        </div>

        <!-- Login Card -->
        <div class="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-6">
          <!-- Error Alert Banner -->
          @if (errorMessage()) {
            <div
              id="login-error-alert"
              class="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-200 text-sm flex items-start gap-3 animate-fadeIn"
            >
              <svg class="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="font-medium text-xs sm:text-sm">{{ errorMessage() }}</p>
            </div>
          }

          <!-- Form Element -->
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-5" novalidate>
            <!-- Email Field -->
            <div class="space-y-1.5">
              <label for="admin-email" class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  id="admin-email"
                  type="email"
                  formControlName="email"
                  placeholder="admin@example.com"
                  autocomplete="username"
                  class="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  [ngClass]="{
                    'border-rose-400 dark:border-rose-500/80 bg-rose-50/20': isFieldInvalid('email'),
                    'border-slate-200 dark:border-slate-700': !isFieldInvalid('email')
                  }"
                />
              </div>
              @if (isFieldInvalid('email')) {
                <p class="text-xs text-rose-600 dark:text-rose-400 font-medium">
                  {{ getEmailError() }}
                </p>
              }
            </div>

            <!-- Password Field with Show/Hide Toggle -->
            <div class="space-y-1.5">
              <label for="admin-password" class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="admin-password"
                  [type]="showPassword() ? 'text' : 'password'"
                  formControlName="password"
                  placeholder="••••••••••••"
                  autocomplete="current-password"
                  class="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-mono"
                  [ngClass]="{
                    'border-rose-400 dark:border-rose-500/80 bg-rose-50/20': isFieldInvalid('password'),
                    'border-slate-200 dark:border-slate-700': !isFieldInvalid('password')
                  }"
                />
                <button
                  type="button"
                  (click)="togglePasswordVisibility()"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none"
                  [attr.aria-label]="showPassword() ? 'Hide password' : 'Show password'"
                >
                  @if (showPassword()) {
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  } @else {
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  }
                </button>
              </div>
              @if (isFieldInvalid('password')) {
                <p class="text-xs text-rose-600 dark:text-rose-400 font-medium">
                  {{ getPasswordError() }}
                </p>
              }
            </div>

            <!-- Submit Button with Spinner -->
            <div class="pt-2">
              <button
                type="submit"
                [disabled]="isLoading()"
                class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] disabled:opacity-60 disabled:pointer-events-none shadow-lg shadow-indigo-500/25 transition-all duration-200"
              >
                @if (isLoading()) {
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Signing In...</span>
                } @else {
                  <span>Sign In</span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                }
              </button>
            </div>
          </form>
        </div>

        <!-- Back to Website Link -->
        <div class="text-center">
          <a
            routerLink="/"
            class="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Return to Portfolio</span>
          </a>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  public readonly loginForm: FormGroup;
  public readonly isLoading = signal<boolean>(false);
  public readonly errorMessage = signal<string | null>(null);
  public readonly showPassword = signal<boolean>(false);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  public isFieldInvalid(fieldName: string): boolean {
    const control = this.loginForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  public getEmailError(): string {
    const control = this.loginForm.get('email');
    if (!control || !control.errors) return '';
    if (control.errors['required']) return 'Email is required';
    if (control.errors['email']) return 'Please enter a valid email address';
    return '';
  }

  public getPasswordError(): string {
    const control = this.loginForm.get('password');
    if (!control || !control.errors) return '';
    if (control.errors['required']) return 'Password is required';
    if (control.errors['minlength']) return 'Password must be at least 6 characters';
    return '';
  }

  public togglePasswordVisibility(): void {
    this.showPassword.update((val) => !val);
  }

  public onSubmit(): void {
    this.errorMessage.set(null);

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const { email, password } = this.loginForm.value;

    this.authService.login({ email: email.trim(), password }).subscribe({
      next: () => {
        this.isLoading.set(false);
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin/dashboard';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        this.isLoading.set(false);
        const msg = err?.error?.message || err?.message || 'Invalid email or password. Please try again.';
        this.errorMessage.set(msg);
      },
    });
  }
}
