/**
 * @module xp
 * @description XP calculation utilities and leveling system for LinguaFlow.
 *
 * The XP economy is intentionally simple:
 *  • Each correct answer earns a flat amount.
 *  • Active streaks grant a per-correct bonus.
 *  • Finishing a lesson awards a completion bonus.
 *  • A perfect score earns an additional bonus on top of everything else.
 *
 * Levels are defined as named tiers with XP thresholds. The highest tier
 * has no upper bound so players can keep accumulating XP forever.
 */

// ─── XP reward constants ────────────────────────────────────────────────────

/** XP awarded for each correct answer in an exercise. */
export const XP_PER_CORRECT = 10;

/** Extra XP per correct answer when the user has an active streak. */
export const STREAK_BONUS = 5;

/** One-time bonus for completing an entire lesson. */
export const LESSON_COMPLETE_BONUS = 50;

/** Extra bonus when the user gets every exercise right (100 % accuracy). */
export const PERFECT_SCORE_BONUS = 25;

// ─── Level definitions ──────────────────────────────────────────────────────

/**
 * @typedef {Object} Level
 * @property {string} name  — display name
 * @property {number} minXP — inclusive lower bound
 * @property {number} maxXP — exclusive upper bound (Infinity for the last tier)
 * @property {string} icon  — semantic icon key, resolved by components/brand/icons.jsx
 */

/** Ordered list of level tiers. */
export const LEVELS = [
  { name: 'Seedling', minXP: 0, maxXP: 100, icon: 'seedling' },
  { name: 'Sprout', minXP: 100, maxXP: 500, icon: 'sprout' },
  { name: 'Sapling', minXP: 500, maxXP: 1500, icon: 'sapling' },
  { name: 'Tree', minXP: 1500, maxXP: 5000, icon: 'tree' },
  { name: 'Forest', minXP: 5000, maxXP: Infinity, icon: 'forest' },
];

// ─── Public helpers ─────────────────────────────────────────────────────────

/**
 * Calculate XP earned for a single lesson attempt.
 *
 * @param {number} correct   — number of correct answers
 * @param {number} total     — total number of exercises
 * @param {boolean} hasStreak — whether the user has an active daily streak
 * @returns {number} total XP earned
 */
export const calculateXP = (correct, total, hasStreak = false) => {
  // Base XP: flat rate per correct answer
  let xp = correct * XP_PER_CORRECT;

  // Streak multiplier: extra per correct answer
  if (hasStreak) {
    xp += correct * STREAK_BONUS;
  }

  // Lesson-completion bonus (at least one correct answer required)
  if (total > 0 && correct > 0) {
    xp += LESSON_COMPLETE_BONUS;
  }

  // Perfect-score bonus
  if (total > 0 && correct === total) {
    xp += PERFECT_SCORE_BONUS;
  }

  return xp;
};

/**
 * Determine the user's current level based on total XP.
 *
 * @param {number} totalXP — lifetime accumulated XP
 * @returns {Level} the matching level object
 */
export const getLevel = (totalXP) => {
  // Walk the tiers from highest to lowest so we match the first tier
  // whose minXP the user has reached.
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (totalXP >= LEVELS[i].minXP) {
      return LEVELS[i];
    }
  }
  // Fallback (shouldn't happen because first tier starts at 0)
  return LEVELS[0];
};

/**
 * Get the next level the user can progress toward.
 *
 * @param {number} totalXP — lifetime accumulated XP
 * @returns {Level|null} the next tier, or null if already at max
 */
export const getNextLevel = (totalXP) => {
  const currentIndex = LEVELS.findIndex(
    (l) => totalXP >= l.minXP && totalXP < l.maxXP
  );

  // Already at the highest tier
  if (currentIndex === -1 || currentIndex === LEVELS.length - 1) return null;

  return LEVELS[currentIndex + 1];
};

/**
 * Calculate progress through the current level as a fraction 0 → 1.
 *
 * @param {number} totalXP — lifetime accumulated XP
 * @returns {number} progress ratio (0 = just entered the level, 1 = about to level up)
 */
export const getLevelProgress = (totalXP) => {
  const level = getLevel(totalXP);

  // Top tier has no upper bound — clamp at 1
  if (level.maxXP === Infinity) return 1;

  const range = level.maxXP - level.minXP;
  if (range <= 0) return 1;

  return Math.min((totalXP - level.minXP) / range, 1);
};
