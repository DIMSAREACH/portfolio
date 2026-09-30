import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { of, catchError } from 'rxjs';
import { Marked } from 'marked';
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-markdown';

import { PortfolioService } from '../../../core/services/portfolio.service';
import { LanguageService } from '../../../core/services/language.service';
import { BlogPost, Category } from '../../../core/models';
import {
  BlogCardComponent,
  SkeletonLoaderComponent,
  EmptyStateComponent,
  LocalizePipe,
} from '../../../shared';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    BlogCardComponent,
    SkeletonLoaderComponent,
    EmptyStateComponent,
    LocalizePipe,
  ],
  template: `
    <div class="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      <!-- Breadcrumb & Back Link -->
      <nav aria-label="Breadcrumb" class="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
        <a routerLink="/blog" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors inline-flex items-center gap-1 font-semibold">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>{{ isKhmer() ? 'ត្រឡប់ទៅកាន់អត្ថបទទាំងអស់' : 'Back to Blog' }}</span>
        </a>
        <span>/</span>
        <span class="text-slate-800 dark:text-slate-200 font-semibold truncate max-w-xs sm:max-w-md">
          {{ (post()?.title | localize) || (isKhmer() ? 'អត្ថបទ' : 'Article') }}
        </span>
      </nav>

      @if (isLoading()) {
        <!-- Skeleton Loading State -->
        <div class="max-w-3xl mx-auto space-y-8">
          <app-skeleton-loader type="text" [count]="2"></app-skeleton-loader>
          <div class="h-80 sm:h-96 rounded-3xl bg-slate-100 dark:bg-slate-800 animate-pulse"></div>
          <app-skeleton-loader type="text" [count]="6"></app-skeleton-loader>
        </div>
      } @else if (error() || !post()) {
        <!-- Error / Not Found State -->
        <app-empty-state
          [title]="isKhmer() ? 'រកមិនឃើញអត្ថបទនេះទេ' : 'Article Not Found'"
          [description]="error() || (isKhmer() ? 'អត្ថបទដែលអ្នកកំពុងស្វែងរកប្រហែលជាត្រូវបានផ្លាស់ប្តូរ ឬលុបចេញ។' : 'The article you are looking for may have been moved or removed.')"
          [actionText]="isKhmer() ? 'ត្រឡប់ទៅកាន់អត្ថបទទាំងអស់' : 'Back to Blog'"
          (actionClick)="goBackToBlog()"
        ></app-empty-state>
      } @else {
        <!-- Article Header & Reading Column (PRD 8.9 & Design.md 12.3: max-w-3xl / 640-768px for optimal reading) -->
        <article class="max-w-3xl mx-auto space-y-8">
          <!-- Metadata Header -->
          <header class="space-y-6">
            <!-- Category and Featured Badges -->
            <div class="flex flex-wrap items-center gap-3">
              <span class="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
                {{ categoryName() }}
              </span>

              @if (post()?.featured) {
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-md shadow-amber-500/20">
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span>{{ isKhmer() ? 'អត្ថបទពិសេស' : 'Featured Story' }}</span>
                </span>
              }

              <!-- Publication Date -->
              <span class="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <time [attr.datetime]="post()?.publishedAt || post()?.createdAt">
                  {{ formatDate(post()?.publishedAt || post()?.createdAt) }}
                </time>
              </span>

              <!-- Reading Time -->
              <span class="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <svg class="w-3.5 h-3.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ post()?.readingTime || 5 }} {{ isKhmer() ? 'នាទីអាន' : 'min read' }}</span>
              </span>

              <!-- View Count -->
              @if (post()?.viewCount) {
                <span class="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{{ post()?.viewCount }} {{ isKhmer() ? 'ទស្សនា' : 'views' }}</span>
                </span>
              }
            </div>

            <!-- Title -->
            <h1 class="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {{ post()?.title | localize }}
            </h1>

            <!-- Excerpt / Summary -->
            @if (post()?.excerpt) {
              <p class="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal italic border-l-4 border-indigo-500/60 pl-4 py-1" [class.font-khmer]="isKhmer()">
                {{ post()?.excerpt | localize }}
              </p>
            }

            <!-- Author Mini Card (PRD 8.9 & Design.md 12.3) -->
            <div class="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-full overflow-hidden bg-indigo-100 dark:bg-indigo-900/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg border border-indigo-200 dark:border-indigo-800">
                  <span>DS</span>
                </div>
                <div>
                  <h4 class="text-sm font-bold text-slate-900 dark:text-white">
                    {{ isKhmer() ? 'ឌឹម សារាជ' : 'Dim Sareach' }}
                  </h4>
                  <p class="text-xs text-slate-500 dark:text-slate-400">
                    {{ isKhmer() ? 'វិស្វករផ្នែកទន់ & អ្នកអភិវឌ្ឍន៍ Full Stack' : 'Software Engineer & Full Stack Developer' }}
                  </p>
                </div>
              </div>

              <!-- Share / Copy Link Action -->
              <button
                type="button"
                (click)="copyLink()"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 transition-colors shadow-sm"
                [title]="isKhmer() ? 'ចម្លងតំណភ្ជាប់' : 'Copy link'"
              >
                @if (linkCopied()) {
                  <svg class="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="text-emerald-600 dark:text-emerald-400">{{ isKhmer() ? 'បានចម្លង!' : 'Copied!' }}</span>
                } @else {
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>{{ isKhmer() ? 'ចែករំលែក' : 'Share' }}</span>
                }
              </button>
            </div>

            <!-- Tags List -->
            @if (post()?.tags && post()!.tags.length > 0) {
              <div class="flex flex-wrap gap-2 pt-1">
                @for (tag of post()!.tags; track tag) {
                  <span class="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50">
                    #{{ tag }}
                  </span>
                }
              </div>
            }
          </header>

          <!-- Cover Image (16:9 aspect ratio, per Design.md 12.1) -->
          @if (post()?.coverImage) {
            <div class="w-full h-72 sm:h-96 rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 dark:border-slate-800 bg-slate-100 dark:bg-slate-800">
              <img
                [src]="post()!.coverImage"
                [alt]="(post()!.title | localize) || 'Article cover'"
                class="w-full h-full object-cover object-center"
              />
            </div>
          }

          <!-- Markdown Body Content with Syntax Highlighting -->
          <section
            class="blog-content prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200"
            [innerHTML]="renderedContent()"
          ></section>

          <!-- Article Footer Navigation / Back Link -->
          <footer class="pt-8 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <a
              routerLink="/blog"
              class="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>{{ isKhmer() ? 'ត្រឡប់ទៅកាន់អត្ថបទទាំងអស់' : 'Back to Blog' }}</span>
            </a>

            <button
              type="button"
              (click)="scrollToTop()"
              class="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <span>{{ isKhmer() ? 'ទៅលើគេ' : 'Back to top' }}</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </footer>
        </article>

        <!-- Related Posts Section (PRD 8.9 & Design.md 12.3: 2-3 blog cards) -->
        @if (relatedPosts().length > 0) {
          <section class="max-w-7xl mx-auto pt-12 border-t border-slate-200/80 dark:border-slate-800 space-y-8">
            <div class="flex items-end justify-between">
              <div>
                <h3 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {{ isKhmer() ? 'អត្ថបទពាក់ព័ន្ធ' : 'Related Articles' }}
                </h3>
                <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {{ isKhmer() ? 'បន្តអាន និងស្វែងយល់បន្ថែមអំពីប្រធានបទនេះ' : 'Continue exploring insights and deep-dives' }}
                </p>
              </div>

              <a
                routerLink="/blog"
                class="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <span>{{ isKhmer() ? 'មើលទាំងអស់' : 'View all' }}</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              @for (rel of relatedPosts(); track rel._id) {
                <app-blog-card [post]="rel"></app-blog-card>
              }
            </div>
          </section>
        }
      }
    </div>
  `,
  styles: [
    `
      :host ::ng-deep .blog-content h1 {
        font-size: 2rem;
        font-weight: 800;
        margin-top: 2.5rem;
        margin-bottom: 1rem;
        line-height: 1.25;
      }
      :host ::ng-deep .blog-content h2 {
        font-size: 1.5rem;
        font-weight: 700;
        margin-top: 2rem;
        margin-bottom: 0.75rem;
        line-height: 1.3;
        border-bottom: 1px solid rgba(148, 163, 184, 0.2);
        padding-bottom: 0.5rem;
      }
      :host ::ng-deep .blog-content h3 {
        font-size: 1.25rem;
        font-weight: 700;
        margin-top: 1.75rem;
        margin-bottom: 0.5rem;
        line-height: 1.4;
      }
      :host ::ng-deep .blog-content h4 {
        font-size: 1.1rem;
        font-weight: 600;
        margin-top: 1.5rem;
        margin-bottom: 0.5rem;
      }
      :host ::ng-deep .blog-content p {
        font-size: 1.0625rem;
        line-height: 1.7;
        margin-bottom: 1.25rem;
      }
      :host ::ng-deep .blog-content ul {
        list-style-type: disc;
        padding-left: 1.5rem;
        margin-bottom: 1.25rem;
        line-height: 1.7;
      }
      :host ::ng-deep .blog-content ol {
        list-style-type: decimal;
        padding-left: 1.5rem;
        margin-bottom: 1.25rem;
        line-height: 1.7;
      }
      :host ::ng-deep .blog-content li {
        margin-bottom: 0.375rem;
      }
      :host ::ng-deep .blog-content blockquote {
        border-left: 4px solid #6366f1;
        padding-left: 1rem;
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
        margin-top: 1.5rem;
        margin-bottom: 1.5rem;
        font-style: italic;
        background-color: rgba(99, 102, 241, 0.05);
        border-radius: 0 0.75rem 0.75rem 0;
      }
      :host ::ng-deep .blog-content a {
        color: #6366f1;
        text-decoration: underline;
        text-underline-offset: 3px;
        font-weight: 600;
      }
      :host ::ng-deep .blog-content a:hover {
        color: #4f46e5;
      }
      :host ::ng-deep .blog-content img {
        border-radius: 1rem;
        max-width: 100%;
        height: auto;
        margin-top: 1.5rem;
        margin-bottom: 1.5rem;
      }
      :host ::ng-deep .blog-content code:not(pre code) {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 0.875rem;
        padding: 0.15rem 0.4rem;
        border-radius: 0.375rem;
        background-color: rgba(148, 163, 184, 0.18);
        color: #e11d48;
      }
      /* Prism Syntax Highlighting Styles (Dark Slate Theme matching Design.md: hsl(220, 20%, 12%)) */
      :host ::ng-deep .token.comment,
      :host ::ng-deep .token.prolog,
      :host ::ng-deep .token.doctype,
      :host ::ng-deep .token.cdata {
        color: #94a3b8;
        font-style: italic;
      }
      :host ::ng-deep .token.punctuation {
        color: #cbd5e1;
      }
      :host ::ng-deep .token.property,
      :host ::ng-deep .token.tag,
      :host ::ng-deep .token.boolean,
      :host ::ng-deep .token.number,
      :host ::ng-deep .token.constant,
      :host ::ng-deep .token.symbol {
        color: #f472b6;
      }
      :host ::ng-deep .token.selector,
      :host ::ng-deep .token.attr-name,
      :host ::ng-deep .token.string,
      :host ::ng-deep .token.char,
      :host ::ng-deep .token.builtin {
        color: #34d399;
      }
      :host ::ng-deep .token.operator,
      :host ::ng-deep .token.entity,
      :host ::ng-deep .token.url {
        color: #38bdf8;
      }
      :host ::ng-deep .token.atrule,
      :host ::ng-deep .token.attr-value,
      :host ::ng-deep .token.keyword {
        color: #818cf8;
        font-weight: 600;
      }
      :host ::ng-deep .token.function,
      :host ::ng-deep .token.class-name {
        color: #fbbf24;
      }
      :host ::ng-deep .token.regex,
      :host ::ng-deep .token.important,
      :host ::ng-deep .token.variable {
        color: #fb923c;
      }
    `,
  ],
})
export class BlogDetailComponent implements OnInit {
  private readonly portfolioService = inject(PortfolioService);
  private readonly languageService = inject(LanguageService);
  private readonly route = inject(ActivatedRoute);

  public readonly post = signal<BlogPost | null>(null);
  public readonly relatedPosts = signal<BlogPost[]>([]);
  public readonly isLoading = signal<boolean>(true);
  public readonly error = signal<string | null>(null);
  public readonly linkCopied = signal<boolean>(false);

  public readonly isKhmer = computed(() => this.languageService.currentLang() === 'kh');

  public readonly categoryName = computed<string>(() => {
    const p = this.post();
    if (!p || !p.category) return 'Article';
    if (typeof p.category === 'object' && 'name' in p.category) {
      const cat = p.category as Category;
      return this.isKhmer() ? (cat.name?.kh || cat.name?.en || 'Article') : (cat.name?.en || 'Article');
    }
    return String(p.category);
  });

  private readonly markedInstance = new Marked({
    gfm: true,
    breaks: true,
    renderer: {
      code({ text, lang }: { text: string; lang?: string }) {
        const cleanLang = (lang || '').trim().toLowerCase();
        const validLang = cleanLang && Prism.languages[cleanLang] ? cleanLang : '';
        const grammar = validLang ? Prism.languages[validLang] : null;
        const highlighted = grammar ? Prism.highlight(text, grammar, validLang) : text;
        const displayLang = (validLang || cleanLang || 'code').toUpperCase();
        return `
          <div class="code-wrapper relative my-6 rounded-2xl overflow-hidden bg-[#13171f] border border-slate-700/60 shadow-xl group">
            <div class="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800 text-xs font-mono text-slate-400">
              <span class="font-semibold tracking-wider text-indigo-400">${displayLang}</span>
              <span class="text-[11px] text-slate-500">syntax highlighted</span>
            </div>
            <pre class="p-4 overflow-x-auto text-sm font-mono leading-relaxed text-slate-200"><code class="language-${validLang || 'plaintext'}">${highlighted}</code></pre>
          </div>
        `;
      },
    },
  });

  public readonly renderedContent = computed<string>(() => {
    const p = this.post();
    if (!p || !p.content) return '';
    const raw = this.isKhmer() && p.content.kh ? p.content.kh : p.content.en;
    if (!raw) return '';
    const text = Array.isArray(raw) ? raw.join('\n\n') : raw;
    try {
      return this.markedInstance.parse(text) as string;
    } catch {
      return text;
    }
  });

  public ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      if (slug) {
        this.loadPostDetails(slug);
      } else {
        this.error.set('No article identifier specified');
        this.isLoading.set(false);
      }
    });
  }

  public loadPostDetails(slug: string): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.portfolioService.getBlogPostBySlug(slug).subscribe({
      next: (res) => {
        if (res && res.data) {
          const current = res.data;
          this.post.set(current);
          this.loadRelatedPosts(current);
        } else {
          this.error.set('Article details could not be found.');
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set(
          this.isKhmer()
            ? 'មិនអាចទាញយកព័ត៌មានលម្អិតអត្ថបទបានទេ។'
            : 'Unable to load article details.',
        );
        this.isLoading.set(false);
      },
    });
  }

  public loadRelatedPosts(current: BlogPost): void {
    const catSlug = typeof current.category === 'object' && 'slug' in current.category
      ? (current.category as Category).slug
      : undefined;

    this.portfolioService.getBlogPosts({ limit: 4, category: catSlug }).pipe(
      catchError(() => of(null)),
    ).subscribe({
      next: (res) => {
        if (res && res.data && res.data.items) {
          // Filter out the current post and limit to 3
          const related = res.data.items
            .filter((p) => p._id !== current._id && p.slug !== current.slug)
            .slice(0, 3);
          this.relatedPosts.set(related);
        }
      },
    });
  }

  public formatDate(date?: string | Date): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString(this.isKhmer() ? 'km-KH' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  public copyLink(): void {
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      this.linkCopied.set(true);
      setTimeout(() => this.linkCopied.set(false), 2500);
    }
  }

  public scrollToTop(): void {
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  public goBackToBlog(): void {
    window.location.href = '/blog';
  }
}
