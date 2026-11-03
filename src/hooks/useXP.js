/**
 * @module useXP
 * @description Manages lifetime XP accumulation, current level, and progress
 *              toward the next level.
 *
 * Level math is delegated to `utils/xp.js` — this hook simply wraps the
 * persisted totalXP counter and exposes derived level data.
 */

import { useCallback, useMemo } from 'react';
import useLocalStorage from './useLocalStorage';
import {
  getLevel,
  getNextLevel,
  getLevelProgress,
} from '../utils/xp';

/**
 * Hook return type.
 * @typedef {Object} XPHook
 * @property {number}    totalXP       — lifetime accumulated XP
 * @property {Function}  addXP         — add an amount of XP
 * @property {import('../utils/xp').Level} currentLevel — current level object
 * @property {import('../utils/xp').Level|null} nextLevel — next level (null at max)
 * @property {number}    levelProgress — 0-1 fraction through current level
 * @property {number}    xpToNextLevel — XP still needed to level up (0 at max)
 */

/**
 * XP & leveling hook.
 *
 * @returns {XPHook}
 */
const useXP = () => {
  const [totalXP, setTotalXP] = useLocalStorage('total_xp', 0);

  /**
   * Award XP to the user.
   *
   * @param {number} amount — XP to add (must be ≥ 0)
   */
  const addXP = useCallback(
    (amount) => {
      if (amount <= 0) return;
      setTotalXP((prev) => prev + amount);
    },
    [setTotalXP]
  );

  // ── Derived level info (recalculated when totalXP changes) ──────────────

  const currentLevel = useMemo(() => getLevel(totalXP), [totalXP]);
  const nextLevel = useMemo(() => getNextLevel(totalXP), [totalXP]);
  const levelProgress = useMemo(() => getLevelProgress(totalXP), [totalXP]);

  /** How much XP remains until the next tier (0 if already at max). */
  const xpToNextLevel = useMemo(() => {
    if (!nextLevel) return 0;
    return nextLevel.minXP - totalXP;
  }, [totalXP, nextLevel]);

  return {
    totalXP,
    addXP,
    currentLevel,
    nextLevel,
    levelProgress,
    xpToNextLevel,
  };
};

export default useXP;
