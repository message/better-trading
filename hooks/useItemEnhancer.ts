import { parseElement } from '@/utils/item-results/item-element';
import { useEffect, useRef } from 'react';
import type { ItemResultsEnhancerService } from '@/types/item-results';

const RESULT_ROWS_SELECTOR = '.resultset > div.row';
const UNENHANCED_ROWS_SELECTOR = '.resultset > div.row[data-id]:not([bt-enhanced])';

/**
 * Observes the trade results and runs the enhancers on every new result row, once per row
 * (`initialize` → `prepare` → `enhance` per row), or `clear` when the results are emptied.
 * Tasks run sequentially through a promise queue, like the 1.9.1 `enqueueTask`.
 *
 * Mount exactly once (in `ItemResultsProvider`): the observer watches the whole trade page.
 * Disabled enhancers are read on every task, so toggling one applies to newly loaded results without remounting.
 */
const useItemEnhancer = (enhancers: ItemResultsEnhancerService[], disabledEnhancerSlugs: string[]) => {
  const disabledSlugsRef = useRef(disabledEnhancerSlugs);

  useEffect(() => {
    disabledSlugsRef.current = disabledEnhancerSlugs;
  }, [disabledEnhancerSlugs]);

  useEffect(() => {
    const tradeAppElement = document.getElementById('trade');
    if (!tradeAppElement?.parentElement) return;

    const enabledEnhancers = () =>
      enhancers.filter(enhancer => !enhancer.slug || !disabledSlugsRef.current.includes(enhancer.slug));

    const enhanceItems = async (itemElements: HTMLDivElement[]) => {
      // Bulk exchange results are left alone, as in 1.9.1
      if (itemElements[0]?.classList.contains('exchange')) return;

      const activeEnhancers = enabledEnhancers();
      for (const enhancer of activeEnhancers) await enhancer.prepare?.();

      for (const itemElement of itemElements) {
        const parsedItem = parseElement(itemElement);
        for (const enhancer of activeEnhancers) await enhancer.enhance(itemElement, parsedItem);

        itemElement.toggleAttribute('bt-enhanced', true);
      }
    };

    const enhanceTask = async () => {
      const unenhancedElements = Array.from(document.querySelectorAll<HTMLDivElement>(UNENHANCED_ROWS_SELECTOR));

      if (unenhancedElements.length) {
        await enhanceItems(unenhancedElements);
      } else if (document.querySelectorAll(RESULT_ROWS_SELECTOR).length === 0) {
        for (const enhancer of enhancers) await enhancer.clear?.();
      }
    };

    let queue = (async () => {
      for (const enhancer of enhancers) await enhancer.initialize?.();
    })().catch(console.error);

    const observer = new MutationObserver(() => {
      queue = queue.then(enhanceTask).catch(console.error);
    });
    observer.observe(tradeAppElement.parentElement, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [enhancers]);
};

export { useItemEnhancer };
