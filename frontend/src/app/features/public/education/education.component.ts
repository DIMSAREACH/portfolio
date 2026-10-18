import { Component, OnInit, OnDestroy, HostListener, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { catchError, of, Subscription } from 'rxjs';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { LanguageService } from '../../../core/services/language.service';
import { Education } from '../../../core/models';
import {
  SkeletonLoaderComponent,
  LocalizePipe,
} from '../../../shared';

import { AnimateOnScrollModule } from 'primeng/animateonscroll';

export type EducationCategoryFilter = 'all' | 'higher' | 'secondary';

export interface EducationCascadeItem {
  id: EducationCategoryFilter;
  name: string;
  cname: string;
  nameKh: string;
  cnameKh: string;
}

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    CascadeSelectModule,
    SkeletonLoaderComponent,
    LocalizePipe,
    AnimateOnScrollModule,
  ],
  template: `
    <div class="relative py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <!-- Ambient Lighting Background Decor -->
      <div class="absolute -top-20 left-1/2 -translate-x-1/2 w-[32rem] h-80 bg-gradient-to-tr from-indigo-500/15 via-purple-500/10 to-transparent dark:from-indigo-500/10 dark:via-purple-500/5 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <!-- Hero Header Section with Entrance Animation -->
      <header class="space-y-6 animate-fade-in-up">
        <div class="max-w-3xl space-y-5">
          <!-- Badge -->
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 backdrop-blur-sm shadow-2xs">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M12 14l9-5-9-5-9 5 9 5z" />
              <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
            </svg>
            <span>{{ isKhmer() ? 'ប្រវត្តិការសិក្សា & សញ្ញាបត្រ' : 'Academic Foundation & Education' }}</span>
          </div>

          <h1 class="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {{ isKhmer() ? 'ការអប់រំ និងសមិទ្ធផលសិក្សា' : 'Education & Academic Journey' }}
          </h1>

          <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl" [class.font-khmer]="isKhmer()">
            {{ isKhmer()
              ? 'គ្រឹះទ្រឹស្តីវិទ្យាសាស្ត្រកុំព្យូទ័រ សមិទ្ធផលសិក្សាឆ្នើម តួនាទីដឹកនាំក្នុងសាកលវិទ្យាល័យ និងគម្រោងសិក្សាជាក់ស្តែងដែលពង្រឹងជំនាញវិស្វកម្មសូហ្វវែរ។'
              : 'Formal academic background in Computer Science and Software Engineering, scholarly achievements, academic projects, and student leadership roles.'
            }}
          </p>
        </div>

        <!-- Quick Summary Cards (Pure Academic Snapshot) -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-1 w-full">
          <!-- Stat 1: Current Status -->
          <div class="p-3.5 sm:p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs backdrop-blur-sm flex flex-col justify-between gap-2 transition-all hover:border-slate-300 dark:hover:border-slate-700">
            <div>
              <div class="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span class="whitespace-nowrap">{{ isKhmer() ? 'ស្ថានភាពសិក្សា' : 'Active Status' }}</span>
              </div>
              <div class="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-1 leading-snug whitespace-nowrap">
                {{ isKhmer() ? 'ឆ្នាំទី ៤ (Senior)' : 'Year 4 Senior' }}
              </div>
            </div>
            <div class="text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
              Norton University
            </div>
          </div>

          <!-- Stat 2: Major / Field -->
          <div class="p-3.5 sm:p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs backdrop-blur-sm flex flex-col justify-between gap-2 transition-all hover:border-slate-300 dark:hover:border-slate-700">
            <div>
              <div class="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <span class="whitespace-nowrap">{{ isKhmer() ? 'ជំនាញឯកទេស' : 'Major Discipline' }}</span>
              </div>
              <div class="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-1 leading-snug whitespace-nowrap">
                Computer Science
              </div>
            </div>
            <div class="text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
              {{ isKhmer() ? 'វិទ្យាសាស្ត្រកុំព្យូទ័រ' : 'B.S. Program' }}
            </div>
          </div>

          <!-- Stat 3: Leadership & Honors -->
          <div class="p-3.5 sm:p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs backdrop-blur-sm flex flex-col justify-between gap-2 transition-all hover:border-slate-300 dark:hover:border-slate-700">
            <div>
              <div class="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <span class="whitespace-nowrap">{{ isKhmer() ? 'ភាពជាអ្នកដឹកនាំ' : 'Leadership' }}</span>
              </div>
              <div class="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-1 leading-snug whitespace-nowrap">
                {{ isKhmer() ? 'អនុប្រធានថ្នាក់' : 'Class Vice President' }}
              </div>
            </div>
            <div class="text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
              {{ isKhmer() ? 'ឆ្នាំ ២០២៤ - ២០២៥' : 'Academic 2024–2025' }}
            </div>
          </div>

          <!-- Stat 4: Academic Levels -->
          <div class="p-3.5 sm:p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs backdrop-blur-sm flex flex-col justify-between gap-2 transition-all hover:border-slate-300 dark:hover:border-slate-700">
            <div>
              <div class="text-xs font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span class="whitespace-nowrap">{{ isKhmer() ? 'កម្រិតសិក្សា' : 'Milestones' }}</span>
              </div>
              <div class="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-1 leading-snug whitespace-nowrap">
                {{ education().length }}
              </div>
            </div>
            <div class="text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
              {{ isKhmer() ? 'កម្រិតមធ្យម & ឧត្តម' : 'Higher & Secondary' }}
            </div>
          </div>
        </div>
      </header>

      <!-- Clean Filter & Instant Search Bar -->
      <section class="space-y-4 animate-fade-in-up delay-150">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-2 rounded-2xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/60 backdrop-blur-md">
          <!-- Segmented Filter Pills (Desktop >= 1024px) -->
          <div class="hidden lg:flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Education Categories">
            @for (tab of categoryOptions; track tab.value) {
              <button
                type="button"
                role="tab"
                [attr.aria-selected]="selectedCategory() === tab.value"
                (click)="setCategory(tab.value)"
                class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 cursor-pointer"
                [ngClass]="{
                  'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm border border-slate-200/90 dark:border-slate-700 font-bold': selectedCategory() === tab.value,
                  'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60 border border-transparent': selectedCategory() !== tab.value
                }"
              >
                <span>{{ isKhmer() ? tab.labelKh : tab.labelEn }}</span>
                <span
                  class="px-1.5 py-0.5 rounded-full text-[11px] font-bold"
                  [ngClass]="{
                    'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300': selectedCategory() === tab.value,
                    'bg-slate-200/70 dark:bg-slate-700 text-slate-600 dark:text-slate-400': selectedCategory() !== tab.value
                  }"
                >
                  {{ getTabCount(tab.value) }}
                </span>
              </button>
            }
          </div>

          <!-- Mobile & Tablet Responsive Dropdown (< 1024px) -->
          <div class="lg:hidden w-full flex-1">
            <p-cascadeselect
              [ngModel]="selectedCascadeItem()"
              (ngModelChange)="onCascadeChange({ value: $event })"
              [options]="cascadeCategories()"
              [optionLabel]="isKhmer() ? 'cnameKh' : 'cname'"
              [placeholder]="isKhmer() ? 'ជ្រើសរើសកម្រិតសិក្សា...' : 'All History'"
              [showClear]="true"
              appendTo="body"
              (onChange)="onCascadeChange($event)"
              (onClear)="onCascadeClear()"
              styleClass="w-full portfolio-cascadeselect"
              [style]="{ width: '100%', minWidth: '14rem' }"
              inputId="education-cascadeselect"
              ariaLabel="Select an Education Level"
            />
          </div>

          <!-- Instant Search Input -->
          <div class="relative w-full lg:w-80 flex-shrink-0">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              [value]="searchQuery()"
              (input)="onSearchInput($event)"
              [placeholder]="isKhmer() ? 'ស្វែងរកសាកលវិទ្យាល័យ ជំនាញ ឬសកម្មភាព...' : 'Search institution, major, activities...'"
              class="w-full pl-10 pr-9 py-2 rounded-xl text-sm bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-2xs"
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
      </section>

      <!-- Main Education Content Area -->
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
      } @else if (filteredEducation().length === 0) {
        <!-- Empty / No Filter Results State -->
        <div class="p-12 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 space-y-4">
          <div class="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 class="text-base font-bold text-slate-900 dark:text-white">
            {{ isKhmer() ? 'រកមិនឃើញទិន្នន័យត្រូវគ្នានឹងការស្វែងរកទេ' : 'No matching records found' }}
          </h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {{ isKhmer() ? 'សូមសាកល្បងពាក្យគន្លឹះផ្សេងទៀត ឬជម្រះតម្រងស្វែងរក។' : 'Try adjusting your search query or switching categories.' }}
          </p>
          <button
            type="button"
            (click)="resetFilters()"
            class="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            {{ isKhmer() ? 'ជម្រះតម្រងទាំងអស់' : 'Reset All Filters' }}
          </button>
        </div>
      } @else {
        <!-- CLEAN ACADEMIC JOURNEY TIMELINE -->
        <section class="space-y-8" aria-label="Academic Journey Timeline">
          <div class="relative pl-6 sm:pl-10 space-y-12">
            <!-- Chronological Spine Track -->
            <div class="absolute top-4 bottom-4 left-2.5 sm:left-4.5 w-0.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-slate-200 dark:to-slate-800"></div>

            @for (edu of filteredEducation(); track edu._id; let idx = $index) {
              <div class="relative group">
                <!-- Milestone Timeline Node Icon -->
                <div
                  class="absolute -left-6 sm:-left-10 top-6 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-white dark:border-slate-950 flex items-center justify-center transition-transform duration-300 group-hover:scale-125"
                  [ngClass]="{
                    'bg-indigo-600 text-white shadow-md shadow-indigo-500/40 ring-4 ring-indigo-50 dark:ring-indigo-950/60': isCurrentlyStudying(edu),
                    'bg-slate-400 dark:bg-slate-600 text-white ring-2 ring-slate-100 dark:ring-slate-800': !isCurrentlyStudying(edu)
                  }"
                >
                  @if (isCurrentlyStudying(edu)) {
                    <span class="w-2 h-2 rounded-full bg-white animate-ping"></span>
                  } @else {
                    <span class="w-1.5 h-1.5 rounded-full bg-white"></span>
                  }
                </div>

                <!-- Clean Card Container -->
                <article
                  pAnimateOnScroll
                  [once]="true"
                  [threshold]="0.08"
                  enterClass="animate-enter fade-in-0 slide-in-from-b-8 animate-duration-700"
                  leaveClass="animate-leave fade-out-0"
                  class="card-interactive relative rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-6 sm:p-8 md:p-9 shadow-sm hover:shadow-xl hover:border-indigo-400/50 dark:hover:border-indigo-500/50 transition-all duration-300 space-y-6"
                >
                  <!-- Header Section: Institution, Degree, Period, Status -->
                  <div class="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800/80">
                    <!-- Degree & Institution Details -->
                    <div class="space-y-1.5">
                      <div class="flex flex-wrap items-center gap-2">
                        <span class="px-2.5 py-0.5 rounded-lg text-[11px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
                          {{ edu.degree | localize }}
                        </span>

                        @if (isCurrentlyStudying(edu)) {
                          <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span>{{ isKhmer() ? 'កំពុងសិក្សា (ឆ្នាំទី ៤)' : 'Current Student • Year 4' }}</span>
                          </span>
                        }
                      </div>

                      <h2 class="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        {{ edu.field | localize }}
                      </h2>

                      <!-- Institution Name & Campus Location -->
                      <div class="flex items-center gap-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 font-semibold">
                        <svg class="w-4 h-4 text-indigo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span class="leading-snug">{{ edu.institution | localize }}</span>
                      </div>
                    </div>

                    <!-- Right Column: Year Range & GPA Pill -->
                    <div class="flex flex-wrap lg:flex-col items-start lg:items-end gap-2.5 flex-shrink-0">
                      <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200/60 dark:border-slate-700/60 shadow-2xs whitespace-nowrap shrink-0">
                        <svg class="w-3.5 h-3.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{{ formatYearRange(edu) }}</span>
                      </div>

                      @if (edu.gpa) {
                        <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-800/60 shadow-2xs">
                          <svg class="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span>GPA: {{ edu.gpa }}</span>
                        </div>
                      }
                    </div>
                  </div>

                  <!-- Narrative & Focus Description -->
                  @if (edu.description) {
                    <div class="space-y-2">
                      <p class="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed" [class.font-khmer]="isKhmer()">
                        {{ edu.description | localize }}
                      </p>
                    </div>
                  }

                  <!-- Core Coursework & Knowledge Pillars (for Higher Education) -->
                  @if (isCurrentlyStudying(edu)) {
                    <div class="space-y-2 pt-1">
                      <span class="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        {{ isKhmer() ? 'មុខវិជ្ជាស្នូល និងជំនាញអនុវត្ត' : 'Core Focus & Technical Pillars' }}
                      </span>
                      <div class="flex flex-wrap gap-2">
                        <span class="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                          Software Development & Engineering
                        </span>
                        <span class="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                          Full-Stack Web Systems & Architecture
                        </span>
                        <span class="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                          Data Structures & Algorithms
                        </span>
                        <span class="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                          Database Management & System Design
                        </span>
                      </div>
                    </div>
                  }

                  <!-- Scholastic Honors, Leadership & Activities -->
                  @if (getActivities(edu).length > 0) {
                    <div class="rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border-l-4 border-indigo-500 p-4 sm:p-5 space-y-3">
                      <h3 class="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 flex items-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        <span>{{ isKhmer() ? 'សកម្មភាពភាពជាអ្នកដឹកនាំ និងគម្រោងសិក្សា' : 'Leadership, Scholastic Honors & Projects' }}</span>
                      </h3>

                      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        @for (act of getActivities(edu); track act) {
                          <div class="flex items-start gap-3 p-3 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/70 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 shadow-2xs">
                            <span class="w-5 h-5 rounded-lg bg-indigo-100 dark:bg-indigo-900/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-black">
                              ✓
                            </span>
                            <span class="leading-relaxed font-medium" [class.font-khmer]="isKhmer()">{{ act }}</span>
                          </div>
                        }
                      </div>
                    </div>
                  }
                </article>
              </div>
            }
          </div>
        </section>
      }

      <!-- Bottom Next Steps Navigation Banner -->
      <section
        pAnimateOnScroll
        [once]="true"
        [threshold]="0.1"
        enterClass="animate-enter fade-in-0 slide-in-from-b-8 animate-duration-700"
        leaveClass="animate-leave fade-out-0"
        class="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-100 to-indigo-50/30 dark:from-slate-900 dark:to-indigo-950/20 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm"
      >
        <div class="space-y-2 max-w-xl">
          <div class="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>{{ isKhmer() ? 'ជំហានបន្ទាប់' : 'Next In Portfolio' }}</span>
          </div>
          <h2 class="text-xl sm:text-2xl font-bold tracking-tight">
            {{ isKhmer() ? 'ចង់ស្វែងយល់បន្ថែមអំពីបទពិសោធន៍ ឬគម្រោង?' : 'Explore hands-on experience and software projects' }}
          </h2>
          <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {{ isKhmer()
              ? 'ចូលទៅកាន់ទំព័របទពិសោធន៍ដើម្បីមើលតួនាទីជាក់ស្តែង ឬពិនិត្យមើលគម្រោងសូហ្វវែរទាំងអស់។'
              : 'Browse my professional timeline, engineering roles, or check the portfolio of deployed full-stack applications.'
            }}
          </p>
        </div>
        <div class="flex flex-wrap gap-3">
          <a
            routerLink="/experience"
            class="px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-2xs"
          >
            {{ isKhmer() ? 'បទពិសោធន៍ការងារ' : 'Work Experience' }}
          </a>
          <a
            routerLink="/projects"
            class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-600/20 transition-all"
          >
            {{ isKhmer() ? 'មើលគម្រោងទាំងអស់' : 'View Projects' }}
          </a>
        </div>
      </section>
    </div>
  `,
})
export class EducationComponent implements OnInit, OnDestroy {
  private readonly portfolioService = inject(PortfolioService);
  private readonly languageService = inject(LanguageService);
  private syncSub?: Subscription;

  public readonly education = signal<Education[]>([]);
  public readonly isLoading = signal<boolean>(true);
  public readonly error = signal<string | null>(null);

  public readonly selectedCategory = signal<EducationCategoryFilter>('all');
  public readonly searchQuery = signal<string>('');

  public readonly isKhmer = computed(() => this.languageService.currentLang() === 'kh');

  public readonly categoryOptions = [
    { value: 'all' as const, labelEn: 'All History', labelKh: 'ប្រវត្តិទាំងអស់' },
    { value: 'higher' as const, labelEn: 'Higher Education', labelKh: 'ឧត្តមសិក្សា' },
    { value: 'secondary' as const, labelEn: 'Secondary School', labelKh: 'មធ្យមសិក្សា' },
  ];

  public readonly cascadeCategories = computed<EducationCascadeItem[]>(() => [
    {
      id: 'all',
      name: `All History (${this.getTabCount('all')})`,
      cname: `All History (${this.getTabCount('all')})`,
      nameKh: `ប្រវត្តិទាំងអស់ (${this.getTabCount('all')})`,
      cnameKh: `ប្រវត្តិទាំងអស់ (${this.getTabCount('all')})`,
    },
    {
      id: 'higher',
      name: `Higher Education (${this.getTabCount('higher')})`,
      cname: `Higher Education (${this.getTabCount('higher')})`,
      nameKh: `ឧត្តមសិក្សា (${this.getTabCount('higher')})`,
      cnameKh: `ឧត្តមសិក្សា (${this.getTabCount('higher')})`,
    },
    {
      id: 'secondary',
      name: `Secondary School (${this.getTabCount('secondary')})`,
      cname: `Secondary School (${this.getTabCount('secondary')})`,
      nameKh: `មធ្យមសិក្សា (${this.getTabCount('secondary')})`,
      cnameKh: `មធ្យមសិក្សា (${this.getTabCount('secondary')})`,
    },
  ]);

  public readonly selectedCascadeItem = computed<EducationCascadeItem | null>(() => {
    const current = this.selectedCategory();
    const list = this.cascadeCategories();
    return list.find((item) => item.id === current) || null;
  });

  public readonly filteredEducation = computed(() => {
    let list = this.education();
    const cat = this.selectedCategory();
    const query = this.searchQuery().toLowerCase().trim();

    if (cat === 'higher') {
      list = list.filter((edu) => this.isHigherEducation(edu));
    } else if (cat === 'secondary') {
      list = list.filter((edu) => !this.isHigherEducation(edu));
    }

    if (query) {
      list = list.filter((edu) => {
        const instEn = edu.institution?.en?.toLowerCase() || '';
        const instKh = edu.institution?.kh?.toLowerCase() || '';
        const degEn = edu.degree?.en?.toLowerCase() || '';
        const degKh = edu.degree?.kh?.toLowerCase() || '';
        const fieldEn = edu.field?.en?.toLowerCase() || '';
        const fieldKh = edu.field?.kh?.toLowerCase() || '';
        const descEn = edu.description?.en?.toLowerCase() || '';
        const descKh = edu.description?.kh?.toLowerCase() || '';
        const acts = [...(edu.activities?.en || []), ...(edu.activities?.kh || [])]
          .join(' ')
          .toLowerCase();

        return (
          instEn.includes(query) ||
          instKh.includes(query) ||
          degEn.includes(query) ||
          degKh.includes(query) ||
          fieldEn.includes(query) ||
          fieldKh.includes(query) ||
          descEn.includes(query) ||
          descKh.includes(query) ||
          acts.includes(query)
        );
      });
    }

    return list;
  });

  public ngOnInit(): void {
    this.loadEducationData();
    if (this.portfolioService?.dataMutated$) {
      this.syncSub = this.portfolioService.dataMutated$.subscribe((mutation) => {
        if (!mutation.type || mutation.type === 'education') {
          this.loadEducationData();
        }
      });
    }
  }

  @HostListener('window:focus')
  public onWindowFocus(): void {
    this.loadEducationData();
  }

  public ngOnDestroy(): void {
    this.syncSub?.unsubscribe();
  }

  public loadEducationData(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.portfolioService
      .getEducation()
      .pipe(catchError(() => of(null)))
      .subscribe({
        next: (res) => {
          if (res && res.data) {
            const list = Array.isArray(res.data)
              ? [...res.data].sort((a, b) => (b.startYear || 0) - (a.startYear || 0))
              : [];
            this.education.set(list);
          } else {
            this.education.set([]);
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

  public isHigherEducation(edu: Education): boolean {
    const deg = (edu.degree?.en || '').toLowerCase();
    const inst = (edu.institution?.en || '').toLowerCase();
    return (
      deg.includes('bachelor') ||
      deg.includes('student') ||
      deg.includes('university') ||
      inst.includes('university') ||
      edu.order === 1 ||
      (edu.startYear || 0) >= 2022
    );
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

  public getInstitutionInitials(edu: Education): string {
    const name = edu.institution?.en || '';
    if (name.includes('Norton')) return 'NU';
    if (name.includes('Peamchikang')) return 'HS';
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  public getActivities(edu: Education): string[] {
    if (this.isKhmer() && edu.activities?.kh && edu.activities.kh.length > 0) {
      return edu.activities.kh;
    }
    return edu.activities?.en || [];
  }

  public setCategory(cat: EducationCategoryFilter): void {
    this.selectedCategory.set(cat);
  }

  public onCascadeChange(event: { value?: EducationCascadeItem | null }): void {
    const item = event?.value;
    if (!item || item.id === 'all') {
      this.setCategory('all');
    } else {
      this.setCategory(item.id);
    }
  }

  public onCascadeClear(): void {
    this.setCategory('all');
  }

  public onSearchInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.searchQuery.set(val);
  }

  public clearSearch(): void {
    this.searchQuery.set('');
  }

  public resetFilters(): void {
    this.selectedCategory.set('all');
    this.searchQuery.set('');
  }

  public getTabCount(tab: EducationCategoryFilter): number {
    if (tab === 'all') {
      return this.education().length;
    }
    if (tab === 'higher') {
      return this.education().filter((e) => this.isHigherEducation(e)).length;
    }
    if (tab === 'secondary') {
      return this.education().filter((e) => !this.isHigherEducation(e)).length;
    }
    return 0;
  }
}

