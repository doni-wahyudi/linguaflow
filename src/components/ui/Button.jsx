/**
 * @file Button.jsx
 * @description A versatile, accessible button component with multiple variants,
 * sizes, icon support, and loading states. Uses Framer Motion for micro-interactions.
 *
 * @example
 * <Button variant="primary" size="md" icon={Zap} loading={false}>
 *   Start Lesson
 * </Button>
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const transitionEase = [0.16, 1, 0.3, 1];

const variantClasses = {
  primary: [
    'bg-brand-600 text-white',
    'hover:bg-brand-700',
    'focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-2',
    'disabled:bg-brand-300 disabled:cursor-not-allowed',
  ].join(' '),
  secondary: [
    'border-2 border-brand-600 text-brand-600 bg-transparent',
    'hover:bg-brand-50',
    'focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-2',
    'disabled:border-brand-300 disabled:text-brand-300 disabled:cursor-not-allowed',
  ].join(' '),
  ghost: [
    'text-ink-700 bg-transparent',
    'hover:bg-ink-100',
    'focus-visible:ring-2 focus-visible:ring-ink-400/40 focus-visible:ring-offset-2',
    'disabled:text-ink-400 disabled:cursor-not-allowed',
  ].join(' '),
  danger: [
    'bg-red-500 text-white',
    'hover:bg-red-600',
    'focus-visible:ring-2 focus-visible:ring-red-400/40 focus-visible:ring-offset-2',
    'disabled:bg-red-300 disabled:cursor-not-allowed',
  ].join(' '),
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-5 py-2.5 text-body-md gap-2',
  lg: 'px-7 py-3.5 text-lg gap-2.5',
};

const iconSizeMap = {
  sm: 14,
  md: 18,
  lg: 20,
};

/**
 * Button component with variants, sizes, icon support, and loading state.
 *
 * @param {object} props
 * @param {'primary'|'secondary'|'ghost'|'danger'} [props.variant='primary'] - Visual variant.
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Size preset.
 * @param {React.ReactNode} props.children - Button label.
 * @param {import('lucide-react').LucideIcon} [props.icon] - Optional Lucide icon component.
 * @param {'left'|'right'} [props.iconPosition='left'] - Icon placement relative to label.
 * @param {boolean} [props.loading=false] - Shows spinner and disables interaction.
 * @param {boolean} [props.disabled=false] - Disables the button.
 * @param {boolean} [props.fullWidth=false] - Whether button stretches to full width.
 * @param {Function} [props.onClick] - Click handler.
 * @param {string} [props.className] - Additional CSS classes.
 * @param {React.Ref} ref - Forwarded ref.
 * @returns {JSX.Element}
 */
const Button = React.forwardRef(
  (
    {
      variant = 'primary',
      size = 'md',
      children,
      icon: Icon,
      iconPosition = 'left',
      loading = false,
      disabled = false,
      fullWidth = false,
      onClick,
      className = '',
      type = 'button',
      ...rest
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;
    const iconSize = iconSizeMap[size];

    const renderIcon = () => {
      if (loading) {
        return (
          <Loader2
            size={iconSize}
            className="animate-spin"
            aria-hidden="true"
          />
        );
      }
      if (Icon) {
        return <Icon size={iconSize} aria-hidden="true" />;
      }
      return null;
    };

    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={isDisabled}
        onClick={isDisabled ? undefined : onClick}
        whileTap={isDisabled ? undefined : { scale: 0.98 }}
        whileHover={isDisabled ? undefined : { y: -1 }}
        transition={{ duration: 0.2, ease: transitionEase }}
        className={[
          'inline-flex items-center justify-center font-body font-semibold',
          'rounded-button transition-colors duration-200 select-none',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth ? 'w-full' : '',
          isDisabled ? 'pointer-events-none' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        aria-disabled={isDisabled || undefined}
        aria-busy={loading || undefined}
        {...rest}
      >
        {iconPosition === 'left' && renderIcon()}
        {children && <span>{children}</span>}
        {iconPosition === 'right' && renderIcon()}
      </motion.button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
