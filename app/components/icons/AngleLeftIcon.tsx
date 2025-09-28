import React from 'react';
import { cx } from '../../lib/classnames';

export type AngleLeftIconProps = {
  /** Accessible label. If omitted, the icon is treated as decorative (aria-hidden). */
  label?: string;
  /**
   * Base width in px (number) or any CSS size (string). If you prefer to control both
   * width and height manually, pass them via SVG props directly and omit size.
   * Height is automatically computed preserving original 256x512 aspect ratio when a numeric size is provided.
   */
  size?: number | string;
  className?: string;
} & Omit<React.SVGProps<SVGSVGElement>, 'width' | 'height'>;

const ORIGINAL_WIDTH = 256;
const ORIGINAL_HEIGHT = 512;
const RATIO = ORIGINAL_HEIGHT / ORIGINAL_WIDTH; // 2

const AngleLeftIcon: React.FC<AngleLeftIconProps> = ({ label, size, className, role, ...rest }) => {
  let width: string | undefined;
  let height: string | undefined;

  if (typeof size === 'number') {
    width = `${size}px`;
    height = `${Math.round(size * RATIO)}px`;
  } else if (typeof size === 'string') {
    width = size; // can't reliably derive height from arbitrary CSS size string
  } else {
    // Default inline size maintaining aspect ratio inside 1em text line.
    width = '0.5em';
    height = '1em';
  }

  const ariaHidden = label ? undefined : true;
  const computedRole = role ?? (label ? 'img' : undefined);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${ORIGINAL_WIDTH} ${ORIGINAL_HEIGHT}`}
      width={width}
      height={height}
      aria-label={label}
      aria-hidden={ariaHidden}
      role={computedRole}
      className={cx('bt-icon', 'bt-icon--angle-left', className)}
      fill="currentColor"
      focusable="false"
      {...rest}
    >
      <path fill="currentColor" d="M31.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L127.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L201.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34z" />
    </svg>
  );
};

export default AngleLeftIcon;
