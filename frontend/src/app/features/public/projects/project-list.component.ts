import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { of, catchError } from 'rxjs';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { LanguageService } from '../../../core/services/language.service';
import { Project, Category } from '../../../core/models';
import {
  ProjectCardComponent,
  PaginationComponent,
  SkeletonLoaderComponent,
  LocalizePipe,
} from '../../../shared';

import { AnimateOnScrollModule } from 'primeng/animateonscroll';

export type ProjectViewMode = 'grid' | 'list';

export interface ProjectCascadeItem {
  id: string;
  name: string;
  cname: string;
  nameKh: string;
  cnameKh: string;
}

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    CascadeSelectModule,
    ProjectCardComponent,
    PaginationComponent,
    SkeletonLoaderComponent,
    LocalizePipe,
    AnimateOnScrollModule,
  ],
  template: `
    <div class="relative py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <!-- Ambient Lighting Background Decor -->
      <div class="absolute -top-20 left-1/2 -translate-x-1/2 w-[32rem] h-80 bg-gradient-to-tr from-indigo-500/15 via-purple-500/10 to-transparent dark:from-indigo-500/10 dark:via-purple-500/5 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <!-- Page Header with Entrance Animation -->
      <header class="space-y-6 animate-fade-in-up">
        <div class="max-w-3xl space-y-5">
          <!-- Badge -->
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 backdrop-blur-sm shadow-2xs">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span>{{ isKhmer() ? 'ផលប័ត្រគម្រោង & ករណីសិក្សា' : 'Featured Portfolio & Case Studies' }}</span>
          </div>

          <h1 class="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {{ isKhmer() ? 'គម្រោងវិស្វកម្ម និងដំណោះស្រាយឌីជីថល' : 'Projects & Digital Solutions' }}
          </h1>

          <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl" [class.font-khmer]="isKhmer()">
            {{ isKhmer()
              ? 'បណ្តុំនៃកម្មវិធីពេញលេញ (Full-Stack) ប្រព័ន្ធ AI ឆ្លាតវៃ និងស្ថាបត្យកម្មកុំព្យូទ័រពពក ដែលខ្ញុំបានអភិវឌ្ឍឡើងជាមួយនឹងស្តង់ដារវិស្វកម្មខ្ពស់។'
              : 'Production web applications, computer vision systems, full-stack platforms, and architectural solutions built with modern technology.'
            }}
          </p>
        </div>

        <!-- Quick Summary Cards (Clean Portfolio Snapshot) -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-1 w-full">
          <!-- Stat 1: Total Projects -->
          <div class="p-3.5 sm:p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs backdrop-blur-sm flex flex-col justify-between gap-2 transition-all hover:border-slate-300 dark:hover:border-slate-700">
            <div>
              <div class="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
                <span class="whitespace-nowrap">{{ isKhmer() ? 'គម្រោងសរុប' : 'Total Projects' }}</span>
              </div>
              <div class="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-1 leading-snug whitespace-nowrap">
                {{ totalItems() }} {{ isKhmer() ? 'គម្រោង' : 'Applications' }}
              </div>
            </div>
            <div class="text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
              {{ isKhmer() ? 'បានបញ្ចេញផ្លូវការ' : 'Verified & Deployed' }}
            </div>
          </div>

          <!-- Stat 2: Featured Highlights -->
          <div class="p-3.5 sm:p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs backdrop-blur-sm flex flex-col justify-between gap-2 transition-all hover:border-slate-300 dark:hover:border-slate-700">
            <div>
              <div class="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <span class="whitespace-nowrap">{{ isKhmer() ? 'គម្រោងឆ្នើម' : 'Featured' }}</span>
              </div>
              <div class="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-1 leading-snug whitespace-nowrap">
                {{ featuredCount() }} {{ isKhmer() ? 'គម្រោងសំខាន់' : 'Case Studies' }}
              </div>
            </div>
            <div class="text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
              {{ isKhmer() ? 'ស្ថាបត្យកម្មលម្អិត' : 'In-Depth Architecture' }}
            </div>
          </div>

          <!-- Stat 3: Tech Ecosystem -->
          <div class="p-3.5 sm:p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs backdrop-blur-sm flex flex-col justify-between gap-2 transition-all hover:border-slate-300 dark:hover:border-slate-700">
            <div>
              <div class="text-xs font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <span class="whitespace-nowrap">{{ isKhmer() ? 'បច្ចេកវិទ្យា' : 'Tech Stack' }}</span>
              </div>
              <div class="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-1 leading-snug whitespace-nowrap">
                {{ technologies().length || 10 }}+ {{ isKhmer() ? 'បច្ចេកវិទ្យា' : 'Libraries & Tools' }}
              </div>
            </div>
            <div class="text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
              {{ isKhmer() ? 'Full-Stack & Cloud' : 'Full-Stack & AI Stack' }}
            </div>
          </div>

          <!-- Stat 4: Production Live Status -->
          <div class="p-3.5 sm:p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs backdrop-blur-sm flex flex-col justify-between gap-2 transition-all hover:border-slate-300 dark:hover:border-slate-700">
            <div>
              <div class="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span class="whitespace-nowrap">{{ isKhmer() ? 'ការដាក់ដំណើរការ' : 'Deployment' }}</span>
              </div>
              <div class="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-1 leading-snug whitespace-nowrap">
                100% Live & Tested
              </div>
            </div>
            <div class="text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
              {{ isKhmer() ? 'បើកជាសាធារណៈ' : 'Open Source & Web' }}
            </div>
          </div>
        </div>
      </header>

      <!-- Unified Filter & Command Bar Section with Stagger Entrance -->
      <section class="space-y-4 animate-fade-in-up delay-150">
        <!-- Main Bar: Category Tabs & Search Input & View Switcher -->
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-2 rounded-2xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/60 backdrop-blur-md">
          <!-- Primary Category Pills (Desktop >= 1024px) -->
          <div class="hidden lg:flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Project Categories">
            <button
              type="button"
              role="tab"
              [attr.aria-selected]="selectedCategory() === 'all'"
              (click)="onCategorySelect('all')"
              class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 cursor-pointer"
              [ngClass]="{
                'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm border border-slate-200/90 dark:border-slate-700 font-bold': selectedCategory() === 'all',
                'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60 border border-transparent': selectedCategory() !== 'all'
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
                class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 cursor-pointer"
                [ngClass]="{
                  'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm border border-slate-200/90 dark:border-slate-700 font-bold': selectedCategory() === cat.slug,
                  'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60 border border-transparent': selectedCategory() !== cat.slug
                }"
              >
                <span>{{ cat.name | localize }}</span>
              </button>
            }
          </div>

          <!-- Mobile & Tablet Responsive PrimeNG CascadeSelect (Visible < 1024px) -->
          <div class="lg:hidden w-full flex-1">
            <p-cascadeselect
              [ngModel]="selectedCascadeItem()"
              (ngModelChange)="onCascadeChange({ value: $event })"
              [options]="cascadeCategories()"
              [optionLabel]="isKhmer() ? 'cnameKh' : 'cname'"
              [placeholder]="isKhmer() ? 'ជ្រើសរើសប្រភេទគម្រោង...' : 'All Projects'"
              [showClear]="true"
              appendTo="body"
              (onChange)="onCascadeChange($event)"
              (onClear)="onCascadeClear()"
              styleClass="w-full portfolio-cascadeselect"
              [style]="{ width: '100%', minWidth: '14rem' }"
              inputId="project-cascadeselect"
              ariaLabel="Select a Project Category"
            />
          </div>

          <!-- Controls: Search Input & View Mode Switcher -->
          <div class="flex items-center gap-2.5 w-full lg:w-auto">
            <!-- Search Input -->
            <div class="relative flex-1 lg:w-72">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                [value]="searchQuery()"
                (input)="onSearchInput($event)"
                [placeholder]="isKhmer() ? 'ស្វែងរកគម្រោង...' : 'Search projects...'"
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

            <!-- View Mode Switcher -->
            <div class="flex items-center gap-1 p-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs flex-shrink-0">
              <button
                type="button"
                (click)="setViewMode('grid')"
                [title]="isKhmer() ? 'ទម្រង់ក្រឡា (Grid)' : 'Grid View'"
                class="p-1.5 rounded-lg transition-all"
                [ngClass]="{
                  'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold': viewMode() === 'grid',
                  'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200': viewMode() !== 'grid'
                }"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>

              <button
                type="button"
                (click)="setViewMode('list')"
                [title]="isKhmer() ? 'ទម្រង់បញ្ជី (List)' : 'List View'"
                class="p-1.5 rounded-lg transition-all"
                [ngClass]="{
                  'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold': viewMode() === 'list',
                  'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200': viewMode() !== 'list'
                }"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Active Filters Feedback & Quick Reset -->
        @if (hasActiveFilters()) {
          <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-indigo-50/50 dark:bg-indigo-950/20 px-4 py-2.5 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
            <div class="flex items-center gap-1.5 flex-wrap">
              <span>{{ isKhmer() ? 'លទ្ធផល' : 'Results:' }}</span>
              <strong class="text-indigo-600 dark:text-indigo-400">{{ totalItems() }}</strong>
              <span>{{ isKhmer() ? 'គម្រោងត្រូវគ្នានឹងតម្រង' : 'matching project(s)' }}</span>
            </div>
            <button
              type="button"
              (click)="resetFilters()"
              class="text-indigo-600 dark:text-indigo-400 hover:underline font-bold"
            >
              {{ isKhmer() ? 'កំណត់តម្រងឡើងវិញ' : 'Reset all filters' }}
            </button>
          </div>
        }
      </section>

      <!-- Projects Content Display -->
      @if (isLoading()) {
        <!-- Skeleton Loading State -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          @for (idx of [1, 2, 3, 4, 5, 6]; track idx) {
            <div class="p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
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
        <!-- Clean Empty State -->
        <div class="p-12 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 space-y-4 max-w-lg mx-auto">
          <div class="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white">
            {{ isKhmer() ? 'រកមិនឃើញគម្រោងត្រូវគ្នានឹងការស្វែងរកទេ' : 'No matching projects found' }}
          </h3>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
            {{ isKhmer() ? 'មិនមានគម្រោងត្រូវគ្នានឹងពាក្យគន្លឹះ ឬប្រភេទដែលបានជ្រើសរើសឡើយ។' : 'No projects matched your criteria. Try adjusting your filters or search term.' }}
          </p>
          <button
            type="button"
            (click)="resetFilters()"
            class="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            {{ isKhmer() ? 'ជម្រះតម្រងទាំងអស់' : 'Reset All Filters' }}
          </button>
        </div>
      } @else {
        <!-- ================= PROJECTS DISPLAY (GRID vs LIST) ================= -->
        @if (viewMode() === 'grid') {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            @for (project of projects(); track project._id) {
              <div
                pAnimateOnScroll
                [once]="true"
                [threshold]="0.08"
                enterClass="animate-enter fade-in-0 slide-in-from-b-8 animate-duration-700"
                leaveClass="animate-leave fade-out-0"
                class="h-full"
              >
                <app-project-card [project]="project" [viewMode]="'grid'"></app-project-card>
              </div>
            }
          </div>
        } @else {
          <div class="flex flex-col space-y-6">
            @for (project of projects(); track project._id) {
              <div
                pAnimateOnScroll
                [once]="true"
                [threshold]="0.08"
                enterClass="animate-enter fade-in-0 slide-in-from-b-8 animate-duration-700"
                leaveClass="animate-leave fade-out-0"
                class="w-full"
              >
                <app-project-card [project]="project" [viewMode]="'list'"></app-project-card>
              </div>
            }
          </div>
        }

        <!-- Pagination Controls -->
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
            {{ isKhmer() ? 'ចង់ស្វែងយល់បន្ថែមអំពីបទពិសោធន៍ ឬការសិក្សា?' : 'Explore career timeline or academic background' }}
          </h2>
          <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {{ isKhmer()
              ? 'ចូលទៅកាន់ទំព័របទពិសោធន៍ដើម្បីមើលតួនាទីជាក់ស្តែង ឬពិនិត្យមើលប្រវត្តិសិក្សានៅសាកលវិទ្យាល័យ។'
              : 'Browse my professional timeline, engineering roles, or check academic coursework and leadership milestones.'
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
            routerLink="/education"
            class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-600/20 transition-all"
          >
            {{ isKhmer() ? 'ប្រវត្តិការសិក្សា' : 'Academic Journey' }}
          </a>
        </div>
      </section>
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
  public readonly searchQuery = signal<string>('');
  public readonly viewMode = signal<ProjectViewMode>('grid');

  public readonly isLoading = signal<boolean>(true);
  public readonly error = signal<string | null>(null);

  public readonly isKhmer = computed(() => this.languageService.currentLang() === 'kh');

  public readonly featuredCount = computed<number>(() => {
    return this.projects().filter((p) => p.featured).length;
  });

  public readonly hasActiveFilters = computed<boolean>(() => {
    return (
      this.selectedCategory() !== 'all' ||
      !!this.searchQuery().trim()
    );
  });

  public readonly cascadeCategories = computed<ProjectCascadeItem[]>(() => {
    const cats = this.categories();
    const items: ProjectCascadeItem[] = [
      {
        id: 'all',
        name: 'All Projects',
        cname: 'All Projects',
        nameKh: 'គម្រោងទាំងអស់',
        cnameKh: 'គម្រោងទាំងអស់',
      },
    ];
    for (const cat of cats) {
      const en = cat.name?.en || cat.slug;
      const kh = cat.name?.kh || en;
      items.push({
        id: cat.slug,
        name: en,
        cname: en,
        nameKh: kh,
        cnameKh: kh,
      });
    }
    return items;
  });

  public readonly selectedCascadeItem = computed<ProjectCascadeItem | null>(() => {
    const current = this.selectedCategory();
    const list = this.cascadeCategories();
    return list.find((item) => item.id === current) || null;
  });

  public ngOnInit(): void {
    // Read query parameters from URL
    this.route.queryParams.subscribe((params) => {
      if (params['category']) {
        this.selectedCategory.set(params['category']);
      }
      if (params['search']) {
        this.searchQuery.set(params['search']);
      }
      if (params['view'] === 'list' || params['view'] === 'grid') {
        this.viewMode.set(params['view']);
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

  public setViewMode(mode: ProjectViewMode): void {
    this.viewMode.set(mode);
    this.updateUrlParams();
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
      search?: string;
    } = {
      page: this.currentPage(),
      limit: this.pageSize(),
    };

    if (this.selectedCategory() !== 'all') {
      params.category = this.selectedCategory();
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

  public onCascadeChange(event: { value?: ProjectCascadeItem | null }): void {
    const item = event?.value;
    if (!item || item.id === 'all') {
      this.onCategorySelect('all');
    } else {
      this.onCategorySelect(item.id);
    }
  }

  public onCascadeClear(): void {
    this.onCategorySelect('all');
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

    const q = this.searchQuery().trim();
    if (q) {
      queryParams['search'] = q;
    } else {
      queryParams['search'] = null;
    }

    if (this.viewMode() !== 'grid') {
      queryParams['view'] = this.viewMode();
    } else {
      queryParams['view'] = null;
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
