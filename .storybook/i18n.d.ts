// Ambient type augmentation for custom i18n story parameter.
// This lets you get IntelliSense + type checking when defining parameters.i18n in stories.

import type { Args, Parameters } from '@storybook/types';

export interface LocaleVariant<TArgs = Args> {
  args?: Partial<TArgs>;
  parameters?: Parameters;
  /** Optional docs description override for this locale */
  docsDescription?: string;
}

export interface I18nStoryParameter<TArgs = Args> {
  /** Record of locale => variant overrides */
  variants: Record<string, LocaleVariant<TArgs>>;
  /** Fallback locale code if active locale not present */
  fallbackLocale?: string;
  /** If false, only the matched locale variant is used (no merge). Default true (merge). */
  inherit?: boolean;
}

// Module augmentation: add `i18n` to Storybook's Parameters interface
// so TS stops complaining about the custom field.
// Storybook types live in '@storybook/types'.
declare module '@storybook/types' {
  interface Parameters {
    i18n?: I18nStoryParameter<any>;
  }
}

