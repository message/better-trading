import styles from './styles.module.scss';
import ClockIcon from '../../assets/icons/solid/clock-rotate-left.svg?react';
import FolderOpenIcon from '../../assets/icons/solid/folder-open.svg?react';
import ThumbTackIcon from '../../assets/icons/solid/thumbtack.svg?react';
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
  // Translation function
  t: (key: string) => string;
  className?: string;
}

/**
 * RootPageMenu component - Navigation menu for root pages
 * Migrated from old-extension/app/pods/components/root-page-menu
 */
const RootPageMenu = ({ currentPage, onChange, t, className }: RootPageMenuProps) => {
  const menuItems: MenuItem[] = [
    {
      page: RootPage.BOOKMARKS,
      icon: FolderOpenIcon,
      label: t('components.root-page-menu.bookmarks'),
      isActive: RootPage.BOOKMARKS === currentPage,
    },
    {
      page: RootPage.PINNED_ITEMS,
      icon: ThumbTackIcon,
      label: t('components.root-page-menu.pinned-items'),
      isActive: RootPage.PINNED_ITEMS === currentPage,
    },
    {
      page: RootPage.HISTORY,
      icon: ClockIcon,
      label: t('components.root-page-menu.history'),
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
    <div className={classnames(styles.rootPageMenu, className)} role="navigation">
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
