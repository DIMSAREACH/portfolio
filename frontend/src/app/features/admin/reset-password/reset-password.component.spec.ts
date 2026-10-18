import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ResetPasswordComponent } from './reset-password.component';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ApiResponse } from '../../../core/models';

describe('Admin ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let authServiceMock: {
    resetPassword: ReturnType<typeof vi.fn>;
  };
  let notificationServiceMock: {
    showSuccess: ReturnType<typeof vi.fn>;
    showError: ReturnType<typeof vi.fn>;
    showWarning: ReturnType<typeof vi.fn>;
  };
  let router: Router;

  const mockSuccessResponse: ApiResponse<null> = {
    success: true,
    data: null,
    message: 'Password reset successful',
  };

  const setupTestBed = (tokenParam: string | null = 'test-token-123') => {
    authServiceMock = {
      resetPassword: vi.fn().mockReturnValue(of(mockSuccessResponse)),
    };

    notificationServiceMock = {
      showSuccess: vi.fn(),
      showError: vi.fn(),
      showWarning: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [ResetPasswordComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: {
                get: (key: string) => (key === 'token' ? tokenParam : null),
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  };

  describe('When token is present in URL', () => {
    beforeEach(() => {
      setupTestBed('valid-token-xyz');
    });

    it('should initialize with resetToken set and form invalid', () => {
      expect(component.resetToken()).toBe('valid-token-xyz');
      expect(component.resetForm.valid).toBe(false);
      expect(component.isSuccess()).toBe(false);
    });

    it('should validate password length and matching passwords', () => {
      component.resetForm.patchValue({
        newPassword: 'short',
        confirmPassword: 'short',
      });
      expect(component.resetForm.get('newPassword')?.hasError('minlength')).toBe(true);

      component.resetForm.patchValue({
        newPassword: 'ValidPassword@123',
        confirmPassword: 'DifferentPassword@123',
      });
      expect(component.resetForm.hasError('passwordMismatch')).toBe(true);
      expect(component.isMismatch()).toBe(false); // not touched yet

      component.resetForm.get('confirmPassword')?.markAsTouched();
      expect(component.isMismatch()).toBe(true);

      component.resetForm.patchValue({
        newPassword: 'ValidPassword@123',
        confirmPassword: 'ValidPassword@123',
      });
      expect(component.resetForm.valid).toBe(true);
      expect(component.hasMinLength()).toBe(true);
      expect(component.hasMixedCase()).toBe(true);
    });

    it('should submit successfully and call authService.resetPassword', () => {
      vi.spyOn(router, 'navigate');

      component.resetForm.setValue({
        newPassword: 'SuperSecretPassword@123',
        confirmPassword: 'SuperSecretPassword@123',
      });

      component.onSubmit();

      expect(authServiceMock.resetPassword).toHaveBeenCalledWith(
        'valid-token-xyz',
        'SuperSecretPassword@123',
      );
      expect(component.isSuccess()).toBe(true);
      expect(notificationServiceMock.showSuccess).toHaveBeenCalledWith(
        expect.stringContaining('password has been updated'),
        'Password Reset Complete',
      );
    });

    it('should handle submission errors from authService', () => {
      authServiceMock.resetPassword.mockReturnValue(
        throwError(() => ({ error: { message: 'Password reset token is invalid or has expired' } })),
      );

      component.resetForm.setValue({
        newPassword: 'SuperSecretPassword@123',
        confirmPassword: 'SuperSecretPassword@123',
      });

      component.onSubmit();

      expect(component.isSuccess()).toBe(false);
      expect(component.errorMessage()).toContain('Password reset token is invalid or has expired');
      expect(notificationServiceMock.showError).toHaveBeenCalled();
    });

    it('should toggle password visibility signals', () => {
      expect(component.showPassword()).toBe(false);
      component.toggleShowPassword();
      expect(component.showPassword()).toBe(true);

      expect(component.showConfirmPassword()).toBe(false);
      component.toggleShowConfirmPassword();
      expect(component.showConfirmPassword()).toBe(true);
    });
  });

  describe('When token is missing from URL', () => {
    beforeEach(() => {
      setupTestBed(null);
    });

    it('should show warning alert about missing token', () => {
      expect(component.resetToken()).toBeNull();
      expect(component.errorMessage()).toContain('Missing password reset token');
      expect(component.alertSeverity()).toBe('warn');
    });
  });
});
