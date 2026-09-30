import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { CertificationListComponent } from './certification-list.component';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Certification } from '../../../../core/models';

describe('CertificationListComponent', () => {
  let component: CertificationListComponent;
  let fixture: ComponentFixture<CertificationListComponent>;
  let router: Router;

  let portfolioServiceMock: {
    getAdminCertifications: ReturnType<typeof vi.fn>;
    deleteAdminCertification: ReturnType<typeof vi.fn>;
  };

  let notificationServiceMock: {
    showSuccess: ReturnType<typeof vi.fn>;
    showError: ReturnType<typeof vi.fn>;
  };

  let dialogMock: {
    open: ReturnType<typeof vi.fn>;
  };

  const mockCerts: Certification[] = [
    {
      _id: 'cert-1',
      name: { en: 'AWS Solutions Architect', kh: 'ស្ថាបត្យករ AWS' },
      organization: { en: 'Amazon Web Services', kh: 'AWS' },
      type: 'certification',
      issueDate: '2024-01-15T00:00:00Z',
      isVisible: true,
      order: 1,
      createdAt: '2026-09-01T00:00:00Z',
      updatedAt: '2026-09-01T00:00:00Z',
    },
    {
      _id: 'cert-2',
      name: { en: 'National Hackathon Champion', kh: 'ជើងឯក' },
      organization: { en: 'Ministry of Post', kh: 'ក្រសួង' },
      type: 'award',
      issueDate: '2023-11-20T00:00:00Z',
      isVisible: true,
      order: 2,
      createdAt: '2026-09-02T00:00:00Z',
      updatedAt: '2026-09-02T00:00:00Z',
    },
  ];

  beforeEach(async () => {
    portfolioServiceMock = {
      getAdminCertifications: vi.fn().mockReturnValue(
        of({
          success: true,
          data: {
            items: mockCerts,
            pagination: { page: 1, limit: 10, total: 2, totalPages: 1 },
          },
        }),
      ),
      deleteAdminCertification: vi.fn().mockReturnValue(of({ success: true, data: null })),
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
      imports: [CertificationListComponent],
      providers: [
        provideRouter([]),
        { provide: PortfolioService, useValue: portfolioServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: MatDialog, useValue: dialogMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(CertificationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load certifications on init and set signals', () => {
    expect(portfolioServiceMock.getAdminCertifications).toHaveBeenCalledWith(
      expect.objectContaining({ page: 1, limit: 10 }),
    );
    expect(component.certifications().length).toBe(2);
    expect(component.totalItems()).toBe(2);
    expect(component.isLoading()).toBe(false);
  });

  it('should handle search term change and reload certifications', () => {
    component.onSearchChange('AWS');
    expect(component.searchTerm()).toBe('AWS');
    expect(component.currentPage()).toBe(1);
    expect(portfolioServiceMock.getAdminCertifications).toHaveBeenCalledWith(
      expect.objectContaining({ search: 'AWS' }),
    );
  });

  it('should filter by type', () => {
    component.onFilterChange('award');
    expect(component.activeFilter()).toBe('award');
    expect(portfolioServiceMock.getAdminCertifications).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'award' }),
    );

    component.onFilterChange('all');
    expect(portfolioServiceMock.getAdminCertifications).toHaveBeenCalledWith(
      expect.objectContaining({ type: undefined }),
    );
  });

  it('should navigate to create page on onCreateClick()', () => {
    const navSpy = vi.spyOn(router, 'navigate');
    component.onCreateClick();
    expect(navSpy).toHaveBeenCalledWith(['/admin/certifications/create']);
  });

  it('should navigate to edit page on onEditClick()', () => {
    const navSpy = vi.spyOn(router, 'navigate');
    component.onEditClick({ _id: 'cert-1' });
    expect(navSpy).toHaveBeenCalledWith(['/admin/certifications', 'cert-1', 'edit']);
  });

  it('should open confirm dialog on onDeleteClick() and delete when confirmed', () => {
    component.onDeleteClick(mockCerts[0] as unknown as Record<string, unknown>);

    expect(dialogMock.open).toHaveBeenCalled();
    expect(portfolioServiceMock.deleteAdminCertification).toHaveBeenCalledWith('cert-1');
    expect(notificationServiceMock.showSuccess).toHaveBeenCalledWith('Certification deleted successfully.');
  });

  it('should not delete certification if confirm dialog is cancelled', () => {
    dialogMock.open.mockReturnValue({
      afterClosed: () => of(false),
    });

    component.onDeleteClick(mockCerts[0] as unknown as Record<string, unknown>);

    expect(dialogMock.open).toHaveBeenCalled();
    expect(portfolioServiceMock.deleteAdminCertification).not.toHaveBeenCalled();
  });
});
