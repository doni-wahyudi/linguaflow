# Phase 2 Client-Side Oral Production & Speech Recognition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement 100% client-side oral production practice and real-time pronunciation evaluation across lessons and the Practice Arena with no server or paid AI dependencies.

**Architecture:** Web Speech API (`SpeechRecognition`) for audio-to-text streaming, client-side algorithmic Levenshtein and phonetic diffing for word-level grading (Green/Amber/Red), accessible audio visualizer and 56px mic button primitives, lesson-level speaking exercises with typing/skip fallbacks, and a dedicated Pronunciation Studio tab in the Practice Arena.

**Tech Stack:** React 18, Web Speech API (`webkitSpeechRecognition` / `SpeechRecognition`), Web Audio API (`AudioContext`, `AnalyserNode`), Lucide React icons, Framer Motion, Tailwind CSS design system tokens.

**Spec:** `docs/superpowers/specs/2026-11-06-phase2-oral-production-design.md`

## Global Constraints
- Zero backend dependencies; all processing executes locally in the browser.
- Design tokens: Use declared LinguaFlow palette (`bg-brand-50`, `border-brand-200`, `text-ink-900`, `text-ink-700`, `bg-success-50`, `text-success-700`, `bg-amber-50`, `text-amber-900`, `bg-danger-50`, `text-danger-700`).
- Touch targets: All audio and microphone interaction buttons must measure at least 44px (MicButton uses 56px).
- BCP-47 speech tags: Spanish (`es-ES`), Japanese (`ja-JP`), French (`fr-FR`), German (`de-DE`).
- Passing evaluation threshold: Score $\ge 70\%$. Word tokens classified as correct ($\ge 85\%$), partial ($50\% - 84\%$), or missed ($< 50\%$).
- Universal fallbacks: Every speaking exercise must offer "Type instead" and "Can't speak right now" bypasses.

---

### Task 1: Algorithmic Phonetic & Levenshtein Scorer (`pronunciationScorer.js`)

**Files:**
- Create: `src/utils/pronunciationScorer.js`
- Create: `scripts/verify-pronunciation.js`
- Modify: `package.json:7-14`

**Interfaces:**
- Produces:
  ```typescript
  export function cleanForComparison(text: string, langCode: string): string;
  export function levenshteinSimilarity(strA: string, strB: string): number;
  export function scorePronunciation(
    expectedText: string,
    spokenText: string,
    langCode?: string,
    metadata?: { reading?: string; kanji?: string }
  ): {
    score: number;
    passed: boolean;
    tokens: Array<{ word: string; status: 'correct' | 'partial' | 'missed'; similarity: number }>;
    feedback: string;
  };
  ```

- [ ] **Step 1: Write test harness `scripts/verify-pronunciation.js`**

```javascript
#!/usr/bin/env node
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

console.log('Testing levenshteinSimilarity...');
assert(levenshteinSimilarity('hello', 'hello') === 1, 'Exact match has similarity 1.0');
assert(levenshteinSimilarity('cat', 'bat') >= 0.65, '1 char diff in 3 chars is ~0.67');
assert(levenshteinSimilarity('totally', 'different') < 0.3, 'Distant words have low similarity');

console.log('Testing scorePronunciation across languages...');
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
```

- [ ] **Step 2: Run test to verify it fails before implementation**

Run: `node scripts/verify-pronunciation.js`
Expected: FAIL with `Cannot find module '../src/utils/pronunciationScorer.js'`

- [ ] **Step 3: Implement `src/utils/pronunciationScorer.js`**

```javascript
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
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'’¡¿]/g, ' ') // remove punctuation
    .trim()
    .toLowerCase();

  // Language specific normalizations
  if (langCode === 'es') {
    cleaned = removeDiacritics(cleaned);
  } else if (langCode === 'fr') {
    cleaned = cleaned.replace(/['’]/g, '');
  } else if (langCode === 'de') {
    // Keep umlauts or convert standard digraphs
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
        feedback: 'Excellent native pronunciation!',
      };
    }
  }

  const expectedWords = expectedText.trim().split(/\s+/).filter(Boolean);
  const cleanExpWords = normExpected.split(/\s+/).filter(Boolean);
  const cleanSpokenWords = normSpoken.split(/\s+/).filter(Boolean);

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
  const score = Math.min(100, Math.round(avgSim * 100));
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
```

- [ ] **Step 4: Update `package.json` with test script and run test**

Add `"test:pronunciation": "node scripts/verify-pronunciation.js"` to `package.json`.
Run: `npm run test:pronunciation`
Expected: PASS with `All pronunciation scorer tests PASSED (0 errors).`

- [ ] **Step 5: Commit Task 1**

```bash
git add src/utils/pronunciationScorer.js scripts/verify-pronunciation.js package.json
git commit -m "feat(speech): implement client-side phonetic and Levenshtein pronunciation scorer"
```

---

### Task 2: Speech Recognition Hook (`useSpeechRecognition.js`)

**Files:**
- Create: `src/hooks/useSpeechRecognition.js`

**Interfaces:**
- Produces:
  ```typescript
  export default function useSpeechRecognition(): {
    isListening: boolean;
    transcript: string;
    interimTranscript: string;
    error: string | null;
    isSupported: boolean;
    startListening: (options?: { lang?: string }) => void;
    stopListening: () => void;
    resetTranscript: () => void;
  };
  ```

- [ ] **Step 1: Build `src/hooks/useSpeechRecognition.js`**

Implement browser `SpeechRecognition` / `webkitSpeechRecognition` lifecycle:
- Maps short language IDs (`es`, `ja`, `fr`, `de`) to BCP-47 tags (`es-ES`, `ja-JP`, `fr-FR`, `de-DE`).
- Binds `onresult` to separate final transcript and interim transcript.
- Binds `onerror` to user-friendly error codes (`not-allowed`, `no-speech`, `network`, `audio-capture`).
- Implements auto-stop after 2.5 seconds of silence once speech starts.
- Clean cleanup on component unmount (`recognition.abort()`).

- [ ] **Step 2: Verify in Node / Vite build**

Run: `npm run build`
Expected: Clean build without syntax or import errors.

- [ ] **Step 3: Commit Task 2**

```bash
git add src/hooks/useSpeechRecognition.js
git commit -m "feat(speech): create useSpeechRecognition hook for browser Web Speech STT"
```

---

### Task 3: Audio UI Primitives (`MicButton.jsx`, `LiveAudioVisualizer.jsx`, `PronunciationFeedback.jsx`)

**Files:**
- Create: `src/components/ui/MicButton.jsx`
- Create: `src/components/ui/LiveAudioVisualizer.jsx`
- Create: `src/components/lesson/PronunciationFeedback.jsx`
- Modify: `src/components/ui/index.js`

**Interfaces:**
- Produces:
  - `<MicButton isListening={boolean} isProcessing={boolean} onClick={fn} disabled={boolean} size="lg" />`
  - `<LiveAudioVisualizer isListening={boolean} />`
  - `<PronunciationFeedback evaluation={evaluation} targetText={string} langCode={string} onListenModel={fn} />`

- [ ] **Step 1: Create `src/components/ui/MicButton.jsx`**
- 56px circular button meeting WCAG 2.1 §2.5.5 targets.
- Uses Framer Motion pulsing ring animation when `isListening === true`.
- Accessible `aria-label` stating "Start speaking" or "Stop recording".

- [ ] **Step 2: Create `src/components/ui/LiveAudioVisualizer.jsx`**
- Renders 5 audio amplitude bars with randomized animated heights while `isListening === true`.
- Styled with `bg-brand-500` / `bg-brand-600`.

- [ ] **Step 3: Create `src/components/lesson/PronunciationFeedback.jsx`**
- Word-by-word token pills:
  - Green (`bg-success-50 text-success-700 border-success-200`) for correct words.
  - Amber (`bg-amber-50 text-amber-900 border-amber-200`) for partial words.
  - Red (`bg-danger-50 text-danger-700 border-danger-200`) for missed words.
- Score badge with percentage (e.g. `85% Accurate`).
- Audio playback button to re-listen to native pronunciation.

- [ ] **Step 4: Export `MicButton` and `LiveAudioVisualizer` in `src/components/ui/index.js`**

- [ ] **Step 5: Verify production build**

Run: `npm run build`
Expected: PASS with 0 warnings.

- [ ] **Step 6: Commit Task 3**

```bash
git add src/components/ui/MicButton.jsx src/components/ui/LiveAudioVisualizer.jsx src/components/lesson/PronunciationFeedback.jsx src/components/ui/index.js
git commit -m "feat(ui): add MicButton, LiveAudioVisualizer, and PronunciationFeedback primitives"
```

---

### Task 4: Speaking Exercise Component (`SpeakingExercise.jsx` & `ExerciseRenderer.jsx`)

**Files:**
- Create: `src/components/lesson/SpeakingExercise.jsx`
- Modify: `src/components/lesson/ExerciseRenderer.jsx`

**Interfaces:**
- Produces:
  - `<SpeakingExercise exercise={...} langCode={...} onAnswer={...} disabled={boolean} />`
- Updates `ExerciseRenderer`:
  - `case 'speaking': return <SpeakingExercise ... />`

- [ ] **Step 1: Build `src/components/lesson/SpeakingExercise.jsx`**
- Displays target sentence, phonetic pronunciation, and English translation.
- Includes native model audio playback via `AudioControls`.
- Integrates `MicButton`, `LiveAudioVisualizer`, and real-time transcript streaming.
- On speech end, computes evaluation via `scorePronunciation`.
- Displays `PronunciationFeedback` and allows "Try Again" or "Continue" (when score $\ge 70\%$).
- Offers **"Type instead"** mode toggle: renders text input with submit button for quiet rooms.
- Offers **"Can't speak right now"** button: bypasses speaking task and passes with partial XP.

- [ ] **Step 2: Register in `ExerciseRenderer.jsx`**
Import `SpeakingExercise` and add `case 'speaking'` to the switch statement.

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 4: Commit Task 4**

```bash
git add src/components/lesson/SpeakingExercise.jsx src/components/lesson/ExerciseRenderer.jsx
git commit -m "feat(lesson): create SpeakingExercise component with typing and skip fallbacks"
```

---

### Task 5: Enrich Curriculum Lessons with Speaking Exercises & Verification Update

**Files:**
- Modify: `src/data/lessons/spanish.js`
- Modify: `src/data/lessons/japanese.js`
- Modify: `src/data/lessons/french.js`
- Modify: `src/data/lessons/german.js`
- Modify: `scripts/verify-curriculum.js`

**Interfaces:**
- Adds 2 `speaking` exercises per lesson across all 40 lessons (80 speaking exercises total).
- Schema of speaking exercise:
  ```javascript
  {
    id: string,
    type: 'speaking',
    wordId?: string,
    prompt: string,
    targetText: string,
    translation: string,
    pronunciation?: string,
    reading?: string, // for Japanese kanji
    hint?: string
  }
  ```

- [ ] **Step 1: Update `scripts/verify-curriculum.js` to assert `speaking` exercise schema**
Add validation for `type === 'speaking'`: ensure `targetText` and `translation` exist.

- [ ] **Step 2: Add 2 speaking exercises to all 10 Spanish lessons**
- [ ] **Step 3: Add 2 speaking exercises to all 10 Japanese lessons**
- [ ] **Step 4: Add 2 speaking exercises to all 10 French lessons**
- [ ] **Step 5: Add 2 speaking exercises to all 10 German lessons**

- [ ] **Step 6: Run curriculum validation**

Run: `npm run test:curriculum`
Expected: PASS (40 lessons verified, 80 speaking exercises validated, 0 errors).

- [ ] **Step 7: Commit Task 5**

```bash
git add src/data/lessons/ scripts/verify-curriculum.js
git commit -m "feat(curriculum): enrich all 40 lessons with 80 authentic speaking exercises"
```

---

### Task 6: Dedicated Pronunciation Studio in Practice Arena (`Practice.jsx`)

**Files:**
- Modify: `src/pages/Practice.jsx`

**Interfaces:**
- Adds 5th tab `id: 'speaking'`, label: `Pronunciation Studio`, icon: `Mic`.
- Consumes `useSpeechRecognition`, `scorePronunciation`, `AudioControls`, `MicButton`, `LiveAudioVisualizer`.

- [ ] **Step 1: Add Pronunciation Studio tab definition and state in `Practice.jsx`**
- Add `{ id: 'speaking', icon: Mic, label: 'Pronunciation Studio' }` to `SegmentedControl`.
- Initialize `speakingIndex`, `speakingLevel`, `speakingScore`, and `lastEvaluation`.

- [ ] **Step 2: Build Pronunciation Studio tab panel**
- Level filter chips (`All`, `A1`, `A2`, `B1`, `N5`, `N4`, `N3`).
- Selected phrase card with native playback (Normal 1.0x & Turtle 0.65x).
- Large 56px `MicButton` with live visualizer.
- Post-recording `PronunciationFeedback` displaying word-by-word accuracy.
- Save mastery to `word_progress` in local storage when score $\ge 85\%$.
- Award +15 XP and record activity on streak.
- "Next Phrase" CTA to advance through the vocabulary library.

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 4: Commit Task 6**

```bash
git add src/pages/Practice.jsx
git commit -m "feat(practice): add Pronunciation Studio tab with real-time speech evaluation"
```

---

### Task 7: Comprehensive Verification & Production Build

**Files:**
- Modify: `scripts/verify-live-interactions.js`

- [ ] **Step 1: Extend `scripts/verify-live-interactions.js` with speaking tests**
Add automated headless CDP tests:
- Test 9: LessonPlayer renders SpeakingExercise with MicButton and "Type instead" button.
- Test 10: "Type instead" allows typing the target phrase and passes the exercise.
- Test 11: Practice page displays "Pronunciation Studio" 5th tab and mounts audio controls.

- [ ] **Step 2: Run all verification suites**

Run: `npm run test:pronunciation`
Expected: PASS (0 errors)

Run: `npm run test:curriculum`
Expected: PASS (0 errors)

Run: `npm run build`
Expected: PASS (clean bundle, no size warnings)

Run: `npm run test:interactions`
Expected: PASS (all 11 tests passing)

- [ ] **Step 3: Commit Task 7**

```bash
git add scripts/verify-live-interactions.js
git commit -m "test(interactions): verify speaking exercises and pronunciation studio in live browser suite"
```
