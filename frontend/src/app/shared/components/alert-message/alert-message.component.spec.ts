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

  it('should resolve effectiveSeverity from type or severity input', () => {
    component.severity = 'error';
    expect(component.effectiveSeverity).toBe('error');

    component.type = 'warn';
    expect(component.effectiveSeverity).toBe('warn');
  });

  it('should map proper icons for each severity', () => {
    component.severity = 'success';
    expect(component.effectiveIcon).toBe('pi pi-check-circle');

    component.severity = 'info';
    expect(component.effectiveIcon).toBe('pi pi-info-circle');

    component.severity = 'warn';
    expect(component.effectiveIcon).toBe('pi pi-exclamation-triangle');

    component.severity = 'error';
    expect(component.effectiveIcon).toBe('pi pi-times-circle');

    component.severity = 'secondary';
    expect(component.effectiveIcon).toBe('pi pi-bell');

    component.severity = 'contrast';
    expect(component.effectiveIcon).toBe('pi pi-shield');

    component.icon = 'pi pi-custom';
    expect(component.effectiveIcon).toBe('pi pi-custom');
  });

  it('should support show() and hide() programmatically', () => {
    component.hide();
    expect(component.visible).toBe(false);

    component.show();
    expect(component.visible).toBe(true);
  });
});
