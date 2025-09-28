// Utility helpers to streamline defining i18n variants in Storybook stories.
// These are purely build-time conveniences for authoring stories.

export type LocaleStringMap = Record<string, string>;

/**
 * Convert a simple locale => message map into the richer variants structure
 * expected by parameters.i18n.variants.
 */
export function buildMessageVariants(messages: LocaleStringMap) {
  return Object.entries(messages).reduce<Record<string, { args: { message: string } }>>((acc, [locale, msg]) => {
    acc[locale] = { args: { message: msg } };
    return acc;
  }, {});
}

/**
 * Create a full i18n parameter block given a messages map and optional overrides.
 */
export function createI18nParam(messages: LocaleStringMap, options?: { fallbackLocale?: string; inherit?: boolean }) {
  return {
    fallbackLocale: options?.fallbackLocale ?? 'en-US',
    inherit: options?.inherit ?? true,
    variants: buildMessageVariants(messages),
  };
}

