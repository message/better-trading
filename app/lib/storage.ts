const STORAGE_PREFIX = 'bt-';

type MaybeStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

let cachedStorage: MaybeStorage | null | undefined;

const getLocalStorage = (): MaybeStorage | null => {
  if (cachedStorage !== undefined) return cachedStorage;

  try {
    if (typeof globalThis === 'undefined') return null;

    const storage = (globalThis as { localStorage?: MaybeStorage }).localStorage;
    if (!storage) {
      cachedStorage = null;
      return cachedStorage;
    }

    const testKey = `${STORAGE_PREFIX}storage-test`;
    storage.setItem(testKey, '1');
    storage.removeItem(testKey);
    cachedStorage = storage;
    return cachedStorage;
  } catch (error) {
    console.warn('[storage] Local storage is not available.', error);
    cachedStorage = null;
    return cachedStorage;
  }
};

const formatKey = (key: string, league?: string | null) => {
  let formattedKey = key;
  if (league) formattedKey += `--${league}`;

  return `${STORAGE_PREFIX}${formattedKey.toLowerCase()}`;
};

export const setLocalValue = (key: string, value: string, league?: string | null) => {
  const storage = getLocalStorage();
  if (!storage) return;

  storage.setItem(formatKey(key, league), value);
};

export const getLocalValue = (key: string, league?: string | null) => {
  const storage = getLocalStorage();
  if (!storage) return null;

  return storage.getItem(formatKey(key, league));
};

export const deleteLocalValue = (key: string, league?: string | null) => {
  const storage = getLocalStorage();
  if (!storage) return;

  storage.removeItem(formatKey(key, league));
};
