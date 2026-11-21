import styles from './TradeDeletion.module.scss';
import TrashIcon from '@/assets/icons/solid/trash.svg?react';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import type React from 'react';

interface TradeDeletionProps {
  modalTitle: string;
  modalCloseLabel: string;
  logoAlt: string;
  /** Plain text: the Trade title in it may come from a shared Export String */
  confirmationMessage: string;
  deleteLabel: string;
  cancelLabel: string;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}

const TradeDeletion: React.FC<TradeDeletionProps> = ({
  modalTitle,
  modalCloseLabel,
  logoAlt,
  confirmationMessage,
  deleteLabel,
  cancelLabel,
  onCancel,
  onConfirm,
}) => (
  <Modal title={modalTitle} closeLabel={modalCloseLabel} logoAlt={logoAlt} onClose={onCancel} isOpen={true}>
    <p className={styles.confirmation}>{confirmationMessage}</p>

    <div className={styles.actions}>
      <Button type="button" theme="red" label={deleteLabel} icon={TrashIcon} onClick={onConfirm} />
      <Button type="button" theme="blue" label={cancelLabel} onClick={onCancel} />
    </div>
  </Modal>
);

export default TradeDeletion;
