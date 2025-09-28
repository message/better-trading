import './style.css';
import React from 'react';
import { cx } from '../../lib/classnames';
import AlertMessage from '../alert-message';

export type FlashMessageType = 'warning' | 'alert' | 'success';

export interface FlashMessageStruct {
  id: string | number;
  message: React.ReactNode;
  type: FlashMessageType;
  isExiting?: boolean;
  onDismiss?: () => void;
}

type FlashMessagesProps = {
  messages: FlashMessageStruct[];
  className?: string;
};

const FlashMessages: React.FC<FlashMessagesProps> = ({ messages, className }) => {
  if (!messages.length) return null;

  return (
    <div className={cx('bt-flash-messages', className)}>
      {messages.map((flash) => (
        <div
          key={flash.id}
          className={cx('bt-flash-messages__message-wrapper', flash.isExiting && 'bt-flash-messages__message-wrapper--exiting')}
          onClick={() => flash.onDismiss?.()}
        >
          <AlertMessage
            type={flash.type}
            className="bt-flash-messages__message"
          >
            {flash.message}
          </AlertMessage>
        </div>
      ))}
    </div>
  );
};

export default FlashMessages;
