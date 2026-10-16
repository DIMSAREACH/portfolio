import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  OnDestroy,
  AfterViewInit,
  inject,
  NgZone,
  PLATFORM_ID,
  Renderer2,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Scroll-triggered count-up animation directive.
 * Automatically animates numbers (including decimals, prefixes, and suffixes like +, %)
 * using an IntersectionObserver and requestAnimationFrame when scrolled into view.
 */
@Directive({
  selector: '[appCountUp]',
  standalone: true,
})
export class CountUpDirective implements OnInit, AfterViewInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly ngZone = inject(NgZone);
  private readonly renderer = inject(Renderer2);
  private readonly platformId = inject(PLATFORM_ID);

  /**
   * Target value string or number, e.g. "3+", "12+", "100%", "99.9%"
   */
  @Input('appCountUp') public target: string | number = 0;

  /**
   * Duration of the count-up animation in milliseconds (1.5 - 2.0s = 1500 - 2000ms)
   */
  @Input() public duration = 1800;

  /**
   * Explicit decimal places. If omitted, automatically derived from target.
   */
  @Input() public decimals?: number;

  /**
   * Prefix string before the number (e.g., "$")
   */
  @Input() public prefix = '';

  /**
   * Suffix string after the number (e.g., "+", "%")
   */
  @Input() public suffix = '';

  /**
   * Whether to replay the animation every time the section re-enters the viewport
   */
  @Input() public replay = false;

  /**
   * Viewport intersection threshold (0.0 - 1.0)
   */
  @Input() public threshold = 0.2;

  private observer: IntersectionObserver | null = null;
  private animationFrameId: number | null = null;
  private hasAnimated = false;
  private isBrowser = false;

  private parsedTarget = 0;
  private parsedPrefix = '';
  private parsedSuffix = '';
  private parsedDecimals = 0;
  private hasCommas = false;

  public ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.parseInput();
  }

  public ngAfterViewInit(): void {
    if (!this.isBrowser) {
      return;
    }

    // Check for prefers-reduced-motion for user accessibility
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      this.renderValue(this.parsedTarget);
      return;
    }

    // Initialize with start value (0) while waiting for scroll into view
    this.renderValue(0);

    this.setupIntersectionObserver();
  }

  public ngOnDestroy(): void {
    this.cleanup();
  }

  private parseInput(): void {
    const raw = String(this.target ?? '').trim();
    if (!raw) return;

    this.hasCommas = raw.includes(',');
    const sanitized = raw.replace(/,/g, '');

    // Match optional prefix, number with optional decimal, and optional suffix
    const match = sanitized.match(/^([^\d.-]*)([-+]?\d+(?:\.\d+)?)([^\d]*)$/);

    if (match) {
      this.parsedPrefix = this.prefix || match[1] || '';
      this.parsedTarget = parseFloat(match[2]) || 0;
      this.parsedSuffix = this.suffix || match[3] || '';

      if (typeof this.decimals === 'number') {
        this.parsedDecimals = this.decimals;
      } else {
        const parts = match[2].split('.');
        this.parsedDecimals = parts[1] ? parts[1].length : 0;
      }
    } else {
      const num = parseFloat(sanitized);
      this.parsedTarget = isNaN(num) ? 0 : num;
      this.parsedPrefix = this.prefix;
      this.parsedSuffix = this.suffix;
      this.parsedDecimals = this.decimals ?? 0;
    }
  }

  private setupIntersectionObserver(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!this.hasAnimated || this.replay) {
              this.startCountUp();
              this.hasAnimated = true;
              if (!this.replay && this.observer) {
                this.observer.unobserve(this.el.nativeElement);
              }
            }
          } else if (this.replay) {
            this.cancelCurrentAnimation();
            this.renderValue(0);
          }
        });
      },
      {
        threshold: this.threshold,
      }
    );

    this.observer.observe(this.el.nativeElement);
  }

  private startCountUp(): void {
    this.cancelCurrentAnimation();

    const start = 0;
    const end = this.parsedTarget;
    const duration = Math.max(500, this.duration);
    const startTime = performance.now();

    // Run animation loop outside Angular Zone for peak 60/120fps performance
    this.ngZone.runOutsideAngular(() => {
      const step = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(1, elapsed / duration);

        // Easing: easeOutCubic (smooth deceleration)
        const ease = 1 - Math.pow(1 - progress, 3);
        const currentVal = start + (end - start) * ease;

        if (progress < 1) {
          this.renderValue(currentVal);
          this.animationFrameId = requestAnimationFrame(step);
        } else {
          // Completed: set exact final target
          this.renderValue(end);
          this.animationFrameId = null;
        }
      };

      this.animationFrameId = requestAnimationFrame(step);
    });
  }

  private renderValue(val: number): void {
    let formattedNumber: string;

    if (this.hasCommas) {
      formattedNumber = val.toLocaleString('en-US', {
        minimumFractionDigits: this.parsedDecimals,
        maximumFractionDigits: this.parsedDecimals,
      });
    } else {
      formattedNumber = val.toFixed(this.parsedDecimals);
    }

    const output = `${this.parsedPrefix}${formattedNumber}${this.parsedSuffix}`;
    this.renderer.setProperty(this.el.nativeElement, 'textContent', output);
  }

  private cancelCurrentAnimation(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private cleanup(): void {
    this.cancelCurrentAnimation();
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}
