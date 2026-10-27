import { Component, OnInit, OnDestroy, HostListener, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { of, catchError, Subscription } from 'rxjs';
import { marked } from 'marked';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { LanguageService } from '../../../core/services/language.service';
import { SeoService } from '../../../core/services/seo.service';
import { Project, Category } from '../../../core/models';
import { formatCalendarDate } from '../../../core/utils/date-utils';
import {
  ProjectCardComponent,
  EmptyStateComponent,
  LocalizePipe,
} from '../../../shared';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    AnimateOnScrollModule,
    ProjectCardComponent,
    EmptyStateComponent,
    LocalizePipe,
  ],
  template: `
    <div class="relative py-10 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <!-- Ambient Gradient Glow Backdrop -->
      <div class="absolute -top-24 left-1/2 -translate-x-1/2 w-[36rem] h-96 bg-gradient-to-tr from-indigo-500/15 via-purple-500/10 to-transparent dark:from-indigo-500/10 dark:via-purple-500/5 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <!-- Back Navigation -->
      <div class="flex items-center gap-4 animate-fade-in-up">
        <a
          routerLink="/projects"
          class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-2xs backdrop-blur-sm transition-all"
        >
          <svg class="w-4 h-4 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>{{ isKhmer() ? 'ត្រឡប់ទៅគម្រោងទាំងអស់' : 'Back to Projects' }}</span>
        </a>
      </div>

      @if (isLoading()) {
        <!-- Skeleton Loading State -->
        <div class="space-y-8 animate-pulse">
          <div class="space-y-4 max-w-2xl">
            <div class="h-6 w-32 rounded-full bg-slate-200 dark:bg-slate-800"></div>
            <div class="h-10 w-3/4 rounded-2xl bg-slate-200 dark:bg-slate-800"></div>
            <div class="h-5 w-full rounded-xl bg-slate-200 dark:bg-slate-800"></div>
          </div>
          <div class="h-80 sm:h-96 rounded-3xl bg-slate-200 dark:bg-slate-800"></div>
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div class="lg:col-span-8 space-y-6">
              <div class="h-40 rounded-3xl bg-slate-200 dark:bg-slate-800"></div>
              <div class="h-40 rounded-3xl bg-slate-200 dark:bg-slate-800"></div>
            </div>
            <div class="lg:col-span-4">
              <div class="h-64 rounded-3xl bg-slate-200 dark:bg-slate-800"></div>
            </div>
          </div>
        </div>
      } @else if (error() || !project()) {
        <!-- Error / Not Found State -->
        <app-empty-state
          [title]="isKhmer() ? 'រកមិនឃើញគម្រោងនេះទេ' : 'Project Not Found'"
          [description]="error() || (isKhmer() ? 'គម្រោងដែលអ្នកកំពុងស្វែងរកប្រហែលជាត្រូវបានផ្លាស់ប្តូរ ឬលុបចេញ។' : 'The project you are looking for may have been moved or removed.')"
          [actionText]="isKhmer() ? 'ត្រឡប់ទៅកាន់គម្រោងទាំងអស់' : 'Back to Projects'"
          (actionClick)="goBackToProjects()"
        ></app-empty-state>
      } @else {
        <!-- Project Hero Header -->
        <header class="space-y-6 animate-fade-in-up">
          <!-- Category & Status Badges -->
          <div class="flex flex-wrap items-center gap-2.5">
            <span class="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 shadow-2xs">
              {{ categoryName() }}
            </span>

            @if (project()?.featured) {
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-sm shadow-amber-500/20">
                <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>{{ isKhmer() ? 'គម្រោងឆ្នើម' : 'Featured Case Study' }}</span>
              </span>
            }

            @if (project()?.status === 'published') {
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/50">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{{ isKhmer() ? 'បានផ្សព្វផ្សាយ' : 'Verified & Deployed' }}</span>
              </span>
            }
          </div>

          <!-- Title -->
          <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {{ project()?.title | localize }}
          </h1>

          <!-- Short Description -->
          <p class="text-base sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl" [class.font-khmer]="isKhmer()">
            {{ project()?.shortDescription | localize }}
          </p>

          <!-- Action Buttons Hub -->
          <div class="flex flex-wrap items-center gap-3 pt-2">
            @if (project()?.liveUrl) {
              <a
                [href]="project()?.liveUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
              >
                <svg class="w-4 h-4 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
                <span>{{ isKhmer() ? 'ទស្សនាផ្ទាល់ (Live Demo)' : 'Live Demo' }}</span>
                <svg class="w-3.5 h-3.5 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            }

            @if (project()?.githubUrl) {
              <a
                [href]="project()?.githubUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700 text-sm font-bold border border-slate-700/60 shadow-xs active:scale-95 transition-all"
              >
                <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>{{ isKhmer() ? 'ប្រភពកូដ (GitHub)' : 'Source Code' }}</span>
              </a>
            }

            @if (project()?.videoUrl) {
              <a
                [href]="project()?.videoUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold shadow-md shadow-rose-600/20 active:scale-95 transition-all"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ isKhmer() ? 'វីដេអូបង្ហាញ' : 'Video Demo' }}</span>
              </a>
            }
          </div>

          <!-- Quick Project Snapshot Strip (4 Cards) -->
          <div
            pAnimateOnScroll
            [once]="true"
            [threshold]="0.08"
            enterClass="animate-enter fade-in-0 slide-in-from-b-8 animate-duration-700"
            leaveClass="animate-leave fade-out-0"
            class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2"
          >
            <!-- Item 1: Category -->
            <div class="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs backdrop-blur-sm">
              <div class="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                {{ isKhmer() ? 'វិស័យ / ប្រភេទ' : 'Discipline' }}
              </div>
              <div class="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5 whitespace-nowrap truncate">
                {{ categoryName() }}
              </div>
              <div class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 whitespace-nowrap">
                {{ isKhmer() ? 'ស្ថាបត្យកម្មប្រព័ន្ធ' : 'Architecture & ML' }}
              </div>
            </div>

            <!-- Item 2: Timeline -->
            <div class="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs backdrop-blur-sm">
              <div class="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {{ isKhmer() ? 'កាលបរិច្ឆេទ' : 'Timeline' }}
              </div>
              <div class="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5 whitespace-nowrap truncate">
                {{ formatTimeline(project()?.startDate, project()?.completionDate) || 'Production' }}
              </div>
              <div class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 whitespace-nowrap">
                {{ isKhmer() ? 'ការអភិវឌ្ឍបញ្ចប់' : 'Delivery & Polish' }}
              </div>
            </div>

            <!-- Item 3: Core Stack -->
            <div class="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs backdrop-blur-sm">
              <div class="text-xs font-semibold text-purple-600 dark:text-purple-400">
                {{ isKhmer() ? 'បច្ចេកវិទ្យាគោល' : 'Ecosystem' }}
              </div>
              <div class="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5 whitespace-nowrap truncate">
                {{ (project()?.technologies || []).slice(0, 2).join(' · ') || 'Full-Stack' }}
              </div>
              <div class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 whitespace-nowrap">
                +{{ ((project()?.technologies?.length || 0) > 2 ? (project()!.technologies.length - 2) : 0) }} {{ isKhmer() ? 'ឧបករណ៍ផ្សេងទៀត' : 'more libraries' }}
              </div>
            </div>

            <!-- Item 4: Status / Impact -->
            <div class="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs backdrop-blur-sm">
              <div class="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span>{{ isKhmer() ? 'ស្ថានភាពគម្រោង' : 'Project Status' }}</span>
              </div>
              <div class="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5 capitalize whitespace-nowrap truncate">
                {{ project()?.status === 'published' ? 'Live & Tested' : 'In Development' }}
              </div>
              <div class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 whitespace-nowrap">
                {{ project()?.liveUrl ? 'Publicly Accessible' : 'Open-Source Code' }}
              </div>
            </div>
          </div>
        </header>

        <!-- Showcase Media Image / Fallback Mockup -->
        <div
          pAnimateOnScroll
          [once]="true"
          [threshold]="0.08"
          enterClass="animate-enter fade-in-0 zoom-in-95 animate-duration-700"
          leaveClass="animate-leave fade-out-0"
          class="relative w-full rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-gradient-to-br from-slate-100 to-indigo-50/30 dark:from-slate-900 dark:to-indigo-950/20 shadow-xl aspect-[16/9] max-h-[460px]"
        >
          @if (project()?.mainImage && !imageError()) {
            <img
              [src]="project()?.mainImage"
              [alt]="(project()?.title | localize) || 'Project Main Image'"
              (error)="onImageError()"
              class="w-full h-full object-cover object-center"
              loading="eager"
              decoding="async"
            />
            <!-- Subtle top floating badge overlay -->
            <div class="absolute inset-x-4 top-4 flex items-center justify-between pointer-events-none z-10">
              <span class="backdrop-blur-md bg-slate-950/80 text-white text-xs font-bold px-3.5 py-1.5 rounded-full border border-white/20 shadow-sm flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{{ categoryName() }} • {{ isKhmer() ? 'ស្ថាបត្យកម្មប្រព័ន្ធ' : 'System Architecture' }}</span>
              </span>
              @if (project()?.liveUrl) {
                <a
                  [href]="project()?.liveUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="pointer-events-auto backdrop-blur-md bg-white/90 dark:bg-slate-900/90 hover:bg-white text-slate-900 dark:text-white text-xs font-bold px-3 py-1.5 rounded-full border border-slate-200/80 dark:border-slate-700 shadow-sm transition-all"
                >
                  {{ isKhmer() ? 'បើកកម្មវិធី ↗' : 'Launch App ↗' }}
                </a>
              }
            </div>
          } @else {
            <!-- Polished Decorative Fallback Showcase Banner -->
            <div class="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white text-center relative overflow-hidden">
              <div class="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>

              <div class="relative z-10 space-y-4 max-w-md">
                <div class="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-400 flex items-center justify-center mx-auto shadow-lg backdrop-blur-md">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>

                <div>
                  <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 mb-2">
                    {{ categoryName() }}
                  </span>
                  <h3 class="text-2xl sm:text-3xl font-black tracking-tight text-white">
                    {{ project()?.title | localize }}
                  </h3>
                  <p class="text-xs sm:text-sm text-slate-300 mt-1 max-w-sm mx-auto leading-relaxed">
                    {{ isKhmer() ? 'គម្រោងវិស្វកម្មសូហ្វវែរ និងដំណោះស្រាយបច្ចេកវិទ្យា' : 'Production engineering solution, computer vision pipeline, and full-stack architecture' }}
                  </p>
                </div>

                <!-- Core Technologies tags inside fallback -->
                <div class="flex flex-wrap items-center justify-center gap-1.5 pt-2">
                  @for (tech of (project()?.technologies || []).slice(0, 5); track tech) {
                    <span class="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/10 backdrop-blur-sm border border-white/10 text-slate-200">
                      {{ tech }}
                    </span>
                  }
                </div>
              </div>
            </div>
          }
        </div>

        <!-- Main Case Study Layout (2 Columns: 8 cols main, 4 cols sidebar) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <!-- Left Column: Problem, Solution, Architecture, Features, Gallery, Insights (8 cols) -->
          <div class="lg:col-span-8 space-y-10">
            <!-- Problem Statement Section -->
            @if (project()?.problem) {
              <section
                pAnimateOnScroll
                [once]="true"
                [threshold]="0.08"
                enterClass="animate-enter fade-in-0 slide-in-from-b-8 animate-duration-700"
                leaveClass="animate-leave fade-out-0"
                class="space-y-4 p-7 sm:p-8 rounded-3xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 shadow-2xs"
              >
                <div class="flex items-center gap-3 text-rose-700 dark:text-rose-400">
                  <div class="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-900/60 flex items-center justify-center shrink-0">
                    <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h2 class="text-xl sm:text-2xl font-black">
                      {{ isKhmer() ? 'បញ្ហាប្រឈម និងបរិបទ (The Challenge)' : 'The Challenge & Problem' }}
                    </h2>
                    <span class="text-xs text-rose-600/80 dark:text-rose-400/80">Pain points & requirements addressed</span>
                  </div>
                </div>

                <div
                  class="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base pt-2"
                  [innerHTML]="renderMarkdown(project()?.problem | localize)"
                ></div>
              </section>
            }

            <!-- Solution Section -->
            @if (project()?.solution) {
              <section
                pAnimateOnScroll
                [once]="true"
                [threshold]="0.08"
                enterClass="animate-enter fade-in-0 slide-in-from-b-8 animate-duration-700"
                leaveClass="animate-leave fade-out-0"
                class="space-y-4 p-7 sm:p-8 rounded-3xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 shadow-2xs"
              >
                <div class="flex items-center gap-3 text-emerald-700 dark:text-emerald-400">
                  <div class="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center shrink-0">
                    <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 class="text-xl sm:text-2xl font-black">
                      {{ isKhmer() ? 'ដំណោះស្រាយវិស្វកម្ម (The Solution)' : 'The Engineering Solution' }}
                    </h2>
                    <span class="text-xs text-emerald-600/80 dark:text-emerald-400/80">Architecture, methodology & outcome</span>
                  </div>
                </div>

                <div
                  class="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base pt-2"
                  [innerHTML]="renderMarkdown(project()?.solution | localize)"
                ></div>
              </section>
            }

            <!-- Full Description / Deep Dive -->
            @if (project()?.fullDescription) {
              <section
                pAnimateOnScroll
                [once]="true"
                [threshold]="0.08"
                enterClass="animate-enter fade-in-0 slide-in-from-b-8 animate-duration-700"
                leaveClass="animate-leave fade-out-0"
                class="space-y-4 p-7 sm:p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs backdrop-blur-sm"
              >
                <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {{ isKhmer() ? 'ព័ត៌មានលម្អិតអំពីស្ថាបត្យកម្មប្រព័ន្ធ' : 'System Overview & Architecture' }}
                </h2>

                <div
                  class="prose prose-indigo dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base"
                  [innerHTML]="renderMarkdown(project()?.fullDescription | localize)"
                ></div>
              </section>
            }

            <!-- Key Features List -->
            @if (featuresList().length > 0) {
              <section
                pAnimateOnScroll
                [once]="true"
                [threshold]="0.08"
                enterClass="animate-enter fade-in-0 slide-in-from-b-8 animate-duration-700"
                leaveClass="animate-leave fade-out-0"
                class="space-y-4 p-7 sm:p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs backdrop-blur-sm"
              >
                <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {{ isKhmer() ? 'មុខងារសំខាន់ៗ (Key Features)' : 'Key Features & Capabilities' }}
                </h2>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  @for (feat of featuresList(); track $index) {
                    <div class="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      <span class="w-5 h-5 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-xs">
                        ✓
                      </span>
                      <span class="leading-relaxed font-medium" [class.font-khmer]="isKhmer()">{{ feat }}</span>
                    </div>
                  }
                </div>
              </section>
            }

            <!-- Screenshots Gallery -->
            @if (project()?.screenshots && project()!.screenshots.length > 0) {
              <section
                pAnimateOnScroll
                [once]="true"
                [threshold]="0.08"
                enterClass="animate-enter fade-in-0 slide-in-from-b-8 animate-duration-700"
                leaveClass="animate-leave fade-out-0"
                class="space-y-4 p-7 sm:p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs backdrop-blur-sm"
              >
                <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {{ isKhmer() ? 'រូបភាពគម្រោង (Screenshots Gallery)' : 'Screenshots & UI Showcase' }}
                </h2>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  @for (shot of project()!.screenshots; track shot) {
                    <div class="relative h-56 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shadow-sm hover:scale-[1.02] transition-transform">
                      <img [src]="shot" alt="Screenshot" class="w-full h-full object-cover object-top" loading="lazy" decoding="async" />
                    </div>
                  }
                </div>
              </section>
            }

            <!-- Challenges & Lessons Learned -->
            @if (project()?.challenges || project()?.lessonsLearned) {
              <section
                pAnimateOnScroll
                [once]="true"
                [threshold]="0.08"
                enterClass="animate-enter fade-in-0 slide-in-from-b-8 animate-duration-700"
                leaveClass="animate-leave fade-out-0"
                class="grid grid-cols-1 sm:grid-cols-2 gap-6"
              >
                @if (project()?.challenges) {
                  <div class="p-6 rounded-3xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-3 shadow-2xs">
                    <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                      <span>{{ isKhmer() ? 'បញ្ហាបច្ចេកទេស' : 'Technical Challenges' }}</span>
                    </h3>
                    <div
                      class="prose prose-slate dark:prose-invert text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed"
                      [innerHTML]="renderMarkdown(project()?.challenges | localize)"
                    ></div>
                  </div>
                }

                @if (project()?.lessonsLearned) {
                  <div class="p-6 rounded-3xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40 space-y-3 shadow-2xs">
                    <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span class="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                      <span>{{ isKhmer() ? 'មេរៀនដែលទទួលបាន' : 'Key Takeaways' }}</span>
                    </h3>
                    <div
                      class="prose prose-slate dark:prose-invert text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed"
                      [innerHTML]="renderMarkdown(project()?.lessonsLearned | localize)"
                    ></div>
                  </div>
                }
              </section>
            }
          </div>

          <!-- Right Column Sticky Sidebar: Specs & Stack (4 cols) -->
          <aside class="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <div class="p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-sm backdrop-blur-md space-y-6">
              <h3 class="text-base font-extrabold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span>{{ isKhmer() ? 'ព័ត៌មានសង្ខេបគម្រោង' : 'Project Specifications' }}</span>
                <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
              </h3>

              <div class="space-y-4 text-xs sm:text-sm">
                <!-- Category -->
                <div>
                  <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {{ isKhmer() ? 'ប្រភេទ' : 'Category' }}
                  </div>
                  <div class="font-bold text-slate-800 dark:text-slate-200 mt-1">
                    {{ categoryName() }}
                  </div>
                </div>

                <!-- Status -->
                <div>
                  <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {{ isKhmer() ? 'ស្ថានភាព' : 'Status' }}
                  </div>
                  <div class="inline-flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                    <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span class="capitalize">{{ project()?.status === 'published' ? 'Production Live' : project()?.status }}</span>
                  </div>
                </div>

                <!-- Timeline / Date -->
                @if (project()?.startDate || project()?.completionDate) {
                  <div>
                    <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      {{ isKhmer() ? 'កាលបរិច្ឆេទ' : 'Timeline' }}
                    </div>
                    <div class="font-semibold text-slate-700 dark:text-slate-300 mt-1">
                      {{ formatTimeline(project()?.startDate, project()?.completionDate) }}
                    </div>
                  </div>
                }
              </div>

              <!-- Tech Stack Breakdown -->
              <div class="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {{ isKhmer() ? 'បច្ចេកវិទ្យាដែលបានប្រើ' : 'Technologies Used' }}
                </div>
                <div class="flex flex-wrap gap-1.5">
                  @for (tech of project()?.technologies; track tech) {
                    <span class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                      {{ tech }}
                    </span>
                  }
                </div>
              </div>

              <!-- Action Quick Links in Sidebar -->
              <div class="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                @if (project()?.liveUrl) {
                  <a
                    [href]="project()?.liveUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold inline-flex items-center justify-center gap-2 shadow-xs transition-all"
                  >
                    <span>{{ isKhmer() ? 'បើកមើលផ្ទាល់' : 'Visit Live Deployment' }}</span>
                    <svg class="w-3.5 h-3.5 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                }

                @if (project()?.githubUrl) {
                  <a
                    [href]="project()?.githubUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold inline-flex items-center justify-center gap-2 shadow-xs transition-all"
                  >
                    <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                    <span>{{ isKhmer() ? 'មើលកូដ GitHub' : 'View GitHub Repo' }}</span>
                  </a>
                }
              </div>
            </div>
          </aside>
        </div>

        <!-- Related Projects Section per PRD Section 8.7 -->
        @if (relatedProjects().length > 0) {
          <section
            pAnimateOnScroll
            [once]="true"
            [threshold]="0.08"
            enterClass="animate-enter fade-in-0 slide-in-from-b-8 animate-duration-700"
            leaveClass="animate-leave fade-out-0"
            class="space-y-6 pt-12 border-t border-slate-200 dark:border-slate-800"
          >
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {{ isKhmer() ? 'គម្រោងពាក់ព័ន្ធផ្សេងទៀត' : 'Related Case Studies' }}
                </h2>
                <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {{ isKhmer() ? 'ស្វែងយល់បន្ថែមអំពីគម្រោងស្រដៀងគ្នានេះ' : 'Explore more projects within a similar domain or tech stack.' }}
                </p>
              </div>

              <a
                routerLink="/projects"
                class="hidden sm:inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <span>{{ isKhmer() ? 'មើលទាំងអស់' : 'View all projects' }}</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              @for (rel of relatedProjects(); track rel._id) {
                <div
                  pAnimateOnScroll
                  [once]="true"
                  [threshold]="0.08"
                  enterClass="animate-enter fade-in-0 slide-in-from-b-8 animate-duration-700"
                  leaveClass="animate-leave fade-out-0"
                  class="h-full"
                >
                  <app-project-card [project]="rel"></app-project-card>
                </div>
              }
            </div>
          </section>
        }
      }
    </div>
  `,
})
export class ProjectDetailComponent implements OnInit, OnDestroy {
  private readonly portfolioService = inject(PortfolioService);
  private readonly languageService = inject(LanguageService);
  private readonly seoService = inject(SeoService);
  private readonly route = inject(ActivatedRoute);
  private syncSub?: Subscription;

  public readonly project = signal<Project | null>(null);
  public readonly relatedProjects = signal<Project[]>([]);
  public readonly isLoading = signal<boolean>(true);
  public readonly error = signal<string | null>(null);
  public readonly imageError = signal<boolean>(false);
  public readonly currentSlug = signal<string | null>(null);

  public readonly isKhmer = computed(() => this.languageService.currentLang() === 'kh');

  public readonly categoryName = computed<string>(() => {
    const p = this.project();
    if (!p || !p.category) return 'General';
    if (typeof p.category === 'object' && 'name' in p.category) {
      const cat = p.category as Category;
      return this.isKhmer() ? (cat.name?.kh || cat.name?.en || 'General') : (cat.name?.en || 'General');
    }
    return String(p.category);
  });

  public readonly featuresList = computed<string[]>(() => {
    const p = this.project();
    if (!p || !p.features) return [];
    if (this.isKhmer() && p.features.kh && p.features.kh.length > 0) {
      return p.features.kh;
    }
    return p.features.en || [];
  });

  public onImageError(): void {
    this.imageError.set(true);
  }

  public ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      this.currentSlug.set(slug);
      if (slug) {
        this.loadProjectDetails(slug);
      } else {
        this.error.set('No project identifier specified');
        this.isLoading.set(false);
      }
    });

    if (this.portfolioService?.dataMutated$) {
      this.syncSub = this.portfolioService.dataMutated$.subscribe((mutation) => {
        if (!mutation.type || mutation.type === 'project' || mutation.type === 'category') {
          const s = this.currentSlug();
          if (s) {
            this.loadProjectDetails(s);
          }
        }
      });
    }
  }

  @HostListener('window:focus')
  public onWindowFocus(): void {
    const s = this.currentSlug();
    if (s) {
      this.loadProjectDetails(s);
    }
  }

  public ngOnDestroy(): void {
    this.syncSub?.unsubscribe();
  }

  public loadProjectDetails(slug: string): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.imageError.set(false);

    this.portfolioService.getProjectBySlug(slug).subscribe({
      next: (res) => {
        if (res && res.data) {
          const current = res.data;
          this.project.set(current);
          this.loadRelatedProjects(current);

          this.seoService.updateMetaTags({
            title: current.title?.en || current.title?.kh,
            description: current.shortDescription?.en || current.shortDescription?.kh,
            image: current.mainImage,
            type: 'website',
            keywords: current.technologies?.join(', '),
          });
        } else {
          this.error.set('Project details could not be found.');
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set(
          this.isKhmer()
            ? 'មិនអាចទាញយកព័ត៌មានលម្អិតគម្រោងបានទេ។'
            : 'Unable to load project details.',
        );
        this.isLoading.set(false);
      },
    });
  }

  public loadRelatedProjects(current: Project): void {
    const catSlug = typeof current.category === 'object' && 'slug' in current.category
      ? (current.category as Category).slug
      : undefined;

    this.portfolioService.getProjects({ limit: 4, category: catSlug }).pipe(
      catchError(() => of(null)),
    ).subscribe({
      next: (res) => {
        if (res && res.data && res.data.items) {
          // Filter out the current project and limit to 3
          const related = res.data.items
            .filter((p) => p._id !== current._id && p.slug !== current.slug)
            .slice(0, 3);
          this.relatedProjects.set(related);
        }
      },
    });
  }

  public renderMarkdown(rawText?: string | string[] | null): string {
    if (!rawText) return '';
    const text = Array.isArray(rawText) ? rawText.join('\n\n') : rawText;
    try {
      return marked.parse(text) as string;
    } catch {
      return text;
    }
  }

  public formatDate(date?: string | Date): string {
    if (!date) return '';
    return formatCalendarDate(date, this.isKhmer() ? 'km-KH' : 'en-US', {
      year: 'numeric',
      month: 'short',
    });
  }

  public formatTimeline(startDate?: string | Date, completionDate?: string | Date): string {
    const start = startDate ? this.formatDate(startDate) : '';
    const end = completionDate ? this.formatDate(completionDate) : (this.isKhmer() ? 'បច្ចុប្បន្ន' : 'Present');
    if (start && end) return `${start} – ${end}`;
    return end || start || '';
  }

  public goBackToProjects(): void {
    window.location.href = '/projects';
  }
}
