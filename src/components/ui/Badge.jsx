/**
 * @file Badge.jsx
 * @description Pill-shaped badge for labels, categories, and status indicators
 * (spec §5.5).
 *
 * Design notes:
 * - Every variant was checked against WCAG 2.1 AA at the size badges actually
 *   render (12–14px). The foreground is always a `-strong` / `-700` tier:
 *   ink-500 on surface-200, the pairing the first draft of the spec used, measures
 *   4.08:1 and fails; ink-700 on surface-200 measures 8.75:1.
 * - Variants are the whole vocabulary. A call site that needs a colour not listed
 *   here should add a token, not an inline `bg-*` override — that is how the
 *   original build ended up with seven different "success" greens.
 * - `outline` is for metadata on top of a coloured surface, where a filled chip
 *   would compete with the card behind it.
 *
 * @example
 * <Badge variant="brand" icon={Star}>Beginner</Badge>
 * <Badge variant="success" dot>Completed</Badge>
 * <Badge variant="outline" size="md">A2 · N4</Badge>
 */

import React from 'react';

const variantClasses = {
  /** Neutral metadata: CEFR levels, tags, counts. */
  default: 'bg-surface-200 text-ink-700',
  /** Lighter neutral for metadata sitting inside a filled surface. */
  subtle: 'bg-ink-100 text-ink-700',
  brand: 'bg-brand-50 text-brand-700',
  amber: 'bg-amber-50 text-amber-700',
  coral: 'bg-coral-50 text-coral-700',
  success: 'bg-success-bg text-success-strong',
  warning: 'bg-warning-bg text-warning-strong',
  error: 'bg-error-bg text-error-strong',
  info: 'bg-info-bg text-info-strong',
  /** Transparent chip with a hairline — reads as annotation, not status. */
  outline: 'bg-transparent text-ink-700 border border-ink-300',
  /** For use on emerald/dark hero surfaces. surface-card is the token for white,
      so an inverted chip still flips with a theme swap. */
  inverse: 'bg-surface-card/15 text-surface-card border border-surface-card/25',
};

const dotColor = {
  default: 'bg-ink-500',
  subtle: 'bg-ink-500',
  brand: 'bg-brand-600',
  amber: 'bg-amber-500',
  coral: 'bg-coral-500',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-error',
  info: 'bg-info',
  outline: 'bg-ink-500',
  inverse: 'bg-surface-card',
};

const sizeClasses = {
  sm: 'text-caption px-2 py-0.5 gap-1',
  md: 'text-body-sm px-2.5 py-1 gap-1.5',
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
 * @param {'default'|'subtle'|'brand'|'amber'|'coral'|'success'|'warning'|'error'|'info'|'outline'|'inverse'} [props.variant='default']
 * @param {'sm'|'md'} [props.size='sm'] - Size preset.
 * @param {import('lucide-react').LucideIcon} [props.icon] - Optional leading Lucide icon.
 * @param {boolean} [props.dot=false] - Render a leading status dot instead of an icon.
 * @param {boolean} [props.uppercase=false] - Overline styling for category labels.
 * @param {boolean} [props.numeric=false] - Tabular figures so counts do not shift width.
 * @param {string} [props.className] - Additional CSS classes.
 * @returns {JSX.Element}
 */
const Badge = ({
  children,
  variant = 'default',
  size = 'sm',
  icon: Icon,
  dot = false,
  uppercase = false,
  numeric = false,
  className = '',
}) => {
  return (
    <span
      className={[
        'inline-flex items-center font-body font-semibold rounded-pill whitespace-nowrap select-none',
        variantClasses[variant] || variantClasses.default,
        sizeClasses[size],
        uppercase ? 'uppercase tracking-wide' : '',
        numeric ? 'tabular-nums' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {dot && (
        <span
          aria-hidden="true"
          className={`w-1.5 h-1.5 rounded-pill shrink-0 ${dotColor[variant] || dotColor.default}`}
        />
      )}
      {Icon && <Icon size={iconSizeMap[size]} aria-hidden="true" className="shrink-0" />}
      {children}
    </span>
  );
};

Badge.displayName = 'Badge';

export default Badge;
