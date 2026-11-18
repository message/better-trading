import { useFlashMessagesContext } from '@/contexts/FlashMessagesContext';
import { useItemEnhancer } from '@/hooks/useItemEnhancer';
import { equivalentPricingsEnhancer } from '@/services/item-results/enhancers/equivalent-pricings';
import { PinnableEnhancer } from '@/services/item-results/enhancers/pinnable';
import { RegroupSimilarsEnhancer } from '@/services/item-results/enhancers/regroup-similars';
import * as highlightStatFilters from '@/utils/item-results/enhancers/highlight-stat-filters';
import * as maximumSockets from '@/utils/item-results/enhancers/maximum-sockets';
import { getLocalValue, setLocalValue } from '@/utils/storage';
import { parseCurrentPath } from '@/utils/trade-location';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { ItemResultsEnhancerService, ItemResultsPinnedItem } from '@/types/item-results';
import type { ReactNode } from 'react';

const DISABLED_ENHANCERS_STORAGE_KEY = 'disabled-enhancers';

interface ItemResultsContextValue {
  disabledEnhancerSlugs: string[];
  setDisabledEnhancerSlugs: (slugs: string[]) => void;
  /** Slugs of the enhancers the user can toggle */
  enhancerSlugs: string[];
  pinnedItems: ItemResultsPinnedItem[];
  clearPinnedItems: () => void;
  unpinItemById: (itemId: string) => void;
}

const ItemResultsContext = createContext<ItemResultsContextValue | null>(null);

interface ItemResultsMessages {
  pinLabel: string;
  unpinLabel: string;
  maximumSocketsWarning: (maximum: number) => string;
  regroupSimilarsLabel: (count: number) => string;
  genericAlertMessage: string;
}

interface ItemResultsProviderProps {
  children: ReactNode;
  messages: ItemResultsMessages;
  /** Called after any pin, unpin or clear, like the 1.9.1 `pinned-items-change` event */
  onPinnedItemsChange?: () => void;
}

/**
 * Owns the item result enhancers and mounts the observer over the trade results (once, so mount this provider once).
 * The enhancers are created once with the strings given on first render; the order of the list is the order they run in.
 */
const ItemResultsProvider = ({ children, messages, onPinnedItemsChange }: ItemResultsProviderProps) => {
  const { addFlash } = useFlashMessagesContext();
  const [pinnedItems, setPinnedItems] = useState<ItemResultsPinnedItem[]>([]);
  const [disabledEnhancerSlugs, setDisabledEnhancerSlugsState] = useState<string[]>(() =>
    (getLocalValue(DISABLED_ENHANCERS_STORAGE_KEY) || '').split(',').filter(Boolean),
  );

  // The enhancers live outside React, so they call back through refs to always reach the latest callbacks
  const callbacksRef = useRef({ addFlash, onPinnedItemsChange });
  useEffect(() => {
    callbacksRef.current = { addFlash, onPinnedItemsChange };
  }, [addFlash, onPinnedItemsChange]);

  const [{ pinnableEnhancer, enhancers }] = useState(() => {
    const pinnableEnhancer = new PinnableEnhancer({
      pinButtonText: messages.pinLabel,
      unpinButtonText: messages.unpinLabel,
      onAlert: () => callbacksRef.current.addFlash(messages.genericAlertMessage, 'alert'),
      onPinnedItemsChange: () => {
        setPinnedItems(pinnableEnhancer.getPinnedItems());
        callbacksRef.current.onPinnedItemsChange?.();
      },
    });

    const allEnhancers: ItemResultsEnhancerService[] = [
      highlightStatFilters,
      {
        slug: maximumSockets.slug,
        enhance: (itemElement, parsedItem) =>
          parsedItem &&
          maximumSockets.enhance(itemElement, parsedItem, {
            tradeLocationVersion: parseCurrentPath(window.location.pathname).version,
            warningMessage: messages.maximumSocketsWarning,
          }),
      },
      pinnableEnhancer,
      equivalentPricingsEnhancer,
      new RegroupSimilarsEnhancer({ toggleButtonText: messages.regroupSimilarsLabel }),
    ];

    return { pinnableEnhancer, enhancers: allEnhancers };
  });

  useItemEnhancer(enhancers, disabledEnhancerSlugs);

  const setDisabledEnhancerSlugs = useCallback((slugs: string[]) => {
    setLocalValue(DISABLED_ENHANCERS_STORAGE_KEY, slugs.join(','));
    setDisabledEnhancerSlugsState(slugs);
  }, []);

  const value: ItemResultsContextValue = {
    disabledEnhancerSlugs,
    setDisabledEnhancerSlugs,
    enhancerSlugs: enhancers.flatMap(enhancer => (enhancer.slug ? [enhancer.slug] : [])),
    pinnedItems,
    clearPinnedItems: () => pinnableEnhancer.clear(),
    unpinItemById: itemId => pinnableEnhancer.unpinItemById(itemId),
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

export { ItemResultsContext, ItemResultsProvider, useItemResultsContext };
export type { ItemResultsContextValue, ItemResultsMessages };
