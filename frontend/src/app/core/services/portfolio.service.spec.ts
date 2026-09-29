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
  ApiResponse,
  PaginatedResponse,
} from '../models';

describe('PortfolioService', () => {
  let service: PortfolioService;
  let apiServiceMock: {
    get: ReturnType<typeof vi.fn>;
    post: ReturnType<typeof vi.fn>;
    getUrl: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    apiServiceMock = {
      get: vi.fn(),
      post: vi.fn(),
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

  it('should return correct CV download URL', () => {
    const url = service.getCvDownloadUrl();
    expect(url).toBe('http://localhost:5000/api/v1/cv/download');
  });
});
