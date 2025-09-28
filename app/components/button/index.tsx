import './style.css';
import React, { ChangeEventHandler, PropsWithChildren } from 'react';
import { cx } from '../../lib/classnames';

type ButtonTheme = 'blue' | 'gold' | 'red';

type BaseProps = {
  label?: string;
  icon?: string;
  theme?: ButtonTheme;
  className?: string;
};

type AnchorProps = BaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & {
    href: string;
    onFileChange?: never;
  };

type FileInputProps = BaseProps &
  Omit<React.LabelHTMLAttributes<HTMLLabelElement>, keyof BaseProps | 'onChange'> & {
    onFileChange: ChangeEventHandler<HTMLInputElement>;
    fileAccept?: string;
    multiple?: boolean;
    href?: never;
  };

type ButtonElementProps = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
    href?: never;
    onFileChange?: never;
  };

type ButtonProps = (AnchorProps | FileInputProps | ButtonElementProps) & PropsWithChildren;

const getThemeClass = (theme: ButtonTheme | undefined) => `bt-button--${theme ?? 'blue'}`;

const getIconClassName = (icon?: string) => {
  if (!icon) return undefined;

  const prefix = ['github', 'discord'].includes(icon) ? 'fab' : 'fas';

  return `${prefix} fa-${icon}`;
};

const ButtonContent = ({ label, icon }: { label?: string; icon?: string }) => (
  <span className={cx('bt-button__content', icon && 'bt-button__content--with-icon')}>
    {icon && <i aria-hidden="true" className={cx('bt-button__icon', getIconClassName(icon))} />}
    {label && <span className="bt-button__label">{label}</span>}
  </span>
);

const renderContent = (props: ButtonProps) => {
  if (props.children) return props.children;

  return <ButtonContent label={props.label} icon={props.icon} />;
};

const Button = (props: ButtonProps) => {
  const themeClass = getThemeClass(props.theme);
  const combinedClassName = cx('bt-button', themeClass, props.className);

  if ('href' in props) {
    const anchorProps = props as AnchorProps;
    const { label, icon, theme, className, children, rel, target, ...restAnchor } = anchorProps;
    const finalRel = rel ?? 'noopener noreferrer';
    const finalTarget = target ?? '_blank';

    return (
      <a className={combinedClassName} {...restAnchor} rel={finalRel} target={finalTarget}>
        {renderContent(anchorProps)}
      </a>
    );
  }

  if ('onFileChange' in props && props.onFileChange) {
    const labelProps = props as FileInputProps;
    const { onFileChange, fileAccept = '*', multiple, label, icon, children, theme, className, ...restLabel } = labelProps;

    return (
      <label className={combinedClassName} {...restLabel}>
        <input
          className="bt-button__file-input"
          type="file"
          accept={fileAccept}
          multiple={multiple}
          onChange={onFileChange}
        />
        {renderContent(labelProps)}
      </label>
    );
  }

  const buttonProps = props as ButtonElementProps;
  const { label, icon, children, theme, className, type, ...restButton } = buttonProps;

  return (
    <button type={type ?? 'button'} className={combinedClassName} {...restButton}>
      {renderContent(buttonProps)}
    </button>
  );
};

export default Button;
