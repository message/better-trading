import { formatRelativeTime } from './format-relative-time';
import { describe, expect, it } from 'vitest';

const now = new Date('2026-01-01T12:00:00Z').getTime();
const ago = (seconds: number) => new Date(now - seconds * 1000).toISOString();

describe('formatRelativeTime', () => {
  it('has no "about" for hours', () => {
    expect(formatRelativeTime(ago(22 * 3600 + 40 * 60), 'en', now)).toBe('22 hours ago');
  });

  it.each([
    [30, '30 seconds ago'],
    [5 * 60, '5 minutes ago'],
    [3599, '59 minutes ago'],
    [3 * 86_400, '3 days ago'],
    [90 * 86_400, '3 months ago'],
  ])('%is ago -> %s', (seconds, expected) => {
    expect(formatRelativeTime(ago(seconds), 'en', now)).toBe(expected);
  });

  it('follows the locale', () => {
    expect(formatRelativeTime(ago(2 * 3600), 'ru', now)).toBe('2 часа назад');
  });
});
