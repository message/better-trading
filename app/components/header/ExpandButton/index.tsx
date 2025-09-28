import styles from './style.module.css';
import React from 'react';
import { cx } from '../../../lib/classnames';
import { AngleLeftIcon } from '../../icons';

export interface ExpandButtonProps {
  visible: boolean;
  onClick: () => void;
  label: string;
  logoUrl: string;
  title: string;
}

const ExpandButton: React.FC<ExpandButtonProps> = ({ visible, onClick, label, logoUrl, title }) => (
  <button
    type="button"
    className={cx(styles.root, visible && styles.visible)}
    onClick={onClick}
    aria-label={label}
  >
    <AngleLeftIcon className={styles.icon} />
    <img className={styles.logo} src={logoUrl} alt={title} />
  </button>
);

export default ExpandButton;
