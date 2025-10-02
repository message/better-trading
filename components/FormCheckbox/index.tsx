// Migrated from old-extension/app/pods/components/form/checkbox

import styles from './styles.module.scss';
import classNames from 'classnames';

interface FormCheckboxProps {
  value: boolean;
  label: string;
  onChange: (newValue: boolean) => void;
  className?: string;
}

const FormCheckbox: React.FC<FormCheckboxProps> = ({ value, label, onChange, className }) => {
  const handleClick = () => {
    onChange(!value);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onChange(!value);
    }
  };

  return (
    <div
      className={classNames(styles.wrapper, className)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="checkbox"
      aria-checked={value}>
      <div
        className={classNames(styles.indicator, {
          [styles.isActive]: value,
        })}
      />

      <span className={styles.label}>{label}</span>
    </div>
  );
};

export type { FormCheckboxProps };
export default FormCheckbox;
