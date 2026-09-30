import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';
import { AuthResponse, ApiResponse } from '../../../core/models';

describe('Admin LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;

  let authServiceMock: {
    login: ReturnType<typeof vi.fn>;
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
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
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
    expect(router.navigateByUrl).not.toHaveBeenCalled();

    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#login-error-alert')?.textContent).toContain('Invalid credentials');
  });
});
