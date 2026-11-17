import { getValue, setValue, deleteValue } from '@/utils/storage';
import { useState, useEffect, useCallback } from 'react';

/**
 * React hook for the `bt-` prefixed localStorage wrapper (see utils/storage.ts) with expiration support
 *
 * @param key - Storage key (will be prefixed with 'bt-')
 * @param league - Optional league name to scope the key
 * @returns [value, setValue, deleteValue, loading]
 */
export const useStorage = <T>(key: string, league?: string | null) => {
  const [value, setValueState] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  // Load initial value
  useEffect(() => {
    const loadValue = async () => {
      setLoading(true);
      const storedValue = await getValue<T>(key, league);
      setValueState(storedValue);
      setLoading(false);
    };

    loadValue();
  }, [key, league]);

  // Set value wrapper
  const setStorageValue = useCallback(
    async (newValue: T) => {
      await setValue(key, newValue, league);
      setValueState(newValue);
    },
    [key, league],
  );

  // Delete value wrapper
  const deleteStorageValue = useCallback(async () => {
    await deleteValue(key, league);
    setValueState(null);
  }, [key, league]);

  return [value, setStorageValue, deleteStorageValue, loading] as const;
};
