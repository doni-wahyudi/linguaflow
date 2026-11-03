/**
 * @module useProgress
 * @description Manages lesson completion, word-level progress (spaced repetition),
 *              and aggregate statistics for the current user.
 *
 * All data is persisted via `useLocalStorage` so progress survives page reloads.
 */

import { useCallback, useMemo } from 'react';
import useLocalStorage from './useLocalStorage';
import {
  initWordProgress,
  calculateNextReview,
  getWordsForReview as filterDueWords,
} from '../utils/spacedRepetition';

/**
 * @typedef {Object} LessonRecord
 * @property {string} lessonId — completed lesson identifier
 * @property {number} score    — best score achieved (correct / total)
 * @property {string} completedAt — ISO 8601 timestamp of first completion
 */

/**
 * Hook return type.
 * @typedef {Object} ProgressHook
 * @property {LessonRecord[]} completedLessons
 * @property {Function} completeLesson
 * @property {Function} isLessonCompleted
 * @property {Function} getCategoryProgress
 * @property {Object}   wordProgress — map of wordId → WordProgress
 * @property {Function} updateWordProgress
 * @property {Function} getWordsForReview
 * @property {number}   totalWordsLearned
 */

/**
 * Track the user's lesson and vocabulary progress.
 *
 * @returns {ProgressHook}
 */
const useProgress = () => {
  // ── Persisted state ─────────────────────────────────────────────────────
  const [completedLessons, setCompletedLessons] = useLocalStorage(
    'completed_lessons',
    [] // Array<LessonRecord>
  );

  const [wordProgress, setWordProgress] = useLocalStorage(
    'word_progress',
    {} // Record<wordId, WordProgress>
  );

  const [examRecords, setExamRecords] = useLocalStorage(
    'exam_records',
    {} // Record<examId, { score, percentage, passed, completedAt, sectionScores }>
  );

  // ── Lesson helpers ──────────────────────────────────────────────────────

  /**
   * Mark a lesson as completed (or update its best score).
   *
   * @param {string} lessonId
   * @param {number} score — fraction of correct answers (0-1)
   */
  const completeLesson = useCallback(
    (lessonId, score) => {
      setCompletedLessons((prev) => {
        const existing = prev.find((r) => r.lessonId === lessonId);

        if (existing) {
          // Update best score if the new attempt is better
          if (score > existing.score) {
            return prev.map((r) =>
              r.lessonId === lessonId ? { ...r, score } : r
            );
          }
          return prev; // no change
        }

        // First completion
        return [
          ...prev,
          { lessonId, score, completedAt: new Date().toISOString() },
        ];
      });
    },
    [setCompletedLessons]
  );

  /**
   * Check whether a lesson has been completed at least once.
   *
   * @param {string} lessonId
   * @returns {boolean}
   */
  const isLessonCompleted = useCallback(
    (lessonId) => completedLessons.some((r) => r.lessonId === lessonId),
    [completedLessons]
  );

  /**
   * Compute completion progress for an entire category.
   *
   * @param {string} categoryId
   * @param {Array} lessonsList — the full list of lesson objects for a language
   * @returns {{ completed: number, total: number, percentage: number }}
   */
  const getCategoryProgress = useCallback(
    (categoryId, lessonsList) => {
      const categoryLessons = lessonsList.filter(
        (l) => l.categoryId === categoryId
      );
      const total = categoryLessons.length;
      const completed = categoryLessons.filter((l) =>
        completedLessons.some((r) => r.lessonId === l.id)
      ).length;

      return {
        completed,
        total,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      };
    },
    [completedLessons]
  );

  // ── Word-level progress (spaced repetition) ─────────────────────────────

  /**
   * Record a review for a word and update its spaced-repetition schedule.
   *
   * @param {string} wordId
   * @param {number} quality — recall quality (0-5)
   */
  const updateWordProgress = useCallback(
    (wordId, quality) => {
      setWordProgress((prev) => {
        const current = prev[wordId] || initWordProgress(wordId);
        const updated = calculateNextReview(current, quality);
        return { ...prev, [wordId]: updated };
      });
    },
    [setWordProgress]
  );

  /**
   * Get all words that are currently due for review.
   *
   * @returns {import('../utils/spacedRepetition').WordProgress[]}
   */
  const getWordsForReview = useCallback(() => {
    return filterDueWords(Object.values(wordProgress));
  }, [wordProgress]);

  // ── Derived statistics ──────────────────────────────────────────────────

  /** Count of unique words the user has reviewed at least once. */
  const totalWordsLearned = useMemo(
    () => Object.keys(wordProgress).length,
    [wordProgress]
  );

  // ── Official Mock Exam helpers ──────────────────────────────────────────

  /**
   * Record or update an official exam result.
   *
   * @param {string} examId
   * @param {object} result
   */
  const saveExamResult = useCallback(
    (examId, result) => {
      setExamRecords((prev) => {
        const existing = prev[examId];
        // If already passed with better or equal score, preserve best
        if (existing && existing.score >= result.score) {
          return prev;
        }
        return {
          ...prev,
          [examId]: {
            ...result,
            completedAt: new Date().toISOString(),
          },
        };
      });
    },
    [setExamRecords]
  );

  /**
   * Get an exam result by ID.
   *
   * @param {string} examId
   * @returns {object|null}
   */
  const getExamResult = useCallback(
    (examId) => examRecords[examId] || null,
    [examRecords]
  );

  return {
    completedLessons,
    completeLesson,
    isLessonCompleted,
    getCategoryProgress,
    wordProgress,
    updateWordProgress,
    getWordsForReview,
    totalWordsLearned,
    examRecords,
    saveExamResult,
    getExamResult,
  };
};

export default useProgress;
