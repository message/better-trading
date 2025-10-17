/**
 * Converts a string to a URL-friendly slug format
 *
 * @param value - The string to slugify
 * @returns The slugified string (lowercase, hyphens instead of spaces, alphanumeric only)
 *
 * @example
 * slugify('Chaos Orb') // returns 'chaos-orb'
 * slugify('Mirror of Kalandra') // returns 'mirror-of-kalandra'
 */
const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^-\w]/g, '');

export { slugify };
