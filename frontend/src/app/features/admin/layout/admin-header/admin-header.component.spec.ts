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

  it('should call authService.logout and navigate to /admin/login when onLogout is called', () => {
    component.onLogout();

    expect(authServiceMock.logout).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/admin/login');
  });

  it('should render language switcher component', () => {
    const langSwitcher = fixture.nativeElement.querySelector('app-language-switcher');
    expect(langSwitcher).toBeTruthy();
  });

  it('should toggle notifications dropdown when notifications button is clicked', () => {
    const notifBtn = fixture.nativeElement.querySelector('#admin-notifications-btn');
    expect(notifBtn).toBeTruthy();

    expect(component.isNotificationsOpen()).toBe(false);
    notifBtn.click();
    fixture.detectChanges();

    expect(component.isNotificationsOpen()).toBe(true);
    const dropdown = fixture.nativeElement.querySelector('#admin-notifications-dropdown');
    expect(dropdown).toBeTruthy();

    notifBtn.click();
    fixture.detectChanges();
    expect(component.isNotificationsOpen()).toBe(false);
  });

  it('should display unread badge when unreadCount > 0', () => {
    component.unreadCount.set(5);
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('#admin-notifications-badge');
    expect(badge).toBeTruthy();
    expect(badge.textContent.trim()).toBe('5');
  });

  it('should initialize account menu items with My Account, Portfolio CMS, Appearance, and Session', () => {
    expect(component.accountMenuItems.length).toBeGreaterThanOrEqual(4);
    const labels = component.accountMenuItems.map((item) => item.label).filter(Boolean);
    expect(labels).toContain('My Account');
    expect(labels).toContain('Portfolio CMS');
    expect(labels).toContain('Appearance');
    expect(labels).toContain('Session');

    const avatarBtn = fixture.nativeElement.querySelector('#admin-account-avatar-btn');
    expect(avatarBtn).toBeTruthy();
  });

  it('should toggle profile menu when avatar button is clicked and close on escape', () => {
    const avatarBtn: HTMLButtonElement = fixture.nativeElement.querySelector('#admin-account-avatar-btn');
    expect(component.isProfileMenuOpen()).toBe(false);

    avatarBtn.click();
    fixture.detectChanges();
    expect(component.isProfileMenuOpen()).toBe(true);

    const dropdown = fixture.nativeElement.querySelector('#admin-profile-dropdown');
    expect(dropdown).toBeTruthy();

    // Trigger escape
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();
    expect(component.isProfileMenuOpen()).toBe(false);
  });

  it('should close profile menu when a menu item is clicked', () => {
    component.isProfileMenuOpen.set(true);
    fixture.detectChanges();

    const firstGroup = component.accountMenuItems[0];
    const firstItem = firstGroup.items?.[0];
    expect(firstItem).toBeDefined();

    if (firstItem) {
      component.onMenuItemClick(firstItem);
      expect(component.isProfileMenuOpen()).toBe(false);
    }
  });
});
