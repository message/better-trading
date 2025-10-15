import styles from './FolderImport.module.scss';
import AlertMessage from '../AlertMessage';
import BookmarkFolderIcon from '../BookmarkFolderIcon';
import Button from '../Button';
import FormContainer from '../FormContainer';
import FormInput from '../FormInput';
import Modal from '../Modal';
import { useState } from 'react';
import type { BookmarksFolderStruct, BookmarksTradeStruct } from '@/types/bookmarks';
import type React from 'react';

interface FolderImportProps {
  modalTitle: string;
  importCodeLabel: string;
  previewLabel: (name: string, tradesCount: number) => string;
  invalidCodeMessage: string;
  saveLabel: string;
  onCancel: () => void;
  onSubmit: (data: { folder: BookmarksFolderStruct; trades: BookmarksTradeStruct[] }) => Promise<void>;
  onDeserialize: (input: string) => [BookmarksFolderStruct, BookmarksTradeStruct[]] | null;
}

const FolderImport: React.FC<FolderImportProps> = ({
  modalTitle,
  importCodeLabel,
  previewLabel,
  invalidCodeMessage,
  saveLabel,
  onCancel,
  onSubmit,
  onDeserialize,
}) => {
  const [stagedFolder, setStagedFolder] = useState<BookmarksFolderStruct | null>(null);
  const [stagedTrades, setStagedTrades] = useState<BookmarksTradeStruct[]>([]);
  const [isInvalid, setIsInvalid] = useState(false);

  const canSubmit = Boolean(stagedFolder);

  const handleInput = (input: string) => {
    const result = onDeserialize(input);

    if (result) {
      const [folder, trades] = result;
      setIsInvalid(false);
      setStagedFolder(folder);
      setStagedTrades(trades);
    } else {
      setIsInvalid(true);
      setStagedFolder(null);
      setStagedTrades([]);
    }
  };

  return (
    <Modal title={modalTitle} onClose={onCancel} isOpen={true}>
      <FormContainer
        onSubmit={() => {
          if (stagedFolder) {
            return onSubmit({ folder: stagedFolder, trades: stagedTrades });
          }
        }}
        canSubmit={canSubmit}>
        <FormInput label={importCodeLabel} value="" autofocus={true} onChange={handleInput} />

        {stagedFolder && (
          <div className={styles.importPreview}>
            {stagedFolder.icon && <BookmarkFolderIcon icon={stagedFolder.icon} />}
            <div className={styles.importPreviewTitle}>{previewLabel(stagedFolder.title, stagedTrades.length)}</div>
          </div>
        )}

        {!stagedFolder && isInvalid && <AlertMessage message={invalidCodeMessage} type="alert" />}

        <Button type="submit" theme="gold" label={saveLabel} icon="💾" />
      </FormContainer>
    </Modal>
  );
};

export default FolderImport;
