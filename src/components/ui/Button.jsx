/**
 * @file Button.jsx
 * @description The single button primitive for LinguaFlow, implementing spec §5.1
 * (variants, three sizes, six states) exactly.
 *
 * Design notes:
 * - Per-size radius is required by §5.1 (8 / 10 / 12px). Earlier builds used one
 *   12px radius for every size.
 * - `shape="pill"` is the sanctioned marketing/hero shape. It is an explicit
 *   prop rather than an ad-hoc `rounded-pill` class at the call site, so the
 *   primary action cannot end up 12px on one page and 9999px on another.
 * - Focus is NOT styled here. `src/styles/index.css` owns one global
 *   `:focus-visible` treatment; per-component rings produced two competing
 *   indicators.
 * - Disabled uses `opacity-50` per §5.1 rather than a pale solid fill, so it
 *   reads as "this control is off" instead of "this is a different button".
 *
 * @example
 * <Button variant="primary" size="md" icon={Zap} loading={isSaving}>Start Lesson</Button>
 * <Button shape="pill" size="lg">Start Learning for Free</Button>
 * <Button variant="ghost" size="lg" iconOnly icon={X} aria-label="Exit lesson" />
 * <ButtonLink to="/onboarding" size="lg" shape="pill">Begin</ButtonLink>
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { transitionEase } from '../../utils/motion';

/*
 * Colour tiers are chosen by measured contrast, not by preference:
 * white on brand-600 is 3.77:1, which fails AA for the 16px semibold label these
 * buttons actually carry. brand-700 gives 5.48:1. So the interactive fill sits on
 * the -700 tier while brand-600 stays the accent for icons, borders and large type.
 */
const variantClasses = {
  primary: [
    'bg-brand-700 text-white',
    'hover:bg-brand-800',
    'active:bg-brand-900',
  ].join(' '),
  /** On-emerald CTA used inside brand-coloured hero cards. */
  inverse: [
    'bg-surface-card text-brand-700',
    'hover:bg-brand-50',
    'active:bg-brand-100',
  ].join(' '),
  secondary: [
    'border border-brand-700 text-brand-700 bg-transparent',
    'hover:bg-brand-50',
    'active:bg-brand-100',
  ].join(' '),
  /**
   * Neutral outlined action — the quieter partner to `primary`, for the choice
   * that is NOT the affirmative one ("Needs Practice" beside "Looks Great",
   * "Not now" beside "Continue"). `secondary` is brand-outlined and therefore
   * reads as affirmative, so call sites that need a neutral outline previously
   * hand-wrote `border-ink-300 text-ink-700 …` at each one; this is that recipe,
   * in one place.
   */
  outline: [
    'border border-ink-300 text-ink-700 bg-surface-card',
    'hover:bg-ink-100 hover:text-ink-900',
    'active:bg-ink-200',
  ].join(' '),
  /**
   * Selected-but-not-affirmative state: a brand tint behind a brand-700 glyph
   * (5.21:1 on brand-50). Sound-on, active filter, and "this tile is the one you
   * are looking at" all need this, and until now each call site wrote its own
   * `bg-brand-50 text-brand-700 hover:bg-brand-100`, which is how the app grew
   * three slightly different tints. The border keeps the tile readable on a
   * brand-50 card background, where a tint alone disappears.
   */
  tint: [
    'border border-brand-200 bg-brand-50 text-brand-700',
    'hover:bg-brand-100',
    'active:bg-brand-100',
  ].join(' '),
  ghost: [
    'text-ink-500 bg-transparent',
    'hover:bg-ink-100 hover:text-ink-900',
    'active:bg-ink-200',
  ].join(' '),
  danger: [
    'bg-error text-white',
    'hover:bg-error-strong',
    'active:bg-error-strong',
  ].join(' '),
};

/* §5.1 disabled: opacity 0.5 and no hover response. pointer-events-none is the
   only reliable way to suppress :hover on a disabled control across browsers. */
const disabledClasses = 'disabled:opacity-50 disabled:pointer-events-none';

/* §5.1 sizing: height / horizontal padding / font size / radius.
   Font sizes use the type scale tokens, not raw text-sm/text-lg, so a button
   label can never drift from the rest of the scale. */
const sizeClasses = {
  sm: 'h-8 px-3 text-body-sm leading-none rounded-button-sm gap-1.5',
  md: 'h-10 px-4 text-body-md leading-none rounded-button-md gap-2',
  lg: 'h-12 px-6 text-body-lg leading-none rounded-button-lg gap-2.5',
};

const shapeClasses = {
  default: '',
  pill: '!rounded-pill',
};

/* Icon-only controls (back, close, audio, undo) are a square whose side is the
   size's height, so `iconOnly` replaces padding rather than adding to it.
   Without this prop every page invented its own 44px box — five copies of
   `inline-flex items-center justify-center h-11 w-11 rounded-pill` had
   accumulated, each drifting a little from the others.
   `!px-0` is required because the size presets carry horizontal padding, and
   two padding utilities in one class attribute resolve by stylesheet order, not
   by which one came last. */
const iconOnlyClasses = 'aspect-square !px-0 !gap-0';

const iconSizeMap = { sm: 14, md: 18, lg: 20 };

/** Compose the shared class list so Button and ButtonLink stay visually identical. */
export function buttonClasses({
  variant = 'primary',
  size = 'md',
  shape = 'default',
  fullWidth = false,
  iconOnly = false,
  className = '',
}) {
  // A typo'd variant used to fall through to `primary` silently, which is how a
  // neutral action ends up looking like the affirmative one. Say so in dev.
  if (import.meta.env?.DEV && variant && !variantClasses[variant]) {
    console.warn(`Button variant "${variant}" is not a kit variant; rendering as primary.`);
  }

  return [
    'inline-flex items-center justify-center font-body font-semibold select-none',
    'transition-colors duration-200',
    variantClasses[variant] || variantClasses.primary,
    disabledClasses,
    sizeClasses[size] || sizeClasses.md,
    shapeClasses[shape] || '',
    iconOnly ? iconOnlyClasses : '',
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');
}

/**
 * @param {object} props
 * @param {'primary'|'inverse'|'secondary'|'outline'|'tint'|'ghost'|'danger'} [props.variant='primary']
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {'default'|'pill'} [props.shape='default']
 * @param {React.ReactNode} props.children
 * @param {import('lucide-react').LucideIcon} [props.icon]
 * @param {'left'|'right'} [props.iconPosition='left']
 * @param {boolean} [props.loading=false]
 * @param {boolean} [props.iconOnly=false] - Square button with no label. When true,
 *   `aria-label` is mandatory: the icon is decorative, so without a label the control
 *   has no accessible name at all (WCAG 4.1.2).
 * @param {boolean} [props.disabled=false]
 * @param {boolean} [props.fullWidth=false]
 */
const Button = React.forwardRef(
  (
    {
      variant = 'primary',
      size = 'md',
      shape = 'default',
      children,
      icon: Icon,
      iconPosition = 'left',
      loading = false,
      iconOnly = false,
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

    if (iconOnly && !rest['aria-label'] && !children) {
      // Not a render-time crash: a nameless button is still usable by mouse, but
      // it is invisible to a screen reader, so say so loudly in development.
      if (import.meta.env?.DEV) {
        console.warn('Button iconOnly requires an aria-label (WCAG 4.1.2).');
      }
    }

    const renderIcon = () => {
      if (loading) return <Loader2 size={iconSize} className="animate-spin" aria-hidden="true" />;
      if (Icon) return <Icon size={iconSize} aria-hidden="true" />;
      return null;
    };

    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={isDisabled}
        onClick={isDisabled ? undefined : onClick}
        /* §5.1: hover lifts 1px, active presses down and scales to 0.98. */
        whileHover={isDisabled ? undefined : { y: -1 }}
        whileTap={isDisabled ? undefined : { y: 0, scale: 0.98 }}
        transition={{ duration: 0.2, ease: transitionEase }}
        className={buttonClasses({ variant, size, shape, fullWidth, iconOnly, className })}
        aria-disabled={isDisabled || undefined}
        aria-busy={loading || undefined}
        {...rest}
      >
        {iconPosition === 'left' && renderIcon()}
        {iconOnly ? null : children != null && <span>{children}</span>}
        {iconPosition === 'right' && renderIcon()}
      </motion.button>
    );
  },
);

Button.displayName = 'Button';

/**
 * Router link styled as a button, so marketing and navigation CTAs cannot drift
 * from the Button primitive.
 */
const ButtonLink = React.forwardRef(
  ({ variant = 'primary', size = 'md', shape = 'default', fullWidth = false, className = '', children, icon: Icon, iconPosition = 'left', ...rest }, ref) => {
    const iconSize = iconSizeMap[size];
    return (
      <Link
        ref={ref}
        className={buttonClasses({ variant, size, shape, fullWidth, className })}
        {...rest}
      >
        {iconPosition === 'left' && Icon && <Icon size={iconSize} aria-hidden="true" />}
        {children}
        {iconPosition === 'right' && Icon && <Icon size={iconSize} aria-hidden="true" />}
      </Link>
    );
  },
);

ButtonLink.displayName = 'ButtonLink';

export { Button, ButtonLink };
export default Button;
