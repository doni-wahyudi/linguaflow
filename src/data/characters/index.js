/**
 * @file index.js
 * @description Central export and query catalog for Japanese writing systems (Hiragana, Katakana, N5 Kanji) and European phonics.
 */

import { hiraganaData, katakanaData, kanjiN5Data } from './japanese.js';
import { phonicsByLanguage } from './phonics.js';

export { hiraganaData, katakanaData, kanjiN5Data, phonicsByLanguage };

/**
 * Get all Hiragana characters or filter by group ('gojuon', 'dakuten', 'yoon')
 * @param {string} [group]
 * @returns {Array}
 */
export function getHiragana(group) {
  if (!group) return hiraganaData;
  return hiraganaData.filter((item) => item.group === group);
}

/**
 * Get all Katakana characters or filter by group ('gojuon', 'dakuten', 'yoon')
 * @param {string} [group]
 * @returns {Array}
 */
export function getKatakana(group) {
  if (!group) return katakanaData;
  return katakanaData.filter((item) => item.group === group);
}

/**
 * Get all N5 Kanji or filter by category
 * @param {string} [category]
 * @returns {Array}
 */
export function getKanji(category) {
  if (!category) return kanjiN5Data;
  return kanjiN5Data.filter((item) => item.category === category);
}

/**
 * Get phonics guide for a specific European language ('es', 'fr', 'de')
 * @param {string} lang
 * @returns {object|null}
 */
export function getPhonics(lang) {
  return phonicsByLanguage[lang] || null;
}

/**
 * Lookup character or kanji by unique ID
 * @param {string} id
 * @returns {object|null}
 */
export function getCharacterById(id) {
  if (!id) return null;
  if (id.startsWith('hiragana-')) {
    return hiraganaData.find((h) => h.id === id) || null;
  }
  if (id.startsWith('katakana-')) {
    return katakanaData.find((k) => k.id === id) || null;
  }
  if (id.startsWith('kanji-')) {
    return kanjiN5Data.find((k) => k.id === id) || null;
  }
  // Fallback search across all Japanese datasets
  return (
    hiraganaData.find((h) => h.id === id) ||
    katakanaData.find((k) => k.id === id) ||
    kanjiN5Data.find((k) => k.id === id) ||
    null
  );
}

/**
 * Get characters by language and group
 * @param {string} lang
 * @param {string} group
 * @returns {Array}
 */
export function getCharactersByGroup(lang, group) {
  if (lang === 'ja') {
    if (group === 'hiragana') return hiraganaData;
    if (group === 'katakana') return katakanaData;
    if (group === 'kanji') return kanjiN5Data;
    return [...hiraganaData.filter((h) => h.group === group), ...katakanaData.filter((k) => k.group === group)];
  }
  if (phonicsByLanguage[lang]) {
    return phonicsByLanguage[lang].alphabet || [];
  }
  return [];
}
