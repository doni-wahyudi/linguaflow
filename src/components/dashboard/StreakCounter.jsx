/**
 * @file StreakCounter.jsx
 * @description Displays the user's current streak with animated fire effects.
 * Compact variant for Navbar, full variant for Dashboard with count-up animation.
 *
 * @example
 * <StreakCounter streak={14} variant="full" />
 */

import React from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
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
  const isHot = streak >= 7;
  const isDead = streak === 0;

  if (variant === 'compact') {
    return (
      <div
        className={`flex items-center gap-1 text-body-sm font-semibold ${
          isDead ? 'text-ink-400' : 'text-coral-600'
        } ${className}`}
        aria-label={`${streak} day streak`}
      >
        <Flame size={16} className={isDead ? 'text-ink-300' : 'text-coral-500'} />
        <span className="tabular-nums">{streak}</span>
      </div>
    );
  }

  // Full variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={[
        'flex flex-col items-center gap-2 p-6 rounded-card',
        isHot
          ? 'bg-amber-50 shadow-glow-amber border border-amber-200/50'
          : isDead
            ? 'bg-ink-50 border border-ink-200/50'
            : 'bg-coral-50 border border-coral-200/50',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label={`${streak} day streak`}
    >
      {/* Flame icon with animation */}
      <motion.div
        animate={
          isHot
            ? { scale: [1, 1.12, 1], rotate: [0, -5, 5, 0] }
            : {}
        }
        transition={
          isHot
            ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
            : {}
        }
      >
        <Flame
          size={40}
          className={
            isDead
              ? 'text-ink-300'
              : isHot
                ? 'text-amber-500'
                : 'text-coral-500'
          }
          strokeWidth={2}
        />
      </motion.div>

      {/* Animated number */}
      <AnimatedNumber value={streak} isDead={isDead} isHot={isHot} />

      {/* Caption */}
      <p
        className={`text-body-sm font-medium ${
          isDead ? 'text-ink-500' : isHot ? 'text-amber-700' : 'text-coral-700'
        }`}
      >
        {isDead
          ? 'Start your streak today!'
          : `day streak${isHot ? ' 🔥' : ''}`}
      </p>
    </motion.div>
  );
};

/**
 * Helper: count-up animated number display.
 */
const AnimatedNumber = ({ value, isDead, isHot }) => {
  const motionValue = useMotionValue(0);
  const display = useTransform(motionValue, (v) => Math.round(v));
  const [displayVal, setDisplayVal] = React.useState(0);

  React.useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    });
    const unsubscribe = display.on('change', (v) => setDisplayVal(v));
    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [value, motionValue, display]);

  return (
    <span
      className={`font-display text-display-lg tabular-nums ${
        isDead
          ? 'text-ink-400'
          : isHot
            ? 'text-amber-600'
            : 'text-coral-600'
      }`}
    >
      {displayVal}
    </span>
  );
};

StreakCounter.displayName = 'StreakCounter';

export default StreakCounter;
