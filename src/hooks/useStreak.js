/**
 * @module useStreak
 * @description Tracks daily learning streaks.
 *
 * A streak increments when the user is active on consecutive calendar days.
 * If they miss a day the current streak resets to zero, but the longest-ever
 * streak is preserved for bragging rights.
 *
 * Call `recordActivity()` whenever the user finishes a lesson or review session.
 */

import { useCallback, useMemo } from 'react';
import useLocalStorage from './useLocalStorage';

/**
 * Get today's date as a YYYY-MM-DD string (local time zone).
 * @returns {string}
 */
const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/**
 * Get yesterday's date as a YYYY-MM-DD string (local time zone).
 * @returns {string}
 */
const yesterdayStr = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/**
 * Hook return type.
 * @typedef {Object} StreakHook
 * @property {number}  currentStreak  — consecutive-day streak
 * @property {number}  longestStreak  — all-time record
 * @property {string|null} lastActiveDate — YYYY-MM-DD of last activity
 * @property {Function} recordActivity — call to log today's activity
 * @property {boolean} isActiveToday  — whether the user has been active today
 */

/**
 * Daily streak tracking hook.
 *
 * @returns {StreakHook}
 */
const useStreak = () => {
  const [streakData, setStreakData] = useLocalStorage('streak', {
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: null,
  });

  /** Whether the user has already recorded activity today. */
  const isActiveToday = useMemo(
    () => streakData.lastActiveDate === todayStr(),
    [streakData.lastActiveDate]
  );

  /** Whether the streak is still active (active today or active yesterday). */
  const isStreakActive = useMemo(() => {
    if (!streakData.lastActiveDate) return false;
    const today = todayStr();
    const yesterday = yesterdayStr();
    return streakData.lastActiveDate === today || streakData.lastActiveDate === yesterday;
  }, [streakData.lastActiveDate]);

  /** Effective streak: if user missed more than 1 day, streak decays to 0. */
  const effectiveCurrentStreak = isStreakActive ? streakData.currentStreak : 0;

  /**
   * Record that the user was active today.
   *
   * - If already active today → no-op.
   * - If last active yesterday → increment streak.
   * - Otherwise → reset streak to 1.
   */
  const recordActivity = useCallback(() => {
    const today = todayStr();

    setStreakData((prev) => {
      // Already recorded today — nothing to do
      if (prev.lastActiveDate === today) return prev;

      let newStreak;

      if (prev.lastActiveDate === yesterdayStr()) {
        // Consecutive day — extend the streak
        newStreak = prev.currentStreak + 1;
      } else {
        // Missed at least one day — start fresh
        newStreak = 1;
      }

      const newLongest = Math.max(prev.longestStreak, newStreak);

      return {
        currentStreak: newStreak,
        longestStreak: newLongest,
        lastActiveDate: today,
      };
    });
  }, [setStreakData]);

  return {
    currentStreak: effectiveCurrentStreak,
    longestStreak: streakData.longestStreak,
    lastActiveDate: streakData.lastActiveDate,
    recordActivity,
    isActiveToday,
  };
};

export default useStreak;
