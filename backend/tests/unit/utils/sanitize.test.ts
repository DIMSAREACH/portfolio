import { describe, it, expect } from '@jest/globals';
import {
  escapeRegex,
  isOriginAllowed,
  validateFileMagicBytes,
} from '../../../src/utils/sanitize';

describe('Security Sanitization Utilities', () => {
  describe('escapeRegex', () => {
    it('should escape regular expression metacharacters', () => {
      const dangerousInput = '.*+?^${}()|[]\\';
      const escaped = escapeRegex(dangerousInput);

      expect(() => new RegExp(escaped)).not.toThrow();
      expect(escaped).toBe('\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\');
    });

    it('should safely match literal string containing special characters', () => {
      const search = '(node.js)+';
      const escaped = escapeRegex(search);
      const regex = new RegExp(escaped, 'i');

      expect(regex.test('(Node.js)+ developer')).toBe(true);
      expect(regex.test('Node js')).toBe(false);
    });

    it('should handle empty or non-string input gracefully', () => {
      expect(escapeRegex('')).toBe('');
      expect(escapeRegex(null as unknown as string)).toBe('');
      expect(escapeRegex(undefined as unknown as string)).toBe('');
    });
  });

  describe('isOriginAllowed', () => {
    const configuredOrigins = 'https://portfolio.dev, https://admin.portfolio.dev';

    it('should allow exact configured origins in production', () => {
      expect(isOriginAllowed('https://portfolio.dev', configuredOrigins, true)).toBe(true);
      expect(isOriginAllowed('https://admin.portfolio.dev', configuredOrigins, true)).toBe(true);
    });

    it('should block malicious subdomain or suffix bypasses in production', () => {
      // Subdomain spoofing
      expect(isOriginAllowed('https://attacker.vercel.app', configuredOrigins, true)).toBe(false);
      // Host injection
      expect(isOriginAllowed('http://localhost.attacker.com', configuredOrigins, true)).toBe(false);
      expect(isOriginAllowed('https://portfolio.dev.attacker.com', configuredOrigins, true)).toBe(false);
    });

    it('should allow standard localhost ports in development mode', () => {
      expect(isOriginAllowed('http://localhost:4200', configuredOrigins, false)).toBe(true);
      expect(isOriginAllowed('http://localhost:3000', configuredOrigins, false)).toBe(true);
      expect(isOriginAllowed('http://127.0.0.1:4200', configuredOrigins, false)).toBe(true);
    });

    it('should still reject malicious domains claiming localhost in development mode', () => {
      expect(isOriginAllowed('http://localhost.attacker.com', configuredOrigins, false)).toBe(false);
      expect(isOriginAllowed('http://127.0.0.1.attacker.com', configuredOrigins, false)).toBe(false);
    });
  });

  describe('validateFileMagicBytes', () => {
    it('should validate PNG magic bytes', () => {
      const validPng = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00]);
      expect(validateFileMagicBytes(validPng, 'image/png')).toBe(true);

      const fakePng = Buffer.from('console.log("malicious script disguised as png")');
      expect(validateFileMagicBytes(fakePng, 'image/png')).toBe(false);
    });

    it('should validate JPEG magic bytes', () => {
      const validJpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);
      expect(validateFileMagicBytes(validJpeg, 'image/jpeg')).toBe(true);
      expect(validateFileMagicBytes(validJpeg, 'image/jpg')).toBe(true);

      const fakeJpeg = Buffer.from('<html><body>malicious</body></html>');
      expect(validateFileMagicBytes(fakeJpeg, 'image/jpeg')).toBe(false);
    });

    it('should validate WebP magic bytes', () => {
      const validWebp = Buffer.from([
        0x52, 0x49, 0x46, 0x46, // RIFF
        0x00, 0x00, 0x00, 0x00, // length
        0x57, 0x45, 0x42, 0x50, // WEBP
      ]);
      expect(validateFileMagicBytes(validWebp, 'image/webp')).toBe(true);

      const fakeWebp = Buffer.from('RIFF0000FAKE');
      expect(validateFileMagicBytes(fakeWebp, 'image/webp')).toBe(false);
    });

    it('should validate PDF magic bytes', () => {
      const validPdf = Buffer.from('%PDF-1.4\n%header');
      expect(validateFileMagicBytes(validPdf, 'application/pdf')).toBe(true);

      const fakePdf = Buffer.from('Not a real pdf');
      expect(validateFileMagicBytes(fakePdf, 'application/pdf')).toBe(false);
    });
  });
});
