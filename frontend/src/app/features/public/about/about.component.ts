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

// PrimeNG UI Modules
import { TagModule } from 'primeng/tag';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    SkeletonLoaderComponent,
    LocalizePipe,
    TagModule,
    AnimateOnScrollModule,
  ],
  template: `
    <div class="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <!-- Page Header with Fade In Animation -->
      <section class="space-y-4 max-w-3xl animate-fade-in-up">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>{{ isKhmer() ? 'អំពីខ្ញុំ' : 'About Me' }}</span>
        </div>

        <h1 class="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          {{ isKhmer() ? 'ដំណើរការ និងចក្ខុវិស័យរបស់ខ្ញុំ' : 'Journey, Passion & Technical Vision' }}
        </h1>

        <p class="text-lg text-slate-600 dark:text-slate-400 leading-relaxed" [class.font-khmer]="isKhmer()">
          {{ (profile()?.introduction | localize) || 'Dedicated engineer committed to creating elegant software that delivers measurable impact.' }}
        </p>

        <!-- Stats Overview Pill Group with Stagger -->
        <div class="flex flex-wrap items-center gap-3 pt-2">
          <div class="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-indigo-400 transition-colors">
            <span class="font-bold text-indigo-600 dark:text-indigo-400">Full-Stack</span>
            <span class="ml-1.5">{{ isKhmer() ? 'វិស្វកម្មគេហទំព័រ' : 'Web Engineering' }}</span>
          </div>

          @if (latestEducation()?.degree) {
            <div class="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-purple-400 transition-colors">
              <span class="font-bold text-purple-600 dark:text-purple-400">{{ latestEducation()!.degree | localize }}</span>
              <span class="ml-1.5">{{ isKhmer() ? 'កម្រិតអប់រំ' : 'Academic Degree' }}</span>
            </div>
          }

          <div class="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-xs font-medium text-slate-700 dark:text-slate-300 inline-flex items-center gap-2 hover:border-emerald-400 transition-colors">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span class="font-bold text-emerald-600 dark:text-emerald-400">{{ isKhmer() ? 'បើកទទួលការងារ' : 'Open to Opportunities' }}</span>
          </div>
        </div>
      </section>

      <!-- Main Content Grid -->
      @if (isLoading()) {
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div class="lg:col-span-5 space-y-6">
            <app-skeleton-loader variant="rect" height="440px" customClass="rounded-3xl"></app-skeleton-loader>
          </div>
          <div class="lg:col-span-7 space-y-6">
            <app-skeleton-loader variant="rect" height="220px" customClass="rounded-3xl"></app-skeleton-loader>
            <app-skeleton-loader variant="rect" height="200px" customClass="rounded-3xl"></app-skeleton-loader>
            <app-skeleton-loader variant="rect" height="200px" customClass="rounded-3xl"></app-skeleton-loader>
          </div>
        </div>
      } @else {
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <!-- Sidebar: Unified Profile Card (5 cols on lg, Sticky with Scroll Animation) -->
          <aside
            pAnimateOnScroll
            [once]="true"
            [threshold]="0.05"
            enterClass="animate-enter fade-in-0 slide-in-from-l-8 animate-duration-700"
            leaveClass="animate-leave fade-out-0"
            class="lg:col-span-5 lg:sticky lg:top-24 space-y-6"
          >
            <div class="card-interactive p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-xl space-y-6 backdrop-blur-md">
              <!-- Portrait Image Container -->
              <div class="relative w-full aspect-[4/5] sm:h-84 rounded-2xl overflow-hidden border border-slate-200/60 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 shadow-md group">
                @if (profile()?.aboutImage || profile()?.profileImage) {
                  <img
                    [src]="profile()?.aboutImage || profile()?.profileImage"
                    [alt]="(profile()?.fullName | localize) || 'Dim Sareach'"
                    class="w-full h-full object-cover object-top sm:object-center group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                    decoding="async"
                  />
                } @else {
                  <div class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white p-8 text-center">
                    <div class="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-3xl font-black mb-3 shadow-inner">
                      DS
                    </div>
                    <span class="text-xl font-bold">{{ (profile()?.fullName | localize) || 'Dim Sareach' }}</span>
                    <span class="text-xs text-indigo-200 mt-1">{{ (profile()?.title | localize) || 'Software Engineer' }}</span>
                  </div>
                }

                <!-- Status pill overlay -->
                <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md text-white text-xs font-semibold border border-white/10 shadow-lg">
                    <span class="relative flex h-2 w-2">
                      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span>{{ isKhmer() ? 'ត្រៀមខ្លួនសម្រាប់គម្រោង' : 'Available for Work' }}</span>
                  </span>
                </div>
              </div>

              <!-- Identity Block -->
              <div class="space-y-1">
                <h2 class="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>{{ (profile()?.fullName | localize) || 'Dim Sareach' }}</span>
                  <i class="pi pi-verified text-indigo-500 text-base" title="Verified Profile"></i>
                </h2>
                <p class="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                  {{ (profile()?.title | localize) || 'Full Stack Engineer' }}
                </p>
              </div>

              <!-- Quick Info List -->
              <div class="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-sm">
                <!-- Location -->
                <div class="flex items-start gap-3">
                  <div class="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                    <i class="pi pi-map-marker text-xs"></i>
                  </div>
                  <div class="min-w-0 flex-1">
                    <div class="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                      {{ isKhmer() ? 'ទីតាំង' : 'Location' }}
                    </div>
                    <div class="font-semibold text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-relaxed" [class.font-khmer]="isKhmer()">
                      {{ (profile()?.location | localize) || 'Phnom Penh, Cambodia' }}
                    </div>
                  </div>
                </div>

                <!-- Email -->
                @if (profile()?.email) {
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                      <i class="pi pi-envelope text-xs"></i>
                    </div>
                    <div class="min-w-0 flex-1">
                      <div class="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                        {{ isKhmer() ? 'អ៊ីមែល' : 'Email Address' }}
                      </div>
                      <a
                        [href]="'mailto:' + profile()!.email"
                        class="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline truncate block"
                      >
                        {{ profile()!.email }}
                      </a>
                    </div>
                  </div>
                }

                <!-- Phone (if present) -->
                @if (profile()?.phone) {
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                      <i class="pi pi-phone text-xs"></i>
                    </div>
                    <div class="min-w-0 flex-1">
                      <div class="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                        {{ isKhmer() ? 'លេខទូរស័ព្ទ' : 'Phone' }}
                      </div>
                      <a
                        [href]="'tel:' + profile()!.phone"
                        class="font-semibold text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 truncate block"
                      >
                        {{ profile()!.phone }}
                      </a>
                    </div>
                  </div>
                }
              </div>

              <!-- Action Buttons -->
              <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2.5">
                @if (settings()?.enableCvDownload !== false) {
                  <a
                    [href]="cvDownloadUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="w-full text-center py-3 px-5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 active:scale-95 transition-all inline-flex items-center justify-center gap-2 no-underline hover:-translate-y-0.5"
                  >
                    <i class="pi pi-download text-xs"></i>
                    <span>{{ isKhmer() ? 'ទាញយកប្រវត្តិរូប (CV)' : 'Download Curriculum Vitae' }}</span>
                  </a>
                }
                <a
                  routerLink="/contact"
                  class="w-full text-center py-3 px-5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700/60 active:scale-95 transition-all inline-flex items-center justify-center gap-2 no-underline hover:-translate-y-0.5"
                >
                  <i class="pi pi-send text-xs"></i>
                  <span>{{ isKhmer() ? 'ទាក់ទងមកខ្ញុំ' : 'Send a Message' }}</span>
                </a>
              </div>
            </div>
          </aside>

          <!-- Main Narrative Column (7 cols on lg) -->
          <main class="lg:col-span-7 space-y-10">
            <!-- Section 1: Personal Story & About Me with Scroll Animation -->
            <section
              pAnimateOnScroll
              [once]="true"
              [threshold]="0.08"
              enterClass="animate-enter fade-in-0 slide-in-from-b-8 animate-duration-700"
              leaveClass="animate-leave fade-out-0"
              class="card-interactive p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4"
            >
              <div class="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
                <span class="flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  <i class="pi pi-user text-sm"></i>
                </span>
                <h2 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {{ isKhmer() ? 'រឿងរ៉ាវ និងចំណង់ចំណូលចិត្ត' : 'Personal Story & Background' }}
                </h2>
              </div>

              <div class="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed text-base sm:text-lg space-y-4" [class.font-khmer]="isKhmer()">
                <p>
                  {{ (profile()?.about | localize) || (profile()?.introduction | localize) }}
                </p>
              </div>
            </section>

            <!-- Section 2: Education & Academic Journey with Scroll Animation -->
            @if (education().length > 0) {
              <section
                pAnimateOnScroll
                [once]="true"
                [threshold]="0.08"
                enterClass="animate-enter fade-in-0 slide-in-from-b-8 animate-duration-700"
                leaveClass="animate-leave fade-out-0"
                class="space-y-4"
              >
                <div class="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span class="flex items-center justify-center w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                    <i class="pi pi-graduation-cap text-sm"></i>
                  </span>
                  <h2 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    {{ isKhmer() ? 'ការអប់រំ និងសញ្ញាបត្រ' : 'Education & Qualifications' }}
                  </h2>
                </div>

                <div class="space-y-4">
                  @for (edu of education(); track edu._id || edu.institution.en) {
                    <div class="card-interactive p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-800/60 transition-all space-y-3">
                      <div class="flex items-start justify-between gap-4 flex-wrap">
                        <div class="space-y-1">
                          <h3 class="text-lg font-bold text-slate-900 dark:text-white">
                            {{ edu.degree | localize }}
                          </h3>
                          <p class="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                            <i class="pi pi-building text-xs text-slate-400"></i>
                            <span>{{ edu.institution | localize }}</span>
                          </p>
                        </div>
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
                          {{ edu.startYear }} — {{ edu.endYear || (isKhmer() ? 'បច្ចុប្បន្ន' : 'Present') }}
                        </span>
                      </div>

                      @if (edu.description) {
                        <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed pt-1" [class.font-khmer]="isKhmer()">
                          {{ edu.description | localize }}
                        </p>
                      }
                    </div>
                  }
                </div>
              </section>
            }

            <!-- Section 3: Professional Goals & Vision with Scroll Animation -->
            @if (profile()?.goals) {
              <section
                pAnimateOnScroll
                [once]="true"
                [threshold]="0.08"
                enterClass="animate-enter fade-in-0 slide-in-from-b-8 animate-duration-700"
                leaveClass="animate-leave fade-out-0"
                class="space-y-4"
              >
                <div class="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span class="flex items-center justify-center w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                    <i class="pi pi-compass text-sm"></i>
                  </span>
                  <h2 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    {{ isKhmer() ? 'ចក្ខុវិស័យ និងគោលដៅអនាគត' : 'Vision & Professional Goals' }}
                  </h2>
                </div>

                <div class="card-interactive p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-amber-50/40 via-white to-indigo-50/20 dark:from-amber-950/20 dark:via-slate-900 dark:to-indigo-950/20 border border-amber-200/60 dark:border-amber-900/40 shadow-xs">
                  <p class="text-slate-700 dark:text-slate-300 leading-relaxed text-base" [class.font-khmer]="isKhmer()">
                    {{ profile()?.goals | localize }}
                  </p>
                </div>
              </section>
            }

            <!-- Section 4: Collaboration Banner with Zoom Scroll Animation -->
            <section
              pAnimateOnScroll
              [once]="true"
              [threshold]="0.08"
              enterClass="animate-enter fade-in-0 zoom-in-95 animate-duration-700"
              leaveClass="animate-leave fade-out-0"
              class="card-interactive relative p-7 sm:p-9 rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white shadow-xl border border-indigo-500/20 group"
            >
              <div class="relative z-10 space-y-4 max-w-xl">
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-indigo-200">
                  <i class="pi pi-sparkles"></i>
                  <span>{{ isKhmer() ? 'កិច្ចសហការ និងឱកាសការងារ' : 'Open for Collaboration' }}</span>
                </div>
                <h3 class="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {{ isKhmer() ? 'តោះបង្កើតអ្វីដែលអស្ចារ្យជាមួយគ្នា' : 'Let\\'s Build Something Exceptional Together' }}
                </h3>
                <p class="text-sm text-indigo-100/90 leading-relaxed">
                  {{ isKhmer() ? 'មានគម្រោងក្នុងចិត្ត ឬត្រូវការវិស្វករកម្មវិធីដែលមានបទពិសោធន៍? ទាក់ទងមកខ្ញុំថ្ងៃនេះ!' : 'Have a challenging project, an architectural problem, or an exciting role? I\\'d love to connect and build impact.' }}
                </p>
                <div class="pt-2 flex flex-wrap items-center gap-3">
                  <a
                    routerLink="/contact"
                    class="py-3 px-6 rounded-xl text-xs font-bold bg-white text-slate-900 hover:bg-indigo-50 active:scale-95 transition-all shadow-md inline-flex items-center gap-2 no-underline hover:-translate-y-0.5"
                  >
                    <span>{{ isKhmer() ? 'ទាក់ទងមកឥឡូវនេះ' : 'Get In Touch' }}</span>
                    <i class="pi pi-arrow-right text-xs"></i>
                  </a>
                  <a
                    routerLink="/projects"
                    class="py-3 px-6 rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 active:scale-95 transition-all inline-flex items-center gap-2 no-underline hover:-translate-y-0.5"
                  >
                    <span>{{ isKhmer() ? 'មើលគម្រោងស្នាដៃ' : 'Explore Projects' }}</span>
                  </a>
                </div>
              </div>
            </section>
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
