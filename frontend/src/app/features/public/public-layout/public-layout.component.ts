import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { HeaderComponent, FooterComponent } from '../../../shared';
import { SeoService } from '../../../core/services/seo.service';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <div
      class="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300"
    >
      <a
        href="#main-content"
        class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white focus:rounded-xl focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-bold text-sm transition-all"
        id="skip-to-content"
      >
        Skip to main content
      </a>
      <app-header></app-header>
      <main class="flex-1" id="main-content" tabindex="-1">
        <router-outlet></router-outlet>
      </main>
      <app-footer></app-footer>
    </div>
  `,
})
export class PublicLayoutComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly seoService = inject(SeoService);
  private navSub?: Subscription;

  ngOnInit(): void {
    this.syncSeo();
    this.navSub = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.syncSeo();
      });
  }

  ngOnDestroy(): void {
    this.navSub?.unsubscribe();
  }

  private syncSeo(): void {
    let currentRoute: ActivatedRoute | null = this.activatedRoute;
    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }

    if (currentRoute) {
      const data = currentRoute.snapshot.data || {};
      const title = data['title'] || currentRoute.snapshot.routeConfig?.title;
      const description = data['description'];
      const keywords = data['keywords'];
      const robots = data['robots'];

      this.seoService.updateMetaTags({
        title: typeof title === 'string' ? title.replace(' | Dim Sareach', '') : undefined,
        description: typeof description === 'string' ? description : undefined,
        keywords: typeof keywords === 'string' ? keywords : undefined,
        robots: typeof robots === 'string' ? robots : undefined,
      });
    }
  }
}

