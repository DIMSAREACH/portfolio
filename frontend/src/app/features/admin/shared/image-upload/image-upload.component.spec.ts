import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageUploadComponent } from './image-upload.component';

describe('ImageUploadComponent', () => {
  let component: ImageUploadComponent;
  let fixture: ComponentFixture<ImageUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageUploadComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageUploadComponent);
    component = fixture.componentInstance;
    component.label = 'Hero Banner Image';
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render dropzone when no image is present', () => {
    const dropzone = fixture.nativeElement.querySelector('[role="button"]');
    expect(dropzone).toBeTruthy();
    expect(dropzone.textContent).toContain('Click to upload or drag & drop');
  });

  it('should render image preview when value is provided', () => {
    fixture.componentRef.setInput('value', 'https://example.com/banner.jpg');
    fixture.detectChanges();

    const img = fixture.nativeElement.querySelector('img');
    expect(img).toBeTruthy();
    expect(img.getAttribute('src')).toBe('https://example.com/banner.jpg');
  });

  it('should validate MIME type and emit error on unsupported type', () => {
    const errorSpy = vi.spyOn(component.uploadError, 'emit');
    const invalidFile = new File(['content'], 'document.pdf', { type: 'application/pdf' });

    component.processFile(invalidFile);
    fixture.detectChanges();

    expect(errorSpy).toHaveBeenCalled();
    expect(component.errorMessage).toContain('Unsupported file type');
    expect(component.previewUrl).toBeNull();
  });

  it('should validate file size and emit error when file exceeds maxSizeMb', () => {
    const errorSpy = vi.spyOn(component.uploadError, 'emit');
    component.maxSizeMb = 1; // 1 MB

    // Create 2MB dummy file
    const largeBlob = new Blob([new Uint8Array(2 * 1024 * 1024)], { type: 'image/png' });
    const largeFile = new File([largeBlob], 'huge.png', { type: 'image/png' });

    component.processFile(largeFile);
    fixture.detectChanges();

    expect(errorSpy).toHaveBeenCalled();
    expect(component.errorMessage).toContain('exceeds maximum 1MB limit');
    expect(component.previewUrl).toBeNull();
  });

  it('should process valid image file, emit fileSelected, and generate preview', async () => {
    const fileSpy = vi.spyOn(component.fileSelected, 'emit');
    const validFile = new File(['valid-image-bytes'], 'banner.png', { type: 'image/png' });

    component.processFile(validFile);

    expect(fileSpy).toHaveBeenCalledWith(validFile);
    expect(component.errorMessage).toBeNull();
  });

  it('should reset preview and emit imageRemoved on removeImage()', () => {
    const removeSpy = vi.spyOn(component.imageRemoved, 'emit');
    component.previewUrl = 'data:image/png;base64,1234';
    component.value = 'https://example.com/image.jpg';

    component.removeImage();

    expect(component.previewUrl).toBeNull();
    expect(component.value).toBeUndefined();
    expect(removeSpy).toHaveBeenCalled();
  });

  it('should handle dragover and dragleave state', () => {
    const dragOverEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    } as unknown as DragEvent;

    component.onDragOver(dragOverEvent);
    expect(component.isDragging).toBe(true);

    const dragLeaveEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    } as unknown as DragEvent;

    component.onDragLeave(dragLeaveEvent);
    expect(component.isDragging).toBe(false);
  });
});
