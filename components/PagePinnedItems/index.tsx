import styles from './styles.module.scss';
import AlertMessage from '../AlertMessage';
import Button from '../Button';
import XmarkIcon from '@/assets/icons/solid/xmark.svg?react';
import { useItemResults } from '@/hooks/useItemResults';
import classnames from 'classnames';
import { useState, useEffect } from 'react';
import type { ItemResultsPinnedItem } from '@/types/item-results';

interface PagePinnedItemsProps {
  warningMessage: string;
  clearLabel: string;
  emptyMessage: string;
  unpinItemLabel: string;
  scrollToItemLabel: string;
  className?: string;
}

const usePinnedItems = () => {
  const itemResults = useItemResults();
  const [pinnedItems, setPinnedItems] = useState<ItemResultsPinnedItem[]>([]);

  const loadPinnedItems = async () => {
    const items = await itemResults.getPinnedItems();
    setPinnedItems(items);
  };

  const clearPinnedItems = async () => {
    await itemResults.clearPinnedItems();
    setPinnedItems([]);
  };

  const unpinItemById = async (itemId: string) => {
    await itemResults.unpinItemById(itemId);
    setPinnedItems(prev => prev.filter(item => item.id !== itemId));
  };

  const scrollToItem = async (itemId: string): Promise<void> => {
    const itemElement = window.document.querySelector(`div.row[data-id="${itemId}"]`);
    if (!itemElement) {
      console.warn('Item not found on page');
      return;
    }

    itemElement.scrollIntoView({ block: 'center' });

    // Add glow effect
    await new Promise(resolve => setTimeout(resolve, 250));
    itemElement.classList.add('bt-pinned-glow');

    // Remove glow effect after animation
    await new Promise(resolve => setTimeout(resolve, 2000));
    itemElement.classList.remove('bt-pinned-glow');
  };

  useEffect(() => {
    loadPinnedItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    pinnedItems,
    clearPinnedItems,
    unpinItemById,
    scrollToItem,
  };
};

/**
 * PagePinnedItems component - Displays and manages pinned items
 * Migrated from old-extension/app/pods/components/page/pinned-items
 */
const PagePinnedItems = ({
  warningMessage,
  clearLabel,
  emptyMessage,
  unpinItemLabel,
  scrollToItemLabel,
  className,
}: PagePinnedItemsProps) => {
  const { pinnedItems, clearPinnedItems, unpinItemById, scrollToItem } = usePinnedItems();

  const sortedPinnedItems = [...pinnedItems].sort(
    (pinnedItemA, pinnedItemB) => new Date(pinnedItemA.pinnedAt).getTime() - new Date(pinnedItemB.pinnedAt).getTime(),
  );

  return (
    <div className={classnames(styles.pinnedItems, className)}>
      {sortedPinnedItems.length > 0 ? (
        <>
          {sortedPinnedItems.map(pinnedItem => (
            <div key={pinnedItem.id} className={styles.itemWrapper}>
              <div dangerouslySetInnerHTML={{ __html: pinnedItem.detailsElement }} />

              <div className={styles.renderedItemWrapper}>
                <div dangerouslySetInnerHTML={{ __html: pinnedItem.renderedItemElement }} />
              </div>

              <div dangerouslySetInnerHTML={{ __html: pinnedItem.pricingElement }} />

              <div className={styles.itemActions}>
                <Button
                  type="button"
                  theme="blue"
                  label={scrollToItemLabel}
                  onClick={() => scrollToItem(pinnedItem.id)}
                  className={styles.itemScroll}
                />

                <Button
                  type="button"
                  theme="blue"
                  label={unpinItemLabel}
                  onClick={() => unpinItemById(pinnedItem.id)}
                />
              </div>
            </div>
          ))}

          <Button type="button" theme="gold" label={clearLabel} onClick={clearPinnedItems} icon={XmarkIcon} />
        </>
      ) : (
        <AlertMessage message={emptyMessage} type="warning" />
      )}

      <AlertMessage message={warningMessage} type="warning" />
    </div>
  );
};

export default PagePinnedItems;
export type { PagePinnedItemsProps };
