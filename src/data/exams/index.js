/**
 * @file index.js
 * @description Master catalog of official mock proficiency examinations across all supported languages.
 */

import { japaneseExams } from './japanese';
import { germanExams } from './german';
import { spanishExams } from './spanish';
import { frenchExams } from './french';

export const allExams = [
  ...japaneseExams,
  ...germanExams,
  ...spanishExams,
  ...frenchExams,
];

export const examsByLanguage = {
  ja: japaneseExams,
  de: germanExams,
  es: spanishExams,
  fr: frenchExams,
};

/**
 * Get all exams available for a specific language code.
 * @param {string} langCode
 * @returns {Array}
 */
export function getExamsByLanguage(langCode) {
  return examsByLanguage[langCode] || [];
}

/**
 * Find an exam by its unique ID.
 * @param {string} examId
 * @returns {object|null}
 */
export function getExamById(examId) {
  return allExams.find((e) => e.id === examId) || null;
}

