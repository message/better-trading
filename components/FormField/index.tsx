// Migrated from old-extension/app/pods/components/form/field

import styles from './styles.module.scss';
import classNames from 'classnames';

interface FormFieldProps {
  label: string;
  helper?: string;
  children: React.ReactNode;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({ label, helper, children, className }) => (
  <label className={classNames(styles.formField, className)}>
    <div className={styles.label}>{label}</div>

    {children}

    {helper && <p className={styles.helper}>{helper}</p>}
  </label>
);

export type { FormFieldProps };
export default FormField;
