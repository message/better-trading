// React version of the former Ember `loading-container` component.
// Migrated from: old-extension/app/pods/components/loading-container
// Responsibilities:
//  - Execute an async task on mount
//  - Show a loading spinner while the task is running
//  - Show children content after the task completes
//  - Support different spinner sizes (small/large)

import styles from './styles.module.scss';
import classnames from 'classnames';
import { useState, useEffect, useCallback } from 'react';
import type { HTMLAttributes } from 'react';

interface LoadingContainerProps extends HTMLAttributes<HTMLDivElement> {
  /** Async function to execute on mount. Returns a Promise. */
  task: () => Promise<void>;
  /** Size of the loading spinner */
  size?: 'small' | 'large';
  /** Content to show after loading completes */
  children?: React.ReactNode;
}

/**
 * LoadingContainer executes an async task on mount and shows a loading spinner
 * while the task is running. Once complete, it displays its children.
 */
const LoadingContainer: React.FC<LoadingContainerProps> = ({
  task,
  size = 'large',
  children,
  className,
  ...divProps
}) => {
  const [isRunning, setIsRunning] = useState(true);

  const executeTask = useCallback(async () => {
    try {
      setIsRunning(true);
      await task();
    } catch (error) {
      console.error('LoadingContainer task failed:', error);
    } finally {
      setIsRunning(false);
    }
  }, [task]);

  useEffect(() => {
    executeTask();
  }, [executeTask]);

  return (
    <div className={className} {...divProps}>
      {isRunning ? (
        <div className={classnames(styles.loader, size === 'small' ? styles.isSmall : styles.isLarge)}>
          <div className={styles.spinner} />
        </div>
      ) : (
        <div className={styles.loaderContainer}>{children}</div>
      )}
    </div>
  );
};

export type { LoadingContainerProps };
export default LoadingContainer;
