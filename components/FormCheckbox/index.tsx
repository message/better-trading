import styles from './styles.module.scss';
import classNames from 'classnames';
import type React from 'react';

interface FormCheckboxProps {
  value: boolean;
  label: string;
  onChange: (newValue: boolean) => void;
}

/**
 * FormCheckbox component - A checkbox with label and custom indicator
 * Migrated from old-extension/app/pods/components/form/checkbox
 */
const FormCheckbox: React.FC<FormCheckboxProps> = ({ value, label, onChange }) => {
  const toggleValue = () => {
    onChange(!value);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleValue();
    }
  };

  return (
    <div
      className={styles.wrapper}
      onClick={toggleValue}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="checkbox"
      aria-checked={value}
      aria-label={label}>
      <div className={classNames(styles.indicator, { [styles.isActive]: value })} />

      <span className={styles.label}>{label}</span>
    </div>
  );
};

export default FormCheckbox;
export type { FormCheckboxProps };
