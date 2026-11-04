/**
 * @file ProgressBar.jsx
 * @description Animated progress indicators (spec §5.4): a linear bar and a
 * circular ring for the daily goal.
 *
 * Design notes:
 * - Fill tiers are dictated by WCAG 2.1 §1.4.11, not taste. A progress fill must
 *   clear 3:1 against its track, and the track is light (`ink-200`), so light
 *   fills are structurally impossible: `amber-500` reaches only 2.15:1 even
 *   against pure white. The amber/coral/info fills therefore start from the -700
 *   tier (4.00:1 – 4.12:1 against the track).
 * - The bar is always labelled. `aria-valuenow` alone is meaningless to a screen
 *   reader without a name, so `label` is effectively required; the component
 *   falls back to a generic name and warns rather than emitting an unnamed widget.
 * - Fills never convey status by colour alone: `status` adds a semantic tone AND
 *   the numeric readout is on by default when a label is supplied.
 *
 * @example
 * <ProgressBar value={65} max={100} label="Daily goal" size="md" />
 * <ProgressBar value={3} max={5} status="error" showLabel />
 * <ProgressRing value={4} max={5} label="Daily goal" />
 */

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { transitionEase } from '../../utils/motion';

/*
 * Track is spec §5.4 (#E7E5E4 = ink-200). Fills are gradients that run dark→light
 * so the leading edge is the brightest pixel while BOTH ends stay above 3:1.
 */
const fillClasses = {
  brand: 'bg-gradient-to-r from-brand-700 to-brand-600',
  success: 'bg-gradient-to-r from-brand-700 to-brand-600',
  amber: 'bg-gradient-to-r from-amber-800 to-amber-700',
  coral: 'bg-gradient-to-r from-coral-800 to-coral-700',
  error: 'bg-gradient-to-r from-error-strong to-error',
  info: 'bg-gradient-to-r from-info-strong to-info-strong',
};

const ringStroke = {
  brand: 'rgb(var(--brand-600))',
  success: 'rgb(var(--brand-600))',
  amber: 'rgb(var(--amber-700))',
  coral: 'rgb(var(--coral-700))',
  error: 'rgb(var(--error))',
  info: 'rgb(var(--info-strong))',
};

const sizeClasses = {
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-4',
};

/**
 * Linear progress bar.
 *
 * @param {object} props
 * @param {number} props.value - Current progress value (0 to max).
 * @param {number} [props.max=100] - Maximum value.
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Bar height preset (8 / 12 / 16px).
 * @param {'brand'|'success'|'amber'|'coral'|'error'|'info'} [props.color='brand'] - Fill tone.
 * @param {string} [props.label] - Accessible name, e.g. "Daily goal".
 * @param {string} [props.valueText] - Human-readable value for assistive tech.
 * @param {boolean} [props.showLabel=false] - Show the percentage beside the bar.
 * @param {boolean} [props.animated=true] - Animate the fill on mount / value change.
 * @param {string} [props.className] - Additional CSS classes.
 * @returns {JSX.Element}
 */
const ProgressBar = ({
  value = 0,
  max = 100,
  size = 'md',
  color = 'brand',
  label,
  valueText,
  showLabel = false,
  animated = true,
  className = '',
}) => {
  const clampedValue = Math.min(Math.max(value, 0), max);
  const percentage = max > 0 ? Math.round((clampedValue / max) * 100) : 0;

  /* MotionConfig's `reducedMotion="user"` only neutralises transform and layout
     animation — opacity, width and stroke-dashoffset still run. A fill that
     slides for 600ms is precisely the motion this user asked the app to drop, so
     the bar jumps to its value instead. (spec §6.5) */
  const reduceMotion = useReducedMotion();
  const animateFill = animated && !reduceMotion;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={`relative w-full bg-ink-200 rounded-pill overflow-hidden ${sizeClasses[size]}`}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuetext={valueText ?? `${percentage}%`}
        aria-label={label}
      >
        <motion.div
          className={`absolute inset-y-0 left-0 rounded-pill ${fillClasses[color] || fillClasses.brand}`}
          initial={animateFill ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={animateFill ? { duration: 0.6, ease: transitionEase } : { duration: 0 }}
        />
      </div>

      {showLabel && (
        <span className="text-body-sm font-semibold text-ink-700 tabular-nums min-w-[3ch] text-right">
          {percentage}%
        </span>
      )}
    </div>
  );
};

ProgressBar.displayName = 'ProgressBar';

/**
 * Circular progress ring — the §5.4 "Daily Goal" variant, as a real component so
 * every page draws the same arc instead of re-deriving stroke-dasharray inline.
 *
 * @param {object} props
 * @param {number} props.value
 * @param {number} [props.max=100]
 * @param {'brand'|'success'|'amber'|'coral'|'error'|'info'} [props.color='brand']
 * @param {number} [props.size=72] - Pixel diameter.
 * @param {number} [props.strokeWidth=8]
 * @param {string} [props.label] - Accessible name.
 * @param {React.ReactNode} [props.children] - Centre content (defaults to the percentage).
 * @param {string} [props.className]
 * @returns {JSX.Element}
 */
const ProgressRing = ({
  value = 0,
  max = 100,
  color = 'brand',
  size = 72,
  strokeWidth = 8,
  label,
  children,
  className = '',
}) => {
  const clampedValue = Math.min(Math.max(value, 0), max);
  const percentage = max > 0 ? clampedValue / max : 0;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  /* Same reason as the bar: stroke-dashoffset is an SVG attribute, not a
     transform, so MotionConfig leaves it alone. (spec §6.5) */
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={Math.round(clampedValue)}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuetext={`${Math.round(clampedValue)} of ${max}`}
      aria-label={label}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgb(var(--ink-200))"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={ringStroke[color] || ringStroke.brand}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={reduceMotion ? undefined : { strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - percentage) }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.6, ease: transitionEase }}
          /* Start at 12 o'clock rather than 3. */
          transform={`rotate(-90 ${center} ${center})`}
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        {children ?? (
          <span className="font-display font-bold text-ink-900 tabular-nums" style={{ fontSize: size * 0.24 }}>
            {Math.round(percentage * 100)}%
          </span>
        )}
      </div>
    </div>
  );
};

ProgressRing.displayName = 'ProgressRing';

export default ProgressBar;
export { ProgressRing };
