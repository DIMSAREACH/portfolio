import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { DataViewModule } from 'primeng/dataview';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { LanguageService } from '../../../core/services/language.service';
import { Certification, CertificationType } from '../../../core/models';
import {
  SkeletonLoaderComponent,
  EmptyStateComponent,
  LocalizePipe,
} from '../../../shared';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';

export interface AchievementCascadeItem {
  id: string;
  name: string;
  cname: string;
  nameKh: string;
  cnameKh: string;
}

@Component({
  selector: 'app-achievements',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    CascadeSelectModule,
    DataViewModule,
    SelectButtonModule,
    TagModule,
    ButtonModule,
    SkeletonLoaderComponent,
    EmptyStateComponent,
    LocalizePipe,
    AnimateOnScrollModule,
  ],
  template: `
    <div class="relative py-8 sm:py-12 md:py-16 lg:py-20 px-3.5 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 sm:space-y-10 md:space-y-12 overflow-hidden">
      <!-- Ambient Lighting Background Decor -->
      <div class="absolute -top-16 sm:-top-24 left-1/2 -translate-x-1/2 w-72 sm:w-[32rem] md:w-[38rem] h-64 sm:h-80 bg-gradient-to-tr from-amber-500/15 via-indigo-500/10 to-transparent dark:from-amber-500/10 dark:via-indigo-500/5 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <!-- Page Header Section with Entrance Animation -->
      <header class="space-y-5 sm:space-y-6 animate-fade-in-up">
        <div class="max-w-3xl space-y-3 sm:space-y-4">
          <!-- Badge -->
          <div class="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-900/50 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 backdrop-blur-sm shadow-2xs">
            <svg class="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            <span>{{ isKhmer() ? 'វិញ្ញាបនបត្រ និងសមិទ្ធផលកិត្តិយស' : 'Verified Credentials & Honors' }}</span>
          </div>

          <h1 class="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight sm:leading-tight">
            {{ isKhmer() ? 'សមិទ្ធផល និងវិញ្ញាបនបត្រទទួលស្គាល់' : 'Achievements & Certifications' }}
          </h1>

          <p class="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl" [class.font-khmer]="isKhmer()">
            {{ isKhmer()
              ? 'បណ្តុំនៃវិញ្ញាបនបត្រជំនាញវិជ្ជាជីវៈ ពានរង្វាន់កិត្តិយស និងសមិទ្ធផលសំខាន់ៗដែលទទួលបានក្នុងការអភិវឌ្ឍជំនាញបច្ចេកវិទ្យា និងការសិក្សា។'
              : 'Verified professional certifications, industry accreditations, hackathon awards, and key engineering milestones.'
            }}
          </p>
        </div>

        <!-- 4-Card Quick Snapshot Strip (Optimized for Phone 2-Col and Tablet/Desktop 4-Col) -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 pt-1 w-full">
          <!-- Stat 1: Total Credentials -->
          <div class="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs backdrop-blur-sm flex flex-col justify-between gap-1.5 sm:gap-2 transition-all hover:border-slate-300 dark:hover:border-slate-700 min-w-0">
            <div>
              <div class="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span class="truncate">{{ isKhmer() ? 'សរុបឯកសារ' : 'Total Credentials' }}</span>
              </div>
              <div class="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-1 leading-snug truncate">
                {{ totalCount() }} {{ isKhmer() ? 'ឯកសារ' : 'Recognitions' }}
              </div>
            </div>
            <div class="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {{ isKhmer() ? 'ផ្ទៀងផ្ទាត់ត្រឹមត្រូវ' : 'Verified & Validated' }}
            </div>
          </div>

          <!-- Stat 2: Technical Certifications -->
          <div class="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs backdrop-blur-sm flex flex-col justify-between gap-1.5 sm:gap-2 transition-all hover:border-slate-300 dark:hover:border-slate-700 min-w-0">
            <div>
              <div class="text-[11px] sm:text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 sm:gap-1.5">
                <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span class="truncate">{{ isKhmer() ? 'វិញ្ញាបនបត្រ' : 'Technical Certs' }}</span>
              </div>
              <div class="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-1 leading-snug truncate">
                {{ certificationsCount() }} {{ isKhmer() ? 'វិញ្ញាបនបត្រ' : 'Accreditations' }}
              </div>
            </div>
            <div class="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {{ isKhmer() ? 'ជំនាញឯកទេស' : 'Cloud & Software' }}
            </div>
          </div>

          <!-- Stat 3: Honors & Awards -->
          <div class="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs backdrop-blur-sm flex flex-col justify-between gap-1.5 sm:gap-2 transition-all hover:border-slate-300 dark:hover:border-slate-700 min-w-0">
            <div>
              <div class="text-[11px] sm:text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1 sm:gap-1.5">
                <svg class="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" clip-rule="evenodd" />
                </svg>
                <span class="truncate">{{ isKhmer() ? 'ពានរង្វាន់' : 'Honors & Awards' }}</span>
              </div>
              <div class="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-1 leading-snug truncate">
                {{ awardsCount() }} {{ isKhmer() ? 'ពានរង្វាន់' : 'Top Honors' }}
              </div>
            </div>
            <div class="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {{ isKhmer() ? 'ការប្រកួតប្រជែង' : 'Competitions' }}
            </div>
          </div>

          <!-- Stat 4: Key Milestones -->
          <div class="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs backdrop-blur-sm flex flex-col justify-between gap-1.5 sm:gap-2 transition-all hover:border-slate-300 dark:hover:border-slate-700 min-w-0">
            <div>
              <div class="text-[11px] sm:text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 sm:gap-1.5">
                <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                <span class="truncate">{{ isKhmer() ? 'សមិទ្ធផល' : 'Milestones' }}</span>
              </div>
              <div class="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-1 leading-snug truncate">
                {{ achievementsCount() }} {{ isKhmer() ? 'សមិទ្ធផល' : 'Milestones' }}
              </div>
            </div>
            <div class="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {{ isKhmer() ? 'ភាពជាអ្នកដឹកនាំ' : 'Leadership' }}
            </div>
          </div>
        </div>
      </header>

      <!-- Unified Filter & Command Bar Section with Stagger Entrance -->
      <section class="space-y-3 sm:space-y-4 animate-fade-in-up delay-150">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 p-2 sm:p-2.5 rounded-2xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/60 backdrop-blur-md">
          <!-- Primary Category Tabs (Desktop >= 1024px) -->
          <div class="hidden lg:flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Achievement Categories">
            <button
              type="button"
              role="tab"
              [attr.aria-selected]="selectedType() === 'all'"
              (click)="onTypeSelect('all')"
              class="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 shrink-0 cursor-pointer"
              [ngClass]="{
                'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm border border-slate-200/90 dark:border-slate-700 font-bold': selectedType() === 'all',
                'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60 border border-transparent': selectedType() !== 'all'
              }"
            >
              <span>{{ isKhmer() ? 'ទាំងអស់' : 'All Items' }}</span>
              <span class="px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                [ngClass]="selectedType() === 'all' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300' : 'bg-slate-200/70 dark:bg-slate-700 text-slate-600 dark:text-slate-400'">
                {{ totalCount() }}
              </span>
            </button>

            <button
              type="button"
              role="tab"
              [attr.aria-selected]="selectedType() === 'certification'"
              (click)="onTypeSelect('certification')"
              class="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 shrink-0 cursor-pointer"
              [ngClass]="{
                'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm border border-slate-200/90 dark:border-slate-700 font-bold': selectedType() === 'certification',
                'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60 border border-transparent': selectedType() !== 'certification'
              }"
            >
              <span>{{ isKhmer() ? 'វិញ្ញាបនបត្រ' : 'Certifications' }}</span>
              <span class="px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                [ngClass]="selectedType() === 'certification' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300' : 'bg-slate-200/70 dark:bg-slate-700 text-slate-600 dark:text-slate-400'">
                {{ certificationsCount() }}
              </span>
            </button>

            <button
              type="button"
              role="tab"
              [attr.aria-selected]="selectedType() === 'award'"
              (click)="onTypeSelect('award')"
              class="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 shrink-0 cursor-pointer"
              [ngClass]="{
                'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm border border-slate-200/90 dark:border-slate-700 font-bold': selectedType() === 'award',
                'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60 border border-transparent': selectedType() !== 'award'
              }"
            >
              <span>{{ isKhmer() ? 'ពានរង្វាន់' : 'Awards' }}</span>
              <span class="px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                [ngClass]="selectedType() === 'award' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300' : 'bg-slate-200/70 dark:bg-slate-700 text-slate-600 dark:text-slate-400'">
                {{ awardsCount() }}
              </span>
            </button>

            <button
              type="button"
              role="tab"
              [attr.aria-selected]="selectedType() === 'achievement'"
              (click)="onTypeSelect('achievement')"
              class="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 shrink-0 cursor-pointer"
              [ngClass]="{
                'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm border border-slate-200/90 dark:border-slate-700 font-bold': selectedType() === 'achievement',
                'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60 border border-transparent': selectedType() !== 'achievement'
              }"
            >
              <span>{{ isKhmer() ? 'សមិទ្ធផល' : 'Milestones' }}</span>
              <span class="px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                [ngClass]="selectedType() === 'achievement' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300' : 'bg-slate-200/70 dark:bg-slate-700 text-slate-600 dark:text-slate-400'">
                {{ achievementsCount() }}
              </span>
            </button>
          </div>

          <!-- Mobile & Tablet Responsive Dropdown (< 1024px) -->
          <div class="lg:hidden w-full flex-1">
            <p-cascadeselect
              [ngModel]="selectedCascadeItem()"
              (ngModelChange)="onCascadeChange({ value: $event })"
              [options]="cascadeCategories()"
              [optionLabel]="isKhmer() ? 'cnameKh' : 'cname'"
              [placeholder]="isKhmer() ? 'ជ្រើសរើសប្រភេទសមិទ្ធផល...' : 'All Credentials'"
              [showClear]="true"
              appendTo="body"
              (onChange)="onCascadeChange($event)"
              (onClear)="onCascadeClear()"
              styleClass="w-full portfolio-cascadeselect"
              [style]="{ width: '100%', minWidth: '14rem' }"
              inputId="achievement-cascadeselect"
              ariaLabel="Select an Achievement Category"
            />
          </div>

          <!-- Controls: Instant Search Input -->
          <div class="flex items-center gap-2 sm:gap-2.5 w-full lg:w-auto">
            <!-- Search Input -->
            <div class="relative flex-1 lg:w-72">
              <div class="absolute inset-y-0 left-0 pl-3 sm:pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                [value]="searchQuery()"
                (input)="onSearchInput($event)"
                [placeholder]="isKhmer() ? 'ស្វែងរកវិញ្ញាបនបត្រ...' : 'Search credentials...'"
                class="w-full pl-9 sm:pl-10 pr-8 sm:pr-9 py-2 rounded-xl text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-2xs"
              />
              @if (searchQuery()) {
                <button
                  type="button"
                  (click)="clearSearch()"
                  class="absolute inset-y-0 right-0 pr-2.5 sm:pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  aria-label="Clear search"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              }
            </div>
          </div>
        </div>

        <!-- Active Filter Indicator if Search or Subtype Active -->
        @if (hasActiveFilters()) {
          <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
            <div class="flex items-center gap-1.5 sm:gap-2">
              <span>{{ isKhmer() ? 'បង្ហាញលទ្ធផល៖' : 'Showing' }}</span>
              <span class="font-bold text-slate-900 dark:text-white">{{ displayedItems().length }}</span>
              <span>{{ isKhmer() ? 'ក្នុងចំណោម' : 'of' }}</span>
              <span class="font-semibold text-slate-700 dark:text-slate-300">{{ totalCount() }}</span>
            </div>
            <button
              type="button"
              (click)="resetFilters()"
              class="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold flex items-center gap-1"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>{{ isKhmer() ? 'កំណត់ឡើងវិញ' : 'Reset filters' }}</span>
            </button>
          </div>
        }
      </section>

      <!-- Main Content Area -->
      @if (isLoading()) {
        <!-- Skeleton State -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          @for (idx of [1, 2, 3, 4, 5, 6]; track idx) {
            <div class="p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
              <div class="flex items-center justify-between">
                <app-skeleton-loader type="circle" [count]="1"></app-skeleton-loader>
                <div class="w-20 h-6 bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse"></div>
              </div>
              <app-skeleton-loader type="text" [count]="4"></app-skeleton-loader>
            </div>
          }
        </div>
      } @else if (error()) {
        <!-- Error State -->
        <div class="p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/70 dark:bg-rose-950/20 text-center space-y-4 max-w-lg mx-auto shadow-sm backdrop-blur-xs">
          <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-inner">
            <svg class="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 class="text-base font-bold text-slate-900 dark:text-white">
              {{ isKhmer() ? 'មិនអាចទាញយកទិន្នន័យបានទេ' : 'Failed to Load Achievements' }}
            </h3>
            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">{{ error() }}</p>
          </div>
          <button
            type="button"
            (click)="loadCertifications()"
            class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all duration-200"
          >
            {{ isKhmer() ? 'ព្យាយាមម្តងទៀត' : 'Try Again' }}
          </button>
        </div>
      } @else if (displayedItems().length === 0) {
        <!-- Empty State -->
        <app-empty-state
          [title]="isKhmer() ? 'មិនមានទិន្នន័យឡើយ' : 'No credentials found'"
          [description]="isKhmer() ? 'មិនមានវិញ្ញាបនបត្រ ឬសមិទ្ធផលដែលត្រូវគ្នានឹងការស្វែងរករបស់អ្នកទេ។' : 'No achievements or certifications match this selection or query.'"
          [actionText]="isKhmer() ? 'មើលទាំងអស់' : 'Show All Credentials'"
          (actionClick)="resetFilters()"
        ></app-empty-state>
      } @else {
        <!-- PrimeNG DataView Layout with Grid & List Switcher -->
        <p-dataview #dv [value]="displayedItems()" [layout]="layout" styleClass="border-0 !bg-transparent !p-0">
          <ng-template #header>
            <div class="flex items-center justify-between py-2 px-1 mb-6 border-b border-slate-200/80 dark:border-slate-800/80">
              <div class="flex items-center gap-2">
                <i class="pi pi-verified text-indigo-500 text-base"></i>
                <span class="font-semibold text-slate-700 dark:text-slate-300 text-sm">
                  {{ isKhmer() ? 'បង្ហាញ ' + displayedItems().length + ' នៃ ' + totalCount() + ' សមិទ្ធផល' : 'Showing ' + displayedItems().length + ' of ' + totalCount() + ' credentials' }}
                </span>
              </div>
              <div class="flex justify-end">
                <p-selectbutton [(ngModel)]="layout" (ngModelChange)="onLayoutChange($event)" [options]="options" [allowEmpty]="false">
                  <ng-template #item let-item>
                    <i class="pi" [ngClass]="{ 'pi-bars': item === 'list', 'pi-table': item === 'grid' }"></i>
                  </ng-template>
                </p-selectbutton>
              </div>
            </div>
          </ng-template>

          <ng-template #list let-items>
            <div class="flex flex-col gap-4">
              @for (item of items; track item._id) {
                <div class="p-5 border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-xs hover:shadow-xl hover:border-indigo-400 dark:hover:border-indigo-500/60 transition-all duration-300">
                  <div class="flex flex-col sm:flex-row sm:items-center gap-5">
                    <!-- Thumbnail Box -->
                    <div class="w-full sm:w-44 h-32 relative rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 overflow-hidden border border-slate-200/60 dark:border-slate-700/60">
                      @if (item.image && !failedImages().has(item._id)) {
                        <img
                          class="w-full h-full object-cover"
                          [src]="item.image"
                          (error)="onImageError(item._id)"
                          [alt]="(item.name | localize) || 'Badge'"
                          loading="lazy"
                        />
                        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none"></div>
                      } @else {
                        <div class="w-12 h-12 rounded-xl flex items-center justify-center shadow-inner" [ngClass]="getTypeBadgeBg(item.type)">
                          <i class="pi text-xl" [ngClass]="{ 'pi-trophy': item.type === 'award', 'pi-star': item.type === 'achievement', 'pi-bookmark': item.type === 'certification' }"></i>
                        </div>
                      }
                      <p-tag [value]="getTypeLabel(item.type)" [severity]="getSeverity(item)" class="absolute top-2.5 left-2.5 z-10 shadow-sm" />
                    </div>

                    <!-- Details Row -->
                    <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-5">
                      <div class="space-y-1.5 flex-1 min-w-0">
                        <div class="flex items-center gap-2">
                          <span class="font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider block truncate">{{ item.organization | localize }}</span>
                          @if (isExpired(item.expirationDate)) {
                            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/60">
                              <i class="pi pi-exclamation-circle text-[10px]"></i>
                              <span>{{ isKhmer() ? 'ផុតកំណត់' : 'Expired' }}</span>
                            </span>
                          } @else {
                            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
                              <i class="pi pi-verified text-[10px] text-emerald-500"></i>
                              <span>{{ isKhmer() ? 'ផ្ទៀងផ្ទាត់' : 'Verified' }}</span>
                            </span>
                          }
                        </div>

                        <h3 class="font-bold text-base sm:text-lg text-slate-900 dark:text-white truncate">
                          {{ item.name | localize }}
                        </h3>

                        <div class="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <i class="pi pi-calendar text-[11px] text-indigo-500"></i>
                          <span>{{ formatDate(item.issueDate) }}</span>
                          @if (item.expirationDate) {
                            <span>·</span>
                            <span>{{ isKhmer() ? 'ផុតកំណត់៖' : 'Exp:' }} {{ formatDate(item.expirationDate) }}</span>
                          }
                        </div>
                      </div>

                      <div class="flex items-center shrink-0">
                        @if (item.credentialUrl) {
                          <a
                            [href]="item.credentialUrl"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-xs font-bold shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all cursor-pointer select-none"
                          >
                            <span>{{ isKhmer() ? 'ផ្ទៀងផ្ទាត់វិញ្ញាបនបត្រ' : 'Verify Credential' }}</span>
                            <i class="pi pi-external-link text-xs"></i>
                          </a>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>
          </ng-template>

          <ng-template #grid let-items>
            <div class="grid grid-cols-12 gap-5 sm:gap-6">
              @for (item of items; track item._id) {
                <div class="col-span-12 sm:col-span-6 lg:col-span-6 p-1">
                  <div class="p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 rounded-2xl flex flex-col justify-between h-full hover:shadow-xl hover:border-indigo-400 dark:hover:border-indigo-500/60 transition-all duration-300 group">
                    <div>
                      <!-- Card Image Area with cleanly anchored tag -->
                      <div class="relative w-full h-44 sm:h-52 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-center">
                        @if (item.image && !failedImages().has(item._id)) {
                          <img
                            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            [src]="item.image"
                            (error)="onImageError(item._id)"
                            [alt]="item.name | localize"
                            loading="lazy"
                          />
                          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none"></div>
                        } @else {
                          <div class="w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner" [ngClass]="getTypeBadgeBg(item.type)">
                            <i class="pi text-2xl" [ngClass]="{ 'pi-trophy': item.type === 'award', 'pi-star': item.type === 'achievement', 'pi-bookmark': item.type === 'certification' }"></i>
                          </div>
                        }
                        <p-tag
                          [value]="getTypeLabel(item.type)"
                          [severity]="getSeverity(item)"
                          class="absolute top-3 left-3 z-10 shadow-sm"
                        />
                      </div>

                      <!-- Card Details -->
                      <div class="pt-5 space-y-2">
                        <div class="flex items-center justify-between gap-2">
                          <span class="font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider block truncate flex-1">
                            {{ item.organization | localize }}
                          </span>
                          <div class="shrink-0">
                            @if (isExpired(item.expirationDate)) {
                              <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/60">
                                <i class="pi pi-exclamation-circle text-[10px]"></i>
                                <span>{{ isKhmer() ? 'ផុតកំណត់' : 'Expired' }}</span>
                              </span>
                            } @else {
                              <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
                                <i class="pi pi-verified text-[10px] text-emerald-500"></i>
                                <span>{{ isKhmer() ? 'ផ្ទៀងផ្ទាត់' : 'Verified' }}</span>
                              </span>
                            }
                          </div>
                        </div>

                        <h3 class="font-bold text-slate-900 dark:text-white line-clamp-2 text-base sm:text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {{ item.name | localize }}
                        </h3>

                        <div class="flex items-center gap-2 pt-1 text-xs text-slate-500 dark:text-slate-400">
                          <i class="pi pi-calendar text-[11px] text-indigo-500"></i>
                          <span>{{ formatDate(item.issueDate) }}</span>
                          @if (item.expirationDate) {
                            <span>·</span>
                            <span>{{ isKhmer() ? 'ផុតកំណត់៖' : 'Exp:' }} {{ formatDate(item.expirationDate) }}</span>
                          }
                        </div>
                      </div>
                    </div>

                    <!-- Clean Indigo Verify Action Button -->
                    @if (item.credentialUrl) {
                      <div class="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                        <a
                          [href]="item.credentialUrl"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-xs font-bold shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all cursor-pointer select-none"
                        >
                          <span>{{ isKhmer() ? 'ផ្ទៀងផ្ទាត់វិញ្ញាបនបត្រ' : 'Verify Credential' }}</span>
                          <i class="pi pi-external-link text-xs"></i>
                        </a>
                      </div>
                    }
                  </div>
                </div>
              }
            </div>
          </ng-template>
        </p-dataview>
      }

      <!-- Cross-Portfolio Navigation Banner (Optimized for Phone 1-col, Tablet 2-col/3-col) -->
      <section
        pAnimateOnScroll
        [once]="true"
        [threshold]="0.1"
        enterClass="animate-enter fade-in-0 slide-in-from-b-8 animate-duration-700"
        leaveClass="animate-leave fade-out-0"
        class="mt-12 sm:mt-16 pt-8 sm:pt-10 border-t border-slate-200/60 dark:border-slate-800/60"
      >
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          <!-- Link to Projects -->
          <a
            routerLink="/projects"
            class="group p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-50/70 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 hover:border-indigo-400 dark:hover:border-indigo-500/60 transition-all duration-200 flex items-center justify-between"
          >
            <div class="space-y-0.5 sm:space-y-1">
              <span class="text-[10px] sm:text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                {{ isKhmer() ? 'ស្នាដៃជាក់ស្តែង' : 'Work & Projects' }}
              </span>
              <h4 class="text-xs sm:text-sm md:text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {{ isKhmer() ? 'ស្វែងយល់ពីគម្រោងផ្សេងៗ' : 'Explore Featured Projects' }}
              </h4>
            </div>
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>

          <!-- Link to Skills -->
          <a
            routerLink="/skills"
            class="group p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-50/70 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 hover:border-indigo-400 dark:hover:border-indigo-500/60 transition-all duration-200 flex items-center justify-between"
          >
            <div class="space-y-0.5 sm:space-y-1">
              <span class="text-[10px] sm:text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                {{ isKhmer() ? 'ជំនាញបច្ចេកវិទ្យា' : 'Technical Skills' }}
              </span>
              <h4 class="text-xs sm:text-sm md:text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {{ isKhmer() ? 'តារាងជំនាញ & ភាសាកូដ' : 'Skills & Tech Stack' }}
              </h4>
            </div>
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>

          <!-- Link to Education -->
          <a
            routerLink="/education"
            class="group p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-50/70 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 hover:border-indigo-400 dark:hover:border-indigo-500/60 transition-all duration-200 flex items-center justify-between sm:col-span-2 md:col-span-1"
          >
            <div class="space-y-0.5 sm:space-y-1">
              <span class="text-[10px] sm:text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                {{ isKhmer() ? 'គ្រឹះសិក្សា' : 'Academic Journey' }}
              </span>
              <h4 class="text-xs sm:text-sm md:text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {{ isKhmer() ? 'ប្រវត្តិការសិក្សា & សញ្ញាបត្រ' : 'Education & Degrees' }}
              </h4>
            </div>
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      :host ::ng-deep .p-dataview {
        background: transparent !important;
        border: none !important;
      }
      :host ::ng-deep .p-dataview-header {
        background: transparent !important;
        border: none !important;
        padding: 0 !important;
      }
      :host ::ng-deep .p-dataview-content {
        background: transparent !important;
        border: none !important;
        padding: 0 !important;
      }
    `,
  ],
})
export class AchievementsComponent implements OnInit {
  private readonly portfolioService = inject(PortfolioService);
  private readonly languageService = inject(LanguageService);

  public readonly items = signal<Certification[]>([]);
  public readonly selectedType = signal<string>('all');
  public readonly searchQuery = signal<string>('');
  public readonly viewMode = signal<'grid' | 'list'>('grid');
  public layout: 'grid' | 'list' = 'grid';
  public readonly options: ('list' | 'grid')[] = ['list', 'grid'];
  public readonly failedImages = signal<Set<string>>(new Set<string>());
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

  public readonly hasActiveFilters = computed(
    () => this.selectedType() !== 'all' || this.searchQuery().trim().length > 0,
  );

  public readonly cascadeCategories = computed<AchievementCascadeItem[]>(() => [
    {
      id: 'all',
      name: `All Credentials (${this.totalCount()})`,
      cname: `All Credentials (${this.totalCount()})`,
      nameKh: `សមិទ្ធផលទាំងអស់ (${this.totalCount()})`,
      cnameKh: `សមិទ្ធផលទាំងអស់ (${this.totalCount()})`,
    },
    {
      id: 'certification',
      name: `Certifications (${this.certificationsCount()})`,
      cname: `Certifications (${this.certificationsCount()})`,
      nameKh: `វិញ្ញាបនបត្រ (${this.certificationsCount()})`,
      cnameKh: `វិញ្ញាបនបត្រ (${this.certificationsCount()})`,
    },
    {
      id: 'award',
      name: `Awards (${this.awardsCount()})`,
      cname: `Awards (${this.awardsCount()})`,
      nameKh: `ពានរង្វាន់ (${this.awardsCount()})`,
      cnameKh: `ពានរង្វាន់ (${this.awardsCount()})`,
    },
    {
      id: 'achievement',
      name: `Milestones (${this.achievementsCount()})`,
      cname: `Milestones (${this.achievementsCount()})`,
      nameKh: `សមិទ្ធផល (${this.achievementsCount()})`,
      cnameKh: `សមិទ្ធផល (${this.achievementsCount()})`,
    },
  ]);

  public readonly selectedCascadeItem = computed<AchievementCascadeItem | null>(() => {
    const current = this.selectedType();
    const list = this.cascadeCategories();
    return list.find((item) => item.id === current) || null;
  });

  public readonly displayedItems = computed(() => {
    const filter = this.selectedType();
    const query = this.searchQuery().trim().toLowerCase();

    let list = this.items();
    if (filter !== 'all') {
      list = list.filter((i) => i.type === filter);
    }

    if (!query) {
      return list;
    }

    return list.filter((i) => {
      const nameEn = (i.name?.en || '').toLowerCase();
      const nameKh = (i.name?.kh || '').toLowerCase();
      const orgEn = (i.organization?.en || '').toLowerCase();
      const orgKh = (i.organization?.kh || '').toLowerCase();
      const credId = (i.credentialId || '').toLowerCase();

      return (
        nameEn.includes(query) ||
        nameKh.includes(query) ||
        orgEn.includes(query) ||
        orgKh.includes(query) ||
        credId.includes(query)
      );
    });
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

  public onCascadeChange(event: { value?: AchievementCascadeItem | null }): void {
    const item = event?.value;
    if (!item || item.id === 'all') {
      this.onTypeSelect('all');
    } else {
      this.onTypeSelect(item.id);
    }
  }

  public onCascadeClear(): void {
    this.onTypeSelect('all');
  }

  public onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input?.value ?? '');
  }

  public clearSearch(): void {
    this.searchQuery.set('');
  }

  public resetFilters(): void {
    this.selectedType.set('all');
    this.searchQuery.set('');
  }

  public setViewMode(mode: 'grid' | 'list'): void {
    this.layout = mode;
    this.viewMode.set(mode);
  }

  public onLayoutChange(mode: 'grid' | 'list'): void {
    this.layout = mode;
    this.viewMode.set(mode);
  }

  public getSeverity(item: Certification): 'success' | 'info' | 'warn' | 'danger' | undefined {
    if (this.isExpired(item.expirationDate)) {
      return 'danger';
    }
    switch (item.type) {
      case 'award':
        return 'warn';
      case 'achievement':
        return 'success';
      case 'certification':
        return 'info';
      default:
        return undefined;
    }
  }

  public onImageError(id: string): void {
    const current = new Set(this.failedImages());
    current.add(id);
    this.failedImages.set(current);
  }

  public isExpired(date?: string | Date): boolean {
    if (!date) return false;
    return new Date(date).getTime() < Date.now();
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
