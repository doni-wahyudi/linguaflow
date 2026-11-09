/**
 * @file verify-sync.js
 * @description Unit verification for deterministic data merging between guest local state and Supabase cloud.
 */

import assert from 'node:assert';
import { mergeUserData } from '../src/utils/supabaseSync.js';

console.log('Testing mergeUserData deterministic merge algorithm...');

// 1. Lesson merge test
const localData1 = {
  profile: { name: 'Local Learner', selectedLanguage: 'ja', dailyGoal: 15 },
  progress: {
    completedLessons: [
      { lessonId: 'es-intro-1', score: 0.8, completedAt: '2026-11-01T10:00:00Z' },
      { lessonId: 'ja-hiragana-1', score: 0.9, completedAt: '2026-11-05T12:00:00Z' },
    ],
    wordProgress: {
      'word-1': { interval: 1, nextReviewDate: '2026-11-09' },
    },
    examRecords: {},
  },
  stats: {
    totalXP: 120,
    currentStreak: 4,
    longestStreak: 7,
    lastActiveDate: '2026-11-08',
  },
};

const cloudData1 = {
  profile: { name: 'Cloud Learner', selected_language: 'es', daily_goal: 10, level: 'intermediate' },
  progress: {
    completed_lessons: [
      { lessonId: 'es-intro-1', score: 1.0, completedAt: '2026-11-02T10:00:00Z' }, // Higher score in cloud
      { lessonId: 'es-intro-2', score: 0.7, completedAt: '2026-11-03T10:00:00Z' }, // Unique to cloud
    ],
    word_progress: {
      'word-1': { interval: 3, nextReviewDate: '2026-11-15' }, // Higher interval in cloud
      'word-2': { interval: 2, nextReviewDate: '2026-11-12' }, // Unique to cloud
    },
    exam_records: {
      'dele-a1': { score: 85, percentage: 85, passed: true },
    },
  },
  stats: {
    total_xp: 200, // Higher XP in cloud
    current_streak: 2,
    longest_streak: 10, // Higher longest streak in cloud
    last_active_date: '2026-11-09', // Later active date in cloud
  },
};

const merged1 = mergeUserData(localData1, cloudData1);

// Assert Profile
assert.strictEqual(merged1.profile.name, 'Local Learner', 'Profile name preserves local non-empty name');
assert.strictEqual(merged1.profile.selectedLanguage, 'ja', 'Selected language preserves local choice');
assert.strictEqual(merged1.profile.dailyGoal, 15, 'Daily goal takes max');
assert.strictEqual(merged1.profile.level, 'intermediate', 'Level adopts cloud profile if local is default');

// Assert Lessons
assert.strictEqual(merged1.progress.completedLessons.length, 3, 'Merged completed lessons union contains all 3 lessons');
const es1 = merged1.progress.completedLessons.find((l) => l.lessonId === 'es-intro-1');
assert.strictEqual(es1.score, 1.0, 'Best score (1.0 vs 0.8) preserved for es-intro-1');

// Assert Word Progress (SRS)
assert.strictEqual(Object.keys(merged1.progress.wordProgress).length, 2, 'Words progress merged 2 words');
assert.strictEqual(merged1.progress.wordProgress['word-1'].interval, 3, 'Word 1 takes cloud interval 3');

// Assert Exam Records
assert.ok(merged1.progress.examRecords['dele-a1'], 'Exam records preserved');

// Assert Stats
assert.strictEqual(merged1.stats.totalXP, 200, 'Total XP takes max (200 vs 120)');
assert.strictEqual(merged1.stats.currentStreak, 4, 'Current streak takes max');
assert.strictEqual(merged1.stats.longestStreak, 10, 'Longest streak takes max (10 vs 7)');
assert.strictEqual(merged1.stats.lastActiveDate, '2026-11-09', 'Last active date takes latest date');

console.log('PASS: mergeUserData deterministic merge algorithm verified successfully.');
process.exit(0);
