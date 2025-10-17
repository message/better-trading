import { equivalentPricingsEnhancer } from '@/services/item-results/enhancers/equivalent-pricings';
import { pinnableEnhancer } from '@/services/item-results/enhancers/pinnable';
import { regroupSimilarsEnhancer } from '@/services/item-results/enhancers/regroup-similars';
import * as highlightStatFilters from '@/utils/item-results/enhancers/highlight-stat-filters';
import * as maximumSockets from '@/utils/item-results/enhancers/maximum-sockets';
import { getLocalValue, setLocalValue } from '@/utils/storage';
import { createContext, useCallback, useContext, useState } from 'react';
import type { ItemResultsEnhancerService, ItemResultsPinnedItem } from '@/types/item-results';
import type { ReactNode } from 'react';

const DISABLED_ENHANCERS_STORAGE_KEY = 'disabled-enhancers';

interface ItemResultsContextValue {
  disabledEnhancerSlugs: string[];
  enabledEnhancers: ItemResultsEnhancerService[];
  allEnhancers: ItemResultsEnhancerService[];
  setDisabledEnhancerSlugs: (slugs: string[]) => void;
  clearPinnedItems: () => Promise<void>;
  unpinItemById: (itemId: string) => Promise<void>;
  getPinnedItems: () => Promise<ItemResultsPinnedItem[]>;
  getEnhancerSlugs: () => string[];
}

const ItemResultsContext = createContext<ItemResultsContextValue | null>(null);

interface ItemResultsProviderProps {
  children: ReactNode;
}

/**
 * All available item result enhancers
 * Order matters - enhancers run in this order
 */
const ALL_ENHANCERS: ItemResultsEnhancerService[] = [
  highlightStatFilters,
  maximumSockets,
  pinnableEnhancer,
  equivalentPricingsEnhancer,
  regroupSimilarsEnhancer,
];

const ItemResultsProvider = ({ children }: ItemResultsProviderProps) => {
  const [disabledEnhancerSlugs, setDisabledEnhancerSlugsState] = useState<string[]>(() => {
    const stored = getLocalValue(DISABLED_ENHANCERS_STORAGE_KEY) || '';
    return stored.split(',').filter(Boolean);
  });

  const setDisabledEnhancerSlugs = useCallback((slugs: string[]) => {
    setLocalValue(DISABLED_ENHANCERS_STORAGE_KEY, slugs.join(','));
    setDisabledEnhancerSlugsState(slugs);
  }, []);

  const enabledEnhancers = ALL_ENHANCERS.filter(
    enhancer => !enhancer.slug || !disabledEnhancerSlugs.includes(enhancer.slug),
  );

  const clearPinnedItems = useCallback(async () => {
    pinnableEnhancer.clear();
  }, []);

  const unpinItemById = useCallback(async (itemId: string) => {
    pinnableEnhancer.unpinItemById(itemId);
  }, []);

  const getPinnedItems = useCallback(async () => pinnableEnhancer.getPinnedItems(), []);

  const getEnhancerSlugs = useCallback(() => ALL_ENHANCERS.map(enhancer => enhancer.slug || '').filter(Boolean), []);

  const value: ItemResultsContextValue = {
    disabledEnhancerSlugs,
    enabledEnhancers,
    allEnhancers: ALL_ENHANCERS,
    setDisabledEnhancerSlugs,
    clearPinnedItems,
    unpinItemById,
    getPinnedItems,
    getEnhancerSlugs,
  };

  return <ItemResultsContext.Provider value={value}>{children}</ItemResultsContext.Provider>;
};

const useItemResultsContext = () => {
  const context = useContext(ItemResultsContext);
  if (!context) {
    throw new Error('useItemResultsContext must be used within ItemResultsProvider');
  }
  return context;
};

export { ItemResultsProvider, useItemResultsContext };
