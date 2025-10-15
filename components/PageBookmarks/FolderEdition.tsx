import styles from './FolderEdition.module.scss';
import BookmarkFolderIcon from '../BookmarkFolderIcon';
import Button from '../Button';
import FormContainer from '../FormContainer';
import FormField from '../FormField';
import FormInput from '../FormInput';
import Modal from '../Modal';
import {
  BookmarksFolderAscendancyDuelistIcon,
  BookmarksFolderAscendancyShadowIcon,
  BookmarksFolderAscendancyMarauderIcon,
  BookmarksFolderAscendancyWitchIcon,
  BookmarksFolderAscendancyRangerIcon,
  BookmarksFolderAscendancyTemplarIcon,
  BookmarksFolderAscendancyScionIcon,
  BookmarksFolderAscendancyPoE2WarriorIcon,
  BookmarksFolderAscendancyPoE2WitchIcon,
  BookmarksFolderAscendancyPoE2RangerIcon,
  BookmarksFolderAscendancyPoE2SorceressIcon,
  BookmarksFolderAscendancyPoE2MercenaryIcon,
  BookmarksFolderAscendancyPoE2MonkIcon,
  BookmarksFolderPoE1ItemIcon,
  BookmarksFolderPoE2ItemIcon,
} from '@/types/bookmarks';
import { useState } from 'react';
import type { BookmarksFolderStruct, BookmarksFolderIcon as BookmarkFolderIconType } from '@/types/bookmarks';
import type { TradeSiteVersion } from '@/types/trade-location';
import type React from 'react';

const POE1_ASCENDANCY_ICONS = [
  Object.values(BookmarksFolderAscendancyDuelistIcon),
  Object.values(BookmarksFolderAscendancyShadowIcon),
  Object.values(BookmarksFolderAscendancyMarauderIcon),
  Object.values(BookmarksFolderAscendancyWitchIcon),
  Object.values(BookmarksFolderAscendancyRangerIcon),
  Object.values(BookmarksFolderAscendancyTemplarIcon),
  Object.values(BookmarksFolderAscendancyScionIcon),
];

const POE2_ASCENDANCY_ICONS = [
  Object.values(BookmarksFolderAscendancyPoE2WarriorIcon),
  Object.values(BookmarksFolderAscendancyPoE2WitchIcon),
  Object.values(BookmarksFolderAscendancyPoE2RangerIcon),
  Object.values(BookmarksFolderAscendancyPoE2SorceressIcon),
  Object.values(BookmarksFolderAscendancyPoE2MercenaryIcon),
  Object.values(BookmarksFolderAscendancyPoE2MonkIcon),
];

interface FolderEditionProps {
  folder: BookmarksFolderStruct;
  version: TradeSiteVersion;
  modalTitle: string;
  titleLabel: string;
  iconLabel: string;
  saveLabel: string;
  onCancel: () => void;
  onSubmit: (folder: BookmarksFolderStruct) => Promise<void>;
}

const FolderEdition: React.FC<FolderEditionProps> = ({
  folder: initialFolder,
  version,
  modalTitle,
  titleLabel,
  iconLabel,
  saveLabel,
  onCancel,
  onSubmit,
}) => {
  const [folder, setFolder] = useState<BookmarksFolderStruct>(initialFolder);

  const iconAscendancyOptions = version === '2' ? POE2_ASCENDANCY_ICONS : POE1_ASCENDANCY_ICONS;
  const iconItemOptions = Object.values(version === '2' ? BookmarksFolderPoE2ItemIcon : BookmarksFolderPoE1ItemIcon);

  const canSubmit = Boolean(folder.title);

  const handleChangeTitle = (title: string) => {
    setFolder({ ...folder, title });
  };

  const handleToggleIcon = (icon: BookmarkFolderIconType) => {
    setFolder({
      ...folder,
      icon: icon !== folder.icon ? icon : null,
    });
  };

  return (
    <Modal title={modalTitle} onClose={onCancel} isOpen={true}>
      <FormContainer onSubmit={() => onSubmit(folder)} canSubmit={canSubmit}>
        <FormInput label={titleLabel} value={folder.title} autofocus={true} onChange={handleChangeTitle} />

        <FormField label={iconLabel}>
          <ul className={`${styles.iconOptions} ${styles.withItems}`}>
            {iconItemOptions.map(itemIcon => (
              <li
                key={itemIcon}
                className={`${styles.iconOption} ${itemIcon === folder.icon ? styles.isSelected : ''}`}>
                <button type="button" onClick={() => handleToggleIcon(itemIcon)} className={styles.iconButton}>
                  <BookmarkFolderIcon icon={itemIcon} className={styles.iconOptionImage} />
                </button>
              </li>
            ))}
          </ul>

          <ul className={`${styles.iconOptions} ${styles.withAscendancies}`}>
            {iconAscendancyOptions.map((ascendancyGroup, groupIndex) => (
              <li key={groupIndex}>
                <ul className={styles.iconOptions}>
                  {ascendancyGroup.map(ascendancyIcon => (
                    <li
                      key={ascendancyIcon}
                      className={`${styles.iconOption} ${ascendancyIcon === folder.icon ? styles.isSelected : ''}`}>
                      <button
                        type="button"
                        onClick={() => handleToggleIcon(ascendancyIcon)}
                        className={styles.iconButton}>
                        <BookmarkFolderIcon icon={ascendancyIcon} className={styles.iconOptionImage} />
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </FormField>

        <Button type="submit" theme="gold" label={saveLabel} icon="💾" />
      </FormContainer>
    </Modal>
  );
};

export default FolderEdition;
