/**
 * @module storage
 * @description Safe localStorage wrapper with JSON serialization.
 *
 * All values are transparently serialized/deserialized as JSON so callers can
 * store objects, arrays, numbers, and booleans without manual conversion.
 * Every operation is wrapped in a try/catch so the app degrades gracefully
 * when localStorage is unavailable (e.g. private browsing, quota exceeded).
 */

/** Namespace prefix to avoid collisions with other apps on the same origin. */
const STORAGE_PREFIX = 'linguaflow_';

/**
 * Build the namespaced key used in localStorage.
 * @param {string} key — logical key name
 * @returns {string} prefixed key
 */
const prefixKey = (key) => `${STORAGE_PREFIX}${key}`;

/**
 * Retrieve a value from localStorage.
 *
 * @param {string} key — the logical key (auto-prefixed)
 * @param {*} defaultValue — returned when the key is missing or on error
 * @returns {*} parsed value, or `defaultValue`
 */
export const getItem = (key, defaultValue = null) => {
  try {
    const raw = localStorage.getItem(prefixKey(key));
    // Key doesn't exist — return the fallback
    if (raw === null) return defaultValue;
    return JSON.parse(raw);
  } catch (error) {
    console.warn(`[storage] Failed to read "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Write a value to localStorage.
 *
 * @param {string} key — the logical key (auto-prefixed)
 * @param {*} value — any JSON-serializable value
 * @returns {boolean} true if the write succeeded
 */
export const setItem = (key, value) => {
  try {
    localStorage.setItem(prefixKey(key), JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`[storage] Failed to write "${key}":`, error);
    return false;
  }
};

/**
 * Remove a single key from localStorage.
 *
 * @param {string} key — the logical key (auto-prefixed)
 * @returns {boolean} true if the removal succeeded
 */
export const removeItem = (key) => {
  try {
    localStorage.removeItem(prefixKey(key));
    return true;
  } catch (error) {
    console.warn(`[storage] Failed to remove "${key}":`, error);
    return false;
  }
};

/**
 * Clear **all** LinguaFlow keys from localStorage.
 * Only keys that start with our namespace prefix are removed — other apps'
 * data is left intact.
 *
 * @returns {boolean} true if the operation succeeded
 */
export const clear = () => {
  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(STORAGE_PREFIX)) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
    return true;
  } catch (error) {
    console.warn('[storage] Failed to clear:', error);
    return false;
  }
};
