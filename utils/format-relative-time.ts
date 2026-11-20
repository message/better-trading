// Largest unit first; the first one that fits wins, falling back to seconds
const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 31_536_000],
  ['month', 2_592_000],
  ['day', 86_400],
  ['hour', 3_600],
  ['minute', 60],
];

/** Formats an ISO date relative to now in any locale (plural rules come from the browser's CLDR data), e.g. "22 hours ago" */
const formatRelativeTime = (isoDate: string, locale: string, now = Date.now()): string => {
  const seconds = Math.trunc((new Date(isoDate).getTime() - now) / 1000);
  const [unit, size] = UNITS.find(([, unitSeconds]) => Math.abs(seconds) >= unitSeconds) ?? ['second', 1];

  return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(Math.trunc(seconds / size), unit);
};

export { formatRelativeTime };
