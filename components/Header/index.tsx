// React version of the former Ember `header` component.
// Migrated from: old-extension/app/pods/components/header
// Responsibilities:
//  - Display the Better Trading header with logo and title
//  - Trigger collapse of the side panel
//  - Provide navigation buttons (info/close)

import styles from './styles.module.scss';
import AngleRightIcon from '@/assets/icons/filled/angle-right.svg?react';
import CloseIcon from '@/assets/icons/filled/close.svg?react';
import InfoIcon from '@/assets/icons/filled/info.svg?react';
import { getExtensionUrl } from '@/utils/extension-url';
import { collapseSidePanel, initializeSidePanelCollapse } from '@/utils/side-panel-collapse';
import { useCallback, useEffect } from 'react';
import type { FC } from 'react';

interface HeaderProps {
  /** The title to display in the header */
  title: string;
  /** Alt text of the logo */
  logoAlt: string;
  /** Aria label of the collapse button */
  collapseLabel: string;
  /** Aria label of the toggle button while on the root route */
  showAboutLabel: string;
  /** Aria label of the toggle button while on a sub route */
  showMainLabel: string;
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
const Header: FC<HeaderProps> = ({
  title,
  logoAlt,
  collapseLabel,
  showAboutLabel,
  showMainLabel,
  isOnRootRoute = true,
  onBrandClick,
  onToggleClick,
}) => {
  useEffect(() => {
    initializeSidePanelCollapse();
  }, []);

  const handleCollapse = useCallback(() => {
    collapseSidePanel();
  }, []);

  const logoUrl = getExtensionUrl('/assets/images/logo.svg');

  return (
    <div className={styles.container}>
      <div>
        <button onClick={handleCollapse} type="button" className={styles.headerButton} aria-label={collapseLabel}>
          <AngleRightIcon />
        </button>

        <button onClick={onBrandClick} className={styles.brand} type="button">
          <img className={styles.logo} src={logoUrl} alt={logoAlt} />
          <div className={styles.title}>{title}</div>
        </button>

        <button
          onClick={onToggleClick}
          type="button"
          className={styles.headerButton}
          aria-label={isOnRootRoute ? showAboutLabel : showMainLabel}>
          {isOnRootRoute ? <InfoIcon /> : <CloseIcon />}
        </button>
      </div>
    </div>
  );
};

export default Header;
export type { HeaderProps };
