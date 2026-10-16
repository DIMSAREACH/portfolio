import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { AuthService } from '../../../core/services/auth.service';
import { LanguageService } from '../../../core/services/language.service';
import { DashboardStats } from '../../../core/models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-8 animate-fadeIn">
      <!-- Welcome Header & Quick Actions Bar -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-indigo-900/10 via-violet-900/5 to-transparent dark:from-indigo-950/40 dark:via-purple-950/20 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
        <div>
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300" [class.font-khmer]="isKhmer()">
              {{ isKhmer() ? 'ទិដ្ឋភាពទូទៅ' : 'Overview' }}
            </span>
            <span class="text-xs text-slate-500 dark:text-slate-400" [class.font-khmer]="isKhmer()">
              {{ isKhmer() ? 'ស្ថិតិទិន្នន័យផ្ទាល់' : 'Live Database Metrics' }}
            </span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1" [class.font-khmer]="isKhmer()">
            {{ isKhmer() ? 'សូមស្វាគមន៍, ' + adminName : 'Welcome back, ' + adminName }}
          </h1>
          <p class="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl" [class.font-khmer]="isKhmer()">
            {{ isKhmer() ? 'នេះជាការសង្ខេបទិន្នន័យជាក់ស្តែងនៃគម្រោង ជំនាញ បទពិសោធន៍ សារសាកសួរ និងទិន្នន័យប្រវត្តិរូបសង្ខេបរបស់អ្នក។' : 'Here is a real-time summary of your portfolio projects, technical skills, career timeline, inquiries, and CV analytics.' }}
          </p>
        </div>

        <!-- Quick Action Buttons -->
        <div class="flex flex-wrap items-center gap-3">
          <button
            type="button"
            (click)="loadStats()"
            [disabled]="isLoading()"
            class="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50"
            [class.font-khmer]="isKhmer()"
            [title]="isKhmer() ? 'ផ្ទុកទិន្នន័យឡើងវិញ' : 'Refresh statistics'"
            [attr.aria-label]="isKhmer() ? 'ផ្ទុកទិន្នន័យឡើងវិញ' : 'Refresh statistics'"
          >
            <svg
              class="w-4 h-4 text-slate-500 dark:text-slate-400"
              [class.animate-spin]="isLoading()"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{{ isKhmer() ? 'ផ្ទុកឡើងវិញ' : 'Refresh' }}</span>
          </button>

          <a
            routerLink="/admin/projects"
            class="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm hover:shadow transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            [class.font-khmer]="isKhmer()"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>{{ isKhmer() ? 'គម្រោងថ្មី' : 'New Project' }}</span>
          </a>
        </div>
      </div>

      <!-- Error State -->
      @if (errorMessage()) {
        <div class="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start justify-between gap-3">
          <div class="flex items-center gap-3">
            <svg class="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-sm font-medium text-rose-700 dark:text-rose-300">
              {{ errorMessage() }}
            </p>
          </div>
          <button
            type="button"
            (click)="loadStats()"
            class="text-xs font-semibold text-rose-700 dark:text-rose-300 hover:underline shrink-0"
          >
            Try Again
          </button>
        </div>
      }

      <!-- Loading Skeletons -->
      @if (isLoading()) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          @for (placeholder of [1, 2, 3, 4, 5]; track placeholder) {
            <div class="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm animate-pulse space-y-3">
              <div class="flex justify-between items-center">
                <div class="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800"></div>
                <div class="w-16 h-5 rounded-full bg-slate-200 dark:bg-slate-800"></div>
              </div>
              <div class="w-20 h-7 rounded bg-slate-200 dark:bg-slate-800 mt-2"></div>
              <div class="w-32 h-4 rounded bg-slate-200 dark:bg-slate-800"></div>
            </div>
          }
        </div>
      } @else if (stats(); as s) {
        <!-- Real Database Metrics Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          <!-- 1. Total Projects (with Published / Draft breakdown) -->
          <div class="group relative bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800 shadow-xs hover:shadow-md transition-all duration-300">
            <div class="flex items-center justify-between">
              <div class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-2xs">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <a
                routerLink="/admin/projects"
                class="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                [class.font-khmer]="isKhmer()"
              >
                <span>{{ isKhmer() ? 'គ្រប់គ្រង' : 'Manage' }}</span>
                <span>&rarr;</span>
              </a>
            </div>
            <div class="mt-4">
              <span class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400" [class.font-khmer]="isKhmer()">
                {{ isKhmer() ? 'គម្រោងសរុប' : 'Total Projects' }}
              </span>
              <div class="text-3xl font-extrabold text-slate-900 dark:text-white mt-0.5 tracking-tight">{{ s.totalProjects }}</div>
            </div>
            <div class="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs" [class.font-khmer]="isKhmer()">
              <span class="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                {{ isKhmer() ? (s.publishedProjects + ' បានផ្សាយ') : (s.publishedProjects + ' Published') }}
              </span>
              <span class="inline-flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-medium">
                <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                {{ isKhmer() ? (s.draftProjects + ' សេចក្តីព្រាង') : (s.draftProjects + ' Drafts') }}
              </span>
            </div>
          </div>

          <!-- 2. Unread Messages -->
          <div class="group relative bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-800 shadow-xs hover:shadow-md transition-all duration-300">
            <div class="flex items-center justify-between">
              <div class="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shadow-2xs">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <a
                routerLink="/admin/messages"
                class="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                [class.font-khmer]="isKhmer()"
              >
                <span>{{ isKhmer() ? 'ប្រអប់សំបុត្រ' : 'Inbox' }}</span>
                <span>&rarr;</span>
              </a>
            </div>
            <div class="mt-4">
              <span class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400" [class.font-khmer]="isKhmer()">
                {{ isKhmer() ? 'សារមិនទាន់អាន' : 'Unread Inquiries' }}
              </span>
              <div class="flex items-baseline gap-2 mt-0.5">
                <div class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{{ s.unreadMessages }}</div>
                @if (s.unreadMessages > 0) {
                  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 animate-pulse" [class.font-khmer]="isKhmer()">
                    {{ isKhmer() ? 'ត្រូវការឆ្លើយតប' : 'Needs Action' }}
                  </span>
                }
              </div>
            </div>
            <div class="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400" [class.font-khmer]="isKhmer()">
              <span>{{ isKhmer() ? 'សារទទួលបានសរុប:' : 'Total Received:' }}</span>
              <span class="font-semibold text-slate-700 dark:text-slate-300">{{ s.totalMessages }}</span>
            </div>
          </div>

          <!-- 3. CV Downloads -->
          <div class="group relative bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 hover:border-cyan-300 dark:hover:border-cyan-800 shadow-xs hover:shadow-md transition-all duration-300">
            <div class="flex items-center justify-between">
              <div class="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shadow-2xs">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <a
                routerLink="/admin/cv"
                class="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                [class.font-khmer]="isKhmer()"
              >
                <span>{{ isKhmer() ? 'ឯកសារ CV' : 'CV File' }}</span>
                <span>&rarr;</span>
              </a>
            </div>
            <div class="mt-4">
              <span class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400" [class.font-khmer]="isKhmer()">
                {{ isKhmer() ? 'ការទាញយក CV' : 'CV Downloads' }}
              </span>
              <div class="text-3xl font-extrabold text-slate-900 dark:text-white mt-0.5 tracking-tight">{{ s.cvDownloads }}</div>
            </div>
            <div class="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400" [class.font-khmer]="isKhmer()">
              <span>{{ isKhmer() ? 'ការចាប់អារម្មណ៍' : 'Recruiter Engagement' }}</span>
              <span class="font-semibold text-slate-700 dark:text-slate-300">{{ isKhmer() ? 'ពេញមួយជីវិត' : 'Lifetime' }}</span>
            </div>
          </div>

          <!-- 4. Total Skills -->
          <div class="group relative bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-800 shadow-xs hover:shadow-md transition-all duration-300">
            <div class="flex items-center justify-between">
              <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-2xs">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <a
                routerLink="/admin/skills"
                class="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                [class.font-khmer]="isKhmer()"
              >
                <span>{{ isKhmer() ? 'ជំនាញ' : 'Skills' }}</span>
                <span>&rarr;</span>
              </a>
            </div>
            <div class="mt-4">
              <span class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400" [class.font-khmer]="isKhmer()">
                {{ isKhmer() ? 'ជំនាញសកម្ម' : 'Active Skills' }}
              </span>
              <div class="text-3xl font-extrabold text-slate-900 dark:text-white mt-0.5 tracking-tight">{{ s.totalSkills }}</div>
            </div>
            <div class="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400" [class.font-khmer]="isKhmer()">
              <span>{{ isKhmer() ? 'បច្ចេកវិទ្យា' : 'Technologies' }}</span>
              <span class="font-semibold text-slate-700 dark:text-slate-300">{{ isKhmer() ? 'បានកត់ត្រា' : 'Cataloged' }}</span>
            </div>
          </div>

          <!-- 5. Total Experience Entries -->
          <div class="group relative bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-800 shadow-xs hover:shadow-md transition-all duration-300">
            <div class="flex items-center justify-between">
              <div class="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-2xs">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <a
                routerLink="/admin/experience"
                class="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                [class.font-khmer]="isKhmer()"
              >
                <span>{{ isKhmer() ? 'បន្ទាត់ពេលវេលា' : 'Timeline' }}</span>
                <span>&rarr;</span>
              </a>
            </div>
            <div class="mt-4">
              <span class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400" [class.font-khmer]="isKhmer()">
                {{ isKhmer() ? 'បទពិសោធន៍ការងារ' : 'Career Experiences' }}
              </span>
              <div class="text-3xl font-extrabold text-slate-900 dark:text-white mt-0.5 tracking-tight">{{ s.totalExperiences }}</div>
            </div>
            <div class="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400" [class.font-khmer]="isKhmer()">
              <span>{{ isKhmer() ? 'តួនាទី & មុខតំណែង' : 'Roles & Positions' }}</span>
              <span class="font-semibold text-slate-700 dark:text-slate-300">{{ isKhmer() ? 'បានចងក្រង' : 'Documented' }}</span>
            </div>
          </div>
        </div>

        <!-- Section 2: Recent Inquiries & Quick Navigation Shortcuts -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Recent Unread Messages (2 cols on desktop) -->
          <div class="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden">
            <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h2 class="text-base font-bold text-slate-900 dark:text-white" [class.font-khmer]="isKhmer()">
                  {{ isKhmer() ? 'សារមិនទាន់អានថ្មីៗ' : 'Recent Unread Messages' }}
                </h2>
                <p class="text-xs text-slate-500 dark:text-slate-400" [class.font-khmer]="isKhmer()">
                  {{ isKhmer() ? 'សារសាកសួរចុងក្រោយដែលបានផ្ញើតាមរយៈទម្រង់ទំនាក់ទំនង' : 'Latest inquiries sent through the contact form' }}
                </p>
              </div>
              <a
                routerLink="/admin/messages"
                class="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
                [class.font-khmer]="isKhmer()"
              >
                {{ isKhmer() ? 'មើលសារទាំងអស់' : 'View all messages' }} &rarr;
              </a>
            </div>

            <!-- Messages List -->
            @if (s.recentMessages && s.recentMessages.length > 0) {
              <div class="divide-y divide-slate-100 dark:divide-slate-800">
                @for (msg of s.recentMessages; track msg._id) {
                  <div class="p-5 hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors flex items-start gap-4">
                    <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                      {{ getInitials(msg.name) }}
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center justify-between gap-2">
                        <h3 class="text-sm font-semibold text-slate-900 dark:text-white truncate">
                          {{ msg.name }}
                        </h3>
                        <span class="text-[11px] text-slate-400 shrink-0 font-mono">
                          {{ formatDate(msg.createdAt) }}
                        </span>
                      </div>
                      <div class="text-xs text-slate-500 dark:text-slate-400 truncate font-mono">
                        {{ msg.email }}
                      </div>
                      <div class="text-xs font-medium text-slate-800 dark:text-slate-200 mt-1 truncate">
                        {{ msg.subject }}
                      </div>
                      <p class="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-0.5">
                        {{ msg.message }}
                      </p>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <!-- Empty State for Recent Messages -->
              <div class="p-8 text-center flex flex-col items-center justify-center">
                <div class="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 class="text-sm font-bold text-slate-900 dark:text-white" [class.font-khmer]="isKhmer()">
                  {{ isKhmer() ? 'គ្មានសារមិនទាន់អាន!' : 'Inbox Zero!' }}
                </h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm" [class.font-khmer]="isKhmer()">
                  {{ isKhmer() ? 'អ្នកមិនមានសារដែលមិនទាន់អាននោះទេ។ សារទាំងអស់ត្រូវបានពិនិត្យរួចរាល់។' : 'You have no pending unread inquiries. All messages have been reviewed.' }}
                </p>
                <a
                  routerLink="/admin/messages"
                  class="mt-4 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all"
                  [class.font-khmer]="isKhmer()"
                >
                  {{ isKhmer() ? 'មើលប័ណ្ណសារសារ' : 'Browse Message Archive' }}
                </a>
              </div>
            }
          </div>

          <!-- Quick Navigation Shortcuts -->
          <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs p-6 space-y-4">
            <div>
              <h2 class="text-base font-bold text-slate-900 dark:text-white" [class.font-khmer]="isKhmer()">
                {{ isKhmer() ? 'ផ្លូវកាត់រហ័ស' : 'Quick Shortcuts' }}
              </h2>
              <p class="text-xs text-slate-500 dark:text-slate-400" [class.font-khmer]="isKhmer()">
                {{ isKhmer() ? 'ផ្នែកគ្រប់គ្រងដែលប្រើប្រាស់ញឹកញាប់' : 'Frequently used administration sections' }}
              </p>
            </div>

            <div class="space-y-2.5">
              <a
                routerLink="/admin/profile"
                class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50/70 dark:hover:bg-indigo-950/40 border border-slate-100 dark:border-slate-800/80 transition-colors group"
              >
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <div class="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" [class.font-khmer]="isKhmer()">
                      {{ isKhmer() ? 'ព័ត៌មានប្រវត្តិរូប' : 'Profile Information' }}
                    </div>
                    <div class="text-[11px] text-slate-500 dark:text-slate-400" [class.font-khmer]="isKhmer()">
                      {{ isKhmer() ? 'ធ្វើបច្ចុប្បន្នភាពជីវប្រវត្តិ ចំណងជើង និងរូបថត' : 'Update bio, titles, and avatar' }}
                    </div>
                  </div>
                </div>
                <span class="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all text-xs">&rarr;</span>
              </a>

              <a
                routerLink="/admin/projects"
                class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50/70 dark:hover:bg-indigo-950/40 border border-slate-100 dark:border-slate-800/80 transition-colors group"
              >
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <div class="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" [class.font-khmer]="isKhmer()">
                      {{ isKhmer() ? 'ការបង្ហាញគម្រោង' : 'Portfolio Showcase' }}
                    </div>
                    <div class="text-[11px] text-slate-500 dark:text-slate-400" [class.font-khmer]="isKhmer()">
                      {{ isKhmer() ? 'គ្រប់គ្រងករណីសិក្សា និងស្លាកបច្ចេកវិទ្យា' : 'Manage case studies and stack tags' }}
                    </div>
                  </div>
                </div>
                <span class="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all text-xs">&rarr;</span>
              </a>

              <a
                routerLink="/admin/skills"
                class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50/70 dark:hover:bg-emerald-950/40 border border-slate-100 dark:border-slate-800/80 transition-colors group"
              >
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <div>
                    <div class="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" [class.font-khmer]="isKhmer()">
                      {{ isKhmer() ? 'ជំនាញបច្ចេកទេស' : 'Technical Skills' }}
                    </div>
                    <div class="text-[11px] text-slate-500 dark:text-slate-400" [class.font-khmer]="isKhmer()">
                      {{ isKhmer() ? 'គ្រប់គ្រងជំនាញ និងកម្រិតជំនាញ' : 'Manage stack tags and proficiencies' }}
                    </div>
                  </div>
                </div>
                <span class="text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all text-xs">&rarr;</span>
              </a>

              <a
                routerLink="/admin/cv"
                class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-cyan-50/70 dark:hover:bg-cyan-950/40 border border-slate-100 dark:border-slate-800/80 transition-colors group"
              >
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-900/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center text-xs">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </div>
                  <div>
                    <div class="text-xs font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors" [class.font-khmer]="isKhmer()">
                      {{ isKhmer() ? 'ឯកសារប្រវត្តិរូប CV' : 'Resume & CV Asset' }}
                    </div>
                    <div class="text-[11px] text-slate-500 dark:text-slate-400" [class.font-khmer]="isKhmer()">
                      {{ isKhmer() ? 'ផ្ទុកឡើង PDF និងតាមដានការទាញយក' : 'Upload PDF and monitor downloads' }}
                    </div>
                  </div>
                </div>
                <span class="text-slate-400 group-hover:text-cyan-600 group-hover:translate-x-0.5 transition-all text-xs">&rarr;</span>
              </a>

              <a
                routerLink="/admin/settings"
                class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800/80 transition-colors group"
              >
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <div class="text-xs font-bold text-slate-900 dark:text-white" [class.font-khmer]="isKhmer()">
                      {{ isKhmer() ? 'ការកំណត់ប្រព័ន្ធ' : 'Platform Settings' }}
                    </div>
                    <div class="text-[11px] text-slate-500 dark:text-slate-400" [class.font-khmer]="isKhmer()">
                      {{ isKhmer() ? 'កំណត់ការជូនដំណឹង & ការថែទាំ' : 'Configure notifications & maintenance' }}
                    </div>
                  </div>
                </div>
                <span class="text-slate-400 group-hover:translate-x-0.5 transition-all text-xs">&rarr;</span>
              </a>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  private readonly portfolioService = inject(PortfolioService);
  private readonly authService = inject(AuthService);
  public readonly languageService = inject(LanguageService);
  public readonly isKhmer = this.languageService.isKhmer;

  public readonly stats = signal<DashboardStats | null>(null);
  public readonly isLoading = signal<boolean>(true);
  public readonly errorMessage = signal<string | null>(null);

  public get adminName(): string {
    const user = this.authService.currentUser();
    return user?.fullName || 'Admin';
  }

  public ngOnInit(): void {
    this.loadStats();
  }

  public loadStats(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.portfolioService.getDashboardStats().subscribe({
      next: (res) => {
        this.stats.set(res.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          err?.error?.message || 'Failed to load dashboard metrics. Please check connection and try again.',
        );
      },
    });
  }

  public getInitials(name: string): string {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  }

  public formatDate(dateStr: string | Date | undefined): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
