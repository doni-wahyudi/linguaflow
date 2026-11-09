/**
 * @module spacedRepetition
 * @description Simplified SM-2 spaced repetition algorithm for LinguaFlow.
 *
 * The SM-2 algorithm adjusts the review interval and an "ease factor" for each
 * word based on how well the learner recalled it (quality 0-5):
 *
 *   0–2  →  Failed recall.  Reset repetitions & interval to 1 day.
 *   3    →  Hard recall.    Advance repetitions but apply a smaller interval growth.
 *   4    →  Good recall.    Standard progression.
 *   5    →  Easy recall.    Standard progression with a boosted ease factor.
 *
 * The ease factor (EF) never drops below 1.3 to prevent intervals from
 * shrinking too aggressively after a bad review.
 *
 * @see https://en.wikipedia.org/wiki/SuperMemo#SM-2_algorithm
 */

/** Minimum allowed ease factor — prevents excessively short intervals. */
const MIN_EASE_FACTOR = 1.3;

/** Default ease factor for new words. */
const DEFAULT_EASE_FACTOR = 2.5;

/**
 * @typedef {Object} WordProgress
 * @property {string}  wordId      — unique word identifier (e.g. "es-w-001")
 * @property {number}  easeFactor  — current ease factor (≥ 1.3)
 * @property {number}  interval    — current review interval in days
 * @property {number}  repetitions — number of consecutive successful reviews
 * @property {string}  nextReview  — ISO 8601 date string of next scheduled review
 * @property {string}  lastReview  — ISO 8601 date string of last review (or null)
 */

/**
 * Create an initial progress entry for a new word.
 *
 * @param {string} wordId — the word's unique identifier
 * @returns {WordProgress} fresh progress record with default values
 */
export const initWordProgress = (wordId) => ({
  wordId,
  easeFactor: DEFAULT_EASE_FACTOR,
  interval: 1, // review again tomorrow
  repetitions: 0,
  nextReview: new Date().toISOString(), // available for review immediately
  lastReview: null,
});

/**
 * Compute the next review schedule for a word based on recall quality.
 *
 * @param {WordProgress} wordProgress — current progress entry
 * @param {number} quality — recall quality grade (0–5)
 * @returns {WordProgress} updated progress (new object — does not mutate input)
 */
export const calculateNextReview = (wordProgress, quality) => {
  // Clamp quality to [0, 5]
  const q = Math.max(0, Math.min(5, Math.round(quality)));

  // Start with a shallow copy so we don't mutate the original
  const updated = { ...wordProgress };
  updated.lastReview = new Date().toISOString();

  if (q < 3) {
    // ── Failed recall ──────────────────────────────────────────────────
    // Reset repetitions and schedule for tomorrow.
    updated.repetitions = 0;
    updated.interval = 1;
  } else {
    // ── Successful recall ──────────────────────────────────────────────
    updated.repetitions += 1;

    if (updated.repetitions === 1) {
      // First successful review: 1-day interval
      updated.interval = 1;
    } else if (updated.repetitions === 2) {
      // Second successful review: 6-day interval
      updated.interval = 6;
    } else {
      // Subsequent reviews: multiply previous interval by the ease factor
      updated.interval = Math.round(updated.interval * updated.easeFactor);
    }
  }

  // ── Update ease factor (applies regardless of pass/fail) ─────────────
  // SM-2 formula: EF' = EF + (0.1 − (5 − q) × (0.08 + (5 − q) × 0.02))
  const efDelta = 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02);
  updated.easeFactor = Math.max(MIN_EASE_FACTOR, updated.easeFactor + efDelta);

  // ── Schedule the next review date ────────────────────────────────────
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + updated.interval);
  updated.nextReview = nextDate.toISOString();

  return updated;
};

/**
 * Filter a collection of word-progress entries to find words due for review.
 *
 * A word is due when its `nextReview` date is today or in the past.
 *
 * @param {WordProgress[]} allWordProgress — all tracked word-progress records
 * @returns {WordProgress[]} subset that is due for review, sorted earliest first
 */
export const getWordsForReview = (allWordProgress) => {
  if (!allWordProgress || !Array.isArray(allWordProgress)) return [];
  const now = new Date();
  // End of current local calendar day (23:59:59.999) so items scheduled for today are due
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  return allWordProgress
    .filter((wp) => {
      if (!wp || !wp.nextReview) return false;
      const reviewDate = new Date(wp.nextReview);
      return reviewDate <= endOfToday;
    })
    .sort((a, b) => new Date(a.nextReview) - new Date(b.nextReview));
};
