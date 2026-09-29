import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true,
  pure: true,
})
export class TruncatePipe implements PipeTransform {
  public transform(
    value: string | null | undefined,
    limit = 100,
    completeWords = false,
    ellipsis = '...',
  ): string {
    if (!value) {
      return '';
    }

    if (value.length <= limit) {
      return value;
    }

    if (completeWords) {
      const truncated = value.slice(0, limit);
      const lastSpaceIndex = truncated.lastIndexOf(' ');
      if (lastSpaceIndex > 0) {
        return `${truncated.slice(0, lastSpaceIndex)}${ellipsis}`;
      }
    }

    return `${value.slice(0, limit)}${ellipsis}`;
  }
}
