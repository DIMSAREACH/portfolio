import {
  User,
  Profile,
  Category,
  Skill,
  Experience,
  Education,
  Certification,
  Project,
  BlogPost,
  SocialLink,
  Settings,
  Message,
  Media,
  ApiResponse,
  PaginatedResponse,
  BilingualField,
  DashboardStats,
} from './index';

describe('Core Models and Type Definitions', () => {
  it('should instantiate and validate BilingualField', () => {
    const bilingual: BilingualField = {
      en: 'Developer',
      kh: 'អ្នកអភិវឌ្ឍន៍',
    };
    expect(bilingual.en).toBe('Developer');
    expect(bilingual.kh).toBe('អ្នកអភិវឌ្ឍន៍');
  });

  it('should instantiate and validate User model', () => {
    const user: User = {
      _id: 'user_123',
      email: 'admin@portfolio.dev',
      fullName: 'Portfolio Admin',
      role: 'admin',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    expect(user.role).toBe('admin');
    expect(user.email).toBe('admin@portfolio.dev');
  });

  it('should instantiate and validate Profile model', () => {
    const profile: Profile = {
      fullName: { en: 'Dimsa Reach', kh: 'ដារឹមសា រ្យាច' },
      title: { en: 'Full-Stack Developer', kh: 'អ្នកអភិវឌ្ឍន៍' },
      introduction: { en: 'Intro', kh: 'សេចក្តីផ្តើម' },
      about: { en: 'About me', kh: 'អំពីខ្ញុំ' },
    };
    expect(profile.fullName.en).toBe('Dimsa Reach');
  });

  it('should instantiate and validate Category model', () => {
    const category: Category = {
      _id: 'cat_1',
      name: { en: 'Web Application', kh: 'កម្មវិធីវែប' },
      slug: 'web-application',
      type: 'both',
      order: 1,
    };
    expect(category.type).toBe('both');
  });

  it('should instantiate and validate Skill model', () => {
    const skill: Skill = {
      _id: 'skill_1',
      name: 'Angular',
      category: { en: 'Frontend', kh: 'ផ្នែកខាងមុខ' },
      order: 1,
      isVisible: true,
    };
    expect(skill.name).toBe('Angular');
  });

  it('should instantiate and validate Experience model', () => {
    const exp: Experience = {
      _id: 'exp_1',
      title: { en: 'Software Engineer', kh: 'វិស្វករ' },
      organization: { en: 'Tech Corp', kh: 'ក្រុមហ៊ុន' },
      type: 'work',
      startDate: '2023-01-01',
      isCurrent: true,
      technologies: ['Angular', 'Node.js'],
      order: 1,
    };
    expect(exp.isCurrent).toBe(true);
  });

  it('should instantiate and validate Education model', () => {
    const edu: Education = {
      _id: 'edu_1',
      institution: { en: 'RUPP', kh: 'សាកលវិទ្យាល័យ' },
      degree: { en: 'Bachelor', kh: 'បរិញ្ញាបត្រ' },
      field: { en: 'CS', kh: 'វិទ្យាសាស្ត្រកុំព្យូទ័រ' },
      startYear: 2020,
      endYear: 2024,
      order: 1,
    };
    expect(edu.startYear).toBe(2020);
  });

  it('should instantiate and validate Certification model', () => {
    const cert: Certification = {
      _id: 'cert_1',
      name: { en: 'AWS Certified', kh: 'វិញ្ញាបនបត្រ AWS' },
      type: 'certification',
      organization: { en: 'Amazon', kh: 'Amazon' },
      issueDate: '2023-01-01',
      isVisible: true,
      order: 1,
    };
    expect(cert.type).toBe('certification');
  });

  it('should instantiate and validate Project model', () => {
    const project: Project = {
      _id: 'proj_1',
      title: { en: 'CamTraffic AI', kh: 'CamTraffic AI' },
      slug: 'camtraffic-ai',
      shortDescription: { en: 'AI System', kh: 'ប្រព័ន្ធ AI' },
      fullDescription: { en: 'Detailed AI System', kh: 'ការពិពណ៌នាលម្អិត' },
      technologies: ['Angular', 'Python'],
      category: 'cat_1',
      mainImage: 'https://example.com/img.jpg',
      screenshots: [],
      featured: true,
      status: 'published',
      order: 1,
      viewCount: 10,
    };
    expect(project.status).toBe('published');
  });

  it('should instantiate and validate BlogPost model', () => {
    const post: BlogPost = {
      _id: 'post_1',
      title: { en: 'Angular Signals', kh: 'Angular Signals' },
      slug: 'angular-signals',
      excerpt: { en: 'Signals guide', kh: 'ការណែនាំ Signals' },
      content: { en: 'Full content', kh: 'មាតិកាពេញលេញ' },
      category: 'cat_1',
      tags: ['Angular'],
      status: 'published',
      featured: true,
      readingTime: 3,
      viewCount: 15,
      author: 'user_123',
    };
    expect(post.readingTime).toBe(3);
  });

  it('should instantiate and validate SocialLink model', () => {
    const social: SocialLink = {
      _id: 'social_1',
      platform: 'github',
      label: 'GitHub',
      url: 'https://github.com/dimsareach',
      order: 1,
      isVisible: true,
    };
    expect(social.platform).toBe('github');
  });

  it('should instantiate and validate Settings model', () => {
    const settings: Settings = {
      siteTitle: { en: 'Portfolio', kh: 'ផលប័ត្រ' },
      siteDescription: { en: 'Description', kh: 'ការពិពណ៌នា' },
      enableCvDownload: true,
      cvDownloadCount: 5,
      enableContactForm: true,
      emailNotifications: true,
      maintenanceMode: false,
    };
    expect(settings.enableCvDownload).toBe(true);
  });

  it('should instantiate and validate Message model', () => {
    const msg: Message = {
      _id: 'msg_1',
      name: 'Alice',
      email: 'alice@example.com',
      subject: 'Inquiry',
      message: 'Hello!',
      isRead: false,
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    expect(msg.isRead).toBe(false);
  });

  it('should instantiate and validate Media model', () => {
    const media: Media = {
      _id: 'media_1',
      fileName: 'photo.jpg',
      url: 'https://example.com/photo.jpg',
      publicId: 'photo_1',
      mimeType: 'image/jpeg',
      size: 1024,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    expect(media.size).toBe(1024);
  });

  it('should structure ApiResponse and PaginatedResponse envelopes correctly', () => {
    const response: ApiResponse<string> = {
      success: true,
      data: 'Hello',
      message: 'Success',
    };
    expect(response.success).toBe(true);

    const paginated: PaginatedResponse<number> = {
      success: true,
      data: {
        items: [1, 2, 3],
        pagination: {
          page: 1,
          limit: 10,
          total: 3,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        },
      },
      message: 'Items retrieved',
    };
    expect(paginated.data.items).toEqual([1, 2, 3]);
  });

  it('should instantiate and validate DashboardStats model', () => {
    const stats: DashboardStats = {
      totalProjects: 10,
      publishedProjects: 8,
      draftProjects: 2,
      totalBlogPosts: 5,
      publishedBlogPosts: 4,
      draftBlogPosts: 1,
      unreadMessages: 2,
      totalMessages: 10,
      totalSkills: 15,
      totalExperiences: 3,
      cvDownloads: 25,
      recentMessages: [],
    };
    expect(stats.totalProjects).toBe(10);
    expect(stats.cvDownloads).toBe(25);
  });
});
