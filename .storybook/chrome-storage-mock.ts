/**
 * In-memory stand-in for `chrome.storage.local` (callback API only, as used by `utils/storage.ts`), so stories can
 * run the real contexts and services. Data lives until the Storybook tab is reloaded.
 */
type Items = Record<string, unknown>;

const store: Items = {};

const pick = (keys: string | string[] | null): Items => {
  if (keys === null) return { ...store };
  return Object.fromEntries((Array.isArray(keys) ? keys : [keys]).filter(k => k in store).map(k => [k, store[k]]));
};

const local = {
  get: (keys: string | string[] | null, callback: (items: Items) => void) => callback(pick(keys)),
  set: (items: Items, callback?: () => void) => {
    Object.assign(store, items);
    callback?.();
  },
  remove: (keys: string | string[], callback?: () => void) => {
    for (const key of Array.isArray(keys) ? keys : [keys]) delete store[key];
    callback?.();
  },
};

/** Replaces the whole store with values wrapped the way `setValue` persists them */
export const seedChromeStorage = (values: Items) => {
  for (const key of Object.keys(store)) delete store[key];
  for (const [key, value] of Object.entries(values)) store[key] = { value, expiresAt: null };
};

// Chrome exposes a `chrome` object to regular pages too, just without `storage`
const globals = globalThis as { chrome?: { storage?: unknown } };
globals.chrome ??= {};
globals.chrome.storage ??= { local };
