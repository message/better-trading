/**
 * Mock providers for Storybook
 *
 * These providers allow Storybook stories to inject mock data
 * instead of using real browser storage and APIs.
 */

import { TradeHistoryContext } from '@/contexts/TradeHistoryContext';
import type { TradeHistoryContextValue } from '@/contexts/TradeHistoryContext';
import { useCallback, useMemo, useState } from 'react';
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
  const [historyEntries, setHistoryEntries] = useState<TradeLocationHistoryStruct[]>([]);

  const refreshHistoryEntries = useCallback(async () => setHistoryEntries(mockHistoryEntries), [mockHistoryEntries]);
  const clearHistoryEntries = useCallback(async () => setHistoryEntries([]), []);

  const value: TradeHistoryContextValue = useMemo(
    () => ({ historyEntries, refreshHistoryEntries, clearHistoryEntries }),
    [historyEntries, refreshHistoryEntries, clearHistoryEntries],
  );

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
