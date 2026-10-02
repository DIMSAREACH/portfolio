import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { of, catchError } from 'rxjs';
import { marked } from 'marked';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { LanguageService } from '../../../core/services/language.service';
import { SeoService } from '../../../core/services/seo.service';
import { Project, Category } from '../../../core/models';
import {
  ProjectCardComponent,
  SkeletonLoaderComponent,
  EmptyStateComponent,
  LocalizePipe,
} from '../../../shared';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ProjectCardComponent,
    SkeletonLoaderComponent,
    EmptyStateComponent,
    LocalizePipe,
  ],
  template: `
    <div class="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      <!-- Breadcrumbs & Back Link -->
      <nav aria-label="Breadcrumb" class="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
        <a routerLink="/projects" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
          {{ isKhmer() ? 'គម្រោងទាំងអស់' : 'Projects' }}
        </a>
        <span>/</span>
        <span class="text-slate-800 dark:text-slate-200 font-semibold truncate max-w-xs sm:max-w-md">
          {{ (project()?.title | localize) || (isKhmer() ? 'ព័ត៌មានលម្អិតគម្រោង' : 'Project Details') }}
        </span>
      </nav>

      @if (isLoading()) {
        <!-- Skeleton Loading State -->
        <div class="space-y-8">
          <app-skeleton-loader type="text" [count]="3"></app-skeleton-loader>
          <div class="h-96 rounded-3xl bg-slate-100 dark:bg-slate-800 animate-pulse"></div>
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 space-y-4">
              <app-skeleton-loader type="text" [count]="6"></app-skeleton-loader>
            </div>
            <div class="space-y-4">
              <app-skeleton-loader type="card" [count]="1"></app-skeleton-loader>
            </div>
          </div>
        </div>
      } @else if (error() || !project()) {
        <!-- Error / Not Found State -->
        <app-empty-state
          [title]="isKhmer() ? 'រកមិនឃើញគម្រោងនេះទេ' : 'Project Not Found'"
          [description]="error() || (isKhmer() ? 'គម្រោងដែលអ្នកកំពុងស្វែងរកប្រហែលជាត្រូវបានផ្លាស់ប្តូរ ឬលុបចេញ។' : 'The project you are looking for may have been moved or removed.')"
          [actionText]="isKhmer() ? 'ត្រឡប់ទៅកាន់គម្រោងទាំងអស់' : 'Back to Projects'"
          (actionClick)="goBackToProjects()"
        ></app-empty-state>
      } @else {
        <!-- Project Hero Header per PRD Section 8.7 -->
        <section class="space-y-6">
          <div class="flex flex-wrap items-center gap-3">
            <span class="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
              {{ categoryName() }}
            </span>

            @if (project()?.featured) {
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-md shadow-amber-500/20">
                <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>{{ isKhmer() ? 'គម្រោងឆ្នើម' : 'Featured Case Study' }}</span>
              </span>
            }

            @if (project()?.completionDate) {
              <span class="text-xs text-slate-500 dark:text-slate-400">
                {{ isKhmer() ? 'បញ្ចប់នៅ៖' : 'Completed:' }} {{ formatDate(project()?.completionDate) }}
              </span>
            }
          </div>

          <h1 class="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {{ project()?.title | localize }}
          </h1>

          <p class="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl" [class.font-khmer]="isKhmer()">
            {{ project()?.shortDescription | localize }}
          </p>

          <!-- External Action Buttons -->
          <div class="flex flex-wrap items-center gap-3 pt-2">
            @if (project()?.liveUrl) {
              <a
                [href]="project()?.liveUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-500/20 active:scale-95 transition-all"
              >
                <span>{{ isKhmer() ? 'ទស្សនាគម្រោងជាក់ស្តែង' : 'Live Demo' }}</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            }

            @if (project()?.githubUrl) {
              <a
                [href]="project()?.githubUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700 text-sm font-semibold border border-slate-700/60 active:scale-95 transition-all"
              >
                <svg class="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>{{ isKhmer() ? 'ប្រភពកូដ (GitHub)' : 'Source Code' }}</span>
              </a>
            }

            @if (project()?.videoUrl) {
              <a
                [href]="project()?.videoUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold shadow-sm active:scale-95 transition-all"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ isKhmer() ? 'វីដេអូបង្ហាញ' : 'Video Demo' }}</span>
              </a>
            }
          </div>
        </section>

        <!-- Hero Media Image -->
        @if (project()?.mainImage) {
          <div class="relative w-full h-72 sm:h-[450px] lg:h-[520px] rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shadow-xl">
            <img
              [src]="project()?.mainImage"
              [alt]="(project()?.title | localize) || 'Project Main Image'"
              class="w-full h-full object-cover object-center"
            />
          </div>
        }

        <!-- Main Case Study Layout (2 Columns) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <!-- Left Column: Problem, Solution, Description, Features, Challenges (8 cols) -->
          <div class="lg:col-span-8 space-y-12">
            <!-- Problem Statement Section -->
            @if (project()?.problem) {
              <section class="space-y-4 p-8 rounded-3xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40">
                <div class="flex items-center gap-3 text-rose-700 dark:text-rose-400">
                  <div class="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-900/60 flex items-center justify-center">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h2 class="text-xl sm:text-2xl font-bold">
                    {{ isKhmer() ? 'បញ្ហាប្រឈម (The Problem)' : 'The Challenge & Problem' }}
                  </h2>
                </div>

                <div
                  class="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base"
                  [innerHTML]="renderMarkdown(project()?.problem | localize)"
                ></div>
              </section>
            }

            <!-- Solution Section -->
            @if (project()?.solution) {
              <section class="space-y-4 p-8 rounded-3xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40">
                <div class="flex items-center gap-3 text-emerald-700 dark:text-emerald-400">
                  <div class="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 class="text-xl sm:text-2xl font-bold">
                    {{ isKhmer() ? 'ដំណោះស្រាយវិស្វកម្ម (The Solution)' : 'The Engineering Solution' }}
                  </h2>
                </div>

                <div
                  class="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base"
                  [innerHTML]="renderMarkdown(project()?.solution | localize)"
                ></div>
              </section>
            }

            <!-- Full Description / Deep Dive -->
            @if (project()?.fullDescription) {
              <section class="space-y-4">
                <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  {{ isKhmer() ? 'ព័ត៌មានលម្អិតអំពីស្ថាបត្យកម្មប្រព័ន្ធ' : 'System Overview & Architecture' }}
                </h2>

                <div
                  class="prose prose-indigo dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base"
                  [innerHTML]="renderMarkdown(project()?.fullDescription | localize)"
                ></div>
              </section>
            }

            <!-- Key Features List -->
            @if (featuresList().length > 0) {
              <section class="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h2 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {{ isKhmer() ? 'មុខងារសំខាន់ៗ (Key Features)' : 'Key Features & Capabilities' }}
                </h2>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  @for (feat of featuresList(); track $index) {
                    <div class="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      <span class="w-5 h-5 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-xs">
                        ✓
                      </span>
                      <span class="leading-relaxed" [class.font-khmer]="isKhmer()">{{ feat }}</span>
                    </div>
                  }
                </div>
              </section>
            }

            <!-- Screenshots Gallery -->
            @if (project()?.screenshots && project()!.screenshots.length > 0) {
              <section class="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h2 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {{ isKhmer() ? 'រូបភាពគម្រោង (Screenshots Gallery)' : 'Screenshots & UI Showcase' }}
                </h2>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  @for (shot of project()!.screenshots; track shot) {
                    <div class="relative h-56 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shadow-sm hover:scale-[1.02] transition-transform">
                      <img [src]="shot" alt="Screenshot" class="w-full h-full object-cover object-top" loading="lazy" />
                    </div>
                  }
                </div>
              </section>
            }

            <!-- Challenges & Lessons Learned -->
            @if (project()?.challenges || project()?.lessonsLearned) {
              <section class="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                @if (project()?.challenges) {
                  <div class="space-y-3">
                    <h3 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span class="w-2 h-2 rounded-full bg-amber-500"></span>
                      <span>{{ isKhmer() ? 'បញ្ហាបច្ចេកទេស និងដំណោះស្រាយ' : 'Technical Challenges & Resolutions' }}</span>
                    </h3>
                    <div
                      class="prose prose-slate dark:prose-invert text-sm text-slate-600 dark:text-slate-300 leading-relaxed"
                      [innerHTML]="renderMarkdown(project()?.challenges | localize)"
                    ></div>
                  </div>
                }

                @if (project()?.lessonsLearned) {
                  <div class="space-y-3">
                    <h3 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
                      <span>{{ isKhmer() ? 'មេរៀនដែលទទួលបាន' : 'Key Takeaways & Lessons Learned' }}</span>
                    </h3>
                    <div
                      class="prose prose-slate dark:prose-invert text-sm text-slate-600 dark:text-slate-300 leading-relaxed"
                      [innerHTML]="renderMarkdown(project()?.lessonsLearned | localize)"
                    ></div>
                  </div>
                }
              </section>
            }
          </div>

          <!-- Right Column Sidebar: Quick Specs & Stack (4 cols) -->
          <aside class="lg:col-span-4 space-y-6 sticky top-24">
            <div class="p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
              <h3 class="text-lg font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                {{ isKhmer() ? 'ព័ត៌មានសង្ខេបគម្រោង' : 'Project Summary' }}
              </h3>

              <div class="space-y-4 text-sm">
                <!-- Category -->
                <div>
                  <div class="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {{ isKhmer() ? 'ប្រភេទ' : 'Category' }}
                  </div>
                  <div class="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                    {{ categoryName() }}
                  </div>
                </div>

                <!-- Status -->
                <div>
                  <div class="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {{ isKhmer() ? 'ស្ថានភាព' : 'Status' }}
                  </div>
                  <div class="inline-flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span class="capitalize">{{ project()?.status }}</span>
                  </div>
                </div>

                <!-- Timeline / Date -->
                @if (project()?.startDate || project()?.completionDate) {
                  <div>
                    <div class="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      {{ isKhmer() ? 'កាលបរិច្ឆេទ' : 'Timeline' }}
                    </div>
                    <div class="font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                      {{ formatTimeline(project()?.startDate, project()?.completionDate) }}
                    </div>
                  </div>
                }
              </div>

              <!-- Tech Stack Breakdown -->
              <div class="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div class="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {{ isKhmer() ? 'បច្ចេកវិទ្យាដែលបានប្រើ' : 'Technologies Used' }}
                </div>
                <div class="flex flex-wrap gap-2">
                  @for (tech of project()?.technologies; track tech) {
                    <span class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                      {{ tech }}
                    </span>
                  }
                </div>
              </div>
            </div>
          </aside>
        </div>

        <!-- Related Projects Section per PRD Section 8.7 -->
        @if (relatedProjects().length > 0) {
          <section class="space-y-6 pt-12 border-t border-slate-200 dark:border-slate-800">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  {{ isKhmer() ? 'គម្រោងពាក់ព័ន្ធផ្សេងទៀត' : 'Related Projects' }}
                </h2>
                <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {{ isKhmer() ? 'ស្វែងយល់បន្ថែមអំពីគម្រោងស្រដៀងគ្នានេះ' : 'Explore more projects within a similar domain or tech stack.' }}
                </p>
              </div>

              <a
                routerLink="/projects"
                class="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <span>{{ isKhmer() ? 'មើលទាំងអស់' : 'View all' }}</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              @for (rel of relatedProjects(); track rel._id) {
                <app-project-card [project]="rel"></app-project-card>
              }
            </div>
          </section>
        }
      }
    </div>
  `,
})
export class ProjectDetailComponent implements OnInit {
  private readonly portfolioService = inject(PortfolioService);
  private readonly languageService = inject(LanguageService);
  private readonly seoService = inject(SeoService);
  private readonly route = inject(ActivatedRoute);

  public readonly project = signal<Project | null>(null);
  public readonly relatedProjects = signal<Project[]>([]);
  public readonly isLoading = signal<boolean>(true);
  public readonly error = signal<string | null>(null);

  public readonly isKhmer = computed(() => this.languageService.currentLang() === 'kh');

  public readonly categoryName = computed<string>(() => {
    const p = this.project();
    if (!p || !p.category) return 'General';
    if (typeof p.category === 'object' && 'name' in p.category) {
      const cat = p.category as Category;
      return this.isKhmer() ? (cat.name?.kh || cat.name?.en || 'General') : (cat.name?.en || 'General');
    }
    return String(p.category);
  });

  public readonly featuresList = computed<string[]>(() => {
    const p = this.project();
    if (!p || !p.features) return [];
    if (this.isKhmer() && p.features.kh && p.features.kh.length > 0) {
      return p.features.kh;
    }
    return p.features.en || [];
  });

  public ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      if (slug) {
        this.loadProjectDetails(slug);
      } else {
        this.error.set('No project identifier specified');
        this.isLoading.set(false);
      }
    });
  }

  public loadProjectDetails(slug: string): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.portfolioService.getProjectBySlug(slug).subscribe({
      next: (res) => {
        if (res && res.data) {
          const current = res.data;
          this.project.set(current);
          this.loadRelatedProjects(current);

          this.seoService.updateMetaTags({
            title: current.title?.en || current.title?.kh,
            description: current.shortDescription?.en || current.shortDescription?.kh,
            image: current.mainImage,
            type: 'website',
            keywords: current.technologies?.join(', '),
          });
        } else {
          this.error.set('Project details could not be found.');
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set(
          this.isKhmer()
            ? 'មិនអាចទាញយកព័ត៌មានលម្អិតគម្រោងបានទេ។'
            : 'Unable to load project details.',
        );
        this.isLoading.set(false);
      },
    });
  }

  public loadRelatedProjects(current: Project): void {
    const catSlug = typeof current.category === 'object' && 'slug' in current.category
      ? (current.category as Category).slug
      : undefined;

    this.portfolioService.getProjects({ limit: 4, category: catSlug }).pipe(
      catchError(() => of(null)),
    ).subscribe({
      next: (res) => {
        if (res && res.data && res.data.items) {
          // Filter out the current project and limit to 3
          const related = res.data.items
            .filter((p) => p._id !== current._id && p.slug !== current.slug)
            .slice(0, 3);
          this.relatedProjects.set(related);
        }
      },
    });
  }

  public renderMarkdown(rawText?: string | string[] | null): string {
    if (!rawText) return '';
    const text = Array.isArray(rawText) ? rawText.join('\n\n') : rawText;
    try {
      return marked.parse(text) as string;
    } catch {
      return text;
    }
  }

  public formatDate(date?: string | Date): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString(this.isKhmer() ? 'km-KH' : 'en-US', {
      year: 'numeric',
      month: 'short',
    });
  }

  public formatTimeline(startDate?: string | Date, completionDate?: string | Date): string {
    const start = startDate ? this.formatDate(startDate) : '';
    const end = completionDate ? this.formatDate(completionDate) : (this.isKhmer() ? 'បច្ចុប្បន្ន' : 'Present');
    if (start && end) return `${start} – ${end}`;
    return end || start || '';
  }

  public goBackToProjects(): void {
    window.location.href = '/projects';
  }
}
