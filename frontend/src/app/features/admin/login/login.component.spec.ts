import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';
import { FirebaseAuthService } from '../../../core/services/firebase-auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthResponse, ApiResponse } from '../../../core/models';

describe('Admin LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;

  let authServiceMock: {
    login: ReturnType<typeof vi.fn>;
    loginWithFirebase: ReturnType<typeof vi.fn>;
  };

  let firebaseAuthServiceMock: {
    isConfigured: ReturnType<typeof vi.fn>;
    signInWithEmail: ReturnType<typeof vi.fn>;
    sendPasswordReset: ReturnType<typeof vi.fn>;
    logout: ReturnType<typeof vi.fn>;
  };

  let notificationServiceMock: {
    showSuccess: ReturnType<typeof vi.fn>;
    showError: ReturnType<typeof vi.fn>;
    showWarning: ReturnType<typeof vi.fn>;
    showInfo: ReturnType<typeof vi.fn>;
    showSecondary: ReturnType<typeof vi.fn>;
  };

  const mockAuthResponse: ApiResponse<AuthResponse> = {
    success: true,
    message: 'Login successful',
    data: {
      accessToken: 'jwt-access-token-123',
      user: {
        _id: 'user1',
        email: 'admin@example.com',
        fullName: 'Admin User',
        role: 'admin',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
  };

  beforeEach(async () => {
    authServiceMock = {
      login: vi.fn().mockReturnValue(of(mockAuthResponse)),
      loginWithFirebase: vi.fn().mockReturnValue(of(mockAuthResponse)),
    };

    firebaseAuthServiceMock = {
      isConfigured: vi.fn().mockReturnValue(false),
      signInWithEmail: vi.fn().mockResolvedValue('mock-token'),
      sendPasswordReset: vi.fn().mockResolvedValue(undefined),
      logout: vi.fn().mockResolvedValue(undefined),
    };

    notificationServiceMock = {
      showSuccess: vi.fn(),
      showError: vi.fn(),
      showWarning: vi.fn(),
      showInfo: vi.fn(),
      showSecondary: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
        { provide: FirebaseAuthService, useValue: firebaseAuthServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: {},
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    fixture.detectChanges();
  });

  it('should create the component and initialize form with invalid state', () => {
    expect(component).toBeTruthy();
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.valid).toBe(false);
  });

  it('should validate email and password as required', () => {
    const emailCtrl = component.loginForm.get('email');
    const passCtrl = component.loginForm.get('password');

    expect(emailCtrl?.valid).toBe(false);
    expect(emailCtrl?.hasError('required')).toBe(true);

    expect(passCtrl?.valid).toBe(false);
    expect(passCtrl?.hasError('required')).toBe(true);
  });

  it('should validate email format and password length', () => {
    const emailCtrl = component.loginForm.get('email');
    const passCtrl = component.loginForm.get('password');

    emailCtrl?.setValue('not-an-email');
    expect(emailCtrl?.hasError('email')).toBe(true);

    emailCtrl?.setValue('admin@test.com');
    expect(emailCtrl?.hasError('email')).toBe(false);

    passCtrl?.setValue('123'); // min 6
    expect(passCtrl?.hasError('minlength')).toBe(true);

    passCtrl?.setValue('123456');
    expect(passCtrl?.hasError('minlength')).toBe(false);
  });

  it('should toggle password visibility', () => {
    expect(component.showPassword()).toBe(false);
    component.togglePasswordVisibility();
    expect(component.showPassword()).toBe(true);
    component.togglePasswordVisibility();
    expect(component.showPassword()).toBe(false);
  });

  it('should populate demo credentials on fillDemoCredentials', () => {
    component.fillDemoCredentials();
    expect(component.loginForm.value.email).toBe('admin@portfolio.dev');
    expect(component.loginForm.value.password).toBe('Admin@123456');
    expect(component.loginForm.valid).toBe(true);
  });

  it('should mark fields touched on invalid submit without calling authService', () => {
    component.onSubmit();

    expect(authServiceMock.login).not.toHaveBeenCalled();
    expect(component.loginForm.touched).toBe(true);
  });

  it('should call authService.login on valid submit and redirect to /admin/dashboard', () => {
    component.loginForm.setValue({
      email: 'admin@example.com',
      password: 'password123',
    });

    component.onSubmit();

    expect(authServiceMock.login).toHaveBeenCalledWith({
      email: 'admin@example.com',
      password: 'password123',
    });
    expect(component.isLoading()).toBe(false);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/admin/dashboard');
  });

  it('should display error message on login failure and not navigate', () => {
    authServiceMock.login.mockReturnValue(
      throwError(() => ({ error: { message: 'Invalid credentials' } })),
    );

    component.loginForm.setValue({
      email: 'admin@example.com',
      password: 'wrongpassword',
    });

    component.onSubmit();

    expect(component.isLoading()).toBe(false);
    expect(component.errorMessage()).toBe('Invalid credentials');
    expect(component.alertSeverity()).toBe('error');
    expect(notificationServiceMock.showError).toHaveBeenCalledWith('Invalid credentials', 'Authentication Failed');
    expect(router.navigateByUrl).not.toHaveBeenCalled();

    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#login-error-alert')?.textContent).toContain('Invalid credentials');
  });

  it('should display warning message and emit warning toast on invalid submit', () => {
    component.onSubmit();

    expect(component.alertSeverity()).toBe('warn');
    expect(component.errorMessage()).toBe('Please enter both your email address and password.');
    expect(notificationServiceMock.showWarning).toHaveBeenCalledWith(
      'Please enter both your email address and password.',
      'Validation Required',
    );
  });

  it('should emit success toast on successful authentication', () => {
    component.loginForm.setValue({
      email: 'admin@example.com',
      password: 'password123',
    });

    component.onSubmit();

    expect(notificationServiceMock.showSuccess).toHaveBeenCalledWith(
      'Welcome back, Admin! Redirecting to CMS...',
      'Authentication Successful',
    );
  });

  it('should emit info toast on autofill demo credentials', () => {
    component.fillDemoCredentials();

    expect(notificationServiceMock.showInfo).toHaveBeenCalledWith(
      'Demo admin credentials applied.',
      'Autofill',
    );
  });

  it('should set info alert and emit secondary toast on forgot password', () => {
    component.onForgotPassword();

    expect(component.alertSeverity()).toBe('info');
    expect(component.errorMessage()).toContain('default admin credentials');
    expect(notificationServiceMock.showSecondary).toHaveBeenCalledWith(
      'Default admin credentials are displayed below. Autofill to sign in.',
      'Password Assistance',
    );
  });

  it('should authenticate via loginWithFirebase when Firebase is configured', () => {
    firebaseAuthServiceMock.isConfigured.mockReturnValue(true);

    component.loginForm.setValue({
      email: 'admin@portfolio.dev',
      password: 'password123',
    });

    component.onSubmit();

    expect(authServiceMock.loginWithFirebase).toHaveBeenCalledWith(
      'admin@portfolio.dev',
      'password123',
    );
    expect(notificationServiceMock.showSuccess).toHaveBeenCalledWith(
      expect.stringContaining('(Authenticated via Firebase)'),
      'Authentication Successful',
    );
  });

  it('should send password reset email via Firebase when Firebase is configured and email is entered', async () => {
    firebaseAuthServiceMock.isConfigured.mockReturnValue(true);
    component.loginForm.patchValue({ email: 'admin@portfolio.dev' });

    component.onForgotPassword();

    await vi.waitFor(() => {
      expect(firebaseAuthServiceMock.sendPasswordReset).toHaveBeenCalledWith('admin@portfolio.dev');
      expect(notificationServiceMock.showSuccess).toHaveBeenCalledWith(
        'Password reset email sent successfully.',
        'Reset Link Sent',
      );
    });
  });

  it('should prompt for email on forgot password when Firebase is configured but email is missing', () => {
    firebaseAuthServiceMock.isConfigured.mockReturnValue(true);
    component.loginForm.patchValue({ email: '' });

    component.onForgotPassword();

    expect(notificationServiceMock.showWarning).toHaveBeenCalledWith(
      'Please enter a valid email address in the field above.',
      'Email Required',
    );
  });
});
