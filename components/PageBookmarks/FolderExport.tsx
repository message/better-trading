import styles from './FolderExport.module.scss';
import Button from '@/components/Button';
import { ClipboardTextarea } from '@/components/ClipboardTextarea';
import FormField from '@/components/FormField';
import Modal from '@/components/Modal';
import type React from 'react';

interface FolderExportProps {
  /** The Folder's Export String (format `3:`) */
  exportString: string;
  modalTitle: string;
  modalCloseLabel: string;
  logoAlt: string;
  exportCodeLabel: string;
  exportCodeHelper: string;
  copyLabel: string;
  copiedLabel: string;
  closeLabel: string;
  onClose: () => void;
}

// ponytail: 1.9.1's preview page and embed snippet were disabled (the page never existed), so they are not ported
const FolderExport: React.FC<FolderExportProps> = ({
  exportString,
  modalTitle,
  modalCloseLabel,
  logoAlt,
  exportCodeLabel,
  exportCodeHelper,
  copyLabel,
  copiedLabel,
  closeLabel,
  onClose,
}) => (
  <Modal title={modalTitle} closeLabel={modalCloseLabel} logoAlt={logoAlt} onClose={onClose} isOpen={true}>
    <div className={styles.folderExport}>
      <FormField label={exportCodeLabel} helper={exportCodeHelper}>
        <ClipboardTextarea value={exportString} buttonLabel={copyLabel} buttonCopiedLabel={copiedLabel} />
      </FormField>

      <Button type="button" theme="blue" label={closeLabel} onClick={onClose} />
    </div>
  </Modal>
);

export default FolderExport;
