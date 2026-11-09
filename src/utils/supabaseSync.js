/**
 * @file supabaseSync.js
 * @description Bi-directional synchronization and data merging between local storage and Supabase cloud.
 * Offline-first: merges guest data deterministically without loss.
 */

import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js';

/**
 * Deterministically merges local user state with cloud data.
 *
 * @param {object} local - Local state { profile, progress, stats, settings }
 * @param {object} cloud - Cloud state { profile, progress, stats }
 * @returns {object} Merged state { profile, progress, stats }
 */
export function mergeUserData(local = {}, cloud = {}) {
  const localProfile = local.profile || {};
  const cloudProfile = cloud.profile || {};

  const localProgress = local.progress || {};
  const cloudProgress = cloud.progress || {};

  const localStats = local.stats || {};
  const cloudStats = cloud.stats || {};

  // 1. Profile merge
  const mergedProfile = {
    name: localProfile.name || cloudProfile.name || '',
    selectedLanguage: localProfile.selectedLanguage || cloudProfile.selected_language || cloudProfile.selectedLanguage || 'es',
    dailyGoal: Math.max(Number(localProfile.dailyGoal) || 10, Number(cloudProfile.daily_goal) || Number(cloudProfile.dailyGoal) || 10),
    onboardingComplete: Boolean(localProfile.onboardingComplete || cloudProfile.onboardingComplete || true),
    motivation: localProfile.motivation || cloudProfile.motivation || '',
    level: localProfile.level || cloudProfile.level || 'beginner',
    theme: local.settings?.theme || cloudProfile.theme || 'system',
    soundEnabled: local.settings?.soundEnabled !== undefined ? local.settings.soundEnabled : (cloudProfile.sound_enabled !== undefined ? cloudProfile.sound_enabled : true),
  };

  // 2. Completed lessons merge (union of lessonIds with max score and latest date)
  const localCompleted = Array.isArray(localProgress.completedLessons) ? localProgress.completedLessons : [];
  const cloudCompleted = Array.isArray(cloudProgress.completed_lessons)
    ? cloudProgress.completed_lessons
    : (Array.isArray(cloudProgress.completedLessons) ? cloudProgress.completedLessons : []);

  const lessonMap = new Map();
  for (const item of [...localCompleted, ...cloudCompleted]) {
    if (!item) continue;
    const lessonId = typeof item === 'string' ? item : item.lessonId;
    if (!lessonId) continue;
    const score = typeof item === 'object' && typeof item.score === 'number' ? item.score : 1;
    const completedAt = typeof item === 'object' && item.completedAt ? item.completedAt : new Date().toISOString();

    if (!lessonMap.has(lessonId)) {
      lessonMap.set(lessonId, { lessonId, score, completedAt });
    } else {
      const existing = lessonMap.get(lessonId);
      lessonMap.set(lessonId, {
        lessonId,
        score: Math.max(existing.score, score),
        completedAt: existing.completedAt > completedAt ? existing.completedAt : completedAt,
      });
    }
  }
  const mergedCompletedLessons = Array.from(lessonMap.values());

  // 3. Word progress merge (SRS vocabulary)
  const localWords = localProgress.wordProgress || {};
  const cloudWords = cloudProgress.word_progress || cloudProgress.wordProgress || {};
  const mergedWords = { ...cloudWords, ...localWords };

  for (const [wordId, cloudWord] of Object.entries(cloudWords)) {
    const localWord = localWords[wordId];
    if (localWord) {
      const localInterval = localWord.interval || 0;
      const cloudInterval = cloudWord.interval || 0;
      if (cloudInterval > localInterval || (cloudWord.nextReviewDate && cloudWord.nextReviewDate > (localWord.nextReviewDate || ''))) {
        mergedWords[wordId] = cloudWord;
      }
    }
  }

  // 4. Exam records merge
  const localExams = localProgress.examRecords || {};
  const cloudExams = cloudProgress.exam_records || cloudProgress.examRecords || {};
  const mergedExams = { ...cloudExams, ...localExams };
  for (const [examId, cloudExam] of Object.entries(cloudExams)) {
    const localExam = localExams[examId];
    if (localExam) {
      mergedExams[examId] = (cloudExam.percentage || 0) > (localExam.percentage || 0) ? cloudExam : localExam;
    }
  }

  // 5. Stats merge (XP & Streak)
  const localXP = Number(localStats.totalXP) || 0;
  const cloudXP = Number(cloudStats.total_xp) || Number(cloudStats.totalXP) || 0;

  const localStreak = Number(localStats.currentStreak) || 0;
  const cloudStreak = Number(cloudStats.current_streak) || Number(cloudStats.currentStreak) || 0;

  const localLongest = Number(localStats.longestStreak) || 0;
  const cloudLongest = Number(cloudStats.longest_streak) || Number(cloudStats.longestStreak) || 0;

  const localDate = localStats.lastActiveDate || null;
  const cloudDate = cloudStats.last_active_date || cloudStats.lastActiveDate || null;

  const mergedStats = {
    totalXP: Math.max(localXP, cloudXP),
    currentStreak: Math.max(localStreak, cloudStreak),
    longestStreak: Math.max(localLongest, cloudLongest, localStreak, cloudStreak),
    lastActiveDate: localDate && cloudDate ? (localDate > cloudDate ? localDate : cloudDate) : (localDate || cloudDate),
  };

  return {
    profile: mergedProfile,
    progress: {
      completedLessons: mergedCompletedLessons,
      wordProgress: mergedWords,
      examRecords: mergedExams,
    },
    stats: mergedStats,
  };
}

/**
 * Fetches user profile, progress, and stats from Supabase.
 *
 * @param {string} userId - Supabase auth user UUID
 * @returns {Promise<{ profile: object|null, progress: object|null, stats: object|null }|null>}
 */
export async function fetchCloudData(userId) {
  if (!isSupabaseConfigured || !supabase || !userId) {
    return null;
  }
  try {
    const [profileRes, progressRes, statsRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).single(),
      supabase.from('user_progress').select('*').eq('user_id', userId).single(),
      supabase.from('user_stats').select('*').eq('user_id', userId).single(),
    ]);

    return {
      profile: profileRes.data || null,
      progress: progressRes.data || null,
      stats: statsRes.data || null,
    };
  } catch (err) {
    console.error('Failed to fetch Supabase cloud data:', err);
    return null;
  }
}

/**
 * Pushes merged state to Supabase.
 *
 * @param {string} userId - Supabase auth user UUID
 * @param {object} data - { profile, progress, stats }
 * @returns {Promise<{ success: boolean, timestamp?: string, error?: Error }>}
 */
export async function pushLocalToCloud(userId, data) {
  if (!isSupabaseConfigured || !supabase || !userId || !data) {
    return { success: false, error: new Error('Supabase not configured or missing parameters') };
  }
  try {
    const { profile, progress, stats } = data;

    const profilePayload = {
      id: userId,
      name: profile?.name || '',
      selected_language: profile?.selectedLanguage || 'es',
      daily_goal: profile?.dailyGoal || 10,
      motivation: profile?.motivation || '',
      level: profile?.level || 'beginner',
      theme: profile?.theme || 'system',
      sound_enabled: profile?.soundEnabled ?? true,
      updated_at: new Date().toISOString(),
    };

    const progressPayload = {
      user_id: userId,
      completed_lessons: progress?.completedLessons || [],
      word_progress: progress?.wordProgress || {},
      exam_records: progress?.examRecords || {},
      updated_at: new Date().toISOString(),
    };

    const statsPayload = {
      user_id: userId,
      total_xp: stats?.totalXP || 0,
      current_streak: stats?.currentStreak || 0,
      longest_streak: stats?.longestStreak || 0,
      last_active_date: stats?.lastActiveDate || null,
      updated_at: new Date().toISOString(),
    };

    const [pRes, progRes, sRes] = await Promise.all([
      supabase.from('profiles').upsert(profilePayload),
      supabase.from('user_progress').upsert(progressPayload),
      supabase.from('user_stats').upsert(statsPayload),
    ]);

    const error = pRes.error || progRes.error || sRes.error;
    if (error) {
      return { success: false, error };
    }
    return { success: true, timestamp: new Date().toISOString() };
  } catch (err) {
    console.error('Failed to push data to Supabase:', err);
    return { success: false, error: err };
  }
}
