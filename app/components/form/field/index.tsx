import './style.css';
import React from 'react';
import { cx } from '../../../lib/classnames';

type FormFieldProps = {
  label: React.ReactNode;
  helper?: React.ReactNode;
  className?: string;
} & React.LabelHTMLAttributes<HTMLLabelElement>;

const FormField: React.FC<FormFieldProps> = ({ label, helper, className, children, ...rest }) => (
  <label className={cx('bt-form-field', className)} {...rest}>
    <div className="bt-form-field__label">{label}</div>
    {children}
    {helper && <p className="bt-form-field__helper">{helper}</p>}
  </label>
);

export default FormField;
