import styles from './styles.module.scss';
import AngleLeftIcon from '@/assets/icons/solid/angle-left.svg?react';
import { getExtensionUrl } from '@/utils/extension-url';
import {
  expandSidePanel,
  initializeSidePanelCollapse,
  subscribeToSidePanelCollapse,
} from '@/utils/side-panel-collapse';
import classnames from 'classnames';
import { useCallback, useEffect, useState } from 'react';
import type { FC } from 'react';

interface ExpandButtonProps {
  className?: string;
}

const ExpandButton: FC<ExpandButtonProps> = ({ className }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(initializeSidePanelCollapse());
    const unsubscribe = subscribeToSidePanelCollapse(setIsVisible);
    return unsubscribe;
  }, []);

  const handleExpand = useCallback(() => {
    expandSidePanel();
  }, []);

  const logoUrl = getExtensionUrl('/assets/images/logo.png');
  const buttonClassName = classnames(styles.expandButton, className, {
    [styles.isVisible]: isVisible,
  });

  return (
    <button onClick={handleExpand} type="button" className={buttonClassName}>
      <AngleLeftIcon className={styles.expandButtonIcon} />
      <img className={styles.logo} src={logoUrl} alt="Better Trading Logo" />
    </button>
  );
};

export default ExpandButton;
export type { ExpandButtonProps };
