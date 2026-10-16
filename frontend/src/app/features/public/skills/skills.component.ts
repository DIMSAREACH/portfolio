import { Component, OnInit, inject, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CascadeSelectModule } from 'primeng/cascadeselect';
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

export interface CascadeSkillItem {
  id: string;
  name: string;
  cname: string;
  nameKh: string;
  cnameKh: string;
  type: 'all' | 'category' | 'skill';
  count?: number;
  skills?: CascadeSkillItem[];
}

import { AnimateOnScrollModule } from 'primeng/animateonscroll';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    CascadeSelectModule,
    SkeletonLoaderComponent,
    EmptyStateComponent,
    AnimateOnScrollModule,
  ],
  styles: [
    `
      :host ::ng-deep .portfolio-cascadeselect {
        width: 100% !important;
        border-radius: 1rem !important;
        border-color: rgba(226, 232, 240, 0.8) !important;
        background-color: rgba(241, 245, 249, 0.9) !important;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
        font-size: 0.875rem !important;
        font-weight: 600 !important;
        transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
      }
      :host-context(.dark) ::ng-deep .portfolio-cascadeselect {
        background-color: rgba(30, 41, 59, 0.9) !important;
        border-color: rgba(51, 65, 85, 0.8) !important;
        color: #f1f5f9 !important;
      }
      :host ::ng-deep .portfolio-cascadeselect:hover {
        border-color: #818cf8 !important;
      }
      :host ::ng-deep .portfolio-cascadeselect.p-focus {
        border-color: #6366f1 !important;
        box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.25) !important;
      }
      :host ::ng-deep .portfolio-cascadeselect .p-cascadeselect-label {
        padding: 0.625rem 0.875rem !important;
        font-weight: 600 !important;
      }
      :host ::ng-deep .portfolio-cascadeselect .p-cascadeselect-clear-icon {
        color: #94a3b8 !important;
        cursor: pointer !important;
        transition: color 0.15s ease !important;
      }
      :host ::ng-deep .portfolio-cascadeselect .p-cascadeselect-clear-icon:hover {
        color: #ef4444 !important;
      }
      :host ::ng-deep .p-cascadeselect-overlay {
        border-radius: 1rem !important;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1) !important;
        backdrop-filter: blur(16px) !important;
      }
      :host-context(.dark) ::ng-deep .p-cascadeselect-overlay {
        background: rgba(15, 23, 42, 0.96) !important;
        border: 1px solid rgba(51, 65, 85, 0.8) !important;
      }
    `,
  ],
  template: `
    <div class="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <!-- Page Header with Entrance Animation -->
      <section class="space-y-4 max-w-3xl animate-fade-in-up">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 shadow-2xs">
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
            ? 'បណ្តុំនៃភាសាសរសេរកូដ ក្របខ័ណ្ឌការងារ និងឧបករណ៍ទំនើបៗដែលខ្ញុំប្រើប្រាស់ក្នុងការកសាងដំណោះស្រាយឌីជីថលប្រកបដោយប្រសិទ្ធភាព និងសុវត្ថិភាព។'
            : 'A structured breakdown of my engineering capabilities, frameworks, database architectures, and development tooling applied to production systems.'
          }}
        </p>

        <!-- Stats Overview Pill Group -->
        <div class="flex flex-wrap items-center gap-3 pt-2">
          <div class="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-xs font-medium text-slate-700 dark:text-slate-300">
            <span class="font-bold text-indigo-600 dark:text-indigo-400">{{ skills().length }}</span>
            <span class="ml-1.5">{{ isKhmer() ? 'ជំនាញសរុប' : 'Total Technologies' }}</span>
          </div>
          <div class="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-xs font-medium text-slate-700 dark:text-slate-300">
            <span class="font-bold text-purple-600 dark:text-purple-400">{{ categories().length - 1 }}</span>
            <span class="ml-1.5">{{ isKhmer() ? 'ផ្នែកជំនាញ' : 'Core Disciplines' }}</span>
          </div>
          <div class="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-xs font-medium text-slate-700 dark:text-slate-300 inline-flex items-center gap-2">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span class="font-bold text-emerald-600 dark:text-emerald-400">100%</span>
            <span class="ml-1">{{ isKhmer() ? 'អនុវត្តជាក់ស្តែង' : 'Production-Ready' }}</span>
          </div>
        </div>
      </section>

      <!-- Filter Controls: Search & Category Pills with Stagger Entrance -->
      <section class="space-y-4 animate-fade-in-up delay-150">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <!-- Desktop Category Tabs/Pills (Visible on Desktop >= 1024px) -->
          <div class="hidden lg:inline-flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs" role="tablist" aria-label="Skill Categories">
            @for (cat of categories(); track cat.id) {
              <button
                type="button"
                role="tab"
                [attr.aria-selected]="selectedCategory() === cat.id"
                (click)="setCategory(cat.id)"
                class="group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 cursor-pointer"
                [ngClass]="{
                  'bg-indigo-600 text-white shadow-sm shadow-indigo-600/25': selectedCategory() === cat.id,
                  'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-700/60': selectedCategory() !== cat.id
                }"
              >
                <!-- Category SVG Icon -->
                <svg class="w-3.5 h-3.5 shrink-0 transition-opacity" [ngClass]="selectedCategory() === cat.id ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  @switch (getCategoryType(cat.id)) {
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
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    }
                  }
                </svg>
                <span>{{ isKhmer() ? cat.nameKh : cat.nameEn }}</span>
                <span
                  class="px-2 py-0.5 rounded-full text-[11px] font-bold transition-colors"
                  [ngClass]="{
                    'bg-white/20 text-white': selectedCategory() === cat.id,
                    'bg-slate-200/80 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300 group-hover:bg-white dark:group-hover:bg-slate-600 group-hover:text-slate-900 dark:group-hover:text-white': selectedCategory() !== cat.id
                  }"
                >
                  {{ cat.count }}
                </span>
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
              [optionGroupLabel]="isKhmer() ? 'nameKh' : 'name'"
              [optionGroupChildren]="['skills']"
              [placeholder]="isKhmer() ? 'ជ្រើសរើសប្រភេទបច្ចេកវិទ្យា...' : 'All Technologies'"
              [showClear]="true"
              appendTo="body"
              (onChange)="onCascadeChange($event)"
              (onClear)="onCascadeClear()"
              styleClass="w-full portfolio-cascadeselect"
              [style]="{ width: '100%', minWidth: '14rem' }"
              inputId="skill-cascadeselect"
              ariaLabel="Select a Category"
            />
          </div>

          <!-- Search Input -->
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
              [placeholder]="isKhmer() ? 'ស្វែងរកជំនាញ (ឧ. Python, React)...' : 'Search skills (e.g. Python, React)...'"
              class="w-full pl-10 pr-9 py-2 rounded-2xl text-xs sm:text-sm bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:bg-white dark:focus:bg-slate-900 transition-all shadow-2xs"
            />
            @if (searchQuery()) {
              <button
                type="button"
                (click)="clearSearch()"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
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
          <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700/40">
            <div>
              <span>{{ isKhmer() ? 'បង្ហាញ' : 'Showing' }}</span>
              <strong class="mx-1 text-slate-800 dark:text-slate-200">{{ totalFilteredCount() }}</strong>
              <span>{{ isKhmer() ? 'ក្នុងចំណោម' : 'of' }} {{ skills().length }} {{ isKhmer() ? 'ជំនាញ' : 'skills' }}</span>
              @if (searchQuery()) {
                <span class="ml-1">({{ isKhmer() ? 'ត្រូវនឹង' : 'matching' }} "{{ searchQuery() }}")</span>
              }
            </div>
            <button
              type="button"
              (click)="resetFilters()"
              class="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold cursor-pointer"
            >
              {{ isKhmer() ? 'កំណត់ឡើងវិញ' : 'Reset filters' }}
            </button>
          </div>
        }
      </section>

      <!-- Main Content Area -->
      @if (isLoading()) {
        <!-- Skeleton Loading State -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
            <app-skeleton-loader variant="rect" height="40px" customClass="rounded-xl"></app-skeleton-loader>
            <div class="grid grid-cols-2 gap-3 pt-2">
              <app-skeleton-loader variant="rect" height="64px" customClass="rounded-2xl"></app-skeleton-loader>
              <app-skeleton-loader variant="rect" height="64px" customClass="rounded-2xl"></app-skeleton-loader>
            </div>
          </div>
          <div class="p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
            <app-skeleton-loader variant="rect" height="40px" customClass="rounded-xl"></app-skeleton-loader>
            <div class="grid grid-cols-2 gap-3 pt-2">
              <app-skeleton-loader variant="rect" height="64px" customClass="rounded-2xl"></app-skeleton-loader>
              <app-skeleton-loader variant="rect" height="64px" customClass="rounded-2xl"></app-skeleton-loader>
            </div>
          </div>
        </div>
      } @else if (error()) {
        <!-- Error State -->
        <div class="p-8 rounded-3xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 text-center space-y-4">
          <div class="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p class="text-sm font-semibold text-rose-700 dark:text-rose-300">{{ error() }}</p>
          <button
            type="button"
            (click)="loadSkills()"
            class="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
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
        <!-- Categorized Skills Grid with Scroll Entrance Animation -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          @for (group of groupedSkills(); track group.id) {
            <div
              pAnimateOnScroll
              [once]="true"
              [threshold]="0.05"
              enterClass="animate-enter fade-in-0 slide-in-from-b-8 animate-duration-700"
              leaveClass="animate-leave fade-out-0"
              class="card-interactive p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 space-y-6"
            >
              <!-- Group Header -->
              <div class="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div class="flex items-center gap-3.5">
                  <div class="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-sm shrink-0" [ngClass]="getCategoryBadgeClass(group.id)">
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
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5" [class.font-khmer]="isKhmer()">
                      {{ isKhmer() ? getCategoryDescription(group.id).kh : getCategoryDescription(group.id).en }}
                    </p>
                  </div>
                </div>

                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0">
                  {{ group.skills.length }} {{ isKhmer() ? 'មុខ' : 'skills' }}
                </span>
              </div>

              <!-- Skill Grid: Clean modern 2-column cards -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                @for (skill of group.skills; track skill._id) {
                  <div
                    class="group p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-850 hover:border-indigo-400 dark:hover:border-indigo-500/80 hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex items-center gap-3.5 cursor-default"
                  >
                    <!-- Tech Icon Container -->
                    <div class="w-11 h-11 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 shadow-2xs flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                      @switch (getSkillIconKey(skill.name, skill.icon)) {
                        @case ('angular') {
                          <svg class="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2.5L3.5 5.5L4.8 16.8L12 21.5L19.2 16.8L20.5 5.5L12 2.5Z" fill="#DD0031"/>
                            <path d="M12 2.5V21.5L19.2 16.8L20.5 5.5L12 2.5Z" fill="#C3002F"/>
                            <path d="M12 5.5L6.8 17H8.9L10 14.3H14L15.1 17H17.2L12 5.5ZM13.3 12.5H10.7L12 9.2L13.3 12.5Z" fill="#FFFFFF"/>
                          </svg>
                        }
                        @case ('react') {
                          <svg class="w-6 h-6 text-[#61DAFB] shrink-0" viewBox="0 0 24 24" fill="none">
                            <ellipse cx="12" cy="12" rx="9.5" ry="3.8" stroke="#61DAFB" stroke-width="1.6" transform="rotate(0 12 12)"/>
                            <ellipse cx="12" cy="12" rx="9.5" ry="3.8" stroke="#61DAFB" stroke-width="1.6" transform="rotate(60 12 12)"/>
                            <ellipse cx="12" cy="12" rx="9.5" ry="3.8" stroke="#61DAFB" stroke-width="1.6" transform="rotate(120 12 12)"/>
                            <circle cx="12" cy="12" r="2" fill="#61DAFB"/>
                          </svg>
                        }
                        @case ('javascript') {
                          <svg class="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none">
                            <rect width="24" height="24" rx="4" fill="#F7DF1E"/>
                            <path d="M6.8 17.2C7.7 17.2 8.4 16.7 8.4 15.6V9.5H10.2V15.7C10.2 18 8.6 18.8 6.6 18.6C5.5 18.5 4.6 18 4.1 17.4L5.2 15.9C5.7 16.3 6.2 17.2 6.8 17.2ZM14.5 17.2C15.5 17.2 16.2 16.7 16.2 15.9C16.2 15 15.5 14.6 14.4 14.1C12.9 13.5 12 13 12 11.6C12 10.3 13.1 9.3 14.8 9.3C16 9.3 17 9.8 17.6 10.6L16.3 11.8C15.8 11.2 15.3 10.9 14.7 10.9C14.1 10.9 13.7 11.3 13.7 11.7C13.7 12.3 14.3 12.6 15.3 13.1C16.8 13.7 17.9 14.3 17.9 15.9C17.9 17.6 16.5 18.7 14.6 18.7C13 18.7 11.9 18 11.2 17L12.5 15.8C13.1 16.6 13.8 17.2 14.5 17.2Z" fill="#000000"/>
                          </svg>
                        }
                        @case ('typescript') {
                          <svg class="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none">
                            <rect width="24" height="24" rx="4" fill="#3178C6"/>
                            <path d="M5.5 12H8.5V18.5H10.2V12H13.2V10.5H5.5V12ZM15.5 17.5C16.3 17.5 16.8 17.1 16.8 16.5C16.8 15.8 16.3 15.5 15.5 15.2L14.7 14.9C13.5 14.4 12.7 13.9 12.7 12.6C12.7 11.3 13.7 10.3 15.2 10.3C16.3 10.3 17.1 10.7 17.6 11.3L16.5 12.4C16.1 11.9 15.7 11.7 15.2 11.7C14.7 11.7 14.3 12 14.3 12.5C14.3 13 14.8 13.3 15.6 13.6L16.4 13.9C17.8 14.4 18.6 15 18.6 16.4C18.6 17.9 17.3 18.8 15.6 18.8C14.2 18.8 13.2 18.3 12.6 17.4L13.8 16.3C14.3 17 14.9 17.5 15.5 17.5Z" fill="#FFFFFF"/>
                          </svg>
                        }
                        @case ('htmlcss') {
                          <svg class="w-6 h-6 shrink-0" viewBox="0 0 28 24" fill="none">
                            <!-- HTML5 Shield -->
                            <path d="M2 2.5L3.5 19.5L9.5 21.5L15.5 19.5L17 2.5H2Z" fill="#E44D26"/>
                            <path d="M9.5 4V19.8L14.2 18.4L15.3 4H9.5Z" fill="#F16529"/>
                            <path d="M5.5 7H13.5L13.2 9.5H9.5V11H13L12.6 15L9.5 16V17.5L13.8 16.2L14.4 8H5.5V7Z" fill="#FFFFFF"/>
                            <!-- CSS3 Shield -->
                            <path d="M12.5 5.5L13.8 19.5L19.5 21.5L25.2 19.5L26.5 5.5H12.5Z" fill="#1572B6"/>
                            <path d="M19.5 7V19.8L23.8 18.4L25 7H19.5Z" fill="#33A9DC"/>
                            <path d="M16 10H23.5L23.2 12.5H19.5V14H23L22.6 17.5L19.5 18.4V19.8L23.8 18.5L24.4 11H16V10Z" fill="#FFFFFF"/>
                          </svg>
                        }
                        @case ('tailwind') {
                          <svg class="w-6 h-6 text-[#06B6D4] shrink-0" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z"/>
                          </svg>
                        }
                        @case ('python') {
                          <svg class="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none">
                            <path d="M11.9 2C8.6 2 6.6 3.4 6.6 5.4V7.5H12V8.3H4.4C2.5 8.3 1 9.9 1 12C1 14.1 2.5 15.6 4.6 15.6H6V13.8C6 11.5 8 9.6 10.3 9.6H14.8C16.4 9.6 17.6 8.3 17.6 6.8V5.3C17.6 3.3 15.4 2 11.9 2ZM9.5 4C10.1 4 10.6 4.5 10.6 5.1C10.6 5.7 10.1 6.2 9.5 6.2C8.9 6.2 8.4 5.7 8.4 5.1C8.4 4.5 8.9 4 9.5 4Z" fill="#3776AB"/>
                            <path d="M12.1 22C15.4 22 17.4 20.6 17.4 18.6V16.5H12V15.7H19.6C21.5 15.7 23 14.1 23 12C23 9.9 21.5 8.4 19.4 8.4H18V10.2C18 12.5 16 14.4 13.7 14.4H9.2C7.6 14.4 6.4 15.7 6.4 17.2V18.7C6.4 20.7 8.6 22 12.1 22ZM14.5 20C13.9 20 13.4 19.5 13.4 18.9C13.4 18.3 13.9 17.8 14.5 17.8C15.1 17.8 15.6 18.3 15.6 18.9C15.6 19.5 15.1 20 14.5 20Z" fill="#FFD43B"/>
                          </svg>
                        }
                        @case ('django') {
                          <svg class="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none">
                            <rect width="24" height="24" rx="4" fill="#092E20"/>
                            <path d="M11.5 6H13.2V14.5C12.5 14.7 11.8 14.8 11.1 14.8C9.2 14.8 8.1 13.6 8.1 11.6C8.1 9.6 9.4 8.4 11.2 8.4V9.8C10.2 9.8 9.7 10.5 9.7 11.6C9.7 12.7 10.3 13.3 11.2 13.3C11.3 13.3 11.4 13.3 11.5 13.3V6ZM14.5 8.4H16.2V14.5H14.5V8.4ZM14.5 6.3H16.2V7.6H14.5V6.3Z" fill="#44B78B"/>
                          </svg>
                        }
                        @case ('nodejs') {
                          <svg class="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2L21 7.2V16.8L12 22L3 16.8V7.2L12 2Z" fill="#339933"/>
                            <path d="M12 4.5L18.5 8.2V15.8L12 19.5L5.5 15.8V8.2L12 4.5Z" fill="#215732"/>
                            <path d="M12 7.5L16 9.8V14.2L12 16.5L8 14.2V9.8L12 7.5Z" fill="#68A063"/>
                            <text x="12" y="13.5" font-size="5" font-weight="bold" text-anchor="middle" fill="white" font-family="sans-serif">JS</text>
                          </svg>
                        }
                        @case ('postgresql') {
                          <!-- Official PostgreSQL Slonik Elephant from PNGWing -->
                          <img src="assets/images/tech/postgresql.png" alt="PostgreSQL" class="w-7 h-7 object-contain shrink-0" />
                        }
                        @case ('mysql') {
                          <!-- Official MySQL Sakila dolphin leaping with wordmark from PNGWing -->
                          <svg class="w-7 h-7 shrink-0" viewBox="0 0 128 128" fill="none">
                            <path fill="#00618A" d="M0 91.313h4.242V74.566l6.566 14.598c.773 1.77 1.832 2.391 3.914 2.391s3.098-.621 3.871-2.391l6.566-14.598v16.746h4.242V74.594c0-1.633-.652-2.422-2-2.828-3.223-1.004-5.383-.137-6.363 2.039l-6.441 14.41-6.238-14.41c-.937-2.176-3.14-3.043-6.359-2.039-1.348.406-2 1.195-2 2.828zM32.93 77.68h4.238v9.227c-.039.5.16 1.676 2.484 1.715h9.223V77.633h4.25c.02 0-.008 14.984-.008 15.047.023 3.695-4.582 4.496-6.707 4.559H33.02v-2.852l13.414-.004c2.73-.285 2.406-1.645 2.406-2.098v-1.113h-9.012c-4.195-.039-6.863-1.871-6.898-3.977-.004-.191.09-9.422 0-9.516zm0 0"/>
                            <path fill="#E48E00" d="M56.391 91.313h12.195c1.426 0 2.813-.301 3.914-.816 1.836-.84 2.73-1.984 2.73-3.48v-3.098c0-1.223-1.016-2.367-3.016-3.125-1.059-.41-2.367-.625-3.629-.625h-5.141c-1.711 0-2.527-.516-2.73-1.656-.039-.137-.039-.246-.039-.383V76.2c0-.109 0-.219.039-.355.203-.867.652-1.113 2.16-1.25l.41-.027h12.109v-2.824H63.488c-1.711 0-2.609.109-3.426.352-2.527.789-3.629 2.039-3.629 4.215v2.473c0 1.902 2.16 3.535 5.789 3.914l1.223.055h4.406c.164 0 .324 0 .449.027 1.344.109 1.914.355 2.324.844.211.195.332.473.324.758v2.477c0 .297-.203.68-.609 1.004-.367.328-.98.543-1.793.598l-.449.027H56.391zm45.297-4.922c0 2.91 2.164 4.539 6.523 4.867l1.227.055h11.051v-2.828h-11.133c-2.488 0-3.426-.625-3.426-2.121V71.738h-4.238V86.39zm-23.75.148V76.457c0-2.559 1.801-4.113 5.355-4.602a7.976 7.976 0 0 1 1.145-.082h8.047c.41 0 .777.027 1.188.082 3.555.488 5.352 2.043 5.352 4.602v10.082c0 2.078-.762 3.188-2.523 3.914l4.18 3.77h-4.926l-3.379-3.051-3.402.215H84.44a9.23 9.23 0 0 1-2.492-.352c-2.699-.734-4.008-2.152-4.008-4.496zm4.578-.246c0 .137.039.273.082.438.246 1.172 1.348 1.824 3.023 1.824h3.852l-3.539-3.195h4.926l3.086 2.789c.57-.305.941-.766 1.074-1.363.039-.137.039-.273.039-.41v-9.668c0-.109 0-.246-.039-.383-.246-1.09-1.348-1.715-2.984-1.715h-6.414c-1.879 0-3.105.816-3.105 2.098zm0 0"/>
                            <path fill="#00618A" d="M124.219 67.047c-2.605-.07-4.598.172-6.301.891-.484.203-1.258.207-1.336.813.266.281.309.699.52 1.039.406.66 1.094 1.539 1.707 2l2.074 1.484c1.273.777 2.699 1.223 3.93 2 .723.461 1.441 1.039 2.148 1.559.348.254.582.656 1.039.816v-.074c-.238-.305-.301-.723-.52-1.039l-.965-.965c-.941-1.25-2.137-2.348-3.41-3.262-1.016-.727-3.281-1.711-3.707-2.891l-.074-.074c.719-.078 1.563-.34 2.223-.516 1.117-.301 2.113-.223 3.262-.52l1.559-.449v-.293c-.582-.598-.996-1.387-1.633-1.93-1.656-1.41-3.469-2.824-5.336-4.004-1.035-.652-2.312-1.074-3.41-1.629-.367-.187-1.016-.281-1.262-.594-.574-.734-.887-1.664-1.332-2.52l-2.668-5.633c-.562-1.285-.93-2.555-1.633-3.707-3.363-5.535-6.988-8.875-12.602-12.156-1.191-.699-2.633-.973-4.148-1.332l-2.449-.148c-.496-.211-1.012-.82-1.48-1.113-1.859-1.176-6.629-3.73-8.008-.371-.867 2.121 1.301 4.191 2.078 5.266.543.754 1.242 1.598 1.629 2.445.258.555.301 1.113.52 1.703.539 1.453 1.008 3.031 1.707 4.375.352.68.738 1.395 1.184 2 .273.371.742.539.816 1.113-.457.641-.484 1.633-.742 2.445-1.16 3.652-.723 8.191.965 10.898.516.828 1.734 2.609 3.41 1.926 1.465-.598 1.137-2.445 1.555-4.078.098-.367.039-.641.223-.887v.074l1.336 2.668c.988 1.59 2.738 3.25 4.223 4.371.773.582 1.379 1.59 2.375 1.93V68.6h-.074c-.195-.297-.496-.422-.742-.664-.582-.57-1.227-1.277-1.703-1.93-1.352-1.832-2.547-3.84-3.633-5.93-.52-.996-.973-2.098-1.41-3.113-.168-.391-.164-.984-.516-1.184-.48.742-1.187 1.344-1.559 2.223-.594 1.402-.668 3.117-.891 4.891l-.148.074c-1.031-.25-1.395-1.312-1.777-2.223-.973-2.305-1.152-6.02-.297-8.672.219-.687 1.219-2.852.813-3.484-.191-.633-.828-1-1.184-1.484a11.7 11.7 0 0 1-1.187-2.074c-.793-1.801-1.164-3.816-2-5.633-.398-.871-1.074-1.75-1.629-2.523-.617-.855-1.305-1.484-1.781-2.52-.168-.367-.398-.957-.148-1.336.078-.254.195-.359.445-.441.43-.332 1.629.109 2.074.293 1.191.496 2.184.965 3.191 1.633.48.32.969.941 1.555 1.113h.668c1.043.238 2.211.07 3.188.367 1.723.523 3.27 1.34 4.668 2.227 4.273 2.695 7.766 6.535 10.156 11.117.387.738.551 1.441.891 2.223.684 1.578 1.543 3.203 2.223 4.746s1.34 3.094 2.297 4.375c.504.672 2.453 1.031 3.336 1.406.621.262 1.637.535 2.223.891 1.125.676 2.211 1.48 3.266 2.223.523.375 2.141 1.188 2.223 1.855zM91.082 38.805a5.26 5.26 0 0 0-1.332.148v.074h.074c.258.535.715.879 1.035 1.336l.742 1.555.074-.07c.461-.324.668-.844.668-1.633-.187-.195-.211-.437-.371-.668-.211-.309-.621-.48-.891-.742zm0 0"/>
                          </svg>
                        }
                        @case ('mongodb') {
                          <svg class="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2C12 2 6 7.5 6 13C6 17 8.5 20.5 12 22C15.5 20.5 18 17 18 13C18 7.5 12 2 12 2Z" fill="#47A248"/>
                            <path d="M12 2V22C11.8 22 11.6 22 11.5 21.9C8.3 20.4 6 17 6 13C6 8.2 10.8 3.5 12 2Z" fill="#499D4A"/>
                            <path d="M12 2V22C12.2 22 12.4 22 12.5 21.9C15.7 20.4 18 17 18 13C18 8.2 13.2 3.5 12 2Z" fill="#58AA58"/>
                            <path d="M12 22.5C11.5 22.5 11 21.5 11 20H13C13 21.5 12.5 22.5 12 22.5Z" fill="#3FA037"/>
                          </svg>
                        }
                        @case ('git') {
                          <svg class="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none">
                            <rect width="24" height="24" rx="4" fill="#F05032"/>
                            <circle cx="8" cy="8" r="2" fill="white"/>
                            <circle cx="8" cy="16" r="2" fill="white"/>
                            <circle cx="16" cy="12" r="2" fill="white"/>
                            <path d="M8 10V14M8 10C8 11.5 11 12 14 12" stroke="white" stroke-width="2" stroke-linecap="round"/>
                          </svg>
                        }
                        @case ('docker') {
                          <!-- Official Docker Shipping Container Whale -->
                          <svg class="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none">
                            <path d="M22.8 11.2C22.4 11 21.6 11.1 21 11.5C20.6 10.7 19.6 10.1 18.3 10.1H17.4V8.3H19.1V6.5H17.4V4.8H15.6V6.5H13.9V4.8H12.2V6.5H10.4V8.3H15.6V10.1H12.2V11.8H10.4V10.1H4C4 15.5 8 18 13.5 18C19.5 18 23.2 14.5 22.8 11.2ZM12.2 8.3H13.9V10.1H12.2V8.3ZM10.4 6.5H12.2V8.3H10.4V6.5ZM8.7 8.3H10.4V10.1H8.7V8.3ZM6.9 10.1H8.7V11.8H6.9V10.1Z" fill="#2496ED"/>
                            <circle cx="18" cy="13.5" r="0.8" fill="white"/>
                          </svg>
                        }
                        @case ('vscode') {
                          <!-- Official Multi-tone Visual Studio Code Ribbon -->
                          <svg class="w-6 h-6 shrink-0" viewBox="0 0 32 32" fill="none">
                            <path d="M29.01 5.03L23.244 2.254a1.742 1.742 0 00-1.989.338L2.38 19.8A1.166 1.166 0 002.3 21.447c.025.027.05.053.077.077l1.541 1.4a1.165 1.165 0 001.489.066L28.142 5.75A1.158 1.158 0 0130 6.672V6.605A1.748 1.748 0 0029.01 5.03Z" fill="#0065a9"/>
                            <path d="M29.01 26.97l-5.766 2.777a1.745 1.745 0 01-1.989-.338L2.38 12.2A1.166 1.166 0 012.3 10.553c.025-.027.05-.053.077-.077l1.541-1.4A1.165 1.165 0 015.41 9.01L28.142 26.25A1.158 1.158 0 0030 25.328V25.4a1.749 1.749 0 01-.99 1.57Z" fill="#007acc"/>
                            <path d="M23.244 29.747a1.745 1.745 0 01-1.989-.338A1.025 1.025 0 0023 28.684V3.316a1.024 1.024 0 00-1.749-.724 1.744 1.744 0 011.989-.339l5.765 2.772A1.748 1.748 0 0130 6.6V25.4a1.748 1.748 0 01-.991 1.576Z" fill="#1f9cf0"/>
                          </svg>
                        }
                        @case ('docwizz') {
                          <!-- DocWizz AI / OCR Scanning Badge -->
                          <svg class="w-6 h-6 text-purple-600 dark:text-purple-400 shrink-0" viewBox="0 0 24 24" fill="none">
                            <rect width="24" height="24" rx="4" fill="#7C3AED" fill-opacity="0.15"/>
                            <path d="M7 3H14L18 7V20C18 20.6 17.6 21 17 21H7C6.4 21 6 20.6 6 20V4C6 3.4 6.4 3 7 3Z" stroke="#7C3AED" stroke-width="1.6" stroke-linejoin="round"/>
                            <path d="M14 3V7H18" stroke="#7C3AED" stroke-width="1.6" stroke-linejoin="round"/>
                            <path d="M9 12H15M9 15H13" stroke="#7C3AED" stroke-width="1.6" stroke-linecap="round"/>
                            <path d="M5 11H19" stroke="#A855F7" stroke-width="1.8" stroke-linecap="round"/>
                          </svg>
                        }
                        @case ('php') {
                          <svg class="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none">
                            <ellipse cx="12" cy="12" rx="11" ry="7" fill="#777BB4"/>
                            <text x="12" y="14.5" font-size="6.5" font-weight="900" text-anchor="middle" fill="white" font-family="sans-serif" letter-spacing="0.5">PHP</text>
                          </svg>
                        }
                        @case ('java') {
                          <!-- Official Java Red Steam & Blue Cup Logo -->
                          <img src="assets/images/tech/java.png" alt="Java" class="w-7 h-7 object-contain shrink-0" />
                        }
                        @case ('api') {
                          <!-- Official RESTful API Badge -->
                          <svg class="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none">
                            <rect width="24" height="24" rx="4" fill="#059669"/>
                            <text x="12" y="15" font-size="6.5" font-weight="900" text-anchor="middle" fill="white" font-family="sans-serif" letter-spacing="0.5">API</text>
                          </svg>
                        }
                        @case ('office') {
                          <!-- Official Microsoft Office 3D Orange Emblem -->
                          <img src="assets/images/tech/office.png" alt="Microsoft Office" class="w-7 h-7 object-contain shrink-0" />
                        }
                        @default {
                          <span class="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                            {{ getSkillInitials(skill.name) }}
                          </span>
                        }
                      }
                    </div>

                    <!-- Skill Title & Subtext -->
                    <div class="min-w-0 flex-1">
                      <h3 class="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug break-words">
                        {{ skill.name }}
                      </h3>
                      <p class="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                        {{ getSkillTag(skill.name) }}
                      </p>
                    </div>

                    <!-- Check badge icon on hover -->
                    <div class="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      ✓
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      }

      <!-- Bottom Call To Action Banner -->
      <section
        pAnimateOnScroll
        [once]="true"
        [threshold]="0.1"
        enterClass="animate-enter fade-in-0 slide-in-from-b-8 animate-duration-700"
        leaveClass="animate-leave fade-out-0"
        class="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white relative overflow-hidden shadow-xl border border-indigo-500/20"
      >
        <div class="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div class="relative z-10 max-w-2xl space-y-4">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-indigo-200">
            <i class="pi pi-sparkles"></i>
            <span>{{ isKhmer() ? 'ការអនុវត្តជាក់ស្តែង' : 'Real-World Production' }}</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {{ isKhmer() ? 'ចង់ឃើញបច្ចេកវិទ្យាទាំងនេះដំណើរការជាក់ស្តែង?' : 'Want to see these skills in real-world applications?' }}
          </h2>
          <p class="text-sm sm:text-base text-indigo-100/90 leading-relaxed" [class.font-khmer]="isKhmer()">
            {{ isKhmer()
              ? 'សូមចូលមើលគម្រោងដែលខ្ញុំបានបង្កើតឡើង ឬទាក់ទងមកខ្ញុំដើម្បីពិភាក្សាអំពីកិច្ចសហការ និងឱកាសការងារ។'
              : 'Explore the full list of production projects, case studies, and code repositories built with this modern stack.'
            }}
          </p>
          <div class="flex flex-wrap items-center gap-3 pt-2">
            <a
              routerLink="/projects"
              class="py-3 px-6 rounded-xl text-xs font-bold bg-white text-slate-900 hover:bg-indigo-50 active:scale-95 transition-all shadow-md inline-flex items-center gap-2 no-underline"
            >
              <span>{{ isKhmer() ? 'មើលគម្រោងទាំងអស់' : 'Explore Projects' }}</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
            <a
              routerLink="/contact"
              class="py-3 px-6 rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 active:scale-95 transition-all inline-flex items-center gap-2 no-underline"
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
  public readonly isCategoryDropdownOpen = signal<boolean>(false);
  public readonly selectedCascadeItem = signal<CascadeSkillItem | null>(null);
  public readonly selectedSkillName = signal<string | null>(null);

  public readonly isKhmer = computed(() => this.languageService.currentLang() === 'kh');

  public readonly currentCategory = computed<CategoryFilter>(() => {
    const active = this.selectedCategory();
    return this.categories().find((c) => c.id === active) || this.categories()[0];
  });

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
   * Derive hierarchical options for PrimeNG CascadeSelect
   */
  public readonly cascadeCategories = computed<CascadeSkillItem[]>(() => {
    const all = this.skills();
    const map = new Map<string, { nameEn: string; nameKh: string; skills: Skill[] }>();

    for (const skill of all) {
      const en = skill.category?.en || 'General';
      const kh = skill.category?.kh || en;
      const key = en.toLowerCase().replace(/[^a-z0-9]/g, '');

      if (!map.has(key)) {
        map.set(key, { nameEn: en, nameKh: kh, skills: [] });
      }
      map.get(key)!.skills.push(skill);
    }

    const items: CascadeSkillItem[] = [
      {
        id: 'all',
        name: `All Technologies (${all.length})`,
        cname: `All Technologies (${all.length})`,
        nameKh: `បច្ចេកវិទ្យាទាំងអស់ (${all.length})`,
        cnameKh: `បច្ចេកវិទ្យាទាំងអស់ (${all.length})`,
        count: all.length,
        type: 'all',
      },
    ];

    for (const [key, val] of map.entries()) {
      const count = val.skills.length;
      items.push({
        id: key,
        name: `${val.nameEn} (${count})`,
        cname: `${val.nameEn} (${count})`,
        nameKh: `${val.nameKh} (${count})`,
        cnameKh: `${val.nameKh} (${count})`,
        count,
        type: 'category',
      });
    }

    return items;
  });

  /**
   * Filter skills and group them by category & skill
   */
  public readonly groupedSkills = computed<CategoryGroup[]>(() => {
    const all = this.skills();
    const activeCategory = this.selectedCategory();
    const query = this.searchQuery().trim().toLowerCase();
    const activeSkill = this.selectedSkillName()?.trim().toLowerCase();

    // 1. Filter by category, search query & skill filter
    const filtered = all.filter((s) => {
      const catKey = (s.category?.en || 'General').toLowerCase().replace(/[^a-z0-9]/g, '');
      const matchesCategory = activeCategory === 'all' || catKey === activeCategory;
      const matchesQuery = !query || s.name.toLowerCase().includes(query);
      const matchesSkill = !activeSkill || s.name.toLowerCase() === activeSkill;
      return matchesCategory && matchesQuery && matchesSkill;
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

  public onCascadeChange(event: { value?: CascadeSkillItem | null }): void {
    const item = event?.value ?? this.selectedCascadeItem();
    if (!item) {
      this.onCascadeClear();
      return;
    }

    this.selectedCascadeItem.set(item);

    if (item.type === 'all') {
      this.selectedCategory.set('all');
      this.selectedSkillName.set(null);
    } else if (item.type === 'category') {
      this.selectedCategory.set(item.id);
      this.selectedSkillName.set(null);
    } else if (item.type === 'skill') {
      const foundSkill = this.skills().find((s) => s.name === item.name || s._id === item.id);
      if (foundSkill) {
        const catKey = (foundSkill.category?.en || 'General').toLowerCase().replace(/[^a-z0-9]/g, '');
        this.selectedCategory.set(catKey);
      }
      this.selectedSkillName.set(item.name);
    }
  }

  public onCascadeClear(): void {
    this.selectedCascadeItem.set(null);
    this.selectedCategory.set('all');
    this.selectedSkillName.set(null);
  }

  public toggleCategoryDropdown(): void {
    this.isCategoryDropdownOpen.update((open) => !open);
  }

  public closeCategoryDropdown(): void {
    this.isCategoryDropdownOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  public onEscape(): void {
    this.closeCategoryDropdown();
  }

  public setCategory(id: string): void {
    this.selectedCategory.set(id);
    this.selectedSkillName.set(null);
    this.closeCategoryDropdown();

    if (id === 'all') {
      this.selectedCascadeItem.set(null);
    } else {
      const match = this.cascadeCategories().find((c) => c.id === id);
      this.selectedCascadeItem.set(match || null);
    }
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
    this.selectedSkillName.set(null);
    this.selectedCascadeItem.set(null);
    this.closeCategoryDropdown();
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

  public getCategoryDescription(catId: string): { en: string; kh: string } {
    const type = this.getCategoryType(catId);
    switch (type) {
      case 'frontend':
        return {
          en: 'Modern reactive user interfaces, component architectures, and responsive designs.',
          kh: 'ការបង្កើតចំណុចប្រទាក់អ្នកប្រើប្រាស់បែបទំនើប ស្ថាបត្យកម្មសមាសភាគ និងការរចនាឆ្លើយតប។',
        };
      case 'backend':
        return {
          en: 'Server-side runtimes, robust RESTful APIs, business logic, and backend microservices.',
          kh: 'ប្រព័ន្ធដំណើរការសេវាកម្មខាងក្រោយ RESTful APIs និងតក្កវិជ្ជាកម្មវិធីដ៏រឹងមាំ។',
        };
      case 'database':
        return {
          en: 'Relational data modeling, NoSQL document stores, and query optimizations.',
          kh: 'ការរៀបចំគំរូទិន្នន័យទំនាក់ទំនង មូលដ្ឋានទិន្នន័យឯកសារ និងការបង្កើនល្បឿនសំណួរ។',
        };
      case 'devops':
        return {
          en: 'Version control, container environments, and productivity platforms.',
          kh: 'ការគ្រប់គ្រងកំណែកូដ ប្រព័ន្ធកុងតឺន័រ និងឧបករណ៍ជំនួយផលិតភាពការងារ។',
        };
      case 'aiml':
        return {
          en: 'Computer vision, document intelligence, and OCR pipeline implementations.',
          kh: 'ប្រព័ន្ធបញ្ញាសិប្បនិម្មិត Computer Vision និងការដំណើរការទិន្នន័យ OCR។',
        };
      default:
        return {
          en: 'Technologies and engineering practices applied to build scalable solutions.',
          kh: 'បច្ចេកវិទ្យា និងការអនុវត្តវិស្វកម្មដែលប្រើប្រាស់ក្នុងការកសាងប្រព័ន្ធខ្នាតធំ។',
        };
    }
  }

  public getSkillIconKey(name: string, icon?: string): string {
    const raw = (icon || name || '').toLowerCase();
    if (raw.includes('angular')) return 'angular';
    if (raw.includes('react')) return 'react';
    if (raw.includes('typescript')) return 'typescript';
    if (raw.includes('javascript') || raw.includes('es6')) return 'javascript';
    if (raw.includes('html') || raw.includes('css')) return 'htmlcss';
    if (raw.includes('tailwind') || raw.includes('bootstrap')) return 'tailwind';
    if (raw.includes('python')) return 'python';
    if (raw.includes('django')) return 'django';
    if (raw.includes('node')) return 'nodejs';
    if (raw.includes('php')) return 'php';
    if (raw.includes('java') && !raw.includes('script')) return 'java';
    if (raw.includes('api') || raw.includes('rest')) return 'api';
    if (raw.includes('postgres')) return 'postgresql';
    if (raw.includes('mysql')) return 'mysql';
    if (raw.includes('mongo')) return 'mongodb';
    if (raw.includes('git')) return 'git';
    if (raw.includes('vscode')) return 'vscode';
    if (raw.includes('wizz') || raw.includes('ocr')) return 'docwizz';
    if (raw.includes('docker')) return 'docker';
    if (raw.includes('office')) return 'office';
    return 'generic';
  }

  public getSkillTag(name: string): string {
    const raw = name.toLowerCase();
    if (raw.includes('html') || raw.includes('css') || raw.includes('tailwind') || raw.includes('bootstrap')) return 'UI & Styling';
    if (raw.includes('react') || raw.includes('angular')) return 'Frontend Framework';
    if (raw.includes('python') || raw.includes('java') || raw.includes('php') || raw.includes('javascript') || raw.includes('typescript')) return 'Core Language';
    if (raw.includes('django') || raw.includes('node') || raw.includes('express')) return 'Backend Runtime';
    if (raw.includes('api') || raw.includes('rest')) return 'RESTful Architecture';
    if (raw.includes('postgres') || raw.includes('mysql') || raw.includes('mongo')) return 'Database Engine';
    if (raw.includes('git') || raw.includes('docker') || raw.includes('vscode')) return 'Developer Tooling';
    if (raw.includes('wizz') || raw.includes('ocr')) return 'AI & Data Processing';
    if (raw.includes('office')) return 'Productivity Suite';
    return 'Core Tech';
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

