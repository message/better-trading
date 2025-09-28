import './style.css';
import React from 'react';
import { cx } from '../../lib/classnames';
import { getExtensionUrl } from '../../lib/extension-url';

export type BookmarkFolderIconType = string;

const ITEM_ICONS = new Set<BookmarkFolderIconType>([
  'alchemy',
  'chaos',
  'exalt',
  'divine',
  'mirror',
  'card',
  'essence',
  'fossil',
  'map',
  'scarab',
  'poe2-alchemy',
  'poe2-annul',
  'poe2-artificer',
  'poe2-augment',
  'poe2-chance',
  'poe2-chaos',
  'poe2-divine',
  'poe2-essence',
  'poe2-exalt',
  'poe2-gemcutter',
  'poe2-glassblower',
  'poe2-mirror',
  'poe2-regal',
  'poe2-rune',
  'poe2-transmute',
  'poe2-vaal',
  'poe2-waystone',
  'poe2-wisdom',
]);

export type BookmarkFolderIconProps = {
  icon: BookmarkFolderIconType;
  alt?: string;
  className?: string;
} & React.ImgHTMLAttributes<HTMLImageElement>;

const BookmarkFolderIcon: React.FC<BookmarkFolderIconProps> = ({ icon, alt, className, ...rest }) => {
  const iconPath = `assets/images/bookmark-folder/${icon}.png`;
  const src = getExtensionUrl(iconPath);
  const isItem = ITEM_ICONS.has(icon);

  return (
    <img
      src={src}
      alt={alt ?? icon}
      className={cx(
        'bt-bookmark-folder-icon',
        isItem ? 'bt-bookmark-folder-icon--item' : 'bt-bookmark-folder-icon--ascendancy',
        className,
      )}
      {...rest}
    />
  );
};

export default BookmarkFolderIcon;
