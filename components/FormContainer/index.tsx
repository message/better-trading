import styles from './styles.module.scss';
import classNames from 'classnames';
import type React from 'react';

interface FormContainerProps {
  children: React.ReactNode;
  onSubmit: () => void | Promise<void>;
  canSubmit?: boolean;
}

/**
 * FormContainer component - A form wrapper with submit handling
 * Migrated from old-extension/app/pods/components/form/container
 *
 * TODO: Original component used ember-concurrency submitTask.
 * This simplified version accepts a plain onSubmit handler.
 * Consider adding loading state management if needed.
 */
const FormContainer: React.FC<FormContainerProps> = ({ children, onSubmit, canSubmit = true }) => {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) return;

    await onSubmit();
  };

  return (
    <form className={classNames(styles.formContainer, { [styles.isDisabled]: !canSubmit })} onSubmit={handleSubmit}>
      {children}
    </form>
  );
};

export default FormContainer;
export type { FormContainerProps };
