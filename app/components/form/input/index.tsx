import './style.css';
import React, { useCallback, useEffect, useRef } from 'react';
import { cx } from '../../../lib/classnames';
import FormField from '../field';

type FormInputProps = {
  label: React.ReactNode;
  value: string;
  autofocus?: boolean;
  onValueChange?: (value: string) => void;
  helper?: React.ReactNode;
  className?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>;

const FormInput: React.FC<FormInputProps> = ({
                                               label,
                                               value,
                                               autofocus,
                                               onValueChange,
                                               helper,
                                               className,
                                               ...rest
                                             }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (autofocus) {
      inputRef.current?.focus();
    }
  }, [autofocus]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onValueChange?.(event.target.value);
    },
    [onValueChange],
  );

  return (
    <FormField label={label} helper={helper} className={className}>
      <input
        ref={inputRef}
        className={cx('bt-form-input')}
        type="text"
        value={value}
        onChange={handleChange}
        {...rest}
      />
    </FormField>
  );
};

export default FormInput;
