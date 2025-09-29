// React version of the former Ember `button` component.
// Migrated from: old-extension/app/pods/components/button
// Responsibilities:
//  - Render a button, link, or file input with consistent styling
//  - Support different themes (blue, gold, red)
//  - Display optional icon and label
//  - Handle click events or file changes

import styles from './styles.module.scss';
import classnames from 'classnames';
import type React from 'react';

type ButtonTheme = 'blue' | 'gold' | 'red';

type ButtonIcon = string | React.ComponentType<React.SVGProps<SVGSVGElement>>;

interface BaseButtonProps {
  /** Button theme/color */
  theme: ButtonTheme;
  /** Button label text */
  label?: string;
  /** Icon - either a string identifier (for font icons) or a React component (e.g., SVGR icon) */
  icon?: ButtonIcon;
  /** Additional CSS class */
  className?: string;
}

interface ButtonAsButton extends BaseButtonProps {
  /** Renders as <button> and calls onClick */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  href?: never;
  onFileChange?: never;
  fileAccept?: never;
  type?: 'button' | 'submit' | 'reset';
}

interface ButtonAsLink extends BaseButtonProps {
  /** Renders as <a> and navigates to href */
  href: string;
  onClick?: never;
  onFileChange?: never;
  fileAccept?: never;
  type?: never;
}

interface ButtonAsFileInput extends BaseButtonProps {
  /** Renders as <label> with file input */
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** File accept attribute (defaults to '*') */
  fileAccept?: string;
  onClick?: never;
  href?: never;
  type?: never;
}

type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsFileInput;

/**
 * ButtonContent renders the icon and label inside the button
 */
const ButtonContent: React.FC<{ icon?: ButtonIcon; label?: string }> = ({ icon, label }) => {
  const renderIcon = () => {
    if (!icon) return null;

    // If icon is a React component (SVGR icon), render it
    if (typeof icon !== 'string') {
      const IconComponent = icon;
      return <IconComponent className={styles.icon} />;
    }

    // If icon is a string, render it as text/identifier (for font icons)
    return <span className={styles.icon}>{icon}</span>;
  };

  return (
    <>
      {renderIcon()}
      {label && <span className={classnames(styles.label, icon && styles.withIcon)}>{label}</span>}
    </>
  );
};

/**
 * Button renders as a button, link, or file input depending on props.
 * Supports three themes: blue, gold, and red.
 */
const Button: React.FC<ButtonProps> = props => {
  const { theme, label, icon, className } = props;
  const buttonClass = classnames(
    styles.button,
    theme === 'blue' && styles.isBlue,
    theme === 'gold' && styles.isGold,
    theme === 'red' && styles.isRed,
    className,
  );

  // Render as link
  if ('href' in props && props.href) {
    return (
      <a href={props.href} target="_blank" rel="noopener noreferrer" className={buttonClass}>
        <ButtonContent icon={icon} label={label} />
      </a>
    );
  }

  // Render as file input
  if ('onFileChange' in props && props.onFileChange) {
    const fileAccept = props.fileAccept || '*';
    return (
      <label className={buttonClass}>
        <input type="file" accept={fileAccept} onChange={props.onFileChange} className={styles.fileInput} />
        <ButtonContent icon={icon} label={label} />
      </label>
    );
  }

  // Render as button
  const buttonProps = props as ButtonAsButton;
  return (
    <button type={buttonProps.type || 'button'} onClick={buttonProps.onClick} className={buttonClass}>
      <ButtonContent icon={icon} label={label} />
    </button>
  );
};

export default Button;
export type { ButtonTheme, ButtonIcon, ButtonProps };
