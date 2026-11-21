import styles from './FolderImport.module.scss';
import SaveIcon from '@/assets/icons/filled/save.svg?react';
import AlertMessage from '@/components/AlertMessage';
import BookmarkFolderIcon from '@/components/BookmarkFolderIcon';
import Button from '@/components/Button';
import FormContainer from '@/components/FormContainer';
import FormInput from '@/components/FormInput';
import Modal from '@/components/Modal';
import { useRef, useState } from 'react';
import type { BookmarksFolderStruct, BookmarksTradeStruct } from '@/types/bookmarks';
import type React from 'react';

interface FolderImportProps {
  modalTitle: string;
  modalCloseLabel: string;
  logoAlt: string;
  importCodeLabel: string;
  previewLabel: (name: string, tradesCount: number) => string;
  invalidCodeMessage: string;
  saveLabel: string;
  onCancel: () => void;
  onSubmit: (data: { folder: BookmarksFolderStruct; trades: BookmarksTradeStruct[] }) => Promise<void>;
  onDeserialize: (
    input: string,
  ) =>
    | [BookmarksFolderStruct, BookmarksTradeStruct[]]
    | null
    | Promise<[BookmarksFolderStruct, BookmarksTradeStruct[]] | null>;
}

const FolderImport: React.FC<FolderImportProps> = ({
  modalTitle,
  modalCloseLabel,
  logoAlt,
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

  // An async deserialization may finish after a newer input's: only the latest input's result counts
  const latestInput = useRef('');

  const handleInput = async (input: string) => {
    latestInput.current = input;
    const result = await onDeserialize(input);
    if (latestInput.current !== input) return;

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
    <Modal title={modalTitle} closeLabel={modalCloseLabel} logoAlt={logoAlt} onClose={onCancel} isOpen={true}>
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

        <Button type="submit" theme="gold" label={saveLabel} icon={SaveIcon} />
      </FormContainer>
    </Modal>
  );
};

export default FolderImport;
