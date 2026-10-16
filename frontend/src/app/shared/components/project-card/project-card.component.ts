import { Component, Input, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Project, Category } from '../../../core/models';
import { LanguageService } from '../../../core/services/language.service';
import { LocalizePipe } from '../../pipes';

@Component({
  selector: 'app-project-card',
  standalone: true,
  host: {
    class: 'block h-full text-left',
  },
  imports: [
    CommonModule,
    RouterLink,
    LocalizePipe,
  ],
  template: `
    @if (viewMode === 'list') {
      <!-- ================= LIST / ARCHITECTURAL VIEW ================= -->
      <article
        class="card-interactive group flex flex-col md:flex-row items-stretch rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-400 dark:hover:border-indigo-500/60 transition-all duration-300 backdrop-blur-md w-full"
      >
        <!-- Thumbnail Banner -->
        <div class="relative w-full md:w-80 lg:w-96 h-56 md:h-auto overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-800">
          <a [routerLink]="['/projects', project.slug]" class="block w-full h-full">
            @if (project.mainImage) {
              <img
                [src]="project.mainImage"
                [alt]="(project.title | localize) || 'Project thumbnail'"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                loading="lazy"
              />
            } @else {
              <div class="w-full h-full flex flex-col items-center justify-center text-indigo-400 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-900">
                <svg class="w-12 h-12 stroke-1 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                </svg>
              </div>
            }
          </a>

          <!-- Badges Overlay -->
          <div class="absolute inset-x-4 top-4 flex items-center justify-between pointer-events-none z-10">
            <span class="backdrop-blur-md bg-slate-900/80 text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20 shadow-xs">
              {{ categoryName() }}
            </span>

            @if (project.featured && showFeaturedBadge) {
              <span class="backdrop-blur-md bg-amber-500/95 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                <svg class="w-3 h-3 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>{{ isKhmer() ? 'គម្រោងពិសេស' : 'Featured' }}</span>
              </span>
            }
          </div>

          @if (project.liveUrl) {
            <div class="absolute bottom-3 left-4 pointer-events-none z-10">
              <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-950/80 text-emerald-400 backdrop-blur-md border border-emerald-500/30 shadow-xs">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{{ isKhmer() ? 'ដំណើរការផ្ទាល់' : 'Live Demo' }}</span>
              </span>
            </div>
          }
        </div>

        <!-- Content Area -->
        <div class="p-4 sm:p-6 md:p-8 flex flex-col justify-between flex-1 space-y-4 sm:space-y-5">
          <div class="space-y-3">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
                {{ categoryName() }}
              </span>
              @if (project.status === 'published') {
                <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>{{ isKhmer() ? 'បានផ្សព្វផ្សាយ' : 'Published' }}</span>
                </span>
              }
            </div>

            <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight" [class.font-khmer]="isKhmer()">
              <a
                [routerLink]="['/projects', project.slug]"
                class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                {{ project.title | localize }}
              </a>
            </h2>

            <p class="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3" [class.font-khmer]="isKhmer()">
              {{ project.shortDescription | localize }}
            </p>

            <!-- All Tech Stack Tags -->
            @if (project.technologies && project.technologies.length > 0) {
              <div class="flex flex-wrap items-center gap-1.5 pt-1">
                @for (tech of project.technologies; track tech) {
                  <span class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                    {{ tech }}
                  </span>
                }
              </div>
            }
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-wrap items-center gap-2 sm:gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <a
              [routerLink]="['/projects', project.slug]"
              class="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-all shadow-xs whitespace-nowrap active:scale-[0.98]"
            >
              <svg class="w-4 h-4 stroke-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span>{{ isKhmer() ? 'ព័ត៌មានលម្អិត' : 'Case Study' }}</span>
            </a>

            @if (project.liveUrl) {
              <a
                [href]="project.liveUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-all shadow-md shadow-emerald-600/20 whitespace-nowrap active:scale-[0.98]"
              >
                <svg class="w-4 h-4 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
                <span>{{ isKhmer() ? 'ទស្សនាផ្ទាល់' : 'Live Demo' }}</span>
              </a>
            }

            @if (project.githubUrl) {
              <a
                [href]="project.githubUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-white hover:bg-slate-900 dark:hover:bg-slate-700 inline-flex items-center justify-center transition-all shadow-xs shrink-0 active:scale-[0.98]"
                [attr.aria-label]="'GitHub repository for ' + (project.title.en || 'project')"
                title="GitHub Repository"
              >
                <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
            }
          </div>
        </div>
      </article>
    } @else {
      <!-- ================= GRID VIEW ================= -->
      <article
        class="card-interactive group relative flex flex-col justify-between rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 overflow-hidden shadow-sm hover:shadow-2xl hover:border-indigo-400 dark:hover:border-indigo-500/60 transition-all duration-300 h-full backdrop-blur-md"
      >
        <!-- Card Header Banner -->
        <div class="relative w-full h-48 sm:h-52 md:h-56 bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <a [routerLink]="['/projects', project.slug]" class="block w-full h-full">
            @if (project.mainImage) {
              <img
                [src]="project.mainImage"
                [alt]="(project.title | localize) || 'Project thumbnail'"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                loading="lazy"
              />
            } @else {
              <div class="w-full h-full flex flex-col items-center justify-center text-indigo-400 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-900">
                <svg class="w-12 h-12 stroke-1 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                </svg>
              </div>
            }
          </a>

          <!-- Overlay Top Badges -->
          <div class="absolute inset-x-3.5 sm:inset-x-4 top-3.5 flex items-center justify-between pointer-events-none z-10">
            <span class="backdrop-blur-md bg-slate-900/80 text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20 shadow-xs">
              {{ categoryName() }}
            </span>

            @if (project.featured && showFeaturedBadge) {
              <span class="backdrop-blur-md bg-amber-500/95 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                <svg class="w-3 h-3 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>{{ isKhmer() ? 'គម្រោងពិសេស' : 'Featured' }}</span>
              </span>
            }
          </div>

          <!-- Bottom-left Live Status Pill -->
          @if (project.liveUrl) {
            <div class="absolute bottom-3 left-3.5 sm:left-4 pointer-events-none z-10">
              <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-950/80 text-emerald-400 backdrop-blur-md border border-emerald-500/30 shadow-xs">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{{ isKhmer() ? 'ដំណើរការផ្ទាល់' : 'Live Demo' }}</span>
              </span>
            </div>
          }
        </div>

        <!-- Card Body -->
        <div class="p-4 sm:p-5 md:p-6 flex flex-col flex-1 justify-between space-y-3.5 sm:space-y-4">
          <div class="space-y-2">
            <h2 class="font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white leading-snug" [class.font-khmer]="isKhmer()">
              <a
                [routerLink]="['/projects', project.slug]"
                class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-1"
              >
                {{ project.title | localize }}
              </a>
            </h2>

            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2" [class.font-khmer]="isKhmer()">
              {{ project.shortDescription | localize }}
            </p>
          </div>

          <!-- Tech Stack Chips -->
          @if (project.technologies && project.technologies.length > 0) {
            <div class="flex flex-wrap items-center gap-1.5 pt-1">
              @for (tech of displayedTech(); track tech) {
                <span class="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                  {{ tech }}
                </span>
              }
              @if (remainingTechCount() > 0) {
                <span class="px-1.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-200/70 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                  +{{ remainingTechCount() }}
                </span>
              }
            </div>
          }

          <!-- Footer Actions -->
          <div class="pt-3 sm:pt-4 border-t border-slate-100 dark:border-slate-800/80">
            @if (project.liveUrl && project.githubUrl) {
              <!-- Case 1: Both Live Demo and GitHub exist (3 actions) -->
              <!-- Mobile: 2-row layout with full-width Live Demo, and 50/50 Case Study + GitHub -->
              <!-- Tablet & Desktop: Clean single row with flex-1 + flex-1 + icon button -->
              <div class="grid grid-cols-2 sm:flex sm:items-center gap-2">
                <!-- Action 1: Live Demo (Full width top button on phone, flex-1 on tablet & desktop) -->
                <a
                  [href]="project.liveUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="col-span-2 sm:col-span-1 sm:flex-1 sm:order-2 h-10 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-600/20 whitespace-nowrap active:scale-[0.98]"
                >
                  <svg class="w-3.5 h-3.5 stroke-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10z"/>
                  </svg>
                  <span>{{ isKhmer() ? 'ទស្សនាផ្ទាល់' : 'Live Demo' }}</span>
                </a>

                <!-- Action 2: Case Study (50% on mobile row 2, flex-1 on tablet & desktop) -->
                <a
                  [routerLink]="['/projects', project.slug]"
                  class="col-span-1 sm:flex-1 sm:order-1 h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-1.5 transition-all shadow-xs whitespace-nowrap active:scale-[0.98]"
                >
                  <svg class="w-3.5 h-3.5 stroke-2 text-indigo-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <span>{{ isKhmer() ? 'ព័ត៌មានលម្អិត' : 'Case Study' }}</span>
                </a>

                <!-- Action 3: GitHub (50% on mobile row 2 with label, compact icon-only on tablet & desktop) -->
                <a
                  [href]="project.githubUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="col-span-1 sm:flex-none sm:order-3 sm:w-10 h-10 px-3 sm:px-0 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-white hover:bg-slate-900 dark:hover:bg-slate-700 inline-flex items-center justify-center gap-1.5 transition-all shadow-xs whitespace-nowrap active:scale-[0.98]"
                  [attr.aria-label]="'GitHub repository for ' + (project.title.en || 'project')"
                  title="GitHub Repository"
                >
                  <svg class="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span class="sm:hidden text-xs font-bold">GitHub</span>
                </a>
              </div>
            } @else if (project.liveUrl) {
              <!-- Case 2: Only Live Demo (2 actions: Case Study + Live Demo) -->
              <div class="flex items-center gap-2">
                <a
                  [routerLink]="['/projects', project.slug]"
                  class="flex-1 h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-1.5 transition-all shadow-xs whitespace-nowrap active:scale-[0.98]"
                >
                  <svg class="w-3.5 h-3.5 stroke-2 text-indigo-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <span>{{ isKhmer() ? 'ព័ត៌មានលម្អិត' : 'Case Study' }}</span>
                </a>

                <a
                  [href]="project.liveUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex-1 h-10 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-600/20 whitespace-nowrap active:scale-[0.98]"
                >
                  <svg class="w-3.5 h-3.5 stroke-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10z"/>
                  </svg>
                  <span>{{ isKhmer() ? 'ទស្សនាផ្ទាល់' : 'Live Demo' }}</span>
                </a>
              </div>
            } @else if (project.githubUrl) {
              <!-- Case 3: Only GitHub (2 actions: Case Study + GitHub) -->
              <div class="flex items-center gap-2">
                <a
                  [routerLink]="['/projects', project.slug]"
                  class="flex-1 h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-1.5 transition-all shadow-xs whitespace-nowrap active:scale-[0.98]"
                >
                  <svg class="w-3.5 h-3.5 stroke-2 text-indigo-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <span>{{ isKhmer() ? 'ព័ត៌មានលម្អិត' : 'Case Study' }}</span>
                </a>

                <a
                  [href]="project.githubUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex-1 h-10 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-1.5 transition-all shadow-xs whitespace-nowrap active:scale-[0.98]"
                >
                  <svg class="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span>GitHub</span>
                </a>
              </div>
            } @else {
              <!-- Case 4: Neither (Only Case Study) -->
              <a
                [routerLink]="['/projects', project.slug]"
                class="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-1.5 transition-all shadow-xs whitespace-nowrap active:scale-[0.98]"
              >
                <svg class="w-3.5 h-3.5 stroke-2 text-indigo-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <span>{{ isKhmer() ? 'ព័ត៌មានលម្អិត' : 'Case Study' }}</span>
              </a>
            }
          </div>
        </div>
      </article>
    }
  `,
})
export class ProjectCardComponent {
  private readonly languageService = inject(LanguageService);

  @Input({ required: true }) public project!: Project;
  @Input() public showFeaturedBadge = true;
  @Input() public viewMode: 'grid' | 'list' = 'grid';

  public readonly isKhmer = computed(() => this.languageService.currentLang() === 'kh');

  public readonly categoryName = computed<string>(() => {
    if (!this.project || !this.project.category) return 'General';
    if (typeof this.project.category === 'object' && 'name' in this.project.category) {
      const cat = this.project.category as Category;
      return this.isKhmer() ? (cat.name?.kh || cat.name?.en || 'General') : (cat.name?.en || 'General');
    }
    return String(this.project.category);
  });

  public readonly displayedTech = computed<string[]>(() => {
    return (this.project?.technologies || []).slice(0, 4);
  });

  public readonly remainingTechCount = computed<number>(() => {
    const total = this.project?.technologies?.length || 0;
    return total > 4 ? total - 4 : 0;
  });
}

