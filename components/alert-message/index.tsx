import React from 'react';
import styles from './styles.module.scss';

interface AlertMessageProps {
  type: 'warning' | 'alert' | 'success';
  message: string;
  className?: string;

  [key: string]: any; // for additional props
}

const ALERT_CONFIG = {
  success: {
    icon: '✓',
    className: styles.isSuccess,
  },
  warning: {
    icon: '⚠',
    className: styles.isWarning,
  },
  alert: {
    icon: '⚠',
    className: styles.isAlert,
  },
} as const;

const AlertMessage: React.FC<AlertMessageProps> = ({
                                                     type,
                                                     message,
                                                     className,
                                                     ...additionalProps
                                                   }) => {
  const config = ALERT_CONFIG[type];

  return (
    <div className={`${styles.alertMessage} ${config.className} ${className || ''}`} {...additionalProps}>
      <span className={styles.icon}>
        {config.icon}
      </span>
      <span dangerouslySetInnerHTML={{ __html: message }} />
    </div>
  );
};

export default AlertMessage;
