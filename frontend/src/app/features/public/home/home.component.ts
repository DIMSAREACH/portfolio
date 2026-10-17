import { Component, OnInit, OnDestroy, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin, catchError, of } from 'rxjs';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { LanguageService } from '../../../core/services/language.service';
import {
  Profile,
  Project,
  Skill,
  Experience,
  Education,
  SocialLink,
  Settings,
  Category,
  BilingualField,
} from '../../../core/models';
import {
  SkeletonLoaderComponent,
  LocalizePipe,
  ProjectCardComponent,
  CountUpDirective,
} from '../../../shared';

// PrimeNG UI Modules
import { ButtonModule } from 'primeng/button';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { TimelineModule } from 'primeng/timeline';
import { TooltipModule } from 'primeng/tooltip';
import { DividerModule } from 'primeng/divider';
import { ProgressBarModule } from 'primeng/progressbar';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { CarouselModule } from 'primeng/carousel';
import { ChevronLeft } from '@primeicons/angular/chevron-left';
import { ChevronRight } from '@primeicons/angular/chevron-right';

export interface SkillCategoryGroup {
  categoryName: string;
  skills: Skill[];
}

export interface TimelineItem {
  title: { en: string; kh: string } | string;
  organization: { en: string; kh: string } | string;
  period: string;
  description?: { en: string; kh: string } | string;
  technologies: string[];
  icon: string;
  color: string;
  isCurrent?: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    SkeletonLoaderComponent,
    LocalizePipe,
    ButtonModule,
    AnimateOnScrollModule,
    CardModule,
    TagModule,
    ChipModule,
    TimelineModule,
    TooltipModule,
    DividerModule,
    ProgressBarModule,
    AvatarModule,
    BadgeModule,
    CarouselModule,
    ChevronLeft,
    ChevronRight,
    ProjectCardComponent,
    CountUpDirective,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly portfolioService = inject(PortfolioService);
  private readonly languageService = inject(LanguageService);

  public readonly isKhmer = this.languageService.isKhmer;
  public readonly isLoading = signal<boolean>(true);

  // Typewriter Animation Signals & Internal State
  public readonly typewriterWords = computed<string[]>(() => {
    if (this.isKhmer()) {
      return ['អ្នកអភិវឌ្ឍន៍ Full-Stack', 'និស្សិតវិទ្យាសាស្ត្រកុំព្យូទ័រ'];
    }
    return ['Full-Stack Developer', 'Computer Science Student'];
  });

  public readonly typewriterText = signal<string>('Full-Stack Developer');
  private typewriterTimeout: ReturnType<typeof setTimeout> | null = null;
  private currentWordIndex = 0;
  private currentCharIndex = 'Full-Stack Developer'.length;
  private isDeleting = false;

  constructor() {
    effect(() => {
      const words = this.typewriterWords();
      this.resetTypewriter(words);
    });
  }

  private resetTypewriter(words: string[]): void {
    if (this.typewriterTimeout) {
      clearTimeout(this.typewriterTimeout);
      this.typewriterTimeout = null;
    }

    if (!words || words.length === 0) return;

    this.currentWordIndex = 0;
    this.isDeleting = false;
    const initialWord = words[0];
    this.typewriterText.set(initialWord);
    this.currentCharIndex = initialWord.length;

    // Pause on the full word for 2.2 seconds before starting backspace
    this.typewriterTimeout = setTimeout(() => {
      this.isDeleting = true;
      this.tickTypewriter();
    }, 2200);
  }

  private tickTypewriter(): void {
    const words = this.typewriterWords();
    if (!words || words.length === 0) return;

    const currentWord = words[this.currentWordIndex % words.length];

    if (this.isDeleting) {
      this.currentCharIndex--;
      this.typewriterText.set(currentWord.substring(0, Math.max(0, this.currentCharIndex)));

      if (this.currentCharIndex <= 0) {
        this.isDeleting = false;
        this.currentWordIndex = (this.currentWordIndex + 1) % words.length;
        // Brief pause when empty before typing next role
        this.typewriterTimeout = setTimeout(() => this.tickTypewriter(), 400);
        return;
      }

      this.typewriterTimeout = setTimeout(() => this.tickTypewriter(), 45);
    } else {
      this.currentCharIndex++;
      this.typewriterText.set(currentWord.substring(0, Math.min(currentWord.length, this.currentCharIndex)));

      if (this.currentCharIndex >= currentWord.length) {
        this.isDeleting = true;
        // Pause on the full word for 2.2 seconds
        this.typewriterTimeout = setTimeout(() => this.tickTypewriter(), 2200);
        return;
      }

      this.typewriterTimeout = setTimeout(() => this.tickTypewriter(), 85);
    }
  }

  public ngOnDestroy(): void {
    if (this.typewriterTimeout) {
      clearTimeout(this.typewriterTimeout);
      this.typewriterTimeout = null;
    }
    if (this.resizeListener && typeof window !== 'undefined') {
      window.removeEventListener('resize', this.resizeListener);
      this.resizeListener = null;
    }
  }

  public readonly profile = signal<Profile | null>(null);
  public readonly featuredProjects = signal<Project[]>([]);
  public readonly totalProjectsCount = signal<number>(0);
  public readonly carouselSlidesPerPage = signal<number>(2.5);
  private resizeListener: (() => void) | null = null;
  public readonly skills = signal<Skill[]>([]);
  public readonly experiences = signal<Experience[]>([]);
  public readonly education = signal<Education[]>([]);
  public readonly socialLinks = signal<SocialLink[]>([]);
  public readonly settings = signal<Settings | null>(null);

  /**
   * Filtered social links restricted to GitHub, LinkedIn, and Telegram
   */
  public readonly filteredSocialLinks = computed<SocialLink[]>(() => {
    const allowed = ['github', 'linkedin', 'telegram'];
    const links = this.socialLinks();
    const filtered = links.filter((link) =>
      allowed.some((a) => (link.platform || '').toLowerCase().includes(a))
    );

    const result: SocialLink[] = [...filtered];
    const hasGithub = result.some((r) => (r.platform || '').toLowerCase().includes('git'));
    const hasLinkedin = result.some((r) => (r.platform || '').toLowerCase().includes('link'));
    const hasTelegram = result.some((r) => (r.platform || '').toLowerCase().includes('tele'));

    if (!hasGithub) {
      result.push({
        _id: 'default-github',
        platform: 'github',
        label: 'GitHub',
        url: 'https://github.com/dimsareach',
        order: 1,
        isVisible: true,
      });
    }
    if (!hasLinkedin) {
      result.push({
        _id: 'default-linkedin',
        platform: 'linkedin',
        label: 'LinkedIn',
        url: 'https://linkedin.com/in/dimsareach',
        order: 2,
        isVisible: true,
      });
    }
    if (!hasTelegram) {
      result.push({
        _id: 'default-telegram',
        platform: 'telegram',
        label: 'Telegram',
        url: 'https://t.me/dimsareach',
        order: 3,
        isVisible: true,
      });
    }

    return result.sort((a, b) => (a.order || 0) - (b.order || 0));
  });

  /**
   * Latest education entry for summary card
   */
  public readonly latestEducation = computed<Education | null>(() => {
    const list = this.education();
    return list.length > 0 ? list[0] : null;
  });

  /**
   * Dynamic metrics computed from live database entries
   */
  public readonly metricsProjects = computed<string>(() => {
    const count = this.totalProjectsCount() || this.featuredProjects().length;
    return count > 0 ? `${count}+` : '0';
  });

  public readonly metricsSkills = computed<string>(() => {
    const count = this.skills().length;
    return count > 0 ? `${count}+` : '0';
  });

  /**
   * Skills grouped by category for structured overview
   */
  public readonly skillsGrouped = computed<SkillCategoryGroup[]>(() => {
    const allSkills = this.skills();
    const groupsMap = new Map<string, Skill[]>();

    for (const skill of allSkills) {
      const cat = skill.category?.en || 'General';
      if (!groupsMap.has(cat)) {
        groupsMap.set(cat, []);
      }
      groupsMap.get(cat)!.push(skill);
    }

    return Array.from(groupsMap.entries()).map(([categoryName, skills]) => ({
      categoryName,
      skills,
    }));
  });

  /**
   * Interactive timeline items for Career Journey section
   */
  public readonly timelineEvents = computed<TimelineItem[]>(() => {
    const exps = this.experiences();
    return exps.map((exp, idx) => ({
      title: exp.title,
      organization: exp.organization,
      period: `${this.formatDate(exp.startDate)} - ${
        exp.isCurrent
          ? this.isKhmer()
            ? 'បច្ចុប្បន្ន'
            : 'Present'
          : this.formatDate(exp.endDate)
      }`,
      description: exp.description,
      technologies: exp.technologies || [],
      icon: exp.isCurrent ? 'pi pi-bolt' : 'pi pi-briefcase',
      color: idx % 2 === 0 ? '#6366f1' : '#8b5cf6',
      isCurrent: exp.isCurrent,
    }));
  });

  public get cvDownloadUrl(): string {
    return this.portfolioService.getCvDownloadUrl();
  }

  public ngOnInit(): void {
    this.updateSlidesPerPage();
    if (typeof window !== 'undefined') {
      this.resizeListener = () => this.updateSlidesPerPage();
      window.addEventListener('resize', this.resizeListener);
    }
    this.loadHomeData();
  }

  private updateSlidesPerPage(): void {
    if (typeof window === 'undefined') return;
    const width = window.innerWidth;
    if (width < 640) {
      this.carouselSlidesPerPage.set(1.15);
    } else if (width < 1024) {
      this.carouselSlidesPerPage.set(1.75);
    } else {
      this.carouselSlidesPerPage.set(2.5);
    }
  }

  public loadHomeData(): void {
    this.isLoading.set(true);

    forkJoin({
      profile: this.portfolioService.getProfile().pipe(catchError(() => of(null))),
      projects: this.portfolioService.getFeaturedProjects(6).pipe(catchError(() => of(null))),
      allProjects: this.portfolioService.getProjects({ limit: 1 }).pipe(catchError(() => of(null))),
      skills: this.portfolioService.getSkills().pipe(catchError(() => of(null))),
      experiences: this.portfolioService.getExperiences().pipe(catchError(() => of(null))),
      education: this.portfolioService.getEducation().pipe(catchError(() => of(null))),
      socialLinks: this.portfolioService.getSocialLinks().pipe(catchError(() => of(null))),
      settings: this.portfolioService.getSettings().pipe(catchError(() => of(null))),
    }).subscribe({
      next: (results) => {
        if (results.profile?.data) {
          this.profile.set(results.profile.data);
        }
        if (results.projects?.data) {
          const projectData = results.projects.data;
          const items =
            'items' in projectData
              ? projectData.items
              : (projectData as unknown as Project[]);
          this.featuredProjects.set(items || []);
        } else {
          this.featuredProjects.set([]);
        }

        if (results.allProjects?.data?.pagination?.total !== undefined) {
          this.totalProjectsCount.set(results.allProjects.data.pagination.total);
        } else if (results.projects?.data) {
          const projectData = results.projects.data;
          const items =
            'items' in projectData
              ? projectData.items
              : (projectData as unknown as Project[]);
          const total =
            'pagination' in projectData && projectData.pagination?.total !== undefined
              ? projectData.pagination.total
              : (items?.length || 0);
          this.totalProjectsCount.set(total);
        } else {
          this.totalProjectsCount.set(0);
        }
        if (results.skills?.data) {
          this.skills.set(results.skills.data);
        }
        if (results.experiences?.data) {
          this.experiences.set(results.experiences.data);
        }
        if (results.education?.data) {
          this.education.set(results.education.data);
        }
        if (results.socialLinks?.data) {
          this.socialLinks.set(results.socialLinks.data);
        }
        if (results.settings?.data) {
          this.settings.set(results.settings.data);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  public getSocialIcon(platform: string): string {
    const p = platform.toLowerCase();
    if (p.includes('git')) return 'pi pi-github';
    if (p.includes('link')) return 'pi pi-linkedin';
    if (p.includes('twit') || p === 'x') return 'pi pi-twitter';
    if (p.includes('tele')) return 'pi pi-telegram';
    if (p.includes('face')) return 'pi pi-facebook';
    if (p.includes('mail')) return 'pi pi-envelope';
    if (p.includes('insta')) return 'pi pi-instagram';
    return 'pi pi-globe';
  }

  public formatYear(date: string | Date | undefined): string {
    if (!date) {
      return '';
    }
    const d = new Date(date);
    return isNaN(d.getFullYear()) ? String(date) : d.getFullYear().toString();
  }

  public formatDate(date: string | Date | undefined): string {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return String(date);
    return d.toLocaleDateString(this.isKhmer() ? 'km-KH' : 'en-US', {
      month: 'short',
      year: 'numeric',
    });
  }

  public getCategoryLabel(category: Category | BilingualField | string | null | undefined): string {
    if (!category) return '';
    if (typeof category === 'string') return category;
    if ('name' in category && category.name) {
      return this.isKhmer() && category.name.kh ? category.name.kh : category.name.en || '';
    }
    if ('kh' in category || 'en' in category) {
      const bilingual = category as BilingualField;
      return this.isKhmer() && bilingual.kh ? bilingual.kh : bilingual.en || '';
    }
    return '';
  }

  public getCategoryIcon(catName: string): string {
    const c = (catName || '').toLowerCase();
    if (c.includes('front') || c.includes('ui') || c.includes('web')) return 'pi pi-desktop';
    if (c.includes('back') || c.includes('api') || c.includes('server')) return 'pi pi-server';
    if (c.includes('data') || c.includes('db') || c.includes('sql') || c.includes('mongo')) return 'pi pi-database';
    if (c.includes('cloud') || c.includes('devops') || c.includes('infra') || c.includes('deploy')) return 'pi pi-cloud';
    if (c.includes('tool') || c.includes('git') || c.includes('util') || c.includes('test')) return 'pi pi-wrench';
    if (c.includes('mobile') || c.includes('app') || c.includes('android') || c.includes('ios')) return 'pi pi-mobile';
    return 'pi pi-code';
  }

  public getProjectDescription(project: Project): string {
    if (!project) return '';
    const lang = this.isKhmer() ? 'kh' : 'en';
    const shortDesc = project.shortDescription?.[lang] || project.shortDescription?.en;
    if (shortDesc) return shortDesc;
    const fullDesc = project.fullDescription?.[lang] || project.fullDescription?.en || '';
    return fullDesc.length > 120 ? fullDesc.substring(0, 120) + '...' : fullDesc;
  }

  public scrollToSection(elementId: string): void {
    const el = document.getElementById(elementId);
    if (el && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
