/**
 * @module UserContext
 * @description Global user state context for LinguaFlow.
 *
 * Combines all domain hooks (progress, streak, XP, speech) and user-profile
 * persistence into a single React context so any component in the tree can
 * access and mutate user state without prop drilling.
 */

import React, { createContext, useContext, useCallback, useMemo, useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import useProgress from '../hooks/useProgress';
import useStreak from '../hooks/useStreak';
import useXP from '../hooks/useXP';
import useSpeech from '../hooks/useSpeech';
import { useAuth } from './AuthContext';
import { fetchCloudData, pushLocalToCloud, mergeUserData } from '../utils/supabaseSync';

// ── Default user profile ────────────────────────────────────────────────────

/** @type {import('./UserContext').UserProfile} */
const DEFAULT_USER = {
  name: '',
  selectedLanguage: null, // language id, e.g. 'es'
  dailyGoal: 10, // minutes per day
  onboardingComplete: false,
  motivation: '', // free-text motivation note
  level: 'beginner', // self-assessed level: beginner | intermediate | advanced
};

// ── Context creation ────────────────────────────────────────────────────────

/**
 * @typedef {Object} UserContextValue
 * @property {Object}   user     — user profile object
 * @property {Function} updateUser
 * @property {Function} resetUser
 * @property {Function} startOnboarding
 * @property {Function} completeOnboarding
 * @property {import('../hooks/useProgress').ProgressHook} progress
 * @property {import('../hooks/useStreak').StreakHook}       streak
 * @property {import('../hooks/useXP').XPHook}               xp
 * @property {import('../hooks/useSpeech').SpeechHook}       speech
 */

const UserContext = createContext(/** @type {UserContextValue} */ (undefined));

/**
 * Convenience hook — will throw if used outside of <UserProvider>.
 *
 * @returns {UserContextValue}
 */
export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error('useUser must be used within a <UserProvider>');
  }
  return ctx;
};

// ── Provider component ──────────────────────────────────────────────────────

/**
 * Wrap your app (or a subtree) with this provider to make user state available.
 *
 * @param {{ children: React.ReactNode }} props
 */
export const UserProvider = ({ children }) => {
  const { user: authUser } = useAuth();

  // ── Persisted user profile ────────────────────────────────────────────
  const [user, setUser] = useLocalStorage('user_profile', DEFAULT_USER);

  // ── Cloud sync state ──────────────────────────────────────────────────
  const [syncStatus, setSyncStatus] = useState('idle'); // 'idle' | 'syncing' | 'synced' | 'error'
  const [lastSyncedAt, setLastSyncedAt] = useState(null);

  // ── Domain hooks ──────────────────────────────────────────────────────
  const progress = useProgress();
  const streak = useStreak();
  const xp = useXP();
  const speech = useSpeech();

  // ── Cloud sync engine ─────────────────────────────────────────────────
  const syncNow = useCallback(async () => {
    if (!authUser?.id) return { success: false, reason: 'Guest mode' };
    setSyncStatus('syncing');

    try {
      const cloudData = await fetchCloudData(authUser.id);

      const localData = {
        profile: user,
        progress: {
          completedLessons: progress.completedLessons,
          wordProgress: progress.wordProgress,
          examRecords: progress.examRecords || {},
        },
        stats: {
          totalXP: xp.totalXP,
          currentStreak: streak.currentStreak,
          longestStreak: streak.longestStreak,
          lastActiveDate: streak.lastActiveDate,
        },
        settings: {
          theme: typeof localStorage !== 'undefined' ? localStorage.getItem('linguaflow_theme') || 'system' : 'system',
          soundEnabled: typeof localStorage !== 'undefined' ? localStorage.getItem('linguaflow_sound_enabled') !== 'false' : true,
        },
      };

      if (cloudData && (cloudData.profile || cloudData.progress || cloudData.stats)) {
        const merged = mergeUserData(localData, cloudData);

        // Update local profile
        if (merged.profile) {
          setUser((prev) => ({ ...prev, ...merged.profile }));
        }

        // Write back merged arrays/objects to localStorage if available
        if (typeof window !== 'undefined' && window.localStorage) {
          if (merged.progress.completedLessons) {
            window.localStorage.setItem('completed_lessons', JSON.stringify(merged.progress.completedLessons));
          }
          if (merged.progress.wordProgress) {
            window.localStorage.setItem('word_progress', JSON.stringify(merged.progress.wordProgress));
          }
          if (merged.progress.examRecords) {
            window.localStorage.setItem('exam_records', JSON.stringify(merged.progress.examRecords));
          }
          if (typeof merged.stats.totalXP === 'number') {
            window.localStorage.setItem('total_xp', JSON.stringify(merged.stats.totalXP));
          }
          if (merged.stats) {
            window.localStorage.setItem('streak_data', JSON.stringify({
              currentStreak: merged.stats.currentStreak,
              longestStreak: merged.stats.longestStreak,
              lastActiveDate: merged.stats.lastActiveDate,
            }));
          }
        }

        const pushRes = await pushLocalToCloud(authUser.id, merged);
        if (pushRes.success) {
          setSyncStatus('synced');
          setLastSyncedAt(pushRes.timestamp);
          return { success: true };
        } else {
          setSyncStatus('error');
          return { success: false, error: pushRes.error };
        }
      } else {
        // First cloud sync for newly created user: push local state
        const pushRes = await pushLocalToCloud(authUser.id, localData);
        if (pushRes.success) {
          setSyncStatus('synced');
          setLastSyncedAt(pushRes.timestamp);
          return { success: true };
        } else {
          setSyncStatus('error');
          return { success: false, error: pushRes.error };
        }
      }
    } catch (err) {
      console.error('Error during cloud sync:', err);
      setSyncStatus('error');
      return { success: false, error: err };
    }
  }, [authUser?.id, user, progress.completedLessons, progress.wordProgress, progress.examRecords, xp.totalXP, streak.currentStreak, streak.longestStreak, streak.lastActiveDate, setUser]);

  // Auto-sync when auth user logs in or switches
  useEffect(() => {
    if (authUser?.id) {
      syncNow();
    } else {
      setSyncStatus('idle');
      setLastSyncedAt(null);
    }
  }, [authUser?.id, syncNow]);

  // ── Profile mutation helpers ──────────────────────────────────────────

  /**
   * Merge partial updates into the user profile.
   * @param {Partial<typeof DEFAULT_USER>} updates
   */
  const updateUser = useCallback(
    (updates) => {
      setUser((prev) => ({ ...prev, ...updates }));
    },
    [setUser]
  );

  /**
   * Reset the user profile to defaults (does NOT clear progress/streak/XP).
   */
  const resetUser = useCallback(() => {
    setUser(DEFAULT_USER);
  }, [setUser]);

  /**
   * Mark onboarding as in-progress (currently a no-op placeholder —
   * useful for future onboarding-step tracking).
   */
  const startOnboarding = useCallback(() => {
    updateUser({ onboardingComplete: false });
  }, [updateUser]);

  /**
   * Finalize onboarding with the data collected from the onboarding flow.
   *
   * @param {{ name: string, selectedLanguage: string, dailyGoal?: number,
   *           motivation?: string, level?: string }} userData
   */
  const completeOnboarding = useCallback(
    (userData) => {
      updateUser({
        ...userData,
        onboardingComplete: true,
      });
    },
    [updateUser]
  );

  // ── Memoised context value ────────────────────────────────────────────
  const value = useMemo(
    () => ({
      user,
      updateUser,
      resetUser,
      startOnboarding,
      completeOnboarding,
      progress,
      streak,
      xp,
      speech,
      syncStatus,
      lastSyncedAt,
      syncNow,
    }),
    [
      user,
      updateUser,
      resetUser,
      startOnboarding,
      completeOnboarding,
      progress,
      streak,
      xp,
      speech,
      syncStatus,
      lastSyncedAt,
      syncNow,
    ]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContext;
