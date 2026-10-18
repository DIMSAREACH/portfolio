import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import {
  AlertMessageComponent,
  MessageSeverity,
} from '../../../shared/components/alert-message/alert-message.component';
import { ThemeToggleComponent } from '../../../shared/components/theme-toggle/theme-toggle.component';

export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('newPassword')?.value;
  const confirm = control.get('confirmPassword')?.value;
  if (!password || !confirm) {
    return null;
  }
  return password === confirm ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    CardModule,
    ButtonModule,
    InputTextModule,
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

      :host ::ng-deep .reset-card.p-card {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(16px);
        border: 1px solid rgba(226, 232, 240, 0.9);
        box-shadow:
          0 20px 25px -5px rgba(15, 23, 42, 0.08),
          0 8px 10px -6px rgba(15, 23, 42, 0.04);
        border-radius: 1.25rem;
      }

      :host-context(.dark) ::ng-deep .reset-card.p-card {
        background: rgba(15, 23, 42, 0.88);
        border: 1px solid rgba(51, 65, 85, 0.7);
        box-shadow:
          0 20px 25px -5px rgba(0, 0, 0, 0.4),
          0 8px 10px -6px rgba(0, 0, 0, 0.3);
      }

      :host ::ng-deep .reset-card .p-card-body {
        padding: 2.25rem;
      }
    `,
  ],
  template: `
    <div
      class="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-50 dark:bg-slate-950 relative overflow-hidden transition-colors duration-300"
    >
      <!-- Background Ambient Glow & Tech Grid -->
      <div class="absolute inset-0 bg-grid-tech pointer-events-none opacity-60"></div>
      <div
        class="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/15 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"
      ></div>
      <div
        class="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/15 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none"
      ></div>

      <!-- Theme Switcher Floating Header -->
      <div class="absolute top-6 right-6 z-20">
        <app-theme-toggle />
      </div>

      <!-- Main Reset Card Container -->
      <div class="w-full max-w-md relative z-10 animate-fade-in">
        <!-- Logo & Brand Header -->
        <div class="text-center mb-6">
          <div
            class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 mb-4 transition-transform hover:scale-105"
          >
            <i class="pi pi-lock text-2xl"></i>
          </div>
          <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Reset Password
          </h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Create a new, strong password for your administrator account.
          </p>
        </div>

        <!-- PrimeNG Reset Password Card -->
        <p-card class="w-full reset-card">
          <!-- Dynamic Alert Banner -->
          @if (errorMessage()) {
            <div id="reset-error-alert" class="mb-4">
              <app-alert-message
                [severity]="alertSeverity()"
                [summary]="alertSummary()"
                [text]="errorMessage()!"
                [closable]="true"
                (closed)="clearAlert()"
              />
            </div>
          }

          @if (!resetToken()) {
            <!-- Missing or Invalid Token State -->
            <div class="text-center py-4 space-y-4">
              <div
                class="w-12 h-12 mx-auto rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xl"
              >
                <i class="pi pi-exclamation-triangle"></i>
              </div>
              <div>
                <h2 class="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Missing Reset Link
                </h2>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                  This reset link is either missing or incomplete. Please request a new password
                  reset link from the login page.
                </p>
              </div>
              <a
                routerLink="/admin/login"
                pButton
                class="w-full !rounded-xl !text-xs !font-semibold !py-2.5 flex items-center justify-center gap-2"
              >
                <i class="pi pi-arrow-left"></i>
                <span>Return to Sign In</span>
              </a>
            </div>
          } @else if (isSuccess()) {
            <!-- Password Reset Success State -->
            <div class="text-center py-4 space-y-4">
              <div
                class="w-12 h-12 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl"
              >
                <i class="pi pi-check-circle"></i>
              </div>
              <div>
                <h2 class="text-base font-bold text-slate-900 dark:text-white">
                  Password Updated!
                </h2>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                  Your administrator password has been updated successfully. You will now be
                  redirected to the login page.
                </p>
              </div>
              <a
                routerLink="/admin/login"
                pButton
                class="w-full !rounded-xl !text-xs !font-semibold !py-2.5 flex items-center justify-center gap-2"
              >
                <i class="pi pi-sign-in"></i>
                <span>Sign In Now</span>
              </a>
            </div>
          } @else {
            <!-- Reset Password Form -->
            <form
              id="reset-password-form"
              [formGroup]="resetForm"
              (ngSubmit)="onSubmit()"
              class="space-y-4"
              novalidate
            >
              <!-- New Password Input -->
              <div class="flex flex-col gap-1.5">
                <label
                  for="new-password"
                  class="text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  New Password <span class="text-rose-500">*</span>
                </label>
                <div class="relative">
                  <input
                    id="new-password"
                    [type]="showPassword() ? 'text' : 'password'"
                    pInputText
                    formControlName="newPassword"
                    placeholder="Enter new password"
                    autocomplete="new-password"
                    class="w-full !pr-10 !text-xs !py-2.5 !rounded-xl transition-all"
                    [class.!border-rose-500]="isFieldInvalid('newPassword')"
                    [attr.aria-invalid]="isFieldInvalid('newPassword')"
                    aria-describedby="new-password-error"
                  />
                  <button
                    type="button"
                    (click)="toggleShowPassword()"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
                    [attr.aria-label]="showPassword() ? 'Hide password' : 'Show password'"
                  >
                    <i [class]="showPassword() ? 'pi pi-eye-slash text-xs' : 'pi pi-eye text-xs'"></i>
                  </button>
                </div>
                @if (isFieldInvalid('newPassword')) {
                  <p id="new-password-error" class="text-[11px] text-rose-500 font-medium" role="alert">
                    {{ getPasswordErrorMessage() }}
                  </p>
                }
              </div>

              <!-- Confirm Password Input -->
              <div class="flex flex-col gap-1.5">
                <label
                  for="confirm-password"
                  class="text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Confirm Password <span class="text-rose-500">*</span>
                </label>
                <div class="relative">
                  <input
                    id="confirm-password"
                    [type]="showConfirmPassword() ? 'text' : 'password'"
                    pInputText
                    formControlName="confirmPassword"
                    placeholder="Re-enter new password"
                    autocomplete="new-password"
                    class="w-full !pr-10 !text-xs !py-2.5 !rounded-xl transition-all"
                    [class.!border-rose-500]="isFieldInvalid('confirmPassword') || isMismatch()"
                    [attr.aria-invalid]="isFieldInvalid('confirmPassword') || isMismatch()"
                    aria-describedby="confirm-password-error"
                  />
                  <button
                    type="button"
                    (click)="toggleShowConfirmPassword()"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
                    [attr.aria-label]="showConfirmPassword() ? 'Hide password' : 'Show password'"
                  >
                    <i
                      [class]="
                        showConfirmPassword() ? 'pi pi-eye-slash text-xs' : 'pi pi-eye text-xs'
                      "
                    ></i>
                  </button>
                </div>
                @if (isMismatch()) {
                  <p id="confirm-password-error" class="text-[11px] text-rose-500 font-medium" role="alert">
                    Passwords do not match.
                  </p>
                }
              </div>

              <!-- Password Guidelines Checklist -->
              <div
                class="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 space-y-1.5 text-[11px]"
              >
                <p class="font-medium text-slate-600 dark:text-slate-400">Password requirements:</p>
                <div class="flex items-center gap-2">
                  <i
                    [class]="
                      hasMinLength()
                        ? 'pi pi-check text-emerald-500 text-[10px]'
                        : 'pi pi-circle text-slate-400 text-[8px]'
                    "
                  ></i>
                  <span [class.text-emerald-600]="hasMinLength()" [class.dark:text-emerald-400]="hasMinLength()">
                    At least 8 characters
                  </span>
                </div>
                <div class="flex items-center gap-2">
                  <i
                    [class]="
                      hasMixedCase()
                        ? 'pi pi-check text-emerald-500 text-[10px]'
                        : 'pi pi-circle text-slate-400 text-[8px]'
                    "
                  ></i>
                  <span [class.text-emerald-600]="hasMixedCase()" [class.dark:text-emerald-400]="hasMixedCase()">
                    Uppercase and lowercase letters
                  </span>
                </div>
              </div>

              <!-- Submit Action Button -->
              <button
                id="reset-submit-btn"
                type="submit"
                pButton
                [disabled]="isLoading()"
                class="w-full !rounded-xl !text-xs !font-semibold !py-3 !bg-indigo-600 hover:!bg-indigo-700 !border-indigo-600 shadow-md shadow-indigo-500/20 text-white transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                @if (isLoading()) {
                  <i class="pi pi-spin pi-spinner text-xs"></i>
                  <span>Updating Password...</span>
                } @else {
                  <i class="pi pi-check text-xs"></i>
                  <span>Set New Password</span>
                }
              </button>
            </form>
          }

          <ng-template #footer>
            <div class="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
              <a
                routerLink="/admin/login"
                class="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors inline-flex items-center gap-1.5"
              >
                <i class="pi pi-arrow-left text-[10px]"></i>
                <span>Back to Sign In</span>
              </a>
            </div>
          </ng-template>
        </p-card>
      </div>
    </div>
  `,
})
export class ResetPasswordComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  public readonly resetForm: FormGroup;
  public readonly resetToken = signal<string | null>(null);
  public readonly isLoading = signal<boolean>(false);
  public readonly isSuccess = signal<boolean>(false);
  public readonly showPassword = signal<boolean>(false);
  public readonly showConfirmPassword = signal<boolean>(false);
  public readonly errorMessage = signal<string | null>(null);
  public readonly alertSeverity = signal<MessageSeverity>('error');
  public readonly alertSummary = signal<string>('Reset Error');

  constructor() {
    this.resetForm = this.fb.group(
      {
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: passwordMatchValidator },
    );
  }

  public ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.resetToken.set(token.trim());
    } else {
      this.setAlert(
        'Missing password reset token in the URL. Please verify your link or request a new reset email.',
        'warn',
        'Invalid Link',
      );
    }
  }

  public toggleShowPassword(): void {
    this.showPassword.update((val) => !val);
  }

  public toggleShowConfirmPassword(): void {
    this.showConfirmPassword.update((val) => !val);
  }

  public isFieldInvalid(fieldName: string): boolean {
    const control = this.resetForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  public isMismatch(): boolean {
    const confirm = this.resetForm.get('confirmPassword');
    return !!(
      this.resetForm.hasError('passwordMismatch') &&
      confirm &&
      (confirm.dirty || confirm.touched)
    );
  }

  public hasMinLength(): boolean {
    const pass = this.resetForm.get('newPassword')?.value || '';
    return pass.length >= 8;
  }

  public hasMixedCase(): boolean {
    const pass = this.resetForm.get('newPassword')?.value || '';
    return /[a-z]/.test(pass) && /[A-Z]/.test(pass);
  }

  public getPasswordErrorMessage(): string {
    const control = this.resetForm.get('newPassword');
    if (control?.hasError('required')) {
      return 'New password is required.';
    }
    if (control?.hasError('minlength')) {
      return 'Password must be at least 8 characters long.';
    }
    return '';
  }

  public setAlert(detail: string, severity: MessageSeverity = 'error', summary = 'Notice'): void {
    this.errorMessage.set(detail);
    this.alertSeverity.set(severity);
    this.alertSummary.set(summary);
  }

  public clearAlert(): void {
    this.errorMessage.set(null);
  }

  public onSubmit(): void {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    const token = this.resetToken();
    if (!token) {
      this.setAlert('Reset token is missing. Please request a new reset link.', 'error', 'Error');
      return;
    }

    const newPassword = this.resetForm.get('newPassword')?.value;

    this.isLoading.set(true);
    this.clearAlert();

    this.authService.resetPassword(token, newPassword).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.isSuccess.set(true);
        this.notificationService.showSuccess(
          'Your password has been updated successfully. Please log in with your new credentials.',
          'Password Reset Complete',
        );
        setTimeout(() => {
          this.router.navigate(['/admin/login']);
        }, 2500);
      },
      error: (err) => {
        this.isLoading.set(false);
        const detail =
          err?.error?.message ||
          'Failed to reset password. The link may have expired or is invalid. Please request a new link.';
        this.setAlert(detail, 'error', 'Reset Failed');
        this.notificationService.showError(detail, 'Reset Failed');
      },
    });
  }
}
