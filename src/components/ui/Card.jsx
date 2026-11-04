/**
 * @file Card.jsx
 * @description The content container primitive, implementing spec §5.2.
 *
 * Fixes over the previous build:
 * - Border is a solid `ink-200` (spec `border-default`). It used to be
 *   `border-ink-200/50`, which composites to roughly #F3F2F0 on the cream page
 *   and made the documented border effectively invisible, leaving cards to rest
 *   entirely on a soft shadow.
 * - Hover elevation uses the `shadow-card` / `shadow-card-hover` tokens instead
 *   of an inline shadow string that silently duplicated `shadow-soft-lg`.
 * - The §5.2 variant set (accent bar, stat, achievement, flashcard) is now
 *   expressible without one-off classes at each call site.
 * - `tone` and `earned` replace the surface classes instead of appending to them.
 *   Two `bg-*` utilities in one class attribute do not resolve by source order —
 *   Tailwind decides by stylesheet position — so appending was a coin flip.
 *
 * @example
 * <Card>…</Card>
 * <Card tone="coral">Streak</Card>
 * <Card accent="brand" padding="sm">…</Card>
 * <Card earned={isUnlocked}>Achievement</Card>
 */

import React from 'react';
import { motion } from 'framer-motion';
import { transitionEase } from '../../utils/motion';

const base = 'bg-surface-card rounded-card border border-ink-200 shadow-card';

const variantClasses = {
  default: base,
  elevated: 'bg-surface-card rounded-card border border-ink-200 shadow-card-hover',
  outlined: 'bg-surface-card rounded-card border-2 border-ink-200',
  /** Flat card for content that already sits on a coloured surface. */
  plain: 'bg-surface-card rounded-card',
};

/* Tinted surfaces for status contexts. Text inside a tinted card must still use
   ink-900 / ink-700 / ink-500; the tint is a 50-step background, not a palette
   escape hatch. */
const toneClasses = {
  brand: 'bg-brand-50 border-brand-200',
  amber: 'bg-amber-50 border-amber-200',
  coral: 'bg-coral-50 border-coral-200',
  info: 'bg-info-bg border-info/25',
  quiet: 'bg-surface-100 border-ink-200',
  /** For hero cards: white-on-emerald measures 5.48:1. */
  inverse: 'bg-brand-700 border-brand-700 text-white',
  /* Semantic feedback tints. Without these, every "out of hearts" / "lesson
     passed" panel hand-wrote `bg-red-100 border-red-200`, which is how the
     original build ended up with four different failure reds. The tint is a
     -bg surface; the text inside it still uses the -strong tier. */
  success: 'bg-success-bg border-success-border',
  warning: 'bg-warning-bg border-warning-border',
  error: 'bg-error-bg border-error-border',
};

/* §5.2 Lesson Card: 4px left accent bar in the category colour. */
const accentClasses = {
  brand: 'before:bg-brand-500',
  amber: 'before:bg-amber-500',
  coral: 'before:bg-coral-500',
  success: 'before:bg-success',
  error: 'before:bg-error',
  info: 'before:bg-info',
  ink: 'before:bg-ink-300',
};

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

/** Compose the surface classes so exactly one bg-* and one border-* survive. */
function surfaceClasses({ variant, tone, earned }) {
  let shell = variantClasses[variant] || variantClasses.default;

  const override =
    (tone && toneClasses[tone]) ||
    (earned === true && 'border-amber-400') ||
    (earned === false && 'border-ink-200');

  if (override) {
    shell = shell
      .split(' ')
      .filter((cls) => !cls.startsWith('bg-') && !cls.startsWith('border'))
      .concat(override.split(' '))
      .join(' ');
  }

  if (earned === false) shell += ' opacity-60';

  return shell;
}

/**
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {'default'|'elevated'|'outlined'|'plain'} [props.variant='default']
 * @param {'brand'|'amber'|'coral'|'info'|'quiet'|'inverse'|'success'|'warning'|'error'} [props.tone] - Tinted surface.
 * @param {'none'|'sm'|'md'|'lg'} [props.padding='md']
 * @param {'brand'|'amber'|'coral'|'success'|'error'|'info'|'ink'} [props.accent] - Adds the §5.2 left accent bar.
 * @param {boolean} [props.earned] - Achievement card: golden border when earned, muted when locked.
 * @param {Function} [props.onClick] - Makes the card an accessible button.
 * @param {string} [props.className]
 */
const Card = React.forwardRef(
  ({ children, variant = 'default', tone, padding = 'md', accent, earned, className = '', onClick, ...rest }, ref) => {
    const isInteractive = variant === 'interactive' || !!onClick;

    const motionProps = isInteractive
      ? {
          whileHover: { y: -2 },
          whileTap: { scale: 0.99 },
          transition: { duration: 0.2, ease: transitionEase },
        }
      : {};

    /* A div with role="button" must be keyboard-operable, or it is worse than a
       link for anyone not using a mouse. */
    const semanticProps = isInteractive
      ? {
          role: 'button',
          tabIndex: 0,
          onClick,
          onKeyDown: (e) => {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
              if (onClick) {
                e.preventDefault();
                onClick(e);
              }
            }
          },
        }
      : {};

    return (
      <motion.div
        ref={ref}
        className={[
          'font-body transition-all duration-200',
          surfaceClasses({ variant, tone, earned }),
          paddingClasses[padding],
          accent
            ? `relative overflow-hidden before:absolute before:inset-y-0 before:left-0 before:w-1 before:content-[''] ${accentClasses[accent] || accentClasses.brand}`
            : '',
          isInteractive ? 'hover:shadow-card-hover' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...motionProps}
        {...semanticProps}
        {...rest}
      >
        {children}
      </motion.div>
    );
  },
);

Card.displayName = 'Card';

export default Card;
