import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { of, catchError } from 'rxjs';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { LanguageService } from '../../../core/services/language.service';
import { BlogPost, Category } from '../../../core/models';
import {
  BlogCardComponent,
  PaginationComponent,
  SkeletonLoaderComponent,
  EmptyStateComponent,
  LocalizePipe,
} from '../../../shared';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    BlogCardComponent,
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
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          <span>{{ isKhmer() ? 'អត្ថបទ និងចំណេះដឹង' : 'Articles & Insights' }}</span>
        </div>

        <h1 class="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          {{ isKhmer() ? 'អត្ថបទបច្ចេកទេស និងការចែករំលែក' : 'Engineering Blog & Thoughts' }}
        </h1>

        <p class="text-lg text-slate-600 dark:text-slate-400 leading-relaxed" [class.font-khmer]="isKhmer()">
          {{ isKhmer()
            ? 'ការចែករំលែកបទពិសោធន៍ជាក់ស្តែងលើស្ថាបត្យកម្មប្រព័ន្ធ ការសរសេរកូដប្រកបដោយប្រសិទ្ធភាព និងបច្ចេកវិទ្យា AI ទំនើបៗ។'
            : 'Deep-dives, tutorials, and practical engineering thoughts on full-stack web development, AI integration, and software design.'
          }}
        </p>

        <!-- Stats Overview -->
        <div class="flex flex-wrap items-center gap-3 pt-2">
          <div class="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-xs font-medium text-slate-700 dark:text-slate-300">
            <span class="font-bold text-indigo-600 dark:text-indigo-400">{{ totalItems() }}</span>
            <span class="ml-1.5">{{ isKhmer() ? 'អត្ថបទសរុប' : 'Published Articles' }}</span>
          </div>
          @if (featuredPost()) {
            <div class="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-xs font-medium text-slate-700 dark:text-slate-300">
              <span class="font-bold text-amber-500">1</span>
              <span class="ml-1.5">{{ isKhmer() ? 'អត្ថបទពិសេស' : 'Featured Highlight' }}</span>
            </div>
          }
        </div>
      </section>

      <!-- Featured Article Spotlight (if on page 1 and no search query) -->
      @if (featuredPost() && currentPage() === 1 && !searchQuery() && selectedCategory() === 'all' && selectedTag() === 'all') {
        <section class="relative group rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
          <div class="grid grid-cols-1 lg:grid-cols-12 items-center">
            <!-- Cover Photo (7 cols) -->
            <div class="lg:col-span-7 h-64 sm:h-80 lg:h-96 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
              @if (featuredPost()!.coverImage) {
                <img
                  [src]="featuredPost()!.coverImage"
                  [alt]="(featuredPost()!.title | localize) || 'Featured article'"
                  class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              } @else {
                <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500/10 to-purple-500/10 text-indigo-500">
                  <svg class="w-16 h-16 stroke-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
              }
            </div>

            <!-- Content Area (5 cols) -->
            <div class="lg:col-span-5 p-6 sm:p-8 md:p-10 space-y-4">
              <div class="flex items-center gap-2">
                <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500 text-white shadow-sm">
                  {{ isKhmer() ? 'អត្ថបទពិសេស' : 'Featured' }}
                </span>
                <span class="text-xs text-slate-500 dark:text-slate-400">
                  {{ featuredPost()!.readingTime || 5 }} {{ isKhmer() ? 'នាទីអាន' : 'min read' }}
                </span>
              </div>

              <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                <a [routerLink]="['/blog', featuredPost()!.slug]">
                  {{ featuredPost()!.title | localize }}
                </a>
              </h2>

              <p class="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3" [class.font-khmer]="isKhmer()">
                {{ featuredPost()!.excerpt | localize }}
              </p>

              <div class="pt-2">
                <a
                  [routerLink]="['/blog', featuredPost()!.slug]"
                  class="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                >
                  <span>{{ isKhmer() ? 'អានអត្ថបទពេញលេញ' : 'Read Full Story' }}</span>
                  <svg class="w-4 h-4 group-hover:translate-x-1.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>
      }

      <!-- Filter Controls: Categories, Search, Tags -->
      <section class="space-y-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <!-- Category Pills -->
          <div class="flex flex-wrap items-center gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Blog Categories">
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
              <span>{{ isKhmer() ? 'ទាំងអស់' : 'All Topics' }}</span>
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
              [placeholder]="isKhmer() ? 'ស្វែងរកអត្ថបទ...' : 'Search articles...'"
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

        <!-- Tags Filter (if tags exist) -->
        @if (tags().length > 0) {
          <div class="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span class="font-bold text-slate-400 dark:text-slate-500 flex-shrink-0 mr-1">
              {{ isKhmer() ? 'ស្លាក៖' : 'Tags:' }}
            </span>
            <button
              type="button"
              (click)="onTagSelect('all')"
              class="px-2.5 py-1 rounded-lg font-medium transition-colors"
              [ngClass]="{
                'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold': selectedTag() === 'all',
                'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700': selectedTag() !== 'all'
              }"
            >
              All Tags
            </button>
            @for (tag of tags(); track tag) {
              <button
                type="button"
                (click)="onTagSelect(tag)"
                class="px-2.5 py-1 rounded-lg font-medium transition-colors flex-shrink-0"
                [ngClass]="{
                  'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold': selectedTag() === tag,
                  'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700': selectedTag() !== tag
                }"
              >
                #{{ tag }}
              </button>
            }
          </div>
        }

        <!-- Active Filter Indicator -->
        @if (hasActiveFilters()) {
          <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700/40">
            <div class="flex items-center gap-1.5 flex-wrap">
              <span>{{ isKhmer() ? 'លទ្ធផល' : 'Results:' }}</span>
              <strong class="text-slate-800 dark:text-slate-200">{{ totalItems() }}</strong>
              <span>{{ isKhmer() ? 'អត្ថបទត្រូវគ្នានឹងការស្វែងរក' : 'matching article(s)' }}</span>
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

      <!-- Blog Grid Content -->
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
            (click)="loadPosts()"
            class="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            {{ isKhmer() ? 'ព្យាយាមម្តងទៀត' : 'Try Again' }}
          </button>
        </div>
      } @else if (posts().length === 0) {
        <!-- Empty State -->
        <app-empty-state
          [title]="isKhmer() ? 'រកមិនឃើញអត្ថបទទេ' : 'No articles found'"
          [description]="isKhmer() ? 'មិនមានអត្ថបទត្រូវគ្នានឹងពាក្យគន្លឹះ ឬស្លាកដែលបានជ្រើសរើសឡើយ។' : 'No articles matched your criteria. Try adjusting your search or category filter.'"
          [actionText]="isKhmer() ? 'សម្អាតតម្រង' : 'Clear Filters'"
          (actionClick)="resetFilters()"
        ></app-empty-state>
      } @else {
        <!-- Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          @for (post of posts(); track post._id) {
            <app-blog-card [post]="post"></app-blog-card>
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
export class BlogListComponent implements OnInit {
  private readonly portfolioService = inject(PortfolioService);
  private readonly languageService = inject(LanguageService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  public readonly posts = signal<BlogPost[]>([]);
  public readonly categories = signal<Category[]>([]);
  public readonly tags = signal<string[]>([]);
  public readonly totalItems = signal<number>(0);
  public readonly totalPages = signal<number>(1);
  public readonly currentPage = signal<number>(1);
  public readonly pageSize = signal<number>(6);

  public readonly selectedCategory = signal<string>('all');
  public readonly selectedTag = signal<string>('all');
  public readonly searchQuery = signal<string>('');

  public readonly isLoading = signal<boolean>(true);
  public readonly error = signal<string | null>(null);

  public readonly isKhmer = computed(() => this.languageService.currentLang() === 'kh');

  public readonly featuredPost = computed<BlogPost | null>(() => {
    return this.posts().find((p) => p.featured) || null;
  });

  public readonly hasActiveFilters = computed<boolean>(() => {
    return (
      this.selectedCategory() !== 'all' ||
      this.selectedTag() !== 'all' ||
      !!this.searchQuery().trim()
    );
  });

  public ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['category']) {
        this.selectedCategory.set(params['category']);
      }
      if (params['tag']) {
        this.selectedTag.set(params['tag']);
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
      this.loadPosts();
    });

    this.loadCategories();
  }

  public loadCategories(): void {
    this.portfolioService.getCategories('blog').pipe(catchError(() => of(null))).subscribe({
      next: (res) => {
        if (res && res.data) {
          this.categories.set(Array.isArray(res.data) ? res.data : []);
        }
      },
    });
  }

  public loadPosts(): void {
    this.isLoading.set(true);
    this.error.set(null);

    const params: {
      page: number;
      limit: number;
      category?: string;
      tag?: string;
      search?: string;
    } = {
      page: this.currentPage(),
      limit: this.pageSize(),
    };

    if (this.selectedCategory() !== 'all') {
      params.category = this.selectedCategory();
    }
    if (this.selectedTag() !== 'all') {
      params.tag = this.selectedTag();
    }
    const query = this.searchQuery().trim();
    if (query) {
      params.search = query;
    }

    this.portfolioService.getBlogPosts(params).subscribe({
      next: (res) => {
        if (res && res.data) {
          const items = res.data.items || [];
          this.posts.set(items);

          if (res.data.pagination) {
            this.totalItems.set(res.data.pagination.total ?? items.length);
            this.totalPages.set(res.data.pagination.totalPages || 1);
            this.currentPage.set(res.data.pagination.page || 1);
          } else {
            this.totalItems.set(items.length);
            this.totalPages.set(1);
          }

          // Populate tags list if empty
          if (this.tags().length === 0 && items.length > 0) {
            const tagSet = new Set<string>();
            for (const p of items) {
              if (Array.isArray(p.tags)) {
                p.tags.forEach((t) => tagSet.add(t));
              }
            }
            this.tags.set(Array.from(tagSet).sort());
          }
        } else {
          this.posts.set([]);
          this.totalItems.set(0);
          this.totalPages.set(1);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set(
          this.isKhmer()
            ? 'មិនអាចទាញយកអត្ថបទបានទេ។ សូមព្យាយាមម្តងទៀត។'
            : 'Unable to load articles. Please verify your connection.',
        );
        this.isLoading.set(false);
      },
    });
  }

  public onCategorySelect(slug: string): void {
    this.selectedCategory.set(slug);
    this.currentPage.set(1);
    this.updateUrlParams();
    this.loadPosts();
  }

  public onTagSelect(tag: string): void {
    this.selectedTag.set(tag);
    this.currentPage.set(1);
    this.updateUrlParams();
    this.loadPosts();
  }

  public onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
    this.currentPage.set(1);
    this.updateUrlParams();
    this.loadPosts();
  }

  public clearSearch(): void {
    this.searchQuery.set('');
    this.currentPage.set(1);
    this.updateUrlParams();
    this.loadPosts();
  }

  public resetFilters(): void {
    this.selectedCategory.set('all');
    this.selectedTag.set('all');
    this.searchQuery.set('');
    this.currentPage.set(1);
    this.updateUrlParams();
    this.loadPosts();
  }

  public onPageChange(page: number): void {
    this.currentPage.set(page);
    this.updateUrlParams();
    this.loadPosts();
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

    if (this.selectedTag() !== 'all') {
      queryParams['tag'] = this.selectedTag();
    } else {
      queryParams['tag'] = null;
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
