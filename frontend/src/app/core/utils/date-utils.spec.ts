import { describe, it, expect } from 'vitest';
import { toPickerDate, toPayloadDate, formatCalendarDate } from './date-utils';

describe('date-utils', () => {
  describe('toPickerDate', () => {
    it('should return null for empty values', () => {
      expect(toPickerDate(null)).toBeNull();
      expect(toPickerDate(undefined)).toBeNull();
      expect(toPickerDate('')).toBeNull();
      expect(toPickerDate('   ')).toBeNull();
    });

    it('should parse ISO date string safely without timezone rollback', () => {
      const result = toPickerDate('2024-05-15T00:00:00.000Z');
      expect(result).not.toBeNull();
      expect(result!.getFullYear()).toBe(2024);
      expect(result!.getMonth()).toBe(4); // 0-indexed, so 4 is May
      expect(result!.getDate()).toBe(15);
    });

    it('should parse YYYY-MM-DD string', () => {
      const result = toPickerDate('2024-10-25');
      expect(result).not.toBeNull();
      expect(result!.getFullYear()).toBe(2024);
      expect(result!.getMonth()).toBe(9); // Oct
      expect(result!.getDate()).toBe(25);
    });

    it('should return the same Date object if valid', () => {
      const d = new Date(2025, 1, 10);
      expect(toPickerDate(d)).toBe(d);
    });
  });

  describe('toPayloadDate', () => {
    it('should return undefined for empty values', () => {
      expect(toPayloadDate(null)).toBeUndefined();
      expect(toPayloadDate(undefined)).toBeUndefined();
      expect(toPayloadDate('')).toBeUndefined();
    });

    it('should extract local YYYY-MM-DD from a Date object without converting to UTC previous-day', () => {
      // Local date representing May 15
      const d = new Date(2024, 4, 15, 0, 0, 0);
      expect(toPayloadDate(d)).toBe('2024-05-15');
    });

    it('should extract YYYY-MM-DD from an ISO string', () => {
      expect(toPayloadDate('2024-05-15T17:00:00.000Z')).toBe('2024-05-15');
      expect(toPayloadDate('2024-12-31')).toBe('2024-12-31');
    });
  });

  describe('formatCalendarDate', () => {
    it('should format dates safely', () => {
      const formatted = formatCalendarDate('2024-05-15T00:00:00.000Z', 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      expect(formatted).toContain('May');
      expect(formatted).toContain('15');
      expect(formatted).toContain('2024');
    });

    it('should return dash for null/empty values', () => {
      expect(formatCalendarDate(null)).toBe('—');
      expect(formatCalendarDate('')).toBe('—');
    });
  });
});
