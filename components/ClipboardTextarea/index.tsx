import styles from './styles.module.scss';
import { copyToClipboard } from '../../utils/copy-to-clipboard';
import Button from '../Button';
import classNames from 'classnames';
import { useState, useCallback } from 'react';
import type React from 'react';

interface ClipboardTextareaProps {
  value: string;
  className?: string;
  buttonLabel?: string;
  buttonCopiedLabel?: string;
}

export const ClipboardTextarea: React.FC<ClipboardTextareaProps> = ({
  value,
  className,
  buttonLabel = 'Copy',
  buttonCopiedLabel = 'Copied!',
}) => {
  const [hasCopied, setHasCopied] = useState(false);

  const handleSelectAll = useCallback((event: React.FocusEvent<HTMLTextAreaElement>) => {
    event.target.select();
  }, []);

  const handleCopyToClipboard = useCallback(async () => {
    try {
      await copyToClipboard(value);
      setHasCopied(true);
      // Reset the copied state after 2 seconds
      setTimeout(() => setHasCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  }, [value]);

  const copyButtonLabel = hasCopied ? buttonCopiedLabel : buttonLabel;

  return (
    <div className={classNames(styles.textareaWrapper, className)}>
      <textarea className={styles.textarea} value={value} onFocus={handleSelectAll} readOnly />
      <Button
        type="button"
        theme="gold"
        label={copyButtonLabel}
        onClick={handleCopyToClipboard}
        icon="📋"
        className={styles.clipboardButton}
      />
    </div>
  );
};
