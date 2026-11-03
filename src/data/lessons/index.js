/**
 * @file index.js
 * @description Master lessons registry grouping curriculum by language.
 */

import { spanishLessons } from './spanish';
import { japaneseLessons } from './japanese';
import { frenchLessons } from './french';
import { germanLessons } from './german';

export { spanishLessons } from './spanish';
export { japaneseLessons } from './japanese';
export { frenchLessons } from './french';
export { germanLessons } from './german';

export const lessonsByLanguage = {
  es: spanishLessons,
  ja: japaneseLessons,
  fr: frenchLessons,
  de: germanLessons,
};

export const allLessons = [
  ...spanishLessons,
  ...japaneseLessons,
  ...frenchLessons,
  ...germanLessons,
];

/**
 * Retrieve a specific lesson by its unique id.
 *
 * @param {string} lessonId
 * @returns {object|null}
 */
export const getLessonById = (lessonId) => {
  return allLessons.find((l) => l.id === lessonId) || null;
};

/**
 * Retrieve all lessons matching a specific category and language.
 *
 * @param {string} categoryId
 * @param {string} languageId
 * @returns {Array}
 */
export const getLessonsByCategory = (categoryId, languageId) => {
  const list = lessonsByLanguage[languageId] || [];
  return list.filter((l) => l.categoryId === categoryId);
};

/**
 * Retrieve all lessons matching a specific proficiency level (e.g. A1, A2, N5, N4).
 *
 * @param {string} level
 * @param {string} languageId
 * @returns {Array}
 */
export const getLessonsByLevel = (level, languageId) => {
  const list = lessonsByLanguage[languageId] || [];
  return list.filter((l) => l.level === level);
};

export default lessonsByLanguage;

