import { Component, Input, forwardRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BilingualField } from '../../../../core/models';

@Component({
  selector: 'app-bilingual-field',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BilingualFieldComponent),
      multi: true,
    },
  ],
  template: `
    <div class="space-y-1.5">
      <!-- Field Header: Label, Optional/Required Tag, and Language Switcher Tabs -->
      <div class="flex items-center justify-between">
        <label [attr.for]="fieldId" class="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          {{ label }}
          @if (required) {
            <span class="text-rose-500 font-bold ml-0.5">*</span>
          }
        </label>

        <!-- EN / KH Tab Buttons -->
        <div class="inline-flex p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" role="tablist">
          <button
            type="button"
            role="tab"
            [attr.aria-selected]="activeTab === 'en'"
            (click)="selectTab('en')"
            class="px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all flex items-center gap-1.5 focus:outline-none"
            [class.bg-white]="activeTab === 'en'"
            [class.dark:bg-slate-700]="activeTab === 'en'"
            [class.text-indigo-600]="activeTab === 'en'"
            [class.dark:text-indigo-400]="activeTab === 'en'"
            [class.shadow-xs]="activeTab === 'en'"
            [class.text-slate-500]="activeTab !== 'en'"
            [class.dark:text-slate-400]="activeTab !== 'en'"
          >
            <span>English</span>
            @if (value.en) {
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            }
          </button>
          <button
            type="button"
            role="tab"
            [attr.aria-selected]="activeTab === 'kh'"
            (click)="selectTab('kh')"
            class="px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all flex items-center gap-1.5 focus:outline-none"
            [class.bg-white]="activeTab === 'kh'"
            [class.dark:bg-slate-700]="activeTab === 'kh'"
            [class.text-indigo-600]="activeTab === 'kh'"
            [class.dark:text-indigo-400]="activeTab === 'kh'"
            [class.shadow-xs]="activeTab === 'kh'"
            [class.text-slate-500]="activeTab !== 'kh'"
            [class.dark:text-slate-400]="activeTab !== 'kh'"
          >
            <span>ភាសាខ្មែរ (KH)</span>
            @if (value.kh) {
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            }
          </button>
        </div>
      </div>

      <!-- Input Area: Conditional for Input or Textarea -->
      <div class="relative">
        @if (fieldType === 'textarea') {
          <textarea
            [id]="fieldId"
            [rows]="rows"
            [disabled]="isDisabled()"
            [placeholder]="activeTab === 'en' ? placeholderEn : placeholderKh"
            [value]="activeTab === 'en' ? value.en : value.kh"
            (input)="onInputElement($event)"
            (blur)="onBlur()"
            class="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          ></textarea>
        } @else {
          <input
            [id]="fieldId"
            type="text"
            [disabled]="isDisabled()"
            [placeholder]="activeTab === 'en' ? placeholderEn : placeholderKh"
            [value]="activeTab === 'en' ? value.en : value.kh"
            (input)="onInputElement($event)"
            (blur)="onBlur()"
            class="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />
        }
      </div>

      <!-- Helper / Guidance Text -->
      @if (helperText) {
        <p class="text-[11px] text-slate-500 dark:text-slate-400">
          {{ helperText }}
        </p>
      }
    </div>
  `,
})
export class BilingualFieldComponent implements ControlValueAccessor {
  @Input() label = 'Field';
  @Input() required = false;
  @Input() fieldType: 'input' | 'textarea' = 'input';
  @Input() placeholderEn = 'Enter in English...';
  @Input() placeholderKh = 'បញ្ចូលជាភាសាខ្មែរ...';
  @Input() rows = 3;
  @Input() helperText?: string;
  @Input() fieldId = 'bilingual-field-' + Math.random().toString(36).substring(2, 9);

  public readonly isDisabled = signal<boolean>(false);

  @Input()
  public set disabled(val: boolean) {
    this.isDisabled.set(val);
  }
  public get disabled(): boolean {
    return this.isDisabled();
  }

  public activeTab: 'en' | 'kh' = 'en';

  public value: BilingualField = {
    en: '',
    kh: '',
  };

  private onChange: (val: BilingualField) => void = () => {
    /* noop default */
  };
  private onTouched: () => void = () => {
    /* noop default */
  };

  public selectTab(tab: 'en' | 'kh'): void {
    this.activeTab = tab;
  }

  public onInputElement(event: Event): void {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    this.onTextChange(target.value);
  }

  public onTextChange(newText: string): void {
    if (this.activeTab === 'en') {
      this.value = { ...this.value, en: newText || '' };
    } else {
      this.value = { ...this.value, kh: newText || '' };
    }
    this.onChange(this.value);
  }

  public onBlur(): void {
    this.onTouched();
  }

  // ControlValueAccessor Implementation
  public writeValue(val: BilingualField | null): void {
    if (val) {
      this.value = {
        en: val.en || '',
        kh: val.kh || '',
      };
    } else {
      this.value = { en: '', kh: '' };
    }
  }

  public registerOnChange(fn: (val: BilingualField) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }
}
