// React version of the former Ember `bookmark-folder-icon` component.
// Migrated from: old-extension/app/pods/components/bookmark-folder-icon
// Responsibilities:
//  - Render an <img> tag for a bookmark folder icon
//  - Apply size styling depending on whether the icon represents an *item* or an *ascendancy*
//  - Resolve the proper extension resource URL so it works inside the built browser extension
//
// Icon enums/types copied into app/types/bookmarks.ts so there is no runtime dependency on old-extension.
// This keeps a single source for icon names while allowing deletion of the legacy Ember code later.

import styles from './styles.module.scss';
import { BookmarksFolderPoE1ItemIcon, BookmarksFolderPoE2ItemIcon } from '@/types/bookmarks';
import { getExtensionUrl } from '@/utils/extension-url';
import classnames from 'classnames';
import type { BookmarksFolderIcon as BookmarkFolderIconType } from '@/types/bookmarks';
import type { ImgHTMLAttributes, FC } from 'react';

// Build a Set of all item icons for quick classification (constant at module scope)
const ITEM_ICON_SET = new Set<string>([
  ...Object.values(BookmarksFolderPoE1ItemIcon),
  ...Object.values(BookmarksFolderPoE2ItemIcon),
]);

type BookmarkFolderIconName = BookmarkFolderIconType;

interface BookmarkFolderIconProps extends ImgHTMLAttributes<HTMLImageElement> {
  /** Icon identifier (e.g. "alchemy", "poe2-divine", "slayer"). */
  icon: BookmarkFolderIconType;
}

/**
 * BookmarkFolderIcon renders a single folder icon (item or ascendancy) with proper sizing.
 */
const BookmarkFolderIcon: FC<BookmarkFolderIconProps> = ({ icon, className, ...imgProps }) => {
  const iconPath = `/assets/images/bookmark-folder/${icon}.png`;
  const isItem = ITEM_ICON_SET.has(icon);

  return (
    <img
      src={getExtensionUrl(iconPath)}
      alt={icon}
      className={classnames(styles.bookmarkFolderIcon, isItem ? styles.isItem : styles.isAscendancy, className)}
      {...imgProps}
    />
  );
};

export default BookmarkFolderIcon;
export { ITEM_ICON_SET };
export type { BookmarkFolderIconName, BookmarkFolderIconProps };
