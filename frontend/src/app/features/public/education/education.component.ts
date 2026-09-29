import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin, of, catchError } from 'rxjs';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { LanguageService } from '../../../core/services/language.service';
import { Education, Certification } from '../../../core/models';
import {
  SkeletonLoaderComponent,
  EmptyStateComponent,
  LocalizePipe,
} from '../../../shared';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    SkeletonLoaderComponent,
    EmptyStateComponent,
    LocalizePipe,
  ],
  template: `
    <div class="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      <!-- Page Header -->
      <section class="space-y-4 max-w-3xl">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M12 14l9-5-9-5-9 5 9 5z" />
            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
          </svg>
          <span>{{ isKhmer() ? 'ប្រវត្តិការសិក្សា' : 'Academic Foundation' }}</span>
        </div>

        <h1 class="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          {{ isKhmer() ? 'ប្រវត្តិសិក្សា និងសញ្ញាបត្រ' : 'Education & Credentials' }}
        </h1>

        <p class="text-lg text-slate-600 dark:text-slate-400 leading-relaxed" [class.font-khmer]="isKhmer()">
          {{ isKhmer()
            ? 'គ្រឹះទ្រឹស្តីវិទ្យាសាស្ត្រកុំព្យូទ័រ សមិទ្ធផលសិក្សាឆ្នើម និងវិញ្ញាបនបត្របច្ចេកទេសដែលពង្រឹងជំនាញវិស្វកម្មរបស់ខ្ញុំ។'
            : 'Formal academic background in Computer Science and Software Engineering, scholarly achievements, and industry-recognized certifications.'
          }}
        </p>

        <!-- Stats Overview -->
        <div class="flex flex-wrap items-center gap-3 pt-2">
          <div class="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-xs font-medium text-slate-700 dark:text-slate-300">
            <span class="font-bold text-indigo-600 dark:text-indigo-400">{{ education().length }}</span>
            <span class="ml-1.5">{{ isKhmer() ? 'សញ្ញាបត្រ' : 'Degrees / Programs' }}</span>
          </div>

          @if (certifications().length > 0) {
            <div class="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-xs font-medium text-slate-700 dark:text-slate-300">
              <span class="font-bold text-emerald-600 dark:text-emerald-400">{{ certifications().length }}</span>
              <span class="ml-1.5">{{ isKhmer() ? 'វិញ្ញាបនបត្របច្ចេកទេស' : 'Professional Certifications' }}</span>
            </div>
          }
        </div>
      </section>

      <!-- Main Education Content -->
      @if (isLoading()) {
        <!-- Skeleton Loading State -->
        <div class="space-y-8">
          <div class="p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
            <app-skeleton-loader type="text" [count]="3"></app-skeleton-loader>
            <app-skeleton-loader type="card" [count]="1"></app-skeleton-loader>
          </div>
          <div class="p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
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
            (click)="loadEducationData()"
            class="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            {{ isKhmer() ? 'ព្យាយាមម្តងទៀត' : 'Try Again' }}
          </button>
        </div>
      } @else if (education().length === 0) {
        <!-- Empty State -->
        <app-empty-state
          [title]="isKhmer() ? 'រកមិនឃើញប្រវត្តិសិក្សាទេ' : 'No education records found'"
          [description]="isKhmer() ? 'បច្ចុប្បន្នមិនទាន់មានព័ត៌មានសិក្សាដែលបានចុះបញ្ជីនៅឡើយទេ។' : 'No educational records are currently available.'"
        ></app-empty-state>
      } @else {
        <!-- Education Cards List per PRD Section 8.5 -->
        <section class="space-y-8" aria-label="Education History">
          @for (edu of education(); track edu._id) {
            <article class="p-6 sm:p-8 md:p-10 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all duration-300 space-y-6">
              <!-- Top Row: Degree, Institution, Year, GPA -->
              <div class="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800/80">
                <div class="space-y-2">
                  <div class="flex flex-wrap items-center gap-2.5">
                    <span class="px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
                      {{ edu.degree | localize }}
                    </span>

                    @if (isCurrentlyStudying(edu)) {
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>{{ isKhmer() ? 'កំពុងសិក្សា' : 'Current Student' }}</span>
                      </span>
                    }
                  </div>

                  <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {{ edu.field | localize }}
                  </h2>

                  <!-- Institution Name -->
                  <div class="flex items-center gap-2 text-base text-slate-600 dark:text-slate-300 font-semibold">
                    <svg class="w-5 h-5 text-indigo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span>{{ edu.institution | localize }}</span>
                  </div>
                </div>

                <!-- Academic Metadata: Years & GPA -->
                <div class="flex flex-wrap lg:flex-col items-start lg:items-end gap-2.5 flex-shrink-0">
                  <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200/60 dark:border-slate-700/60">
                    <svg class="w-3.5 h-3.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{{ formatYearRange(edu) }}</span>
                  </div>

                  @if (edu.gpa) {
                    <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-800/60">
                      <svg class="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span>GPA: {{ edu.gpa }}</span>
                    </div>
                  }
                </div>
              </div>

              <!-- Description -->
              @if (edu.description) {
                <p class="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed" [class.font-khmer]="isKhmer()">
                  {{ edu.description | localize }}
                </p>
              }

              <!-- Extracurricular Activities & Honors -->
              @if (getActivities(edu).length > 0) {
                <div class="space-y-3 pt-2">
                  <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                    <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    <span>{{ isKhmer() ? 'សកម្មភាព និងសមិទ្ធផលសិក្សា' : 'Activities & Scholastic Honors' }}</span>
                  </h3>

                  <ul class="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    @for (act of getActivities(edu); track act) {
                      <li class="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                        <span class="w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px]">
                          ✓
                        </span>
                        <span class="leading-relaxed" [class.font-khmer]="isKhmer()">{{ act }}</span>
                      </li>
                    }
                  </ul>
                </div>
              }
            </article>
          }
        </section>
      }

      <!-- Certifications Section (if available) -->
      @if (certifications().length > 0) {
        <section class="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div class="space-y-1">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/50 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <span>{{ isKhmer() ? 'វិញ្ញាបនបត្រ' : 'Certifications' }}</span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {{ isKhmer() ? 'វិញ្ញាបនបត្របច្ចេកទេស និងការទទួលស្គាល់' : 'Professional Certifications & Awards' }}
            </h2>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (cert of certifications(); track cert._id) {
              <div class="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-500/60 transition-all duration-300 flex flex-col justify-between space-y-4">
                <div class="space-y-3">
                  <div class="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <h3 class="text-base font-bold text-slate-900 dark:text-white line-clamp-2">
                    {{ cert.name | localize }}
                  </h3>
                  <p class="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    {{ cert.organization | localize }}
                  </p>
                </div>

                @if (cert.credentialUrl) {
                  <a
                    [href]="cert.credentialUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline pt-2 border-t border-slate-100 dark:border-slate-800"
                  >
                    <span>{{ isKhmer() ? 'ផ្ទៀងផ្ទាត់វិញ្ញាបនបត្រ' : 'Verify Credential' }}</span>
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                }
              </div>
            }
          </div>
        </section>
      }

      <!-- Bottom Next Steps Navigation -->
      <section class="p-8 sm:p-10 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="space-y-2 max-w-xl">
          <h2 class="text-xl sm:text-2xl font-bold tracking-tight">
            {{ isKhmer() ? 'ចង់ស្វែងយល់បន្ថែមអំពីបទពិសោធន៍ ឬគម្រោង?' : 'Ready to explore my career experience or projects?' }}
          </h2>
          <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {{ isKhmer()
              ? 'ចូលទៅកាន់ទំព័របទពិសោធន៍ដើម្បីមើលតួនាទីជាក់ស្តែង ឬពិនិត្យមើលគម្រោងសូហ្វវែរទាំងអស់។'
              : 'Browse my professional timeline, responsibilities, or check the portfolio of deployed applications.'
            }}
          </p>
        </div>
        <div class="flex flex-wrap gap-3">
          <a
            routerLink="/experience"
            class="px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
          >
            {{ isKhmer() ? 'បទពិសោធន៍' : 'Experience' }}
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
export class EducationComponent implements OnInit {
  private readonly portfolioService = inject(PortfolioService);
  private readonly languageService = inject(LanguageService);

  public readonly education = signal<Education[]>([]);
  public readonly certifications = signal<Certification[]>([]);
  public readonly isLoading = signal<boolean>(true);
  public readonly error = signal<string | null>(null);

  public readonly isKhmer = computed(() => this.languageService.currentLang() === 'kh');

  public ngOnInit(): void {
    this.loadEducationData();
  }

  public loadEducationData(): void {
    this.isLoading.set(true);
    this.error.set(null);

    forkJoin({
      education: this.portfolioService.getEducation().pipe(catchError(() => of(null))),
      certifications: this.portfolioService.getCertifications().pipe(catchError(() => of(null))),
    }).subscribe({
      next: (results) => {
        if (results.education && results.education.data) {
          const list = Array.isArray(results.education.data)
            ? [...results.education.data].sort((a, b) => (b.startYear || 0) - (a.startYear || 0))
            : [];
          this.education.set(list);
        } else {
          this.education.set([]);
        }

        if (results.certifications && results.certifications.data) {
          const certs = Array.isArray(results.certifications.data)
            ? results.certifications.data.filter((c) => c.isVisible !== false)
            : [];
          this.certifications.set(certs);
        } else {
          this.certifications.set([]);
        }

        this.isLoading.set(false);
      },
      error: () => {
        this.error.set(
          this.isKhmer()
            ? 'មិនអាចទាញយកទិន្នន័យប្រវត្តិសិក្សាបានទេ។ សូមព្យាយាមម្តងទៀត។'
            : 'Unable to load education records. Please verify your connection.',
        );
        this.isLoading.set(false);
      },
    });
  }

  public isCurrentlyStudying(edu: Education): boolean {
    return !edu.endYear || edu.endYear >= new Date().getFullYear();
  }

  public formatYearRange(edu: Education): string {
    if (!edu.endYear) {
      return this.isKhmer()
        ? `${edu.startYear} – បច្ចុប្បន្ន`
        : `${edu.startYear} – Present`;
    }
    return `${edu.startYear} – ${edu.endYear}`;
  }

  public getActivities(edu: Education): string[] {
    if (this.isKhmer() && edu.activities?.kh && edu.activities.kh.length > 0) {
      return edu.activities.kh;
    }
    return edu.activities?.en || [];
  }
}
