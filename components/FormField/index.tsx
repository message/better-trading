import styles from './styles.module.scss';
import type React from 'react';

interface FormFieldProps {
  label: string;
  helper?: string;
  children: React.ReactNode;
}

/**
 * FormField component - A form field wrapper with label and optional helper text
 * Migrated from old-extension/app/pods/components/form/field
 */
const FormField: React.FC<FormFieldProps> = ({ label, helper, children }) => (
  <label className={styles.formField}>
    <div className={styles.label}>{label}</div>

    {children}

    {helper && <p className={styles.helper}>{helper}</p>}
  </label>
);

export default FormField;
export type { FormFieldProps };
