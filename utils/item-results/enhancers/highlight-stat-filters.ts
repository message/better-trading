import { escapeRegex } from '@/utils/escape-regex';
import { getStats } from '@/utils/search-panel';

const MODS_SELECTOR = '.explicitMod,.pseudoMod,.implicitMod';

/**
 * Enhancer that highlights item mods matching the current search filters
 *
 * This enhancer reads the search panel stats and highlights matching mods
 * on each item result with the 'bt-highlight-stat-filters' CSS class.
 *
 * @param itemElement - The item result DOM element to enhance
 *
 * @example
 * enhance(itemDiv);
 * // Mods matching search filters now have .bt-highlight-stat-filters class
 */
const enhance = (itemElement: HTMLDivElement): void => {
  const stats = getStats();

  const statNeedles = stats.map(
    (rawStat: string) => new RegExp(escapeRegex(rawStat).replace(/#/g, '[\\+\\-]?\\d+'), 'i'),
  );

  itemElement.querySelectorAll(MODS_SELECTOR).forEach((modElement: Element) => {
    const modText = modElement.textContent || '';
    if (!statNeedles.some(needle => needle.test(modText))) return;

    modElement.classList.add('bt-highlight-stat-filters');
  });
};

const slug = 'highlight-stat-filters';

export { enhance, slug };
