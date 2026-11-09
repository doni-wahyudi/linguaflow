/**
 * @file verify-stroke-order.js
 * @description Unit verification script for stroke order datasets, canonical calligraphy rules,
 * coordinate ranges (0-100), direction properties, and procedural Latin fallback heuristics.
 */

import {
  CANONICAL_STROKE_RULES,
  getStrokeData,
  strokeDictionary,
} from '../src/data/characters/strokeData.js';

console.log('====================================================');
console.log('  LinguaFlow Stroke Order & Direction Verification  ');
console.log('====================================================\n');

let errors = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`  [FAIL] ${message}`);
    errors++;
  } else {
    console.log(`  [OK] ${message}`);
  }
}

// ── 1. Canonical Calligraphy Rules Validation ──
console.log('-> Validating Canonical Calligraphy Rules...');
assert(
  Array.isArray(CANONICAL_STROKE_RULES) && CANONICAL_STROKE_RULES.length === 7,
  `CANONICAL_STROKE_RULES must contain exactly 7 canonical rules (found ${CANONICAL_STROKE_RULES?.length})`
);

const expectedRuleIds = [
  'top-to-bottom',
  'left-to-right',
  'horizontal-before-vertical',
  'center-before-sides',
  'enclosure-before-inside',
  'close-enclosure-last',
  'minor-dot-last',
];

expectedRuleIds.forEach((id) => {
  const rule = CANONICAL_STROKE_RULES.find((r) => r.id === id);
  assert(
    Boolean(rule && rule.title && rule.titleJa && rule.description),
    `Canonical rule "${id}" must contain title, titleJa, and description`
  );
});

// Helper to validate a single stroke entry
function validateStrokeData(data, label) {
  if (!data) {
    assert(false, `${label}: stroke data returned null or undefined`);
    return;
  }

  assert(Boolean(data.char), `${label}: char is defined`);
  assert(
    typeof data.strokeCount === 'number' && data.strokeCount > 0,
    `${label}: strokeCount is positive integer (got ${data.strokeCount})`
  );
  assert(
    Array.isArray(data.strokes) && data.strokes.length === data.strokeCount,
    `${label}: strokes length (${data.strokes?.length}) equals strokeCount (${data.strokeCount})`
  );
  assert(Array.isArray(data.principles), `${label}: principles is an array`);

  data.strokes.forEach((stroke, idx) => {
    const expectedOrder = idx + 1;
    assert(stroke.order === expectedOrder, `${label} Stroke ${idx + 1}: order equals ${expectedOrder}`);
    assert(
      typeof stroke.direction === 'string' && stroke.direction.trim().length > 0,
      `${label} Stroke ${idx + 1}: direction is non-empty`
    );
    assert(
      typeof stroke.startPoint?.x === 'number' && stroke.startPoint.x >= 0 && stroke.startPoint.x <= 100 &&
      typeof stroke.startPoint?.y === 'number' && stroke.startPoint.y >= 0 && stroke.startPoint.y <= 100,
      `${label} Stroke ${idx + 1}: startPoint (${stroke.startPoint?.x}, ${stroke.startPoint?.y}) within 0-100`
    );
    assert(
      typeof stroke.endPoint?.x === 'number' && stroke.endPoint.x >= 0 && stroke.endPoint.x <= 100 &&
      typeof stroke.endPoint?.y === 'number' && stroke.endPoint.y >= 0 && stroke.endPoint.y <= 100,
      `${label} Stroke ${idx + 1}: endPoint (${stroke.endPoint?.x}, ${stroke.endPoint?.y}) within 0-100`
    );
    assert(
      typeof stroke.path === 'string' && stroke.path.startsWith('M'),
      `${label} Stroke ${idx + 1}: SVG path starts with M ("${stroke.path.slice(0, 15)}...")`
    );
    assert(
      typeof stroke.arrowAngle === 'number' && stroke.arrowAngle >= 0 && stroke.arrowAngle <= 360,
      `${label} Stroke ${idx + 1}: arrowAngle (${stroke.arrowAngle}) in [0, 360]`
    );
    assert(
      typeof stroke.description === 'string' && stroke.description.length > 0,
      `${label} Stroke ${idx + 1}: description is non-empty string`
    );
  });
}

// ── 2. Japanese Hiragana Stroke Validation ──
console.log('\n-> Validating Japanese Hiragana Characters...');
const testHiragana = ['あ', 'い', 'う', 'え', 'お', 'か', 'さ', 'た', 'な', 'は', 'ま', 'や', 'ら', 'わ', 'ん'];
testHiragana.forEach((char) => {
  const data = getStrokeData(char);
  validateStrokeData(data, `Hiragana '${char}'`);
});

// ── 3. Japanese Katakana Stroke Validation ──
console.log('\n-> Validating Japanese Katakana Characters...');
const testKatakana = ['ア', 'イ', 'ウ', 'エ', 'オ', 'カ', 'サ', 'タ', 'ナ', 'ハ', 'マ', 'ヤ', 'ラ', 'ワ', 'ン'];
testKatakana.forEach((char) => {
  const data = getStrokeData(char);
  validateStrokeData(data, `Katakana '${char}'`);
});

// ── 4. Essential N5 Kanji Stroke Validation ──
console.log('\n-> Validating Essential N5 Kanji Characters...');
const testKanji = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '百', '千', '万', '日', '月', '火', '水', '木', '金', '土', '人', '大', '中', '小', '山', '川'];
testKanji.forEach((char) => {
  const data = getStrokeData(char);
  validateStrokeData(data, `Kanji '${char}'`);
});

// ── 5. European / Latin Alphabet Heuristics Validation ──
console.log('\n-> Validating Latin Alphabet Letters & Procedural Fallbacks...');
const testLatin = ['A', 'B', 'C', 'D', 'E', 'F', 'H', 'I', 'O', 'T', 'X', 'Z', 'a', 'b', 'c', 'e', 'o'];
testLatin.forEach((char) => {
  const data = getStrokeData(char);
  validateStrokeData(data, `Latin '${char}'`);
});

// ── 6. Arbitrary Character Fallback Validation ──
console.log('\n-> Validating Unmapped Arbitrary Glyph Fallback...');
const unmappedData = getStrokeData('§');
validateStrokeData(unmappedData, `Unmapped '§'`);

console.log('\n----------------------------------------------------');
if (errors > 0) {
  console.error(`FAILED: ${errors} errors found in stroke order verification.`);
  process.exit(1);
} else {
  console.log('PASSED: All stroke order and direction assertions satisfied (0 errors).');
  console.log('----------------------------------------------------');
}
