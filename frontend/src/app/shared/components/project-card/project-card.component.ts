import { Component, Input, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Project, Category } from '../../../core/models';
import { LanguageService } from '../../../core/services/language.service';
import { LocalizePipe } from '../../pipes';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule, RouterLink, LocalizePipe],
  template: `
    <article
      class="group relative flex flex-col justify-between rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-400 dark:hover:border-indigo-500/60 transition-all duration-300"
    >
      <div class="space-y-4">
        <!-- Media / Cover Header -->
        <div class="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          @if (project.mainImage) {
            <img
              [src]="project.mainImage"
              [alt]="(project.title | localize) || 'Project thumbnail'"
              class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          } @else {
            <div class="w-full h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 bg-gradient-to-br from-indigo-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
              <svg class="w-12 h-12 mb-2 stroke-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span class="text-xs font-semibold uppercase tracking-wider">Preview Coming Soon</span>
            </div>
          }

          <!-- Overlay Badges -->
          <div class="absolute inset-x-4 top-4 flex items-center justify-between pointer-events-none">
            <!-- Category Badge -->
            <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 backdrop-blur-md shadow-sm border border-slate-200/50 dark:border-slate-700/50">
              {{ categoryName() }}
            </span>

            <!-- Featured Indicator -->
            @if (project.featured && showFeaturedBadge) {
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-md shadow-amber-500/20">
                <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>{{ isKhmer() ? 'គម្រោងពិសេស' : 'Featured' }}</span>
              </span>
            }
          </div>
        </div>

        <!-- Body Content -->
        <div class="px-6 space-y-3">
          <h3 class="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
            <a [routerLink]="['/projects', project.slug]">
              {{ project.title | localize }}
            </a>
          </h3>

          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2" [class.font-khmer]="isKhmer()">
            {{ project.shortDescription | localize }}
          </p>

          <!-- Technologies Chips -->
          @if (project.technologies && project.technologies.length > 0) {
            <div class="flex flex-wrap gap-1.5 pt-1">
              @for (tech of displayedTech(); track tech) {
                <span class="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {{ tech }}
                </span>
              }
              @if (remainingTechCount() > 0) {
                <span class="px-2 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                  +{{ remainingTechCount() }}
                </span>
              }
            </div>
          }
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="px-6 py-4 mt-6 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
        <a
          [routerLink]="['/projects', project.slug]"
          class="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
        >
          <span>{{ isKhmer() ? 'មើលព័ត៌មានលម្អិត' : 'View Case Study' }}</span>
          <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>

        <!-- External Quick Links -->
        <div class="flex items-center gap-2">
          @if (project.githubUrl) {
            <a
              [href]="project.githubUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-700 flex items-center justify-center transition-colors"
              [attr.aria-label]="'GitHub repository for ' + (project.title.en || 'project')"
              title="GitHub Repository"
            >
              <svg class="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
          }

          @if (project.liveUrl) {
            <a
              [href]="project.liveUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-700 flex items-center justify-center transition-colors"
              [attr.aria-label]="'Live demo for ' + (project.title.en || 'project')"
              title="Live Demo"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          }
        </div>
      </div>
    </article>
  `,
})
export class ProjectCardComponent {
  private readonly languageService = inject(LanguageService);

  @Input({ required: true }) public project!: Project;
  @Input() public showFeaturedBadge = true;

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
