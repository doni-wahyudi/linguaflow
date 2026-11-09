/**
 * @file pronunciationScorer.js
 * @description Client-side phonetic and Levenshtein comparison utility for grading
 * user speech recognition transcripts against expected target curriculum sentences.
 */

/**
 * Remove accents and diacritics for relaxed phonetic comparison.
 * @param {string} str
 * @returns {string}
 */
function removeDiacritics(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Clean and canonicalize text for pronunciation comparison.
 * @param {string} text
 * @param {string} [langCode='en']
 * @returns {string}
 */
export function cleanForComparison(text, langCode = 'en') {
  if (!text || typeof text !== 'string') return '';

  let cleaned = text
    .replace(/\s*\([^)]*\)/g, '') // remove parenthesized readings/gender
    .trim()
    .toLowerCase();

  // Language specific normalizations before punctuation removal
  if (langCode === 'fr') {
    cleaned = cleaned.replace(/['’]/g, '');
  }

  cleaned = cleaned.replace(/[.,/#!$%^&*;:{}=\-_`~()?"'’¡¿]/g, ' ');

  if (langCode === 'es') {
    cleaned = removeDiacritics(cleaned);
  } else if (langCode === 'de') {
    // Keep standard digraph equivalents
    cleaned = cleaned
      .replace(/ä/g, 'ae')
      .replace(/ö/g, 'oe')
      .replace(/ü/g, 'ue')
      .replace(/ß/g, 'ss');
  }

  return cleaned.replace(/\s+/g, ' ').trim();
}

/**
 * Compute Levenshtein distance between two strings.
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
export function levenshteinDistance(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = i;
    for (let j = 1; j <= b.length; j++) {
      const val = a[i - 1] === b[j - 1] ? row[j - 1] : Math.min(row[j - 1], prev, row[j]) + 1;
      row[j - 1] = prev;
      prev = val;
    }
    row[b.length] = prev;
  }
  return row[b.length];
}

/**
 * Compute similarity between two strings as a fraction from 0.0 to 1.0.
 * @param {string} strA
 * @param {string} strB
 * @returns {number}
 */
export function levenshteinSimilarity(strA, strB) {
  const a = (strA || '').trim();
  const b = (strB || '').trim();
  if (!a && !b) return 1.0;
  if (!a || !b) return 0.0;
  if (a === b) return 1.0;

  const maxLen = Math.max(a.length, b.length);
  const dist = levenshteinDistance(a, b);
  return Math.max(0, 1 - dist / maxLen);
}

/**
 * Score spoken pronunciation against target curriculum phrase.
 * @param {string} expectedText
 * @param {string} spokenText
 * @param {string} [langCode='en']
 * @param {object} [metadata]
 * @returns {{ score: number, passed: boolean, tokens: Array<{ word: string, status: 'correct'|'partial'|'missed', similarity: number }>, feedback: string }}
 */
export function scorePronunciation(expectedText, spokenText, langCode = 'en', metadata = {}) {
  const normExpected = cleanForComparison(expectedText, langCode);
  const normSpoken = cleanForComparison(spokenText, langCode);

  // Check Japanese reading metadata fallback if kanji was expected but hiragana was spoken
  if (langCode === 'ja' && metadata?.reading) {
    const normReading = cleanForComparison(metadata.reading, langCode);
    if (normSpoken === normReading || levenshteinSimilarity(normSpoken, normReading) >= 0.8) {
      const origWords = expectedText.trim().split(/\s+/);
      return {
        score: 100,
        passed: true,
        tokens: origWords.map((w) => ({ word: w, status: 'correct', similarity: 1.0 })),
        feedback: 'Outstanding pronunciation! Clear, authentic enunciation.',
      };
    }
  }

  // Use phonetic reading target for clean comparison when available
  const comparisonExpected =
    langCode === 'ja' && metadata?.reading
      ? cleanForComparison(metadata.reading, langCode)
      : normExpected;

  let expectedWords = expectedText.trim().split(/\s+/).filter(Boolean);
  let cleanExpWords = comparisonExpected.split(/\s+/).filter(Boolean);
  let cleanSpokenWords = normSpoken.split(/\s+/).filter(Boolean);

  // For unspaced languages (Japanese/Chinese), if token splitting produces a single string
  // without spaces, split by characters to enable fine-grained visual token feedback.
  const isUnspaced = langCode === 'ja' || langCode === 'zh';
  if (isUnspaced && expectedWords.length === 1 && expectedWords[0].length > 3) {
    expectedWords = Array.from(expectedWords[0]);
    cleanExpWords = Array.from(cleanExpWords[0] || comparisonExpected);
    if (cleanSpokenWords.length === 1) {
      cleanSpokenWords = Array.from(cleanSpokenWords[0] || normSpoken);
    }
  }

  if (cleanSpokenWords.length === 0) {
    return {
      score: 0,
      passed: false,
      tokens: expectedWords.map((w) => ({ word: w, status: 'missed', similarity: 0 })),
      feedback: 'No speech was detected. Please try speaking closer to your microphone.',
    };
  }

  // Token alignment: match each expected word to best spoken token
  let totalSimilarity = 0;
  const scoredTokens = [];

  for (let i = 0; i < expectedWords.length; i++) {
    const rawWord = expectedWords[i];
    const cleanWord = cleanExpWords[i] || cleanForComparison(rawWord, langCode);

    let bestSim = 0;
    // Check direct position first, then look-ahead/behind window
    const windowStart = Math.max(0, i - 2);
    const windowEnd = Math.min(cleanSpokenWords.length, i + 3);

    for (let j = windowStart; j < windowEnd; j++) {
      const sim = levenshteinSimilarity(cleanWord, cleanSpokenWords[j]);
      if (sim > bestSim) {
        bestSim = sim;
      }
    }

    // Also check full spoken string containment
    if (cleanWord.length >= 3 && normSpoken.includes(cleanWord)) {
      bestSim = Math.max(bestSim, 0.95);
    } else if (isUnspaced && cleanWord.length === 1 && normSpoken.includes(cleanWord)) {
      bestSim = Math.max(bestSim, 0.90);
    }

    let status = 'missed';
    if (bestSim >= 0.85) {
      status = 'correct';
    } else if (bestSim >= 0.5) {
      status = 'partial';
    }

    totalSimilarity += bestSim;
    scoredTokens.push({
      word: rawWord,
      status,
      similarity: Number(bestSim.toFixed(2)),
    });
  }

  const avgSim = expectedWords.length > 0 ? totalSimilarity / expectedWords.length : 0;
  const fullSim = levenshteinSimilarity(comparisonExpected, normSpoken);
  const finalSim = Math.max(avgSim, fullSim);
  const score = Math.min(100, Math.round(finalSim * 100));
  const passed = score >= 70;

  let feedback = 'Needs improvement. Practice enunciation and try again!';
  if (score >= 90) {
    feedback = 'Outstanding pronunciation! Clear, authentic enunciation.';
  } else if (score >= 80) {
    feedback = 'Great job! Very close to native pronunciation.';
  } else if (score >= 70) {
    feedback = 'Good attempt! Understandable, with slight accent variance.';
  }

  return {
    score,
    passed,
    tokens: scoredTokens,
    feedback,
  };
}
