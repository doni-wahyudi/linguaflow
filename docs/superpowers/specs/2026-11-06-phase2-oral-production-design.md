# Design Specification: Phase 2 Client-Side Oral Production & Speech Recognition

**Document Date:** 2026-11-06  
**Status:** Approved for Implementation  
**Project:** LinguaFlow  
**Scope:** Browser-Native Oral Production, Phonetic Grading, Lesson Speaking Exercises, and Practice Pronunciation Studio  

---

## 1. Problem Statement & Educational Need

In Phase 1, LinguaFlow expanded its core vocabulary to 979 unique words across Spanish, Japanese, French, and German, and introduced 40 authentic 1-minute Grammar Micro-Guides. However, learner interaction remained 100% passive or text-based (reading, listening to TTS, multiple-choice selection, and typing).

To achieve real-world conversational fluency, learners must activate vocal muscle memory and overcome the hesitation of speaking aloud. Phase 2 introduces client-side, zero-cost oral production and real-time pronunciation grading directly in the browser with no external server or paid API dependencies.

---

## 2. Technical Architecture & Principles

### 2.1 Zero-Backend, 100% Client-Side Engine
1. **Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`):**
   - Uses browser-native speech recognition engines available across modern desktop and mobile browsers (Chrome, Edge, Safari, iOS, Android).
   - Maps target languages to explicit BCP-47 speech tags:
     - Spanish: `es-ES`
     - Japanese: `ja-JP`
     - French: `fr-FR`
     - German: `de-DE`
2. **Algorithmic Phonetic & Levenshtein Diffing Engine:**
   - Evaluates spoken transcripts against target text locally using character and word normalization, Levenshtein edit distance, and target-language phonetic heuristics.
   - Outputs word-by-word alignment tokens with 3-tier color coding:
     - **Green (Accurate, $\ge 85\%$ match):** Well-articulated.
     - **Amber (Partial, $50\% - 84\%$ match):** Minor accent slip or inflection error.
     - **Red (Missed, $< 50\%$ match):** Omitted, garbled, or mispronounced.
   - Calculates overall accuracy percentage ($0\% - 100\%$) with a passing threshold of $\ge 70\%$.
3. **Audio Capture & Live Visualizer (Web Audio API):**
   - Accesses microphone audio via `navigator.mediaDevices.getUserMedia` when available.
   - Uses an `AudioContext` and `AnalyserNode` to drive an animated waveform visualizer confirming vocal input.
4. **Universal Accessibility & Quiet Environment Fallbacks:**
   - If the browser does not support `SpeechRecognition`, or microphone permission is denied, or the learner is in a quiet location (train, library), every speaking exercise provides:
     - **"Type instead"** mode: Allows keyboard input of the spoken phrase.
     - **"Can't speak right now"** button: Bypasses speaking exercises with partial credit for the remainder of the session without blocking lesson progression.

---

## 3. Detailed Component & Module Specifications

### 3.1 Hook: `useSpeechRecognition.js`
- **Location:** `src/hooks/useSpeechRecognition.js`
- **Responsibilities:**
  - Instantiates `window.SpeechRecognition || window.webkitSpeechRecognition`.
  - Configures `continuous = false`, `interimResults = true`, and sets `lang` according to current language.
  - Exposes state:
    - `isListening: boolean`
    - `transcript: string` (final recognized text)
    - `interimTranscript: string` (live streaming words)
    - `error: string | null` (`'not-allowed'`, `'no-speech'`, `'network'`, `'unsupported'`)
    - `isSupported: boolean`
  - Exposes methods:
    - `startListening(options: { lang: string }): void`
    - `stopListening(): void`
    - `resetTranscript(): void`
  - Handles automatic silence cutoff (2.5 seconds timeout after speech starts).

### 3.2 Scoring Utility: `pronunciationScorer.js`
- **Location:** `src/utils/pronunciationScorer.js`
- **Exported Functions:**
  - `cleanForComparison(text, langCode)`: Strips punctuation, quotes, trailing symbols, furigana readings, and collapses whitespace.
  - `levenshteinSimilarity(strA, strB)`: Calculates $1 - \frac{\text{dist}}{\max(|strA|, |strB|)}$.
  - `scorePronunciation(expectedText, spokenText, langCode, metadata)`:
    - Splits `expectedText` and `spokenText` into word tokens.
    - Matches tokens using optimal Levenshtein alignment.
    - Handles Japanese kanji-to-reading matching if `metadata.reading` is provided.
    - Handles French apostrophe elisions (`l'eau` -> `leau` / `l eau`).
    - Handles German umlaut equivalences (`ä` <-> `ae`, `ö` <-> `oe`, `ü` <-> `ue`, `ß` <-> `ss`).
    - Returns structured evaluation object:
      ```javascript
      {
        score: number, // 0 - 100
        passed: boolean, // score >= 70
        tokens: Array<{
          word: string,
          status: 'correct' | 'partial' | 'missed',
          similarity: number
        }>,
        feedback: string
      }
      ```

### 3.3 UI Primitives
1. **`MicButton.jsx` (`src/components/ui/MicButton.jsx`)**:
   - 56px circular touch target (exceeding WCAG 2.1 §2.5.5 minimum 44px).
   - Dynamic states:
     - `idle`: Primary brand style with microphone icon.
     - `listening`: Crimson/coral pulsing ring with radial ripple animation.
     - `processing`: Loading indicator during score calculation.
     - `success`: Green check pulse.
   - Fully accessible with `aria-label` stating current recording status.

2. **`LiveAudioVisualizer.jsx` (`src/components/ui/LiveAudioVisualizer.jsx`)**:
   - Visualizes live volume levels using 5 dynamic bar heights or SVG canvas.
   - Responsive and constrained to design-system token colors (`bg-brand-500`, `bg-brand-600`).

3. **`PronunciationFeedback.jsx` (`src/components/lesson/PronunciationFeedback.jsx`)**:
   - Displays the target sentence with word-by-word token coloring:
     - `status === 'correct'`: `text-success-700 bg-success-50 border-success-200`
     - `status === 'partial'`: `text-amber-700 bg-amber-50 border-amber-200`
     - `status === 'missed'`: `text-danger-700 bg-danger-50 border-danger-200`
   - Accuracy percentage badge (e.g. `88% Accurate • Great pronunciation!`).
   - "Listen to Native Model" audio playback button (`AudioControls`).

### 3.4 Lesson Player Integration (`SpeakingExercise.jsx`)
- **Location:** `src/components/lesson/SpeakingExercise.jsx`
- **Dispatcher:** Added to `src/components/lesson/ExerciseRenderer.jsx` under `case 'speaking'`.
- **UX Flow:**
  1. Displays the target prompt, target sentence, phonetic guide, and translation.
  2. Learner listens to native pronunciation via `AudioControls`.
  3. Learner taps `MicButton` and speaks the phrase.
  4. Real-time visualizer shows input; recognition processes upon completion.
  5. `PronunciationFeedback` displays accuracy breakdown.
  6. If score $\ge 70\%$, learner can continue; if $< 70\%$, user can tap "Try Again".
  7. "Can't speak now" and "Type instead" bypass buttons allow smooth lesson completion in restricted environments.

### 3.5 Curriculum Content Expansion
- Enrich each of the 40 curriculum lessons with 2 authentic `speaking` exercises (80 total speaking exercises across Spanish, Japanese, French, German).
- Exercises focus on natural conversational utterances and key vocabulary from the lesson.

### 3.6 Practice Arena: Pronunciation Studio Tab
- **Location:** `src/pages/Practice.jsx`
- **Tab Definition:** Adds 5th tab `id: 'speaking'`, label: `Pronunciation Studio` with `Mic` icon.
- **Features:**
  - Level filter chips (`All`, `A1`, `A2`, `B1`, `N5`, `N4`, `N3`).
  - Phrase selector from the 1,000-word lexicon and lesson library.
  - Native model playback (1.0x and 0.65x Turtle mode).
  - Recording, scoring, and side-by-side comparison.
  - Marks words as "Pronunciation Mastered" in local storage progress when score $\ge 85\%$.
  - Awards +15 XP for every successfully completed pronunciation attempt.

---

## 4. Verification & Testing Strategy

1. **Phonetic Scoring Unit Suite (`scripts/verify-pronunciation.js`):**
   - Tests `scorePronunciation` against 40+ canonical test cases across Spanish, Japanese, French, and German.
   - Tests punctuation tolerance, character normalization, accent sensitivity, and elisions.
2. **Curriculum Verification Script (`scripts/verify-curriculum.js`):**
   - Asserts schema integrity of all new `speaking` exercises in `spanish.js`, `japanese.js`, `french.js`, and `german.js`.
3. **End-to-End Live Interaction CDP Suite (`scripts/verify-live-interactions.js`):**
   - Verifies:
     - LessonPlayer renders `SpeakingExercise` with microphone button and fallback controls.
     - "Type instead" fallback allows completing speaking exercises by keyboard without microphone.
     - Practice page displays the new "Pronunciation Studio" tab and allows filtering by level and evaluating phrases.
4. **Production Build (`npm run build`):**
   - Verifies clean Vite build with zero bundle warnings and proper vendor chunking.
