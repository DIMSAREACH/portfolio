import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { of, catchError } from 'rxjs';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { LanguageService } from '../../../core/services/language.service';
import { Project, Category } from '../../../core/models';
import {
  ProjectCardComponent,
  PaginationComponent,
  SkeletonLoaderComponent,
  EmptyStateComponent,
  LocalizePipe,
} from '../../../shared';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [
    CommonModule,
    ProjectCardComponent,
    PaginationComponent,
    SkeletonLoaderComponent,
    EmptyStateComponent,
    LocalizePipe,
  ],
  template: `
    <div class="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <!-- Page Header -->
      <section class="space-y-4 max-w-3xl">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span>{{ isKhmer() ? 'ផលប័ត្រគម្រោង' : 'Featured Portfolio' }}</span>
        </div>

        <h1 class="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          {{ isKhmer() ? 'គម្រោងវិស្វកម្ម និងដំណោះស្រាយឌីជីថល' : 'Projects & Case Studies' }}
        </h1>

        <p class="text-lg text-slate-600 dark:text-slate-400 leading-relaxed" [class.font-khmer]="isKhmer()">
          {{ isKhmer()
            ? 'បណ្តុំនៃកម្មវិធីពេញលេញ (Full-Stack) ប្រព័ន្ធ AI ឆ្លាតវៃ និងស្ថាបត្យកម្មកុំព្យូទ័រពពក ដែលខ្ញុំបានអភិវឌ្ឍឡើង។'
            : 'Explore production web applications, computer vision systems, and architectural solutions built with modern technology.'
          }}
        </p>

        <!-- Quick Metrics -->
        <div class="flex flex-wrap items-center gap-3 pt-2">
          <div class="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-xs font-medium text-slate-700 dark:text-slate-300">
            <span class="font-bold text-indigo-600 dark:text-indigo-400">{{ totalItems() }}</span>
            <span class="ml-1.5">{{ isKhmer() ? 'គម្រោងសរុប' : 'Total Projects' }}</span>
          </div>
          <div class="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-xs font-medium text-slate-700 dark:text-slate-300">
            <span class="font-bold text-emerald-600 dark:text-emerald-400">{{ featuredCount() }}</span>
            <span class="ml-1.5">{{ isKhmer() ? 'គម្រោងឆ្នើម' : 'Featured Case Studies' }}</span>
          </div>
        </div>
      </section>

      <!-- Filter Controls: Search, Category, Tech -->
      <section class="space-y-6">
        <!-- Search and Primary Category Pills -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <!-- Category Pills -->
          <div class="flex flex-wrap items-center gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Project Categories">
            <button
              type="button"
              role="tab"
              [attr.aria-selected]="selectedCategory() === 'all'"
              (click)="onCategorySelect('all')"
              class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              [ngClass]="{
                'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 scale-[1.02]': selectedCategory() === 'all',
                'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700/60': selectedCategory() !== 'all'
              }"
            >
              <span>{{ isKhmer() ? 'ទាំងអស់' : 'All Projects' }}</span>
            </button>

            @for (cat of categories(); track cat._id) {
              <button
                type="button"
                role="tab"
                [attr.aria-selected]="selectedCategory() === cat.slug"
                (click)="onCategorySelect(cat.slug)"
                class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                [ngClass]="{
                  'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 scale-[1.02]': selectedCategory() === cat.slug,
                  'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700/60': selectedCategory() !== cat.slug
                }"
              >
                <span>{{ cat.name | localize }}</span>
              </button>
            }
          </div>

          <!-- Search Input -->
          <div class="relative w-full md:w-72 flex-shrink-0">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              [value]="searchQuery()"
              (input)="onSearchInput($event)"
              [placeholder]="isKhmer() ? 'ស្វែងរកគម្រោង (ឧ. Traffic, POS)...' : 'Search projects...'"
              class="w-full pl-10 pr-9 py-2 rounded-xl text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            @if (searchQuery()) {
              <button
                type="button"
                (click)="clearSearch()"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label="Clear search"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            }
          </div>
        </div>

        <!-- Secondary Technology Filter (if technologies exist) -->
        @if (technologies().length > 0) {
          <div class="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span class="font-bold text-slate-400 dark:text-slate-500 flex-shrink-0 mr-1">
              {{ isKhmer() ? 'បច្ចេកវិទ្យា៖' : 'Technology:' }}
            </span>
            <button
              type="button"
              (click)="onTechSelect('all')"
              class="px-2.5 py-1 rounded-lg font-medium transition-colors"
              [ngClass]="{
                'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold': selectedTech() === 'all',
                'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700': selectedTech() !== 'all'
              }"
            >
              All Tech
            </button>
            @for (tech of technologies(); track tech) {
              <button
                type="button"
                (click)="onTechSelect(tech)"
                class="px-2.5 py-1 rounded-lg font-medium transition-colors flex-shrink-0"
                [ngClass]="{
                  'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold': selectedTech() === tech,
                  'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700': selectedTech() !== tech
                }"
              >
                {{ tech }}
              </button>
            }
          </div>
        }

        <!-- Active Filters Feedback & Reset -->
        @if (hasActiveFilters()) {
          <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700/40">
            <div class="flex items-center gap-1.5 flex-wrap">
              <span>{{ isKhmer() ? 'លទ្ធផល' : 'Results:' }}</span>
              <strong class="text-slate-800 dark:text-slate-200">{{ totalItems() }}</strong>
              <span>{{ isKhmer() ? 'គម្រោងត្រូវគ្នានឹងតម្រង' : 'matching project(s)' }}</span>
            </div>
            <button
              type="button"
              (click)="resetFilters()"
              class="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
            >
              {{ isKhmer() ? 'កំណត់តម្រងឡើងវិញ' : 'Reset all filters' }}
            </button>
          </div>
        }
      </section>

      <!-- Projects Grid Content -->
      @if (isLoading()) {
        <!-- Skeleton Loading State -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          @for (idx of [1, 2, 3, 4, 5, 6]; track idx) {
            <div class="p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
              <app-skeleton-loader type="card" [count]="1"></app-skeleton-loader>
              <app-skeleton-loader type="text" [count]="3"></app-skeleton-loader>
            </div>
          }
        </div>
      } @else if (error()) {
        <!-- Error State -->
        <div class="p-6 rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/20 text-center space-y-4 max-w-lg mx-auto">
          <div class="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p class="text-sm font-semibold text-rose-700 dark:text-rose-300">{{ error() }}</p>
          <button
            type="button"
            (click)="loadProjects()"
            class="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            {{ isKhmer() ? 'ព្យាយាមម្តងទៀត' : 'Try Again' }}
          </button>
        </div>
      } @else if (projects().length === 0) {
        <!-- Empty State -->
        <app-empty-state
          [title]="isKhmer() ? 'រកមិនឃើញគម្រោងទេ' : 'No projects found'"
          [description]="isKhmer() ? 'មិនមានគម្រោងត្រូវគ្នានឹងពាក្យគន្លឹះ ឬប្រភេទដែលបានជ្រើសរើសឡើយ។' : 'No projects matched your criteria. Try adjusting your filters or search term.'"
          [actionText]="isKhmer() ? 'សម្អាតតម្រង' : 'Clear Filters'"
          (actionClick)="resetFilters()"
        ></app-empty-state>
      } @else {
        <!-- Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          @for (project of projects(); track project._id) {
            <app-project-card [project]="project"></app-project-card>
          }
        </div>

        <!-- Pagination -->
        @if (totalPages() > 1) {
          <div class="pt-8 flex justify-center">
            <app-pagination
              [page]="currentPage()"
              [totalPages]="totalPages()"
              (pageChange)="onPageChange($event)"
            ></app-pagination>
          </div>
        }
      }
    </div>
  `,
})
export class ProjectListComponent implements OnInit {
  private readonly portfolioService = inject(PortfolioService);
  private readonly languageService = inject(LanguageService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  public readonly projects = signal<Project[]>([]);
  public readonly categories = signal<Category[]>([]);
  public readonly technologies = signal<string[]>([]);
  public readonly totalItems = signal<number>(0);
  public readonly totalPages = signal<number>(1);
  public readonly currentPage = signal<number>(1);
  public readonly pageSize = signal<number>(6);

  public readonly selectedCategory = signal<string>('all');
  public readonly selectedTech = signal<string>('all');
  public readonly searchQuery = signal<string>('');

  public readonly isLoading = signal<boolean>(true);
  public readonly error = signal<string | null>(null);

  public readonly isKhmer = computed(() => this.languageService.currentLang() === 'kh');

  public readonly featuredCount = computed<number>(() => {
    return this.projects().filter((p) => p.featured).length;
  });

  public readonly hasActiveFilters = computed<boolean>(() => {
    return (
      this.selectedCategory() !== 'all' ||
      this.selectedTech() !== 'all' ||
      !!this.searchQuery().trim()
    );
  });

  public ngOnInit(): void {
    // Read query parameters from URL
    this.route.queryParams.subscribe((params) => {
      if (params['category']) {
        this.selectedCategory.set(params['category']);
      }
      if (params['tech']) {
        this.selectedTech.set(params['tech']);
      }
      if (params['search']) {
        this.searchQuery.set(params['search']);
      }
      if (params['page']) {
        const p = parseInt(params['page'], 10);
        if (!isNaN(p) && p > 0) {
          this.currentPage.set(p);
        }
      }
      this.loadProjects();
    });

    this.loadCategories();
  }

  public loadCategories(): void {
    this.portfolioService.getCategories('project').pipe(catchError(() => of(null))).subscribe({
      next: (res) => {
        if (res && res.data) {
          this.categories.set(Array.isArray(res.data) ? res.data : []);
        }
      },
    });
  }

  public loadProjects(): void {
    this.isLoading.set(true);
    this.error.set(null);

    const params: {
      page: number;
      limit: number;
      category?: string;
      tech?: string;
      search?: string;
    } = {
      page: this.currentPage(),
      limit: this.pageSize(),
    };

    if (this.selectedCategory() !== 'all') {
      params.category = this.selectedCategory();
    }
    if (this.selectedTech() !== 'all') {
      params.tech = this.selectedTech();
    }
    const query = this.searchQuery().trim();
    if (query) {
      params.search = query;
    }

    this.portfolioService.getProjects(params).subscribe({
      next: (res) => {
        if (res && res.data) {
          const items = res.data.items || [];
          this.projects.set(items);

          if (res.data.pagination) {
            this.totalItems.set(res.data.pagination.total ?? items.length);
            this.totalPages.set(res.data.pagination.totalPages || 1);
            this.currentPage.set(res.data.pagination.page || 1);
          } else {
            this.totalItems.set(items.length);
            this.totalPages.set(1);
          }

          // Populate technologies list if empty
          if (this.technologies().length === 0 && items.length > 0) {
            const techSet = new Set<string>();
            for (const p of items) {
              if (Array.isArray(p.technologies)) {
                p.technologies.forEach((t) => techSet.add(t));
              }
            }
            this.technologies.set(Array.from(techSet).sort());
          }
        } else {
          this.projects.set([]);
          this.totalItems.set(0);
          this.totalPages.set(1);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set(
          this.isKhmer()
            ? 'មិនអាចទាញយកគម្រោងបានទេ។ សូមព្យាយាមម្តងទៀត។'
            : 'Unable to load projects. Please verify your connection.',
        );
        this.isLoading.set(false);
      },
    });
  }

  public onCategorySelect(slug: string): void {
    this.selectedCategory.set(slug);
    this.currentPage.set(1);
    this.updateUrlParams();
    this.loadProjects();
  }

  public onTechSelect(tech: string): void {
    this.selectedTech.set(tech);
    this.currentPage.set(1);
    this.updateUrlParams();
    this.loadProjects();
  }

  public onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
    this.currentPage.set(1);
    this.updateUrlParams();
    this.loadProjects();
  }

  public clearSearch(): void {
    this.searchQuery.set('');
    this.currentPage.set(1);
    this.updateUrlParams();
    this.loadProjects();
  }

  public resetFilters(): void {
    this.selectedCategory.set('all');
    this.selectedTech.set('all');
    this.searchQuery.set('');
    this.currentPage.set(1);
    this.updateUrlParams();
    this.loadProjects();
  }

  public onPageChange(page: number): void {
    this.currentPage.set(page);
    this.updateUrlParams();
    this.loadProjects();
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  private updateUrlParams(): void {
    const queryParams: Record<string, string | number | null> = {};

    if (this.selectedCategory() !== 'all') {
      queryParams['category'] = this.selectedCategory();
    } else {
      queryParams['category'] = null;
    }

    if (this.selectedTech() !== 'all') {
      queryParams['tech'] = this.selectedTech();
    } else {
      queryParams['tech'] = null;
    }

    const q = this.searchQuery().trim();
    if (q) {
      queryParams['search'] = q;
    } else {
      queryParams['search'] = null;
    }

    if (this.currentPage() > 1) {
      queryParams['page'] = this.currentPage();
    } else {
      queryParams['page'] = null;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
    });
  }
}
