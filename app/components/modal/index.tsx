import './style.css';
import React, { useCallback, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../lib/classnames';
import { getExtensionUrl } from '../../lib/extension-url';

type ModalProps = {
  title: React.ReactNode;
  onClose: () => void;
  isOpen?: boolean;
  className?: string;
  closeLabel?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const ensureModalContainer = () => {
  if (typeof document === 'undefined') return null;

  const existing = document.getElementById('bt-modal-root');
  if (existing) return existing;

  const container = document.createElement('div');
  container.id = 'bt-modal-root';
  document.body.appendChild(container);
  return container;
};

const logoSrc = getExtensionUrl('assets/images/logo.png');

const Modal: React.FC<ModalProps> = ({
                                       title,
                                       onClose,
                                       isOpen = true,
                                       className,
                                       closeLabel = 'Close dialog',
                                       children,
                                       ...rest
                                     }) => {
  const container = useMemo(() => ensureModalContainer(), []);

  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!isOpen) return undefined;

    document.addEventListener('keyup', handleKeyUp);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keyup', handleKeyUp);
      document.body.style.overflow = previousOverflow;
    };
  }, [handleKeyUp, isOpen]);

  if (!isOpen || !container) return null;

  return createPortal(
    <div className="bt-modal">
      <div className="bt-modal__overlay" onClick={onClose} />

      <div className={cx('bt-modal__dialog', className)} role="dialog" aria-modal="true" {...rest}>
        <header className="bt-modal__header">
          <h1 className="bt-modal__title">
            <img src={logoSrc} alt="Better Trading" className="bt-modal__title-logo" />
            <span>{title}</span>
          </h1>

          <button type="button" className="bt-modal__close" onClick={onClose} aria-label={closeLabel}>
            <i aria-hidden="true" className="fas fa-times" />
          </button>
        </header>

        <div className="bt-modal__body">{children}</div>
      </div>
    </div>,
    container,
  );
};

export default Modal;
