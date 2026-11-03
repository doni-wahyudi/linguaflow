/**
 * @file XPProgress.jsx
 * @description Displays user's current level, XP progress to the next level,
 * and an animated progress bar. Expects XP utility functions to be available.
 *
 * @example
 * <XPProgress totalXP={342} />
 */

import React from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { ProgressBar } from '../ui';

/**
 * Level definitions based on cumulative XP thresholds.
 * Each entry: [minXP, emoji, name, xpToNext].
 */
const LEVELS = [
  { min: 0, emoji: '🌱', name: 'Seed', next: 100 },
  { min: 100, emoji: '🌿', name: 'Sprout', next: 250 },
  { min: 350, emoji: '🪴', name: 'Sapling', next: 500 },
  { min: 850, emoji: '🌳', name: 'Tree', next: 1000 },
  { min: 1850, emoji: '🌲', name: 'Evergreen', next: 2000 },
  { min: 3850, emoji: '⭐', name: 'Star', next: 3000 },
  { min: 6850, emoji: '🌟', name: 'Supernova', next: 5000 },
  { min: 11850, emoji: '👑', name: 'Master', next: Infinity },
];

/**
 * Get the user's current level info from total XP.
 * @param {number} totalXP
 * @returns {{ emoji: string, name: string, currentXP: number, neededXP: number, level: number }}
 */
function getLevelInfo(totalXP) {
  let level = 0;
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (totalXP >= LEVELS[i].min) {
      level = i;
      break;
    }
  }
  const current = LEVELS[level];
  const xpInLevel = totalXP - current.min;
  const neededXP = current.next === Infinity ? 1 : current.next;

  return {
    emoji: current.emoji,
    name: current.name,
    currentXP: Math.min(xpInLevel, neededXP),
    neededXP,
    level: level + 1,
  };
}

/**
 * XP and level progress display with animated count-up.
 *
 * @param {object} props
 * @param {number} props.totalXP - Total XP earned by the user.
 * @param {string} [props.className] - Additional CSS classes.
 * @returns {JSX.Element}
 */
const XPProgress = ({ totalXP = 0, className = '' }) => {
  const { emoji, name, currentXP, neededXP, level } = getLevelInfo(totalXP);

  // Animated XP count
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v) => Math.round(v));
  const [displayXP, setDisplayXP] = React.useState(0);

  React.useEffect(() => {
    const controls = animate(motionValue, currentXP, {
      duration: 1,
      ease: [0.16, 1, 0.3, 1],
    });
    const unsubscribe = rounded.on('change', (v) => setDisplayXP(v));
    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [currentXP, motionValue, rounded]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
      className={`flex flex-col gap-3 ${className}`}
    >
      {/* Level info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl" role="img" aria-label={name}>
            {emoji}
          </span>
          <div>
            <p className="text-body-sm font-semibold text-ink-700">
              Level {level} — {name}
            </p>
          </div>
        </div>
        <span className="text-body-sm font-semibold text-ink-500 tabular-nums">
          {displayXP} / {neededXP === Infinity ? '∞' : neededXP.toLocaleString()} XP
        </span>
      </div>

      {/* Progress bar */}
      <ProgressBar
        value={currentXP}
        max={neededXP === Infinity ? currentXP || 1 : neededXP}
        size="md"
        color="brand"
      />
    </motion.div>
  );
};

XPProgress.displayName = 'XPProgress';

export default XPProgress;
