import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { ProjectCardComponent } from './project-card.component';
import {
  LanguageService,
  SupportedLanguage,
} from '../../../core/services/language.service';
import { Project } from '../../../core/models';

describe('ProjectCardComponent', () => {
  let component: ProjectCardComponent;
  let fixture: ComponentFixture<ProjectCardComponent>;

  let languageServiceMock: {
    currentLang: ReturnType<typeof signal<SupportedLanguage>>;
    isKhmer: ReturnType<typeof signal<boolean>>;
  };

  const mockProject: Project = {
    _id: 'proj1',
    title: { en: 'CamTraffic AI', kh: 'CamTraffic AI' },
    slug: 'camtraffic-ai',
    shortDescription: {
      en: 'AI-based traffic sign detection system.',
      kh: 'ប្រព័ន្ធវៃឆ្លាតស្វែងរកស្លាកសញ្ញាចរាចរណ៍។',
    },
    fullDescription: { en: 'Full description', kh: 'ពិពណ៌នាពេញលេញ' },
    category: {
      _id: 'cat1',
      name: { en: 'AI/ML', kh: 'បញ្ញាសិប្បនិម្មិត' },
      slug: 'ai-ml',
      type: 'project',
      order: 1,
    },
    technologies: ['Angular', 'TypeScript', 'Node.js', 'MongoDB', 'Docker', 'Python'],
    mainImage: 'https://example.com/image.jpg',
    screenshots: [],
    githubUrl: 'https://github.com/example/camtraffic',
    liveUrl: 'https://camtraffic.example.com',
    featured: true,
    status: 'published',
    order: 1,
    viewCount: 150,
  };

  beforeEach(async () => {
    languageServiceMock = {
      currentLang: signal<SupportedLanguage>('en'),
      isKhmer: signal<boolean>(false),
    };

    await TestBed.configureTestingModule({
      imports: [ProjectCardComponent],
      providers: [
        provideRouter([]),
        { provide: LanguageService, useValue: languageServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('project', mockProject);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display project title and short description', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('CamTraffic AI');
    expect(compiled.textContent).toContain('AI-based traffic sign detection system.');
  });

  it('should resolve category name in English and Khmer', () => {
    expect(component.categoryName()).toBe('AI/ML');

    languageServiceMock.currentLang.set('kh');
    fixture.detectChanges();
    expect(component.categoryName()).toBe('បញ្ញាសិប្បនិម្មិត');
  });

  it('should display featured badge when project is featured', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Featured');

    fixture.componentRef.setInput('showFeaturedBadge', false);
    fixture.detectChanges();
    expect(compiled.textContent).not.toContain('Featured');
  });

  it('should display up to 4 technologies and count remaining', () => {
    expect(component.displayedTech()).toEqual(['Angular', 'TypeScript', 'Node.js', 'MongoDB']);
    expect(component.remainingTechCount()).toBe(2);

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('+2');
  });

  it('should render external links for GitHub and Live Demo', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const links = compiled.querySelectorAll('a[target="_blank"]');
    expect(links.length).toBe(2);
  });
});
