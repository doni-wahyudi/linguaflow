/**
 * @file DailyGoal.jsx
 * @description Daily lesson-goal ring with its caption.
 *
 * Rewritten on top of `ProgressRing` from the ui kit. The previous draft
 * hand-rolled the same arc — radius, stroke, dasharray, `-rotate-90` — and
 * painted it with hex outside the token set (`#059669`, `#10B981`, `#34D399`),
 * the emerald trio the design system deliberately replaced with the `brand` /
 * `success` tiers. It also identified its gradient by the global SVG id
 * `goal-gradient`, so two rings on one page resolved `url(#goal-gradient)`
 * against whichever definition the DOM happened to find first.
 *
 * The completion caption used `text-brand-600` at `text-body-sm`, which
 * measures 3.60:1 against the page surface — under the 4.5:1 AA floor for
 * small text — so it now uses the -700 tier, and the 🎉 glyph is replaced by a
 * Check icon (see the note on emoji in src/components/brand/Flag.jsx).
 *
 * @example
 * <DailyGoal completed={2} goal={3} />
 */

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Check } from 'lucide-react';
import { ProgressRing } from '../ui/ProgressBar';

/**
 * Circular daily goal progress indicator.
 *
 * @param {object} props
 * @param {number} props.completed - Lessons/practices completed today.
 * @param {number} props.goal - Daily goal target.
 * @param {string} [props.className] - Additional CSS classes.
 * @returns {JSX.Element}
 */
const DailyGoal = ({ completed = 0, goal = 3, className = '' }) => {
  const reduceMotion = useReducedMotion();
  const clamped = Math.min(completed, goal);
  const remaining = Math.max(goal - completed, 0);
  const isComplete = completed >= goal;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        reduceMotion ? { duration: 0 } : { duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }
      }
      className={`flex flex-col items-center gap-4 ${className}`}
    >
      <ProgressRing
        value={clamped}
        max={goal}
        size={108}
        strokeWidth={9}
        color={isComplete ? 'success' : 'brand'}
        label="Daily lesson goal"
        valueText={
          isComplete ? 'Daily goal reached' : `${clamped} of ${goal} lessons completed today`
        }
      >
        {isComplete ? (
          <motion.span
            initial={reduceMotion ? false : { scale: 0 }}
            animate={{ scale: 1 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { type: 'spring', stiffness: 300, damping: 15, delay: 0.35 }
            }
            className="w-12 h-12 rounded-pill bg-brand-50 border border-brand-200 flex items-center justify-center"
          >
            <Check size={24} strokeWidth={3} className="text-brand-700" aria-hidden="true" />
          </motion.span>
        ) : (
          <span className="flex flex-col items-center leading-none">
            <span className="font-display text-display-sm text-ink-900 tabular-nums">
              {clamped}
            </span>
            <span className="text-body-sm text-ink-500 mt-1">of {goal}</span>
          </span>
        )}
      </ProgressRing>

      <p className="text-body-sm font-semibold text-center">
        {isComplete ? (
          <span className="inline-flex items-center gap-1.5 text-brand-700">
            <Check size={15} strokeWidth={3} aria-hidden="true" />
            Goal reached
          </span>
        ) : (
          <span className="text-ink-700">
            {remaining} more lesson{remaining !== 1 ? 's' : ''} to go
          </span>
        )}
      </p>
    </motion.div>
  );
};

DailyGoal.displayName = 'DailyGoal';

export default DailyGoal;
