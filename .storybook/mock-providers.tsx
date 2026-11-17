/**
 * Mock providers for Storybook
 *
 * These providers allow Storybook stories to inject mock data
 * instead of using real browser storage and APIs.
 */

import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { TradeLocationHistoryStruct } from '@/types/trade-location';

// =============================================================================
// Trade History Mock Provider
// =============================================================================

interface TradeHistoryContextValue {
  fetchHistoryEntries: () => Promise<TradeLocationHistoryStruct[]>;
  clearHistoryEntries: () => Promise<void>;
  maybeLogTradeLocation: (location: unknown) => Promise<void>;
}

const TradeHistoryContext = createContext<TradeHistoryContextValue | null>(null);

interface TradeHistoryProviderProps {
  children: ReactNode;
  mockHistoryEntries?: TradeLocationHistoryStruct[];
}

export const MockTradeHistoryProvider = ({ children, mockHistoryEntries = [] }: TradeHistoryProviderProps) => {
  const value: TradeHistoryContextValue = {
    fetchHistoryEntries: async () => mockHistoryEntries,
    clearHistoryEntries: async () => {
      console.log('[Mock] Clearing history');
    },
    maybeLogTradeLocation: async () => {
      console.log('[Mock] Logging trade location');
    },
  };

  return <TradeHistoryContext.Provider value={value}>{children}</TradeHistoryContext.Provider>;
};

export const useMockableTradeHistory = () => {
  const mockContext = useContext(TradeHistoryContext);
  return mockContext;
};

// =============================================================================
// Helper to create mock history entries
// =============================================================================

export const createMockHistoryEntry = (
  id: string,
  title: string,
  slug: string,
  type: string,
  league: string,
  hoursAgo: number,
): TradeLocationHistoryStruct => ({
  id,
  title,
  slug,
  type,
  league,
  version: '2',
  createdAt: new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString(),
});
