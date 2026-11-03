/**
 * @file WeeklyChart.jsx
 * @description Simple 7-day bar chart showing daily activity. Built with
 * pure divs and Framer Motion stagger animations — no chart library needed.
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
import { motion } from 'framer-motion';

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
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const hasData = data.some((d) => d.value > 0);

  if (!hasData) {
    return (
      <div
        className={`flex flex-col items-center justify-center py-12 text-center ${className}`}
      >
        <p className="text-body-md text-ink-500">
          Complete lessons to see your activity
        </p>
        <p className="text-body-sm text-ink-400 mt-1">
          Your weekly chart will appear here
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`flex items-end justify-between gap-2 sm:gap-3 ${className}`}
      role="img"
      aria-label="Weekly activity chart"
    >
      {data.map((entry, i) => {
        const heightPercent = (entry.value / maxValue) * 100;
        const barHeight = Math.max((heightPercent / 100) * BAR_MAX_HEIGHT, 4);

        return (
          <div key={i} className="flex flex-col items-center gap-2 flex-1 min-w-0">
            {/* Value label */}
            <span className="text-label text-ink-500 tabular-nums">
              {entry.value > 0 ? entry.value : ''}
            </span>

            {/* Bar */}
            <motion.div
              variants={barVariants}
              className={[
                'w-full rounded-t-lg origin-bottom',
                entry.isToday
                  ? 'bg-brand-600'
                  : entry.value > 0
                    ? 'bg-brand-200'
                    : 'bg-ink-100',
              ].join(' ')}
              style={{ height: barHeight, minHeight: 4 }}
              aria-label={`${entry.day}: ${entry.value}`}
            />

            {/* Day label */}
            <span
              className={`text-label ${
                entry.isToday ? 'text-brand-600 font-bold' : 'text-ink-500'
              }`}
            >
              {entry.day}
            </span>
          </div>
        );
      })}
    </motion.div>
  );
};

WeeklyChart.displayName = 'WeeklyChart';

export default WeeklyChart;
