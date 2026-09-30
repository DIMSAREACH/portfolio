import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { AdminHeaderComponent } from './admin-header.component';
import { AuthService } from '../../../../core/services/auth.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { User } from '../../../../core/models';

describe('AdminHeaderComponent', () => {
  let component: AdminHeaderComponent;
  let fixture: ComponentFixture<AdminHeaderComponent>;
  let router: Router;

  let authServiceMock: {
    currentUser: ReturnType<typeof signal<User | null>>;
    isLoading: ReturnType<typeof signal<boolean>>;
    logout: ReturnType<typeof vi.fn>;
  };

  let themeServiceMock: {
    isDark: ReturnType<typeof signal<boolean>>;
    toggle: ReturnType<typeof vi.fn>;
  };

  const mockAdminUser: User = {
    _id: 'admin1',
    email: 'sareach@portfolio.dev',
    fullName: 'Dim Sareach',
    role: 'admin',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    authServiceMock = {
      currentUser: signal(mockAdminUser),
      isLoading: signal(false),
      logout: vi.fn().mockReturnValue(of({ success: true, message: 'Logged out', data: null })),
    };

    themeServiceMock = {
      isDark: signal(false),
      toggle: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [AdminHeaderComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
        { provide: ThemeService, useValue: themeServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminHeaderComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display admin user name and email', () => {
    expect(component.userName()).toBe('Dim Sareach');
    expect(component.userEmail()).toBe('sareach@portfolio.dev');
    expect(component.userInitials()).toBe('DS');

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Dim Sareach');
    expect(compiled.textContent).toContain('sareach@portfolio.dev');
  });

  it('should emit toggleSidebar when hamburger button is clicked', () => {
    const spy = vi.spyOn(component.toggleSidebar, 'emit');
    const toggleBtn = fixture.nativeElement.querySelector('#admin-sidebar-toggle-btn');
    toggleBtn.click();
    expect(spy).toHaveBeenCalled();
  });

  it('should call authService.logout and navigate to /admin/login', () => {
    const logoutBtn = fixture.nativeElement.querySelector('#admin-logout-btn');
    logoutBtn.click();

    expect(authServiceMock.logout).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/admin/login');
  });
});
