/**
 * Date normalization utilities for forms and displays.
 * Prevents timezone offset shifts (e.g. UTC+7 midnight converting to UTC previous-day).
 */

/**
 * Converts any date representation (ISO string, YYYY-MM-DD, Date object)
 * into a local Date object suitable for PrimeNG p-datepicker without timezone shifts.
 */
export function toPickerDate(val: string | Date | null | undefined): Date | null {
  if (!val) return null;
  if (val instanceof Date) {
    return isNaN(val.getTime()) ? null : val;
  }
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (!trimmed) return null;

    // Matches YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss
    const match = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      const year = parseInt(match[1], 10);
      const month = parseInt(match[2], 10) - 1;
      const day = parseInt(match[3], 10);
      // Noon (12:00) avoids any boundary shifts or daylight savings anomalies
      return new Date(year, month, day, 12, 0, 0);
    }

    const d = new Date(trimmed);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}

/**
 * Extracts clean YYYY-MM-DD calendar string from a Date object or string for API payload.
 * Avoids Date.toISOString() timezone rollbacks.
 */
export function toPayloadDate(val: string | Date | null | undefined): string | undefined {
  if (!val) return undefined;
  if (val instanceof Date) {
    if (isNaN(val.getTime())) return undefined;
    const year = val.getFullYear();
    const month = String(val.getMonth() + 1).padStart(2, '0');
    const day = String(val.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (!trimmed) return undefined;
    const match = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
    const d = new Date(trimmed);
    if (!isNaN(d.getTime())) {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  }
  return undefined;
}

/**
 * Formats a date for display safely across all locales without UTC offset shifts.
 */
export function formatCalendarDate(
  val: string | Date | null | undefined,
  locale = 'en-US',
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short' }
): string {
  const d = toPickerDate(val);
  if (!d) return '—';
  return d.toLocaleDateString(locale, options);
}
