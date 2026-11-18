import { useTradeHistory } from '@/hooks/useTradeHistory';
import { useTradeLocation } from '@/hooks/useTradeLocation';
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { TradeLocationHistoryStruct } from '@/types/trade-location';
import type { ReactNode } from 'react';

interface TradeHistoryContextValue {
  historyEntries: TradeLocationHistoryStruct[];
  refreshHistoryEntries: () => Promise<void>;
  clearHistoryEntries: () => Promise<void>;
}

const TradeHistoryContext = createContext<TradeHistoryContextValue | null>(null);

interface TradeHistoryProviderProps {
  children: ReactNode;
}

const TradeHistoryProvider = ({ children }: TradeHistoryProviderProps) => {
  const tradeHistory = useTradeHistory();
  const [historyEntries, setHistoryEntries] = useState<TradeLocationHistoryStruct[]>([]);
  // Serializes the read-modify-write of the stored history across quick successive location changes
  const logQueueRef = useRef(Promise.resolve());

  const refreshHistoryEntries = useCallback(async () => {
    setHistoryEntries(await tradeHistory.fetchHistoryEntries());
  }, [tradeHistory]);

  const clearHistoryEntries = useCallback(async () => {
    setHistoryEntries([]);
    await tradeHistory.clearHistoryEntries();
  }, [tradeHistory]);

  // Same as 1.9.1: the search is logged before the change is published, so the refreshed list includes it
  useTradeLocation({
    onChange: ({ newTradeLocation }) => {
      logQueueRef.current = logQueueRef.current
        .then(() => tradeHistory.maybeLogTradeLocation(newTradeLocation))
        .then(refreshHistoryEntries)
        .catch(error => console.error('Failed to log the trade location:', error));
    },
  });

  const value = useMemo(
    () => ({ historyEntries, refreshHistoryEntries, clearHistoryEntries }),
    [historyEntries, refreshHistoryEntries, clearHistoryEntries],
  );

  return <TradeHistoryContext.Provider value={value}>{children}</TradeHistoryContext.Provider>;
};

const useTradeHistoryContext = () => {
  const context = useContext(TradeHistoryContext);
  if (!context) {
    throw new Error('useTradeHistoryContext must be used within TradeHistoryProvider');
  }
  return context;
};

export type { TradeHistoryContextValue };
export { TradeHistoryContext, TradeHistoryProvider, useTradeHistoryContext };
