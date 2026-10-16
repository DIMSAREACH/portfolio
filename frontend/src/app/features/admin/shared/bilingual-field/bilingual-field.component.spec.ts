import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BilingualFieldComponent } from './bilingual-field.component';
import { BilingualField } from '../../../../core/models';

describe('BilingualFieldComponent', () => {
  let component: BilingualFieldComponent;
  let fixture: ComponentFixture<BilingualFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BilingualFieldComponent, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(BilingualFieldComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('label', 'Project Title');
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render label and required indicator if set', () => {
    fixture.componentRef.setInput('required', true);
    fixture.detectChanges();

    const labelEl = fixture.nativeElement.querySelector('label');
    expect(labelEl.textContent).toContain('Project Title');
    expect(labelEl.textContent).toContain('*');
  });

  it('should render input by default and textarea when fieldType is textarea', () => {
    expect(fixture.nativeElement.querySelector('input')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('textarea')).toBeFalsy();

    fixture.componentRef.setInput('fieldType', 'textarea');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('textarea')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('input')).toBeFalsy();
  });

  it('should render clean single input without language switcher tabs', () => {
    const tabButtons = fixture.nativeElement.querySelectorAll('button[role="tab"]');
    expect(tabButtons.length).toBe(0);
    expect(fixture.nativeElement.textContent).not.toContain('English');
    expect(fixture.nativeElement.textContent).not.toContain('ភាសាខ្មែរ (KH)');
  });

  it('should update value and emit onChange when typing', () => {
    const changeSpy = vi.fn();
    component.registerOnChange(changeSpy);

    component.onTextChange('New English Title');

    expect(component.value.en).toBe('New English Title');
    expect(component.value.kh).toBe('New English Title');
    expect(changeSpy).toHaveBeenCalledWith({ en: 'New English Title', kh: 'New English Title' });
  });

  it('should call onTouched when input blurs', () => {
    const touchedSpy = vi.fn();
    component.registerOnTouched(touchedSpy);

    component.onBlur();
    expect(touchedSpy).toHaveBeenCalled();
  });

  it('should populate value correctly on writeValue', () => {
    const testVal: BilingualField = { en: 'Hello', kh: 'សួស្តី' };
    component.writeValue(testVal);

    expect(component.value).toEqual(testVal);

    // Null check
    component.writeValue(null);
    expect(component.value).toEqual({ en: '', kh: '' });
  });

  it('should handle setDisabledState', () => {
    component.setDisabledState(true);
    fixture.detectChanges();

    expect(component.disabled).toBe(true);
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });
});
