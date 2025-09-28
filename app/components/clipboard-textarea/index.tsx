import './style.css';
import React, { useCallback, useState } from 'react';
import { cx } from '../../lib/classnames';
import Button from '../button';
import { copyToClipboard } from '../../lib/copy-to-clipboard';

type ClipboardTextareaProps = {
  value: string;
  copyLabel?: string;
  copiedLabel?: string;
  className?: string;
  onCopy?: () => void;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const ClipboardTextarea: React.FC<ClipboardTextareaProps> = ({
  value,
  copyLabel = 'Copy',
  copiedLabel = 'Copied',
  className,
  onCopy,
  ...textareaProps
}) => {
  const [hasCopied, setHasCopied] = useState(false);

  const handleFocus = useCallback((event: React.FocusEvent<HTMLTextAreaElement>) => {
    event.target.select();
  }, []);

  const handleCopy = useCallback(async () => {
    await copyToClipboard(value);
    setHasCopied(true);
    onCopy?.();
  }, [onCopy, value]);

  return (
    <div className={cx('bt-clipboard-textarea', className)}>
      <textarea
        value={value}
        onFocus={handleFocus}
        readOnly
        className="bt-clipboard-textarea__input"
        {...textareaProps}
      />

      <Button
        theme="gold"
        icon="clipboard"
        label={hasCopied ? copiedLabel : copyLabel}
        className="bt-clipboard-textarea__button"
        onClick={handleCopy}
        type="button"
      />
    </div>
  );
};

export default ClipboardTextarea;
