// Type guard to safely access chrome APIs
declare const chrome: typeof browser;

const STORAGE_PREFIX = 'bt-';

// Constants for past leagues cleanup
const PAST_LEAGUES = ['blight', 'metamorph', 'delirium'];

type MaybeStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

interface StoragePayload<T = unknown> {
  value: T;
  expiresAt: string | null;
}

let cachedStorage: MaybeStorage | null | undefined;

const getLocalStorage = (): MaybeStorage | null => {
  if (cachedStorage !== undefined) return cachedStorage;

  try {
    if (typeof globalThis === 'undefined') return null;

    const storageInstance = (globalThis as { localStorage?: MaybeStorage }).localStorage;
    if (!storageInstance) {
      cachedStorage = null;
      return cachedStorage;
    }

    const testKey = `${STORAGE_PREFIX}storage-test`;
    storageInstance.setItem(testKey, '1');
    storageInstance.removeItem(testKey);
    cachedStorage = storageInstance;
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

  return formattedKey.toLowerCase();
};

const fetchAllKeys = async (): Promise<string[]> =>
  // WXT storage API doesn't have a direct "get all keys" method
  // We need to use the underlying chrome.storage API
  new Promise(resolve => {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(null, result => {
        resolve(Object.keys(result));
      });
    } else {
      resolve([]);
    }
  });

// ============================================================================
// localStorage functions (for simple key-value storage)
// ============================================================================

const setLocalValue = (key: string, value: string, league?: string | null) => {
  const localStorage = getLocalStorage();
  if (!localStorage) return;

  localStorage.setItem(`${STORAGE_PREFIX}${formatKey(key, league)}`, value);
};

const getLocalValue = (key: string, league?: string | null) => {
  const localStorage = getLocalStorage();
  if (!localStorage) return null;

  return localStorage.getItem(`${STORAGE_PREFIX}${formatKey(key, league)}`);
};

const deleteLocalValue = (key: string, league?: string | null) => {
  const localStorage = getLocalStorage();
  if (!localStorage) return;

  localStorage.removeItem(`${STORAGE_PREFIX}${formatKey(key, league)}`);
};

// ============================================================================
// chrome.storage.local functions (for extension storage with expiration)
// ============================================================================

const setValue = async (key: string, value: unknown, league?: string | null): Promise<void> => {
  const formattedKey = formatKey(key, league);
  const payload: StoragePayload = {
    expiresAt: null,
    value,
  };

  return new Promise(resolve => {
    chrome.storage.local.set({ [formattedKey]: payload }, resolve);
  });
};

const setEphemeralValue = async (
  key: string,
  value: unknown,
  expirationDate: Date,
  league?: string | null,
): Promise<void> => {
  const formattedKey = formatKey(key, league);
  const payload: StoragePayload = {
    expiresAt: expirationDate.toUTCString(),
    value,
  };

  return new Promise(resolve => {
    chrome.storage.local.set({ [formattedKey]: payload }, resolve);
  });
};

const getValue = async <T>(key: string, league?: string | null): Promise<T | null> => {
  const formattedKey = formatKey(key, league);

  return new Promise(resolve => {
    chrome.storage.local.get([formattedKey], result => {
      const payload = result[formattedKey] as StoragePayload<T> | undefined;

      if (!payload) {
        resolve(null);
        return;
      }

      const { expiresAt, value } = payload;

      if (!expiresAt) {
        resolve(value);
        return;
      }

      const expirationTimestamp = new Date(expiresAt).getTime();
      const currentTimestamp = new Date().getTime();

      if (currentTimestamp > expirationTimestamp) {
        // Clean up expired value
        deleteValue(key, league).then(() => resolve(null));
        return;
      }

      resolve(value);
    });
  });
};

const deleteValue = async (key: string, league?: string | null): Promise<void> => {
  const formattedKey = formatKey(key, league);

  return new Promise(resolve => {
    chrome.storage.local.remove(formattedKey, resolve);
  });
};

// ============================================================================
// Cleanup utilities
// ============================================================================

const cleanupPastLeagues = async (): Promise<void> => {
  const pastLeaguesRegex = new RegExp(`--(${PAST_LEAGUES.join('|')})$`);
  const allKeys = await fetchAllKeys();

  const keysToRemove = allKeys.filter((storageKey: string) => pastLeaguesRegex.test(storageKey));

  if (keysToRemove.length === 0) return;

  // Remove all matching keys
  return new Promise(resolve => {
    chrome.storage.local.remove(keysToRemove, resolve);
  });
};

export {
  setLocalValue,
  getLocalValue,
  deleteLocalValue,
  setValue,
  setEphemeralValue,
  getValue,
  deleteValue,
  cleanupPastLeagues,
};
