import { Component, Input, forwardRef, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Marked } from 'marked';

@Component({
  selector: 'app-markdown-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MarkdownEditorComponent),
      multi: true,
    },
  ],
  template: `
    <div class="space-y-1.5">
      <!-- Header: Label and View Mode Switcher -->
      <div class="flex items-center justify-between">
        @if (label) {
          <label [attr.for]="editorId" class="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            {{ label }}
            @if (required) {
              <span class="text-rose-500 font-bold ml-0.5">*</span>
            }
          </label>
        }

        <!-- Mode Toggle: Write / Preview / Split -->
        <div class="inline-flex p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" role="tablist">
          <button
            type="button"
            role="tab"
            [attr.aria-selected]="viewMode() === 'write'"
            (click)="setViewMode('write')"
            class="px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all focus:outline-none"
            [class.bg-white]="viewMode() === 'write'"
            [class.dark:bg-slate-700]="viewMode() === 'write'"
            [class.text-indigo-600]="viewMode() === 'write'"
            [class.dark:text-indigo-400]="viewMode() === 'write'"
            [class.shadow-xs]="viewMode() === 'write'"
            [class.text-slate-500]="viewMode() !== 'write'"
            [class.dark:text-slate-400]="viewMode() !== 'write'"
          >
            Write
          </button>
          <button
            type="button"
            role="tab"
            [attr.aria-selected]="viewMode() === 'preview'"
            (click)="setViewMode('preview')"
            class="px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all focus:outline-none"
            [class.bg-white]="viewMode() === 'preview'"
            [class.dark:bg-slate-700]="viewMode() === 'preview'"
            [class.text-indigo-600]="viewMode() === 'preview'"
            [class.dark:text-indigo-400]="viewMode() === 'preview'"
            [class.shadow-xs]="viewMode() === 'preview'"
            [class.text-slate-500]="viewMode() !== 'preview'"
            [class.dark:text-slate-400]="viewMode() !== 'preview'"
          >
            Preview
          </button>
          <button
            type="button"
            role="tab"
            [attr.aria-selected]="viewMode() === 'split'"
            (click)="setViewMode('split')"
            class="hidden md:inline-flex px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all focus:outline-none"
            [class.bg-white]="viewMode() === 'split'"
            [class.dark:bg-slate-700]="viewMode() === 'split'"
            [class.text-indigo-600]="viewMode() === 'split'"
            [class.dark:text-indigo-400]="viewMode() === 'split'"
            [class.shadow-xs]="viewMode() === 'split'"
            [class.text-slate-500]="viewMode() !== 'split'"
            [class.dark:text-slate-400]="viewMode() !== 'split'"
          >
            Split
          </button>
        </div>
      </div>

      <!-- Editor Container -->
      <div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
        <!-- Formatting Toolbar (Hidden in preview mode) -->
        @if (viewMode() !== 'preview') {
          <div class="px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center gap-1 text-slate-600 dark:text-slate-300">
            <button
              type="button"
              (click)="applyFormat('bold')"
              [disabled]="isDisabled()"
              class="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors"
              title="Bold (**text**)"
              aria-label="Bold format"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
                <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
              </svg>
            </button>
            <button
              type="button"
              (click)="applyFormat('italic')"
              [disabled]="isDisabled()"
              class="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors"
              title="Italic (*text*)"
              aria-label="Italic format"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="19" y1="4" x2="10" y2="4"></line>
                <line x1="14" y1="20" x2="5" y2="20"></line>
                <line x1="15" y1="4" x2="9" y2="20"></line>
              </svg>
            </button>
            <button
              type="button"
              (click)="applyFormat('heading')"
              [disabled]="isDisabled()"
              class="px-2 py-1 text-xs font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors"
              title="Heading (###)"
              aria-label="Heading format"
            >
              H3
            </button>

            <span class="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1"></span>

            <button
              type="button"
              (click)="applyFormat('link')"
              [disabled]="isDisabled()"
              class="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors"
              title="Link ([text](url))"
              aria-label="Link format"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
            </button>
            <button
              type="button"
              (click)="applyFormat('code')"
              [disabled]="isDisabled()"
              class="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors font-mono text-xs font-bold"
              title="Inline Code"
              aria-label="Inline code format"
            >
              &lt;/&gt;
            </button>
            <button
              type="button"
              (click)="applyFormat('codeblock')"
              [disabled]="isDisabled()"
              class="px-2 py-1 text-xs font-mono font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors"
              title="Code Block"
              aria-label="Code block format"
            >
              &#123;&#125;
            </button>

            <span class="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1"></span>

            <button
              type="button"
              (click)="applyFormat('list')"
              [disabled]="isDisabled()"
              class="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors"
              title="Bullet List (- item)"
              aria-label="Bullet list format"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
            </button>
            <button
              type="button"
              (click)="applyFormat('quote')"
              [disabled]="isDisabled()"
              class="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors"
              title="Blockquote (> quote)"
              aria-label="Quote format"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
                <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
              </svg>
            </button>
          </div>
        }

        <!-- Content Area -->
        <div [class]="contentLayoutClass">
          <!-- Textarea (Write) -->
          @if (viewMode() === 'write' || viewMode() === 'split') {
            <div class="relative w-full" [class.border-r]="viewMode() === 'split'" [class.border-slate-200]="viewMode() === 'split'" [class.dark:border-slate-800]="viewMode() === 'split'">
              <textarea
                #textareaRef
                [id]="editorId"
                [rows]="rows"
                [disabled]="isDisabled()"
                [placeholder]="placeholder"
                [value]="content()"
                (input)="onTextareaInput($event)"
                (blur)="onBlur()"
                class="w-full p-4 font-mono text-xs text-slate-800 dark:text-slate-200 bg-transparent focus:outline-none resize-y leading-relaxed disabled:opacity-50"
              ></textarea>
            </div>
          }

          <!-- Live Preview -->
          @if (viewMode() === 'preview' || viewMode() === 'split') {
            <div
              class="w-full p-4 overflow-y-auto max-h-[32rem] prose dark:prose-invert prose-xs text-slate-700 dark:text-slate-300 prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-pre:bg-slate-900 prose-pre:text-slate-200"
              [innerHTML]="sanitizedPreviewHtml()"
            ></div>
          }
        </div>

        <!-- Footer: Word & Character Count -->
        <div class="px-4 py-2 bg-slate-50/75 dark:bg-slate-800/40 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Markdown supported</span>
          <div class="flex items-center gap-3">
            <span>{{ wordCount() }} words</span>
            <span>{{ charCount() }} characters</span>
          </div>
        </div>
      </div>

      <!-- Helper Text -->
      @if (helperText) {
        <p class="text-[11px] text-slate-500 dark:text-slate-400">
          {{ helperText }}
        </p>
      }
    </div>
  `,
})
export class MarkdownEditorComponent implements ControlValueAccessor {
  private readonly sanitizer = inject(DomSanitizer);

  @Input() label?: string;
  @Input() placeholder = 'Write markdown content here...';
  @Input() rows = 8;
  @Input() required = false;
  @Input() helperText?: string;
  @Input() editorId = 'markdown-editor-' + Math.random().toString(36).substring(2, 9);

  public readonly isDisabled = signal<boolean>(false);

  @Input()
  public set disabled(val: boolean) {
    this.isDisabled.set(val);
  }
  public get disabled(): boolean {
    return this.isDisabled();
  }

  public readonly content = signal<string>('');
  public readonly viewMode = signal<'write' | 'preview' | 'split'>('write');

  private readonly markedInstance = new Marked({
    gfm: true,
    breaks: true,
  });

  private onChange: (val: string) => void = () => {
    /* noop default */
  };
  private onTouched: () => void = () => {
    /* noop default */
  };

  public readonly wordCount = computed<number>(() => {
    const text = this.content().trim();
    if (!text) return 0;
    return text.split(/\s+/).length;
  });

  public readonly charCount = computed<number>(() => {
    return this.content().length;
  });

  public readonly sanitizedPreviewHtml = computed<SafeHtml>(() => {
    const raw = this.content();
    if (!raw.trim()) {
      return this.sanitizer.bypassSecurityTrustHtml(
        '<p class="italic text-slate-400 text-xs">Nothing to preview yet.</p>',
      );
    }
    const parsed = this.markedInstance.parse(raw) as string;
    return this.sanitizer.bypassSecurityTrustHtml(parsed);
  });

  public get contentLayoutClass(): string {
    if (this.viewMode() === 'split') {
      return 'grid grid-cols-1 md:grid-cols-2 min-h-[16rem]';
    }
    return 'min-h-[14rem]';
  }

  public setViewMode(mode: 'write' | 'preview' | 'split'): void {
    this.viewMode.set(mode);
  }

  public onTextareaInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.onContentChange(target.value);
  }

  public onContentChange(val: string): void {
    this.content.set(val || '');
    this.onChange(val || '');
  }

  public onBlur(): void {
    this.onTouched();
  }

  public applyFormat(format: 'bold' | 'italic' | 'heading' | 'link' | 'code' | 'codeblock' | 'list' | 'quote'): void {
    let current = this.content();
    let insertion = '';

    switch (format) {
      case 'bold':
        insertion = '**bold text**';
        break;
      case 'italic':
        insertion = '*italic text*';
        break;
      case 'heading':
        insertion = '\n### Heading 3\n';
        break;
      case 'link':
        insertion = '[link title](https://example.com)';
        break;
      case 'code':
        insertion = '`code`';
        break;
      case 'codeblock':
        insertion = '\n```typescript\nconst message = "Hello";\n```\n';
        break;
      case 'list':
        insertion = '\n- Item 1\n- Item 2\n';
        break;
      case 'quote':
        insertion = '\n> Blockquote text\n';
        break;
    }

    current = current ? `${current}\n${insertion}` : insertion;
    this.onContentChange(current);
  }

  // ControlValueAccessor
  public writeValue(val: string | null): void {
    this.content.set(val || '');
  }

  public registerOnChange(fn: (val: string) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }
}
