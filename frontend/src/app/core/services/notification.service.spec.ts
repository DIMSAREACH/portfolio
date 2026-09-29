import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let snackBarMock: { open: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    snackBarMock = {
      open: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: MatSnackBar, useValue: snackBarMock },
      ],
    });

    service = TestBed.inject(NotificationService);
  });

  it('should open success snackbar with panelClass snackbar-success', () => {
    service.success('Operation succeeded', 'OK', 3000);

    expect(snackBarMock.open).toHaveBeenCalledWith('Operation succeeded', 'OK', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['snackbar-success'],
    });
  });

  it('should open error snackbar with panelClass snackbar-error', () => {
    service.error('An error occurred');

    expect(snackBarMock.open).toHaveBeenCalledWith('An error occurred', 'Close', {
      duration: 6000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['snackbar-error'],
    });
  });

  it('should open warning snackbar with panelClass snackbar-warning', () => {
    service.warning('Be careful');

    expect(snackBarMock.open).toHaveBeenCalledWith('Be careful', 'Close', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['snackbar-warning'],
    });
  });

  it('should open info snackbar with panelClass snackbar-info', () => {
    service.info('Info notice');

    expect(snackBarMock.open).toHaveBeenCalledWith('Info notice', 'Close', {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['snackbar-info'],
    });
  });
});
