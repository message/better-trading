import './style.css';
import React, { FormEvent, useCallback } from 'react';
import { cx } from '../../../lib/classnames';

type FormContainerProps<Entity = unknown> = {
  onSubmit?: (entity: Entity | undefined, event: FormEvent<HTMLFormElement>) => void | Promise<void>;
  entity?: Entity;
  canSubmit?: boolean;
  className?: string;
} & React.FormHTMLAttributes<HTMLFormElement>;

const FormContainer = <Entity,>({
  onSubmit,
  entity,
  canSubmit = true,
  className,
  children,
  ...rest
}: FormContainerProps<Entity>) => {
  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!canSubmit) return;

      void onSubmit?.(entity, event);
    },
    [canSubmit, entity, onSubmit],
  );

  return (
    <form
      className={cx('bt-form-container', !canSubmit && 'bt-form-container--disabled', className)}
      onSubmit={handleSubmit}
      {...rest}
    >
      {children}
    </form>
  );
};

export default FormContainer;
