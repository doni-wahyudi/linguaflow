/**
 * @file Badge.jsx
 * @description Pill-shaped badge for labels, categories, and status indicators.
 * Supports multiple color variants and optional leading icon.
 *
 * @example
 * <Badge variant="brand" icon={Star}>Beginner</Badge>
 */

import React from 'react';

const variantClasses = {
  default: 'bg-ink-100 text-ink-700',
  success: 'bg-green-50 text-green-700',
  warning: 'bg-amber-50 text-amber-700',
  error: 'bg-red-50 text-red-700',
  brand: 'bg-brand-50 text-brand-700',
  amber: 'bg-amber-50 text-amber-700',
};

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5 gap-1',
  md: 'text-sm px-3 py-1 gap-1.5',
};

const iconSizeMap = {
  sm: 12,
  md: 14,
};

/**
 * Badge component for inline labels and tags.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Badge text content.
 * @param {'default'|'success'|'warning'|'error'|'brand'|'amber'} [props.variant='default'] - Color variant.
 * @param {'sm'|'md'} [props.size='sm'] - Size preset.
 * @param {import('lucide-react').LucideIcon} [props.icon] - Optional leading Lucide icon.
 * @param {string} [props.className] - Additional CSS classes.
 * @returns {JSX.Element}
 */
const Badge = ({
  children,
  variant = 'default',
  size = 'sm',
  icon: Icon,
  className = '',
}) => {
  return (
    <span
      className={[
        'inline-flex items-center font-body font-semibold rounded-pill whitespace-nowrap select-none',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {Icon && <Icon size={iconSizeMap[size]} aria-hidden="true" />}
      {children}
    </span>
  );
};

Badge.displayName = 'Badge';

export default Badge;
