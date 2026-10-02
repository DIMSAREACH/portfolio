import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin, of, catchError } from 'rxjs';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { LanguageService } from '../../../core/services/language.service';
import { Profile, Education, Settings } from '../../../core/models';
import {
  SkeletonLoaderComponent,
  LocalizePipe,
} from '../../../shared';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    SkeletonLoaderComponent,
    LocalizePipe,
  ],
  template: `
    <div class="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      <!-- Page Header -->
      <div class="space-y-3 max-w-3xl">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          <span>{{ isKhmer() ? 'អំពីខ្ញុំ' : 'About Me' }}</span>
        </div>
        <h1 class="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          {{ isKhmer() ? 'ដំណើរការ និងចក្ខុវិស័យរបស់ខ្ញុំ' : 'Journey, Passion & Technical Vision' }}
        </h1>
        <p class="text-lg text-slate-600 dark:text-slate-400 leading-relaxed" [class.font-khmer]="isKhmer()">
          {{ (profile()?.introduction | localize) || 'Dedicated engineer committed to creating elegant software that delivers measurable impact.' }}
        </p>
      </div>

      @if (isLoading()) {
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div class="lg:col-span-5">
            <app-skeleton-loader type="card" [count]="1"></app-skeleton-loader>
          </div>
          <div class="lg:col-span-7 space-y-4">
            <app-skeleton-loader type="text" [count]="8"></app-skeleton-loader>
          </div>
        </div>
      } @else {
        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <!-- Sidebar: Visual & Quick Facts (5 cols) -->
          <aside class="lg:col-span-5 space-y-6">
            <!-- Profile Photo Card -->
            <div class="relative group">
              <div class="absolute -inset-1 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              <div class="relative h-96 w-full rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 shadow-xl">
                @if (profile()?.aboutImage || profile()?.profileImage) {
                  <img
                    [src]="profile()?.aboutImage || profile()?.profileImage"
                    [alt]="(profile()?.fullName | localize) || 'Dim Sareach'"
                    class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                  />
                } @else {
                  <div class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-6 text-center">
                    <span class="text-6xl font-black mb-2">DS</span>
                    <span class="text-xl font-bold">{{ (profile()?.fullName | localize) || 'Dim Sareach' }}</span>
                    <span class="text-sm text-indigo-100">{{ (profile()?.title | localize) || 'Software Engineer' }}</span>
                  </div>
                }
              </div>
            </div>

            <!-- Quick Facts Card -->
            <div class="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-sm space-y-4">
              <h3 class="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                {{ isKhmer() ? 'ព័ត៌មានសង្ខេប' : 'Quick Facts' }}
              </h3>

              <div class="space-y-3 text-sm">
                <!-- Location -->
                <div class="flex items-start gap-3">
                  <span class="text-slate-400 mt-0.5">📍</span>
                  <div>
                    <p class="text-xs text-slate-500 dark:text-slate-400">{{ isKhmer() ? 'ទីតាំង' : 'Location' }}</p>
                    <p class="font-medium text-slate-800 dark:text-slate-200">
                      {{ (profile()?.location | localize) || 'Phnom Penh, Cambodia' }}
                    </p>
                  </div>
                </div>

                <!-- Email -->
                @if (profile()?.email) {
                  <div class="flex items-start gap-3">
                    <span class="text-slate-400 mt-0.5">✉️</span>
                    <div>
                      <p class="text-xs text-slate-500 dark:text-slate-400">{{ isKhmer() ? 'អ៊ីមែល' : 'Email' }}</p>
                      <a [href]="'mailto:' + profile()!.email" class="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                        {{ profile()!.email }}
                      </a>
                    </div>
                  </div>
                }

                <!-- Career Interests -->
                @if (profile()?.careerInterests) {
                  <div class="flex items-start gap-3">
                    <span class="text-slate-400 mt-0.5">🎯</span>
                    <div>
                      <p class="text-xs text-slate-500 dark:text-slate-400">{{ isKhmer() ? 'ចំណាប់អារម្មណ៍អាជីព' : 'Focus' }}</p>
                      <p class="font-medium text-slate-800 dark:text-slate-200" [class.font-khmer]="isKhmer()">
                        {{ profile()?.careerInterests | localize }}
                      </p>
                    </div>
                  </div>
                }
              </div>

              <!-- Action buttons in sidebar -->
              <div class="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-col gap-2.5">
                @if (settings()?.enableCvDownload !== false) {
                  <a
                    [href]="cvDownloadUrl"
                    target="_blank"
                    class="w-full text-center py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
                  >
                    {{ isKhmer() ? 'ទាញយកប្រវត្តិរូប (CV)' : 'Download Curriculum Vitae' }}
                  </a>
                }
                <a
                  routerLink="/contact"
                  class="w-full text-center py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  {{ isKhmer() ? 'ទាក់ទងមកខ្ញុំ' : 'Send a Message' }}
                </a>
              </div>
            </div>
          </aside>

          <!-- Main Narrative (7 cols) -->
          <main class="lg:col-span-7 space-y-10">
            <!-- Personal Introduction & Story -->
            <section class="space-y-4">
              <h2 class="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                <span>{{ isKhmer() ? 'អំពីខ្ញុំផ្ទាល់' : 'Introduction' }}</span>
              </h2>
              <div class="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed text-base space-y-4" [class.font-khmer]="isKhmer()">
                <p>
                  {{ (profile()?.about | localize) || (profile()?.introduction | localize) }}
                </p>
              </div>
            </section>

            <!-- Professional Summary -->
            @if (profile()?.professionalSummary) {
              <section class="space-y-4 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40">
                <h2 class="text-xl font-bold text-slate-900 dark:text-white">
                  {{ isKhmer() ? 'សេចក្តីសង្ខេបវិជ្ជាជីវៈ' : 'Professional Summary' }}
                </h2>
                <p class="text-slate-600 dark:text-slate-300 leading-relaxed text-base" [class.font-khmer]="isKhmer()">
                  {{ profile()?.professionalSummary | localize }}
                </p>
              </section>
            }

            <!-- Engineering Philosophy & Background -->
            @if (profile()?.background) {
              <section class="space-y-4">
                <h2 class="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                  <span>{{ isKhmer() ? 'បទពិសោធន៍ និងប្រវត្តិ' : 'Background & Philosophy' }}</span>
                </h2>
                <p class="text-slate-600 dark:text-slate-300 leading-relaxed text-base" [class.font-khmer]="isKhmer()">
                  {{ profile()?.background | localize }}
                </p>
              </section>
            }

            <!-- Core Strengths -->
            @if (strengthsList().length > 0) {
              <section class="space-y-4">
                <h2 class="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full bg-pink-500"></span>
                  <span>{{ isKhmer() ? 'ចំណុចខ្លាំង' : 'Core Strengths' }}</span>
                </h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  @for (strength of strengthsList(); track strength) {
                    <div class="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                      <div class="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold shrink-0">
                        ✓
                      </div>
                      <span class="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {{ strength }}
                      </span>
                    </div>
                  }
                </div>
              </section>
            }

            <!-- Career Goals -->
            @if (profile()?.goals) {
              <section class="space-y-4">
                <h2 class="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span>{{ isKhmer() ? 'គោលដៅអនាគត' : 'Professional Goals & Vision' }}</span>
                </h2>
                <p class="text-slate-600 dark:text-slate-300 leading-relaxed text-base" [class.font-khmer]="isKhmer()">
                  {{ profile()?.goals | localize }}
                </p>
              </section>
            }

            <!-- Education Highlight Card -->
            @if (latestEducation()) {
              <section class="p-6 rounded-3xl border border-indigo-100 dark:border-indigo-900/50 bg-gradient-to-tr from-indigo-50/50 to-purple-50/30 dark:from-indigo-950/20 dark:to-purple-950/10 space-y-2">
                <p class="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {{ isKhmer() ? 'ការអប់រំកម្រិតខ្ពស់' : 'Highest Education' }}
                </p>
                <h3 class="text-lg font-bold text-slate-900 dark:text-white">
                  {{ latestEducation()!.degree | localize }} in {{ latestEducation()!.field | localize }}
                </h3>
                <p class="text-sm text-slate-600 dark:text-slate-400">
                  {{ latestEducation()!.institution | localize }} ({{ latestEducation()!.startYear }} &mdash; {{ latestEducation()!.endYear || (isKhmer() ? 'បច្ចុប្បន្ន' : 'Present') }})
                </p>
              </section>
            }
          </main>
        </div>
      }
    </div>
  `,
})
export class AboutComponent implements OnInit {
  private readonly portfolioService = inject(PortfolioService);
  private readonly languageService = inject(LanguageService);

  public readonly isKhmer = this.languageService.isKhmer;
  public readonly isLoading = signal<boolean>(true);
  public readonly profile = signal<Profile | null>(null);
  public readonly education = signal<Education[]>([]);
  public readonly settings = signal<Settings | null>(null);

  public readonly latestEducation = computed<Education | null>(() => {
    const list = this.education();
    return list.length > 0 ? list[0] : null;
  });

  public readonly strengthsList = computed<string[]>(() => {
    const p = this.profile();
    if (!p?.strengths) {
      return [];
    }
    const currentLang = this.languageService.currentLang();
    const list = p.strengths[currentLang];
    if (Array.isArray(list) && list.length > 0) {
      return list;
    }
    return p.strengths.en || [];
  });

  public get cvDownloadUrl(): string {
    return this.portfolioService.getCvDownloadUrl();
  }

  public ngOnInit(): void {
    this.loadData();
  }

  public loadData(): void {
    this.isLoading.set(true);

    forkJoin({
      profile: this.portfolioService.getProfile().pipe(catchError(() => of(null))),
      education: this.portfolioService.getEducation().pipe(catchError(() => of(null))),
      settings: this.portfolioService.getSettings().pipe(catchError(() => of(null))),
    }).subscribe({
      next: (results) => {
        if (results.profile?.data) {
          this.profile.set(results.profile.data);
        }
        if (results.education?.data) {
          this.education.set(results.education.data);
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
}
