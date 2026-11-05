#!/usr/bin/env node
/**
 * @file scripts/verify-curriculum.js
 * @description Verification harness for curriculum lessons and lexicon datasets.
 * Ensures data integrity, schema compliance, minimum item thresholds, and ID uniqueness.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const LANGUAGES = [
  { code: 'es', name: 'Spanish', file: 'spanish.js', lessonExport: 'spanishLessons', lexiconExport: 'spanishLexicon' },
  { code: 'ja', name: 'Japanese', file: 'japanese.js', lessonExport: 'japaneseLessons', lexiconExport: 'japaneseLexicon' },
  { code: 'fr', name: 'French', file: 'french.js', lessonExport: 'frenchLessons', lexiconExport: 'frenchLexicon' },
  { code: 'de', name: 'German', file: 'german.js', lessonExport: 'germanLessons', lexiconExport: 'germanLexicon' },
];

const errors = [];
const warnings = [];

function addError(scope, message) {
  errors.push(`[${scope}] ${message}`);
}

function addWarning(scope, message) {
  warnings.push(`[${scope}] ${message}`);
}

// Track ID uniqueness
const allLessonIds = new Map(); // id -> { lang, lessonId }
const allGrammarGuideIds = new Map(); // id -> { lang, lessonId }
const allLexiconIds = new Map(); // id -> { lang, lemmaId }
const allVocabIds = new Map(); // id -> { lang, lessonId }

/**
 * Validates an array of lessons for a language.
 */
function validateLessons(lang, lessons) {
  if (!Array.isArray(lessons)) {
    addError(`Lessons:${lang.name}`, `Expected an array of lessons, received ${typeof lessons}`);
    return;
  }

  if (lessons.length === 0) {
    addError(`Lessons:${lang.name}`, `Lesson list is empty`);
    return;
  }

  for (let i = 0; i < lessons.length; i++) {
    const lesson = lessons[i];
    const lessonRef = lesson && lesson.id ? `Lesson ${lesson.id}` : `Lesson index ${i}`;

    if (!lesson || typeof lesson !== 'object') {
      addError(`Lessons:${lang.name}`, `${lessonRef} is not a valid object`);
      continue;
    }

    // 1. Required basic fields: id, title, level
    if (!lesson.id || typeof lesson.id !== 'string' || !lesson.id.trim()) {
      addError(`Lessons:${lang.name}`, `${lessonRef} is missing a valid 'id' string`);
    } else {
      if (allLessonIds.has(lesson.id)) {
        const prev = allLessonIds.get(lesson.id);
        addError(`Lessons:${lang.name}`, `Duplicate lesson ID '${lesson.id}' (already defined in ${prev.lang})`);
      } else {
        allLessonIds.set(lesson.id, { lang: lang.name, lessonId: lesson.id });
      }
    }

    if (!lesson.title || typeof lesson.title !== 'string' || !lesson.title.trim()) {
      addError(`Lessons:${lang.name}`, `${lessonRef} is missing a valid 'title' string`);
    }

    if (!lesson.level || typeof lesson.level !== 'string' || !lesson.level.trim()) {
      addError(`Lessons:${lang.name}`, `${lessonRef} is missing a valid 'level' string`);
    }

    // 2. Vocabulary requirements: array with >= 10 items
    if (!Array.isArray(lesson.vocabulary)) {
      addError(`Lessons:${lang.name}`, `${lessonRef} is missing 'vocabulary' array`);
    } else {
      if (lesson.vocabulary.length < 10) {
        addError(
          `Lessons:${lang.name}`,
          `${lessonRef} has ${lesson.vocabulary.length} vocabulary item(s); expected >= 10`
        );
      }

      for (let v = 0; v < lesson.vocabulary.length; v++) {
        const item = lesson.vocabulary[v];
        const vRef = item && item.id ? item.id : `${lessonRef} vocab #${v}`;
        if (!item || typeof item !== 'object') {
          addError(`Lessons:${lang.name}`, `${lessonRef} vocab #${v} is not an object`);
          continue;
        }

        if (item.id) {
          if (allVocabIds.has(item.id)) {
            const prev = allVocabIds.get(item.id);
            addError(
              `Lessons:${lang.name}`,
              `Duplicate lesson vocabulary ID '${item.id}' in ${lessonRef} (already defined in ${prev.lang} ${prev.lessonId})`
            );
          } else {
            allVocabIds.set(item.id, { lang: lang.name, lessonId: lessonRef });
          }

          if (allLessonIds.has(item.id)) {
            const prev = allLessonIds.get(item.id);
            addError(
              `Lessons:${lang.name}`,
              `Lesson vocabulary ID '${item.id}' in ${lessonRef} conflicts with lesson ID in ${prev.lang}`
            );
          }
        }
      }
    }

    // 3. Grammar guide requirements: valid object with id, title, concept, rules (array >= 2 of schema objects), tip
    if (!lesson.grammarGuide || typeof lesson.grammarGuide !== 'object' || Array.isArray(lesson.grammarGuide)) {
      addError(`Lessons:${lang.name}`, `${lessonRef} is missing 'grammarGuide' object`);
    } else {
      const gg = lesson.grammarGuide;

      // 3a. grammarGuide.id must be a non-empty string and globally unique
      if (!gg.id || typeof gg.id !== 'string' || !gg.id.trim()) {
        addError(`Lessons:${lang.name}`, `${lessonRef} grammarGuide is missing valid 'id' string`);
      } else {
        if (allGrammarGuideIds.has(gg.id)) {
          const prev = allGrammarGuideIds.get(gg.id);
          addError(
            `Lessons:${lang.name}`,
            `Duplicate grammarGuide ID '${gg.id}' in ${lessonRef} (already defined in ${prev.lang} ${prev.lessonId})`
          );
        } else {
          allGrammarGuideIds.set(gg.id, { lang: lang.name, lessonId: lessonRef });
        }

        if (allLessonIds.has(gg.id)) {
          addError(
            `Lessons:${lang.name}`,
            `GrammarGuide ID '${gg.id}' in ${lessonRef} conflicts with lesson ID in ${allLessonIds.get(gg.id).lang}`
          );
        }
        if (allVocabIds.has(gg.id)) {
          addError(
            `Lessons:${lang.name}`,
            `GrammarGuide ID '${gg.id}' in ${lessonRef} conflicts with lesson vocabulary ID in ${allVocabIds.get(gg.id).lang} (${allVocabIds.get(gg.id).lessonId})`
          );
        }
      }

      // 3b. grammarGuide.title must be a non-empty string
      if (!gg.title || typeof gg.title !== 'string' || !gg.title.trim()) {
        addError(`Lessons:${lang.name}`, `${lessonRef} grammarGuide is missing valid 'title' string`);
      }

      // 3c. grammarGuide.concept must be a non-empty string
      if (!gg.concept || typeof gg.concept !== 'string' || !gg.concept.trim()) {
        addError(`Lessons:${lang.name}`, `${lessonRef} grammarGuide is missing valid 'concept' string`);
      }

      // 3d. grammarGuide.rules: array >= 2, each rule is an object with rule, pattern, example, translation
      if (!Array.isArray(gg.rules)) {
        addError(`Lessons:${lang.name}`, `${lessonRef} grammarGuide is missing 'rules' array`);
      } else if (gg.rules.length < 2) {
        addError(
          `Lessons:${lang.name}`,
          `${lessonRef} grammarGuide has ${gg.rules.length} rule(s); expected >= 2`
        );
      } else {
        const requiredRuleFields = ['rule', 'pattern', 'example', 'translation'];
        for (let r = 0; r < gg.rules.length; r++) {
          const rule = gg.rules[r];
          if (!rule || typeof rule !== 'object' || Array.isArray(rule)) {
            addError(`Lessons:${lang.name}`, `${lessonRef} grammarGuide rule #${r + 1} is not an object`);
            continue;
          }

          for (const field of requiredRuleFields) {
            if (!rule[field] || typeof rule[field] !== 'string' || !rule[field].trim()) {
              addError(
                `Lessons:${lang.name}`,
                `${lessonRef} grammarGuide rule #${r + 1} is missing or has empty string for field '${field}'`
              );
            }
          }
        }
      }

      // 3e. grammarGuide.tip must be a non-empty string
      if (!gg.tip || typeof gg.tip !== 'string' || !gg.tip.trim()) {
        addError(`Lessons:${lang.name}`, `${lessonRef} grammarGuide is missing valid 'tip' string`);
      }
    }
  }
}

/**
 * Validates an array of lexicon items for a language.
 */
function validateLexicon(lang, lexicon) {
  if (!Array.isArray(lexicon)) {
    addError(`Lexicon:${lang.name}`, `Expected an array of lexicon items, received ${typeof lexicon}`);
    return;
  }

  if (lexicon.length < 100) {
    addError(`Lexicon:${lang.name}`, `Contains ${lexicon.length} items; expected >= 100`);
  }

  const requiredFields = ['id', 'word', 'translation', 'example', 'exampleTranslation'];

  for (let i = 0; i < lexicon.length; i++) {
    const item = lexicon[i];
    const itemRef = item && item.id ? `Lexicon item '${item.id}'` : `Lexicon item at index ${i}`;

    if (!item || typeof item !== 'object') {
      addError(`Lexicon:${lang.name}`, `${itemRef} is not an object`);
      continue;
    }

    for (const field of requiredFields) {
      if (!item[field] || typeof item[field] !== 'string' || !item[field].trim()) {
        addError(`Lexicon:${lang.name}`, `${itemRef} is missing or has empty string for field '${field}'`);
      }
    }

    if (item.id && typeof item.id === 'string') {
      if (allLexiconIds.has(item.id)) {
        const prev = allLexiconIds.get(item.id);
        addError(
          `Lexicon:${lang.name}`,
          `Duplicate lexicon ID '${item.id}' in ${lang.name} (already defined in ${prev.lang})`
        );
      } else {
        allLexiconIds.set(item.id, { lang: lang.name, lemmaId: item.id });
      }

      // Check collision between lexicon IDs and lesson IDs, vocab IDs, or grammarGuide IDs
      if (allLessonIds.has(item.id)) {
        addError(
          `Lexicon:${lang.name}`,
          `Lexicon ID '${item.id}' conflicts with lesson ID in ${allLessonIds.get(item.id).lang}`
        );
      }
      if (allVocabIds.has(item.id)) {
        const prev = allVocabIds.get(item.id);
        addError(
          `Lexicon:${lang.name}`,
          `Lexicon ID '${item.id}' conflicts with lesson vocabulary ID in ${prev.lang} (${prev.lessonId})`
        );
      }
      if (allGrammarGuideIds.has(item.id)) {
        const prev = allGrammarGuideIds.get(item.id);
        addError(
          `Lexicon:${lang.name}`,
          `Lexicon ID '${item.id}' conflicts with grammar guide ID in ${prev.lang} (${prev.lessonId})`
        );
      }
    }
  }
}

async function run() {
  console.log('====================================================');
  console.log('  LinguaFlow Curriculum & Lexicon Verification');
  console.log('====================================================\n');

  let totalLessonsChecked = 0;
  let totalLexiconChecked = 0;

  // 1. Verify Lessons
  console.log('-> Validating Lessons...');
  for (const lang of LANGUAGES) {
    const filePath = path.join(rootDir, 'src', 'data', 'lessons', lang.file);
    if (!fs.existsSync(filePath)) {
      addError(`Lessons:${lang.name}`, `Lesson file not found at ${filePath}`);
      continue;
    }

    try {
      const fileUrl = pathToFileURL(filePath).href;
      const mod = await import(fileUrl);
      const lessons = mod[lang.lessonExport] || mod.lessons || mod.default || (
        Object.values(mod).find((val) => Array.isArray(val))
      );

      if (!lessons) {
        addError(`Lessons:${lang.name}`, `Could not find exported lessons array in ${lang.file}`);
      } else {
        validateLessons(lang, lessons);
        totalLessonsChecked += Array.isArray(lessons) ? lessons.length : 0;
        console.log(`   [OK] Loaded ${lang.name} lessons (${Array.isArray(lessons) ? lessons.length : 0} found)`);
      }
    } catch (err) {
      addError(`Lessons:${lang.name}`, `Failed to import ${lang.file}: ${err.message}`);
    }
  }

  // 2. Verify Lexicon
  console.log('\n-> Validating Lexicon Datasets...');
  const lexiconDir = path.join(rootDir, 'src', 'data', 'lexicon');
  const lexiconIndex = path.join(lexiconDir, 'index.js');

  for (const lang of LANGUAGES) {
    const filePath = path.join(lexiconDir, lang.file);
    if (!fs.existsSync(filePath)) {
      addError(`Lexicon:${lang.name}`, `Lexicon file not found at ${path.relative(rootDir, filePath)}`);
      continue;
    }

    try {
      const fileUrl = pathToFileURL(filePath).href;
      const mod = await import(fileUrl);
      const lexicon = mod[lang.lexiconExport] || mod.lexicon || mod.default || (
        Object.values(mod).find((val) => Array.isArray(val))
      );

      if (!lexicon) {
        addError(`Lexicon:${lang.name}`, `Could not find exported lexicon array in ${lang.file}`);
      } else {
        validateLexicon(lang, lexicon);
        totalLexiconChecked += Array.isArray(lexicon) ? lexicon.length : 0;
        console.log(`   [OK] Loaded ${lang.name} lexicon (${Array.isArray(lexicon) ? lexicon.length : 0} items found)`);
      }
    } catch (err) {
      addError(`Lexicon:${lang.name}`, `Failed to import ${lang.file}: ${err.message}`);
    }
  }

  // 3. Check Lexicon Index File
  if (fs.existsSync(lexiconDir)) {
    if (!fs.existsSync(lexiconIndex)) {
      addError('Lexicon:Index', `Lexicon master index not found at src/data/lexicon/index.js`);
    } else {
      try {
        const fileUrl = pathToFileURL(lexiconIndex).href;
        const mod = await import(fileUrl);
        if (!mod.lexiconByLanguage && !mod.default) {
          addError('Lexicon:Index', `src/data/lexicon/index.js does not export 'lexiconByLanguage' or default`);
        }
        if (typeof mod.getLexiconByLanguage !== 'function') {
          addWarning('Lexicon:Index', `src/data/lexicon/index.js does not export 'getLexiconByLanguage' function`);
        }
      } catch (err) {
        addError('Lexicon:Index', `Failed to import src/data/lexicon/index.js: ${err.message}`);
      }
    }
  } else {
    addError('Lexicon:Directory', `Lexicon directory not found at src/data/lexicon`);
  }

  // Print Summary & Results
  console.log('\n----------------------------------------------------');
  console.log(`Summary:`);
  console.log(`  Lessons checked: ${totalLessonsChecked}`);
  console.log(`  Lexicon items checked: ${totalLexiconChecked}`);
  console.log(`  Unique lesson IDs: ${allLessonIds.size}`);
  console.log(`  Unique grammar guide IDs: ${allGrammarGuideIds.size}`);
  console.log(`  Unique lexicon IDs: ${allLexiconIds.size}`);
  console.log(`  Errors: ${errors.length}`);
  console.log(`  Warnings: ${warnings.length}`);
  console.log('----------------------------------------------------\n');

  if (warnings.length > 0) {
    console.log(`WARNINGS (${warnings.length}):`);
    for (const w of warnings) {
      console.log(`  ! ${w}`);
    }
    console.log('');
  }

  if (errors.length > 0) {
    console.error(`FAILED: ${errors.length} curriculum integrity violation(s) found:\n`);
    for (const e of errors) {
      console.error(`  x ${e}`);
    }
    console.error('\nPlease fix the errors above to pass verification.');
    process.exit(1);
  }

  console.log('PASSED: All curriculum and lexicon integrity assertions satisfied.');
  process.exit(0);
}

run().catch((err) => {
  console.error('Fatal error during verification:', err);
  process.exit(1);
});
