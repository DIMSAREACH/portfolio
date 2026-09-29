import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogData } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let dialogRefMock: { close: ReturnType<typeof vi.fn> };

  const mockData: ConfirmDialogData = {
    title: 'Delete Item',
    message: 'Are you sure you want to delete this project permanently?',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    isDestructive: true,
  };

  beforeEach(async () => {
    dialogRefMock = {
      close: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: mockData },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render dialog title and message', () => {
    const titleEl = fixture.nativeElement.querySelector('h3');
    const msgEl = fixture.nativeElement.querySelector('p');

    expect(titleEl.textContent).toContain('Delete Item');
    expect(msgEl.textContent).toContain('delete this project permanently');
  });

  it('should close dialog with false on cancel', () => {
    const buttons = fixture.nativeElement.querySelectorAll('button');
    const cancelButton = buttons[0] as HTMLButtonElement;
    cancelButton.click();

    expect(dialogRefMock.close).toHaveBeenCalledWith(false);
  });

  it('should close dialog with true on confirm', () => {
    const buttons = fixture.nativeElement.querySelectorAll('button');
    const confirmButton = buttons[1] as HTMLButtonElement;
    confirmButton.click();

    expect(dialogRefMock.close).toHaveBeenCalledWith(true);
  });
});
