import request from 'supertest';
import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import app from '../../src/app';
import profileService from '../../src/services/profile.service';
import projectService from '../../src/services/project.service';
import skillService from '../../src/services/skill.service';
import experienceService from '../../src/services/experience.service';
import educationService from '../../src/services/education.service';
import certificationService from '../../src/services/certification.service';
import blogService from '../../src/services/blog.service';
import categoryService from '../../src/services/category.service';
import socialLinkService from '../../src/services/socialLink.service';
import settingsService from '../../src/services/settings.service';
import { NotFoundError } from '../../src/utils/AppError';

describe('Public API Integration Tests (/api/v1/*)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('1. GET /api/v1/profile', () => {
    it('should return 200 and public profile without requiring authentication', async () => {
      const mockProfile: any = {
        _id: '6abc2f77ed5966aa1b87e201',
        fullName: { en: 'Sokha Chea', kh: 'ជា សុខា' },
        title: { en: 'Full Stack Engineer', kh: 'វិស្វករកម្មវិធី' },
        introduction: { en: 'Welcome to my portfolio', kh: 'សូមស្វាគមន៍' },
        about: { en: 'Passionate developer...', kh: 'អ្នកអភិវឌ្ឍន៍...' },
      };

      jest.spyOn(profileService, 'getProfile').mockResolvedValue(mockProfile);

      const res = await request(app).get('/api/v1/profile');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.fullName.en).toBe('Sokha Chea');
      expect(profileService.getProfile).toHaveBeenCalled();
    });

    it('should return 404 when profile is not found', async () => {
      jest.spyOn(profileService, 'getProfile').mockResolvedValue(null);

      const res = await request(app).get('/api/v1/profile');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Profile not found');
    });
  });

  describe('2. GET /api/v1/projects', () => {
    it('should return 200 and published projects with pagination and filters', async () => {
      const mockProjectsData: any = {
        items: [
          {
            _id: '6abc2f77ed5966aa1b87e202',
            title: { en: 'Project One', kh: 'គម្រោងទីមួយ' },
            slug: 'project-one',
            status: 'published',
            featured: true,
          },
        ],
        pagination: {
          page: 1,
          limit: 6,
          total: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        },
      };

      jest.spyOn(projectService, 'getAll').mockResolvedValue(mockProjectsData);

      const res = await request(app)
        .get('/api/v1/projects')
        .query({ page: 1, limit: 6, category: 'web-dev', featured: 'true', search: 'Project' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.items).toHaveLength(1);
      expect(res.body.data.pagination.total).toBe(1);
      expect(projectService.getAll).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'published',
          category: 'web-dev',
          featured: 'true',
          search: 'Project',
          limit: 6,
        }),
      );
    });
  });

  describe('3. GET /api/v1/projects/:slug', () => {
    it('should return 200 and project by slug with incremented viewCount', async () => {
      const mockProject: any = {
        _id: '6abc2f77ed5966aa1b87e203',
        title: { en: 'Awesome Project', kh: 'គម្រោងអស្ចារ្យ' },
        slug: 'awesome-project',
        viewCount: 15,
        status: 'published',
      };

      jest.spyOn(projectService, 'getBySlug').mockResolvedValue(mockProject);

      const res = await request(app).get('/api/v1/projects/awesome-project');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.slug).toBe('awesome-project');
      expect(projectService.getBySlug).toHaveBeenCalledWith('awesome-project', {
        incrementViews: true,
        publishedOnly: true,
      });
    });

    it('should return 404 when project with slug is not found or not published', async () => {
      jest
        .spyOn(projectService, 'getBySlug')
        .mockRejectedValue(new NotFoundError("Project with slug 'not-found' not found"));

      const res = await request(app).get('/api/v1/projects/not-found');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('4. GET /api/v1/skills', () => {
    it('should return 200 and visible skills', async () => {
      const mockSkills: any = [
        {
          _id: '6abc2f77ed5966aa1b87e204',
          name: 'TypeScript',
          isVisible: true,
        },
      ];

      jest.spyOn(skillService, 'getAll').mockResolvedValue(mockSkills);

      const res = await request(app).get('/api/v1/skills');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(skillService.getAll).toHaveBeenCalledWith(
        expect.objectContaining({
          isVisible: true,
        }),
      );
    });
  });

  describe('5. GET /api/v1/experiences', () => {
    it('should return 200 and experiences with optional type filter', async () => {
      const mockExperiences: any = [
        {
          _id: '6abc2f77ed5966aa1b87e205',
          title: { en: 'Senior Engineer', kh: 'វិស្វករជាន់ខ្ពស់' },
          type: 'work',
        },
      ];

      jest.spyOn(experienceService, 'getAll').mockResolvedValue(mockExperiences);

      const res = await request(app).get('/api/v1/experiences').query({ type: 'work' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data[0].type).toBe('work');
      expect(experienceService.getAll).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'work',
        }),
      );
    });
  });

  describe('6. GET /api/v1/education', () => {
    it('should return 200 and education entries', async () => {
      const mockEducation: any = [
        {
          _id: '6abc2f77ed5966aa1b87e206',
          institution: { en: 'RUPP', kh: 'សាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ' },
          degree: { en: 'Computer Science', kh: 'វិទ្យាសាស្ត្រកុំព្យូទ័រ' },
        },
      ];

      jest.spyOn(educationService, 'getAll').mockResolvedValue(mockEducation);

      const res = await request(app).get('/api/v1/education');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(educationService.getAll).toHaveBeenCalled();
    });
  });

  describe('7. GET /api/v1/certifications', () => {
    it('should return 200 and visible certifications only', async () => {
      const mockCertifications: any = [
        {
          _id: '6abc2f77ed5966aa1b87e207',
          name: { en: 'AWS Certified Developer', kh: 'វិញ្ញាបនបត្រ AWS' },
          type: 'certification',
          isVisible: true,
        },
      ];

      jest.spyOn(certificationService, 'getAll').mockResolvedValue(mockCertifications);

      const res = await request(app).get('/api/v1/certifications').query({ type: 'certification' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(certificationService.getAll).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'certification',
          isVisible: true,
        }),
      );
    });
  });

  describe('8. GET /api/v1/blog', () => {
    it('should return 200 and published blog posts with pagination', async () => {
      const mockBlogData: any = {
        items: [
          {
            _id: '6abc2f77ed5966aa1b87e208',
            title: { en: 'Getting Started with Angular', kh: 'ចាប់ផ្តើមជាមួយ Angular' },
            slug: 'getting-started-with-angular',
            status: 'published',
          },
        ],
        pagination: {
          page: 1,
          limit: 6,
          total: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        },
      };

      jest.spyOn(blogService, 'getAll').mockResolvedValue(mockBlogData);

      const res = await request(app)
        .get('/api/v1/blog')
        .query({ page: 1, limit: 6, tag: 'Angular', search: 'Getting Started' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.items).toHaveLength(1);
      expect(blogService.getAll).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'published',
          tag: 'Angular',
          search: 'Getting Started',
          limit: 6,
        }),
      );
    });
  });

  describe('9. GET /api/v1/blog/:slug', () => {
    it('should return 200 and published blog post with incremented viewCount', async () => {
      const mockBlogPost: any = {
        _id: '6abc2f77ed5966aa1b87e209',
        title: { en: 'Angular Best Practices', kh: 'ការអនុវត្តល្អបំផុតក្នុង Angular' },
        slug: 'angular-best-practices',
        viewCount: 42,
        status: 'published',
      };

      jest.spyOn(blogService, 'getBySlug').mockResolvedValue(mockBlogPost);

      const res = await request(app).get('/api/v1/blog/angular-best-practices');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.slug).toBe('angular-best-practices');
      expect(blogService.getBySlug).toHaveBeenCalledWith('angular-best-practices', {
        incrementViews: true,
        publishedOnly: true,
      });
    });

    it('should return 404 when blog post is not found or not published', async () => {
      jest
        .spyOn(blogService, 'getBySlug')
        .mockRejectedValue(new NotFoundError("Blog post with slug 'unknown' not found"));

      const res = await request(app).get('/api/v1/blog/unknown');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('10. GET /api/v1/categories', () => {
    it('should return 200 and categories with optional type filter', async () => {
      const mockCategories: any = [
        {
          _id: '6abc2f77ed5966aa1b87e210',
          name: { en: 'Frontend', kh: 'ផ្នែកខាងមុខ' },
          slug: 'frontend',
          type: 'project',
        },
      ];

      jest.spyOn(categoryService, 'getAll').mockResolvedValue(mockCategories);

      const res = await request(app).get('/api/v1/categories').query({ type: 'project' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(categoryService.getAll).toHaveBeenCalledWith({ type: 'project' });
    });
  });

  describe('11. GET /api/v1/social-links', () => {
    it('should return 200 and visible social links only', async () => {
      const mockSocialLinks: any = [
        {
          _id: '6abc2f77ed5966aa1b87e211',
          platform: 'github',
          url: 'https://github.com/developer',
          isVisible: true,
        },
      ];

      jest.spyOn(socialLinkService, 'getAll').mockResolvedValue(mockSocialLinks);

      const res = await request(app).get('/api/v1/social-links');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(socialLinkService.getAll).toHaveBeenCalledWith({ isVisible: true });
    });
  });

  describe('12. GET /api/v1/settings/public', () => {
    it('should return 200 and only public subset of settings', async () => {
      const mockFullSettings: any = {
        _id: '6abc2f77ed5966aa1b87e212',
        siteTitle: { en: 'Developer Portfolio', kh: 'គេហទំព័រផ្ទាល់ខ្លួន' },
        siteDescription: { en: 'Full stack engineer portfolio', kh: 'គេហទំព័រវិស្វករ' },
        enableCvDownload: true,
        enableContactForm: true,
        emailNotifications: true,
        notificationEmail: 'private-admin@example.com',
        maintenanceMode: false,
        cvDownloadCount: 99,
      };

      jest.spyOn(settingsService, 'getSettings').mockResolvedValue(mockFullSettings);

      const res = await request(app).get('/api/v1/settings/public');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual({
        siteTitle: mockFullSettings.siteTitle,
        siteDescription: mockFullSettings.siteDescription,
        enableCvDownload: true,
        enableContactForm: true,
      });

      // Ensure private settings are NEVER exposed in public endpoint
      expect(res.body.data.notificationEmail).toBeUndefined();
      expect(res.body.data.emailNotifications).toBeUndefined();
      expect(res.body.data.maintenanceMode).toBeUndefined();
      expect(res.body.data.cvDownloadCount).toBeUndefined();
    });
  });
});
