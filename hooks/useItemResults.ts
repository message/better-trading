import { useItemResultsContext } from '@/contexts/ItemResultsContext';
import { useItemEnhancer } from '@/hooks/useItemEnhancer';
import type { ItemResultsPinnedItem } from '@/types/item-results';

interface UseItemResultsOptions {
  enabled?: boolean;
}

/**
 * Hook to manage item results enhancement and pinning
 *
 * Orchestrates item result enhancers and provides access to pinned items.
 * Uses the ItemResultsContext for configuration and the useItemEnhancer hook
 * for actual enhancement execution.
 *
 * @param options - Configuration options
 * @param options.enabled - Whether enhancement is active (default: true)
 *
 * @example
 * const { clearPinnedItems, getPinnedItems, disabledEnhancerSlugs } = useItemResults();
 */
const useItemResults = (options: UseItemResultsOptions = {}) => {
  const { enabled = true } = options;

  const {
    disabledEnhancerSlugs,
    enabledEnhancers,
    allEnhancers,
    setDisabledEnhancerSlugs,
    clearPinnedItems: clearPinnedItemsFromContext,
    unpinItemById: unpinItemByIdFromContext,
    getPinnedItems: getPinnedItemsFromContext,
    getEnhancerSlugs,
  } = useItemResultsContext();

  // Set up item enhancement with MutationObserver
  useItemEnhancer({
    enhancers: enabledEnhancers,
    disabledEnhancerSlugs,
    enabled,
  });

  const clearPinnedItems = async (): Promise<void> => {
    await clearPinnedItemsFromContext();
  };

  const unpinItemById = async (itemId: string): Promise<void> => {
    await unpinItemByIdFromContext(itemId);
  };

  const getPinnedItems = async (): Promise<ItemResultsPinnedItem[]> => await getPinnedItemsFromContext();

  return {
    disabledEnhancerSlugs,
    enabledEnhancers,
    allEnhancers,
    setDisabledEnhancerSlugs,
    clearPinnedItems,
    unpinItemById,
    getPinnedItems,
    getEnhancerSlugs,
  };
};

export { useItemResults };
export type { UseItemResultsOptions };
