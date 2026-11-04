/**
 * @file XPProgress.jsx
 * @description Level + XP meter for the dashboard surfaces.
 *
 * Rewritten against `src/utils/xp.js`. The previous draft carried its own
 * eight-tier emoji level table (Seed / Sprout / Sapling / Tree / Evergreen /
 * Star / Supernova / Master) while the rest of the app uses the five-tier
 * `LEVELS` export with semantic icon keys. Two level tables meant the same
 * account could read "Level 3 — Sapling" here and "Sapling → Tree" in the
 * Profile page only by coincidence, and the emoji tier marks rendered as
 * tofu on Windows and older Android.
 *
 * This component now owns presentation only; `utils/xp.js` owns the economy.
 *
 * @example
 * <XPProgress totalXP={342} />
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { ProgressBar } from '../ui';
import { SemanticIcon } from '../brand';
import { getLevel, getNextLevel, getLevelProgress } from '../../utils/xp';

/**
 * Animated count-up from the previously shown value to the new one.
 *
 * @param {number} target
 * @param {boolean} enabled - Disabled when the user asks for reduced motion,
 *   in which case the value is applied immediately.
 */
function useCountUp(target, enabled) {
  const motionValue = useMotionValue(enabled ? 0 : target);
  const rounded = useTransform(motionValue, (v) => Math.round(v));
  const [display, setDisplay] = useState(() => Math.round(target));
  const previous = useRef(target);

  useEffect(() => {
    if (!enabled) {
      setDisplay(Math.round(target));
      previous.current = target;
      return undefined;
    }
    const controls = animate(motionValue, target, {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    });
    const unsubscribe = rounded.on('change', setDisplay);
    previous.current = target;
    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [target, enabled, motionValue, rounded]);

  return display;
}

/**
 * XP and level progress display.
 *
 * @param {object} props
 * @param {number} props.totalXP - Lifetime accumulated XP.
 * @param {boolean} [props.animate=true] - Count-up and bar animation.
 * @param {string} [props.className] - Additional CSS classes.
 * @returns {JSX.Element}
 */
const XPProgress = ({ totalXP = 0, animate: animateBar = true, className = '' }) => {
  const level = getLevel(totalXP);
  const next = getNextLevel(totalXP);
  const progress = getLevelProgress(totalXP);

  const xpIntoLevel = Math.round(totalXP - level.minXP);
  const xpNeededForLevel = next ? Math.round(next.minXP - level.minXP) : 0;
  const displayXP = useCountUp(xpIntoLevel, animateBar);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
      className={`flex flex-col gap-3 ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {/* Tile instead of a bare glyph: the icon is decoration beside a
              text label, so it stays aria-hidden and the name carries the
              meaning. */}
          <span
            aria-hidden="true"
            className="w-9 h-9 rounded-lg bg-brand-50 border border-brand-200 flex items-center justify-center shrink-0"
          >
            <SemanticIcon name={level.icon} className="w-[18px] h-[18px] text-brand-700" />
          </span>
          <p className="text-body-sm font-semibold text-ink-900">
            {level.name}
            <span className="text-ink-500 font-normal">
              {' · '}
              {next ? `Level up at ${next.minXP.toLocaleString()} XP` : 'Top tier'}
            </span>
          </p>
        </div>

        <span className="text-body-sm font-semibold text-ink-700 tabular-nums shrink-0">
          {displayXP.toLocaleString()}
          {next && (
            <span className="text-ink-500 font-normal">
              {' / '}
              {xpNeededForLevel.toLocaleString()}
            </span>
          )}
          <span className="sr-only"> experience points</span>
        </span>
      </div>

      <ProgressBar
        value={progress * 100}
        max={100}
        size="md"
        color="brand"
        animated={animateBar}
        label={`Progress to ${next ? next.name : level.name}`}
        valueText={next ? `${Math.round(progress * 100)}% to ${next.name}` : 'Maximum level reached'}
      />
    </motion.div>
  );
};

XPProgress.displayName = 'XPProgress';

export default XPProgress;
