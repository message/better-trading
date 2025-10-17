import { ItemResultsType } from '@/types/item-results';
import type { ItemResultsParsedItem } from '@/types/item-results';

const ILVL_THRESHOLDS = [
  { maxSockets: 2, ilvl: 1 },
  { maxSockets: 3, ilvl: 24 },
  { maxSockets: 4, ilvl: 34 },
  { maxSockets: 5, ilvl: 49 },
];

interface MaximumSocketsOptions {
  tradeLocationVersion?: string;
  warningMessage?: string | ((maxSockets: number) => string);
}

/**
 * Enhancer that warns when an armor item cannot have more sockets due to item level
 *
 * This enhancer checks if an armor item's ilvl prevents it from having maximum sockets
 * and displays a warning if applicable.
 *
 * @param itemElement - The item result DOM element to enhance
 * @param parsedItem - Parsed item data containing socketsCount, type, and ilvl
 * @param options - Configuration options (tradeLocationVersion, warningMessage)
 *
 * @example
 * enhance(itemDiv, parsedItem, {
 *   tradeLocationVersion: '1',
 *   warningMessage: (max) => `Can only have ${max} sockets max`
 * });
 */
const enhance = (
  itemElement: HTMLDivElement,
  { socketsCount, type, ilvl }: ItemResultsParsedItem,
  options?: MaximumSocketsOptions,
): void => {
  const tradeLocationVersion = options?.tradeLocationVersion || '1';

  if (tradeLocationVersion !== '1') return;

  const itemFrameElement = itemElement.querySelector<HTMLDivElement>('.itemRendered');

  if (!itemFrameElement || !ilvl || socketsCount === 0 || type !== ItemResultsType.ARMOR) return;

  const applicableThreshold = ILVL_THRESHOLDS.find(threshold => ilvl <= threshold.ilvl);
  if (!applicableThreshold) return;

  if (applicableThreshold.maxSockets <= socketsCount) return;

  const warningElement = window.document.createElement('div');

  if (typeof options?.warningMessage === 'function') {
    warningElement.textContent = options.warningMessage(applicableThreshold.maxSockets);
  } else if (typeof options?.warningMessage === 'string') {
    warningElement.textContent = options.warningMessage;
  } else {
    warningElement.textContent = `Can only have ${applicableThreshold.maxSockets} sockets max`;
  }

  warningElement.classList.add('bt-maximum-sockets');

  itemFrameElement.prepend(warningElement);
};

const slug = 'maximum-sockets';

export { enhance, slug };
export type { MaximumSocketsOptions };
