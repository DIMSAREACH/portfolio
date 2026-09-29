import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not render navigation when totalPages <= 1', () => {
    fixture.componentRef.setInput('page', 1);
    fixture.componentRef.setInput('totalPages', 1);
    fixture.detectChanges();

    const nav = fixture.nativeElement.querySelector('nav');
    expect(nav).toBeNull();
  });

  it('should render navigation when totalPages > 1', () => {
    fixture.componentRef.setInput('page', 1);
    fixture.componentRef.setInput('totalPages', 5);
    fixture.detectChanges();

    const nav = fixture.nativeElement.querySelector('nav');
    expect(nav).toBeTruthy();
  });

  it('should emit pageChange when clicking next button', () => {
    fixture.componentRef.setInput('page', 1);
    fixture.componentRef.setInput('totalPages', 5);
    const emitSpy = vi.spyOn(component.pageChange, 'emit');
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    const nextButton = buttons[buttons.length - 1] as HTMLButtonElement;
    nextButton.click();

    expect(emitSpy).toHaveBeenCalledWith(2);
  });

  it('should not emit pageChange when prev button is clicked on page 1', () => {
    fixture.componentRef.setInput('page', 1);
    fixture.componentRef.setInput('totalPages', 5);
    const emitSpy = vi.spyOn(component.pageChange, 'emit');
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    const prevButton = buttons[0] as HTMLButtonElement;
    prevButton.click();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should show ellipsis when total pages is large', () => {
    fixture.componentRef.setInput('page', 5);
    fixture.componentRef.setInput('totalPages', 15);
    fixture.detectChanges();

    const spans = fixture.nativeElement.querySelectorAll('span');
    const hasEllipsis = Array.from(spans).some((s: unknown) =>
      (s as HTMLElement).textContent?.includes('…'),
    );
    expect(hasEllipsis).toBe(true);
  });
});
