import './style.css';
import React, { useCallback } from 'react';
import { cx } from '../../../lib/classnames';

type FormCheckboxProps = {
  value: boolean;
  label: React.ReactNode;
  onChange: (nextValue: boolean) => void;
  className?: string;
} & Omit<React.LabelHTMLAttributes<HTMLLabelElement>, 'onChange'>;

const FormCheckbox: React.FC<FormCheckboxProps> = ({ value, label, onChange, className, children, ...rest }) => {
  const toggle = useCallback(() => {
    onChange(!value);
  }, [onChange, value]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLLabelElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggle();
      }
    },
    [toggle],
  );

  const { onClick, onKeyDown, ...restProps } = rest;

  return (
    <label
      className={cx('bt-form-checkbox', className)}
      role="checkbox"
      aria-checked={value}
      tabIndex={0}
      {...restProps}
      onClick={(event) => {
        onClick?.(event);
        toggle();
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        handleKeyDown(event);
      }}
    >
      <span className={cx('bt-form-checkbox__indicator', value && 'bt-form-checkbox__indicator--active')} />
      <span className="bt-form-checkbox__label">{label}</span>
      {children}
    </label>
  );
};

export default FormCheckbox;
