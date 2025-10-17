/**
 * Escapes special characters in a string to be used in a RegExp
 *
 * Source: https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
 *
 * @param value - The string to escape
 * @returns The escaped string safe for use in RegExp
 *
 * @example
 * escapeRegex('test.value') // returns 'test\\.value'
 * escapeRegex('price: $10') // returns 'price: \\$10'
 */
const escapeRegex = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export { escapeRegex };
