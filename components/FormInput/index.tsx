import styles from './styles.module.scss';
import FormField from '@/components/FormField';
import { useEffect, useRef } from 'react';
import type { InputHTMLAttributes } from 'react';

interface FormInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  value: string;
  autofocus?: boolean;
  onChange: (value: string) => void;
}

/**
 * FormInput component - A text input field with label
 * Migrated from old-extension/app/pods/components/form/input
 */
const FormInput: React.FC<FormInputProps> = ({ label, value, autofocus, onChange, ...attributes }) => {
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
      <input ref={inputRef} type="text" className={styles.input} value={value} onChange={handleInput} {...attributes} />
    </FormField>
  );
};

export default FormInput;
export type { FormInputProps };
