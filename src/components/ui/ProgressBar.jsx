/**
 * @file ProgressBar.jsx
 * @description Animated progress bar with multiple sizes and color themes.
 * Uses Framer Motion to smoothly animate the fill width.
 *
 * @example
 * <ProgressBar value={65} color="brand" size="md" showLabel />
 */

import React from 'react';
import { motion } from 'framer-motion';

const sizeClasses = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

const colorGradients = {
  brand: 'bg-gradient-to-r from-brand-500 to-brand-400',
  amber: 'bg-gradient-to-r from-amber-500 to-amber-400',
  coral: 'bg-gradient-to-r from-coral-500 to-coral-400',
  red: 'bg-gradient-to-r from-red-500 to-red-400',
};

/**
 * Animated progress bar component.
 *
 * @param {object} props
 * @param {number} props.value - Current progress value (0 to max).
 * @param {number} [props.max=100] - Maximum value.
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Bar height preset.
 * @param {'brand'|'amber'|'coral'|'red'} [props.color='brand'] - Fill color theme.
 * @param {boolean} [props.showLabel=false] - Show percentage label.
 * @param {boolean} [props.animated=true] - Animate the fill on mount / value change.
 * @param {string} [props.className] - Additional CSS classes.
 * @returns {JSX.Element}
 */
const ProgressBar = ({
  value = 0,
  max = 100,
  size = 'md',
  color = 'brand',
  showLabel = false,
  animated = true,
  className = '',
}) => {
  const clampedValue = Math.min(Math.max(value, 0), max);
  const percentage = max > 0 ? Math.round((clampedValue / max) * 100) : 0;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={`relative w-full bg-ink-100 rounded-full overflow-hidden ${sizeClasses[size]}`}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={`${percentage}% progress`}
      >
        <motion.div
          className={`absolute inset-y-0 left-0 rounded-full ${colorGradients[color]}`}
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={
            animated
              ? { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
              : { duration: 0 }
          }
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

export default ProgressBar;
