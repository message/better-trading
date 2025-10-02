// Migrated from old-extension/app/pods/components/form/input

import styles from './styles.module.scss';
import FormField from '../FormField';
import { useEffect, useRef } from 'react';

interface FormInputProps {
  label: string;
  value: string;
  autofocus?: boolean;
  onChange: (value: string) => void;
}

const FormInput: React.FC<FormInputProps> = ({ label, value, autofocus, onChange, ...rest }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autofocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autofocus]);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <FormField label={label}>
      <input ref={inputRef} type="text" className={styles.input} value={value} onChange={handleInput} {...rest} />
    </FormField>
  );
};

export type { FormInputProps };
export default FormInput;
