import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

export interface SeoConfig {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  author?: string;
  publishedTime?: string;
  robots?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private document = inject(DOCUMENT);

  readonly defaultTitle = 'Dim Sareach | Full Stack Developer & Software Engineer';
  readonly defaultDescription =
    'Portfolio of Dim Sareach, a Full Stack Developer specializing in modern web applications, Angular, TypeScript, Node.js, and cloud architecture.';
  readonly defaultImage = '/assets/images/og-preview.png';
  readonly siteName = 'Dim Sareach Portfolio';

  /**
   * Update full SEO metadata for a route or dynamic entity
   */
  updateMetaTags(config: SeoConfig = {}): void {
    const fullTitle = config.title
      ? `${config.title} | Dim Sareach`
      : this.defaultTitle;
    const description = config.description || this.defaultDescription;
    const image = config.image || this.defaultImage;
    const type = config.type || 'website';
    const currentUrl = config.url || (this.document?.location?.href ?? '');

    // 1. Standard HTML metadata
    this.titleService.setTitle(fullTitle);
    this.metaService.updateTag({ name: 'description', content: description });
    if (config.keywords) {
      this.metaService.updateTag({ name: 'keywords', content: config.keywords });
    }
    this.metaService.updateTag({
      name: 'author',
      content: config.author || 'Dim Sareach',
    });
    this.metaService.updateTag({
      name: 'robots',
      content: config.robots || 'index, follow',
    });

    // 2. Open Graph metadata
    this.metaService.updateTag({ property: 'og:site_name', content: this.siteName });
    this.metaService.updateTag({ property: 'og:title', content: fullTitle });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ property: 'og:type', content: type });
    if (image) {
      this.metaService.updateTag({ property: 'og:image', content: image });
    }
    if (currentUrl) {
      this.metaService.updateTag({ property: 'og:url', content: currentUrl });
    }
    if (config.publishedTime) {
      this.metaService.updateTag({
        property: 'article:published_time',
        content: config.publishedTime,
      });
    }

    // 3. Twitter Card metadata
    this.metaService.updateTag({
      name: 'twitter:card',
      content: 'summary_large_image',
    });
    this.metaService.updateTag({ name: 'twitter:title', content: fullTitle });
    this.metaService.updateTag({
      name: 'twitter:description',
      content: description,
    });
    if (image) {
      this.metaService.updateTag({ name: 'twitter:image', content: image });
    }

    // 4. Canonical link
    this.setCanonicalUrl(currentUrl);
  }

  /**
   * Set or update canonical URL link tag
   */
  setCanonicalUrl(url?: string): void {
    if (!url && this.document?.location) {
      url = `${this.document.location.origin}${this.document.location.pathname}`;
    }
    if (!url || !this.document) return;

    let link: HTMLLinkElement | null = this.document.querySelector("link[rel='canonical']");
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  /**
   * Helper to set index/noindex robots
   */
  setNoIndex(): void {
    this.metaService.updateTag({
      name: 'robots',
      content: 'noindex, nofollow',
    });
  }
}
