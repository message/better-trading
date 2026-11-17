import { useItemResultsContext } from '@/contexts/ItemResultsContext';
import type { ItemResultsPinnedItem } from '@/types/item-results';

/**
 * Read/write access to item enhancer settings and pinned items, for page components.
 *
 * Does NOT mount the item enhancer: `useItemEnhancer` observes the whole trade page via a MutationObserver
 * and must be mounted exactly once, in the shell (wired in #6), not by every page that calls this hook.
 *
 * @example
 * const { clearPinnedItems, getPinnedItems, disabledEnhancerSlugs } = useItemResults();
 */
const useItemResults = () => {
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
