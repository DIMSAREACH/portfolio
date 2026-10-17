import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
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
export class CountUpDirective implements OnInit, AfterViewInit, OnChanges, OnDestroy {
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
  private isInViewport = false;
  private currentAnimatedValue = 0;
  private isBrowser = false;

  private parsedTarget = 0;
  private parsedPrefix = '';
  private parsedSuffix = '';
  private parsedDecimals = 0;
  private hasCommas = false;

  public ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.parseInput();
    if (!this.isBrowser) {
      this.renderValue(this.parsedTarget);
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const change = changes['appCountUp'] || changes['target'];
    if (change) {
      const isFirstChange = change.isFirstChange();
      this.target = change.currentValue;
      this.parseInput();

      if (!this.isBrowser) {
        this.renderValue(this.parsedTarget);
        return;
      }

      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
        this.renderValue(this.parsedTarget);
        this.hasAnimated = true;
        return;
      }

      // If already in viewport and previously animated, smoothly update to the new target
      if (this.isInViewport && this.hasAnimated) {
        this.startCountUp(this.currentAnimatedValue);
      } else if (!this.hasAnimated && !isFirstChange) {
        // While waiting to be scrolled into view, keep at 0 so it animates when entered
        this.renderValue(0);
      }
    }
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
      this.hasAnimated = true;
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
            this.isInViewport = true;
            if (!this.hasAnimated || this.replay) {
              this.hasAnimated = true;
              this.startCountUp(this.replay ? 0 : this.currentAnimatedValue);
              if (!this.replay && this.observer) {
                this.observer.unobserve(this.el.nativeElement);
              }
            }
          } else {
            this.isInViewport = false;
            if (this.replay) {
              this.cancelCurrentAnimation();
              this.currentAnimatedValue = 0;
              this.renderValue(0);
              this.hasAnimated = false;
            }
          }
        });
      },
      {
        threshold: this.threshold,
        rootMargin: '0px 0px -10px 0px',
      }
    );

    this.observer.observe(this.el.nativeElement);
  }

  private startCountUp(fromVal = 0): void {
    this.cancelCurrentAnimation();

    const start = fromVal;
    const end = this.parsedTarget;

    if (start === end) {
      this.currentAnimatedValue = end;
      this.renderValue(end);
      return;
    }

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
        this.currentAnimatedValue = currentVal;

        if (progress < 1) {
          this.renderValue(currentVal);
          this.animationFrameId = requestAnimationFrame(step);
        } else {
          // Completed: set exact final target
          this.currentAnimatedValue = end;
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
    } else if (this.parsedDecimals > 0) {
      formattedNumber = val.toFixed(this.parsedDecimals);
    } else {
      formattedNumber = Math.round(val).toString();
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
