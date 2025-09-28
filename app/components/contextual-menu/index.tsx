import './style.css';
import React, {
  HTMLAttributes,
  MouseEvent as ReactMouseEvent,
  PropsWithChildren,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../lib/classnames';

type MenuPosition = {
  x: number;
  y: number;
};

type ContextValue = {
  closeMenu: () => void;
};

const ContextualMenuContext = React.createContext<ContextValue | null>(null);

const ensurePortalContainer = () => {
  if (typeof document === 'undefined') return null;

  const existing = document.getElementById('bt-contextual-menu-root');
  if (existing) return existing;

  const container = document.createElement('div');
  container.id = 'bt-contextual-menu-root';
  document.body.appendChild(container);
  return container;
};

type BaseItemProps = {
  label: React.ReactNode;
  className?: string;
  onClick?: (event: ReactMouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void | Promise<void>;
};

type AnchorItemProps = BaseItemProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseItemProps> & {
    href: string;
  };

type ButtonItemProps = BaseItemProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseItemProps | 'type'> & {
    href?: undefined;
    type?: 'button';
  };

export type ContextualMenuItemProps = (AnchorItemProps | ButtonItemProps) & PropsWithChildren;

export const ContextualMenuItem: React.FC<ContextualMenuItemProps> = (props) => {
  const context = React.useContext(ContextualMenuContext);

  const handleAction = useCallback(
    async (event: ReactMouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      if (props.onClick) {
        await props.onClick(event);
      }

      context?.closeMenu();
    },
    [context, props],
  );

  if ('href' in props && props.href) {
    const { label, className, onClick, children, ...anchorRest } = props;

    return (
      <a
        className={cx('bt-contextual-menu__item', className)}
        {...anchorRest}
        onClick={(event) => {
          void handleAction(event);
        }}
      >
        {children ?? label}
      </a>
    );
  }

  const { label, className, children, ...buttonRest } = props as ButtonItemProps;

  return (
    <button
      type="button"
      className={cx('bt-contextual-menu__item', className)}
      {...buttonRest}
      onClick={(event) => {
        void handleAction(event);
      }}
    >
      {children ?? label}
    </button>
  );
};

type RenderChildren = (MenuItem: typeof ContextualMenuItem) => React.ReactNode;

type ContextualMenuProps = {
  children: React.ReactNode | RenderChildren;
} & HTMLAttributes<HTMLButtonElement>;

const HIDE_DELAY = 500;

const ContextualMenu: React.FC<ContextualMenuProps> = ({ children, className, ...triggerProps }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<MenuPosition | null>(null);
  const [adjustedPosition, setAdjustedPosition] = useState<MenuPosition | null>(null);
  const itemsRef = useRef<HTMLDivElement | null>(null);
  const hideTimeoutRef = useRef<number | null>(null);

  const portalContainer = useMemo(() => ensurePortalContainer(), []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setPosition(null);
    setAdjustedPosition(null);
  }, []);

  const cancelHide = useCallback(() => {
    if (hideTimeoutRef.current !== null) {
      window.clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  }, []);

  const scheduleHide = useCallback(() => {
    cancelHide();
    hideTimeoutRef.current = window.setTimeout(() => {
      closeMenu();
    }, HIDE_DELAY);
  }, [cancelHide, closeMenu]);

  const handleTriggerClick = useCallback(
    (event: ReactMouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      cancelHide();
      const nextPosition = {
        x: event.clientX,
        y: event.clientY,
      };
      setPosition(nextPosition);
      setAdjustedPosition(nextPosition);
      setIsOpen(true);
    },
    [cancelHide],
  );

  useEffect(() => {
    return () => cancelHide();
  }, [cancelHide]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleDocumentClick = (event: globalThis.MouseEvent) => {
      if (itemsRef.current?.contains(event.target as Node)) return;
      closeMenu();
    };

    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu();
    };

    document.addEventListener('mousedown', handleDocumentClick);
    document.addEventListener('keyup', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
      document.removeEventListener('keyup', handleEscape);
    };
  }, [closeMenu, isOpen]);

  useLayoutEffect(() => {
    if (!isOpen || !itemsRef.current || !position) return;

    const { innerHeight, innerWidth } = window;
    const rect = itemsRef.current.getBoundingClientRect();

    const nextY = Math.max(8, Math.min(position.y, innerHeight - rect.height - 8));
    const nextX = Math.max(8, Math.min(position.x, innerWidth - rect.width - 8));

    if (!adjustedPosition || adjustedPosition.x !== nextX || adjustedPosition.y !== nextY) {
      setAdjustedPosition({ x: nextX, y: nextY });
    }
  }, [adjustedPosition, isOpen, position]);

  const renderItems = () => {
    if (typeof children === 'function') {
      return (children as RenderChildren)(ContextualMenuItem);
    }

    return children;
  };

  return (
    <>
      <button
        type="button"
        className={cx('bt-contextual-menu', className)}
        {...triggerProps}
        onClick={(event) => {
          triggerProps.onClick?.(event);
          handleTriggerClick(event);
        }}
        aria-expanded={isOpen}
      >
        <i aria-hidden="true" className="fas fa-ellipsis-h" />
      </button>

      {portalContainer &&
        isOpen &&
        createPortal(
          <ContextualMenuContext.Provider value={{ closeMenu }}>
            <div
              ref={itemsRef}
              className="bt-contextual-menu__items"
              style={{
                top: `${adjustedPosition?.y ?? 0}px`,
                left: `${adjustedPosition?.x ?? 0}px`,
              }}
              onMouseEnter={cancelHide}
              onMouseLeave={scheduleHide}
            >
              {renderItems()}
            </div>
          </ContextualMenuContext.Provider>,
          portalContainer,
        )}
    </>
  );
};

export default ContextualMenu;
