// React version of the former Ember `header` component.
// Migrated from: old-extension/app/pods/components/header
// Responsibilities:
//  - Display the Better Trading header with logo and title
//  - Provide collapse/expand functionality for the side panel
//  - Provide navigation buttons (info/close)
//  - Persist collapsed state in localStorage

import styles from './styles.module.scss';
import { getExtensionUrl } from '@/utils/extension-url';
import classnames from 'classnames';
import { useState, useEffect, useCallback } from 'react';
import type { FC } from 'react';

// TODO: Migrate storage service to a hook
// Temporary stub for now
const useStorage = () => {
  const getLocalValue = (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(key);
  };

  const setLocalValue = (key: string, value: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, value);
  };

  const deleteLocalValue = (key: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  };

  return { getLocalValue, setLocalValue, deleteLocalValue };
};

// Simple SVG icon components
interface IconProps {
  className?: string;
}

const AngleRightIcon: FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 256 512" fill="currentColor" aria-hidden="true">
    <path d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z" />
  </svg>
);

const AngleLeftIcon: FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 256 512" fill="currentColor" aria-hidden="true">
    <path d="M31.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L127.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L201.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34z" />
  </svg>
);

const InfoCircleIcon: FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 512 512" fill="currentColor" aria-hidden="true" style={{ width: '1em' }}>
    <path d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z" />
  </svg>
);

const TimesIcon: FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 352 512" fill="currentColor" aria-hidden="true">
    <path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" />
  </svg>
);

// Constants
const COLLAPSED_STORAGE_KEY = 'side-panel-collapsed';

interface HeaderProps {
  /** The title to display in the header */
  title: string;
  /** Whether the current route is the root route */
  isOnRootRoute?: boolean;
  /** Callback when brand logo is clicked */
  onBrandClick?: () => void;
  /** Callback when toggle button is clicked */
  onToggleClick?: () => void;
}

/**
 * Header component with collapse/expand functionality and navigation
 */
const Header: FC<HeaderProps> = ({ title, isOnRootRoute = true, onBrandClick, onToggleClick }) => {
  const storage = useStorage();
  const [expandButtonIsVisible, setExpandButtonIsVisible] = useState(false);

  useEffect(() => {
    const collapsedValue = storage.getLocalValue(COLLAPSED_STORAGE_KEY);
    const isCollapsed = Boolean(collapsedValue);
    setExpandButtonIsVisible(isCollapsed);

    if (isCollapsed) {
      document.body.classList.add('bt-is-collapsed');
    }
  }, [storage]);

  const handleCollapse = useCallback(() => {
    storage.setLocalValue(COLLAPSED_STORAGE_KEY, 'true');
    document.body.classList.add('bt-is-collapsed');
    setExpandButtonIsVisible(true);
  }, [storage]);

  const handleExpand = useCallback(() => {
    storage.deleteLocalValue(COLLAPSED_STORAGE_KEY);
    document.body.classList.remove('bt-is-collapsed');
    setExpandButtonIsVisible(false);
  }, [storage]);

  const logoUrl = getExtensionUrl('/assets/images/logo.png');

  return (
    <>
      <div className={styles.container}>
        <button onClick={handleCollapse} type="button" className={styles.headerButton}>
          <AngleRightIcon />
        </button>

        <button onClick={onBrandClick} className={styles.brand} type="button">
          <img className={styles.logo} src={logoUrl} alt="Better Trading Logo" />
          <div className={styles.title}>{title}</div>
        </button>

        <button onClick={onToggleClick} className={styles.headerButton}>
          {isOnRootRoute ? <InfoCircleIcon /> : <TimesIcon />}
        </button>
      </div>

      <button
        onClick={handleExpand}
        type="button"
        className={classnames(styles.expandButton, { [styles.isVisible]: expandButtonIsVisible })}>
        <AngleLeftIcon className={styles.expandButtonIcon} />
        <img className={styles.logo} src={logoUrl} alt="Better Trading Logo" />
      </button>
    </>
  );
};

export default Header;
export type { HeaderProps };
