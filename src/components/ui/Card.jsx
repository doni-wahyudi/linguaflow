/**
 * @file Card.jsx
 * @description A flexible card surface component with multiple visual variants,
 * padding presets, and optional interactive hover animations powered by Framer Motion.
 *
 * @example
 * <Card variant="interactive" padding="md" onClick={handleClick}>
 *   <h3>Lesson 1</h3>
 * </Card>
 */

import React from 'react';
import { motion } from 'framer-motion';

const transitionEase = [0.16, 1, 0.3, 1];

const variantClasses = {
  default: 'bg-surface-card rounded-card shadow-soft-sm border border-ink-200/50',
  elevated: 'bg-surface-card rounded-card shadow-soft-md border border-ink-200/50',
  interactive: [
    'bg-surface-card rounded-card shadow-soft-sm border border-ink-200/50',
    'cursor-pointer',
  ].join(' '),
  outlined: 'bg-surface-card rounded-card border-2 border-ink-200',
};

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

/**
 * Card surface component.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Card content.
 * @param {'default'|'elevated'|'interactive'|'outlined'} [props.variant='default'] - Visual variant.
 * @param {'none'|'sm'|'md'|'lg'} [props.padding='md'] - Padding preset.
 * @param {string} [props.className] - Additional CSS classes.
 * @param {Function} [props.onClick] - Click handler (adds interactive semantics).
 * @param {React.Ref} ref - Forwarded ref.
 * @returns {JSX.Element}
 */
const Card = React.forwardRef(
  (
    {
      children,
      variant = 'default',
      padding = 'md',
      className = '',
      onClick,
      ...rest
    },
    ref,
  ) => {
    const isInteractive = variant === 'interactive' || !!onClick;

    const motionProps = isInteractive
      ? {
          whileHover: { y: -2, boxShadow: '0 4px 8px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.08)' },
          whileTap: { scale: 0.99 },
          transition: { duration: 0.25, ease: transitionEase },
        }
      : {};

    const semanticProps = isInteractive
      ? {
          role: 'button',
          tabIndex: 0,
          onClick,
          onKeyDown: (e) => {
            if ((e.key === 'Enter' || e.key === ' ') && onClick) {
              e.preventDefault();
              onClick(e);
            }
          },
          'aria-label': rest['aria-label'] || undefined,
        }
      : {};

    return (
      <motion.div
        ref={ref}
        className={[
          'font-body transition-shadow duration-200',
          variantClasses[variant],
          paddingClasses[padding],
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
