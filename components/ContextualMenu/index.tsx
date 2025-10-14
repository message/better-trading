// Migrated from old-extension/app/pods/components/contextual-menu

import styles from './styles.module.scss';
import EllipsisIcon from '@/assets/icons/solid/ellipsis.svg?react';
import classNames from 'classnames';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type React from 'react';

// Constants
const HIDE_DEBOUNCE_DELAY_IN_MILLISECONDS = 500;

interface Position {
  x: number;
  y: number;
}

interface ContextualMenuItemProps {
  label: string;
  href?: string;
  onClick?: () => Promise<void> | void;
  onItemClick: () => void;
}

const ContextualMenuItem: React.FC<ContextualMenuItemProps> = ({ label, href, onClick, onItemClick }) => {
  const handleClick = useCallback(async () => {
    if (onClick) {
      await onClick();
    }
    onItemClick();
  }, [onClick, onItemClick]);

  if (href) {
    return (
      <a href={href} onClick={handleClick} className={styles.item}>
        {label}
      </a>
    );
  }

  return (
    <button type="button" onClick={handleClick} className={styles.item}>
      {label}
    </button>
  );
};

interface ContextualMenuProps {
  className?: string;
  items: Array<{
    label: string;
    href?: string;
    onClick?: () => Promise<void> | void;
  }>;
}

const ContextualMenu: React.FC<ContextualMenuProps> = ({ className, items }) => {
  const [displayPosition, setDisplayPosition] = useState<Position | null>(null);
  const [itemsDivElement, setItemsDivElement] = useState<HTMLDivElement | null>(null);
  const debounceTimerRef = useRef<number | null>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  const itemsAreVisible = Boolean(displayPosition);

  const showItems = useCallback((event: React.MouseEvent) => {
    setDisplayPosition({
      y: event.clientY,
      x: event.clientX,
    });
  }, []);

  const hideItems = useCallback(() => {
    setDisplayPosition(null);
  }, []);

  const cancelDebouncedHideItemsTask = useCallback(() => {
    if (debounceTimerRef.current !== null) {
      window.clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  }, []);

  const debouncedHideItems = useCallback(() => {
    cancelDebouncedHideItemsTask();
    debounceTimerRef.current = window.setTimeout(() => {
      hideItems();
    }, HIDE_DEBOUNCE_DELAY_IN_MILLISECONDS);
  }, [hideItems, cancelDebouncedHideItemsTask]);

  // Register items element when ref changes
  useEffect(() => {
    if (itemsRef.current) {
      setItemsDivElement(itemsRef.current);
    }
    return () => {
      setItemsDivElement(null);
    };
  }, [itemsAreVisible]);

  // Cleanup timer on unmount
  useEffect(
    () => () => {
      cancelDebouncedHideItemsTask();
    },
    [cancelDebouncedHideItemsTask],
  );

  // Calculate position styles
  const positionStyles: React.CSSProperties = (() => {
    if (!displayPosition || !itemsDivElement) return {};

    const viewportHeight = window.innerHeight;
    const itemsHeight = itemsDivElement.clientHeight;

    let top = displayPosition.y;
    top -= Math.max(itemsHeight + top - viewportHeight, 0);

    return {
      top: `${top}px`,
      left: `${displayPosition.x}px`,
    };
  })();

  return (
    <>
      <button
        type="button"
        onClick={showItems}
        className={classNames(styles.contextualMenu, className)}
        aria-label="Open menu"
        aria-expanded={itemsAreVisible}
        aria-haspopup="true">
        <EllipsisIcon width={16} height={16} />
      </button>

      {itemsAreVisible &&
        createPortal(
          <div
            ref={itemsRef}
            onMouseLeave={debouncedHideItems}
            onMouseEnter={cancelDebouncedHideItemsTask}
            style={positionStyles}
            className={styles.contextualMenuItems}>
            {items.map((item, index) => (
              <ContextualMenuItem
                key={index}
                label={item.label}
                href={item.href}
                onClick={item.onClick}
                onItemClick={hideItems}
              />
            ))}
          </div>,
          document.body,
        )}
    </>
  );
};

export type { ContextualMenuProps };
export { ContextualMenuItem };
export default ContextualMenu;
