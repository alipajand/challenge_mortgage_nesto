import { useId, type ComponentPropsWithRef } from 'react';
import { AlertCircleIcon } from './icons';

type TextFieldProps = ComponentPropsWithRef<'input'> & {
  label: string;
  hint?: string;
  error?: string;
};

export function TextField({
  label,
  hint,
  error,
  id,
  type = 'text',
  ...inputProps
}: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="field">
      <label htmlFor={inputId} className="field-label">
        {label}
      </label>
      {hint && (
        <p id={hintId} className="field-hint">
          {hint}
        </p>
      )}
      <input
        id={inputId}
        type={type}
        className="field-input"
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...inputProps}
      />
      {error && (
        <p id={errorId} className="field-error">
          <AlertCircleIcon />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
