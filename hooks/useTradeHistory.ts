import { getValue, setValue, deleteValue } from '@/utils/storage';
import { compareTradeLocations } from '@/utils/trade-location';
import { uniqueId } from '@/utils/unique-id';
import { useCallback, useMemo } from 'react';
import type { TradeLocationHistoryStruct, TradeLocationStruct } from '@/types/trade-location';

// Constants
const HISTORY_KEY = 'trade-history';
const MAXIMUM_HISTORY_LENGTH = 50;

const migrateOldHistory = (history: TradeLocationHistoryStruct): TradeLocationHistoryStruct => {
  if (!history.version) {
    return { ...history, version: '1' };
  }
  return history;
};

const useTradeHistory = () => {
  const fetchHistoryEntries = useCallback(async (): Promise<TradeLocationHistoryStruct[]> => {
    const history = await getValue<TradeLocationHistoryStruct[]>(HISTORY_KEY);
    if (!history) return [];

    return history.map(migrateOldHistory);
  }, []);

  const maybeLogTradeLocation = useCallback(
    // `title` is taken by the caller when the location changes, before the search panel can change again
    async (newTradeLocation: TradeLocationStruct, title: string) => {
      if (!newTradeLocation.version || !newTradeLocation.league || !newTradeLocation.type || !newTradeLocation.slug)
        return;

      const historyEntries = await fetchHistoryEntries();
      const lastEntry = historyEntries[0];
      if (lastEntry && compareTradeLocations(newTradeLocation, lastEntry)) return;

      historyEntries.unshift({
        ...newTradeLocation,
        version: newTradeLocation.version,
        league: newTradeLocation.league,
        type: newTradeLocation.type,
        slug: newTradeLocation.slug,
        id: uniqueId(),
        title,
        createdAt: new Date().toISOString(),
      });
      historyEntries.splice(MAXIMUM_HISTORY_LENGTH);

      await setValue(HISTORY_KEY, historyEntries);
    },
    [fetchHistoryEntries],
  );

  const clearHistoryEntries = useCallback(async () => deleteValue(HISTORY_KEY), []);

  return useMemo(
    () => ({ maybeLogTradeLocation, fetchHistoryEntries, clearHistoryEntries }),
    [maybeLogTradeLocation, fetchHistoryEntries, clearHistoryEntries],
  );
};

export { useTradeHistory };
