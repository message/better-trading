import styles from './styles.module.scss';
import AlertMessage from '../AlertMessage';
import classnames from 'classnames';
import type { FlashMessage } from './types';
import type React from 'react';

interface FlashMessagesProps {
  flashMessages: FlashMessage[];
  onDismiss?: (flashMessage: FlashMessage) => void;
}

const FlashMessages = ({ flashMessages, onDismiss }: FlashMessagesProps) => {
  const handleDismiss = (flashMessage: FlashMessage) => {
    if (onDismiss) {
      onDismiss(flashMessage);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, flashMessage: FlashMessage) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleDismiss(flashMessage);
    }
  };

  return (
    <div className={styles.flashMessages}>
      {flashMessages.map(flash => (
        <div
          key={flash.id}
          role="button"
          tabIndex={0}
          onClick={() => handleDismiss(flash)}
          onKeyDown={e => handleKeyDown(e, flash)}
          className={classnames(styles.messageWrapper, {
            [styles.isExiting]: flash.exiting,
          })}>
          <AlertMessage message={flash.message} type={flash.type} className={styles.message} />
        </div>
      ))}
    </div>
  );
};

export default FlashMessages;
