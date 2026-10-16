import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-alert-message',
  standalone: true,
  imports: [CommonModule, MessageModule],
  template: `
    @if (visible && (text || hasProjectedContent)) {
      <div class="my-2 w-full animate-fadeIn" role="alert">
        <p-message
          [severity]="severity"
          [icon]="icon"
          [variant]="variant"
          [size]="size"
          [closable]="closable"
          (onClose)="handleClose()"
          styleClass="w-full text-xs font-medium rounded-xl shadow-2xs"
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
  @Input() severity: 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast' = 'info';
  @Input() text = '';
  @Input() summary = '';
  @Input() icon?: string;
  @Input() closable = false;
  @Input() variant: 'simple' | 'outlined' = 'simple';
  @Input() size: 'small' | 'large' = 'small';
  @Input() hasProjectedContent = false;

  @Output() closed = new EventEmitter<void>();

  public visible = true;

  public handleClose(): void {
    this.visible = false;
    this.closed.emit();
  }
}
