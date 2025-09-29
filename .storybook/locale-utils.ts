/**
 * Locale utilities shared by Storybook stories.
 * These helpers intentionally stay framework-agnostic (no React imports) so they can be reused
 * in tests or other build steps if desired.
 */

export interface ResolveLocaleOptions {
  /** Fallback locale code to try last (default: 'en-US'). */
  fallback?: string;
  /** When true (default), logs a console.warn in dev if the resolved value had to fall back. */
  warn?: boolean;
}

/**
 * Resolve a value from a locale->value map using a cascade:
 *  1. exact locale (e.g. 'fr-FR')
 *  2. language-only (e.g. 'fr') if present
 *  3. fallback locale (default 'en-US')
 *
 * Generic so you can store strings, objects, etc. Ensures the return type is T.
 */
export function resolveLocaleValue<T>(
  locale: string | undefined,
  map: Record<string, T>,
  options: ResolveLocaleOptions = {},
): T {
  const fallback = options.fallback ?? 'en-US';
  const input = locale || fallback;
  const lang = input.split('-')[0];

  let resolved: T | undefined = map[input];
  let source: string | undefined = resolved ? input : undefined;

  if (!resolved && map[lang]) {
    resolved = map[lang];
    source = lang;
  }
  if (!resolved) {
    resolved = map[fallback];
    source = fallback;
  }

  if (process.env.NODE_ENV !== 'production' && options.warn !== false) {
    if (source !== input) {
      console.warn(`[locale-utils] Value for locale "${input}" not found; using "${source}".`);
    }
  }

  if (resolved === undefined) {
    throw new Error(`[locale-utils] No value could be resolved. Fallback locale "${fallback}" missing in map.`);
  }

  return resolved;
}

/**
 * Convenience helper for building a simple message map. Provided mostly for symmetry and future extension.
 */
export function defineMessages(map: Record<string, string>): Record<string, string> {
  return map; // passthrough – acts as a semantic marker
}
