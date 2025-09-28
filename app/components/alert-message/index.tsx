import './style.css';
import React from 'react';
import { cx } from '../../lib/classnames';

type AlertMessageType = 'warning' | 'alert' | 'success';

type AlertMessageProps = {
  type?: AlertMessageType;
  message?: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const ICON_BY_TYPE: Record<AlertMessageType, string> = {
  success: 'check-circle',
  warning: 'exclamation-circle',
  alert: 'exclamation-circle',
};

const AlertMessage: React.FC<AlertMessageProps> = ({
  type = 'warning',
  message,
  children,
  className,
  ...rest
}) => {
  const icon = ICON_BY_TYPE[type];

  return (
    <div className={cx('bt-alert-message', `bt-alert-message--${type}`, className)} {...rest}>
      <i aria-hidden="true" className={cx('bt-alert-message__icon', 'fas', `fa-${icon}`)} />
      <div className="bt-alert-message__content">{children ?? message}</div>
    </div>
  );
};

export default AlertMessage;
