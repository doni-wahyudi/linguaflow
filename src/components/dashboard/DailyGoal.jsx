/**
 * @file DailyGoal.jsx
 * @description Circular SVG progress ring showing daily lesson completion.
 * Animates the stroke with Framer Motion and shows a celebration state on completion.
 *
 * @example
 * <DailyGoal completed={2} goal={3} />
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const RADIUS = 50;
const STROKE = 8;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const VIEW_SIZE = (RADIUS + STROKE) * 2;

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
  const clamped = Math.min(completed, goal);
  const progress = goal > 0 ? clamped / goal : 0;
  const offset = CIRCUMFERENCE * (1 - progress);
  const isComplete = completed >= goal;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className={`flex flex-col items-center gap-4 ${className}`}
      role="status"
      aria-label={
        isComplete
          ? 'Daily goal reached!'
          : `${completed} of ${goal} lessons completed today`
      }
    >
      {/* SVG Ring */}
      <div className="relative">
        <svg
          width={VIEW_SIZE}
          height={VIEW_SIZE}
          viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
          className="transform -rotate-90"
          aria-hidden="true"
        >
          {/* Background track */}
          <circle
            cx={RADIUS + STROKE}
            cy={RADIUS + STROKE}
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth={STROKE}
            className="text-ink-100"
          />

          {/* Animated progress arc */}
          <motion.circle
            cx={RADIUS + STROKE}
            cy={RADIUS + STROKE}
            r={RADIUS}
            fill="none"
            stroke="url(#goal-gradient)"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Gradient definition */}
          <defs>
            <linearGradient id="goal-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={isComplete ? '#10B981' : '#059669'} />
              <stop offset="100%" stopColor={isComplete ? '#34D399' : '#10B981'} />
            </linearGradient>
          </defs>
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {isComplete ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.6 }}
            >
              <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center shadow-glow-brand">
                <Check size={24} className="text-brand-600" />
              </div>
            </motion.div>
          ) : (
            <>
              <span className="font-display text-display-sm text-ink-900 leading-none">
                {completed}
              </span>
              <span className="text-body-sm text-ink-500">of {goal}</span>
            </>
          )}
        </div>
      </div>

      {/* Caption */}
      <p className="text-body-sm font-medium text-center text-ink-700">
        {isComplete ? (
          <span className="text-brand-600">Goal reached! 🎉</span>
        ) : (
          `${goal - completed} more lesson${goal - completed !== 1 ? 's' : ''} to go`
        )}
      </p>
    </motion.div>
  );
};

DailyGoal.displayName = 'DailyGoal';

export default DailyGoal;
