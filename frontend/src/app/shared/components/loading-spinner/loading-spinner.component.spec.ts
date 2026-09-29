import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingSpinnerComponent } from './loading-spinner.component';

describe('LoadingSpinnerComponent', () => {
  let component: LoadingSpinnerComponent;
  let fixture: ComponentFixture<LoadingSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingSpinnerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply size classes correctly', () => {
    fixture.componentRef.setInput('size', 'sm');
    fixture.detectChanges();
    expect(component.spinnerSizeClass).toBe('w-5 h-5');

    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();
    expect(component.spinnerSizeClass).toBe('w-12 h-12');

    fixture.componentRef.setInput('size', 'md');
    fixture.detectChanges();
    expect(component.spinnerSizeClass).toBe('w-8 h-8');
  });

  it('should render message when provided', () => {
    fixture.componentRef.setInput('message', 'Loading projects...');
    fixture.detectChanges();

    const paragraph = fixture.nativeElement.querySelector('p');
    expect(paragraph).toBeTruthy();
    expect(paragraph.textContent).toContain('Loading projects...');
  });

  it('should apply overlay classes when overlay is true', () => {
    fixture.componentRef.setInput('overlay', true);
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('[role="status"]');
    expect(container.classList.contains('fixed')).toBe(true);
    expect(container.classList.contains('inset-0')).toBe(true);
  });
});
