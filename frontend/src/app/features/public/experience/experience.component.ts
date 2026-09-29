import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { LanguageService } from '../../../core/services/language.service';
import { Experience, ExperienceType } from '../../../core/models';
import {
  SkeletonLoaderComponent,
  EmptyStateComponent,
  LocalizePipe,
} from '../../../shared';

export interface ExperienceTypeOption {
  value: 'all' | ExperienceType;
  labelEn: string;
  labelKh: string;
}

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    SkeletonLoaderComponent,
    EmptyStateComponent,
    LocalizePipe,
  ],
  template: `
    <div class="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <!-- Header Section -->
      <section class="space-y-4 max-w-3xl">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span>{{ isKhmer() ? 'បទពិសោធន៍ការងារ' : 'Career Journey' }}</span>
        </div>

        <h1 class="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          {{ isKhmer() ? 'បទពិសោធន៍វិជ្ជាជីវៈ និងការងារ' : 'Professional Experience' }}
        </h1>

        <p class="text-lg text-slate-600 dark:text-slate-400 leading-relaxed" [class.font-khmer]="isKhmer()">
          {{ isKhmer()
            ? 'ដំណើរវិវត្តន៍នៃអាជីពវិស្វកម្មរបស់ខ្ញុំ ការទទួលខុសត្រូវគន្លឹះ និងបច្ចេកវិទ្យាដែលបានប្រើប្រាស់ក្នុងការដោះស្រាយបញ្ហាសហគ្រាសពិតប្រាកដ។'
            : 'A chronological timeline of my roles, core engineering responsibilities, architectural decisions, and production systems delivered.'
          }}
        </p>

        <!-- Quick Summary & Actions -->
        <div class="flex flex-wrap items-center gap-4 pt-2">
          <div class="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-xs font-medium text-slate-700 dark:text-slate-300">
            <span class="font-bold text-indigo-600 dark:text-indigo-400">{{ experiences().length }}</span>
            <span class="ml-1.5">{{ isKhmer() ? 'តួនាទីសរុប' : 'Roles Recorded' }}</span>
          </div>

          <a
            [href]="cvDownloadUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>{{ isKhmer() ? 'ទាញយកប្រវត្តិរូបសង្ខេប (CV)' : 'Download Full CV (PDF)' }}</span>
          </a>
        </div>
      </section>

      <!-- Filter Controls: Type Tabs & Search -->
      <section class="space-y-4">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <!-- Type Filter Tabs -->
          <div class="flex flex-wrap items-center gap-2" role="tablist" aria-label="Experience Types">
            @for (opt of typeOptions; track opt.value) {
              <button
                type="button"
                role="tab"
                [attr.aria-selected]="selectedType() === opt.value"
                (click)="setTypeFilter(opt.value)"
                class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                [ngClass]="{
                  'bg-indigo-600 text-white shadow-md shadow-indigo-500/20': selectedType() === opt.value,
                  'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700/60': selectedType() !== opt.value
                }"
              >
                <span>{{ isKhmer() ? opt.labelKh : opt.labelEn }}</span>
                <span
                  class="px-1.5 py-0.5 rounded-full text-[11px] font-bold"
                  [ngClass]="{
                    'bg-white/20 text-white': selectedType() === opt.value,
                    'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400': selectedType() !== opt.value
                  }"
                >
                  {{ getTypeCount(opt.value) }}
                </span>
              </button>
            }
          </div>

          <!-- Search input -->
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
              [placeholder]="isKhmer() ? 'ស្វែងរកតាមស្ថាប័ន តួនាទី ឬបច្ចេកវិទ្យា...' : 'Filter by role, company, tech...'"
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

        @if (searchQuery() || selectedType() !== 'all') {
          <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 px-4 py-2 rounded-xl border border-slate-200/60 dark:border-slate-700/40">
            <div>
              <span>{{ isKhmer() ? 'បង្ហាញ' : 'Showing' }}</span>
              <strong class="mx-1 text-slate-800 dark:text-slate-200">{{ filteredExperiences().length }}</strong>
              <span>{{ isKhmer() ? 'ក្នុងចំណោម' : 'of' }} {{ experiences().length }} {{ isKhmer() ? 'បទពិសោធន៍' : 'records' }}</span>
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

      <!-- Content Area -->
      @if (isLoading()) {
        <!-- Skeleton Loading State -->
        <div class="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 sm:ml-6 md:ml-8 pl-6 sm:pl-8 space-y-12">
          <div class="space-y-4">
            <app-skeleton-loader type="text" [count]="3"></app-skeleton-loader>
            <app-skeleton-loader type="card" [count]="1"></app-skeleton-loader>
          </div>
          <div class="space-y-4">
            <app-skeleton-loader type="text" [count]="3"></app-skeleton-loader>
            <app-skeleton-loader type="card" [count]="1"></app-skeleton-loader>
          </div>
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
            (click)="loadExperiences()"
            class="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            {{ isKhmer() ? 'ព្យាយាមម្តងទៀត' : 'Try Again' }}
          </button>
        </div>
      } @else if (filteredExperiences().length === 0) {
        <!-- Empty State -->
        <app-empty-state
          [title]="isKhmer() ? 'រកមិនឃើញបទពិសោធន៍ទេ' : 'No experience records found'"
          [description]="isKhmer() ? 'មិនមានទិន្នន័យដែលត្រូវគ្នានឹងការស្វែងរករបស់អ្នកទេ។ សូមសាកល្បងពាក្យគន្លឹះផ្សេង។' : 'No career records matched your current filter criteria.'"
          [actionText]="isKhmer() ? 'សម្អាតការស្វែងរក' : 'Reset Filters'"
          (actionClick)="resetFilters()"
        ></app-empty-state>
      } @else {
        <!-- Chronological Timeline per PRD Section 8.4 -->
        <div class="relative border-l-2 border-indigo-200 dark:border-indigo-900/60 ml-4 sm:ml-6 md:ml-8 pl-6 sm:pl-8 space-y-12">
          @for (exp of filteredExperiences(); track exp._id) {
            <div class="relative group">
              <!-- Timeline Node Marker -->
              <div
                class="absolute -left-[35px] sm:-left-[43px] md:-left-[43px] top-1.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center transition-all duration-300"
                [ngClass]="{
                  'bg-indigo-600 text-white shadow-md shadow-indigo-500/30 ring-4 ring-indigo-100 dark:ring-indigo-950': exp.isCurrent,
                  'bg-slate-300 dark:bg-slate-700 group-hover:bg-indigo-500 text-transparent': !exp.isCurrent
                }"
              >
                @if (exp.isCurrent) {
                  <span class="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                }
              </div>

              <!-- Experience Card -->
              <article class="p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all duration-300 space-y-6">
                <!-- Top Row: Role, Organization, Type & Date -->
                <div class="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div class="space-y-1">
                    <div class="flex flex-wrap items-center gap-2.5">
                      <h2 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                        {{ exp.title | localize }}
                      </h2>

                      <!-- Current Pill -->
                      @if (exp.isCurrent) {
                        <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          <span>{{ isKhmer() ? 'បច្ចុប្បន្ន' : 'Present' }}</span>
                        </span>
                      }

                      <!-- Type Badge -->
                      <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold" [ngClass]="getTypeBadgeClass(exp.type)">
                        {{ getLocalizedType(exp.type) }}
                      </span>
                    </div>

                    <!-- Organization & Location -->
                    <div class="flex flex-wrap items-center gap-y-1 gap-x-3 text-sm text-slate-600 dark:text-slate-400 font-medium">
                      <span class="text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1.5">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span>{{ exp.organization | localize }}</span>
                      </span>

                      @if (exp.location) {
                        <span class="text-slate-300 dark:text-slate-700">•</span>
                        <span class="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{{ exp.location | localize }}</span>
                        </span>
                      }
                    </div>
                  </div>

                  <!-- Date Range Badge -->
                  <div class="flex-shrink-0 self-start">
                    <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200/60 dark:border-slate-700/60">
                      <svg class="w-3.5 h-3.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{{ formatDateRange(exp.startDate, exp.endDate, exp.isCurrent) }}</span>
                    </span>
                  </div>
                </div>

                <!-- Description -->
                @if (exp.description) {
                  <p class="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed" [class.font-khmer]="isKhmer()">
                    {{ exp.description | localize }}
                  </p>
                }

                <!-- Key Responsibilities & Highlights -->
                @if (getResponsibilities(exp).length > 0) {
                  <div class="space-y-2.5 pt-2">
                    <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      {{ isKhmer() ? 'ទំនួលខុសត្រូវ និងសមិទ្ធផលសំខាន់ៗ' : 'Key Responsibilities & Impact' }}
                    </h3>
                    <ul class="space-y-2">
                      @for (resp of getResponsibilities(exp); track resp) {
                        <li class="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                          <span class="w-5 h-5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                            </svg>
                          </span>
                          <span class="leading-relaxed" [class.font-khmer]="isKhmer()">{{ resp }}</span>
                        </li>
                      }
                    </ul>
                  </div>
                }

                <!-- Technologies Used Badges -->
                @if (exp.technologies && exp.technologies.length > 0) {
                  <div class="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-2">
                    <span class="text-xs font-bold text-slate-400 dark:text-slate-500 mr-1">
                      {{ isKhmer() ? 'បច្ចេកវិទ្យា៖' : 'Stack:' }}
                    </span>
                    @for (tech of exp.technologies; track tech) {
                      <span class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-700 transition-colors">
                        {{ tech }}
                      </span>
                    }
                  </div>
                }
              </article>
            </div>
          }
        </div>
      }

      <!-- Bottom Next Steps CTA -->
      <section class="p-8 sm:p-10 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="space-y-2 max-w-xl">
          <h2 class="text-xl sm:text-2xl font-bold tracking-tight">
            {{ isKhmer() ? 'ចង់ដឹងបន្ថែមអំពីប្រវត្តិសិក្សា ឬគម្រោង?' : 'Want to explore my academic background or projects?' }}
          </h2>
          <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {{ isKhmer()
              ? 'ស្វែងយល់ពីប្រវត្តិសិក្សា និងសញ្ញាបត្រ ឬមើលគម្រោងជាក់ស្តែងដែលខ្ញុំបានបង្កើតឡើង។'
              : 'Check out my academic credentials, certifications, or inspect featured software projects.'
            }}
          </p>
        </div>
        <div class="flex flex-wrap gap-3">
          <a
            routerLink="/education"
            class="px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
          >
            {{ isKhmer() ? 'ប្រវត្តិសិក្សា' : 'Education' }}
          </a>
          <a
            routerLink="/projects"
            class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition-all"
          >
            {{ isKhmer() ? 'មើលគម្រោង' : 'View Projects' }}
          </a>
        </div>
      </section>
    </div>
  `,
})
export class ExperienceComponent implements OnInit {
  private readonly portfolioService = inject(PortfolioService);
  private readonly languageService = inject(LanguageService);

  public readonly experiences = signal<Experience[]>([]);
  public readonly isLoading = signal<boolean>(true);
  public readonly error = signal<string | null>(null);

  public readonly selectedType = signal<'all' | ExperienceType>('all');
  public readonly searchQuery = signal<string>('');

  public readonly isKhmer = computed(() => this.languageService.currentLang() === 'kh');

  public readonly typeOptions: ExperienceTypeOption[] = [
    { value: 'all', labelEn: 'All Experiences', labelKh: 'ទាំងអស់' },
    { value: 'work', labelEn: 'Full-time Work', labelKh: 'ការងារពេញម៉ោង' },
    { value: 'internship', labelEn: 'Internships', labelKh: 'កម្មសិក្សា' },
    { value: 'freelance', labelEn: 'Freelance', labelKh: 'ឯករាជ្យ' },
    { value: 'volunteer', labelEn: 'Volunteer', labelKh: 'ស្ម័គ្រចិត្ត' },
  ];

  public get cvDownloadUrl(): string {
    return this.portfolioService.getCvDownloadUrl();
  }

  /**
   * Filtered experiences sorted most recent first
   */
  public readonly filteredExperiences = computed<Experience[]>(() => {
    const list = this.experiences();
    const type = this.selectedType();
    const query = this.searchQuery().trim().toLowerCase();

    return list
      .filter((exp) => {
        // Type filter
        const matchesType = type === 'all' || exp.type === type;

        // Search query filter
        if (!matchesType) return false;
        if (!query) return true;

        const titleEn = (exp.title?.en || '').toLowerCase();
        const titleKh = (exp.title?.kh || '').toLowerCase();
        const orgEn = (exp.organization?.en || '').toLowerCase();
        const orgKh = (exp.organization?.kh || '').toLowerCase();
        const techMatch = exp.technologies?.some((t) => t.toLowerCase().includes(query));

        return (
          titleEn.includes(query) ||
          titleKh.includes(query) ||
          orgEn.includes(query) ||
          orgKh.includes(query) ||
          techMatch
        );
      })
      .sort((a, b) => {
        // Most recent first: if current, rank higher; else by startDate descending
        if (a.isCurrent && !b.isCurrent) return -1;
        if (!a.isCurrent && b.isCurrent) return 1;
        const dateA = new Date(a.startDate).getTime();
        const dateB = new Date(b.startDate).getTime();
        return dateB - dateA;
      });
  });

  public ngOnInit(): void {
    this.loadExperiences();
  }

  public loadExperiences(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.portfolioService.getExperiences().subscribe({
      next: (response) => {
        if (response && response.data) {
          const list = Array.isArray(response.data) ? response.data : [];
          this.experiences.set(list);
        } else {
          this.experiences.set([]);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set(
          this.isKhmer()
            ? 'មិនអាចទាញយកទិន្នន័យបទពិសោធន៍បានទេ។ សូមព្យាយាមម្តងទៀត។'
            : 'Unable to load experience records. Please verify your connection.',
        );
        this.isLoading.set(false);
      },
    });
  }

  public setTypeFilter(type: 'all' | ExperienceType): void {
    this.selectedType.set(type);
  }

  public onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  public clearSearch(): void {
    this.searchQuery.set('');
  }

  public resetFilters(): void {
    this.selectedType.set('all');
    this.searchQuery.set('');
  }

  public getTypeCount(type: 'all' | ExperienceType): number {
    const list = this.experiences();
    if (type === 'all') return list.length;
    return list.filter((e) => e.type === type).length;
  }

  public getLocalizedType(type: ExperienceType): string {
    const option = this.typeOptions.find((o) => o.value === type);
    if (!option) return type;
    return this.isKhmer() ? option.labelKh : option.labelEn;
  }

  public getTypeBadgeClass(type: ExperienceType): string {
    switch (type) {
      case 'work':
        return 'bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50';
      case 'internship':
        return 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50';
      case 'freelance':
        return 'bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900/50';
      case 'volunteer':
        return 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300';
    }
  }

  public getResponsibilities(exp: Experience): string[] {
    if (this.isKhmer() && exp.responsibilities?.kh && exp.responsibilities.kh.length > 0) {
      return exp.responsibilities.kh;
    }
    return exp.responsibilities?.en || [];
  }

  public formatDateRange(
    startDate: string | Date,
    endDate?: string | Date,
    isCurrent?: boolean,
  ): string {
    const startYear = new Date(startDate).getFullYear();
    const startMonth = new Date(startDate).toLocaleString('default', { month: 'short' });

    if (isCurrent) {
      return this.isKhmer()
        ? `${startMonth} ${startYear} – បច្ចុប្បន្ន`
        : `${startMonth} ${startYear} – Present`;
    }

    if (endDate) {
      const endYear = new Date(endDate).getFullYear();
      const endMonth = new Date(endDate).toLocaleString('default', { month: 'short' });
      return `${startMonth} ${startYear} – ${endMonth} ${endYear}`;
    }

    return `${startMonth} ${startYear}`;
  }
}
