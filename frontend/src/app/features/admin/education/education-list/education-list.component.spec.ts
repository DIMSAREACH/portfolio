import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { EducationListComponent } from './education-list.component';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Education } from '../../../../core/models';

describe('EducationListComponent', () => {
  let component: EducationListComponent;
  let fixture: ComponentFixture<EducationListComponent>;
  let router: Router;

  let portfolioServiceMock: {
    getAdminEducation: ReturnType<typeof vi.fn>;
    deleteAdminEducation: ReturnType<typeof vi.fn>;
  };

  let notificationServiceMock: {
    showSuccess: ReturnType<typeof vi.fn>;
    showError: ReturnType<typeof vi.fn>;
  };

  let dialogMock: {
    open: ReturnType<typeof vi.fn>;
  };

  const mockEducation: Education[] = [
    {
      _id: 'edu-1',
      institution: { en: 'Royal University of Phnom Penh', kh: 'សាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ' },
      degree: { en: 'Bachelor of Science', kh: 'បរិញ្ញាបត្រ' },
      field: { en: 'Computer Science', kh: 'វិទ្យាសាស្ត្រកុំព្យូទ័រ' },
      startYear: 2020,
      endYear: 2024,
      gpa: '3.85 / 4.0',
      order: 1,
      createdAt: '2026-09-01T00:00:00Z',
      updatedAt: '2026-09-01T00:00:00Z',
    },
    {
      _id: 'edu-2',
      institution: { en: 'Stanford Online', kh: 'ស្ទែនហ្វដ' },
      degree: { en: 'Certificate of Specialization', kh: 'វិញ្ញាបនបត្រ' },
      field: { en: 'Cloud Architecture', kh: 'ស្ថាបត្យកម្មពពក' },
      startYear: 2025,
      order: 2,
      createdAt: '2026-09-02T00:00:00Z',
      updatedAt: '2026-09-02T00:00:00Z',
    },
  ];

  beforeEach(async () => {
    portfolioServiceMock = {
      getAdminEducation: vi.fn().mockReturnValue(
        of({
          success: true,
          data: {
            items: mockEducation,
            pagination: { page: 1, limit: 10, total: 2, totalPages: 1 },
          },
        }),
      ),
      deleteAdminEducation: vi.fn().mockReturnValue(of({ success: true, data: null })),
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
      imports: [EducationListComponent],
      providers: [
        provideRouter([]),
        { provide: PortfolioService, useValue: portfolioServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: MatDialog, useValue: dialogMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(EducationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load education records on init and set signals', () => {
    expect(portfolioServiceMock.getAdminEducation).toHaveBeenCalledWith(
      expect.objectContaining({ page: 1, limit: 10 }),
    );
    expect(component.educationList().length).toBe(2);
    expect(component.totalItems()).toBe(2);
    expect(component.isLoading()).toBe(false);
  });

  it('should handle search term change and reload education list', () => {
    component.onSearchChange('Royal');
    expect(component.searchTerm()).toBe('Royal');
    expect(component.currentPage()).toBe(1);
    expect(portfolioServiceMock.getAdminEducation).toHaveBeenCalledWith(
      expect.objectContaining({ search: 'Royal' }),
    );
  });

  it('should navigate to create page on onCreateClick()', () => {
    const navSpy = vi.spyOn(router, 'navigate');
    component.onCreateClick();
    expect(navSpy).toHaveBeenCalledWith(['/admin/education/create']);
  });

  it('should navigate to edit page on onEditClick()', () => {
    const navSpy = vi.spyOn(router, 'navigate');
    component.onEditClick({ _id: 'edu-1' });
    expect(navSpy).toHaveBeenCalledWith(['/admin/education', 'edu-1', 'edit']);
  });

  it('should open confirm dialog on onDeleteClick() and delete when confirmed', () => {
    component.onDeleteClick(mockEducation[0] as unknown as Record<string, unknown>);

    expect(dialogMock.open).toHaveBeenCalled();
    expect(portfolioServiceMock.deleteAdminEducation).toHaveBeenCalledWith('edu-1');
    expect(notificationServiceMock.showSuccess).toHaveBeenCalledWith('Education record deleted successfully.');
  });

  it('should not delete education if confirm dialog is cancelled', () => {
    dialogMock.open.mockReturnValue({
      afterClosed: () => of(false),
    });

    component.onDeleteClick(mockEducation[0] as unknown as Record<string, unknown>);

    expect(dialogMock.open).toHaveBeenCalled();
    expect(portfolioServiceMock.deleteAdminEducation).not.toHaveBeenCalled();
  });
});
