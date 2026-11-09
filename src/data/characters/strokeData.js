/**
 * @file strokeData.js
 * @description Comprehensive stroke order and direction datasets for Japanese (Hiragana, Katakana, N5 Kanji)
 * and European/Latin alphabets. Features canonical calligraphy principles, relative (0-100) coordinates,
 * SVG trajectory paths, directional arrow angles, and procedural fallback heuristics.
 */

import { hiraganaData, katakanaData, kanjiN5Data } from './japanese.js';

// ── 1. CANONICAL CALLIGRAPHY RULES ───────────────────────────────────────────
export const CANONICAL_STROKE_RULES = [
  {
    id: 'top-to-bottom',
    title: 'Top to Bottom',
    titleJa: '上から下へ',
    description: 'Strokes positioned at the top of a character or radical are written before those below them.',
    example: '三, 言, E, F',
  },
  {
    id: 'left-to-right',
    title: 'Left to Right',
    titleJa: '左から右へ',
    description: 'Components on the left side (like radicals) are written before components on the right.',
    example: '川, 行, H, B',
  },
  {
    id: 'horizontal-before-vertical',
    title: 'Horizontal Before Vertical',
    titleJa: '横から縦へ',
    description: 'When horizontal and vertical strokes intersect, the horizontal stroke is drawn first.',
    example: '十, 木, t, +',
  },
  {
    id: 'center-before-sides',
    title: 'Center Before Sides',
    titleJa: '中から外へ',
    description: 'In vertically symmetrical characters, the center stroke is drawn before the flanking side wings.',
    example: '小, 水, 山',
  },
  {
    id: 'enclosure-before-inside',
    title: 'Enclosure Before Inside',
    titleJa: '外側から内側へ',
    description: 'Outer bounding frame strokes are drawn before the interior strokes are placed.',
    example: '日, 口, 月',
  },
  {
    id: 'close-enclosure-last',
    title: 'Close Enclosure Last',
    titleJa: '囲みを最後に閉じる',
    description: 'The bottom horizontal enclosing stroke is drawn only after all inside elements are finished.',
    example: '田, 目, 四, 国',
  },
  {
    id: 'minor-dot-last',
    title: 'Minor Dot / Accent Last',
    titleJa: '最後に点を打つ',
    description: 'Diacritics, accent dots, or trailing release slashes are written last.',
    example: '犬, 太, 玉, i, j',
  },
];

// ── 2. PRE-MAPPED STROKE ORDER DICTIONARY ────────────────────────────────────
export const strokeDictionary = {
  // ── HIRAGANA (Row A) ──
  'あ': {
    char: 'あ',
    strokeCount: 3,
    principles: ['Horizontal before vertical', 'Top to bottom'],
    strokes: [
      { order: 1, direction: 'left-to-right', startPoint: { x: 22, y: 32 }, endPoint: { x: 78, y: 32 }, path: 'M 22 32 L 78 32', arrowAngle: 0, description: 'Horizontal bar drawn firmly from left to right.' },
      { order: 2, direction: 'top-to-bottom-curve', startPoint: { x: 50, y: 16 }, endPoint: { x: 44, y: 86 }, path: 'M 50 16 Q 48 50 44 86', arrowAngle: 90, description: 'Vertical stem curving slightly left through the center.' },
      { order: 3, direction: 'loop-clockwise', startPoint: { x: 68, y: 44 }, endPoint: { x: 74, y: 78 }, path: 'M 68 44 C 20 38, 16 88, 52 82 C 78 78, 86 52, 60 52 C 40 52, 42 76, 74 78', arrowAngle: 135, description: 'Starting upper right, loop downward left and sweep around clockwise into a wide belly.' }
    ]
  },
  'い': {
    char: 'い',
    strokeCount: 2,
    principles: ['Left to right', 'Top to bottom'],
    strokes: [
      { order: 1, direction: 'top-to-bottom-curve', startPoint: { x: 30, y: 22 }, endPoint: { x: 32, y: 80 }, path: 'M 30 22 Q 24 55 32 80', arrowAngle: 90, description: 'Left vertical curve downward ending with an upward flick (hane).' },
      { order: 2, direction: 'top-to-bottom-short', startPoint: { x: 70, y: 35 }, endPoint: { x: 72, y: 68 }, path: 'M 70 35 Q 74 52 72 68', arrowAngle: 90, description: 'Shorter right stroke curving gently downward to balance.' }
    ]
  },
  'う': {
    char: 'う',
    strokeCount: 2,
    principles: ['Top to bottom'],
    strokes: [
      { order: 1, direction: 'diagonal-down-right', startPoint: { x: 42, y: 18 }, endPoint: { x: 58, y: 28 }, path: 'M 42 18 Q 50 24 58 28', arrowAngle: 45, description: 'Short diagonal dash at the top.' },
      { order: 2, direction: 'curved-arch', startPoint: { x: 34, y: 38 }, endPoint: { x: 36, y: 84 }, path: 'M 34 38 Q 78 40 76 64 Q 72 84 36 84', arrowAngle: 0, description: 'Sweep right, loop around a wide smooth arch downward.' }
    ]
  },
  'え': {
    char: 'え',
    strokeCount: 2,
    principles: ['Top to bottom'],
    strokes: [
      { order: 1, direction: 'diagonal-down-right', startPoint: { x: 45, y: 16 }, endPoint: { x: 56, y: 26 }, path: 'M 45 16 L 56 26', arrowAngle: 45, description: 'Top diagonal dash.' },
      { order: 2, direction: 'zigzag-wave', startPoint: { x: 30, y: 38 }, endPoint: { x: 80, y: 80 }, path: 'M 30 38 L 70 38 L 32 72 Q 54 62 72 70 Q 80 75 80 80', arrowAngle: 0, description: 'Across, diagonal down, reverse upward, and sweep right into a running wave.' }
    ]
  },
  'お': {
    char: 'お',
    strokeCount: 3,
    principles: ['Horizontal before vertical', 'Minor dot last'],
    strokes: [
      { order: 1, direction: 'left-to-right', startPoint: { x: 20, y: 34 }, endPoint: { x: 62, y: 34 }, path: 'M 20 34 L 62 34', arrowAngle: 0, description: 'Short horizontal stroke.' },
      { order: 2, direction: 'vertical-into-loop', startPoint: { x: 44, y: 18 }, endPoint: { x: 66, y: 78 }, path: 'M 44 18 L 44 68 Q 28 68 28 56 Q 28 46 44 48 Q 66 52 66 78', arrowAngle: 90, description: 'Vertical stem downward, loop up-left, then arc around to the lower right.' },
      { order: 3, direction: 'diagonal-dot', startPoint: { x: 74, y: 24 }, endPoint: { x: 84, y: 34 }, path: 'M 74 24 L 84 34', arrowAngle: 45, description: 'Accent release dot in the upper-right corner.' }
    ]
  },

  // ── HIRAGANA (Row Ka) ──
  'か': {
    char: 'か',
    strokeCount: 3,
    principles: ['Left to right', 'Minor dot last'],
    strokes: [
      { order: 1, direction: 'curve-with-hook', startPoint: { x: 28, y: 26 }, endPoint: { x: 38, y: 82 }, path: 'M 28 26 L 54 26 Q 56 50 44 76 L 38 82', arrowAngle: 0, description: 'Horizontal bar right, curved stem downward with an inward hook.' },
      { order: 2, direction: 'vertical-slice', startPoint: { x: 38, y: 20 }, endPoint: { x: 26, y: 80 }, path: 'M 38 20 Q 32 50 26 80', arrowAngle: 110, description: 'Downward vertical stroke crossing the first stroke.' },
      { order: 3, direction: 'diagonal-drop', startPoint: { x: 68, y: 34 }, endPoint: { x: 78, y: 44 }, path: 'M 68 34 L 78 44', arrowAngle: 45, description: 'Accent drop slash on the right side.' }
    ]
  },
  'き': {
    char: 'き',
    strokeCount: 4,
    principles: ['Top to bottom', 'Horizontal before vertical'],
    strokes: [
      { order: 1, direction: 'left-to-right', startPoint: { x: 30, y: 30 }, endPoint: { x: 70, y: 28 }, path: 'M 30 30 L 70 28', arrowAngle: 0, description: 'Upper horizontal bar tilting slightly up.' },
      { order: 2, direction: 'left-to-right', startPoint: { x: 26, y: 46 }, endPoint: { x: 74, y: 44 }, path: 'M 26 46 L 74 44', arrowAngle: 0, description: 'Longer lower horizontal bar parallel to first.' },
      { order: 3, direction: 'diagonal-down-hook', startPoint: { x: 58, y: 16 }, endPoint: { x: 42, y: 70 }, path: 'M 58 16 L 42 70', arrowAngle: 110, description: 'Diagonal stem cutting down across both bars with upward bounce.' },
      { order: 4, direction: 'bottom-curve', startPoint: { x: 34, y: 78 }, endPoint: { x: 64, y: 78 }, path: 'M 34 78 Q 48 86 64 78', arrowAngle: 0, description: 'Bottom curved crescent line.' }
    ]
  },
  'く': {
    char: 'く',
    strokeCount: 1,
    principles: ['Top to bottom'],
    strokes: [
      { order: 1, direction: 'chevron-angle', startPoint: { x: 64, y: 24 }, endPoint: { x: 64, y: 78 }, path: 'M 64 24 L 32 50 L 64 78', arrowAngle: 145, description: 'Single fluid stroke: angle downward left, then turn downward right.' }
    ]
  },
  'け': {
    char: 'け',
    strokeCount: 3,
    principles: ['Left to right', 'Top to bottom'],
    strokes: [
      { order: 1, direction: 'top-to-bottom-curve', startPoint: { x: 30, y: 20 }, endPoint: { x: 28, y: 82 }, path: 'M 30 20 Q 28 55 28 82', arrowAngle: 90, description: 'Left vertical stem curving slightly with bottom hook.' },
      { order: 2, direction: 'left-to-right', startPoint: { x: 46, y: 36 }, endPoint: { x: 80, y: 36 }, path: 'M 46 36 L 80 36', arrowAngle: 0, description: 'Horizontal crossbar on right.' },
      { order: 3, direction: 'top-to-bottom-curve', startPoint: { x: 64, y: 22 }, endPoint: { x: 68, y: 82 }, path: 'M 64 22 Q 66 50 68 82', arrowAngle: 90, description: 'Vertical stem intersecting horizontal bar.' }
    ]
  },
  'こ': {
    char: 'こ',
    strokeCount: 2,
    principles: ['Top to bottom', 'Left to right'],
    strokes: [
      { order: 1, direction: 'left-to-right', startPoint: { x: 32, y: 32 }, endPoint: { x: 68, y: 32 }, path: 'M 32 32 Q 50 30 68 32', arrowAngle: 0, description: 'Top horizontal stroke with slight downward hook.' },
      { order: 2, direction: 'left-to-right-curve', startPoint: { x: 30, y: 72 }, endPoint: { x: 70, y: 68 }, path: 'M 30 72 Q 52 76 70 68', arrowAngle: 0, description: 'Bottom curved stroke answering the top.' }
    ]
  },

  // ── HIRAGANA (Row Sa) ──
  'さ': {
    char: 'さ',
    strokeCount: 3,
    principles: ['Horizontal before vertical', 'Top to bottom'],
    strokes: [
      { order: 1, direction: 'left-to-right', startPoint: { x: 28, y: 34 }, endPoint: { x: 72, y: 32 }, path: 'M 28 34 L 72 32', arrowAngle: 0, description: 'Horizontal bar tilting slightly upward.' },
      { order: 2, direction: 'diagonal-down-hook', startPoint: { x: 58, y: 18 }, endPoint: { x: 42, y: 68 }, path: 'M 58 18 L 42 68', arrowAngle: 110, description: 'Diagonal down stroke cutting the bar with a bounce.' },
      { order: 3, direction: 'bottom-loop-arc', startPoint: { x: 32, y: 76 }, endPoint: { x: 62, y: 76 }, path: 'M 32 76 Q 46 86 62 76', arrowAngle: 0, description: 'Bottom crescent arc completing the rhythm.' }
    ]
  },
  'し': {
    char: 'し',
    strokeCount: 1,
    principles: ['Top to bottom'],
    strokes: [
      { order: 1, direction: 'hook-curve', startPoint: { x: 42, y: 20 }, endPoint: { x: 74, y: 64 }, path: 'M 42 20 L 42 66 Q 42 82 58 82 Q 72 82 74 64', arrowAngle: 90, description: 'Vertical stem downward curving smoothly up into an open hook.' }
    ]
  },
  'す': {
    char: 'す',
    strokeCount: 2,
    principles: ['Horizontal before vertical'],
    strokes: [
      { order: 1, direction: 'left-to-right', startPoint: { x: 20, y: 34 }, endPoint: { x: 80, y: 34 }, path: 'M 20 34 L 80 34', arrowAngle: 0, description: 'Wide horizontal stroke.' },
      { order: 2, direction: 'vertical-loop-drop', startPoint: { x: 54, y: 16 }, endPoint: { x: 40, y: 88 }, path: 'M 54 16 L 54 50 Q 54 62 42 62 Q 32 54 44 48 Q 54 48 54 66 L 40 88', arrowAngle: 90, description: 'Vertical stem downward, looping counter-clockwise, and releasing down.' }
    ]
  },
  'せ': {
    char: 'せ',
    strokeCount: 3,
    principles: ['Horizontal before vertical', 'Left to right'],
    strokes: [
      { order: 1, direction: 'left-to-right', startPoint: { x: 22, y: 40 }, endPoint: { x: 78, y: 38 }, path: 'M 22 40 L 78 38', arrowAngle: 0, description: 'Horizontal crossbar.' },
      { order: 2, direction: 'vertical-with-hook', startPoint: { x: 66, y: 22 }, endPoint: { x: 66, y: 78 }, path: 'M 66 22 L 66 74 Q 66 78 58 78', arrowAngle: 90, description: 'Right vertical stem with short inward turn.' },
      { order: 3, direction: 'vertical-curve-base', startPoint: { x: 38, y: 26 }, endPoint: { x: 78, y: 76 }, path: 'M 38 26 L 38 72 Q 38 78 48 78 L 78 76', arrowAngle: 90, description: 'Left vertical stem turning into bottom baseline right.' }
    ]
  },
  'そ': {
    char: 'そ',
    strokeCount: 1,
    principles: ['Top to bottom'],
    strokes: [
      { order: 1, direction: 'zigzag-curve', startPoint: { x: 34, y: 24 }, endPoint: { x: 74, y: 78 }, path: 'M 34 24 L 66 24 L 34 50 L 68 50 Q 72 78 44 80 Q 64 80 74 78', arrowAngle: 0, description: 'Continuous stroke: top bar, diagonal, mid bar, curving down into wide loop.' }
    ]
  },

  // ── HIRAGANA (Row Ta) ──
  'た': {
    char: 'た',
    strokeCount: 4,
    principles: ['Left to right', 'Top to bottom'],
    strokes: [
      { order: 1, direction: 'left-to-right', startPoint: { x: 20, y: 36 }, endPoint: { x: 48, y: 36 }, path: 'M 20 36 L 48 36', arrowAngle: 0, description: 'Short horizontal bar on left.' },
      { order: 2, direction: 'diagonal-slice', startPoint: { x: 38, y: 22 }, endPoint: { x: 26, y: 78 }, path: 'M 38 22 L 26 78', arrowAngle: 110, description: 'Vertical-diagonal slash crossing the first stroke.' },
      { order: 3, direction: 'left-to-right', startPoint: { x: 54, y: 42 }, endPoint: { x: 78, y: 40 }, path: 'M 54 42 L 78 40', arrowAngle: 0, description: 'Top mini-horizontal stroke on right.' },
      { order: 4, direction: 'left-to-right-curve', startPoint: { x: 50, y: 64 }, endPoint: { x: 80, y: 62 }, path: 'M 50 64 Q 65 68 80 62', arrowAngle: 0, description: 'Bottom mini-curve on right.' }
    ]
  },
  'ち': {
    char: 'ち',
    strokeCount: 2,
    principles: ['Horizontal before vertical', 'Top to bottom'],
    strokes: [
      { order: 1, direction: 'left-to-right', startPoint: { x: 26, y: 32 }, endPoint: { x: 74, y: 32 }, path: 'M 26 32 L 74 32', arrowAngle: 0, description: 'Horizontal crossbar.' },
      { order: 2, direction: 'vertical-into-loop', startPoint: { x: 50, y: 18 }, endPoint: { x: 62, y: 82 }, path: 'M 50 18 L 50 52 Q 74 52 74 68 Q 74 84 50 84 Q 38 84 38 78', arrowAngle: 90, description: 'Vertical stem downward turning into a round open bowl.' }
    ]
  },
  'つ': {
    char: 'つ',
    strokeCount: 1,
    principles: ['Top to bottom'],
    strokes: [
      { order: 1, direction: 'wave-crest', startPoint: { x: 26, y: 34 }, endPoint: { x: 34, y: 82 }, path: 'M 26 34 Q 76 28 78 54 Q 78 78 34 82', arrowAngle: 0, description: 'Horizontal surge right, rounding into a majestic tsunami curve downward.' }
    ]
  },
  'て': {
    char: 'て',
    strokeCount: 1,
    principles: ['Top to bottom'],
    strokes: [
      { order: 1, direction: 'bar-and-bowl', startPoint: { x: 28, y: 32 }, endPoint: { x: 72, y: 78 }, path: 'M 28 32 L 72 32 L 36 60 Q 36 78 54 80 Q 68 80 72 78', arrowAngle: 0, description: 'Horizontal bar right, diagonal slant left, sweeping into an open rounded tail.' }
    ]
  },
  'と': {
    char: 'と',
    strokeCount: 2,
    principles: ['Top to bottom'],
    strokes: [
      { order: 1, direction: 'diagonal-down-right', startPoint: { x: 42, y: 22 }, endPoint: { x: 56, y: 44 }, path: 'M 42 22 L 56 44', arrowAngle: 45, description: 'Short diagonal stroke.' },
      { order: 2, direction: 'wide-c-curve', startPoint: { x: 66, y: 32 }, endPoint: { x: 60, y: 82 }, path: 'M 66 32 L 40 50 Q 38 74 54 82 L 60 82', arrowAngle: 135, description: 'Diagonal down-left meeting stroke 1, sweeping into a large round belly.' }
    ]
  },

  // ── HIRAGANA (Row Na) ──
  'な': {
    char: 'な',
    strokeCount: 4,
    principles: ['Left to right', 'Top to bottom'],
    strokes: [
      { order: 1, direction: 'left-to-right', startPoint: { x: 22, y: 36 }, endPoint: { x: 46, y: 36 }, path: 'M 22 36 L 46 36', arrowAngle: 0, description: 'Left horizontal bar.' },
      { order: 2, direction: 'diagonal-down-left', startPoint: { x: 38, y: 22 }, endPoint: { x: 26, y: 78 }, path: 'M 38 22 L 26 78', arrowAngle: 110, description: 'Diagonal stem slicing through.' },
      { order: 3, direction: 'diagonal-dot', startPoint: { x: 58, y: 30 }, endPoint: { x: 66, y: 40 }, path: 'M 58 30 L 66 40', arrowAngle: 45, description: 'Upper right dot.' },
      { order: 4, direction: 'vertical-loop', startPoint: { x: 68, y: 44 }, endPoint: { x: 64, y: 82 }, path: 'M 68 44 L 68 68 Q 54 68 54 58 Q 54 50 68 52 L 64 82', arrowAngle: 90, description: 'Vertical stem looping around into a tail.' }
    ]
  },
  'に': {
    char: 'に',
    strokeCount: 3,
    principles: ['Left to right', 'Top to bottom'],
    strokes: [
      { order: 1, direction: 'vertical-stem', startPoint: { x: 28, y: 20 }, endPoint: { x: 28, y: 80 }, path: 'M 28 20 Q 26 50 28 80', arrowAngle: 90, description: 'Left vertical stem with hook.' },
      { order: 2, direction: 'left-to-right', startPoint: { x: 50, y: 38 }, endPoint: { x: 78, y: 36 }, path: 'M 50 38 L 78 36', arrowAngle: 0, description: 'Upper horizontal bar on right.' },
      { order: 3, direction: 'left-to-right-curve', startPoint: { x: 48, y: 68 }, endPoint: { x: 80, y: 66 }, path: 'M 48 68 Q 64 72 80 66', arrowAngle: 0, description: 'Lower horizontal bar on right.' }
    ]
  },
  'ぬ': {
    char: 'ぬ',
    strokeCount: 2,
    principles: ['Left to right'],
    strokes: [
      { order: 1, direction: 'diagonal-down-right', startPoint: { x: 38, y: 22 }, endPoint: { x: 28, y: 78 }, path: 'M 38 22 L 28 78', arrowAngle: 110, description: 'Left diagonal stroke.' },
      { order: 2, direction: 'loop-and-knot', startPoint: { x: 24, y: 44 }, endPoint: { x: 78, y: 76 }, path: 'M 24 44 Q 68 34 70 64 Q 70 82 48 82 Q 32 82 46 64 Q 64 64 74 72 L 78 76', arrowAngle: 0, description: 'Wide sweep looping around with a decorative little knot at the end.' }
    ]
  },
  'ね': {
    char: 'ね',
    strokeCount: 2,
    principles: ['Left to right'],
    strokes: [
      { order: 1, direction: 'vertical-stem', startPoint: { x: 32, y: 18 }, endPoint: { x: 32, y: 82 }, path: 'M 32 18 L 32 82', arrowAngle: 90, description: 'Straight vertical stem on left.' },
      { order: 2, direction: 'z-loop-knot', startPoint: { x: 20, y: 34 }, endPoint: { x: 74, y: 76 }, path: 'M 20 34 L 56 34 L 28 66 Q 52 56 70 66 Q 74 76 66 82 Q 58 76 68 70 L 74 76', arrowAngle: 0, description: 'Horizontal, diagonal, loop upward, and loop into a cute cat-tail knot.' }
    ]
  },
  'の': {
    char: 'の',
    strokeCount: 1,
    principles: ['Top to bottom'],
    strokes: [
      { order: 1, direction: 'spiral-loop', startPoint: { x: 50, y: 30 }, endPoint: { x: 42, y: 78 }, path: 'M 50 30 L 36 62 Q 24 72 40 76 Q 78 76 76 46 Q 74 24 44 38 L 42 78', arrowAngle: 135, description: 'Diagonal down-left, then wide sweeping continuous spiral loop clockwise.' }
    ]
  },

  // ── HIRAGANA (Remaining Gojuon Key Anchors) ──
  'は': {
    char: 'は',
    strokeCount: 3,
    principles: ['Left to right', 'Top to bottom'],
    strokes: [
      { order: 1, direction: 'vertical-stem', startPoint: { x: 28, y: 18 }, endPoint: { x: 28, y: 82 }, path: 'M 28 18 L 28 82', arrowAngle: 90, description: 'Left vertical stem with hook.' },
      { order: 2, direction: 'left-to-right', startPoint: { x: 46, y: 36 }, endPoint: { x: 78, y: 36 }, path: 'M 46 36 L 78 36', arrowAngle: 0, description: 'Horizontal crossbar on right.' },
      { order: 3, direction: 'vertical-loop', startPoint: { x: 62, y: 22 }, endPoint: { x: 76, y: 78 }, path: 'M 62 22 L 62 66 Q 48 66 48 56 Q 48 48 62 50 L 76 78', arrowAngle: 90, description: 'Vertical stem downward, loop counter-clockwise, and sweep out right.' }
    ]
  },
  'ひ': {
    char: 'ひ',
    strokeCount: 1,
    principles: ['Top to bottom'],
    strokes: [
      { order: 1, direction: 'u-smile-curve', startPoint: { x: 26, y: 36 }, endPoint: { x: 74, y: 74 }, path: 'M 26 36 L 46 30 L 32 62 Q 38 78 56 78 Q 72 78 70 54 L 74 74', arrowAngle: 0, description: 'Horizontal tick, steep drop into a laughing smiling bowl, releasing right.' }
    ]
  },
  'ふ': {
    char: 'ふ',
    strokeCount: 4,
    principles: ['Center before sides', 'Top to bottom'],
    strokes: [
      { order: 1, direction: 'diagonal-dot', startPoint: { x: 50, y: 18 }, endPoint: { x: 54, y: 28 }, path: 'M 50 18 L 54 28', arrowAngle: 45, description: 'Top center dot.' },
      { order: 2, direction: 'center-curve-stem', startPoint: { x: 50, y: 38 }, endPoint: { x: 44, y: 74 }, path: 'M 50 38 Q 42 56 44 74', arrowAngle: 90, description: 'Central curved mountain ridge stem.' },
      { order: 3, direction: 'left-drop', startPoint: { x: 26, y: 52 }, endPoint: { x: 22, y: 64 }, path: 'M 26 52 L 22 64', arrowAngle: 120, description: 'Left flanking splash dot.' },
      { order: 4, direction: 'right-drop', startPoint: { x: 74, y: 52 }, endPoint: { x: 80, y: 66 }, path: 'M 74 52 L 80 66', arrowAngle: 45, description: 'Right flanking splash dot.' }
    ]
  },
  'へ': {
    char: 'へ',
    strokeCount: 1,
    principles: ['Top to bottom', 'Left to right'],
    strokes: [
      { order: 1, direction: 'peak-roof', startPoint: { x: 22, y: 64 }, endPoint: { x: 80, y: 64 }, path: 'M 22 64 L 46 32 L 80 64', arrowAngle: 315, description: 'Single stroke: climb up to the mountain summit, then glide down to the right.' }
    ]
  },
  'ほ': {
    char: 'ほ',
    strokeCount: 4,
    principles: ['Left to right', 'Horizontal before vertical'],
    strokes: [
      { order: 1, direction: 'vertical-stem', startPoint: { x: 28, y: 18 }, endPoint: { x: 28, y: 82 }, path: 'M 28 18 L 28 82', arrowAngle: 90, description: 'Left vertical stem with hook.' },
      { order: 2, direction: 'left-to-right', startPoint: { x: 46, y: 32 }, endPoint: { x: 78, y: 32 }, path: 'M 46 32 L 78 32', arrowAngle: 0, description: 'Upper horizontal crossbar.' },
      { order: 3, direction: 'left-to-right', startPoint: { x: 46, y: 48 }, endPoint: { x: 78, y: 48 }, path: 'M 46 48 L 78 48', arrowAngle: 0, description: 'Lower horizontal crossbar.' },
      { order: 4, direction: 'vertical-loop', startPoint: { x: 62, y: 32 }, endPoint: { x: 76, y: 78 }, path: 'M 62 32 L 62 66 Q 48 66 48 56 Q 48 48 62 50 L 76 78', arrowAngle: 90, description: 'Vertical stem downward, looping counter-clockwise, and releasing out.' }
    ]
  },
  'ま': {
    char: 'ま',
    strokeCount: 3,
    principles: ['Horizontal before vertical', 'Top to bottom'],
    strokes: [
      { order: 1, direction: 'left-to-right', startPoint: { x: 26, y: 32 }, endPoint: { x: 74, y: 32 }, path: 'M 26 32 L 74 32', arrowAngle: 0, description: 'Upper horizontal crossbar.' },
      { order: 2, direction: 'left-to-right', startPoint: { x: 28, y: 48 }, endPoint: { x: 72, y: 48 }, path: 'M 28 48 L 72 48', arrowAngle: 0, description: 'Lower horizontal crossbar.' },
      { order: 3, direction: 'vertical-loop', startPoint: { x: 50, y: 18 }, endPoint: { x: 68, y: 82 }, path: 'M 50 18 L 50 64 Q 38 64 38 54 Q 38 46 50 48 L 68 82', arrowAngle: 90, description: 'Vertical stem slicing both bars, looping, and sweeping out right.' }
    ]
  },
  'や': {
    char: 'や',
    strokeCount: 3,
    principles: ['Left to right', 'Top to bottom'],
    strokes: [
      { order: 1, direction: 'loop-and-hook', startPoint: { x: 30, y: 38 }, endPoint: { x: 44, y: 80 }, path: 'M 30 38 Q 66 30 72 50 Q 72 64 58 64 L 44 80', arrowAngle: 0, description: 'Horizontal arch right, hooking into an inward tail.' },
      { order: 2, direction: 'diagonal-dot', startPoint: { x: 64, y: 22 }, endPoint: { x: 70, y: 32 }, path: 'M 64 22 L 70 32', arrowAngle: 45, description: 'Upper right dot stroke.' },
      { order: 3, direction: 'diagonal-slash', startPoint: { x: 42, y: 18 }, endPoint: { x: 32, y: 82 }, path: 'M 42 18 L 32 82', arrowAngle: 110, description: 'Long vertical-diagonal slash crossing the character.' }
    ]
  },
  'ら': {
    char: 'ら',
    strokeCount: 2,
    principles: ['Top to bottom'],
    strokes: [
      { order: 1, direction: 'diagonal-dot', startPoint: { x: 44, y: 20 }, endPoint: { x: 56, y: 28 }, path: 'M 44 20 L 56 28', arrowAngle: 45, description: 'Top diagonal dash.' },
      { order: 2, direction: 'stem-into-bowl', startPoint: { x: 42, y: 38 }, endPoint: { x: 40, y: 82 }, path: 'M 42 38 L 42 54 Q 74 48 74 68 Q 74 82 40 82', arrowAngle: 90, description: 'Vertical drop turning into a wide open circular bowl.' }
    ]
  },
  'わ': {
    char: 'わ',
    strokeCount: 2,
    principles: ['Left to right'],
    strokes: [
      { order: 1, direction: 'vertical-stem', startPoint: { x: 34, y: 18 }, endPoint: { x: 34, y: 82 }, path: 'M 34 18 L 34 82', arrowAngle: 90, description: 'Left straight vertical stem.' },
      { order: 2, direction: 'z-and-wide-belly', startPoint: { x: 22, y: 36 }, endPoint: { x: 74, y: 78 }, path: 'M 22 36 L 56 36 L 30 68 Q 58 54 74 66 Q 78 78 50 82', arrowAngle: 0, description: 'Bar, diagonal down, then broad arching belly resembling a swan.' }
    ]
  },
  'ん': {
    char: 'ん',
    strokeCount: 1,
    principles: ['Top to bottom'],
    strokes: [
      { order: 1, direction: 'n-cursive-flow', startPoint: { x: 36, y: 22 }, endPoint: { x: 78, y: 72 }, path: 'M 36 22 L 28 64 Q 48 46 64 56 Q 74 64 68 76 L 78 72', arrowAngle: 110, description: 'Single graceful wave: diagonal down, swoop up into a crest, and release.' }
    ]
  },

  // ── KATAKANA (Core Alphabet) ──
  'ア': {
    char: 'ア',
    strokeCount: 2,
    principles: ['Top to bottom', 'Left to right'],
    strokes: [
      { order: 1, direction: 'left-to-right-down', startPoint: { x: 28, y: 28 }, endPoint: { x: 54, y: 52 }, path: 'M 28 28 L 72 28 L 54 52', arrowAngle: 0, description: 'Horizontal bar right, bending sharply downward left.' },
      { order: 2, direction: 'curving-sweep-left', startPoint: { x: 60, y: 32 }, endPoint: { x: 32, y: 82 }, path: 'M 60 32 Q 54 60 32 82', arrowAngle: 115, description: 'Long leftward sweeping curve tapering off smoothly.' }
    ]
  },
  'イ': {
    char: 'イ',
    strokeCount: 2,
    principles: ['Left to right', 'Top to bottom'],
    strokes: [
      { order: 1, direction: 'diagonal-down-left', startPoint: { x: 54, y: 22 }, endPoint: { x: 32, y: 56 }, path: 'M 54 22 L 32 56', arrowAngle: 125, description: 'Leftward diagonal slash.' },
      { order: 2, direction: 'vertical-stem', startPoint: { x: 44, y: 44 }, endPoint: { x: 44, y: 84 }, path: 'M 44 44 L 44 84', arrowAngle: 90, description: 'Straight vertical stem down.' }
    ]
  },
  'ウ': {
    char: 'ウ',
    strokeCount: 3,
    principles: ['Top to bottom', 'Enclosure before inside'],
    strokes: [
      { order: 1, direction: 'diagonal-dot', startPoint: { x: 50, y: 16 }, endPoint: { x: 50, y: 28 }, path: 'M 50 16 L 50 28', arrowAngle: 90, description: 'Top center dot.' },
      { order: 2, direction: 'short-down-left', startPoint: { x: 30, y: 36 }, endPoint: { x: 28, y: 48 }, path: 'M 30 36 L 28 48', arrowAngle: 95, description: 'Left shoulder tick.' },
      { order: 3, direction: 'bar-and-curve-left', startPoint: { x: 28, y: 38 }, endPoint: { x: 38, y: 84 }, path: 'M 28 38 L 74 38 L 74 48 Q 68 72 38 84', arrowAngle: 0, description: 'Horizontal crossbar, corner bend, and sweep leftward.' }
    ]
  },
  'エ': {
    char: 'エ',
    strokeCount: 3,
    principles: ['Top to bottom', 'Horizontal before vertical'],
    strokes: [
      { order: 1, direction: 'left-to-right', startPoint: { x: 30, y: 24 }, endPoint: { x: 70, y: 24 }, path: 'M 30 24 L 70 24', arrowAngle: 0, description: 'Top horizontal beam.' },
      { order: 2, direction: 'vertical-stem', startPoint: { x: 50, y: 24 }, endPoint: { x: 50, y: 76 }, path: 'M 50 24 L 50 76', arrowAngle: 90, description: 'Central vertical pillar.' },
      { order: 3, direction: 'left-to-right', startPoint: { x: 22, y: 76 }, endPoint: { x: 78, y: 76 }, path: 'M 22 76 L 78 76', arrowAngle: 0, description: 'Bottom wide supporting foundation.' }
    ]
  },
  'オ': {
    char: 'オ',
    strokeCount: 3,
    principles: ['Horizontal before vertical', 'Left to right'],
    strokes: [
      { order: 1, direction: 'left-to-right', startPoint: { x: 24, y: 34 }, endPoint: { x: 76, y: 34 }, path: 'M 24 34 L 76 34', arrowAngle: 0, description: 'Horizontal crossbar.' },
      { order: 2, direction: 'vertical-with-hook', startPoint: { x: 54, y: 18 }, endPoint: { x: 44, y: 82 }, path: 'M 54 18 L 54 78 L 44 82', arrowAngle: 90, description: 'Vertical stem with upward left hook.' },
      { order: 3, direction: 'diagonal-slash-left', startPoint: { x: 52, y: 40 }, endPoint: { x: 26, y: 78 }, path: 'M 52 40 L 26 78', arrowAngle: 125, description: 'Diagonal release slash down-left.' }
    ]
  },
  'カ': {
    char: 'カ',
    strokeCount: 2,
    principles: ['Left to right'],
    strokes: [
      { order: 1, direction: 'bar-and-hook', startPoint: { x: 28, y: 28 }, endPoint: { x: 46, y: 80 }, path: 'M 28 28 L 68 28 L 58 76 L 46 80', arrowAngle: 0, description: 'Horizontal bar right, bend and downward hook.' },
      { order: 2, direction: 'diagonal-slash-left', startPoint: { x: 50, y: 18 }, endPoint: { x: 28, y: 82 }, path: 'M 50 18 Q 44 54 28 82', arrowAngle: 115, description: 'Graceful sweeping diagonal slash crossing through.' }
    ]
  },
  'サ': {
    char: 'サ',
    strokeCount: 3,
    principles: ['Horizontal before vertical', 'Left to right'],
    strokes: [
      { order: 1, direction: 'left-to-right', startPoint: { x: 22, y: 36 }, endPoint: { x: 78, y: 36 }, path: 'M 22 36 L 78 36', arrowAngle: 0, description: 'Horizontal crossbar.' },
      { order: 2, direction: 'vertical-stem', startPoint: { x: 38, y: 22 }, endPoint: { x: 38, y: 72 }, path: 'M 38 22 L 38 72', arrowAngle: 90, description: 'Left vertical post.' },
      { order: 3, direction: 'vertical-curve-left', startPoint: { x: 62, y: 20 }, endPoint: { x: 52, y: 82 }, path: 'M 62 20 Q 62 55 52 82', arrowAngle: 95, description: 'Right vertical stem curving gently leftward.' }
    ]
  },
  'タ': {
    char: 'タ',
    strokeCount: 3,
    principles: ['Top to bottom', 'Left to right'],
    strokes: [
      { order: 1, direction: 'diagonal-down-left', startPoint: { x: 46, y: 20 }, endPoint: { x: 30, y: 46 }, path: 'M 46 20 L 30 46', arrowAngle: 125, description: 'Short left diagonal stroke.' },
      { order: 2, direction: 'bar-and-curve-left', startPoint: { x: 30, y: 36 }, endPoint: { x: 36, y: 84 }, path: 'M 30 36 L 72 36 Q 66 65 36 84', arrowAngle: 0, description: 'Horizontal bar right, sweeping down into leftward curve.' },
      { order: 3, direction: 'diagonal-dash-right', startPoint: { x: 42, y: 52 }, endPoint: { x: 68, y: 74 }, path: 'M 42 52 L 68 74', arrowAngle: 45, description: 'Crossing diagonal dash down-right.' }
    ]
  },
  'ナ': {
    char: 'ナ',
    strokeCount: 2,
    principles: ['Horizontal before vertical'],
    strokes: [
      { order: 1, direction: 'left-to-right', startPoint: { x: 24, y: 36 }, endPoint: { x: 76, y: 36 }, path: 'M 24 36 L 76 36', arrowAngle: 0, description: 'Firm horizontal crossbar.' },
      { order: 2, direction: 'diagonal-sweep-left', startPoint: { x: 54, y: 18 }, endPoint: { x: 26, y: 84 }, path: 'M 54 18 Q 48 52 26 84', arrowAngle: 115, description: 'Long leftward sweeping curve.' }
    ]
  },
  'ハ': {
    char: 'ハ',
    strokeCount: 2,
    principles: ['Left to right'],
    strokes: [
      { order: 1, direction: 'diagonal-down-left', startPoint: { x: 40, y: 26 }, endPoint: { x: 24, y: 76 }, path: 'M 40 26 L 24 76', arrowAngle: 115, description: 'Left downward slant.' },
      { order: 2, direction: 'diagonal-down-right', startPoint: { x: 60, y: 26 }, endPoint: { x: 76, y: 76 }, path: 'M 60 26 L 76 76', arrowAngle: 65, description: 'Right downward slant balancing the left.' }
    ]
  },
  'マ': {
    char: 'マ',
    strokeCount: 2,
    principles: ['Top to bottom'],
    strokes: [
      { order: 1, direction: 'bar-and-diagonal-left', startPoint: { x: 28, y: 32 }, endPoint: { x: 44, y: 64 }, path: 'M 28 32 L 72 32 L 44 64', arrowAngle: 0, description: 'Horizontal bar right, sharp diagonal back left.' },
      { order: 2, direction: 'diagonal-dash-right', startPoint: { x: 44, y: 52 }, endPoint: { x: 68, y: 78 }, path: 'M 44 52 L 68 78', arrowAngle: 45, description: 'Releasing diagonal stroke down-right.' }
    ]
  },
  'ヤ': {
    char: 'ヤ',
    strokeCount: 2,
    principles: ['Top to bottom'],
    strokes: [
      { order: 1, direction: 'arch-and-bend', startPoint: { x: 28, y: 44 }, endPoint: { x: 68, y: 64 }, path: 'M 28 44 L 66 32 L 72 44 L 68 64', arrowAngle: 350, description: 'Climb right, turn down and hook inward.' },
      { order: 2, direction: 'vertical-stem', startPoint: { x: 46, y: 18 }, endPoint: { x: 38, y: 82 }, path: 'M 46 18 L 38 82', arrowAngle: 95, description: 'Vertical stem downward through the character.' }
    ]
  },
  'ラ': {
    char: 'ラ',
    strokeCount: 2,
    principles: ['Top to bottom'],
    strokes: [
      { order: 1, direction: 'left-to-right', startPoint: { x: 34, y: 28 }, endPoint: { x: 66, y: 28 }, path: 'M 34 28 L 66 28', arrowAngle: 0, description: 'Top horizontal stroke.' },
      { order: 2, direction: 'bar-and-curve-left', startPoint: { x: 26, y: 48 }, endPoint: { x: 42, y: 82 }, path: 'M 26 48 L 74 48 L 72 58 Q 66 76 42 82', arrowAngle: 0, description: 'Horizontal bar, bending down into a left curve.' }
    ]
  },
  'ワ': {
    char: 'ワ',
    strokeCount: 2,
    principles: ['Left to right'],
    strokes: [
      { order: 1, direction: 'short-down', startPoint: { x: 30, y: 32 }, endPoint: { x: 28, y: 64 }, path: 'M 30 32 L 28 64', arrowAngle: 95, description: 'Left vertical tick.' },
      { order: 2, direction: 'bar-and-curve-left', startPoint: { x: 28, y: 34 }, endPoint: { x: 40, y: 82 }, path: 'M 28 34 L 74 34 L 74 48 Q 68 74 40 82', arrowAngle: 0, description: 'Horizontal bar right, turning down into a broad leftward curve.' }
    ]
  },
  'ン': {
    char: 'ン',
    strokeCount: 2,
    principles: ['Top to bottom'],
    strokes: [
      { order: 1, direction: 'diagonal-dot', startPoint: { x: 34, y: 30 }, endPoint: { x: 44, y: 44 }, path: 'M 34 30 L 44 44', arrowAngle: 45, description: 'Short upper diagonal dot.' },
      { order: 2, direction: 'upward-diagonal-sweep', startPoint: { x: 28, y: 76 }, endPoint: { x: 74, y: 34 }, path: 'M 28 76 Q 44 64 74 34', arrowAngle: 315, description: 'Rising diagonal stroke sweeping up from bottom-left to top-right.' }
    ]
  },

  // ── ESSENTIAL N5 KANJI ──
  '一': {
    char: '一',
    strokeCount: 1,
    principles: ['Left to right'],
    strokes: [
      { order: 1, direction: 'left-to-right', startPoint: { x: 18, y: 50 }, endPoint: { x: 82, y: 50 }, path: 'M 18 50 L 82 50', arrowAngle: 0, description: 'Single resolute horizontal stroke from left to right.' }
    ]
  },
  '二': {
    char: '二',
    strokeCount: 2,
    principles: ['Top to bottom', 'Left to right'],
    strokes: [
      { order: 1, direction: 'left-to-right', startPoint: { x: 28, y: 36 }, endPoint: { x: 72, y: 36 }, path: 'M 28 36 L 72 36', arrowAngle: 0, description: 'Upper horizontal stroke (shorter).' },
      { order: 2, direction: 'left-to-right', startPoint: { x: 18, y: 66 }, endPoint: { x: 82, y: 66 }, path: 'M 18 66 L 82 66', arrowAngle: 0, description: 'Lower horizontal stroke (longer foundation).' }
    ]
  },
  '三': {
    char: '三',
    strokeCount: 3,
    principles: ['Top to bottom', 'Left to right'],
    strokes: [
      { order: 1, direction: 'left-to-right', startPoint: { x: 26, y: 28 }, endPoint: { x: 74, y: 28 }, path: 'M 26 28 L 74 28', arrowAngle: 0, description: 'Top horizontal stroke.' },
      { order: 2, direction: 'left-to-right', startPoint: { x: 32, y: 50 }, endPoint: { x: 68, y: 50 }, path: 'M 32 50 L 68 50', arrowAngle: 0, description: 'Middle horizontal stroke (shortest).' },
      { order: 3, direction: 'left-to-right', startPoint: { x: 18, y: 74 }, endPoint: { x: 82, y: 74 }, path: 'M 18 74 L 82 74', arrowAngle: 0, description: 'Bottom horizontal stroke (longest).' }
    ]
  },
  '四': {
    char: '四',
    strokeCount: 5,
    principles: ['Enclosure before inside', 'Close enclosure last'],
    strokes: [
      { order: 1, direction: 'vertical-stem', startPoint: { x: 22, y: 22 }, endPoint: { x: 22, y: 78 }, path: 'M 22 22 L 22 78', arrowAngle: 90, description: 'Left vertical border of enclosure.' },
      { order: 2, direction: 'bar-and-down-hook', startPoint: { x: 22, y: 22 }, endPoint: { x: 78, y: 78 }, path: 'M 22 22 L 78 22 L 78 78', arrowAngle: 0, description: 'Top bar and right downward border with hook.' },
      { order: 3, direction: 'interior-curve-left', startPoint: { x: 38, y: 32 }, endPoint: { x: 32, y: 62 }, path: 'M 38 32 Q 34 50 32 62', arrowAngle: 110, description: 'Interior left curved leg.' },
      { order: 4, direction: 'interior-hook-right', startPoint: { x: 58, y: 30 }, endPoint: { x: 66, y: 62 }, path: 'M 58 30 L 58 58 L 66 62', arrowAngle: 90, description: 'Interior right leg with foot.' },
      { order: 5, direction: 'close-enclosure', startPoint: { x: 22, y: 78 }, endPoint: { x: 78, y: 78 }, path: 'M 22 78 L 78 78', arrowAngle: 0, description: 'Bottom horizontal baseline closing the box last.' }
    ]
  },
  '五': {
    char: '五',
    strokeCount: 4,
    principles: ['Horizontal before vertical', 'Top to bottom'],
    strokes: [
      { order: 1, direction: 'left-to-right', startPoint: { x: 24, y: 24 }, endPoint: { x: 76, y: 24 }, path: 'M 24 24 L 76 24', arrowAngle: 0, description: 'Top horizontal bar.' },
      { order: 2, direction: 'slant-down-left', startPoint: { x: 48, y: 24 }, endPoint: { x: 42, y: 76 }, path: 'M 48 24 L 42 76', arrowAngle: 95, description: 'Central downward slant.' },
      { order: 3, direction: 'horizontal-turn-down', startPoint: { x: 30, y: 48 }, endPoint: { x: 68, y: 76 }, path: 'M 30 48 L 68 48 L 68 76', arrowAngle: 0, description: 'Middle bar turning down to form right leg.' },
      { order: 4, direction: 'left-to-right', startPoint: { x: 18, y: 76 }, endPoint: { x: 82, y: 76 }, path: 'M 18 76 L 82 76', arrowAngle: 0, description: 'Bottom closing baseline.' }
    ]
  },
  '六': {
    char: '六',
    strokeCount: 4,
    principles: ['Top to bottom', 'Left to right'],
    strokes: [
      { order: 1, direction: 'diagonal-dot', startPoint: { x: 50, y: 18 }, endPoint: { x: 50, y: 30 }, path: 'M 50 18 L 50 30', arrowAngle: 90, description: 'Top center dot.' },
      { order: 2, direction: 'left-to-right', startPoint: { x: 20, y: 38 }, endPoint: { x: 80, y: 38 }, path: 'M 20 38 L 80 38', arrowAngle: 0, description: 'Wide horizontal crossbar.' },
      { order: 3, direction: 'diagonal-slash-left', startPoint: { x: 42, y: 48 }, endPoint: { x: 26, y: 82 }, path: 'M 42 48 L 26 82', arrowAngle: 125, description: 'Left downward slant.' },
      { order: 4, direction: 'diagonal-dash-right', startPoint: { x: 58, y: 48 }, endPoint: { x: 74, y: 82 }, path: 'M 58 48 L 74 82', arrowAngle: 65, description: 'Right downward slant balancing the character.' }
    ]
  },
  '七': {
    char: '七',
    strokeCount: 2,
    principles: ['Horizontal before vertical'],
    strokes: [
      { order: 1, direction: 'left-to-right', startPoint: { x: 22, y: 48 }, endPoint: { x: 78, y: 42 }, path: 'M 22 48 L 78 42', arrowAngle: 350, description: 'Horizontal stroke tilting slightly up.' },
      { order: 2, direction: 'vertical-curve-hook', startPoint: { x: 50, y: 22 }, endPoint: { x: 74, y: 68 }, path: 'M 50 22 L 50 68 Q 50 78 62 78 L 74 68', arrowAngle: 90, description: 'Vertical stem bending into a curved bottom with upward flick.' }
    ]
  },
  '八': {
    char: '八',
    strokeCount: 2,
    principles: ['Left to right'],
    strokes: [
      { order: 1, direction: 'diagonal-slash-left', startPoint: { x: 44, y: 26 }, endPoint: { x: 24, y: 80 }, path: 'M 44 26 L 24 80', arrowAngle: 125, description: 'Left downward sweeping stroke.' },
      { order: 2, direction: 'diagonal-slash-right', startPoint: { x: 56, y: 18 }, endPoint: { x: 80, y: 82 }, path: 'M 56 18 L 80 82', arrowAngle: 65, description: 'Right sweeping stroke starting slightly higher.' }
    ]
  },
  '九': {
    char: '九',
    strokeCount: 2,
    principles: ['Left to right'],
    strokes: [
      { order: 1, direction: 'diagonal-slash-left', startPoint: { x: 48, y: 20 }, endPoint: { x: 26, y: 82 }, path: 'M 48 20 Q 42 56 26 82', arrowAngle: 115, description: 'Downward curved slant to the left.' },
      { order: 2, direction: 'bar-bend-and-hook', startPoint: { x: 26, y: 38 }, endPoint: { x: 76, y: 68 }, path: 'M 26 38 L 64 34 L 56 72 Q 56 82 68 82 L 76 68', arrowAngle: 0, description: 'Horizontal right, diagonal down, and sweeping bottom hook.' }
    ]
  },
  '十': {
    char: '十',
    strokeCount: 2,
    principles: ['Horizontal before vertical'],
    strokes: [
      { order: 1, direction: 'left-to-right', startPoint: { x: 20, y: 50 }, endPoint: { x: 80, y: 50 }, path: 'M 20 50 L 80 50', arrowAngle: 0, description: 'Horizontal crossbar.' },
      { order: 2, direction: 'vertical-stem', startPoint: { x: 50, y: 18 }, endPoint: { x: 50, y: 84 }, path: 'M 50 18 L 50 84', arrowAngle: 90, description: 'Central vertical stem intersecting cleanly.' }
    ]
  },
  '百': {
    char: '百',
    strokeCount: 6,
    principles: ['Top to bottom', 'Enclosure before inside', 'Close enclosure last'],
    strokes: [
      { order: 1, direction: 'left-to-right', startPoint: { x: 22, y: 22 }, endPoint: { x: 78, y: 22 }, path: 'M 22 22 L 78 22', arrowAngle: 0, description: 'Top horizontal stroke.' },
      { order: 2, direction: 'short-down', startPoint: { x: 50, y: 24 }, endPoint: { x: 44, y: 38 }, path: 'M 50 24 L 44 38', arrowAngle: 115, description: 'Short vertical-diagonal tick.' },
      { order: 3, direction: 'vertical-stem', startPoint: { x: 28, y: 40 }, endPoint: { x: 28, y: 84 }, path: 'M 28 40 L 28 84', arrowAngle: 90, description: 'Left vertical border of sun radical.' },
      { order: 4, direction: 'bar-and-down', startPoint: { x: 28, y: 40 }, endPoint: { x: 72, y: 84 }, path: 'M 28 40 L 72 40 L 72 84', arrowAngle: 0, description: 'Top and right border with downward hook.' },
      { order: 5, direction: 'left-to-right', startPoint: { x: 28, y: 62 }, endPoint: { x: 72, y: 62 }, path: 'M 28 62 L 72 62', arrowAngle: 0, description: 'Middle interior crossbar.' },
      { order: 6, direction: 'close-enclosure', startPoint: { x: 28, y: 84 }, endPoint: { x: 72, y: 84 }, path: 'M 28 84 L 72 84', arrowAngle: 0, description: 'Bottom closing baseline.' }
    ]
  },
  '千': {
    char: '千',
    strokeCount: 3,
    principles: ['Top to bottom', 'Horizontal before vertical'],
    strokes: [
      { order: 1, direction: 'diagonal-slash-left', startPoint: { x: 72, y: 24 }, endPoint: { x: 34, y: 32 }, path: 'M 72 24 L 34 32', arrowAngle: 165, description: 'Top slant from right to left.' },
      { order: 2, direction: 'left-to-right', startPoint: { x: 20, y: 48 }, endPoint: { x: 80, y: 48 }, path: 'M 20 48 L 80 48', arrowAngle: 0, description: 'Horizontal crossbar.' },
      { order: 3, direction: 'vertical-stem', startPoint: { x: 50, y: 22 }, endPoint: { x: 50, y: 86 }, path: 'M 50 22 L 50 86', arrowAngle: 90, description: 'Central vertical stem piercing down.' }
    ]
  },
  '万': {
    char: '万',
    strokeCount: 3,
    principles: ['Top to bottom'],
    strokes: [
      { order: 1, direction: 'left-to-right', startPoint: { x: 22, y: 26 }, endPoint: { x: 78, y: 26 }, path: 'M 22 26 L 78 26', arrowAngle: 0, description: 'Top horizontal crossbar.' },
      { order: 2, direction: 'bar-and-hook', startPoint: { x: 44, y: 26 }, endPoint: { x: 72, y: 70 }, path: 'M 44 26 L 40 48 L 70 48 L 68 76 L 60 76', arrowAngle: 90, description: 'Center downward slant turning right and hooking inward.' },
      { order: 3, direction: 'diagonal-slash-left', startPoint: { x: 54, y: 34 }, endPoint: { x: 26, y: 82 }, path: 'M 54 34 Q 48 60 26 82', arrowAngle: 115, description: 'Leftward sweeping curve.' }
    ]
  },
  '日': {
    char: '日',
    strokeCount: 4,
    principles: ['Enclosure before inside', 'Close enclosure last'],
    strokes: [
      { order: 1, direction: 'vertical-stem', startPoint: { x: 26, y: 22 }, endPoint: { x: 26, y: 82 }, path: 'M 26 22 L 26 82', arrowAngle: 90, description: 'Left vertical border.' },
      { order: 2, direction: 'bar-and-down-hook', startPoint: { x: 26, y: 22 }, endPoint: { x: 74, y: 82 }, path: 'M 26 22 L 74 22 L 74 82', arrowAngle: 0, description: 'Top horizontal and right vertical border with hook.' },
      { order: 3, direction: 'left-to-right', startPoint: { x: 26, y: 52 }, endPoint: { x: 74, y: 52 }, path: 'M 26 52 L 74 52', arrowAngle: 0, description: 'Middle interior horizontal divider.' },
      { order: 4, direction: 'close-enclosure', startPoint: { x: 26, y: 82 }, endPoint: { x: 74, y: 82 }, path: 'M 26 82 L 74 82', arrowAngle: 0, description: 'Bottom horizontal baseline closing the box.' }
    ]
  },
  '月': {
    char: '月',
    strokeCount: 4,
    principles: ['Enclosure before inside', 'Left to right'],
    strokes: [
      { order: 1, direction: 'vertical-curve-left', startPoint: { x: 28, y: 20 }, endPoint: { x: 24, y: 84 }, path: 'M 28 20 Q 28 60 24 84', arrowAngle: 90, description: 'Left vertical stem curving slightly outward.' },
      { order: 2, direction: 'bar-and-down-hook', startPoint: { x: 28, y: 20 }, endPoint: { x: 72, y: 84 }, path: 'M 28 20 L 72 20 L 72 84 L 62 84', arrowAngle: 0, description: 'Top bar, right vertical stem, and bottom hook.' },
      { order: 3, direction: 'left-to-right', startPoint: { x: 28, y: 44 }, endPoint: { x: 72, y: 44 }, path: 'M 28 44 L 72 44', arrowAngle: 0, description: 'Upper interior horizontal bar.' },
      { order: 4, direction: 'left-to-right', startPoint: { x: 28, y: 64 }, endPoint: { x: 72, y: 64 }, path: 'M 28 64 L 72 64', arrowAngle: 0, description: 'Lower interior horizontal bar.' }
    ]
  },
  '火': {
    char: '火',
    strokeCount: 4,
    principles: ['Center before sides', 'Left to right'],
    strokes: [
      { order: 1, direction: 'diagonal-slash-left', startPoint: { x: 30, y: 38 }, endPoint: { x: 24, y: 54 }, path: 'M 30 38 L 24 54', arrowAngle: 115, description: 'Left flame spark dot.' },
      { order: 2, direction: 'diagonal-dash-right', startPoint: { x: 70, y: 34 }, endPoint: { x: 76, y: 50 }, path: 'M 70 34 L 76 50', arrowAngle: 45, description: 'Right flame spark dot.' },
      { order: 3, direction: 'diagonal-sweep-left', startPoint: { x: 50, y: 18 }, endPoint: { x: 22, y: 84 }, path: 'M 50 18 Q 46 56 22 84', arrowAngle: 110, description: 'Long central stem curving gracefully leftward.' },
      { order: 4, direction: 'diagonal-slash-right', startPoint: { x: 48, y: 44 }, endPoint: { x: 78, y: 84 }, path: 'M 48 44 L 78 84', arrowAngle: 55, description: 'Right supporting sweeping branch.' }
    ]
  },
  '水': {
    char: '水',
    strokeCount: 4,
    principles: ['Center before sides', 'Left to right'],
    strokes: [
      { order: 1, direction: 'vertical-stem-with-hook', startPoint: { x: 50, y: 16 }, endPoint: { x: 42, y: 84 }, path: 'M 50 16 L 50 80 L 42 84', arrowAngle: 90, description: 'Central vertical stem with bottom hook.' },
      { order: 2, direction: 'left-angle-bend', startPoint: { x: 24, y: 38 }, endPoint: { x: 48, y: 50 }, path: 'M 24 38 L 38 34 L 28 58 L 48 50', arrowAngle: 0, description: 'Left horizontal-diagonal bending stroke.' },
      { order: 3, direction: 'diagonal-slash-left', startPoint: { x: 74, y: 26 }, endPoint: { x: 52, y: 46 }, path: 'M 74 26 L 52 46', arrowAngle: 145, description: 'Upper right downward diagonal slant.' },
      { order: 4, direction: 'diagonal-sweep-right', startPoint: { x: 52, y: 48 }, endPoint: { x: 80, y: 84 }, path: 'M 52 48 L 80 84', arrowAngle: 55, description: 'Lower right broad sweeping release.' }
    ]
  },
  '木': {
    char: '木',
    strokeCount: 4,
    principles: ['Horizontal before vertical', 'Left to right'],
    strokes: [
      { order: 1, direction: 'left-to-right', startPoint: { x: 20, y: 40 }, endPoint: { x: 80, y: 40 }, path: 'M 20 40 L 80 40', arrowAngle: 0, description: 'Horizontal crossbar.' },
      { order: 2, direction: 'vertical-stem', startPoint: { x: 50, y: 16 }, endPoint: { x: 50, y: 86 }, path: 'M 50 16 L 50 86', arrowAngle: 90, description: 'Central vertical tree trunk.' },
      { order: 3, direction: 'diagonal-sweep-left', startPoint: { x: 50, y: 40 }, endPoint: { x: 22, y: 82 }, path: 'M 50 40 Q 42 64 22 82', arrowAngle: 115, description: 'Left root branch curving down-left.' },
      { order: 4, direction: 'diagonal-sweep-right', startPoint: { x: 50, y: 40 }, endPoint: { x: 78, y: 82 }, path: 'M 50 40 L 78 82', arrowAngle: 55, description: 'Right root branch sweeping down-right.' }
    ]
  },
  '金': {
    char: '金',
    strokeCount: 8,
    principles: ['Top to bottom', 'Horizontal before vertical'],
    strokes: [
      { order: 1, direction: 'diagonal-sweep-left', startPoint: { x: 50, y: 16 }, endPoint: { x: 22, y: 42 }, path: 'M 50 16 L 22 42', arrowAngle: 125, description: 'Top left sweeping roof stroke.' },
      { order: 2, direction: 'diagonal-sweep-right', startPoint: { x: 50, y: 18 }, endPoint: { x: 78, y: 42 }, path: 'M 50 18 L 78 42', arrowAngle: 55, description: 'Top right sweeping roof stroke.' },
      { order: 3, direction: 'left-to-right', startPoint: { x: 34, y: 44 }, endPoint: { x: 66, y: 44 }, path: 'M 34 44 L 66 44', arrowAngle: 0, description: 'First horizontal bar.' },
      { order: 4, direction: 'left-to-right', startPoint: { x: 28, y: 56 }, endPoint: { x: 72, y: 56 }, path: 'M 28 56 L 72 56', arrowAngle: 0, description: 'Second horizontal bar.' },
      { order: 5, direction: 'vertical-stem', startPoint: { x: 50, y: 44 }, endPoint: { x: 50, y: 78 }, path: 'M 50 44 L 50 78', arrowAngle: 90, description: 'Central vertical pillar.' },
      { order: 6, direction: 'diagonal-slash-left', startPoint: { x: 38, y: 64 }, endPoint: { x: 32, y: 72 }, path: 'M 38 64 L 32 72', arrowAngle: 125, description: 'Left gold nugget dot.' },
      { order: 7, direction: 'diagonal-dash-right', startPoint: { x: 62, y: 64 }, endPoint: { x: 68, y: 72 }, path: 'M 62 64 L 68 72', arrowAngle: 45, description: 'Right gold nugget dot.' },
      { order: 8, direction: 'left-to-right', startPoint: { x: 18, y: 84 }, endPoint: { x: 82, y: 84 }, path: 'M 18 84 L 82 84', arrowAngle: 0, description: 'Bottom wide supporting foundation.' }
    ]
  },
  '土': {
    char: '土',
    strokeCount: 3,
    principles: ['Horizontal before vertical', 'Top to bottom'],
    strokes: [
      { order: 1, direction: 'left-to-right', startPoint: { x: 30, y: 40 }, endPoint: { x: 70, y: 40 }, path: 'M 30 40 L 70 40', arrowAngle: 0, description: 'Upper horizontal bar (shorter).' },
      { order: 2, direction: 'vertical-stem', startPoint: { x: 50, y: 18 }, endPoint: { x: 50, y: 82 }, path: 'M 50 18 L 50 82', arrowAngle: 90, description: 'Central vertical stem.' },
      { order: 3, direction: 'left-to-right', startPoint: { x: 18, y: 82 }, endPoint: { x: 82, y: 82 }, path: 'M 18 82 L 82 82', arrowAngle: 0, description: 'Bottom broad earth foundation bar.' }
    ]
  },
  '人': {
    char: '人',
    strokeCount: 2,
    principles: ['Left to right'],
    strokes: [
      { order: 1, direction: 'diagonal-sweep-left', startPoint: { x: 50, y: 18 }, endPoint: { x: 22, y: 82 }, path: 'M 50 18 Q 44 56 22 82', arrowAngle: 115, description: 'Primary left sweeping leg.' },
      { order: 2, direction: 'diagonal-sweep-right', startPoint: { x: 44, y: 46 }, endPoint: { x: 78, y: 82 }, path: 'M 44 46 L 78 82', arrowAngle: 55, description: 'Supporting right leg leaning into the first.' }
    ]
  },
  '大': {
    char: '大',
    strokeCount: 3,
    principles: ['Horizontal before vertical', 'Left to right'],
    strokes: [
      { order: 1, direction: 'left-to-right', startPoint: { x: 18, y: 38 }, endPoint: { x: 82, y: 38 }, path: 'M 18 38 L 82 38', arrowAngle: 0, description: 'Wide horizontal arms.' },
      { order: 2, direction: 'diagonal-sweep-left', startPoint: { x: 50, y: 18 }, endPoint: { x: 22, y: 84 }, path: 'M 50 18 Q 46 54 22 84', arrowAngle: 110, description: 'Central stem sweeping down-left.' },
      { order: 3, direction: 'diagonal-sweep-right', startPoint: { x: 48, y: 40 }, endPoint: { x: 78, y: 84 }, path: 'M 48 40 L 78 84', arrowAngle: 55, description: 'Right leg stretching down-right.' }
    ]
  },
  '中': {
    char: '中',
    strokeCount: 4,
    principles: ['Enclosure before inside', 'Close enclosure last'],
    strokes: [
      { order: 1, direction: 'vertical-stem', startPoint: { x: 24, y: 30 }, endPoint: { x: 24, y: 64 }, path: 'M 24 30 L 24 64', arrowAngle: 90, description: 'Left vertical frame.' },
      { order: 2, direction: 'bar-and-down', startPoint: { x: 24, y: 30 }, endPoint: { x: 76, y: 64 }, path: 'M 24 30 L 76 30 L 76 64', arrowAngle: 0, description: 'Top bar and right frame.' },
      { order: 3, direction: 'close-enclosure', startPoint: { x: 24, y: 64 }, endPoint: { x: 76, y: 64 }, path: 'M 24 64 L 76 64', arrowAngle: 0, description: 'Bottom closing bar of box.' },
      { order: 4, direction: 'vertical-pierce', startPoint: { x: 50, y: 16 }, endPoint: { x: 50, y: 86 }, path: 'M 50 16 L 50 86', arrowAngle: 90, description: 'Central vertical line piercing cleanly through the center.' }
    ]
  },
  '小': {
    char: '小',
    strokeCount: 3,
    principles: ['Center before sides', 'Left to right'],
    strokes: [
      { order: 1, direction: 'vertical-with-hook', startPoint: { x: 50, y: 16 }, endPoint: { x: 42, y: 82 }, path: 'M 50 16 L 50 78 L 42 82', arrowAngle: 90, description: 'Central vertical stem with left hook.' },
      { order: 2, direction: 'diagonal-slash-left', startPoint: { x: 30, y: 40 }, endPoint: { x: 22, y: 62 }, path: 'M 30 40 L 22 62', arrowAngle: 125, description: 'Left flanking wing dot.' },
      { order: 3, direction: 'diagonal-dash-right', startPoint: { x: 70, y: 40 }, endPoint: { x: 78, y: 62 }, path: 'M 70 40 L 78 62', arrowAngle: 45, description: 'Right flanking wing dot.' }
    ]
  },
  '山': {
    char: '山',
    strokeCount: 3,
    principles: ['Center before sides', 'Left to right'],
    strokes: [
      { order: 1, direction: 'vertical-stem', startPoint: { x: 50, y: 18 }, endPoint: { x: 50, y: 80 }, path: 'M 50 18 L 50 80', arrowAngle: 90, description: 'Central tallest mountain peak.' },
      { order: 2, direction: 'vertical-bend-horizontal', startPoint: { x: 24, y: 42 }, endPoint: { x: 76, y: 80 }, path: 'M 24 42 L 24 80 L 76 80', arrowAngle: 90, description: 'Left peak turning into valley baseline.' },
      { order: 3, direction: 'vertical-stem', startPoint: { x: 76, y: 42 }, endPoint: { x: 76, y: 80 }, path: 'M 76 42 L 76 80', arrowAngle: 90, description: 'Right mountain peak.' }
    ]
  },
  '川': {
    char: '川',
    strokeCount: 3,
    principles: ['Left to right'],
    strokes: [
      { order: 1, direction: 'vertical-curve-left', startPoint: { x: 26, y: 22 }, endPoint: { x: 22, y: 78 }, path: 'M 26 22 Q 26 55 22 78', arrowAngle: 90, description: 'Left stream curving slightly outward.' },
      { order: 2, direction: 'vertical-stem', startPoint: { x: 50, y: 30 }, endPoint: { x: 50, y: 74 }, path: 'M 50 30 L 50 74', arrowAngle: 90, description: 'Middle stream (shorter).' },
      { order: 3, direction: 'vertical-stem', startPoint: { x: 74, y: 18 }, endPoint: { x: 74, y: 82 }, path: 'M 74 18 L 74 82', arrowAngle: 90, description: 'Right stream flowing full length.' }
    ]
  },

  // ── LATIN ALPHABET (Standard Penmanship Ductus) ──
  'A': {
    char: 'A',
    strokeCount: 3,
    principles: ['Left to right', 'Top to bottom', 'Horizontal before vertical'],
    strokes: [
      { order: 1, direction: 'diagonal-down-left', startPoint: { x: 50, y: 18 }, endPoint: { x: 24, y: 82 }, path: 'M 50 18 L 24 82', arrowAngle: 115, description: 'Left diagonal leg from apex.' },
      { order: 2, direction: 'diagonal-down-right', startPoint: { x: 50, y: 18 }, endPoint: { x: 76, y: 82 }, path: 'M 50 18 L 76 82', arrowAngle: 65, description: 'Right diagonal leg from apex.' },
      { order: 3, direction: 'left-to-right', startPoint: { x: 34, y: 58 }, endPoint: { x: 66, y: 58 }, path: 'M 34 58 L 66 58', arrowAngle: 0, description: 'Horizontal crossbar bridge.' }
    ]
  },
  'B': {
    char: 'B',
    strokeCount: 3,
    principles: ['Left to right', 'Top to bottom'],
    strokes: [
      { order: 1, direction: 'vertical-stem', startPoint: { x: 30, y: 18 }, endPoint: { x: 30, y: 82 }, path: 'M 30 18 L 30 82', arrowAngle: 90, description: 'Straight vertical spine.' },
      { order: 2, direction: 'upper-bowl', startPoint: { x: 30, y: 18 }, endPoint: { x: 30, y: 50 }, path: 'M 30 18 Q 72 18 72 34 Q 72 50 30 50', arrowAngle: 0, description: 'Top curved lobe.' },
      { order: 3, direction: 'lower-bowl', startPoint: { x: 30, y: 50 }, endPoint: { x: 30, y: 82 }, path: 'M 30 50 Q 76 50 76 66 Q 76 82 30 82', arrowAngle: 0, description: 'Bottom curved lobe.' }
    ]
  },
  'C': {
    char: 'C',
    strokeCount: 1,
    principles: ['Top to bottom'],
    strokes: [
      { order: 1, direction: 'counter-clockwise-arc', startPoint: { x: 74, y: 28 }, endPoint: { x: 74, y: 72 }, path: 'M 74 28 C 30 18, 24 82, 74 72', arrowAngle: 180, description: 'Continuous counter-clockwise open crescent.' }
    ]
  },
  'D': {
    char: 'D',
    strokeCount: 2,
    principles: ['Left to right', 'Top to bottom'],
    strokes: [
      { order: 1, direction: 'vertical-stem', startPoint: { x: 30, y: 18 }, endPoint: { x: 30, y: 82 }, path: 'M 30 18 L 30 82', arrowAngle: 90, description: 'Straight vertical spine.' },
      { order: 2, direction: 'large-bowl', startPoint: { x: 30, y: 18 }, endPoint: { x: 30, y: 82 }, path: 'M 30 18 C 80 18, 80 82, 30 82', arrowAngle: 0, description: 'Deep sweeping rightward bowl.' }
    ]
  },
  'E': {
    char: 'E',
    strokeCount: 4,
    principles: ['Top to bottom', 'Left to right'],
    strokes: [
      { order: 1, direction: 'vertical-stem', startPoint: { x: 30, y: 18 }, endPoint: { x: 30, y: 82 }, path: 'M 30 18 L 30 82', arrowAngle: 90, description: 'Left vertical spine.' },
      { order: 2, direction: 'left-to-right', startPoint: { x: 30, y: 18 }, endPoint: { x: 72, y: 18 }, path: 'M 30 18 L 72 18', arrowAngle: 0, description: 'Top horizontal crossbar.' },
      { order: 3, direction: 'left-to-right', startPoint: { x: 30, y: 50 }, endPoint: { x: 64, y: 50 }, path: 'M 30 50 L 64 50', arrowAngle: 0, description: 'Middle horizontal crossbar (shorter).' },
      { order: 4, direction: 'left-to-right', startPoint: { x: 30, y: 82 }, endPoint: { x: 74, y: 82 }, path: 'M 30 82 L 74 82', arrowAngle: 0, description: 'Bottom horizontal baseline.' }
    ]
  },
  'F': {
    char: 'F',
    strokeCount: 3,
    principles: ['Top to bottom', 'Left to right'],
    strokes: [
      { order: 1, direction: 'vertical-stem', startPoint: { x: 30, y: 18 }, endPoint: { x: 30, y: 82 }, path: 'M 30 18 L 30 82', arrowAngle: 90, description: 'Left vertical spine.' },
      { order: 2, direction: 'left-to-right', startPoint: { x: 30, y: 18 }, endPoint: { x: 72, y: 18 }, path: 'M 30 18 L 72 18', arrowAngle: 0, description: 'Top horizontal crossbar.' },
      { order: 3, direction: 'left-to-right', startPoint: { x: 30, y: 50 }, endPoint: { x: 62, y: 50 }, path: 'M 30 50 L 62 50', arrowAngle: 0, description: 'Middle horizontal crossbar.' }
    ]
  },
  'H': {
    char: 'H',
    strokeCount: 3,
    principles: ['Left to right', 'Top to bottom'],
    strokes: [
      { order: 1, direction: 'vertical-stem', startPoint: { x: 30, y: 18 }, endPoint: { x: 30, y: 82 }, path: 'M 30 18 L 30 82', arrowAngle: 90, description: 'Left vertical post.' },
      { order: 2, direction: 'vertical-stem', startPoint: { x: 70, y: 18 }, endPoint: { x: 70, y: 82 }, path: 'M 70 18 L 70 82', arrowAngle: 90, description: 'Right vertical post.' },
      { order: 3, direction: 'left-to-right', startPoint: { x: 30, y: 50 }, endPoint: { x: 70, y: 50 }, path: 'M 30 50 L 70 50', arrowAngle: 0, description: 'Connecting horizontal crossbar.' }
    ]
  },
  'I': {
    char: 'I',
    strokeCount: 3,
    principles: ['Top to bottom'],
    strokes: [
      { order: 1, direction: 'left-to-right', startPoint: { x: 34, y: 20 }, endPoint: { x: 66, y: 20 }, path: 'M 34 20 L 66 20', arrowAngle: 0, description: 'Top serif cap.' },
      { order: 2, direction: 'vertical-stem', startPoint: { x: 50, y: 20 }, endPoint: { x: 50, y: 80 }, path: 'M 50 20 L 50 80', arrowAngle: 90, description: 'Central vertical pillar.' },
      { order: 3, direction: 'left-to-right', startPoint: { x: 34, y: 80 }, endPoint: { x: 66, y: 80 }, path: 'M 34 80 L 66 80', arrowAngle: 0, description: 'Bottom serif base.' }
    ]
  },
  'O': {
    char: 'O',
    strokeCount: 1,
    principles: ['Top to bottom'],
    strokes: [
      { order: 1, direction: 'counter-clockwise-oval', startPoint: { x: 50, y: 18 }, endPoint: { x: 50, y: 18 }, path: 'M 50 18 C 22 18, 22 82, 50 82 C 78 82, 78 18, 50 18', arrowAngle: 180, description: 'Continuous smooth counter-clockwise oval.' }
    ]
  },
  'T': {
    char: 'T',
    strokeCount: 2,
    principles: ['Horizontal before vertical', 'Top to bottom'],
    strokes: [
      { order: 1, direction: 'left-to-right', startPoint: { x: 22, y: 22 }, endPoint: { x: 78, y: 22 }, path: 'M 22 22 L 78 22', arrowAngle: 0, description: 'Top horizontal crossbar.' },
      { order: 2, direction: 'vertical-stem', startPoint: { x: 50, y: 22 }, endPoint: { x: 50, y: 82 }, path: 'M 50 22 L 50 82', arrowAngle: 90, description: 'Central vertical pillar.' }
    ]
  },
  'X': {
    char: 'X',
    strokeCount: 2,
    principles: ['Left to right', 'Top to bottom'],
    strokes: [
      { order: 1, direction: 'diagonal-down-right', startPoint: { x: 28, y: 22 }, endPoint: { x: 72, y: 82 }, path: 'M 28 22 L 72 82', arrowAngle: 45, description: 'Downward slant from top-left to bottom-right.' },
      { order: 2, direction: 'diagonal-down-left', startPoint: { x: 72, y: 22 }, endPoint: { x: 28, y: 82 }, path: 'M 72 22 L 28 82', arrowAngle: 135, description: 'Crossing downward slant from top-right to bottom-left.' }
    ]
  },
  'Z': {
    char: 'Z',
    strokeCount: 1,
    principles: ['Top to bottom'],
    strokes: [
      { order: 1, direction: 'zigzag-horizontal', startPoint: { x: 28, y: 24 }, endPoint: { x: 74, y: 78 }, path: 'M 28 24 L 72 24 L 28 78 L 74 78', arrowAngle: 0, description: 'Across right, diagonal slash down-left, across right.' }
    ]
  },
  'a': {
    char: 'a',
    strokeCount: 2,
    principles: ['Top to bottom', 'Left to right'],
    strokes: [
      { order: 1, direction: 'counter-clockwise-bowl', startPoint: { x: 62, y: 46 }, endPoint: { x: 62, y: 74 }, path: 'M 62 46 C 34 40, 32 80, 62 74', arrowAngle: 180, description: 'Rounded circular body.' },
      { order: 2, direction: 'vertical-stem-down', startPoint: { x: 62, y: 44 }, endPoint: { x: 62, y: 78 }, path: 'M 62 44 L 62 78', arrowAngle: 90, description: 'Right vertical stem grounding the circle.' }
    ]
  },
  'b': {
    char: 'b',
    strokeCount: 2,
    principles: ['Top to bottom'],
    strokes: [
      { order: 1, direction: 'vertical-stem', startPoint: { x: 36, y: 18 }, endPoint: { x: 36, y: 78 }, path: 'M 36 18 L 36 78', arrowAngle: 90, description: 'Tall vertical ascender.' },
      { order: 2, direction: 'clockwise-bowl', startPoint: { x: 36, y: 48 }, endPoint: { x: 36, y: 78 }, path: 'M 36 48 C 72 44, 72 82, 36 78', arrowAngle: 45, description: 'Lower right rounded bowl.' }
    ]
  },
  'c': {
    char: 'c',
    strokeCount: 1,
    principles: ['Top to bottom'],
    strokes: [
      { order: 1, direction: 'counter-clockwise-arc', startPoint: { x: 66, y: 48 }, endPoint: { x: 66, y: 74 }, path: 'M 66 48 C 36 40, 32 82, 66 74', arrowAngle: 180, description: 'Single counter-clockwise open curve.' }
    ]
  },
  'e': {
    char: 'e',
    strokeCount: 1,
    principles: ['Horizontal before vertical', 'Top to bottom'],
    strokes: [
      { order: 1, direction: 'horizontal-into-loop', startPoint: { x: 34, y: 60 }, endPoint: { x: 66, y: 74 }, path: 'M 34 60 L 66 60 C 66 42, 34 42, 34 62 C 34 82, 68 80, 66 74', arrowAngle: 0, description: 'Middle horizontal line looping over into an open counter-clockwise curve.' }
    ]
  },
  'o': {
    char: 'o',
    strokeCount: 1,
    principles: ['Top to bottom'],
    strokes: [
      { order: 1, direction: 'counter-clockwise-circle', startPoint: { x: 50, y: 44 }, endPoint: { x: 50, y: 44 }, path: 'M 50 44 C 30 44, 30 80, 50 80 C 70 80, 70 44, 50 44', arrowAngle: 180, description: 'Counter-clockwise complete circle.' }
    ]
  }
};

// ── 3. PROCEDURAL STROKE GENERATOR FOR UNMAPPED CHARACTERS ───────────────────
/**
 * Procedurally synthesizes balanced, valid stroke data for any unmapped glyph
 * based on Japanese character dataset metadata, Latin letter heuristics, or canonical calligraphy defaults.
 *
 * @param {string} char
 * @returns {object}
 */
export function generateProceduralStrokeData(char) {
  if (!char || typeof char !== 'string') {
    char = '?';
  }

  // 1. Check if Japanese datasets list this character's strokeCount
  let count = 1;
  const kanaEntry =
    hiraganaData.find((h) => h.char === char) ||
    katakanaData.find((k) => k.char === char) ||
    kanjiN5Data.find((k) => k.kanji === char);

  if (kanaEntry && typeof kanaEntry.strokeCount === 'number') {
    count = kanaEntry.strokeCount;
  } else if (/^[A-Z]$/.test(char)) {
    // Upper case Latin averages 2-3 strokes
    count = ['I', 'C', 'O', 'S', 'U', 'V', 'W', 'Z'].includes(char) ? 1 : ['D', 'G', 'J', 'L', 'P', 'Q', 'R', 'T', 'X', 'Y'].includes(char) ? 2 : ['A', 'B', 'F', 'H', 'K', 'N'].includes(char) ? 3 : 4;
  } else if (/^[a-z]$/.test(char)) {
    count = ['i', 'j', 't', 'x'].includes(char) ? 2 : 1;
  }

  const strokes = [];
  const principles = [];

  if (count === 1) {
    principles.push('Top to bottom');
    strokes.push({
      order: 1,
      direction: 'top-to-bottom-curve',
      startPoint: { x: 32, y: 24 },
      endPoint: { x: 68, y: 76 },
      path: 'M 32 24 Q 50 20 68 34 Q 52 56 68 76',
      arrowAngle: 45,
      description: 'Single continuous calligraphic stroke curving smoothly.'
    });
  } else if (count === 2) {
    principles.push('Top to bottom', 'Left to right');
    strokes.push({
      order: 1,
      direction: 'top-to-bottom',
      startPoint: { x: 34, y: 22 },
      endPoint: { x: 34, y: 78 },
      path: 'M 34 22 L 34 78',
      arrowAngle: 90,
      description: 'First vertical stroke establishing the left balance.'
    });
    strokes.push({
      order: 2,
      direction: 'left-to-right-down',
      startPoint: { x: 48, y: 34 },
      endPoint: { x: 74, y: 78 },
      path: 'M 48 34 L 74 34 L 74 78',
      arrowAngle: 0,
      description: 'Second stroke sweeping right and downward.'
    });
  } else if (count === 3) {
    principles.push('Horizontal before vertical', 'Top to bottom');
    strokes.push({
      order: 1,
      direction: 'left-to-right',
      startPoint: { x: 26, y: 32 },
      endPoint: { x: 74, y: 32 },
      path: 'M 26 32 L 74 32',
      arrowAngle: 0,
      description: 'Top horizontal stroke.'
    });
    strokes.push({
      order: 2,
      direction: 'vertical-stem',
      startPoint: { x: 50, y: 20 },
      endPoint: { x: 50, y: 80 },
      path: 'M 50 20 L 50 80',
      arrowAngle: 90,
      description: 'Central vertical stem intersecting downward.'
    });
    strokes.push({
      order: 3,
      direction: 'left-to-right',
      startPoint: { x: 22, y: 80 },
      endPoint: { x: 78, y: 80 },
      path: 'M 22 80 L 78 80',
      arrowAngle: 0,
      description: 'Bottom base stroke stabilizing the glyph.'
    });
  } else {
    // 4+ strokes (Kanji / Complex)
    principles.push('Top to bottom', 'Left to right', 'Enclosure before inside');
    const yStep = Math.floor(60 / (count - 1));
    for (let i = 1; i <= count; i++) {
      const y = 20 + (i - 1) * yStep;
      strokes.push({
        order: i,
        direction: i % 2 === 1 ? 'left-to-right' : 'top-to-bottom',
        startPoint: { x: 24, y: Math.min(y, 85) },
        endPoint: { x: 76, y: Math.min(y + (i % 2 === 0 ? 15 : 0), 85) },
        path: `M 24 ${Math.min(y, 85)} L 76 ${Math.min(y + (i % 2 === 0 ? 15 : 0), 85)}`,
        arrowAngle: i % 2 === 1 ? 0 : 90,
        description: `Stroke ${i}: ${i % 2 === 1 ? 'Horizontal' : 'Vertical'} component drawn in sequence.`
      });
    }
  }

  return {
    char,
    strokeCount: count,
    principles,
    strokes,
  };
}

// ── 4. PRIMARY QUERY HELPER ──────────────────────────────────────────────────
/**
 * Retrieves stroke guidance for a character, consulting explicit dictionary
 * mappings first and falling back to procedural synthesis when necessary.
 *
 * @param {string} char - Target character glyph
 * @returns {object} { char, strokeCount, principles, strokes }
 */
export function getStrokeData(char) {
  if (!char || typeof char !== 'string') {
    return generateProceduralStrokeData('?');
  }

  // Trim to primary first grapheme if string is longer
  const glyph = Array.from(char.trim())[0] || char;

  if (strokeDictionary[glyph]) {
    return strokeDictionary[glyph];
  }

  return generateProceduralStrokeData(glyph);
}
