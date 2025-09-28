import React from 'react';
import { cx } from '../../lib/classnames';

export const CollapseButton: React.FC<{
  onClick: () => void;
  label: string;
  className?: string;
}> = ({ onClick, label, className }) => (
  <button
    type="button"
    className={cx('bt-header__control', className)}
    onClick={onClick}
    aria-label={label}
  >
    <i aria-hidden="true" className="fas fa-angle-right" />
  </button>
);

export default CollapseButton;

