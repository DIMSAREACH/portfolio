import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { SkillsComponent } from './skills.component';
import { PortfolioService } from '../../../core/services/portfolio.service';
import {
  LanguageService,
  SupportedLanguage,
} from '../../../core/services/language.service';
import { Skill, ApiResponse } from '../../../core/models';

describe('SkillsComponent', () => {
  let component: SkillsComponent;
  let fixture: ComponentFixture<SkillsComponent>;

  let portfolioServiceMock: {
    getSkills: ReturnType<typeof vi.fn>;
  };

  let languageServiceMock: {
    currentLang: ReturnType<typeof signal<SupportedLanguage>>;
    isKhmer: ReturnType<typeof signal<boolean>>;
  };

  const mockSkills: Skill[] = [
    {
      _id: 'sk1',
      name: 'Angular',
      category: { en: 'Frontend', kh: 'ផ្នែកខាងមុខ' },
      icon: 'angular',
      order: 1,
      isVisible: true,
    },
    {
      _id: 'sk2',
      name: 'TypeScript',
      category: { en: 'Frontend', kh: 'ផ្នែកខាងមុខ' },
      icon: 'typescript',
      order: 2,
      isVisible: true,
    },
    {
      _id: 'sk3',
      name: 'Node.js',
      category: { en: 'Backend', kh: 'ផ្នែកខាងក្រោយ' },
      icon: 'nodejs',
      order: 1,
      isVisible: true,
    },
    {
      _id: 'sk4',
      name: 'MongoDB',
      category: { en: 'Database', kh: 'មូលដ្ឋានទិន្នន័យ' },
      icon: 'mongodb',
      order: 1,
      isVisible: true,
    },
    {
      _id: 'sk5',
      name: 'Docker',
      category: { en: 'Tools & DevOps', kh: 'ឧបករណ៍ និង DevOps' },
      icon: 'docker',
      order: 1,
      isVisible: true,
    },
  ];

  const mockApiResponse: ApiResponse<Skill[]> = {
    success: true,
    message: 'Skills retrieved',
    data: mockSkills,
  };

  beforeEach(async () => {
    portfolioServiceMock = {
      getSkills: vi.fn().mockReturnValue(of(mockApiResponse)),
    };

    languageServiceMock = {
      currentLang: signal<SupportedLanguage>('en'),
      isKhmer: signal<boolean>(false),
    };

    await TestBed.configureTestingModule({
      imports: [SkillsComponent],
      providers: [
        provideRouter([]),
        { provide: PortfolioService, useValue: portfolioServiceMock },
        { provide: LanguageService, useValue: languageServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SkillsComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load skills on init and derive category groups', () => {
    fixture.detectChanges();

    expect(portfolioServiceMock.getSkills).toHaveBeenCalled();
    expect(component.skills().length).toBe(5);
    expect(component.isLoading()).toBe(false);

    // Categories include 'all' + 4 unique categories
    const categories = component.categories();
    expect(categories.length).toBe(5);
    expect(categories[0].id).toBe('all');
    expect(categories[0].count).toBe(5);

    // Grouped skills
    const groups = component.groupedSkills();
    expect(groups.length).toBe(4);
    const frontendGroup = groups.find((g) => g.id === 'frontend');
    expect(frontendGroup).toBeDefined();
    expect(frontendGroup?.skills.length).toBe(2);
  });

  it('should filter skills by category', () => {
    fixture.detectChanges();

    component.setCategory('frontend');
    fixture.detectChanges();

    expect(component.selectedCategory()).toBe('frontend');
    const groups = component.groupedSkills();
    expect(groups.length).toBe(1);
    expect(groups[0].nameEn).toBe('Frontend');
    expect(groups[0].skills.length).toBe(2);
    expect(component.totalFilteredCount()).toBe(2);
  });

  it('should filter skills by search query', () => {
    fixture.detectChanges();

    component.searchQuery.set('mongo');
    fixture.detectChanges();

    const groups = component.groupedSkills();
    expect(groups.length).toBe(1);
    expect(groups[0].skills[0].name).toBe('MongoDB');
    expect(component.totalFilteredCount()).toBe(1);
  });

  it('should render empty state when no skills match search and allow resetting filters', () => {
    fixture.detectChanges();

    component.searchQuery.set('nonexistent-tech-xyz');
    fixture.detectChanges();

    expect(component.groupedSkills().length).toBe(0);
    expect(component.totalFilteredCount()).toBe(0);

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-empty-state')).toBeTruthy();

    component.resetFilters();
    fixture.detectChanges();

    expect(component.searchQuery()).toBe('');
    expect(component.selectedCategory()).toBe('all');
    expect(component.groupedSkills().length).toBe(4);
  });

  it('should handle service error gracefully and allow retry', () => {
    portfolioServiceMock.getSkills.mockReturnValue(throwError(() => new Error('Network error')));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.error()).toBeTruthy();
    expect(component.isLoading()).toBe(false);
    expect(component.skills().length).toBe(0);

    // Retry
    portfolioServiceMock.getSkills.mockReturnValue(of(mockApiResponse));
    component.loadSkills();
    fixture.detectChanges();

    expect(component.error()).toBeNull();
    expect(component.skills().length).toBe(5);
  });

  it('should generate correct category badge classes and skill initials', () => {
    expect(component.getCategoryType('frontend')).toBe('frontend');
    expect(component.getCategoryType('backend')).toBe('backend');
    expect(component.getCategoryType('database')).toBe('database');
    expect(component.getCategoryType('aiml')).toBe('aiml');
    expect(component.getCategoryType('toolsdevops')).toBe('devops');
    expect(component.getCategoryType('other')).toBe('other');

    expect(component.getSkillInitials('Angular')).toBe('AN');
    expect(component.getSkillInitials('Node.js')).toBe('NO');
    expect(component.getSkillInitials('Tools & DevOps')).toBe('TD');
    expect(component.getSkillInitials('')).toBe('•');
  });

  it('should support Khmer language text toggling', () => {
    languageServiceMock.currentLang.set('kh');
    fixture.detectChanges();

    expect(component.isKhmer()).toBe(true);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('ជំនាញ');
  });
});
