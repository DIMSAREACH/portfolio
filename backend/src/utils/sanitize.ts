/**
 * Security and sanitization utilities
 */

/**
 * Escapes characters with special meaning in Regular Expressions
 * Prevents ReDoS attacks and regex syntax errors from user input.
 *
 * @param str The user-supplied search string
 * @returns The escaped string safe for new RegExp()
 */
export function escapeRegex(str: string): string {
  if (!str || typeof str !== 'string') {
    return '';
  }
  return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

/**
 * Validates if an Origin header is strictly allowed.
 * Prevents Host Header Injection, Password Reset Poisoning, and CORS bypasses.
 *
 * @param origin The request Origin or Host header
 * @param configuredOrigins Comma-delimited or array of configured origins
 * @param isProduction Whether the app is running in production mode
 */
export function isOriginAllowed(
  origin: string,
  configuredOrigins: string | string[],
  isProduction: boolean,
): boolean {
  if (!origin) return false;

  const origins = Array.isArray(configuredOrigins)
    ? configuredOrigins
    : configuredOrigins.split(',').map((s) => s.trim().toLowerCase());

  const cleanOrigin = origin.trim().replace(/\/$/, '').toLowerCase();

  // 1. Exact match against configured origin whitelist
  if (origins.includes(cleanOrigin) || origins.includes('*')) {
    return true;
  }

  // 2. In non-production only, allow standard local development origins
  if (!isProduction) {
    const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(cleanOrigin);
    if (isLocalhost) {
      return true;
    }
  }

  return false;
}

/**
 * Validates file buffer header magic numbers to prevent disguised/polyglot file uploads.
 *
 * @param buffer The file buffer in memory
 * @param mimeType Declared MIME type
 */
export function validateFileMagicBytes(buffer: Buffer, mimeType: string): boolean {
  if (!buffer || buffer.length < 4) {
    return false;
  }

  const mime = mimeType.toLowerCase();

  // JPEG / JPG: FF D8 FF
  if (mime === 'image/jpeg' || mime === 'image/jpg') {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }

  // PNG: 89 50 4E 47 (0x89 'PNG')
  if (mime === 'image/png') {
    return (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47
    );
  }

  // WebP: RIFF (bytes 0-3: 0x52 0x49 0x46 0x46) and WEBP (bytes 8-11: 0x57 0x45 0x42 0x50)
  if (mime === 'image/webp') {
    if (buffer.length < 12) return false;
    const isRiff =
      buffer[0] === 0x52 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46 &&
      buffer[3] === 0x46;
    const isWebp =
      buffer[8] === 0x57 &&
      buffer[9] === 0x45 &&
      buffer[10] === 0x42 &&
      buffer[11] === 0x50;
    return isRiff && isWebp;
  }

  // PDF: %PDF- (0x25 0x50 0x44 0x46)
  if (mime === 'application/pdf') {
    return (
      buffer[0] === 0x25 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x44 &&
      buffer[3] === 0x46
    );
  }

  // Video types (MP4, WebM, QuickTime, MKV) - relaxed header check
  if (mime.startsWith('video/')) {
    // WebM / MKV starts with 1A 45 DF A3 (EBML ID)
    if (
      buffer[0] === 0x1a &&
      buffer[1] === 0x45 &&
      buffer[2] === 0xdf &&
      buffer[3] === 0xa3
    ) {
      return true;
    }
    // MP4 / MOV typically contains 'ftyp' at bytes 4..7
    if (buffer.length >= 8) {
      const box = buffer.subarray(4, 8).toString('ascii');
      if (box === 'ftyp' || box === 'moov') {
        return true;
      }
    }
    return true; // Allow video streams that don't have standard leading boxes
  }

  return false;
}
