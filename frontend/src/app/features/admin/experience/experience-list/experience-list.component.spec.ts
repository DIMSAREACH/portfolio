import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { ExperienceListComponent } from './experience-list.component';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Experience } from '../../../../core/models';

describe('ExperienceListComponent', () => {
  let component: ExperienceListComponent;
  let fixture: ComponentFixture<ExperienceListComponent>;
  let router: Router;

  let portfolioServiceMock: {
    getAdminExperiences: ReturnType<typeof vi.fn>;
    deleteAdminExperience: ReturnType<typeof vi.fn>;
  };

  let notificationServiceMock: {
    showSuccess: ReturnType<typeof vi.fn>;
    showError: ReturnType<typeof vi.fn>;
  };

  let dialogMock: {
    open: ReturnType<typeof vi.fn>;
  };

  const mockExperiences: Experience[] = [
    {
      _id: 'exp-1',
      title: { en: 'Senior Full Stack Engineer', kh: 'វិស្វករជាន់ខ្ពស់' },
      organization: { en: 'Acme Global', kh: 'អាមេ' },
      location: { en: 'Phnom Penh', kh: 'ភ្នំពេញ' },
      type: 'work',
      startDate: '2024-01-01T00:00:00Z',
      isCurrent: true,
      technologies: ['Angular', 'Node.js'],
      order: 1,
      createdAt: '2026-09-01T00:00:00Z',
      updatedAt: '2026-09-01T00:00:00Z',
    },
    {
      _id: 'exp-2',
      title: { en: 'Tech Volunteer Mentor', kh: 'អ្នកស្ម័គ្រចិត្ត' },
      organization: { en: 'Code for Future', kh: 'កូដដើម្បីអនាគត' },
      type: 'volunteer',
      startDate: '2023-01-01T00:00:00Z',
      endDate: '2023-12-31T00:00:00Z',
      isCurrent: false,
      technologies: ['Python'],
      order: 2,
      createdAt: '2026-09-02T00:00:00Z',
      updatedAt: '2026-09-02T00:00:00Z',
    },
  ];

  beforeEach(async () => {
    portfolioServiceMock = {
      getAdminExperiences: vi.fn().mockReturnValue(
        of({
          success: true,
          data: {
            items: mockExperiences,
            pagination: { page: 1, limit: 10, total: 2, totalPages: 1 },
          },
        }),
      ),
      deleteAdminExperience: vi.fn().mockReturnValue(of({ success: true, data: null })),
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
      imports: [ExperienceListComponent],
      providers: [
        provideRouter([]),
        { provide: PortfolioService, useValue: portfolioServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: MatDialog, useValue: dialogMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(ExperienceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load experiences on init and set signals', () => {
    expect(portfolioServiceMock.getAdminExperiences).toHaveBeenCalledWith(
      expect.objectContaining({ page: 1, limit: 10 }),
    );
    expect(component.experiences().length).toBe(2);
    expect(component.totalItems()).toBe(2);
    expect(component.isLoading()).toBe(false);
  });

  it('should handle search term change and reload experiences', () => {
    component.onSearchChange('Acme');
    expect(component.searchTerm()).toBe('Acme');
    expect(component.currentPage()).toBe(1);
    expect(portfolioServiceMock.getAdminExperiences).toHaveBeenCalledWith(
      expect.objectContaining({ search: 'Acme' }),
    );
  });

  it('should filter by engagement type', () => {
    component.onFilterChange('work');
    expect(component.activeFilter()).toBe('work');
    expect(portfolioServiceMock.getAdminExperiences).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'work' }),
    );

    component.onFilterChange('all');
    expect(portfolioServiceMock.getAdminExperiences).toHaveBeenCalledWith(
      expect.objectContaining({ type: undefined }),
    );
  });

  it('should navigate to create page on onCreateClick()', () => {
    const navSpy = vi.spyOn(router, 'navigate');
    component.onCreateClick();
    expect(navSpy).toHaveBeenCalledWith(['/admin/experience/create']);
  });

  it('should navigate to edit page on onEditClick()', () => {
    const navSpy = vi.spyOn(router, 'navigate');
    component.onEditClick({ _id: 'exp-1' });
    expect(navSpy).toHaveBeenCalledWith(['/admin/experience', 'exp-1', 'edit']);
  });

  it('should open confirm dialog on onDeleteClick() and delete when confirmed', () => {
    component.onDeleteClick(mockExperiences[0] as unknown as Record<string, unknown>);

    expect(dialogMock.open).toHaveBeenCalled();
    expect(portfolioServiceMock.deleteAdminExperience).toHaveBeenCalledWith('exp-1');
    expect(notificationServiceMock.showSuccess).toHaveBeenCalledWith('Experience deleted successfully.');
  });

  it('should not delete experience if confirm dialog is cancelled', () => {
    dialogMock.open.mockReturnValue({
      afterClosed: () => of(false),
    });

    component.onDeleteClick(mockExperiences[0] as unknown as Record<string, unknown>);

    expect(dialogMock.open).toHaveBeenCalled();
    expect(portfolioServiceMock.deleteAdminExperience).not.toHaveBeenCalled();
  });
});
