import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { PortfolioService } from './portfolio.service';
import { ApiService } from './api.service';
import {
  Profile,
  Project,
  Skill,
  Experience,
  Education,
  SocialLink,
  Settings,
  BlogPost,
  ApiResponse,
  PaginatedResponse,
} from '../models';

describe('PortfolioService', () => {
  let service: PortfolioService;
  let apiServiceMock: {
    get: ReturnType<typeof vi.fn>;
    post: ReturnType<typeof vi.fn>;
    put: ReturnType<typeof vi.fn>;
    patch: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
    getUrl: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    apiServiceMock = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
      getUrl: vi.fn().mockImplementation((path: string) => `http://localhost:5000/api/v1/${path.replace(/^\/+/, '')}`),
    };

    TestBed.configureTestingModule({
      providers: [
        PortfolioService,
        { provide: ApiService, useValue: apiServiceMock },
      ],
    });

    service = TestBed.inject(PortfolioService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch public profile', () => {
    const mockProfile: ApiResponse<Profile> = {
      success: true,
      message: 'Profile retrieved',
      data: {
        fullName: { en: 'Dim Sareach', kh: 'ឌីម សារាជ' },
        title: { en: 'Full Stack Engineer', kh: 'វិស្វករកម្មវិធី' },
        introduction: { en: 'Hello world', kh: 'សួស្តីពិភពលោក' },
        about: { en: 'About me', kh: 'អំពីខ្ញុំ' },
      },
    };
    apiServiceMock.get.mockReturnValue(of(mockProfile));

    service.getProfile().subscribe((res) => {
      expect(res.data.fullName.en).toBe('Dim Sareach');
    });

    expect(apiServiceMock.get).toHaveBeenCalledWith('/profile');
  });

  it('should fetch featured projects with featured filter', () => {
    const mockProjects: PaginatedResponse<Project> = {
      success: true,
      message: 'Projects retrieved',
      data: {
        items: [],
        pagination: {
          page: 1,
          limit: 3,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false,
        },
      },
    };
    apiServiceMock.get.mockReturnValue(of(mockProjects));

    service.getFeaturedProjects(3).subscribe();

    expect(apiServiceMock.get).toHaveBeenCalledWith('/projects', {
      featured: 'true',
      limit: 3,
    });
  });

  it('should fetch skills', () => {
    const mockSkills: ApiResponse<Skill[]> = {
      success: true,
      message: 'Skills retrieved',
      data: [],
    };
    apiServiceMock.get.mockReturnValue(of(mockSkills));

    service.getSkills('Frontend').subscribe();

    expect(apiServiceMock.get).toHaveBeenCalledWith('/skills', {
      category: 'Frontend',
    });
  });

  it('should fetch experiences', () => {
    const mockExp: ApiResponse<Experience[]> = {
      success: true,
      message: 'Experiences retrieved',
      data: [],
    };
    apiServiceMock.get.mockReturnValue(of(mockExp));

    service.getExperiences().subscribe();

    expect(apiServiceMock.get).toHaveBeenCalledWith('/experiences');
  });

  it('should fetch education', () => {
    const mockEdu: ApiResponse<Education[]> = {
      success: true,
      message: 'Education retrieved',
      data: [],
    };
    apiServiceMock.get.mockReturnValue(of(mockEdu));

    service.getEducation().subscribe();

    expect(apiServiceMock.get).toHaveBeenCalledWith('/education');
  });

  it('should fetch social links', () => {
    const mockLinks: ApiResponse<SocialLink[]> = {
      success: true,
      message: 'Links retrieved',
      data: [],
    };
    apiServiceMock.get.mockReturnValue(of(mockLinks));

    service.getSocialLinks().subscribe();

    expect(apiServiceMock.get).toHaveBeenCalledWith('/social-links');
  });

  it('should fetch public settings', () => {
    const mockSettings: ApiResponse<Settings> = {
      success: true,
      message: 'Settings retrieved',
      data: {
        siteTitle: { en: 'Sareach Portfolio', kh: 'ផលប័ត្រសារាជ' },
        siteDescription: { en: 'Portfolio description', kh: 'ការពិពណ៌នា' },
        enableCvDownload: true,
        cvDownloadCount: 0,
        enableContactForm: true,
        emailNotifications: false,
        maintenanceMode: false,
      },
    };
    apiServiceMock.get.mockReturnValue(of(mockSettings));

    service.getSettings().subscribe();

    expect(apiServiceMock.get).toHaveBeenCalledWith('/settings/public');
  });

  it('should fetch categories with optional filter', () => {
    apiServiceMock.get.mockReturnValue(of({ success: true, message: 'Categories retrieved', data: [] }));

    service.getCategories('project').subscribe();

    expect(apiServiceMock.get).toHaveBeenCalledWith('/categories', { type: 'project' });
  });

  it('should return correct CV download URL', () => {
    const url = service.getCvDownloadUrl();
    expect(url).toBe('http://localhost:5000/api/v1/cv/download');
  });

  it('should fetch admin dashboard statistics', () => {
    const mockStats = {
      success: true,
      message: 'Dashboard statistics retrieved successfully',
      data: {
        totalProjects: 10,
        publishedProjects: 8,
        draftProjects: 2,
        totalBlogPosts: 5,
        publishedBlogPosts: 4,
        draftBlogPosts: 1,
        unreadMessages: 3,
        totalMessages: 12,
        totalSkills: 20,
        totalExperiences: 4,
        cvDownloads: 42,
        recentMessages: [],
      },
    };
    apiServiceMock.get.mockReturnValue(of(mockStats));

    service.getDashboardStats().subscribe((res) => {
      expect(res.data.totalProjects).toBe(10);
      expect(res.data.unreadMessages).toBe(3);
    });

    expect(apiServiceMock.get).toHaveBeenCalledWith('/admin/dashboard/stats');
  });

  it('should fetch admin projects with query params', () => {
    apiServiceMock.get.mockReturnValue(of({ success: true, data: { items: [], pagination: {} } }));
    service.getAdminProjects({ page: 2, limit: 10, status: 'published' }).subscribe();
    expect(apiServiceMock.get).toHaveBeenCalledWith('/admin/projects', { page: 2, limit: 10, status: 'published' });
  });

  it('should fetch admin project by ID', () => {
    apiServiceMock.get.mockReturnValue(of({ success: true, data: { _id: 'proj-1' } }));
    service.getAdminProjectById('proj-1').subscribe();
    expect(apiServiceMock.get).toHaveBeenCalledWith('/admin/projects/proj-1');
  });

  it('should create admin project', () => {
    const newProj = { title: { en: 'New', kh: 'ថ្មី' } };
    apiServiceMock.post.mockReturnValue(of({ success: true, data: newProj }));
    service.createAdminProject(newProj).subscribe();
    expect(apiServiceMock.post).toHaveBeenCalledWith('/admin/projects', newProj);
  });

  it('should update admin project', () => {
    const updateProj = { title: { en: 'Updated', kh: 'ធ្វើបច្ចុប្បន្នភាព' } };
    apiServiceMock.patch.mockReturnValue(of({ success: true, data: updateProj }));
    service.updateAdminProject('proj-1', updateProj).subscribe();
    expect(apiServiceMock.patch).toHaveBeenCalledWith('/admin/projects/proj-1', updateProj);
  });

  it('should delete admin project', () => {
    apiServiceMock.delete.mockReturnValue(of({ success: true, data: null }));
    service.deleteAdminProject('proj-1').subscribe();
    expect(apiServiceMock.delete).toHaveBeenCalledWith('/admin/projects/proj-1');
  });

  it('should fetch admin skills with query params', () => {
    apiServiceMock.get.mockReturnValue(of({ success: true, data: { items: [], pagination: {} } }));
    service.getAdminSkills({ page: 1, limit: 10, search: 'Angular' }).subscribe();
    expect(apiServiceMock.get).toHaveBeenCalledWith('/admin/skills', { page: 1, limit: 10, search: 'Angular' });
  });

  it('should fetch admin skill by ID', () => {
    apiServiceMock.get.mockReturnValue(of({ success: true, data: { _id: 'skill-1' } }));
    service.getAdminSkillById('skill-1').subscribe();
    expect(apiServiceMock.get).toHaveBeenCalledWith('/admin/skills/skill-1');
  });

  it('should create admin skill', () => {
    const newSkill = { name: 'Angular', category: { en: 'Frontend', kh: 'ផ្នែកខាងមុខ' } };
    apiServiceMock.post.mockReturnValue(of({ success: true, data: newSkill }));
    service.createAdminSkill(newSkill).subscribe();
    expect(apiServiceMock.post).toHaveBeenCalledWith('/admin/skills', newSkill);
  });

  it('should update admin skill', () => {
    const updateSkill = { name: 'Angular 19' };
    apiServiceMock.patch.mockReturnValue(of({ success: true, data: updateSkill }));
    service.updateAdminSkill('skill-1', updateSkill).subscribe();
    expect(apiServiceMock.patch).toHaveBeenCalledWith('/admin/skills/skill-1', updateSkill);
  });

  it('should delete admin skill', () => {
    apiServiceMock.delete.mockReturnValue(of({ success: true, data: null }));
    service.deleteAdminSkill('skill-1').subscribe();
    expect(apiServiceMock.delete).toHaveBeenCalledWith('/admin/skills/skill-1');
  });

  it('should fetch admin experiences with query params', () => {
    apiServiceMock.get.mockReturnValue(of({ success: true, data: { items: [], pagination: {} } }));
    service.getAdminExperiences({ page: 1, limit: 10, type: 'work' }).subscribe();
    expect(apiServiceMock.get).toHaveBeenCalledWith('/admin/experiences', { page: 1, limit: 10, type: 'work' });
  });

  it('should fetch admin experience by ID', () => {
    apiServiceMock.get.mockReturnValue(of({ success: true, data: { _id: 'exp-1' } }));
    service.getAdminExperienceById('exp-1').subscribe();
    expect(apiServiceMock.get).toHaveBeenCalledWith('/admin/experiences/exp-1');
  });

  it('should create admin experience', () => {
    const newExp = {
      title: { en: 'Senior Engineer', kh: 'វិស្វករជាន់ខ្ពស់' },
      organization: { en: 'Tech Corp', kh: 'តិច ខប' },
      type: 'work' as const,
    };
    apiServiceMock.post.mockReturnValue(of({ success: true, data: newExp }));
    service.createAdminExperience(newExp).subscribe();
    expect(apiServiceMock.post).toHaveBeenCalledWith('/admin/experiences', newExp);
  });

  it('should update admin experience', () => {
    const updateExp = { title: { en: 'Lead Engineer', kh: 'ប្រធានវិស្វករ' } };
    apiServiceMock.patch.mockReturnValue(of({ success: true, data: updateExp }));
    service.updateAdminExperience('exp-1', updateExp).subscribe();
    expect(apiServiceMock.patch).toHaveBeenCalledWith('/admin/experiences/exp-1', updateExp);
  });

  it('should delete admin experience', () => {
    apiServiceMock.delete.mockReturnValue(of({ success: true, data: null }));
    service.deleteAdminExperience('exp-1').subscribe();
    expect(apiServiceMock.delete).toHaveBeenCalledWith('/admin/experiences/exp-1');
  });

  it('should fetch admin education with query params', () => {
    apiServiceMock.get.mockReturnValue(of({ success: true, data: { items: [], pagination: {} } }));
    service.getAdminEducation({ page: 1, limit: 10, search: 'University' }).subscribe();
    expect(apiServiceMock.get).toHaveBeenCalledWith('/admin/education', { page: 1, limit: 10, search: 'University' });
  });

  it('should fetch admin education by ID', () => {
    apiServiceMock.get.mockReturnValue(of({ success: true, data: { _id: 'edu-1' } }));
    service.getAdminEducationById('edu-1').subscribe();
    expect(apiServiceMock.get).toHaveBeenCalledWith('/admin/education/edu-1');
  });

  it('should create admin education', () => {
    const newEdu = {
      institution: { en: 'RUPP', kh: 'សាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ' },
      degree: { en: 'Bachelor of Science', kh: 'បរិញ្ញាបត្រវិទ្យាសាស្ត្រ' },
      field: { en: 'Computer Science', kh: 'វិទ្យាសាស្ត្រកុំព្យូទ័រ' },
      startYear: 2020,
    };
    apiServiceMock.post.mockReturnValue(of({ success: true, data: newEdu }));
    service.createAdminEducation(newEdu).subscribe();
    expect(apiServiceMock.post).toHaveBeenCalledWith('/admin/education', newEdu);
  });

  it('should update admin education', () => {
    const updateEdu = { endYear: 2024 };
    apiServiceMock.patch.mockReturnValue(of({ success: true, data: updateEdu }));
    service.updateAdminEducation('edu-1', updateEdu).subscribe();
    expect(apiServiceMock.patch).toHaveBeenCalledWith('/admin/education/edu-1', updateEdu);
  });

  it('should delete admin education', () => {
    apiServiceMock.delete.mockReturnValue(of({ success: true, data: null }));
    service.deleteAdminEducation('edu-1').subscribe();
    expect(apiServiceMock.delete).toHaveBeenCalledWith('/admin/education/edu-1');
  });

  it('should fetch admin certifications with query params', () => {
    apiServiceMock.get.mockReturnValue(of({ success: true, data: { items: [], pagination: {} } }));
    service.getAdminCertifications({ page: 1, limit: 10, type: 'certification' }).subscribe();
    expect(apiServiceMock.get).toHaveBeenCalledWith('/admin/certifications', { page: 1, limit: 10, type: 'certification' });
  });

  it('should fetch admin certification by ID', () => {
    apiServiceMock.get.mockReturnValue(of({ success: true, data: { _id: 'cert-1' } }));
    service.getAdminCertificationById('cert-1').subscribe();
    expect(apiServiceMock.get).toHaveBeenCalledWith('/admin/certifications/cert-1');
  });

  it('should create admin certification', () => {
    const newCert = {
      name: { en: 'AWS Solutions Architect', kh: 'ស្ថាបត្យករដំណោះស្រាយ AWS' },
      type: 'certification' as const,
      organization: { en: 'Amazon Web Services', kh: 'AWS' },
      issueDate: '2024-01-01',
    };
    apiServiceMock.post.mockReturnValue(of({ success: true, data: newCert }));
    service.createAdminCertification(newCert).subscribe();
    expect(apiServiceMock.post).toHaveBeenCalledWith('/admin/certifications', newCert);
  });

  it('should update admin certification', () => {
    const updateCert = { credentialId: 'AWS-12345' };
    apiServiceMock.patch.mockReturnValue(of({ success: true, data: updateCert }));
    service.updateAdminCertification('cert-1', updateCert).subscribe();
    expect(apiServiceMock.patch).toHaveBeenCalledWith('/admin/certifications/cert-1', updateCert);
  });

  it('should delete admin certification', () => {
    apiServiceMock.delete.mockReturnValue(of({ success: true, data: null }));
    service.deleteAdminCertification('cert-1').subscribe();
    expect(apiServiceMock.delete).toHaveBeenCalledWith('/admin/certifications/cert-1');
  });

  it('should get admin blog posts with pagination/filters', () => {
    apiServiceMock.get.mockReturnValue(of({ success: true, data: [], pagination: {} }));
    service.getAdminBlogPosts({ page: 1, limit: 10, status: 'published', search: 'angular' }).subscribe();
    expect(apiServiceMock.get).toHaveBeenCalledWith('/admin/blog', {
      page: 1,
      limit: 10,
      status: 'published',
      search: 'angular',
    });
  });

  it('should get admin blog post by id', () => {
    apiServiceMock.get.mockReturnValue(of({ success: true, data: { _id: 'post-1' } }));
    service.getAdminBlogPostById('post-1').subscribe();
    expect(apiServiceMock.get).toHaveBeenCalledWith('/admin/blog/post-1');
  });

  it('should create admin blog post', () => {
    const payload = { title: { en: 'Test', kh: 'តេស្ត' } } as unknown as Partial<BlogPost>;
    apiServiceMock.post.mockReturnValue(of({ success: true, data: { _id: 'post-1', ...payload } }));
    service.createAdminBlogPost(payload).subscribe();
    expect(apiServiceMock.post).toHaveBeenCalledWith('/admin/blog', payload);
  });

  it('should update admin blog post', () => {
    const payload = { title: { en: 'Updated', kh: 'បច្ចុប្បន្នភាព' } } as unknown as Partial<BlogPost>;
    apiServiceMock.patch.mockReturnValue(of({ success: true, data: { _id: 'post-1', ...payload } }));
    service.updateAdminBlogPost('post-1', payload).subscribe();
    expect(apiServiceMock.patch).toHaveBeenCalledWith('/admin/blog/post-1', payload);
  });

  it('should delete admin blog post', () => {
    apiServiceMock.delete.mockReturnValue(of({ success: true, data: null }));
    service.deleteAdminBlogPost('post-1').subscribe();
    expect(apiServiceMock.delete).toHaveBeenCalledWith('/admin/blog/post-1');
  });

  it('should publish admin blog post', () => {
    apiServiceMock.patch.mockReturnValue(of({ success: true, data: { _id: 'post-1', status: 'published' } }));
    service.publishAdminBlogPost('post-1').subscribe();
    expect(apiServiceMock.patch).toHaveBeenCalledWith('/admin/blog/post-1/publish', {});
  });

  it('should unpublish admin blog post', () => {
    apiServiceMock.patch.mockReturnValue(of({ success: true, data: { _id: 'post-1', status: 'draft' } }));
    service.unpublishAdminBlogPost('post-1').subscribe();
    expect(apiServiceMock.patch).toHaveBeenCalledWith('/admin/blog/post-1/unpublish', {});
  });

  // Admin Categories
  it('should get, create, update, delete admin categories', () => {
    apiServiceMock.get.mockReturnValue(of({ success: true, data: [] }));
    service.getAdminCategories().subscribe();
    expect(apiServiceMock.get).toHaveBeenCalledWith('/admin/categories');

    apiServiceMock.post.mockReturnValue(of({ success: true, data: {} }));
    service.createAdminCategory({ slug: 'new-cat' }).subscribe();
    expect(apiServiceMock.post).toHaveBeenCalledWith('/admin/categories', { slug: 'new-cat' });

    apiServiceMock.patch.mockReturnValue(of({ success: true, data: {} }));
    service.updateAdminCategory('cat-1', { slug: 'up-cat' }).subscribe();
    expect(apiServiceMock.patch).toHaveBeenCalledWith('/admin/categories/cat-1', { slug: 'up-cat' });

    apiServiceMock.delete.mockReturnValue(of({ success: true, data: null }));
    service.deleteAdminCategory('cat-1').subscribe();
    expect(apiServiceMock.delete).toHaveBeenCalledWith('/admin/categories/cat-1');
  });

  // Admin Messages
  it('should get, read, unread, archive, and delete admin messages', () => {
    apiServiceMock.get.mockReturnValue(of({ success: true, data: [] }));
    service.getAdminMessages({ page: 1, limit: 10, isRead: false }).subscribe();
    expect(apiServiceMock.get).toHaveBeenCalledWith('/admin/messages', { page: 1, limit: 10, isRead: false });

    service.getAdminMessageById('msg-1').subscribe();
    expect(apiServiceMock.get).toHaveBeenCalledWith('/admin/messages/msg-1');

    apiServiceMock.patch.mockReturnValue(of({ success: true, data: {} }));
    service.markAdminMessageAsRead('msg-1').subscribe();
    expect(apiServiceMock.patch).toHaveBeenCalledWith('/admin/messages/msg-1/read', {});

    service.markAdminMessageAsUnread('msg-1').subscribe();
    expect(apiServiceMock.patch).toHaveBeenCalledWith('/admin/messages/msg-1/unread', {});

    service.archiveAdminMessage('msg-1').subscribe();
    expect(apiServiceMock.patch).toHaveBeenCalledWith('/admin/messages/msg-1/archive', {});

    apiServiceMock.delete.mockReturnValue(of({ success: true, data: null }));
    service.deleteAdminMessage('msg-1').subscribe();
    expect(apiServiceMock.delete).toHaveBeenCalledWith('/admin/messages/msg-1');
  });

  // Admin Profile & Settings
  it('should get and upsert admin profile', () => {
    apiServiceMock.get.mockReturnValue(of({ success: true, data: {} }));
    service.getAdminProfile().subscribe();
    expect(apiServiceMock.get).toHaveBeenCalledWith('/admin/profile');

    apiServiceMock.put.mockReturnValue(of({ success: true, data: {} }));
    service.upsertAdminProfile({ email: 'test@example.com' }).subscribe();
    expect(apiServiceMock.put).toHaveBeenCalledWith('/admin/profile', { email: 'test@example.com' });
  });

  it('should get and update admin settings', () => {
    apiServiceMock.get.mockReturnValue(of({ success: true, data: {} }));
    service.getAdminSettings().subscribe();
    expect(apiServiceMock.get).toHaveBeenCalledWith('/admin/settings');

    apiServiceMock.put.mockReturnValue(of({ success: true, data: {} }));
    service.updateAdminSettings({ enableCvDownload: true }).subscribe();
    expect(apiServiceMock.put).toHaveBeenCalledWith('/admin/settings', { enableCvDownload: true });
  });

  // Admin Social Links
  it('should manage admin social links and reordering', () => {
    apiServiceMock.get.mockReturnValue(of({ success: true, data: [] }));
    service.getAdminSocialLinks().subscribe();
    expect(apiServiceMock.get).toHaveBeenCalledWith('/admin/social-links');

    apiServiceMock.post.mockReturnValue(of({ success: true, data: {} }));
    service.createAdminSocialLink({ platform: 'github' }).subscribe();
    expect(apiServiceMock.post).toHaveBeenCalledWith('/admin/social-links', { platform: 'github' });

    apiServiceMock.patch.mockReturnValue(of({ success: true, data: {} }));
    service.updateAdminSocialLink('soc-1', { label: 'GitHub' }).subscribe();
    expect(apiServiceMock.patch).toHaveBeenCalledWith('/admin/social-links/soc-1', { label: 'GitHub' });

    apiServiceMock.delete.mockReturnValue(of({ success: true, data: null }));
    service.deleteAdminSocialLink('soc-1').subscribe();
    expect(apiServiceMock.delete).toHaveBeenCalledWith('/admin/social-links/soc-1');

    service.reorderAdminSocialLinks(['soc-2', 'soc-1']).subscribe();
    expect(apiServiceMock.patch).toHaveBeenCalledWith('/admin/social-links/reorder', { linkIds: ['soc-2', 'soc-1'] });
  });

  // Admin Media & CV
  it('should manage admin media and cv', () => {
    apiServiceMock.get.mockReturnValue(of({ success: true, data: [] }));
    service.getAdminMedia({ page: 1, limit: 12 }).subscribe();
    expect(apiServiceMock.get).toHaveBeenCalledWith('/admin/media', { page: 1, limit: 12 });

    const fd = new FormData();
    apiServiceMock.post.mockReturnValue(of({ success: true, data: {} }));
    service.uploadAdminMedia(fd).subscribe();
    expect(apiServiceMock.post).toHaveBeenCalledWith('/admin/media/upload', fd);

    apiServiceMock.delete.mockReturnValue(of({ success: true, data: null }));
    service.deleteAdminMedia('media-1').subscribe();
    expect(apiServiceMock.delete).toHaveBeenCalledWith('/admin/media/media-1');

    service.getAdminCv().subscribe();
    expect(apiServiceMock.get).toHaveBeenCalledWith('/admin/cv');

    service.uploadAdminCv(fd).subscribe();
    expect(apiServiceMock.post).toHaveBeenCalledWith('/admin/cv/upload', fd);

    service.deleteAdminCv().subscribe();
    expect(apiServiceMock.delete).toHaveBeenCalledWith('/admin/cv');
  });
});


