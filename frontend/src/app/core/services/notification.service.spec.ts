import { TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let messageServiceMock: { add: ReturnType<typeof vi.fn>; clear: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    messageServiceMock = {
      add: vi.fn(),
      clear: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: MessageService, useValue: messageServiceMock },
      ],
    });

    service = TestBed.inject(NotificationService);
  });

  it('should emit success toast with severity success', () => {
    service.success('Operation succeeded', 'Done', 3000);

    expect(messageServiceMock.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Done',
      detail: 'Operation succeeded',
      life: 3000,
    });
  });

  it('should default summary to Success when action is Close or omitted', () => {
    service.showSuccess('Operation succeeded');

    expect(messageServiceMock.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Success',
      detail: 'Operation succeeded',
      life: 4000,
    });
  });

  it('should emit error toast with severity error and 6000ms duration', () => {
    service.error('An error occurred');

    expect(messageServiceMock.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error',
      detail: 'An error occurred',
      life: 6000,
    });
  });

  it('should emit warning toast with severity warn and 5000ms duration', () => {
    service.warning('Be careful');

    expect(messageServiceMock.add).toHaveBeenCalledWith({
      severity: 'warn',
      summary: 'Warning',
      detail: 'Be careful',
      life: 5000,
    });
  });

  it('should emit info toast with severity info and 4000ms duration', () => {
    service.info('Info notice');

    expect(messageServiceMock.add).toHaveBeenCalledWith({
      severity: 'info',
      summary: 'Information',
      detail: 'Info notice',
      life: 4000,
    });
  });

  it('should pass custom ToastMessageOptions to showToast', () => {
    service.showToast({
      severity: 'success',
      summary: 'Custom',
      detail: 'Payload',
      sticky: true,
    });

    expect(messageServiceMock.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Custom',
      detail: 'Payload',
      sticky: true,
    });
  });

  it('should clear toasts via clear()', () => {
    service.clear('my-key');
    expect(messageServiceMock.clear).toHaveBeenCalledWith('my-key');
  });
});
