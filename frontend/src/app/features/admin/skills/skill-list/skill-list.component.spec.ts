import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { SkillListComponent } from './skill-list.component';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Skill } from '../../../../core/models';

describe('SkillListComponent', () => {
  let component: SkillListComponent;
  let fixture: ComponentFixture<SkillListComponent>;
  let router: Router;

  let portfolioServiceMock: {
    getAdminSkills: ReturnType<typeof vi.fn>;
    deleteAdminSkill: ReturnType<typeof vi.fn>;
  };

  let notificationServiceMock: {
    showSuccess: ReturnType<typeof vi.fn>;
    showError: ReturnType<typeof vi.fn>;
  };

  let dialogMock: {
    open: ReturnType<typeof vi.fn>;
  };

  const mockSkills: Skill[] = [
    {
      _id: 'skill-1',
      name: 'Angular',
      category: { en: 'Frontend', kh: 'ផ្នែកខាងមុខ' },
      icon: 'devicon-angularjs-plain colored',
      order: 1,
      isVisible: true,
      createdAt: '2026-09-01T00:00:00Z',
      updatedAt: '2026-09-01T00:00:00Z',
    },
    {
      _id: 'skill-2',
      name: 'Docker',
      category: { en: 'Cloud & DevOps', kh: 'ពពក និងដេវអបស៍' },
      icon: 'devicon-docker-plain colored',
      order: 2,
      isVisible: false,
      createdAt: '2026-09-02T00:00:00Z',
      updatedAt: '2026-09-02T00:00:00Z',
    },
  ];

  beforeEach(async () => {
    portfolioServiceMock = {
      getAdminSkills: vi.fn().mockReturnValue(
        of({
          success: true,
          data: {
            items: mockSkills,
            pagination: { page: 1, limit: 10, total: 2, totalPages: 1 },
          },
        }),
      ),
      deleteAdminSkill: vi.fn().mockReturnValue(of({ success: true, data: null })),
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
      imports: [SkillListComponent],
      providers: [
        provideRouter([]),
        { provide: PortfolioService, useValue: portfolioServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: MatDialog, useValue: dialogMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(SkillListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load skills on init and set signals', () => {
    expect(portfolioServiceMock.getAdminSkills).toHaveBeenCalledWith(
      expect.objectContaining({ page: 1, limit: 10 }),
    );
    expect(component.skills().length).toBe(2);
    expect(component.totalItems()).toBe(2);
    expect(component.isLoading()).toBe(false);
  });

  it('should handle search term change and reload skills', () => {
    component.onSearchChange('Angular');
    expect(component.searchTerm()).toBe('Angular');
    expect(component.currentPage()).toBe(1);
    expect(portfolioServiceMock.getAdminSkills).toHaveBeenCalledWith(
      expect.objectContaining({ search: 'Angular' }),
    );
  });

  it('should filter by visibility status', () => {
    component.onFilterChange('true');
    expect(component.activeFilter()).toBe('true');
    expect(portfolioServiceMock.getAdminSkills).toHaveBeenCalledWith(
      expect.objectContaining({ isVisible: true }),
    );

    component.onFilterChange('false');
    expect(portfolioServiceMock.getAdminSkills).toHaveBeenCalledWith(
      expect.objectContaining({ isVisible: false }),
    );

    component.onFilterChange('all');
    expect(portfolioServiceMock.getAdminSkills).toHaveBeenCalledWith(
      expect.objectContaining({ isVisible: undefined }),
    );
  });

  it('should navigate to create page on onCreateClick()', () => {
    const navSpy = vi.spyOn(router, 'navigate');
    component.onCreateClick();
    expect(navSpy).toHaveBeenCalledWith(['/admin/skills/create']);
  });

  it('should navigate to edit page on onEditClick()', () => {
    const navSpy = vi.spyOn(router, 'navigate');
    component.onEditClick({ _id: 'skill-1' });
    expect(navSpy).toHaveBeenCalledWith(['/admin/skills', 'skill-1', 'edit']);
  });

  it('should open confirm dialog on onDeleteClick() and delete when confirmed', () => {
    component.onDeleteClick(mockSkills[0] as unknown as Record<string, unknown>);

    expect(dialogMock.open).toHaveBeenCalled();
    expect(portfolioServiceMock.deleteAdminSkill).toHaveBeenCalledWith('skill-1');
    expect(notificationServiceMock.showSuccess).toHaveBeenCalledWith('Skill deleted successfully.');
  });

  it('should not delete skill if confirm dialog is cancelled', () => {
    dialogMock.open.mockReturnValue({
      afterClosed: () => of(false),
    });

    component.onDeleteClick(mockSkills[0] as unknown as Record<string, unknown>);

    expect(dialogMock.open).toHaveBeenCalled();
    expect(portfolioServiceMock.deleteAdminSkill).not.toHaveBeenCalled();
  });
});
