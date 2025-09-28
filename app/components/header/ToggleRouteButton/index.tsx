import './style.css';
import React from 'react';
import { cx } from '../../../lib/classnames';

export interface ToggleRouteButtonProps {
  href: string;
  icon: string; // Font Awesome icon without the fa- prefix
  label: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const ToggleRouteButton: React.FC<ToggleRouteButtonProps> = ({ href, icon, label, onClick }) => (
  <a className="bt-header__control" href={href} aria-label={label} onClick={onClick}>
    <i aria-hidden="true" className={cx('fas', `fa-${icon}`)} />
  </a>
);

export default ToggleRouteButton;

