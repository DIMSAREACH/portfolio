/**
 * Calculates estimated reading time in minutes based on ~200 words per minute.
 * Returns 0 for empty content, minimum 1 minute for non-empty text.
 */
export function calculateReadingTime(text: string): number {
  if (!text || typeof text !== 'string') {
    return 0;
  }

  const words = text.trim().split(/\s+/).filter(Boolean).length;
  if (words === 0) {
    return 0;
  }

  return Math.max(1, Math.ceil(words / 200));
}

export default calculateReadingTime;
