/**
 * @file Input.jsx
 * @description Accessible text input implementing spec §5.3: always-visible
 * label, 40px field, 10px radius, error state with shake, helper text, icon slot.
 *
 * Design notes:
 * - §5.3 asks for `text-tertiary` placeholders. That token measures 2.52:1 on a
 *   white field and fails AA — placeholder text is real text, so it needs the
 *   same 4.5:1. Placeholders therefore use ink-500 (4.80:1) and keep the italic
 *   style. ink-400 is reserved for decorative glyphs.
 * - Focus is NOT styled here beyond a border shift. `src/styles/index.css`
 *   renders the app's single 2px `:focus-visible` outline; the §5.3 "2px brand-200
 *   ring" measures 1.5:1 against the page and would be invisible to the users the
 *   ring exists for.
 * - Height is fixed per §5.3 (40px) instead of the padding-derived 56px the
 *   previous build produced, which made fields taller than the buttons beside them.
 * - The error message re-keys so the shake replays on every new validation
 *   failure rather than only the first one.
 * - `success` exists for exercise inputs (fill-in-the-blank). A correct answer
 *   used to be `border-green-500 bg-green-50` written inline at the call site;
 *   here it is a `border-success` plus a tick glyph, so the positive state is not
 *   carried by colour alone and the palette stays inside the token set.
 *
 * @example
 * <Input label="Email" type="email" placeholder="you@example.com" icon={Mail}
 *   error={errors.email} helperText="We never share it." required />
 */

import React, { useId } from 'react';
import { Check } from 'lucide-react';

/* §5.3 field heights. */
const heightClasses = {
  sm: 'h-9 text-body-sm',
  md: 'h-10 text-body-md',
  lg: 'h-12 text-body-lg',
};

/**
 * @param {object} props
 * @param {string} props.label - Visible label text. Provide `label` or `srOnlyLabel`.
 * @param {string} [props.srOnlyLabel] - Accessible name for search/filter fields that
 *   intentionally show no caption. The label is still rendered — visually hidden —
 *   because a placeholder is not a label (WCAG 3.3.2).
 * @param {string} [props.helperText] - Hint text below the input.
 * @param {string} [props.error] - Error message (triggers error styling + shake).
 * @param {boolean} [props.invalid=false] - Error styling with no message of its
 *   own. Needed when the field and a separate live region describe the same
 *   failure: passing the sentence to both announces it twice.
 * @param {boolean} [props.success=false] - Correct-answer styling for exercise
 *   inputs. It exists because a fill-in-the-blank field needs a positive state
 *   and had no way to ask for one, so call sites reached for raw `border-green-500`
 *   instead — the same off-palette green the rest of the system retired.
 * @param {import('lucide-react').LucideIcon} [props.icon] - Optional leading Lucide icon.
 * @param {string} [props.type='text'] - Input type.
 * @param {string} [props.placeholder] - Placeholder text.
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Height preset.
 * @param {boolean} [props.disabled=false]
 * @param {boolean} [props.required=false]
 * @param {string} [props.className] - Additional wrapper CSS classes.
 * @param {React.Ref} ref - Forwarded ref to the <input> element.
 * @returns {JSX.Element}
 */
const Input = React.forwardRef(
  (
    {
      label,
      srOnlyLabel,
      helperText,
      error,
      invalid = false,
      success = false,
      icon: Icon,
      type = 'text',
      placeholder,
      value,
      onChange,
      size = 'md',
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
    /* `invalid` styles the field without claiming a message slot; `error` does
       both. Either way the field is aria-invalid. */
    const hasError = !!error || invalid;

    const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined;

    return (
      <div className={`flex flex-col gap-1.5 font-body ${className}`}>
        {/* §5.3: always present — never a placeholder standing in for a label. */}
        {label && (
          <label htmlFor={inputId} className="text-body-sm font-medium text-ink-900">
            {label}
            {required && (
              <>
                <span className="text-error-strong ml-0.5" aria-hidden="true">
                  *
                </span>
                <span className="sr-only"> (required)</span>
              </>
            )}
          </label>
        )}
        {!label && srOnlyLabel && (
          <label htmlFor={inputId} className="sr-only">
            {srOnlyLabel}
          </label>
        )}

        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-ink-500">
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
            aria-invalid={hasError || undefined}
            aria-describedby={describedBy}
            className={[
              'w-full rounded-input px-4 text-ink-900 bg-surface-card',
              'border transition-colors duration-200',
              'placeholder:text-ink-500 placeholder:italic',
              heightClasses[size] || heightClasses.md,
              Icon ? 'pl-10' : '',
              success ? 'pr-11' : '',
              hasError
                ? 'border-error'
                : success
                  ? 'border-success'
                  : 'border-ink-300 hover:border-ink-400',
              /* §5.3 disabled: surface-100 fill + 0.6 opacity, not a grey text swap. */
              disabled ? 'bg-surface-100 opacity-60 cursor-not-allowed' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            {...rest}
          />

          {/* The correct-answer tick keeps the positive state from being colour
              alone (WCAG 1.4.1 Use of Colour) — a green border is invisible to a
              grayscale or deuteranopic user, a border plus a glyph is not. */}
          {success && (
            <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none">
              <Check size={18} strokeWidth={3} className="text-success-strong" aria-hidden="true" />
            </span>
          )}
        </div>

        {/* §5.3 error: helper takes the error colour and the field shakes. */}
        {error && (
          <p key={error} id={errorId} role="alert" className="text-caption text-error-strong animate-shake">
            {error}
          </p>
        )}

        {/* Helper text (suppressed while an error is shown) */}
        {helperText && !error && (
          <p id={helperId} className="text-caption text-ink-500">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
