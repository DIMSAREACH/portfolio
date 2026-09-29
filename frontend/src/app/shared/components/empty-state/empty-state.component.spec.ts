import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmptyStateComponent } from './empty-state.component';

describe('EmptyStateComponent', () => {
  let component: EmptyStateComponent;
  let fixture: ComponentFixture<EmptyStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyStateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display title and description', () => {
    fixture.componentRef.setInput('title', 'No Projects Available');
    fixture.componentRef.setInput(
      'description',
      'Try adjusting your filters to find what you are looking for.',
    );
    fixture.detectChanges();

    const titleEl = fixture.nativeElement.querySelector('h3');
    const descEl = fixture.nativeElement.querySelector('p');

    expect(titleEl.textContent).toContain('No Projects Available');
    expect(descEl.textContent).toContain('Try adjusting your filters');
  });

  it('should emit actionClick when action button is clicked', () => {
    fixture.componentRef.setInput('actionText', 'Reset Filters');
    const clickSpy = vi.spyOn(component.actionClick, 'emit');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button).toBeTruthy();
    button.click();

    expect(clickSpy).toHaveBeenCalled();
  });
});
