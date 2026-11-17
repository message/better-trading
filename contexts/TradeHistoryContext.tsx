import { useTradeHistory } from '@/hooks/useTradeHistory';
import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

type TradeHistoryContextValue = ReturnType<typeof useTradeHistory>;

const TradeHistoryContext = createContext<TradeHistoryContextValue | null>(null);

interface TradeHistoryProviderProps {
  children: ReactNode;
}

const TradeHistoryProvider = ({ children }: TradeHistoryProviderProps) => (
  <TradeHistoryContext.Provider value={useTradeHistory()}>{children}</TradeHistoryContext.Provider>
);

const useTradeHistoryContext = () => {
  const context = useContext(TradeHistoryContext);
  if (!context) {
    throw new Error('useTradeHistoryContext must be used within TradeHistoryProvider');
  }
  return context;
};

export type { TradeHistoryContextValue };
export { TradeHistoryContext, TradeHistoryProvider, useTradeHistoryContext };
