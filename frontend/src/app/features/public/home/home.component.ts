import { Component, OnInit, inject, signal, computed } from '@angular/core';
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
} from '../../../core/models';
import {
  SkeletonLoaderComponent,
  LocalizePipe,
  TruncatePipe,
} from '../../../shared';

// PrimeNG UI Modules
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { TimelineModule } from 'primeng/timeline';
import { TooltipModule } from 'primeng/tooltip';
import { DividerModule } from 'primeng/divider';
import { ProgressBarModule } from 'primeng/progressbar';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';

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
    TruncatePipe,
    ButtonModule,
    CardModule,
    TagModule,
    ChipModule,
    TimelineModule,
    TooltipModule,
    DividerModule,
    ProgressBarModule,
    AvatarModule,
    BadgeModule,
    AnimateOnScrollModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private readonly portfolioService = inject(PortfolioService);
  private readonly languageService = inject(LanguageService);

  public readonly isKhmer = this.languageService.isKhmer;
  public readonly isLoading = signal<boolean>(true);

  public readonly profile = signal<Profile | null>(null);
  public readonly featuredProjects = signal<Project[]>([]);
  public readonly skills = signal<Skill[]>([]);
  public readonly experiences = signal<Experience[]>([]);
  public readonly education = signal<Education[]>([]);
  public readonly socialLinks = signal<SocialLink[]>([]);
  public readonly settings = signal<Settings | null>(null);

  /**
   * Latest education entry for summary card
   */
  public readonly latestEducation = computed<Education | null>(() => {
    const list = this.education();
    return list.length > 0 ? list[0] : null;
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
    this.loadHomeData();
  }

  public loadHomeData(): void {
    this.isLoading.set(true);

    forkJoin({
      profile: this.portfolioService.getProfile().pipe(catchError(() => of(null))),
      projects: this.portfolioService.getFeaturedProjects(3).pipe(catchError(() => of(null))),
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
          const items =
            'items' in results.projects.data
              ? results.projects.data.items
              : (results.projects.data as unknown as Project[]);
          this.featuredProjects.set(items || []);
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
    if (p.includes('tele')) return 'pi pi-send';
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

  public getCategoryLabel(category: any): string {
    if (!category) return '';
    if (typeof category === 'string') return category;
    if (category.name) {
      return this.isKhmer() && category.name.kh ? category.name.kh : category.name.en || '';
    }
    return this.isKhmer() && category.kh ? category.kh : category.en || '';
  }
}
