import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { LabelModule } from 'primeng/label';
import { AuthService } from '../../../core/services/auth.service';
import { FirebaseAuthService } from '../../../core/services/firebase-auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AlertMessageComponent, MessageSeverity } from '../../../shared/components/alert-message/alert-message.component';
import { ThemeToggleComponent } from '../../../shared/components/theme-toggle/theme-toggle.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    CardModule,
    ButtonModule,
    InputTextModule,
    LabelModule,
    AlertMessageComponent,
    ThemeToggleComponent,
  ],
  styles: [
    `
      .bg-grid-tech {
        background-image: radial-gradient(rgba(99, 102, 241, 0.22) 1.2px, transparent 1.2px);
        background-size: 24px 24px;
      }
      :host-context(.dark) .bg-grid-tech {
        background-image: radial-gradient(rgba(129, 140, 248, 0.18) 1.2px, transparent 1.2px);
      }

      :host ::ng-deep .login-card.p-card {
        border-radius: 1.75rem !important;
        border: 1px solid rgba(226, 232, 240, 0.9) !important;
        background: rgba(255, 255, 255, 0.95) !important;
        backdrop-filter: blur(20px) !important;
        -webkit-backdrop-filter: blur(20px) !important;
        box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.1), 0 0 0 1px rgba(99, 102, 241, 0.08) !important;
        overflow: hidden;
      }
      :host-context(.dark) ::ng-deep .login-card.p-card {
        border-color: rgba(255, 255, 255, 0.1) !important;
        background: rgba(15, 23, 42, 0.92) !important;
        backdrop-filter: blur(24px) !important;
        -webkit-backdrop-filter: blur(24px) !important;
        box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(99, 102, 241, 0.25) !important;
      }
      :host ::ng-deep .login-card .p-card-body {
        padding: 2.25rem 2rem !important;
      }
      :host ::ng-deep .login-card .p-card-title {
        font-size: 1.625rem !important;
        font-weight: 800 !important;
        letter-spacing: -0.03em !important;
        color: #0f172a !important;
        line-height: 1.2 !important;
      }
      :host-context(.dark) ::ng-deep .login-card .p-card-title {
        color: #ffffff !important;
      }
      :host ::ng-deep .login-card .p-card-subtitle {
        font-size: 0.875rem !important;
        color: #64748b !important;
        margin-top: 0.35rem !important;
        font-weight: 400 !important;
      }
      :host-context(.dark) ::ng-deep .login-card .p-card-subtitle {
        color: #94a3b8 !important;
      }
      :host ::ng-deep .login-card .p-card-content {
        padding-top: 1.25rem !important;
        padding-bottom: 0 !important;
      }
      :host ::ng-deep .login-card .p-card-footer {
        padding-top: 1.25rem !important;
      }
    `,
  ],
  template: `
    <div class="min-h-screen flex flex-col justify-between items-center px-4 sm:px-6 py-6 sm:py-8 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden">
      <!-- High-tech Subtle Grid Pattern Backdrop -->
      <div class="absolute inset-0 bg-grid-tech pointer-events-none opacity-70"></div>

      <!-- Multi-stop Radiant Ambient Glowing Orbs -->
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[360px] bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/15 dark:from-indigo-600/25 dark:via-purple-600/20 dark:to-pink-600/15 rounded-full blur-[110px] pointer-events-none -z-10"></div>
      <div class="absolute bottom-10 right-1/4 w-[420px] h-[280px] bg-sky-500/15 dark:bg-indigo-700/15 rounded-full blur-[100px] pointer-events-none -z-10"></div>

      <!-- Top Navigation & Controls Bar -->
      <header class="w-full max-w-4xl flex items-center justify-between z-10">
        <a
          routerLink="/"
          class="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-2xs hover:shadow-xs transition-all"
        >
          <i class="pi pi-arrow-left text-[11px] group-hover:-translate-x-1 transition-transform"></i>
          <span>Back to Portfolio</span>
        </a>

        <div class="flex items-center gap-2">
          <app-theme-toggle />
        </div>
      </header>

      <!-- Center Card Section -->
      <main class="w-full max-w-md my-auto py-6 z-10 flex flex-col items-center">
        <!-- Brand Header with Status Badge -->
        <div class="text-center space-y-2.5 mb-6">
          <a
            routerLink="/"
            class="inline-flex items-center text-decoration-none group hover:scale-105 transition-transform"
            aria-label="Return to portfolio home"
          >
            <span
              class="font-brand text-3xl font-black tracking-tight text-slate-900 dark:text-white"
              style="font-family: var(--font-brand), 'Outfit', 'Plus Jakarta Sans', sans-serif;"
            >
              Sareach<span class="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent font-black ml-0.5">.dev</span>
            </span>
          </a>
          <div class="flex items-center justify-center gap-2 flex-wrap">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-50/90 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 shadow-2xs">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              CMS Control Center
            </span>
            @if (isFirebaseConfigured()) {
              <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-50/90 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/80 shadow-2xs">
                <i class="pi pi-bolt text-amber-500 text-[10px]"></i>
                Firebase Auth Active
              </span>
            } @else {
              <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-100/90 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
                <i class="pi pi-shield text-indigo-500 text-[10px]"></i>
                Firebase Auth Ready
              </span>
            }
          </div>
        </div>

        <!-- PrimeNG Card with Form -->
        <p-card
          class="w-full login-card"
          header="Welcome back"
          [subheader]="isFirebaseConfigured() ? 'Sign in securely with your Firebase administrator account.' : 'Sign in with your email to continue.'"
        >
          <!-- Alert Banner using AlertMessageComponent with Dynamic Severity -->
          @if (errorMessage()) {
            <div id="login-error-alert" class="mb-4">
              <app-alert-message
                [severity]="alertSeverity()"
                [summary]="alertSummary()"
                [text]="errorMessage()!"
                [closable]="true"
                (closed)="clearAlert()"
              />
            </div>
          }

          <form id="login-form" [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4" novalidate>
            <!-- Email Field -->
            <div class="flex flex-col gap-1.5">
              <label pLabel for="email" class="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <i class="pi pi-envelope text-indigo-600 dark:text-indigo-400 text-xs"></i>
                <span>Email Address</span>
              </label>
              <input
                pInputText
                id="email"
                name="email"
                type="email"
                formControlName="email"
                autocomplete="username"
                autocapitalize="none"
                spellcheck="false"
                placeholder="admin@portfolio.dev"
                [attr.aria-invalid]="isFieldInvalid('email')"
                [attr.aria-describedby]="isFieldInvalid('email') ? 'email-error' : null"
                class="w-full !rounded-xl !text-sm !py-3 !px-3.5 bg-slate-50/80 dark:bg-slate-900/70 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:!border-indigo-500 transition-all"
                [ngClass]="{ '!border-rose-500': isFieldInvalid('email') }"
              />
              @if (isFieldInvalid('email')) {
                <span id="email-error" role="alert" class="text-xs text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1 mt-0.5">
                  <i class="pi pi-times-circle text-xs"></i>
                  {{ getEmailError() }}
                </span>
              }
            </div>

            <!-- Password Field -->
            <div class="flex flex-col gap-1.5">
              <div class="flex items-center justify-between">
                <label pLabel for="password" class="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5 flex-1">
                  <i class="pi pi-lock text-indigo-600 dark:text-indigo-400 text-xs"></i>
                  <span>Password</span>
                </label>
                <button
                  type="button"
                  pButton
                  variant="link"
                  (click)="onForgotPassword()"
                  class="!p-0 !text-xs !font-semibold !text-indigo-600 dark:!text-indigo-400 hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div class="relative">
                <input
                  pInputText
                  id="password"
                  name="password"
                  [type]="showPassword() ? 'text' : 'password'"
                  formControlName="password"
                  autocomplete="current-password"
                  spellcheck="false"
                  placeholder="••••••••••••"
                  [attr.aria-invalid]="isFieldInvalid('password')"
                  [attr.aria-describedby]="isFieldInvalid('password') ? 'password-error' : null"
                  class="w-full !rounded-xl !text-sm !py-3 !pl-3.5 !pr-10 bg-slate-50/80 dark:bg-slate-900/70 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 font-mono focus:!border-indigo-500 transition-all"
                  [ngClass]="{ '!border-rose-500': isFieldInvalid('password') }"
                />
                <button
                  type="button"
                  (click)="togglePasswordVisibility()"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
                  [attr.aria-label]="showPassword() ? 'Hide password' : 'Show password'"
                >
                  <i class="pi text-xs" [ngClass]="showPassword() ? 'pi-eye-slash' : 'pi-eye'"></i>
                </button>
              </div>
              @if (isFieldInvalid('password')) {
                <span id="password-error" role="alert" class="text-xs text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1 mt-0.5">
                  <i class="pi pi-times-circle text-xs"></i>
                  {{ getPasswordError() }}
                </span>
              }
            </div>

            <!-- Options Row: Remember Email Address -->
            <div class="flex items-center justify-between text-xs pt-0.5">
              <label class="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400 select-none">
                <input
                  type="checkbox"
                  [checked]="rememberEmail()"
                  (change)="toggleRememberEmail()"
                  class="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                />
                <span>Remember email address</span>
              </label>
            </div>
          </form>

          <ng-template #footer>
            <div class="flex flex-col gap-3.5">
              <!-- Submit Button with Explicit Form Linkage & Keyboard Submit Support -->
              <button
                id="login-submit-btn"
                type="submit"
                form="login-form"
                (click)="onSubmit()"
                pButton
                [disabled]="isLoading()"
                class="w-full !py-3 !px-4 !rounded-xl !font-bold !text-sm !bg-gradient-to-r !from-indigo-600 !via-indigo-600 !to-violet-600 hover:!from-indigo-500 hover:!to-violet-500 !text-white !border-0 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/40 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                @if (isLoading()) {
                  <i class="pi pi-spin pi-spinner text-sm"></i>
                  <span>Signing in...</span>
                } @else {
                  <span>Login</span>
                  <i class="pi pi-arrow-right text-xs"></i>
                }
              </button>

              <!-- Development Only Helpers (Hidden in Production) -->
              @if (!isProduction) {
                <div class="flex flex-col gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
                  <button
                    type="button"
                    (click)="fillDemoCredentials()"
                    pButton
                    severity="secondary"
                    [outlined]="true"
                    class="w-full !py-2.5 !px-4 !rounded-xl !text-xs !font-bold !border-slate-300 dark:!border-slate-700 !bg-slate-100/70 dark:!bg-slate-800/40 hover:!bg-slate-200/80 dark:hover:!bg-slate-800 !text-slate-800 dark:!text-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <i class="pi pi-key text-indigo-600 dark:text-indigo-400 text-xs"></i>
                    <span>Autofill Demo Credentials</span>
                  </button>

                  <div class="p-2 rounded-xl bg-slate-100/60 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 text-[11px] text-slate-600 dark:text-slate-400 flex items-center justify-between">
                    <div class="flex items-center gap-1.5">
                      <span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                      <span class="font-medium">Admin:</span>
                      <code class="font-mono text-indigo-700 dark:text-indigo-300 font-semibold">admin&#64;portfolio.dev</code>
                    </div>
                    <code class="font-mono text-slate-500 dark:text-slate-400">Admin&#64;123456</code>
                  </div>

                  @if (!isFirebaseConfigured()) {
                    <div class="p-2 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-[10.5px] text-indigo-700 dark:text-indigo-300 flex items-start gap-1.5">
                      <i class="pi pi-info-circle text-xs shrink-0 mt-0.5"></i>
                      <span>Firebase Auth ready. Add credentials to activate Firebase sign-in.</span>
                    </div>
                  }
                </div>
              }

              <!-- Return to Portfolio Site Link -->
              <div class="mt-1 text-center text-slate-500 dark:text-slate-400 text-xs">
                Don't need to log in?
                <a
                  routerLink="/"
                  class="font-bold text-indigo-600 dark:text-indigo-400 hover:underline ml-1 inline-flex items-center gap-0.5"
                >
                  Return to Portfolio
                </a>
              </div>
            </div>
          </ng-template>
        </p-card>
      </main>

      <!-- Bottom Security Badge -->
      <footer class="z-10 text-center py-2 text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
        <i class="pi pi-shield text-indigo-500 text-xs"></i>
        <span>Secure TLS 256-bit Encrypted Session</span>
      </footer>
    </div>
  `,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly firebaseAuthService = inject(FirebaseAuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  public readonly loginForm: FormGroup;
  public readonly isLoading = signal<boolean>(false);
  public readonly errorMessage = signal<string | null>(null);
  public readonly alertSeverity = signal<MessageSeverity>('error');
  public readonly alertSummary = signal<string>('Authentication Failed');
  public readonly showPassword = signal<boolean>(false);
  public readonly isProduction = environment.production;
  public readonly rememberEmail = signal<boolean>(false);

  public isFirebaseConfigured(): boolean {
    return this.firebaseAuthService.isConfigured();
  }

  public toggleRememberEmail(): void {
    this.rememberEmail.update((val) => !val);
  }

  constructor() {
    let savedEmail = '';
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        savedEmail = localStorage.getItem('portfolio_admin_saved_email') || '';
      } catch {
        // Silently continue in environments without localStorage
      }
    }
    if (savedEmail) {
      this.rememberEmail.set(true);
    }

    this.loginForm = this.fb.group({
      email: [savedEmail || '', [Validators.required, Validators.email]],
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

  public setAlert(message: string, severity: MessageSeverity = 'error', summary = 'Authentication Notice'): void {
    this.alertSeverity.set(severity);
    this.alertSummary.set(summary);
    this.errorMessage.set(message);
  }

  public clearAlert(): void {
    this.errorMessage.set(null);
  }

  public fillDemoCredentials(): void {
    this.loginForm.patchValue({
      email: 'admin@portfolio.dev',
      password: 'Admin@123456',
    });
    this.clearAlert();
    this.notificationService.showInfo('Demo admin credentials applied.', 'Autofill');
  }

  public onForgotPassword(): void {
    if (this.isFirebaseConfigured()) {
      const email = this.loginForm.get('email')?.value?.trim();
      if (!email || this.loginForm.get('email')?.invalid) {
        this.setAlert(
          'Please enter your admin email address above, then click Forgot Password to receive a reset link.',
          'info',
          'Email Required',
        );
        this.notificationService.showWarning(
          'Please enter a valid email address in the field above.',
          'Email Required',
        );
        return;
      }

      this.isLoading.set(true);
      this.firebaseAuthService
        .sendPasswordReset(email)
        .then(() => {
          this.isLoading.set(false);
          this.setAlert(
            `A password reset link has been dispatched to ${email} via Firebase.`,
            'success',
            'Password Reset Sent',
          );
          this.notificationService.showSuccess(
            'Password reset email sent successfully.',
            'Reset Link Sent',
          );
        })
        .catch((err) => {
          this.isLoading.set(false);
          const msg = err?.message || 'Failed to dispatch password reset email.';
          this.setAlert(msg, 'error', 'Reset Failed');
          this.notificationService.showError(msg, 'Reset Failed');
        });
      return;
    }

    if (this.isProduction) {
      this.setAlert(
        'For account recovery and credentials management in production, please contact your systems administrator or review your server environment settings.',
        'info',
        'Account Recovery',
      );
      this.notificationService.showSecondary(
        'Production password reset is managed via server administrator settings.',
        'Password Assistance',
      );
      return;
    }

    this.setAlert(
      'Use the default admin credentials provided below to access the CMS.',
      'info',
      'Account Assistance',
    );
    this.notificationService.showSecondary(
      'Default admin credentials are displayed below. Autofill to sign in.',
      'Password Assistance',
    );
  }

  public onSubmit(): void {
    this.clearAlert();

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.setAlert('Please enter both your email address and password.', 'warn', 'Validation Required');
      this.notificationService.showWarning('Please enter both your email address and password.', 'Validation Required');
      return;
    }

    this.isLoading.set(true);
    const { email, password } = this.loginForm.value;
    const cleanEmail = email.trim();

    const auth$ = this.isFirebaseConfigured()
      ? this.authService.loginWithFirebase(cleanEmail, password)
      : this.authService.login({ email: cleanEmail, password });

    auth$.subscribe({
      next: () => {
        this.isLoading.set(false);

        if (typeof window !== 'undefined' && window.localStorage) {
          try {
            if (this.rememberEmail()) {
              localStorage.setItem('portfolio_admin_saved_email', cleanEmail);
            } else {
              localStorage.removeItem('portfolio_admin_saved_email');
            }
          } catch {
            // Silently continue
          }
        }

        const notice = this.isFirebaseConfigured() ? ' (Authenticated via Firebase)' : '';
        this.notificationService.showSuccess(
          `Welcome back, Admin! Redirecting to CMS...${notice}`,
          'Authentication Successful',
        );
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin/dashboard';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        this.isLoading.set(false);
        const msg = err?.error?.message || err?.message || 'Invalid email or password. Please try again.';
        this.setAlert(msg, 'error', 'Authentication Failed');
        this.notificationService.showError(msg, 'Authentication Failed');
      },
    });
  }
}
