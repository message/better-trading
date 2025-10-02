// Migrated from old-extension/app/pods/components/form/container

import styles from './styles.module.scss';
import classNames from 'classnames';

interface FormContainerProps {
  // TODO: Migrate submitTask to proper Promise-based approach when moving to service/hook layer
  onSubmit: (entity: unknown) => void | Promise<void>;
  canSubmit?: boolean;
  entity: unknown;
  children: React.ReactNode;
  className?: string;
}

const FormContainer: React.FC<FormContainerProps> = ({ onSubmit, canSubmit = true, entity, children, className }) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    onSubmit(entity);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={classNames(styles.formContainer, { [styles.isDisabled]: !canSubmit }, className)}>
      {children}
    </form>
  );
};

export type { FormContainerProps };
export default FormContainer;
