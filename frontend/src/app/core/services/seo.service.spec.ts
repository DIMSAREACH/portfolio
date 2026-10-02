import { TestBed } from '@angular/core/testing';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { SeoService } from './seo.service';

describe('SeoService', () => {
  let service: SeoService;
  let titleService: Title;
  let metaService: Meta;
  let doc: Document;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SeoService],
    });

    service = TestBed.inject(SeoService);
    titleService = TestBed.inject(Title);
    metaService = TestBed.inject(Meta);
    doc = TestBed.inject(DOCUMENT);
  });

  afterEach(() => {
    const canonical = doc.querySelector("link[rel='canonical']");
    if (canonical) {
      canonical.remove();
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set default meta tags when no config is provided', () => {
    service.updateMetaTags();

    expect(titleService.getTitle()).toBe(service.defaultTitle);
    expect(metaService.getTag("name='description'")?.content).toBe(service.defaultDescription);
    expect(metaService.getTag("property='og:title'")?.content).toBe(service.defaultTitle);
    expect(metaService.getTag("property='og:type'")?.content).toBe('website');
    expect(metaService.getTag("property='og:site_name'")?.content).toBe(service.siteName);
    expect(metaService.getTag("name='twitter:card'")?.content).toBe('summary_large_image');
  });

  it('should update page title with suffix when custom title is provided', () => {
    service.updateMetaTags({ title: 'My Awesome Project' });

    expect(titleService.getTitle()).toBe('My Awesome Project | Dim Sareach');
    expect(metaService.getTag("property='og:title'")?.content).toBe('My Awesome Project | Dim Sareach');
    expect(metaService.getTag("name='twitter:title'")?.content).toBe('My Awesome Project | Dim Sareach');
  });

  it('should update full SEO and Open Graph metadata for article/blog post', () => {
    service.updateMetaTags({
      title: 'Building Modern Web Apps',
      description: 'A deep dive into architecture and performance.',
      keywords: 'angular, typescript, performance',
      image: 'https://example.com/cover.jpg',
      url: 'https://example.com/blog/modern-web',
      type: 'article',
      author: 'Dim Sareach',
      publishedTime: '2026-10-01T00:00:00Z',
    });

    expect(titleService.getTitle()).toBe('Building Modern Web Apps | Dim Sareach');
    expect(metaService.getTag("name='description'")?.content).toBe(
      'A deep dive into architecture and performance.',
    );
    expect(metaService.getTag("name='keywords'")?.content).toBe('angular, typescript, performance');
    expect(metaService.getTag("name='author'")?.content).toBe('Dim Sareach');
    expect(metaService.getTag("property='og:title'")?.content).toBe(
      'Building Modern Web Apps | Dim Sareach',
    );
    expect(metaService.getTag("property='og:description'")?.content).toBe(
      'A deep dive into architecture and performance.',
    );
    expect(metaService.getTag("property='og:image'")?.content).toBe(
      'https://example.com/cover.jpg',
    );
    expect(metaService.getTag("property='og:url'")?.content).toBe(
      'https://example.com/blog/modern-web',
    );
    expect(metaService.getTag("property='og:type'")?.content).toBe('article');
    expect(metaService.getTag("property='article:published_time'")?.content).toBe(
      '2026-10-01T00:00:00Z',
    );
    expect(metaService.getTag("name='twitter:image'")?.content).toBe(
      'https://example.com/cover.jpg',
    );
  });

  it('should set canonical link tag in document head', () => {
    service.setCanonicalUrl('https://example.com/projects/portfolio');

    const link = doc.querySelector("link[rel='canonical']");
    expect(link).toBeTruthy();
    expect(link?.getAttribute('href')).toBe('https://example.com/projects/portfolio');

    // Updating again should modify the existing link rather than adding another
    service.setCanonicalUrl('https://example.com/projects/new-url');
    const links = doc.querySelectorAll("link[rel='canonical']");
    expect(links.length).toBe(1);
    expect(links[0].getAttribute('href')).toBe('https://example.com/projects/new-url');
  });

  it('should set robots tag to noindex, nofollow when setNoIndex is called', () => {
    service.setNoIndex();

    expect(metaService.getTag("name='robots'")?.content).toBe('noindex, nofollow');
  });
});
