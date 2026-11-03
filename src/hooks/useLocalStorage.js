/**
 * @module useLocalStorage
 * @description React hook that synchronises a piece of state with localStorage.
 *
 * Works exactly like `useState` but the value is persisted across page reloads.
 * JSON serialization is handled automatically.
 *
 * Usage:
 *   const [name, setName] = useLocalStorage('user_name', 'Guest');
 */

import { useState, useCallback, useEffect } from 'react';

/** Namespace prefix — must match the one used in `utils/storage.js`. */
const STORAGE_PREFIX = 'linguaflow_';

/**
 * Read the initial value from localStorage (SSR-safe).
 *
 * @param {string} key — logical key (will be prefixed)
 * @param {*} defaultValue — fallback when the key is absent or unparsable
 * @returns {*} stored value or defaultValue
 */
const readStoredValue = (key, defaultValue) => {
  // Guard against SSR / environments without localStorage
  if (typeof window === 'undefined') return defaultValue;

  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    if (raw === null) return defaultValue;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`[useLocalStorage] Could not parse key "${key}":`, err);
    return defaultValue;
  }
};

/**
 * Custom hook for persisting state in localStorage.
 *
 * @param {string} key — storage key (auto-prefixed with the app namespace)
 * @param {*} defaultValue — initial value when nothing is stored yet
 * @returns {[*, Function]} tuple of [currentValue, setValue]
 */
const useLocalStorage = (key, defaultValue) => {
  // Lazy initializer: read from storage only once on mount
  const [storedValue, setStoredValue] = useState(() =>
    readStoredValue(key, defaultValue)
  );

  /**
   * Update both React state and localStorage in one call.
   * Accepts a plain value or a functional updater (like setState).
   */
  const setValue = useCallback(
    (valueOrUpdater) => {
      setStoredValue((prev) => {
        const nextValue =
          typeof valueOrUpdater === 'function'
            ? valueOrUpdater(prev)
            : valueOrUpdater;

        // Persist to localStorage
        try {
          localStorage.setItem(
            `${STORAGE_PREFIX}${key}`,
            JSON.stringify(nextValue)
          );
        } catch (err) {
          console.warn(`[useLocalStorage] Could not write key "${key}":`, err);
        }

        return nextValue;
      });
    },
    [key]
  );

  // ── Cross-tab synchronisation ───────────────────────────────────────────
  // When another tab modifies the same key, keep this tab in sync.
  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === `${STORAGE_PREFIX}${key}` && event.newValue !== null) {
        try {
          setStoredValue(JSON.parse(event.newValue));
        } catch {
          // Ignore unparsable values from other tabs
        }
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [key]);

  return [storedValue, setValue];
};

export default useLocalStorage;
