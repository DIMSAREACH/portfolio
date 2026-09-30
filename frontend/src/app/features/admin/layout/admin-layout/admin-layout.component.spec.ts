import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { AdminLayoutComponent } from './admin-layout.component';
import { AuthService } from '../../../../core/services/auth.service';
import { ThemeService } from '../../../../core/services/theme.service';

describe('AdminLayoutComponent', () => {
  let component: AdminLayoutComponent;
  let fixture: ComponentFixture<AdminLayoutComponent>;

  let authServiceMock: {
    currentUser: ReturnType<typeof signal>;
    isLoading: ReturnType<typeof signal<boolean>>;
    logout: ReturnType<typeof vi.fn>;
  };

  let themeServiceMock: {
    isDark: ReturnType<typeof signal<boolean>>;
    toggle: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    authServiceMock = {
      currentUser: signal(null),
      isLoading: signal(false),
      logout: vi.fn(),
    };

    themeServiceMock = {
      isDark: signal(false),
      toggle: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [AdminLayoutComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
        { provide: ThemeService, useValue: themeServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle sidebar state', () => {
    expect(component.isSidebarOpen).toBe(false);

    component.toggleSidebar();
    expect(component.isSidebarOpen).toBe(true);

    component.toggleSidebar();
    expect(component.isSidebarOpen).toBe(false);
  });

  it('should close sidebar when closeSidebar is called', () => {
    component.isSidebarOpen = true;
    component.closeSidebar();
    expect(component.isSidebarOpen).toBe(false);
  });

  it('should render sidebar, header, and main router outlet', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-admin-sidebar')).toBeTruthy();
    expect(compiled.querySelector('app-admin-header')).toBeTruthy();
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });

  it('should render accessible skip-to-content link targeting admin main content', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const skipLink = compiled.querySelector('#admin-skip-to-content') as HTMLAnchorElement;
    expect(skipLink).toBeTruthy();
    expect(skipLink.getAttribute('href')).toBe('#admin-main-content');
  });
});
