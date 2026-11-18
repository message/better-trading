import styles from './styles.module.scss';
import AlertMessage from '../AlertMessage';
import Button from '../Button';
import XmarkIcon from '@/assets/icons/solid/xmark.svg?react';
import { useFlashMessagesContext } from '@/contexts/FlashMessagesContext';
import { useItemResults } from '@/hooks/useItemResults';
import classnames from 'classnames';
import { useCallback } from 'react';

interface PagePinnedItemsProps {
  warningMessage: string;
  clearLabel: string;
  emptyMessage: string;
  unpinItemLabel: string;
  scrollToItemLabel: string;
  genericAlertMessage: string;
  className?: string;
}

const SCROLL_ANIMATION_DELAY_MS = 250;
const SCROLL_ANIMATION_DURATION_MS = 2000;

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/** Shows a copy of an element taken from the trade results (it may still be displayed there) */
const ClonedElement = ({ element }: { element: HTMLElement }) => {
  // Stable per element, so re-renders (e.g. on every flash) do not re-clone
  const fill = useCallback(
    (container: HTMLDivElement | null) => container?.replaceChildren(element.cloneNode(true)),
    [element],
  );
  return <div ref={fill} />;
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
  genericAlertMessage,
  className,
}: PagePinnedItemsProps) => {
  const { pinnedItems, clearPinnedItems, unpinItemById } = useItemResults();
  const { addFlash } = useFlashMessagesContext();

  const scrollToItem = async (itemId: string) => {
    const itemElement = document.querySelector(`div.row[data-id="${CSS.escape(itemId)}"]`);
    if (!itemElement) {
      addFlash(genericAlertMessage, 'alert');
      return;
    }

    itemElement.scrollIntoView({ block: 'center' });

    await wait(SCROLL_ANIMATION_DELAY_MS);
    itemElement.classList.add('bt-pinned-glow');

    await wait(SCROLL_ANIMATION_DURATION_MS);
    itemElement.classList.remove('bt-pinned-glow');
  };

  const sortedPinnedItems = [...pinnedItems].sort(
    (pinnedItemA, pinnedItemB) => new Date(pinnedItemA.pinnedAt).getTime() - new Date(pinnedItemB.pinnedAt).getTime(),
  );

  return (
    <div className={classnames(styles.pinnedItems, className)}>
      {sortedPinnedItems.length > 0 ? (
        <>
          {sortedPinnedItems.map(pinnedItem => (
            <div key={pinnedItem.id} className={styles.itemWrapper}>
              <ClonedElement element={pinnedItem.detailsElement} />

              <div className={styles.renderedItemWrapper}>
                <ClonedElement element={pinnedItem.renderedItemElement} />
              </div>

              <ClonedElement element={pinnedItem.pricingElement} />

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
