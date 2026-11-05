# Phase 1: High-Yield Vocabulary Expansion & Grammar Micro-Guides Design Specification

- **Date:** 2026-11-05
- **Author:** Qoder
- **Status:** Approved / Ready for Implementation
- **Target Repository:** LinguaFlow (`https://github.com/doni-wahyudi/linguaflow`)

---

## 1. Overview & Pedagogical Objectives

### 1.1 Problem Statement
In its previous state, LinguaFlow provided an introductory baseline of ~50 vocabulary items per language (across 10 lessons) without explicit grammar instruction or structural breakdowns. As a result:
1. Learners hit a rapid ceiling after 2–3 days because the Spaced Repetition (SM-2) review queue exhausted its limited vocabulary pool.
2. Learners memorized phrases as isolated strings without understanding morphological or syntactical rules (e.g. *ser* vs. *estar* in Spanish, topic marker *wa* vs. subject marker *ga* in Japanese, grammatical gender in French and German).
3. The platform lacked the linguistic density required to support real-world fluency and comprehension.

### 1.2 Phase 1 Objectives
1. **Linguistic Density Expansion**: Expand vocabulary across all 4 supported languages (Spanish `es`, Japanese `ja`, French `fr`, German `de`) from ~50 words to **150+ high-frequency lemmas per language** (600+ total core words across the app).
2. **Grammar Micro-Guides**: Introduce a structured 1-minute Grammar Guide unit for every lesson (40 lesson units in total) detailing core morphological patterns, syntax formulas, audio-supported examples, and mnemonic tips.
3. **Adaptive Lesson Player Experience**: Enhance the `LessonPlayer` flow so that learners review the 1-minute Grammar Guide before beginning active exercises (Step 0), with the ability to peek at the rule in a modal during exercises at any time without losing progress.
4. **Practice & SRS Pool Integration**: Integrate the expanded vocabulary into the Spaced Repetition Gym, Speed Drills, Ear Training Studio, and Master Vocabulary Library in `Practice.jsx`.

---

## 2. Architecture & Data Schemas

### 2.1 File Organization
```
src/
├── data/
│   ├── lexicon/
│   │   ├── index.js          # Lexicon aggregator & utility functions
│   │   ├── spanish.js        # 100+ A1-B1 core Spanish lemmas
│   │   ├── japanese.js       # 100+ N5-N3 core Japanese lemmas (Kanji, Kana, Romaji)
│   │   ├── french.js         # 100+ A1-B1 core French lemmas
│   │   └── german.js         # 100+ A1-B1 core German lemmas (Articles, Plurals)
│   ├── lessons/
│   │   ├── spanish.js        # Expanded with grammarGuide & 12-15 words per lesson
│   │   ├── japanese.js       # Expanded with grammarGuide & 12-15 words per lesson
│   │   ├── french.js         # Expanded with grammarGuide & 12-15 words per lesson
│   │   ├── german.js         # Expanded with grammarGuide & 12-15 words per lesson
│   │   └── index.js          # Updated aggregators
├── components/
│   └── lesson/
│       ├── GrammarCard.jsx   # Dedicated presentation card for 1-minute grammar guides
│       └── ...
└── pages/
    ├── LessonPlayer.jsx      # Injects Step 0 guide + in-lesson peek modal
    └── Practice.jsx          # Merges lexicon pool into SRS & drill modes
```

### 2.2 Grammar Guide Schema
Every lesson in `src/data/lessons/*.js` includes a `grammarGuide` object:
```javascript
{
  id: string,               // e.g. "es-grammar-greetings"
  title: string,            // e.g. "Spanish Politeness: Tú vs. Usted"
  subtitle: string,         // e.g. "Informal vs. formal address and verb conjugation"
  readTimeMinutes: 1,       // estimated reading time
  concept: string,          // Clear 2-3 sentence explanation of the underlying rule
  rules: [
    {
      rule: string,         // Concrete rule description
      pattern: string,      // Structural formula (e.g. "¿Cómo está usted? vs. ¿Cómo estás tú?")
      example: string,      // Authentic target-language example
      translation: string,  // English translation
      audioText?: string,   // Text for TTS playback (defaults to example)
    }
  ],
  tip: string,              // Practical mnemonic or cultural etiquette hint
}
```

### 2.3 Lexicon Lemma Schema
Each entry in `src/data/lexicon/*.js`:
```javascript
{
  id: string,                 // e.g. "lex-es-001"
  word: string,               // Headword in target language
  translation: string,        // English translation
  pronunciation: string,      // Phonetic pronunciation / Romaji
  category: string,           // e.g. "verb", "noun", "adjective", "connective"
  level: string,              // "A1", "A2", "B1", "N5", "N4", "N3"
  example: string,            // Natural example sentence
  exampleTranslation: string, // Translation of example
  gender?: 'm' | 'f' | 'n',   // Optional grammatical gender (French/German/Spanish)
  article?: string,           // e.g. "der", "die", "das", "el", "la", "le"
  kanji?: string,             // For Japanese
  reading?: string,           // Hiragana/Katakana for Japanese
}
```

---

## 3. User Interface & Flow

### 3.1 Lesson Player Flow
1. **Step 0: Grammar Micro-Guide**
   - When a user opens `/lesson/:lessonId`, the player displays `<GrammarCard>` as the initial step before question 1.
   - The user reads the concept, listens to example audio pronunciation via `<AudioControls>`, reviews the patterns, and clicks `"Start Exercises"`.
   - The progress bar reflects `0%` during the guide and advances cleanly as exercises are answered.
2. **In-Flight Grammar Peek**
   - The header of `LessonPlayer` displays a secondary button: `<Button variant="secondary" icon={BookOpen}>Rule</Button>`.
   - Clicking this opens an accessible `<Modal>` showing the exact same `GrammarCard` content.
   - Closing the modal or pressing `Escape` returns the user to the active exercise without penalty or state loss.
3. **Summary & SRS Recording**
   - Upon completing the exercises, all lesson vocabulary and associated lexicon items are scheduled through `spacedRepetition.js` based on user accuracy.

### 3.2 Practice & SRS Integration
- In `src/pages/Practice.jsx`, `allVocabWords` is derived from both `lessonsByLanguage[currentLang]` and `getLexiconByLanguage(currentLang)`.
- The vocabulary counter in the Master Vocabulary Library displays the expanded pool (150+ words per language).
- Spaced Repetition (SRS) Flashcard gym draws from the combined active pool.
- Speed Drills and Ear Training Studio filter seamlessly by CEFR / JLPT level (`A1/N5`, `A2/N4`, `B1/N3`).

---

## 4. Verification & Testing Strategy

1. **Unit & Data Integrity Verification**:
   - Verify all 40 lessons have a valid `grammarGuide` with non-empty `title`, `concept`, `rules`, and `tip`.
   - Verify every lexicon lemma has a unique ID, headword, translation, example, and valid CEFR/JLPT level tag.
   - Validate that TTS pronunciation tags trigger without runtime errors in `useSpeech`.
2. **Accessibility & Design-System Conformance**:
   - `GrammarCard` complies with the warm ink and surface color tokens (`surface-card`, `ink-900`, `ink-700`, `brand-700`).
   - The in-lesson peek modal preserves focus trapping, Escape dismissal, and background scroll locking.
   - All interactive audio controls meet the 44px minimum touch target size.
3. **Build & Live Smokes**:
   - Run `npm run build` to verify clean bundle compilation with zero warnings.
   - Test `LessonPlayer` from start to finish on both desktop and mobile viewports.
   - Test the Practice page and verify the expanded lexicon is present in the vocabulary search table and SRS queue.
