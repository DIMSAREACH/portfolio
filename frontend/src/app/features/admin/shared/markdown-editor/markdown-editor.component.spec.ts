import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MarkdownEditorComponent } from './markdown-editor.component';

describe('MarkdownEditorComponent', () => {
  let component: MarkdownEditorComponent;
  let fixture: ComponentFixture<MarkdownEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkdownEditorComponent, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MarkdownEditorComponent);
    component = fixture.componentInstance;
    component.label = 'Case Study Content';
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render textarea by default in write mode', () => {
    expect(component.viewMode()).toBe('write');
    const textarea = fixture.nativeElement.querySelector('textarea');
    expect(textarea).toBeTruthy();
  });

  it('should toggle between write, preview, and split modes', () => {
    component.setViewMode('preview');
    fixture.detectChanges();
    expect(component.viewMode()).toBe('preview');
    expect(fixture.nativeElement.querySelector('textarea')).toBeFalsy();

    component.setViewMode('split');
    fixture.detectChanges();
    expect(component.viewMode()).toBe('split');
    expect(fixture.nativeElement.querySelector('textarea')).toBeTruthy();
  });

  it('should render markdown preview accurately in preview mode', () => {
    component.writeValue('## Hello Markdown World');
    component.setViewMode('preview');
    fixture.detectChanges();

    const preview = fixture.nativeElement.querySelector('.prose');
    expect(preview).toBeTruthy();
    expect(preview.innerHTML).toContain('<h2');
    expect(preview.textContent).toContain('Hello Markdown World');
  });

  it('should calculate word and character counts accurately', () => {
    component.writeValue('One two three four five');
    fixture.detectChanges();

    expect(component.wordCount()).toBe(5);
    expect(component.charCount()).toBe(23);

    // Empty text
    component.writeValue('');
    expect(component.wordCount()).toBe(0);
    expect(component.charCount()).toBe(0);
  });

  it('should insert formatting tags via applyFormat', () => {
    component.writeValue('');
    component.applyFormat('bold');
    expect(component.content()).toContain('**bold text**');

    component.applyFormat('heading');
    expect(component.content()).toContain('### Heading 3');

    component.applyFormat('code');
    expect(component.content()).toContain('`code`');
  });

  it('should emit onChange when content is modified', () => {
    const changeSpy = vi.fn();
    component.registerOnChange(changeSpy);

    component.onContentChange('New text content');
    expect(changeSpy).toHaveBeenCalledWith('New text content');
  });

  it('should handle onTouched on blur', () => {
    const touchSpy = vi.fn();
    component.registerOnTouched(touchSpy);

    component.onBlur();
    expect(touchSpy).toHaveBeenCalled();
  });

  it('should update disabled state via setDisabledState', () => {
    component.setDisabledState(true);
    fixture.detectChanges();

    expect(component.disabled).toBe(true);
    const textarea = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    expect(textarea.disabled).toBe(true);
  });
});
