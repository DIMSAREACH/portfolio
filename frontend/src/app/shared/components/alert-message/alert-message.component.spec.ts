import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertMessageComponent } from './alert-message.component';

describe('AlertMessageComponent', () => {
  let component: AlertMessageComponent;
  let fixture: ComponentFixture<AlertMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertMessageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AlertMessageComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render message when text is provided', () => {
    component.text = 'This is an alert';
    component.severity = 'warn';
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[role="alert"]')).toBeTruthy();
  });

  it('should hide message on close', () => {
    component.text = 'Closable alert';
    component.closable = true;
    fixture.detectChanges();

    const closeSpy = vi.spyOn(component.closed, 'emit');
    component.handleClose();
    fixture.detectChanges();

    expect(component.visible).toBe(false);
    expect(closeSpy).toHaveBeenCalled();
  });
});
