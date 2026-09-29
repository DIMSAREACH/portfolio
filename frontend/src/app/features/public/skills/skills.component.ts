import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { LanguageService } from '../../../core/services/language.service';
import { Skill } from '../../../core/models';
import {
  SkeletonLoaderComponent,
  EmptyStateComponent,
} from '../../../shared';

export interface CategoryGroup {
  id: string;
  nameEn: string;
  nameKh: string;
  skills: Skill[];
}

export interface CategoryFilter {
  id: string;
  nameEn: string;
  nameKh: string;
  count: number;
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    SkeletonLoaderComponent,
    EmptyStateComponent,
  ],
  template: `
    <div class="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <!-- Page Header -->
      <section class="space-y-4 max-w-3xl">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          <span>{{ isKhmer() ? 'ជំនាញ និងបច្ចេកវិទ្យា' : 'Technical Competencies' }}</span>
        </div>
        <h1 class="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          {{ isKhmer() ? 'ជំនាញឯកទេស និងឧបករណ៍បច្ចេកវិទ្យា' : 'Skills & Technical Expertise' }}
        </h1>
        <p class="text-lg text-slate-600 dark:text-slate-400 leading-relaxed" [class.font-khmer]="isKhmer()">
          {{ isKhmer()
            ? 'បណ្តុំនៃបច្ចេកវិទ្យា ក្របខ័ណ្ឌការងារ និងឧបករណ៍ទំនើបៗដែលខ្ញុំប្រើប្រាស់ក្នុងការកសាងដំណោះស្រាយឌីជីថលប្រកបដោយប្រសិទ្ធភាព និងសុវត្ថិភាព។'
            : 'A comprehensive breakdown of my engineering capabilities, frameworks, database architectures, and development tooling applied to production systems.'
          }}
        </p>

        <!-- Stats Overview Pill Group -->
        <div class="flex flex-wrap items-center gap-3 pt-2">
          <div class="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-xs font-medium text-slate-700 dark:text-slate-300">
            <span class="font-bold text-indigo-600 dark:text-indigo-400">{{ skills().length }}</span>
            <span class="ml-1.5">{{ isKhmer() ? 'ជំនាញសរុប' : 'Total Technologies' }}</span>
          </div>
          <div class="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-xs font-medium text-slate-700 dark:text-slate-300">
            <span class="font-bold text-indigo-600 dark:text-indigo-400">{{ categories().length - 1 }}</span>
            <span class="ml-1.5">{{ isKhmer() ? 'ផ្នែកជំនាញ' : 'Core Disciplines' }}</span>
          </div>
          <div class="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-xs font-medium text-slate-700 dark:text-slate-300">
            <span class="font-bold text-emerald-600 dark:text-emerald-400">100%</span>
            <span class="ml-1.5">{{ isKhmer() ? 'ផ្អែកលើការអនុវត្តជាក់ស្តែង' : 'Production-Ready' }}</span>
          </div>
        </div>
      </section>

      <!-- Filter Controls: Search & Category Pills -->
      <section class="space-y-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <!-- Category Tabs/Pills -->
          <div class="flex flex-wrap items-center gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Skill Categories">
            @for (cat of categories(); track cat.id) {
              <button
                type="button"
                role="tab"
                [attr.aria-selected]="selectedCategory() === cat.id"
                (click)="setCategory(cat.id)"
                class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                [ngClass]="{
                  'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 scale-[1.02]': selectedCategory() === cat.id,
                  'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700/60': selectedCategory() !== cat.id
                }"
              >
                <span>{{ isKhmer() ? cat.nameKh : cat.nameEn }}</span>
                <span
                  class="px-2 py-0.5 rounded-full text-xs font-bold transition-colors"
                  [ngClass]="{
                    'bg-white/20 text-white': selectedCategory() === cat.id,
                    'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400': selectedCategory() !== cat.id
                  }"
                >
                  {{ cat.count }}
                </span>
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
              [placeholder]="isKhmer() ? 'ស្វែងរកជំនាញ (ឧ. Angular, Docker)...' : 'Search skills (e.g. Angular, Docker)...'"
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

        <!-- Filter Active Feedback -->
        @if (searchQuery() || selectedCategory() !== 'all') {
          <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 px-4 py-2 rounded-xl border border-slate-200/60 dark:border-slate-700/40">
            <div>
              <span>{{ isKhmer() ? 'បង្ហាញ' : 'Showing' }}</span>
              <strong class="mx-1 text-slate-800 dark:text-slate-200">{{ totalFilteredCount() }}</strong>
              <span>{{ isKhmer() ? 'ក្នុងចំណោម' : 'of' }} {{ skills().length }} {{ isKhmer() ? 'ជំនាញ' : 'skills' }}</span>
              @if (searchQuery()) {
                <span class="ml-1">({{ isKhmer() ? 'ស្វែងរក' : 'matching' }} "{{ searchQuery() }}")</span>
              }
            </div>
            <button
              type="button"
              (click)="resetFilters()"
              class="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
            >
              {{ isKhmer() ? 'កំណត់ឡើងវិញ' : 'Reset filters' }}
            </button>
          </div>
        }
      </section>

      <!-- Main Content Area -->
      @if (isLoading()) {
        <!-- Skeleton Loading State -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
            <app-skeleton-loader type="text" [count]="2"></app-skeleton-loader>
            <app-skeleton-loader type="card" [count]="1"></app-skeleton-loader>
          </div>
          <div class="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
            <app-skeleton-loader type="text" [count]="2"></app-skeleton-loader>
            <app-skeleton-loader type="card" [count]="1"></app-skeleton-loader>
          </div>
        </div>
      } @else if (error()) {
        <!-- Error State -->
        <div class="p-6 rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/20 text-center space-y-4">
          <div class="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p class="text-sm font-semibold text-rose-700 dark:text-rose-300">{{ error() }}</p>
          <button
            type="button"
            (click)="loadSkills()"
            class="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            {{ isKhmer() ? 'ព្យាយាមម្តងទៀត' : 'Try Again' }}
          </button>
        </div>
      } @else if (groupedSkills().length === 0) {
        <!-- Empty State -->
        <app-empty-state
          [title]="isKhmer() ? 'រកមិនឃើញជំនាញទេ' : 'No skills found'"
          [description]="isKhmer() ? 'មិនមានជំនាញដែលត្រូវគ្នានឹងការស្វែងរករបស់អ្នកទេ។ សូមសាកល្បងពាក្យគន្លឹះផ្សេង។' : 'No technical skills matched your current search or category filter.'"
          [actionText]="isKhmer() ? 'សម្អាតការស្វែងរក' : 'Clear Filters'"
          (actionClick)="resetFilters()"
        ></app-empty-state>
      } @else {
        <!-- Categorized Skills Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          @for (group of groupedSkills(); track group.id) {
            <div class="flex flex-col justify-between p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all duration-300">
              <div class="space-y-6">
                <!-- Group Header -->
                <div class="flex items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-sm" [ngClass]="getCategoryBadgeClass(group.id)">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        @switch (getCategoryType(group.id)) {
                          @case ('frontend') {
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          }
                          @case ('backend') {
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                          }
                          @case ('database') {
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                          }
                          @case ('aiml') {
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                          }
                          @case ('devops') {
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          }
                          @default {
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                          }
                        }
                      </svg>
                    </div>
                    <div>
                      <h2 class="text-xl font-bold text-slate-900 dark:text-white">
                        {{ isKhmer() ? group.nameKh : group.nameEn }}
                      </h2>
                      <p class="text-xs text-slate-500 dark:text-slate-400">
                        {{ isKhmer() ? ('ជំនាញចំនួន ' + group.skills.length + ' មុខ') : (group.skills.length + ' technologies') }}
                      </p>
                    </div>
                  </div>

                  <span class="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {{ group.skills.length }}
                  </span>
                </div>

                <!-- Skill Badges / Chips (No percentage bars per PRD Section 8.3) -->
                <div class="flex flex-wrap gap-2.5">
                  @for (skill of group.skills; track skill._id) {
                    <div
                      class="group/skill inline-flex items-center gap-2.5 px-3.5 py-2 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/60 hover:shadow-sm hover:scale-[1.02] transition-all duration-200 cursor-default"
                    >
                      <!-- Tech Icon / Indicator -->
                      <span class="w-6 h-6 rounded-lg bg-white dark:bg-slate-700/80 border border-slate-200/60 dark:border-slate-600/60 flex items-center justify-center text-[11px] font-bold text-slate-700 dark:text-slate-200 shadow-2xs group-hover/skill:text-indigo-600 dark:group-hover/skill:text-indigo-400 transition-colors">
                        {{ getSkillInitials(skill.name) }}
                      </span>

                      <!-- Skill Name -->
                      <span class="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover/skill:text-indigo-600 dark:group-hover/skill:text-indigo-400 transition-colors">
                        {{ skill.name }}
                      </span>
                    </div>
                  }
                </div>
              </div>
            </div>
          }
        </div>
      }

      <!-- Bottom Call To Action Banner -->
      <section class="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden shadow-xl">
        <div class="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div class="relative z-10 max-w-2xl space-y-4">
          <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {{ isKhmer() ? 'ចង់ឃើញបច្ចេកវិទ្យាទាំងនេះដំណើរការជាក់ស្តែង?' : 'Want to see these skills in real-world applications?' }}
          </h2>
          <p class="text-sm sm:text-base text-indigo-200 leading-relaxed">
            {{ isKhmer()
              ? 'សូមចូលមើលគម្រោងដែលខ្ញុំបានបង្កើតឡើង ឬទាក់ទងមកខ្ញុំដើម្បីពិភាក្សាអំពីកិច្ចសហការ និងឱកាសការងារ។'
              : 'Explore the full list of production projects, case studies, and code repositories built with this modern stack.'
            }}
          </p>
          <div class="flex flex-wrap gap-4 pt-2">
            <a
              routerLink="/projects"
              class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-indigo-950 text-sm font-bold shadow-lg hover:bg-indigo-50 active:scale-95 transition-all"
            >
              <span>{{ isKhmer() ? 'មើលគម្រោងទាំងអស់' : 'Explore Projects' }}</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
            <a
              routerLink="/contact"
              class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-800/80 hover:bg-indigo-700/80 text-white border border-indigo-700/60 text-sm font-semibold active:scale-95 transition-all"
            >
              <span>{{ isKhmer() ? 'ទាក់ទងខ្ញុំ' : 'Get In Touch' }}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class SkillsComponent implements OnInit {
  private readonly portfolioService = inject(PortfolioService);
  private readonly languageService = inject(LanguageService);

  public readonly skills = signal<Skill[]>([]);
  public readonly isLoading = signal<boolean>(true);
  public readonly error = signal<string | null>(null);

  public readonly selectedCategory = signal<string>('all');
  public readonly searchQuery = signal<string>('');

  public readonly isKhmer = computed(() => this.languageService.currentLang() === 'kh');

  /**
   * Derive category list with counts
   */
  public readonly categories = computed<CategoryFilter[]>(() => {
    const all = this.skills();
    const map = new Map<string, { nameEn: string; nameKh: string; count: number }>();

    for (const skill of all) {
      const en = skill.category?.en || 'General';
      const kh = skill.category?.kh || en;
      const key = en.toLowerCase().replace(/[^a-z0-9]/g, '');

      if (!map.has(key)) {
        map.set(key, { nameEn: en, nameKh: kh, count: 0 });
      }
      map.get(key)!.count++;
    }

    const items: CategoryFilter[] = [
      {
        id: 'all',
        nameEn: 'All Technologies',
        nameKh: 'ទាំងអស់',
        count: all.length,
      },
    ];

    for (const [key, val] of map.entries()) {
      items.push({
        id: key,
        nameEn: val.nameEn,
        nameKh: val.nameKh,
        count: val.count,
      });
    }

    return items;
  });

  /**
   * Filter skills and group them by category
   */
  public readonly groupedSkills = computed<CategoryGroup[]>(() => {
    const all = this.skills();
    const activeCategory = this.selectedCategory();
    const query = this.searchQuery().trim().toLowerCase();

    // 1. Filter by category & search query
    const filtered = all.filter((s) => {
      const catKey = (s.category?.en || 'General').toLowerCase().replace(/[^a-z0-9]/g, '');
      const matchesCategory = activeCategory === 'all' || catKey === activeCategory;
      const matchesQuery = !query || s.name.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });

    // 2. Group by category
    const map = new Map<string, CategoryGroup>();
    for (const skill of filtered) {
      const en = skill.category?.en || 'General';
      const kh = skill.category?.kh || en;
      const key = en.toLowerCase().replace(/[^a-z0-9]/g, '');

      if (!map.has(key)) {
        map.set(key, {
          id: key,
          nameEn: en,
          nameKh: kh,
          skills: [],
        });
      }
      map.get(key)!.skills.push(skill);
    }

    // Sort skills inside group by order
    for (const group of map.values()) {
      group.skills.sort((a, b) => a.order - b.order);
    }

    return Array.from(map.values());
  });

  /**
   * Total count of skills displayed under current filters
   */
  public readonly totalFilteredCount = computed<number>(() => {
    return this.groupedSkills().reduce((acc, g) => acc + g.skills.length, 0);
  });

  public ngOnInit(): void {
    this.loadSkills();
  }

  public loadSkills(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.portfolioService.getSkills().subscribe({
      next: (response) => {
        if (response && response.data) {
          const list = Array.isArray(response.data) ? response.data : [];
          this.skills.set(list);
        } else {
          this.skills.set([]);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set(
          this.isKhmer()
            ? 'មិនអាចទាញយកទិន្នន័យជំនាញបានទេ។ សូមព្យាយាមម្តងទៀត។'
            : 'Unable to load skills data. Please verify your connection.',
        );
        this.isLoading.set(false);
      },
    });
  }

  public setCategory(id: string): void {
    this.selectedCategory.set(id);
  }

  public onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  public clearSearch(): void {
    this.searchQuery.set('');
  }

  public resetFilters(): void {
    this.selectedCategory.set('all');
    this.searchQuery.set('');
  }

  public getCategoryType(catId: string): string {
    if (catId.includes('front')) return 'frontend';
    if (catId.includes('back')) return 'backend';
    if (catId.includes('data')) return 'database';
    if (catId.includes('ai') || catId.includes('ml')) return 'aiml';
    if (catId.includes('tool') || catId.includes('devops')) return 'devops';
    return 'other';
  }

  public getCategoryBadgeClass(catId: string): string {
    const type = this.getCategoryType(catId);
    switch (type) {
      case 'frontend':
        return 'bg-gradient-to-tr from-sky-500 to-indigo-600';
      case 'backend':
        return 'bg-gradient-to-tr from-emerald-500 to-teal-600';
      case 'database':
        return 'bg-gradient-to-tr from-amber-500 to-orange-600';
      case 'aiml':
        return 'bg-gradient-to-tr from-purple-500 to-pink-600';
      case 'devops':
        return 'bg-gradient-to-tr from-violet-500 to-purple-600';
      default:
        return 'bg-gradient-to-tr from-indigo-500 to-purple-600';
    }
  }

  public getSkillInitials(name: string): string {
    if (!name) return '•';
    const words = name.trim().split(/[\s&/+-]+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
}
