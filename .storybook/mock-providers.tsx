/**
 * Mock providers for Storybook
 *
 * These providers allow Storybook stories to inject mock data
 * instead of using real browser storage and APIs.
 */

import { ItemResultsContext } from '@/contexts/ItemResultsContext';
import { TradeHistoryContext } from '@/contexts/TradeHistoryContext';
import { useCallback, useMemo, useState } from 'react';
import type { ItemResultsContextValue } from '@/contexts/ItemResultsContext';
import type { TradeHistoryContextValue } from '@/contexts/TradeHistoryContext';
import type { ItemResultsPinnedItem } from '@/types/item-results';
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

// =============================================================================
// Item Results Mock Provider
// =============================================================================

interface MockItemResultsProviderProps {
  children: ReactNode;
  mockPinnedItems?: ItemResultsPinnedItem[];
}

const MOCK_ENHANCER_SLUGS = ['highlight-stat-filters', 'maximum-sockets', 'equivalent-pricings', 'regroup-similars'];

export const MockItemResultsProvider = ({ children, mockPinnedItems = [] }: MockItemResultsProviderProps) => {
  const [pinnedItems, setPinnedItems] = useState(mockPinnedItems);
  const [disabledEnhancerSlugs, setDisabledEnhancerSlugs] = useState<string[]>([]);

  const value: ItemResultsContextValue = {
    disabledEnhancerSlugs,
    setDisabledEnhancerSlugs,
    enhancerSlugs: MOCK_ENHANCER_SLUGS,
    pinnedItems,
    clearPinnedItems: () => setPinnedItems([]),
    unpinItemById: itemId => setPinnedItems(items => items.filter(item => item.id !== itemId)),
  };

  return <ItemResultsContext.Provider value={value}>{children}</ItemResultsContext.Provider>;
};

const createElementFromHtml = (html: string): HTMLElement => {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content.firstElementChild as HTMLElement;
};

/** A pinned item shaped like the clones the pinnable enhancer takes from a trade result row */
export const createMockPinnedItem = (id: string, name: string, price: string, minutesAgo: number) => ({
  id,
  pinnedAt: new Date(Date.now() - minutesAgo * 60 * 1000).toISOString(),
  detailsElement: createElementFromHtml(
    `<div class="middle"><div class="itemPopupContainer"><div class="itemHeader">${name}</div></div></div>`,
  ),
  renderedItemElement: createElementFromHtml('<div class="itemRendered"></div>'),
  pricingElement: createElementFromHtml(`<div class="price"><span>${price}</span></div>`),
});
