/**
 * Generates a URL-friendly slug from an input string.
 * Normalizes unicode, converts to lowercase, replaces spaces with hyphens,
 * removes non-alphanumeric characters, and trims trailing/leading hyphens.
 */
export function slugify(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return text
    .normalize('NFD') // Normalize accented characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric except spaces and hyphens
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with a single hyphen
    .replace(/^-+|-+$/g, ''); // Trim hyphens from beginning and end
}

export default slugify;
