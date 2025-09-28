import './style.css';
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
    className={cx('bt-header__expand', visible && 'bt-header__expand--visible')}
    onClick={onClick}
    aria-label={label}
  >
    {/* Decorative icon; accessibility handled by button aria-label */}
    <AngleLeftIcon className="bt-header__expand-icon" />
    <img className="bt-header__expand-logo" src={logoUrl} alt={title} />
  </button>
);

export default ExpandButton;
