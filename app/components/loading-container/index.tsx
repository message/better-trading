import './style.css';
import React, { useEffect, useMemo } from 'react';
import { cx } from '../../lib/classnames';

type LoadingTask = {
  isRunning: boolean;
  perform: () => Promise<unknown> | void;
};

type LoadingContainerProps = {
  task?: LoadingTask;
  isLoading?: boolean;
  autoStart?: boolean;
  size?: 'small' | 'large';
  className?: string;
  loaderLabel?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const LoadingContainer: React.FC<LoadingContainerProps> = ({
                                                             task,
                                                             isLoading,
                                                             autoStart = true,
                                                             size = 'large',
                                                             className,
                                                             loaderLabel = 'Loading…',
                                                             children,
                                                             ...rest
                                                           }) => {
  const shouldDisplayLoader = useMemo(() => {
    if (typeof isLoading === 'boolean') return isLoading;
    return task?.isRunning ?? false;
  }, [isLoading, task]);

  useEffect(() => {
    if (!task || !autoStart) return;

    void task.perform();
  }, [autoStart, task]);

  return (
    <div className={cx('bt-loading-container', className)} {...rest}>
      {shouldDisplayLoader ? (
        <div className={cx('bt-loading-container__spinner', `bt-loading-container__spinner--${size}`)}>
          <i aria-hidden="true" className="fas fa-circle-notch fa-spin" />
          <span className="bt-loading-container__sr-only">{loaderLabel}</span>
        </div>
      ) : (
        <div className="bt-loading-container__content">{children}</div>
      )}
    </div>
  );
};

export default LoadingContainer;
