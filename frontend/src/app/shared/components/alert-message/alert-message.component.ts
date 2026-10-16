import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageModule } from 'primeng/message';

export type MessageSeverity = 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast';

@Component({
  selector: 'app-alert-message',
  standalone: true,
  imports: [CommonModule, MessageModule],
  template: `
    @if (visible && (text || hasProjectedContent)) {
      <div class="my-2 w-full animate-fadeIn" role="alert">
        <p-message
          [severity]="effectiveSeverity"
          [icon]="effectiveIcon"
          [variant]="variant"
          [size]="size"
          [closable]="closable"
          (onClose)="handleClose()"
          [class]="'w-full text-xs font-medium rounded-xl shadow-2xs ' + styleClass"
        >
          @if (summary) {
            <span class="font-bold mr-1">{{ summary }}:</span>
          }
          @if (text) {
            <span>{{ text }}</span>
          }
          <ng-content></ng-content>
        </p-message>
      </div>
    }
  `,
})
export class AlertMessageComponent {
  @Input() severity: MessageSeverity = 'info';
  @Input() type?: MessageSeverity;
  @Input() text = '';
  @Input() summary = '';
  @Input() icon?: string;
  @Input() closable = false;
  @Input() variant: 'simple' | 'outlined' = 'simple';
  @Input() size: 'small' | 'large' = 'small';
  @Input() styleClass = '';
  @Input() hasProjectedContent = false;

  @Output() closed = new EventEmitter<void>();

  public visible = true;

  public get effectiveSeverity(): MessageSeverity {
    return this.type || this.severity || 'info';
  }

  public get effectiveIcon(): string | undefined {
    if (this.icon) return this.icon;

    switch (this.effectiveSeverity) {
      case 'success':
        return 'pi pi-check-circle';
      case 'info':
        return 'pi pi-info-circle';
      case 'warn':
        return 'pi pi-exclamation-triangle';
      case 'error':
        return 'pi pi-times-circle';
      case 'secondary':
        return 'pi pi-bell';
      case 'contrast':
        return 'pi pi-shield';
      default:
        return 'pi pi-info-circle';
    }
  }

  public handleClose(): void {
    this.visible = false;
    this.closed.emit();
  }

  public show(): void {
    this.visible = true;
  }

  public hide(): void {
    this.handleClose();
  }
}
