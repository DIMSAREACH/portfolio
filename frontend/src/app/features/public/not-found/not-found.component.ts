import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div
      class="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center"
    >
      <div class="relative max-w-md w-full p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-2xl">
        <!-- 404 Gradient Number -->
        <span
          class="text-8xl font-black bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent select-none"
        >
          404
        </span>

        <h1 class="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
          Page Not Found
        </h1>

        <p class="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          The page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
        </p>

        <div class="mt-8">
          <a
            routerLink="/"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            id="back-home-btn"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Return to Home</span>
          </a>
        </div>
      </div>
    </div>
  `,
})
export class NotFoundComponent {}
