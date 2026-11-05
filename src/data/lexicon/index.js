/**
 * @file index.js
 * @description Master entry point for language lexicons (ES, JA, FR, DE).
 * Exports lexiconByLanguage map and helper accessor getLexiconByLanguage(langCode).
 */

import { spanishLexicon } from './spanish.js';
import { japaneseLexicon } from './japanese.js';
import { frenchLexicon } from './french.js';
import { germanLexicon } from './german.js';

export { spanishLexicon } from './spanish.js';
export { japaneseLexicon } from './japanese.js';
export { frenchLexicon } from './french.js';
export { germanLexicon } from './german.js';

export const lexiconByLanguage = {
  es: spanishLexicon,
  ja: japaneseLexicon,
  fr: frenchLexicon,
  de: germanLexicon,
};

/**
 * Retrieves the core lexicon lemma array for a given language code.
 * @param {string} langCode - Language code ('es', 'ja', 'fr', 'de').
 * @returns {Array<object>} Array of lexicon items or empty array if not found.
 */
export function getLexiconByLanguage(langCode) {
  if (!langCode || typeof langCode !== 'string') {
    return [];
  }
  return lexiconByLanguage[langCode.toLowerCase()] || [];
}

export default lexiconByLanguage;
