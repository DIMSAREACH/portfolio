import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { signal } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { AuthService } from '../../../core/services/auth.service';
import { DashboardStats, User } from '../../../core/models';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  let portfolioServiceMock: {
    getDashboardStats: ReturnType<typeof vi.fn>;
  };

  let authServiceMock: {
    currentUser: ReturnType<typeof signal>;
  };

  const mockStats: DashboardStats = {
    totalProjects: 12,
    publishedProjects: 9,
    draftProjects: 3,
    totalBlogPosts: 8,
    publishedBlogPosts: 6,
    draftBlogPosts: 2,
    unreadMessages: 4,
    totalMessages: 15,
    totalSkills: 24,
    totalExperiences: 5,
    cvDownloads: 50,
    recentMessages: [
      {
        _id: 'msg-1',
        name: 'Alice Johnson',
        email: 'alice@example.com',
        subject: 'Contract Collaboration',
        message: 'Looking to hire you for a frontend overhaul project.',
        isRead: false,
        isArchived: false,
        createdAt: '2026-09-30T10:00:00Z',
        updatedAt: '2026-09-30T10:00:00Z',
      },
      {
        _id: 'msg-2',
        name: 'Bob Smith',
        email: 'bob@example.com',
        subject: 'Job Opportunity',
        message: 'We have an open Senior Full Stack Engineer position.',
        isRead: false,
        isArchived: false,
        createdAt: '2026-09-30T09:00:00Z',
        updatedAt: '2026-09-30T09:00:00Z',
      },
    ],
  };

  const mockUser: User = {
    _id: 'admin_1',
    email: 'admin@portfolio.dev',
    fullName: 'Dim Sareach',
    role: 'admin',
    isActive: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  };

  beforeEach(async () => {
    portfolioServiceMock = {
      getDashboardStats: vi.fn().mockReturnValue(of({ success: true, message: 'ok', data: mockStats })),
    };

    authServiceMock = {
      currentUser: signal(mockUser),
    };

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        provideRouter([]),
        { provide: PortfolioService, useValue: portfolioServiceMock },
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the admin user full name in the welcome header', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Welcome back, Dim Sareach');
  });

  it('should fall back to "Admin" if currentUser is null', () => {
    authServiceMock.currentUser.set(null);
    expect(component.adminName).toBe('Admin');
  });

  it('should load dashboard stats on init and populate signals', () => {
    expect(portfolioServiceMock.getDashboardStats).toHaveBeenCalled();
    expect(component.stats()).toEqual(mockStats);
    expect(component.isLoading()).toBe(false);
  });

  it('should render all database metric values accurately per PRD 9.2', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    // Total Projects
    expect(compiled.textContent).toContain('12');
    expect(compiled.textContent).toContain('9 Published');
    expect(compiled.textContent).toContain('3 Drafts');

    // Total Blog Posts
    expect(compiled.textContent).toContain('8');
    expect(compiled.textContent).toContain('6 Published');
    expect(compiled.textContent).toContain('2 Drafts');

    // Unread Inquiries & Total Messages
    expect(compiled.textContent).toContain('4');
    expect(compiled.textContent).toContain('15');

    // CV Downloads
    expect(compiled.textContent).toContain('50');

    // Skills & Experience
    expect(compiled.textContent).toContain('24');
    expect(compiled.textContent).toContain('5');
  });

  it('should render the list of recent unread messages with sender info', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Alice Johnson');
    expect(compiled.textContent).toContain('alice@example.com');
    expect(compiled.textContent).toContain('Contract Collaboration');
    expect(compiled.textContent).toContain('Bob Smith');
    expect(compiled.textContent).toContain('Job Opportunity');
  });

  it('should display inbox zero empty state when no recent messages exist', () => {
    const emptyStats: DashboardStats = {
      ...mockStats,
      unreadMessages: 0,
      recentMessages: [],
    };
    portfolioServiceMock.getDashboardStats.mockReturnValue(of({ success: true, message: 'ok', data: emptyStats }));

    component.loadStats();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Inbox Zero!');
  });

  it('should display an error message and handle retry when loading fails', () => {
    portfolioServiceMock.getDashboardStats.mockReturnValue(
      throwError(() => ({ error: { message: 'Database connection failed' } })),
    );

    component.loadStats();
    fixture.detectChanges();

    expect(component.isLoading()).toBe(false);
    expect(component.errorMessage()).toBe('Database connection failed');

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Database connection failed');

    // Retry
    portfolioServiceMock.getDashboardStats.mockReturnValue(of({ success: true, message: 'ok', data: mockStats }));
    const retryBtn = compiled.querySelector('button[type="button"]') as HTMLButtonElement;
    retryBtn.click();
    fixture.detectChanges();

    expect(component.errorMessage()).toBeNull();
    expect(component.stats()).toEqual(mockStats);
  });

  it('should calculate avatar initials correctly', () => {
    expect(component.getInitials('John Doe')).toBe('JD');
    expect(component.getInitials('Alice')).toBe('AL');
    expect(component.getInitials('')).toBe('U');
  });

  it('should render quick action buttons for New Project and New Blog Post', () => {
    const links = fixture.nativeElement.querySelectorAll('a[routerLink]');
    const hrefs = Array.from(links).map((l) => (l as HTMLAnchorElement).getAttribute('routerLink'));

    expect(hrefs).toContain('/admin/projects');
    expect(hrefs).toContain('/admin/blog');
    expect(hrefs).toContain('/admin/messages');
  });
});
