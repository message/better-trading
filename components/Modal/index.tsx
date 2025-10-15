import styles from './styles.module.scss';
import classNames from 'classnames';
import { useEffect } from 'react';
import ReactModal from 'react-modal';
import type { ReactNode } from 'react';
import type React from 'react';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  isOpen: boolean;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({ title, onClose, children, isOpen, className }) => {
  useEffect(() => {
    // Set the app element for accessibility (required by react-modal)
    const appElement = document.getElementById('root') || document.body;
    ReactModal.setAppElement(appElement);
  }, []);

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={classNames(styles.container, className)}
      overlayClassName={styles.overlay}
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>
          <img className={styles.headerTitleLogo} src="/assets/images/logo.png" alt="Better Trading" />
          {title}
        </h1>

        <button type="button" className={styles.headerClose} onClick={onClose} aria-label="Close modal">
          ×
        </button>
      </header>

      <div className={styles.body}>{children}</div>
    </ReactModal>
  );
};

export default Modal;
