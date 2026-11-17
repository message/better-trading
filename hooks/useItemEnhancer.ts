import { parseElement } from '@/utils/item-results/item-element';
import { useCallback, useEffect, useRef } from 'react';
import type { ItemResultsEnhancerService } from '@/types/item-results';

/**
 * Helper function to run async operations sequentially like asyncLoop
 */
const asyncLoop = async <T>(items: T[], callback: (item: T) => void | Promise<void>) => {
  for (const item of items) {
    await callback(item);
  }
};

interface UseItemEnhancerOptions {
  enhancers: ItemResultsEnhancerService[];
  disabledEnhancerSlugs?: string[];
  enabled?: boolean;
}

/**
 * Hook to manage item result enhancement with MutationObserver
 *
 * This hook observes the trade search results container and automatically
 * enhances new item results as they appear using registered enhancer services.
 *
 * @param options - Configuration options
 * @param options.enhancers - Array of enhancer services to apply
 * @param options.disabledEnhancerSlugs - Array of enhancer slugs to skip
 * @param options.enabled - Whether the enhancer is active (default: true)
 *
 * @example
 * const enhancers = [pinnableEnhancer, equivalentPricingsEnhancer];
 * const { enhanceItems, clearEnhancedItems } = useItemEnhancer({
 *   enhancers,
 *   disabledEnhancerSlugs: ['regroup-similars']
 * });
 */
const useItemEnhancer = (options: UseItemEnhancerOptions) => {
  const { enhancers, disabledEnhancerSlugs = [], enabled = true } = options;
  const queueRef = useRef<Promise<void>>(Promise.resolve());
  const observerRef = useRef<MutationObserver | null>(null);

  /**
   * Enqueues a task to run after previous tasks complete
   */
  const enqueueTask = useCallback(async (fn: () => Promise<void>) => {
    queueRef.current = queueRef.current.then(fn).catch(console.error);
    return queueRef.current;
  }, []);

  /**
   * Enhances unenhanced item elements with all registered enhancers
   */
  const enhanceItems = useCallback(
    async (unenhancedElements: HTMLDivElement[]) => {
      if (unenhancedElements.length === 0) return;
      if (unenhancedElements[0].classList.contains('exchange')) return;

      // Run prepare on all enabled enhancers first
      await asyncLoop<ItemResultsEnhancerService>(enhancers, enhancer => {
        if (enhancer.slug && disabledEnhancerSlugs.includes(enhancer.slug)) return;
        if (!enhancer.prepare) return;
        return enhancer.prepare();
      });

      // Then enhance each item
      await asyncLoop<HTMLDivElement>(unenhancedElements, async unenhancedElement => {
        const parsedItem = parseElement(unenhancedElement);

        await asyncLoop<ItemResultsEnhancerService>(enhancers, enhancer => {
          if (enhancer.slug && disabledEnhancerSlugs.includes(enhancer.slug)) return;

          return enhancer.enhance(unenhancedElement, parsedItem);
        });

        unenhancedElement.toggleAttribute('bt-enhanced', true);
      });
    },
    [enhancers, disabledEnhancerSlugs],
  );

  /**
   * Clears all enhanced items state
   */
  const clearEnhancedItems = useCallback(async () => {
    await asyncLoop<ItemResultsEnhancerService>(enhancers, enhancer => enhancer.clear && enhancer.clear());
  }, [enhancers]);

  /**
   * Main task to enhance items or clear if results are empty
   */
  const performEnhanceTask = useCallback(async () => {
    const itemElementsCount = window.document.querySelectorAll('.resultset > div.row').length;
    const unenhancedElements = Array.from(
      window.document.querySelectorAll<HTMLDivElement>('.resultset > div.row[data-id]:not([bt-enhanced])'),
    );

    if (unenhancedElements.length) {
      await enhanceItems(unenhancedElements);
    } else if (itemElementsCount === 0) {
      await clearEnhancedItems();
    }
  }, [enhanceItems, clearEnhancedItems]);

  /**
   * Initialize all enhancers
   */
  const initializeEnhancers = useCallback(async () => {
    await asyncLoop<ItemResultsEnhancerService>(enhancers, enhancer => enhancer.initialize && enhancer.initialize());
  }, [enhancers]);

  /**
   * Set up MutationObserver to watch for new items
   */
  useEffect(() => {
    if (!enabled) return;

    const tradeAppElement = window.document.getElementById('trade');
    if (!tradeAppElement || !tradeAppElement.parentElement) return;

    // Initialize all enhancers
    initializeEnhancers().catch(console.error);

    // Create observer
    observerRef.current = new MutationObserver(() => {
      enqueueTask(performEnhanceTask).catch(console.error);
    });

    // Start observing
    observerRef.current.observe(tradeAppElement.parentElement, {
      childList: true,
      subtree: true,
    });

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [enabled, enqueueTask, performEnhanceTask, initializeEnhancers]);

  return {
    enhanceItems,
    clearEnhancedItems,
  };
};

export { useItemEnhancer };
export type { UseItemEnhancerOptions };
