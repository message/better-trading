// React version of the former Ember `header` component.
// Migrated from: old-extension/app/pods/components/header
// Responsibilities:
//  - Display the Better Trading header with logo and title
//  - Trigger collapse of the side panel
//  - Provide navigation buttons (info/close)

import styles from './styles.module.scss';
import AngleRightIcon from '@/assets/icons/solid/angle-right.svg?react';
import CircleInfoIcon from '@/assets/icons/solid/circle-info.svg?react';
import XmarkIcon from '@/assets/icons/solid/xmark.svg?react';
import { getExtensionUrl } from '@/utils/extension-url';
import { collapseSidePanel, initializeSidePanelCollapse } from '@/utils/side-panel-collapse';
import { useEffect, useCallback } from 'react';
import type { FC } from 'react';

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
  useEffect(() => {
    initializeSidePanelCollapse();
  }, []);

  const handleCollapse = useCallback(() => {
    collapseSidePanel();
  }, []);

  const logoUrl = getExtensionUrl('/assets/images/logo.png');

  return (
    <div className={styles.container}>
      <button onClick={handleCollapse} type="button" className={styles.headerButton}>
        <AngleRightIcon />
      </button>

      <button onClick={onBrandClick} className={styles.brand} type="button">
        <img className={styles.logo} src={logoUrl} alt="Better Trading Logo" />
        <div className={styles.title}>{title}</div>
      </button>

      <button onClick={onToggleClick} className={styles.headerButton}>
        {isOnRootRoute ? <CircleInfoIcon /> : <XmarkIcon />}
      </button>
    </div>
  );
};

export default Header;
export type { HeaderProps };
