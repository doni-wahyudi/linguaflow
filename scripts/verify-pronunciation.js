#!/usr/bin/env node
/**
 * @file scripts/verify-pronunciation.js
 * @description Unit test suite for pronunciationScorer.js algorithmic comparison.
 */

import { cleanForComparison, levenshteinSimilarity, scorePronunciation } from '../src/utils/pronunciationScorer.js';

let failures = 0;
function assert(cond, msg) {
  if (!cond) {
    console.error(`  [FAIL] ${msg}`);
    failures++;
  } else {
    console.log(`  [OK] ${msg}`);
  }
}

console.log('Testing cleanForComparison...');
assert(cleanForComparison('¡Hola! ¿Cómo estás?', 'es') === 'hola como estas', 'Spanish punctuation and accents stripped');
assert(cleanForComparison("L'eau (f)", 'fr') === 'leau', 'French elision and parentheses cleaned');
assert(cleanForComparison('学生 (がくせい)', 'ja') === '学生', 'Japanese furigana stripped');
assert(cleanForComparison('Tschüss! Über', 'de') === 'tschuess ueber' || cleanForComparison('Tschüss! Über', 'de') === 'tschüss über', 'German umlauts handled');

console.log('\nTesting levenshteinSimilarity...');
assert(levenshteinSimilarity('hello', 'hello') === 1, 'Exact match has similarity 1.0');
assert(levenshteinSimilarity('cat', 'bat') >= 0.65, '1 char diff in 3 chars is ~0.67');
assert(levenshteinSimilarity('totally', 'different') < 0.3, 'Distant words have low similarity');

console.log('\nTesting scorePronunciation across languages...');
// 1. Exact match Spanish
const esExact = scorePronunciation('Buenos días', 'Buenos días', 'es');
assert(esExact.passed === true && esExact.score >= 95, 'Exact Spanish phrase scores >= 95%');
assert(esExact.tokens.every(t => t.status === 'correct'), 'All tokens marked correct on exact match');

// 2. Minor slip Spanish
const esMinor = scorePronunciation('Buenos días', 'Bueno días', 'es');
assert(esMinor.passed === true && esMinor.score >= 70, 'Minor plural slip still passes at >= 70%');
assert(esMinor.tokens[0].status === 'partial' || esMinor.tokens[0].status === 'correct', 'Partial token recognized');

// 3. Japanese kanji reading equivalence
const jaReading = scorePronunciation('学生', 'がくせい', 'ja', { reading: 'がくせい' });
assert(jaReading.passed === true && jaReading.score >= 90, 'Japanese hiragana matched against kanji via reading metadata');

// 4. French elision match
const frMatch = scorePronunciation("C'est la vie", 'c est la vie', 'fr');
assert(frMatch.passed === true && frMatch.score >= 85, 'French apostrophe variations matched');

// 5. Completely wrong speech
const wrongSpeech = scorePronunciation('Guten Morgen', 'Buenas noches amigo', 'de');
assert(wrongSpeech.passed === false && wrongSpeech.score < 50, 'Unrelated speech fails');

if (failures > 0) {
  console.error(`\nTest suite FAILED with ${failures} errors.`);
  process.exit(1);
} else {
  console.log('\nAll pronunciation scorer tests PASSED (0 errors).');
}
