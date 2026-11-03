/**
 * @file Input.jsx
 * @description Accessible text input with visible label, helper text, error state,
 * and optional leading icon. Uses React.forwardRef for form library compatibility.
 *
 * @example
 * <Input
 *   label="Email"
 *   type="email"
 *   placeholder="you@example.com"
 *   icon={Mail}
 *   error={errors.email}
 *   required
 * />
 */

import React, { useId } from 'react';

/**
 * Form input component with label, helper text, error state, and optional icon.
 *
 * @param {object} props
 * @param {string} props.label - Visible label text (required for a11y).
 * @param {string} [props.helperText] - Hint text below the input.
 * @param {string} [props.error] - Error message (triggers error styling).
 * @param {import('lucide-react').LucideIcon} [props.icon] - Optional leading Lucide icon.
 * @param {string} [props.type='text'] - Input type.
 * @param {string} [props.placeholder] - Placeholder text.
 * @param {string} [props.value] - Controlled value.
 * @param {Function} [props.onChange] - Change handler.
 * @param {boolean} [props.disabled=false] - Disables the input.
 * @param {boolean} [props.required=false] - Marks the field as required.
 * @param {string} [props.className] - Additional wrapper CSS classes.
 * @param {React.Ref} ref - Forwarded ref to the <input> element.
 * @returns {JSX.Element}
 */
const Input = React.forwardRef(
  (
    {
      label,
      helperText,
      error,
      icon: Icon,
      type = 'text',
      placeholder,
      value,
      onChange,
      disabled = false,
      required = false,
      className = '',
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = rest.id || generatedId;
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText ? `${inputId}-helper` : undefined;

    const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined;

    return (
      <div className={`flex flex-col gap-1.5 font-body ${className}`}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="text-body-sm font-semibold text-ink-700"
          >
            {label}
            {required && (
              <span className="text-red-500 ml-0.5" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        {/* Input wrapper */}
        <div className="relative">
          {/* Leading icon */}
          {Icon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-ink-400">
              <Icon size={18} aria-hidden="true" />
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            required={required}
            aria-invalid={!!error || undefined}
            aria-describedby={describedBy}
            className={[
              'w-full rounded-input px-4 py-3 text-body-md text-ink-900',
              'border bg-white transition-all duration-200',
              'placeholder:text-ink-400',
              Icon ? 'pl-11' : '',
              error
                ? 'border-red-500 focus:ring-2 focus:ring-red-500/30 focus:border-red-500'
                : 'border-ink-300 focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500',
              disabled ? 'opacity-60 cursor-not-allowed bg-ink-50' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            {...rest}
          />
        </div>

        {/* Error message */}
        {error && (
          <p id={errorId} className="text-body-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        {/* Helper text (hidden when error is shown) */}
        {helperText && !error && (
          <p id={helperId} className="text-body-sm text-ink-500">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
