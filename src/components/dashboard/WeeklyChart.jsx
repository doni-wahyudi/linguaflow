/**
 * @file WeeklyChart.jsx
 * @description Simple 7-day bar chart showing daily activity. Built with
 * pure divs and Framer Motion stagger animations — no chart library needed.
 *
 * Contrast note (WCAG 2.1 §1.4.11 — graphical objects need 3:1 against their
 * neighbours): a bar chart's bars sit on a light card, and the same structural
 * problem that governs ProgressBar applies here. Measured against `surface-card`
 * (#FFFFFF), brand-300 is 1.52:1, brand-400 1.92:1 and brand-500 2.54:1 — all
 * below the floor. Only from brand-600 (3.77:1) upward does a fill read as a
 * bar, so the series uses brand-600 with brand-800 (7.68:1) reserved for today.
 *
 * Every bar also prints its value, including zeros. That makes the bars an
 * emphasis of the data rather than the only carrier of it, so the ink-200 stub
 * on an empty day is decoration, not an unnamed colour signal.
 *
 * @example
 * <WeeklyChart data={[
 *   { day: 'Mon', value: 30, isToday: false },
 *   { day: 'Tue', value: 45, isToday: false },
 *   { day: 'Wed', value: 20, isToday: true },
 *   // ...
 * ]} />
 */

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const BAR_MAX_HEIGHT = 120; // px

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.15 },
  },
};

const barVariants = {
  hidden: { scaleY: 0, opacity: 0 },
  visible: {
    scaleY: 1,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

/**
 * 7-day activity bar chart.
 *
 * @param {object} props
 * @param {Array<{ day: string, value: number, isToday?: boolean }>} props.data
 *   Array of 7 day entries.
 * @param {string} [props.className] - Additional CSS classes.
 * @returns {JSX.Element}
 */
const WeeklyChart = ({ data = [], className = '' }) => {
  const reduceMotion = useReducedMotion();
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const hasData = data.some((d) => d.value > 0);

  if (!hasData) {
    return (
      <div className={`flex flex-col items-center justify-center py-12 text-center ${className}`}>
        <p className="text-body-md text-ink-700">Complete lessons to see your activity</p>
        <p className="text-body-sm text-ink-500 mt-1">Your weekly chart will appear here</p>
      </div>
    );
  }

  /* The container is a single image to assistive tech, so its label has to carry
     the whole series — per-bar aria-labels on the children are not exposed once
     an ancestor claims role="img". The series counts lessons per day, matching
     the live Dashboard chart. */
  const summary = `Lessons completed per day over the last 7 days: ${data
    .map((d) => `${d.day} ${d.value}`)
    .join(', ')}`;

  return (
    <motion.div
      variants={containerVariants}
      initial={reduceMotion ? 'visible' : 'hidden'}
      animate="visible"
      className={`flex items-end justify-between gap-2 sm:gap-3 ${className}`}
      role="img"
      aria-label={summary}
    >
      {data.map((entry, i) => {
        const heightPercent = (entry.value / maxValue) * 100;
        const barHeight = Math.max((heightPercent / 100) * BAR_MAX_HEIGHT, 4);

        return (
          <div key={entry.day || i} className="flex flex-col items-center gap-2 flex-1 min-w-0">
            {/* Value label — always present, including for 0 */}
            <span className="text-caption text-ink-700 tabular-nums">{entry.value}</span>

            {/* Bar */}
            <motion.div
              variants={barVariants}
              aria-hidden="true"
              className={[
                'w-full rounded-t-lg origin-bottom',
                entry.isToday ? 'bg-brand-800' : entry.value > 0 ? 'bg-brand-600' : 'bg-ink-200',
              ].join(' ')}
              style={{ height: barHeight, minHeight: 4 }}
            />

            {/* Day label */}
            <span
              className={`text-caption ${
                entry.isToday ? 'text-brand-700 font-bold' : 'text-ink-500'
              }`}
            >
              {entry.day}
              {entry.isToday && <span className="sr-only"> (today)</span>}
            </span>
          </div>
        );
      })}
    </motion.div>
  );
};

WeeklyChart.displayName = 'WeeklyChart';

export default WeeklyChart;
