import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { LanguageService } from '../../../core/services/language.service';
import { Certification, CertificationType } from '../../../core/models';
import {
  SkeletonLoaderComponent,
  EmptyStateComponent,
  LocalizePipe,
} from '../../../shared';

@Component({
  selector: 'app-achievements',
  standalone: true,
  imports: [
    CommonModule,
    SkeletonLoaderComponent,
    EmptyStateComponent,
    LocalizePipe,
  ],
  template: `
    <div class="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <!-- Page Header -->
      <section class="space-y-4 max-w-3xl">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-900/50 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
          <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          <span>{{ isKhmer() ? 'វិញ្ញាបនបត្រ និងសមិទ្ធផល' : 'Credentials & Recognitions' }}</span>
        </div>

        <h1 class="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          {{ isKhmer() ? 'សមិទ្ធផល និងវិញ្ញាបនបត្រទទួលស្គាល់' : 'Achievements & Certifications' }}
        </h1>

        <p class="text-lg text-slate-600 dark:text-slate-400 leading-relaxed" [class.font-khmer]="isKhmer()">
          {{ isKhmer()
            ? 'បណ្តុំនៃវិញ្ញាបនបត្រជំនាញវិជ្ជាជីវៈ ពានរង្វាន់កិត្តិយស និងសមិទ្ធផលសំខាន់ៗដែលទទួលបានក្នុងការអភិវឌ្ឍជំនាញបច្ចេកវិទ្យា។'
            : 'Verified professional certifications, competitive awards, and milestones achieved across software engineering and academic excellence.'
          }}
        </p>

        <!-- Stats Chips -->
        <div class="flex flex-wrap items-center gap-3 pt-2">
          <div class="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-xs font-medium text-slate-700 dark:text-slate-300">
            <span class="font-bold text-indigo-600 dark:text-indigo-400">{{ certificationsCount() }}</span>
            <span class="ml-1.5">{{ isKhmer() ? 'វិញ្ញាបនបត្រ' : 'Certifications' }}</span>
          </div>
          <div class="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-xs font-medium text-slate-700 dark:text-slate-300">
            <span class="font-bold text-amber-500">{{ awardsCount() }}</span>
            <span class="ml-1.5">{{ isKhmer() ? 'ពានរង្វាន់' : 'Awards' }}</span>
          </div>
          <div class="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-xs font-medium text-slate-700 dark:text-slate-300">
            <span class="font-bold text-emerald-500">{{ achievementsCount() }}</span>
            <span class="ml-1.5">{{ isKhmer() ? 'សមិទ្ធផល' : 'Milestones' }}</span>
          </div>
        </div>
      </section>

      <!-- Filter Tabs per PRD Section 8.10 -->
      <section class="flex flex-wrap items-center gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Achievement Categories">
        <button
          type="button"
          role="tab"
          [attr.aria-selected]="selectedType() === 'all'"
          (click)="onTypeSelect('all')"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          [ngClass]="{
            'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 scale-[1.02]': selectedType() === 'all',
            'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700/60': selectedType() !== 'all'
          }"
        >
          <span>{{ isKhmer() ? 'ទាំងអស់' : 'All Items' }}</span>
          <span class="px-1.5 py-0.5 rounded-full text-[10px] font-bold" [ngClass]="selectedType() === 'all' ? 'bg-indigo-700 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'">
            {{ totalCount() }}
          </span>
        </button>

        <button
          type="button"
          role="tab"
          [attr.aria-selected]="selectedType() === 'certification'"
          (click)="onTypeSelect('certification')"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          [ngClass]="{
            'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 scale-[1.02]': selectedType() === 'certification',
            'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700/60': selectedType() !== 'certification'
          }"
        >
          <span>{{ isKhmer() ? 'វិញ្ញាបនបត្រ' : 'Certifications' }}</span>
          <span class="px-1.5 py-0.5 rounded-full text-[10px] font-bold" [ngClass]="selectedType() === 'certification' ? 'bg-indigo-700 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'">
            {{ certificationsCount() }}
          </span>
        </button>

        <button
          type="button"
          role="tab"
          [attr.aria-selected]="selectedType() === 'award'"
          (click)="onTypeSelect('award')"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          [ngClass]="{
            'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 scale-[1.02]': selectedType() === 'award',
            'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700/60': selectedType() !== 'award'
          }"
        >
          <span>{{ isKhmer() ? 'ពានរង្វាន់' : 'Awards' }}</span>
          <span class="px-1.5 py-0.5 rounded-full text-[10px] font-bold" [ngClass]="selectedType() === 'award' ? 'bg-indigo-700 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'">
            {{ awardsCount() }}
          </span>
        </button>

        <button
          type="button"
          role="tab"
          [attr.aria-selected]="selectedType() === 'achievement'"
          (click)="onTypeSelect('achievement')"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          [ngClass]="{
            'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 scale-[1.02]': selectedType() === 'achievement',
            'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700/60': selectedType() !== 'achievement'
          }"
        >
          <span>{{ isKhmer() ? 'សមិទ្ធផល' : 'Milestones' }}</span>
          <span class="px-1.5 py-0.5 rounded-full text-[10px] font-bold" [ngClass]="selectedType() === 'achievement' ? 'bg-indigo-700 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'">
            {{ achievementsCount() }}
          </span>
        </button>
      </section>

      <!-- Main Content Area -->
      @if (isLoading()) {
        <!-- Skeleton State -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (idx of [1, 2, 3, 4, 5, 6]; track idx) {
            <div class="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
              <app-skeleton-loader type="circle" [count]="1"></app-skeleton-loader>
              <app-skeleton-loader type="text" [count]="4"></app-skeleton-loader>
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
            (click)="loadCertifications()"
            class="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            {{ isKhmer() ? 'ព្យាយាមម្តងទៀត' : 'Try Again' }}
          </button>
        </div>
      } @else if (displayedItems().length === 0) {
        <!-- Empty State -->
        <app-empty-state
          [title]="isKhmer() ? 'មិនមានទិន្នន័យឡើយ' : 'No credentials found'"
          [description]="isKhmer() ? 'មិនមានវិញ្ញាបនបត្រ ឬសមិទ្ធផលក្នុងប្រភេទនេះនៅឡើយទេ។' : 'No achievements or certifications match this selection.'"
          [actionText]="isKhmer() ? 'មើលទាំងអស់' : 'Show All'"
          (actionClick)="onTypeSelect('all')"
        ></app-empty-state>
      } @else {
        <!-- Cards Grid (PRD 8.10 & Design.md 9.8) -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          @for (item of displayedItems(); track item._id) {
            <article class="group flex flex-col justify-between p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:border-indigo-400 dark:hover:border-indigo-500/60 transition-all duration-300">
              <div class="space-y-4">
                <!-- Top Row: Icon / Thumbnail + Type Badge -->
                <div class="flex items-start justify-between gap-4">
                  <!-- Thumbnail / Fallback Icon -->
                  @if (item.image) {
                    <div class="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 flex-shrink-0">
                      <img [src]="item.image" [alt]="(item.name | localize) || 'Badge'" class="w-full h-full object-cover object-center" />
                    </div>
                  } @else {
                    <div
                      class="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner"
                      [ngClass]="getTypeBadgeBg(item.type)"
                    >
                      <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        @if (item.type === 'award') {
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        } @else if (item.type === 'achievement') {
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        } @else {
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        }
                      </svg>
                    </div>
                  }

                  <!-- Type Badge -->
                  <span
                    class="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border shadow-sm"
                    [ngClass]="getTypeBadgeStyle(item.type)"
                  >
                    {{ getTypeLabel(item.type) }}
                  </span>
                </div>

                <!-- Credential Title -->
                <h3 class="text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {{ item.name | localize }}
                </h3>

                <!-- Issuing Organization -->
                <div class="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <svg class="w-4 h-4 text-indigo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>{{ item.organization | localize }}</span>
                </div>

                <!-- Issue & Expiration Dates -->
                <div class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>
                    {{ formatDate(item.issueDate) }}
                    @if (item.expirationDate) {
                      <span> · {{ isKhmer() ? 'ផុតកំណត់៖' : 'Expires:' }} {{ formatDate(item.expirationDate) }}</span>
                    } @else {
                      <span> · {{ isKhmer() ? 'គ្មានថ្ងៃផុតកំណត់' : 'No Expiration' }}</span>
                    }
                  </span>
                </div>

                <!-- Credential ID with Copy Action -->
                @if (item.credentialId) {
                  <div class="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs font-mono">
                    <span class="text-slate-500 truncate max-w-[180px]">ID: {{ item.credentialId }}</span>
                    <button
                      type="button"
                      (click)="copyCredentialId(item._id, item.credentialId)"
                      class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-sans text-[11px] font-semibold flex items-center gap-1"
                      [title]="isKhmer() ? 'ចម្លងលេខសម្គាល់' : 'Copy ID'"
                    >
                      @if (copiedId() === item._id) {
                        <span class="text-emerald-500">{{ isKhmer() ? 'បានចម្លង!' : 'Copied!' }}</span>
                      } @else {
                        <span>{{ isKhmer() ? 'ចម្លង' : 'Copy' }}</span>
                      }
                    </button>
                  </div>
                }

                <!-- Description -->
                @if (item.description) {
                  <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3" [class.font-khmer]="isKhmer()">
                    {{ item.description | localize }}
                  </p>
                }
              </div>

              <!-- Footer Verification Link -->
              @if (item.credentialUrl) {
                <div class="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                  <a
                    [href]="item.credentialUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                  >
                    <span>{{ isKhmer() ? 'ផ្ទៀងផ្ទាត់វិញ្ញាបនបត្រ' : 'Verify Credential' }}</span>
                    <svg class="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              }
            </article>
          }
        </div>
      }
    </div>
  `,
})
export class AchievementsComponent implements OnInit {
  private readonly portfolioService = inject(PortfolioService);
  private readonly languageService = inject(LanguageService);

  public readonly items = signal<Certification[]>([]);
  public readonly selectedType = signal<string>('all');
  public readonly isLoading = signal<boolean>(true);
  public readonly error = signal<string | null>(null);
  public readonly copiedId = signal<string | null>(null);

  public readonly isKhmer = computed(() => this.languageService.currentLang() === 'kh');

  public readonly totalCount = computed(() => this.items().length);

  public readonly certificationsCount = computed(() =>
    this.items().filter((i) => i.type === 'certification').length,
  );

  public readonly awardsCount = computed(() =>
    this.items().filter((i) => i.type === 'award').length,
  );

  public readonly achievementsCount = computed(() =>
    this.items().filter((i) => i.type === 'achievement').length,
  );

  public readonly displayedItems = computed(() => {
    const filter = this.selectedType();
    if (filter === 'all') {
      return this.items();
    }
    return this.items().filter((i) => i.type === filter);
  });

  public ngOnInit(): void {
    this.loadCertifications();
  }

  public loadCertifications(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.portfolioService.getCertifications().subscribe({
      next: (res) => {
        if (res && res.data) {
          const list = Array.isArray(res.data) ? res.data : [];
          this.items.set(list.filter((item) => item.isVisible !== false));
        } else {
          this.items.set([]);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set(
          this.isKhmer()
            ? 'មិនអាចទាញយកសមិទ្ធផលបានទេ។ សូមព្យាយាមម្តងទៀត។'
            : 'Unable to load achievements. Please check your connection.',
        );
        this.isLoading.set(false);
      },
    });
  }

  public onTypeSelect(type: string): void {
    this.selectedType.set(type);
  }

  public formatDate(date?: string | Date): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString(this.isKhmer() ? 'km-KH' : 'en-US', {
      year: 'numeric',
      month: 'short',
    });
  }

  public copyCredentialId(id: string, credentialId: string): void {
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(credentialId);
      this.copiedId.set(id);
      setTimeout(() => this.copiedId.set(null), 2000);
    }
  }

  public getTypeLabel(type: CertificationType): string {
    if (this.isKhmer()) {
      switch (type) {
        case 'award':
          return 'ពានរង្វាន់';
        case 'achievement':
          return 'សមិទ្ធផល';
        default:
          return 'វិញ្ញាបនបត្រ';
      }
    }
    switch (type) {
      case 'award':
        return 'Award';
      case 'achievement':
        return 'Achievement';
      default:
        return 'Certification';
    }
  }

  public getTypeBadgeBg(type: CertificationType): string {
    switch (type) {
      case 'award':
        return 'bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400';
      case 'achievement':
        return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400';
      default:
        return 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400';
    }
  }

  public getTypeBadgeStyle(type: CertificationType): string {
    switch (type) {
      case 'award':
        return 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      case 'achievement':
        return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      default:
        return 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800';
    }
  }
}
