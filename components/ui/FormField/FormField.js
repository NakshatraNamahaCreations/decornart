import { useId } from "react";
import styles from "./FormField.module.css";

export default function FormField({
  id,
  label,
  type = "text",
  hint,
  error,
  required = false,
  multiline = false,
  rows = 4,
  className = "",
  ...rest
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const hintId = `${fieldId}-hint`;
  const errorId = `${fieldId}-error`;
  const describedBy = error ? errorId : hint ? hintId : undefined;

  const sharedProps = {
    id: fieldId,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    required,
    className: styles.input,
    ...rest,
  };

  return (
    <div
      className={`${styles.field} ${error ? styles.hasError : ""} ${className}`}
    >
      {label ? (
        <label htmlFor={fieldId} className={styles.label}>
          {label}
          {required ? (
            <span aria-hidden="true" className={styles.required}>
              *
            </span>
          ) : null}
        </label>
      ) : null}

      {multiline ? (
        <textarea rows={rows} {...sharedProps} />
      ) : (
        <input type={type} {...sharedProps} />
      )}

      {hint && !error ? (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
