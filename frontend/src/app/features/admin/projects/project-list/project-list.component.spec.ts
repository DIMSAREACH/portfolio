import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { ProjectListComponent } from './project-list.component';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Project } from '../../../../core/models';

describe('ProjectListComponent', () => {
  let component: ProjectListComponent;
  let fixture: ComponentFixture<ProjectListComponent>;
  let router: Router;

  let portfolioServiceMock: {
    getAdminProjects: ReturnType<typeof vi.fn>;
    deleteAdminProject: ReturnType<typeof vi.fn>;
  };

  let notificationServiceMock: {
    showSuccess: ReturnType<typeof vi.fn>;
    showError: ReturnType<typeof vi.fn>;
  };

  let dialogMock: {
    open: ReturnType<typeof vi.fn>;
  };

  const mockProjects: Project[] = [
    {
      _id: 'proj-1',
      title: { en: 'Analytics Dashboard', kh: 'ផ្ទាំងគ្រប់គ្រង' },
      slug: 'analytics-dashboard',
      shortDescription: { en: 'SaaS metrics', kh: '' },
      fullDescription: { en: 'Full description', kh: '' },
      technologies: ['Angular', 'TypeScript'],
      category: 'Web App',
      mainImage: 'https://example.com/cover.png',
      screenshots: [],
      viewCount: 15,
      status: 'published',
      featured: true,
      order: 1,
      createdAt: '2026-09-01T00:00:00Z',
      updatedAt: '2026-09-01T00:00:00Z',
    },
    {
      _id: 'proj-2',
      title: { en: 'Portfolio Website', kh: 'គេហទំព័រ' },
      slug: 'portfolio-website',
      shortDescription: { en: 'Developer portfolio', kh: '' },
      fullDescription: { en: 'Full description', kh: '' },
      technologies: ['Tailwind', 'MongoDB'],
      category: 'Full Stack',
      mainImage: 'https://example.com/cover2.png',
      screenshots: [],
      viewCount: 10,
      status: 'draft',
      featured: false,
      order: 2,
      createdAt: '2026-09-02T00:00:00Z',
      updatedAt: '2026-09-02T00:00:00Z',
    },
  ];

  beforeEach(async () => {
    portfolioServiceMock = {
      getAdminProjects: vi.fn().mockReturnValue(
        of({
          success: true,
          data: {
            items: mockProjects,
            pagination: { page: 1, limit: 10, total: 2, totalPages: 1 },
          },
        }),
      ),
      deleteAdminProject: vi.fn().mockReturnValue(of({ success: true, data: null })),
    };

    notificationServiceMock = {
      showSuccess: vi.fn(),
      showError: vi.fn(),
    };

    dialogMock = {
      open: vi.fn().mockReturnValue({
        afterClosed: () => of(true),
      }),
    };

    await TestBed.configureTestingModule({
      imports: [ProjectListComponent],
      providers: [
        provideRouter([]),
        { provide: PortfolioService, useValue: portfolioServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: MatDialog, useValue: dialogMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(ProjectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load projects on init and set signals', () => {
    expect(portfolioServiceMock.getAdminProjects).toHaveBeenCalled();
    expect(component.projects().length).toBe(2);
    expect(component.totalItems()).toBe(2);
    expect(component.isLoading()).toBe(false);
  });

  it('should handle search change, reset page, and reload projects', () => {
    component.onSearchChange('Dashboard');
    expect(component.searchTerm()).toBe('Dashboard');
    expect(component.currentPage()).toBe(1);
    expect(portfolioServiceMock.getAdminProjects).toHaveBeenCalledWith(
      expect.objectContaining({ search: 'Dashboard' }),
    );
  });

  it('should handle filter change and reload projects', () => {
    component.onFilterChange('published');
    expect(component.activeFilter()).toBe('published');
    expect(portfolioServiceMock.getAdminProjects).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'published' }),
    );
  });

  it('should navigate to create page on onCreateClick()', () => {
    const navSpy = vi.spyOn(router, 'navigate');
    component.onCreateClick();
    expect(navSpy).toHaveBeenCalledWith(['/admin/projects/create']);
  });

  it('should navigate to edit page on onEditClick()', () => {
    const navSpy = vi.spyOn(router, 'navigate');
    component.onEditClick({ _id: 'proj-1' });
    expect(navSpy).toHaveBeenCalledWith(['/admin/projects', 'proj-1', 'edit']);
  });

  it('should navigate to public project view on onViewClick()', () => {
    const navSpy = vi.spyOn(router, 'navigate');
    component.onViewClick({ slug: 'analytics-dashboard' });
    expect(navSpy).toHaveBeenCalledWith(['/projects', 'analytics-dashboard']);
  });

  it('should open confirm dialog on onDeleteClick() and delete when confirmed', () => {
    component.onDeleteClick(mockProjects[0] as unknown as Record<string, unknown>);

    expect(dialogMock.open).toHaveBeenCalled();
    expect(portfolioServiceMock.deleteAdminProject).toHaveBeenCalledWith('proj-1');
    expect(notificationServiceMock.showSuccess).toHaveBeenCalledWith('Project deleted successfully.');
  });

  it('should not delete project if confirm dialog is cancelled', () => {
    dialogMock.open.mockReturnValue({
      afterClosed: () => of(false),
    });

    component.onDeleteClick(mockProjects[0] as unknown as Record<string, unknown>);

    expect(dialogMock.open).toHaveBeenCalled();
    expect(portfolioServiceMock.deleteAdminProject).not.toHaveBeenCalled();
  });
});
