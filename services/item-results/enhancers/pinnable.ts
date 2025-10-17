import type { ItemResultsPinnedItem } from '@/types/item-results';

interface PinnedItemsMap {
  [id: string]: ItemResultsPinnedItem;
}

interface PinnableOptions {
  onPinnedItemsChange?: () => void;
  onAlert?: (message: string) => void;
  pinButtonText?: string;
  unpinButtonText?: string;
}

/**
 * Service class for managing pinned items in trade results
 *
 * Allows users to pin items to the top of results for easy comparison.
 * Maintains pinned items state and provides methods for pin/unpin/clear operations.
 */
class PinnableEnhancer {
  private pinnedItems: PinnedItemsMap = {};
  private options: PinnableOptions;

  constructor(options: PinnableOptions = {}) {
    this.options = options;
  }

  slug = 'pinnable';

  enhance(itemElement: HTMLDivElement): void {
    const detailsElement = itemElement.querySelector('.details .btns');
    if (!detailsElement) return;

    detailsElement.appendChild(this.renderPinButton());
  }

  getPinnedItems(): ItemResultsPinnedItem[] {
    return Object.values(this.pinnedItems);
  }

  clear(): void {
    if (Object.keys(this.pinnedItems).length === 0) return;

    this.pinnedItems = {};
    this.hasChanged();
  }

  unpinItemById(itemId: string): void {
    delete this.pinnedItems[itemId];
    this.hasChanged();
  }

  private handlePinClick = (event: MouseEvent): void => {
    if (!event.target) return;

    const itemElement = (event.target as HTMLElement).closest('[bt-enhanced]') as HTMLElement;
    const itemId = itemElement?.dataset.id;
    if (!itemElement || !itemId) return;

    if (this.pinnedItems[itemId]) {
      delete this.pinnedItems[itemId];
    } else {
      const pinnedItem = this.createPinnedItem(itemId, itemElement);

      if (pinnedItem) {
        this.pinnedItems[itemId] = pinnedItem;
      } else {
        this.options.onAlert?.('Failed to pin item. Please try again.');
      }
    }

    this.hasChanged();
  };

  private renderPinButton(): HTMLElement {
    const element = window.document.createElement('button');
    element.classList.add('btn', 'btn-default', 'bt-pin-button');

    const pinText = this.options.pinButtonText || 'Pin';
    const unpinText = this.options.unpinButtonText || 'Unpin';

    element.innerHTML = `
      <span class="bt-pin-button-unpinned">${pinText}</span>
      <span class="bt-pin-button-pinned">${unpinText}</span>
    `;

    element.addEventListener('click', this.handlePinClick);

    const wrapper = window.document.createElement('span');
    wrapper.appendChild(element);

    return wrapper;
  }

  private createPinnedItem(id: string, result: HTMLElement): ItemResultsPinnedItem | null {
    const detailsElement = result.querySelector('.middle') as HTMLElement;
    const renderedItemElement = result.querySelector('.itemRendered') as HTMLElement;
    const pricingElement = result.querySelector('.details .price') as HTMLElement;

    if (!detailsElement || !renderedItemElement || !pricingElement) return null;

    return {
      id,
      detailsElement: detailsElement.cloneNode(true) as HTMLElement,
      renderedItemElement: renderedItemElement.cloneNode(true) as HTMLElement,
      pricingElement: pricingElement.cloneNode(true) as HTMLElement,
      pinnedAt: new Date().toISOString(),
    };
  }

  private updatePinnedCSS(): void {
    const pinnedIds = Object.keys(this.pinnedItems);

    window.document.querySelectorAll('[bt-enhanced]').forEach((itemResult: Element) => {
      const htmlElement = itemResult as HTMLElement;
      if (!htmlElement.dataset.id) return;

      itemResult.classList.toggle('bt-pinned', pinnedIds.includes(htmlElement.dataset.id));
    });
  }

  private hasChanged(): void {
    this.updatePinnedCSS();
    this.options.onPinnedItemsChange?.();
  }
}

const pinnableEnhancer = new PinnableEnhancer();

export { pinnableEnhancer, PinnableEnhancer };
export type { PinnableOptions };
