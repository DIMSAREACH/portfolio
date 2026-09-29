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

export interface SkillCategoryGroup {
  categoryName: string;
  skills: Skill[];
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

  public formatYear(date: string | Date | undefined): string {
    if (!date) {
      return '';
    }
    const d = new Date(date);
    return isNaN(d.getFullYear()) ? String(date) : d.getFullYear().toString();
  }
}
