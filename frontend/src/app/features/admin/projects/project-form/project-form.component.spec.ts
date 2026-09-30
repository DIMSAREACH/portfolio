import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router, ActivatedRoute, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ProjectFormComponent } from './project-form.component';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Category, Project } from '../../../../core/models';

describe('ProjectFormComponent', () => {
  let component: ProjectFormComponent;
  let fixture: ComponentFixture<ProjectFormComponent>;
  let router: Router;

  let portfolioServiceMock: {
    getCategories: ReturnType<typeof vi.fn>;
    getAdminProjectById: ReturnType<typeof vi.fn>;
    createAdminProject: ReturnType<typeof vi.fn>;
    updateAdminProject: ReturnType<typeof vi.fn>;
  };

  let notificationServiceMock: {
    showSuccess: ReturnType<typeof vi.fn>;
    showError: ReturnType<typeof vi.fn>;
  };

  const mockCategories: Category[] = [
    {
      _id: 'cat-1',
      name: { en: 'Web Development', kh: 'ការអភិវឌ្ឍគេហទំព័រ' },
      slug: 'web-dev',
      type: 'project',
      order: 1,
    },
    {
      _id: 'cat-2',
      name: { en: 'Mobile App', kh: 'កម្មវិធីទូរស័ព្ទ' },
      slug: 'mobile-app',
      type: 'project',
      order: 2,
    },
  ];

  const mockProject: Project = {
    _id: 'proj-123',
    title: { en: 'Enterprise Platform', kh: 'វេទិកាសហគ្រាស' },
    slug: 'enterprise-platform',
    category: mockCategories[0],
    status: 'published',
    featured: true,
    order: 1,
    shortDescription: { en: 'Enterprise cloud solution', kh: 'ដំណោះស្រាយពពក' },
    mainImage: 'https://example.com/project.png',
    screenshots: ['https://example.com/shot1.png'],
    viewCount: 42,
    technologies: ['Angular', 'Node.js', 'MongoDB'],
    githubUrl: 'https://github.com/example/platform',
    liveUrl: 'https://example.com',
    videoUrl: 'https://youtube.com/watch?v=123',
    startDate: '2025-01-01T00:00:00.000Z',
    completionDate: '2025-06-01T00:00:00.000Z',
    fullDescription: { en: 'Comprehensive case study details', kh: 'ព័ត៌មានលម្អិត' },
    problem: { en: 'Legacy monolithic architecture', kh: 'បញ្ហា' },
    solution: { en: 'Microservices with Kubernetes', kh: 'ដំណោះស្រាយ' },
  };

  const createComponent = async (paramId?: string) => {
    portfolioServiceMock = {
      getCategories: vi.fn().mockReturnValue(of({ success: true, data: mockCategories })),
      getAdminProjectById: vi.fn().mockReturnValue(of({ success: true, data: mockProject })),
      createAdminProject: vi.fn().mockReturnValue(of({ success: true, data: mockProject })),
      updateAdminProject: vi.fn().mockReturnValue(of({ success: true, data: mockProject })),
    };

    notificationServiceMock = {
      showSuccess: vi.fn(),
      showError: vi.fn(),
    };

    const activatedRouteMock = {
      snapshot: {
        paramMap: convertToParamMap(paramId ? { id: paramId } : {}),
      },
    };

    await TestBed.configureTestingModule({
      imports: [ProjectFormComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: PortfolioService, useValue: portfolioServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(ProjectFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  describe('Create Mode', () => {
    beforeEach(async () => {
      await createComponent();
    });

    it('should create the component in create mode by default', () => {
      expect(component).toBeTruthy();
      expect(component.isEditMode()).toBe(false);
      expect(component.projectId()).toBeNull();
      expect(portfolioServiceMock.getCategories).toHaveBeenCalledWith('project');
      expect(component.categories().length).toBe(2);
    });

    it('should auto-generate URL slug when title EN changes in create mode', () => {
      component.onTitleChange({ en: 'Smart Logistics & Fleet AI' });
      expect(component.projectForm.get('slug')?.value).toBe('smart-logistics-fleet-ai');
    });

    it('should add technology tag when new tag is entered', () => {
      component.newTagInput = 'GraphQL';
      component.addTechTag();
      expect(component.techTags()).toContain('GraphQL');
      expect(component.newTagInput).toBe('');

      // Should not add duplicate tag
      component.newTagInput = 'GraphQL';
      component.addTechTag();
      expect(component.techTags().filter((t) => t === 'GraphQL').length).toBe(1);
    });

    it('should remove technology tag', () => {
      component.techTags.set(['Angular', 'NestJS', 'Docker']);
      component.removeTechTag('NestJS');
      expect(component.techTags()).toEqual(['Angular', 'Docker']);
    });

    it('should handle main image selection and removal', () => {
      const mockFile = new File(['dummy'], 'cover.png', { type: 'image/png' });
      component.onMainImageSelected(mockFile);
      expect(component.selectedImageFile).toBe(mockFile);
      expect(component.projectForm.get('mainImage')?.value).toBe('file://cover.png');

      component.onMainImageRemoved();
      expect(component.selectedImageFile).toBeNull();
      expect(component.projectForm.get('mainImage')?.value).toBe('');
    });

    it('should validate missing required fields on submit', () => {
      component.onSubmit();
      expect(notificationServiceMock.showError).toHaveBeenCalledWith(
        'Please fill in required English title and descriptions.',
      );
      expect(portfolioServiceMock.createAdminProject).not.toHaveBeenCalled();
    });

    it('should require at least one tech tag on submit', () => {
      component.projectForm.patchValue({
        title: { en: 'New Project', kh: '' },
        shortDescription: { en: 'Short description', kh: '' },
        fullDescription: { en: 'Full description', kh: '' },
        slug: 'new-project',
        category: 'cat-1',
        mainImage: 'https://example.com/img.png',
      });
      component.techTags.set([]);

      component.onSubmit();
      expect(notificationServiceMock.showError).toHaveBeenCalledWith(
        'Please add at least one technology tag.',
      );
      expect(portfolioServiceMock.createAdminProject).not.toHaveBeenCalled();
    });

    it('should call createAdminProject and navigate on valid submission', () => {
      const navSpy = vi.spyOn(router, 'navigate');

      component.projectForm.patchValue({
        title: { en: 'New Awesome App', kh: 'កម្មវិធីអស្ចារ្យថ្មី' },
        slug: 'new-awesome-app',
        category: 'cat-1',
        status: 'published',
        featured: true,
        order: 1,
        shortDescription: { en: 'Short overview', kh: '' },
        mainImage: 'https://example.com/app.png',
        fullDescription: { en: 'Detailed case study', kh: '' },
      });
      component.techTags.set(['React', 'Node.js']);

      component.onSubmit();

      expect(portfolioServiceMock.createAdminProject).toHaveBeenCalledWith(
        expect.objectContaining({
          slug: 'new-awesome-app',
          technologies: ['React', 'Node.js'],
        }),
      );
      expect(notificationServiceMock.showSuccess).toHaveBeenCalledWith('Project created successfully!');
      expect(navSpy).toHaveBeenCalledWith(['/admin/projects']);
    });

    it('should show error notification if createAdminProject fails', () => {
      portfolioServiceMock.createAdminProject.mockReturnValue(
        throwError(() => ({ error: { message: 'Slug already taken' } })),
      );

      component.projectForm.patchValue({
        title: { en: 'New App', kh: '' },
        slug: 'new-app',
        category: 'cat-1',
        status: 'published',
        shortDescription: { en: 'Short description', kh: '' },
        mainImage: 'https://example.com/app.png',
        fullDescription: { en: 'Full description', kh: '' },
      });
      component.techTags.set(['Vue']);

      component.onSubmit();

      expect(component.isSubmitting()).toBe(false);
      expect(notificationServiceMock.showError).toHaveBeenCalledWith('Slug already taken');
    });
  });

  describe('Edit Mode', () => {
    beforeEach(async () => {
      await createComponent('proj-123');
    });

    it('should initialize in edit mode and populate form from existing project', () => {
      expect(component.isEditMode()).toBe(true);
      expect(component.projectId()).toBe('proj-123');
      expect(portfolioServiceMock.getAdminProjectById).toHaveBeenCalledWith('proj-123');

      expect(component.projectForm.get('title')?.value).toEqual(mockProject.title);
      expect(component.projectForm.get('slug')?.value).toBe('enterprise-platform');
      expect(component.projectForm.get('category')?.value).toBe('cat-1');
      expect(component.techTags()).toEqual(['Angular', 'Node.js', 'MongoDB']);
    });

    it('should not auto-overwrite slug on title change in edit mode', () => {
      component.onTitleChange({ en: 'Changed Enterprise Name' });
      expect(component.projectForm.get('slug')?.value).toBe('enterprise-platform');
    });

    it('should call updateAdminProject and navigate on save changes', () => {
      const navSpy = vi.spyOn(router, 'navigate');

      component.onSubmit();

      expect(portfolioServiceMock.updateAdminProject).toHaveBeenCalledWith(
        'proj-123',
        expect.objectContaining({
          slug: 'enterprise-platform',
          technologies: ['Angular', 'Node.js', 'MongoDB'],
        }),
      );
      expect(notificationServiceMock.showSuccess).toHaveBeenCalledWith('Project updated successfully!');
      expect(navSpy).toHaveBeenCalledWith(['/admin/projects']);
    });

    it('should show error notification if updateAdminProject fails', () => {
      portfolioServiceMock.updateAdminProject.mockReturnValue(
        throwError(() => ({ error: { message: 'Update failed on server' } })),
      );

      component.onSubmit();

      expect(component.isSubmitting()).toBe(false);
      expect(notificationServiceMock.showError).toHaveBeenCalledWith('Update failed on server');
    });
  });

  describe('Field Validation Helper', () => {
    beforeEach(async () => {
      await createComponent();
    });

    it('should return true for invalid touched controls', () => {
      const slugControl = component.projectForm.get('slug');
      slugControl?.setValue('');
      slugControl?.markAsTouched();

      expect(component.isFieldInvalid('slug')).toBe(true);
    });

    it('should return false for valid controls', () => {
      const slugControl = component.projectForm.get('slug');
      slugControl?.setValue('valid-slug');
      slugControl?.markAsTouched();

      expect(component.isFieldInvalid('slug')).toBe(false);
    });

    it('should check bilingual en presence for title', () => {
      const titleControl = component.projectForm.get('title');
      titleControl?.setValue({ en: '', kh: 'ខ្មែរ' });
      titleControl?.markAsTouched();

      expect(component.isFieldInvalid('title')).toBe(true);

      titleControl?.setValue({ en: 'English Title', kh: 'ខ្មែរ' });
      expect(component.isFieldInvalid('title')).toBe(false);
    });
  });
});
