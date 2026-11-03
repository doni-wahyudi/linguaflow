/**
 * @module UserContext
 * @description Global user state context for LinguaFlow.
 *
 * Combines all domain hooks (progress, streak, XP, speech) and user-profile
 * persistence into a single React context so any component in the tree can
 * access and mutate user state without prop drilling.
 */

import React, { createContext, useContext, useCallback, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import useProgress from '../hooks/useProgress';
import useStreak from '../hooks/useStreak';
import useXP from '../hooks/useXP';
import useSpeech from '../hooks/useSpeech';

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
  // ── Persisted user profile ────────────────────────────────────────────
  const [user, setUser] = useLocalStorage('user_profile', DEFAULT_USER);

  // ── Domain hooks ──────────────────────────────────────────────────────
  const progress = useProgress();
  const streak = useStreak();
  const xp = useXP();
  const speech = useSpeech();

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
    ]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContext;
