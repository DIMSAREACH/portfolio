import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { PublicLayoutComponent } from './public-layout.component';

describe('PublicLayoutComponent', () => {
  let component: PublicLayoutComponent;
  let fixture: ComponentFixture<PublicLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicLayoutComponent],
      providers: [provideRouter([]), provideAnimationsAsync()],
    }).compileComponents();

    fixture = TestBed.createComponent(PublicLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render header, main content, and footer', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-header')).toBeTruthy();
    expect(compiled.querySelector('main#main-content')).toBeTruthy();
    expect(compiled.querySelector('app-footer')).toBeTruthy();
  });

  it('should render accessible skip-to-content link targeting main content', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const skipLink = compiled.querySelector('#skip-to-content') as HTMLAnchorElement;
    expect(skipLink).toBeTruthy();
    expect(skipLink.getAttribute('href')).toBe('#main-content');
  });

  it('should render PrimeNG p-scrolltop element', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('p-scrolltop')).toBeTruthy();
  });
});

