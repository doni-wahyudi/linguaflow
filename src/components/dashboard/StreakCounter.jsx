/**
 * @file StreakCounter.jsx
 * @description Displays the user's current streak with animated fire effects.
 * Compact variant for the Navbar, full variant for the Dashboard with count-up.
 *
 * Fixes over the previous draft:
 * - The "hot" flame looped `repeat: Infinity`, and a CSS `prefers-reduced-motion`
 *   media query cannot stop a JS-driven Framer Motion animation. The loop is now
 *   gated on `useReducedMotion()`.
 * - The fire colours were `amber-500` / `coral-500` sitting on their own `-50`
 *   tints: 2.07:1 and 2.64:1, which miss even the 3:1 bar for non-text UI. Both
 *   icons now come from the -700 tier.
 * - `aria-label` on a plain `<div>` is not reliably exposed, and the visible
 *   number carried no unit for screen readers. It is now a `role="group"` with an
 *   `<span className="sr-only">` spelling out "day streak".
 * - Tinted card borders dropped their `/50` alpha; a `-200` border at half
 *   opacity composites to almost nothing on the cream page.
 *
 * @example
 * <StreakCounter streak={14} variant="full" />
 */

import React from 'react';
import { motion, useMotionValue, useTransform, animate, useReducedMotion } from 'framer-motion';
import { Flame } from 'lucide-react';

/**
 * Animated streak counter with fire icon.
 *
 * @param {object} props
 * @param {number} props.streak - Current streak day count.
 * @param {'compact'|'full'} [props.variant='full'] - Display variant.
 * @param {string} [props.className] - Additional CSS classes.
 * @returns {JSX.Element}
 */
const StreakCounter = ({ streak = 0, variant = 'full', className = '' }) => {
  const reduceMotion = useReducedMotion();
  const isHot = streak >= 7;
  const isDead = streak === 0;

  if (variant === 'compact') {
    return (
      <div
        className={`flex items-center gap-1 text-body-sm font-semibold ${
          isDead ? 'text-ink-500' : 'text-coral-700'
        } ${className}`}
      >
        <Flame
          size={16}
          aria-hidden="true"
          className={isDead ? 'text-ink-300' : 'text-coral-600'}
        />
        <span className="tabular-nums">{streak}</span>
        <span className="sr-only">day streak</span>
      </div>
    );
  }

  // Full variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        reduceMotion ? { duration: 0 } : { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
      }
      role="group"
      aria-label={`${streak} day streak`}
      className={[
        'flex flex-col items-center gap-2 p-6 rounded-card border',
        isHot
          ? 'bg-amber-50 shadow-glow-amber border-amber-200'
          : isDead
            ? 'bg-surface-100 border-ink-200'
            : 'bg-coral-50 border-coral-200',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Flame icon — the pulse is an infinite loop, so it is the first thing
          reduced motion has to switch off. */}
      <motion.div
        animate={
          isHot && !reduceMotion
            ? { scale: [1, 1.12, 1], rotate: [0, -5, 5, 0] }
            : undefined
        }
        transition={
          isHot && !reduceMotion
            ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
            : undefined
        }
      >
        <Flame
          size={40}
          aria-hidden="true"
          className={
            isDead ? 'text-ink-400' : isHot ? 'text-amber-700' : 'text-coral-700'
          }
          strokeWidth={2}
        />
      </motion.div>

      {/* Animated number */}
      <AnimatedNumber value={streak} isDead={isDead} isHot={isHot} />

      {/* Caption */}
      <p
        className={`text-body-sm font-semibold ${
          isDead ? 'text-ink-700' : isHot ? 'text-amber-700' : 'text-coral-700'
        }`}
      >
        {isDead ? 'Start your streak today' : 'day streak'}
      </p>
    </motion.div>
  );
};

/**
 * Helper: count-up animated number display.
 */
const AnimatedNumber = ({ value, isDead, isHot }) => {
  const reduceMotion = useReducedMotion();
  const motionValue = useMotionValue(reduceMotion ? value : 0);
  const display = useTransform(motionValue, (v) => Math.round(v));
  const [displayVal, setDisplayVal] = React.useState(value);

  React.useEffect(() => {
    if (reduceMotion) {
      setDisplayVal(value);
      return undefined;
    }
    const controls = animate(motionValue, value, {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    });
    const unsubscribe = display.on('change', (v) => setDisplayVal(v));
    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [value, motionValue, display, reduceMotion]);

  return (
    <span
      className={`font-display text-display-lg tabular-nums ${
        isDead ? 'text-ink-500' : isHot ? 'text-amber-700' : 'text-coral-700'
      }`}
    >
      {displayVal}
    </span>
  );
};

StreakCounter.displayName = 'StreakCounter';

export default StreakCounter;
