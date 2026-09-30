import { Component, Input, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BlogPost, Category } from '../../../core/models';
import { LanguageService } from '../../../core/services/language.service';
import { LocalizePipe } from '../../pipes';

@Component({
  selector: 'app-blog-card',
  standalone: true,
  imports: [CommonModule, RouterLink, LocalizePipe],
  template: `
    <article
      class="group relative flex flex-col justify-between rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-400 dark:hover:border-indigo-500/60 transition-all duration-300"
    >
      <div class="space-y-4">
        <!-- Cover Image Container -->
        <div class="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          @if (post.coverImage) {
            <img
              [src]="post.coverImage"
              [alt]="(post.title | localize) || 'Article thumbnail'"
              class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          } @else {
            <div class="w-full h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 bg-gradient-to-br from-indigo-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
              <svg class="w-10 h-10 mb-2 stroke-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <span class="text-[11px] font-semibold uppercase tracking-wider">Article Preview</span>
            </div>
          }

          <!-- Floating Badges -->
          <div class="absolute inset-x-4 top-4 flex items-center justify-between pointer-events-none">
            <!-- Category Badge -->
            <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 backdrop-blur-md shadow-sm border border-slate-200/50 dark:border-slate-700/50">
              {{ categoryName() }}
            </span>

            <!-- Featured Badge -->
            @if (post.featured && showFeaturedBadge) {
              <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-md shadow-amber-500/20">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>{{ isKhmer() ? 'អត្ថបទពិសេស' : 'Featured' }}</span>
              </span>
            }
          </div>
        </div>

        <!-- Body Content -->
        <div class="px-6 space-y-3">
          <!-- Metadata Row: Date & Reading Time -->
          <div class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <time [attr.datetime]="post.publishedAt || post.createdAt">
              {{ formatDate(post.publishedAt || post.createdAt) }}
            </time>
            <span>•</span>
            <span class="flex items-center gap-1">
              <svg class="w-3.5 h-3.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ post.readingTime || 5 }} {{ isKhmer() ? 'នាទីអាន' : 'min read' }}</span>
            </span>
          </div>

          <!-- Title -->
          <h3 class="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
            <a [routerLink]="['/blog', post.slug]">
              {{ post.title | localize }}
            </a>
          </h3>

          <!-- Excerpt -->
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2" [class.font-khmer]="isKhmer()">
            {{ post.excerpt | localize }}
          </p>

          <!-- Tags -->
          @if (post.tags && post.tags.length > 0) {
            <div class="flex flex-wrap gap-1.5 pt-1">
              @for (tag of displayedTags(); track tag) {
                <span class="px-2 py-0.5 rounded-lg text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  #{{ tag }}
                </span>
              }
              @if (remainingTagsCount() > 0) {
                <span class="px-2 py-0.5 rounded-lg text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-400">
                  +{{ remainingTagsCount() }}
                </span>
              }
            </div>
          }
        </div>
      </div>

      <!-- Footer Action -->
      <div class="px-6 py-4 mt-6 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <a
          [routerLink]="['/blog', post.slug]"
          class="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
        >
          <span>{{ isKhmer() ? 'អានបន្ត' : 'Read Article' }}</span>
          <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>

        @if (post.viewCount) {
          <span class="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>{{ post.viewCount }}</span>
          </span>
        }
      </div>
    </article>
  `,
})
export class BlogCardComponent {
  private readonly languageService = inject(LanguageService);

  @Input({ required: true }) public post!: BlogPost;
  @Input() public showFeaturedBadge = true;

  public readonly isKhmer = computed(() => this.languageService.currentLang() === 'kh');

  public readonly categoryName = computed<string>(() => {
    if (!this.post || !this.post.category) return 'Article';
    if (typeof this.post.category === 'object' && 'name' in this.post.category) {
      const cat = this.post.category as Category;
      return this.isKhmer() ? (cat.name?.kh || cat.name?.en || 'Article') : (cat.name?.en || 'Article');
    }
    return String(this.post.category);
  });

  public readonly displayedTags = computed<string[]>(() => {
    return (this.post?.tags || []).slice(0, 3);
  });

  public readonly remainingTagsCount = computed<number>(() => {
    const total = this.post?.tags?.length || 0;
    return total > 3 ? total - 3 : 0;
  });

  public formatDate(date?: string | Date): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString(this.isKhmer() ? 'km-KH' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}
