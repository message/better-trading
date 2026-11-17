/**
 * Mock providers for Storybook
 *
 * These providers allow Storybook stories to inject mock data
 * instead of using real browser storage and APIs.
 */

import { TradeHistoryContext } from '@/contexts/TradeHistoryContext';
import type { TradeHistoryContextValue } from '@/contexts/TradeHistoryContext';
import type { TradeLocationHistoryStruct } from '@/types/trade-location';
import type { ReactNode } from 'react';

// =============================================================================
// Trade History Mock Provider
// =============================================================================

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
