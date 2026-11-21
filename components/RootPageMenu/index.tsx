import styles from './styles.module.scss';
import BookmarkIcon from '@/assets/icons/filled/bookmark.svg?react';
import HistoryIcon from '@/assets/icons/filled/history.svg?react';
import PinIcon from '@/assets/icons/filled/pin.svg?react';
import { RootPage } from '@/types/root-page';
import classnames from 'classnames';

interface MenuItem {
  page: RootPage;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  isActive: boolean;
}

interface RootPageMenuProps {
  currentPage: RootPage;
  onChange: (page: RootPage) => void;
  labels: { bookmarks: string; pinnedItems: string; history: string };
  ariaLabel: string;
  className?: string;
}

/**
 * RootPageMenu component - Navigation menu for root pages
 * Migrated from old-extension/app/pods/components/root-page-menu
 */
const RootPageMenu = ({ currentPage, onChange, labels, ariaLabel, className }: RootPageMenuProps) => {
  const menuItems: MenuItem[] = [
    {
      page: RootPage.BOOKMARKS,
      icon: BookmarkIcon,
      label: labels.bookmarks,
      isActive: RootPage.BOOKMARKS === currentPage,
    },
    {
      page: RootPage.PINNED_ITEMS,
      icon: PinIcon,
      label: labels.pinnedItems,
      isActive: RootPage.PINNED_ITEMS === currentPage,
    },
    {
      page: RootPage.HISTORY,
      icon: HistoryIcon,
      label: labels.history,
      isActive: RootPage.HISTORY === currentPage,
    },
  ];

  const handleMenuItemClick = (page: RootPage) => {
    onChange(page);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, page: RootPage) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onChange(page);
    }
  };

  return (
    <div className={classnames(styles.rootPageMenu, className)} role="navigation" aria-label={ariaLabel}>
      {menuItems.map(menuItem => {
        const IconComponent = menuItem.icon;
        return (
          <button
            key={menuItem.page}
            type="button"
            className={classnames(styles.menuItem, {
              [styles.isActive]: menuItem.isActive,
            })}
            onClick={() => handleMenuItemClick(menuItem.page)}
            onKeyDown={event => handleKeyDown(event, menuItem.page)}>
            <IconComponent className={styles.menuItemIcon} />
            {menuItem.label}
          </button>
        );
      })}
    </div>
  );
};

export default RootPageMenu;
export type { RootPageMenuProps, MenuItem };
