# Phase 1: High-Yield Vocabulary Expansion & Grammar Micro-Guides Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand LinguaFlow's core vocabulary to 600+ high-frequency words across all 4 languages (Spanish, Japanese, French, German), add interactive 1-minute Grammar Micro-Guides to all 40 lessons with pre-lesson and in-flight peek views, and connect the expanded lexicon to Spaced Repetition (SRS) and Practice arenas.

**Architecture:** Create a modular `src/data/lexicon/` directory containing 100+ vetted lemmas per language. Enrich `src/data/lessons/*.js` with `grammarGuide` schemas and expanded lesson vocabulary (12–15 words per lesson). Introduce `<GrammarCard>` component in `src/components/lesson/GrammarCard.jsx` and wire it into `LessonPlayer.jsx` as Step 0 and as an in-flight modal peek. Merge the lexicon into `Practice.jsx` so the SRS gym, Speed Drills, Ear Training Studio, and Master Dictionary immediately reflect the expanded lexicon.

**Tech Stack:** React 18, Vite 6, Tailwind CSS 3.4, Framer Motion 11, Lucide React icons, Web Speech API (TTS), Node.js verification scripts.

**Spec:** `docs/superpowers/specs/2026-11-05-phase1-curriculum-grammar-design.md`

## Global Constraints
- Maintain design system token compliance (`surface-card`, `ink-900`, `ink-700`, `brand-700`, `success-*`, `error-*`).
- Do not introduce arbitrary colors or untracked classes.
- All audio buttons and controls must meet the 44px minimum touch target size (WCAG 2.1 §2.5.5).
- Every lemma must include headword, translation, pronunciation, category, level, example, and exampleTranslation.
- Every lesson must include a complete `grammarGuide` with `title`, `concept`, `rules` (at least 2), and `tip`.
- Clean compilation on `npm run build` with zero warnings.

---

### Task 1: Data Verification Harness for Curriculum & Lexicon

**Files:**
- Create: `scripts/verify-curriculum.js`
- Modify: `package.json:6-12`

**Interfaces:**
- Produces: CLI script `node scripts/verify-curriculum.js` exiting with 0 on valid data or 1 with descriptive errors.

- [ ] **Step 1: Write the curriculum validator script**

Create `scripts/verify-curriculum.js` to assert that:
1. Every lesson in `spanish`, `japanese`, `french`, `german` contains an `id`, `title`, `level`, `vocabulary` (>= 10 items), and a valid `grammarGuide` with `concept`, `rules` (array >= 2), and `tip`.
2. Every lexicon file exports at least 100 items with valid fields (`id`, `word`, `translation`, `example`, `exampleTranslation`).
3. Lexicon IDs are unique across all datasets.

- [ ] **Step 2: Add test script to `package.json`**

Update `package.json`:
```json
"scripts": {
  "test:curriculum": "node scripts/verify-curriculum.js",
  "build": "vite build",
  ...
}
```

- [ ] **Step 3: Run test script to verify failure on current incomplete datasets**

Run: `npm run test:curriculum`
Expected: FAIL (identifying missing lexicon files and grammar guides).

- [ ] **Step 4: Commit verification harness**

```bash
git add scripts/verify-curriculum.js package.json
git commit -m "test: add curriculum and lexicon integrity test harness"
```

---

### Task 2: Core Lexicon Datasets (Spanish, Japanese, French, German)

**Files:**
- Create: `src/data/lexicon/spanish.js`
- Create: `src/data/lexicon/japanese.js`
- Create: `src/data/lexicon/french.js`
- Create: `src/data/lexicon/german.js`
- Create: `src/data/lexicon/index.js`

**Interfaces:**
- Produces:
  - `lexiconByLanguage`: `Record<string, Array<LexiconLemma>>`
  - `getLexiconByLanguage(langId: string): Array<LexiconLemma>`

- [ ] **Step 1: Implement Spanish Core Lexicon (`src/data/lexicon/spanish.js`)**
100+ high-frequency lemmas covering A1–B1 essentials:
- Core verbs (*ser, estar, tener, hacer, ir, poder, querer, decir, ver, saber, dar, llegar, pasar, deber, poner, parecer, hablar, tomar, vivir, sentir, buscar*).
- Core nouns (time, place, people, body, work, transport, technology, daily life).
- Essential connectives & prepositions (*porque, aunque, pero, siempre, nunca, antes, después, con, sin, hacia, entre*).

- [ ] **Step 2: Implement Japanese Core Lexicon (`src/data/lexicon/japanese.js`)**
100+ high-frequency lemmas covering N5–N3:
- Verbs (*suru, iku, kuru, miru, kiku, taberu, nomu, hanasu, kaku, yomu, wakaru, kau, matsu, toru, tsukau*).
- Adjectives -i and -na (*ii, warui, ookii, chiisai, atarashii, furui, hayai, omoshiroi, kirei, benri, taisetsu*).
- Core nouns & counters, essential particles (*wa, ga, o, ni, de, to, kara, made, yori, dake*).

- [ ] **Step 3: Implement French Core Lexicon (`src/data/lexicon/french.js`)**
100+ high-frequency lemmas with grammatical gender and articles (*être, avoir, faire, aller, dire, pouvoir, voir, savoir, vouloir, venir, falloir, devoir, croire, trouver, donner, parler, aimer*).

- [ ] **Step 4: Implement German Core Lexicon (`src/data/lexicon/german.js`)**
100+ high-frequency lemmas with definite articles (*sein, haben, werden, können, müssen, sagen, machen, geben, kommen, sollen, wollen, gehen, wissen, sehen, finden, bleiben*) and noun genders (`der, die, das`).

- [ ] **Step 5: Implement `src/data/lexicon/index.js`**
Expose `lexiconByLanguage` and `getLexiconByLanguage(langCode)`.

- [ ] **Step 6: Commit lexicon datasets**

```bash
git add src/data/lexicon/
git commit -m "feat(curriculum): add 100+ high-yield core lemmas per language for ES, JA, FR, and DE"
```

---

### Task 3: Enrich Lessons with Grammar Guides & Expanded Vocabulary

**Files:**
- Modify: `src/data/lessons/spanish.js`
- Modify: `src/data/lessons/japanese.js`
- Modify: `src/data/lessons/french.js`
- Modify: `src/data/lessons/german.js`

**Interfaces:**
- Consumes: Lesson objects
- Produces: Each lesson with `grammarGuide` object and 12–15 vocabulary items.

- [ ] **Step 1: Enrich Spanish Lessons (`src/data/lessons/spanish.js`)**
Add authentic `grammarGuide` to all 10 lessons:
1. `es-basics-1`: Subject Pronouns & Basic Sentence Word Order
2. `es-basics-2`: Gender & Number Agreement (El / La, -o / -a)
3. `es-greetings-1`: Formal vs. Informal Address (Tú vs. Usted)
4. `es-numbers-1`: Telling Time & Date Structures (*Son las... / A las...*)
5. `es-food-1`: Ordering with Politeness (*Quisiera / Me gustaría / ¿Me trae...?*)
6. `es-travel-1`: Ser vs. Estar (Essential Differences)
7. `es-family-1`: Possessive Adjectives (*mi, tu, su, nuestro*)
8. `es-family-2`: Expressing Likes & Preferences with *Gustar*
9. `es-work-1`: Present Perfect (*He trabajado / Has hecho*)
10. `es-opinions-1`: Expressing Viewpoints & Subjunctive Intro (*Creo que... / Es importante que...*)
Expand vocabulary in each lesson to 12–15 entries.

- [ ] **Step 2: Enrich Japanese Lessons (`src/data/lessons/japanese.js`)**
Add `grammarGuide` to all 10 lessons:
1. `ja-basics-1`: Topic Marker は (wa) vs. Copula です (desu)
2. `ja-basics-2`: Question Particle か (ka) & Polite Negation (ではありません / じゃありません)
3. `ja-greetings-1`: Japanese Politeness Levels & Bowing Etiquette
4. `ja-numbers-1`: Japanese Counters (つ, 人, 本, 枚)
5. `ja-food-1`: Object Marker を (o) and Ordering with ください (kudasai)
6. `ja-travel-1`: Destination & Location Particles (に / へ / で)
7. `ja-family-1`: Humble vs. Respectful Family Terms (Kazoku vs. Gokazoku)
8. `ja-family-2`: Expressing Desire with 〜たい (tai) and Likes with 好き (suki)
9. `ja-work-1`: Past Tense Conjugation (〜ました / 〜ませんでした)
10. `ja-opinions-1`: Giving Reasons with 〜から (kara) and Thinking with 〜と思う (to omou)
Expand vocabulary in each lesson to 12–15 entries.

- [ ] **Step 3: Enrich French Lessons (`src/data/lessons/french.js`)**
Add `grammarGuide` to all 10 French lessons (Gender, Negation *ne...pas*, Near Future *aller + inf*, Passé Composé with *avoir/être*, Direct Object Pronouns).
Expand vocabulary in each lesson to 12–15 entries.

- [ ] **Step 4: Enrich German Lessons (`src/data/lessons/german.js`)**
Add `grammarGuide` to all 10 German lessons (Noun Capitalization & Genders *der/die/das*, Accusative Case, Verb Second rule V2, Modal Verbs *können/müssen*, Separable Verbs).
Expand vocabulary in each lesson to 12–15 entries.

- [ ] **Step 5: Run curriculum verification script**

Run: `npm run test:curriculum`
Expected: PASS (all 40 lessons have valid grammar guides and vocabulary thresholds).

- [ ] **Step 6: Commit enriched curriculum**

```bash
git add src/data/lessons/
git commit -m "feat(curriculum): enrich 40 lessons across 4 languages with grammar guides and expanded vocabulary"
```

---

### Task 4: Grammar Micro-Guide Component (`GrammarCard.jsx`)

**Files:**
- Create: `src/components/lesson/GrammarCard.jsx`
- Modify: `src/components/lesson/ExerciseRenderer.jsx` (if needed for fallback)

**Interfaces:**
- Produces:
  - `<GrammarCard grammarGuide={...} langCode={...} onStart={...} isModalView={boolean} />`

- [ ] **Step 1: Build `GrammarCard.jsx` using design kit**
- Header: Badge `"1-min Grammar Guide"`, read time badge (`<Clock size={14}/> 1 min`).
- Concept Box: Highlighted concept description using `bg-brand-50 border-brand-200 text-ink-900`.
- Rule Breakdown: Cards with pattern badges, rule text, authentic target-language examples with translation.
- Audio Button: Integrate `<AudioControls>` (meeting 44px touch target) for pronunciation of example sentences.
- Etiquette/Memory Tip: Amber callout card (`bg-amber-50 border-amber-200 text-amber-900`) with `<Sparkles size={16}/>`.
- Action Footer: If not in modal view, display `<Button shape="pill" size="lg" icon={ArrowRight} onClick={onStart}>Start Exercises</Button>`.

- [ ] **Step 2: Commit GrammarCard component**

```bash
git add src/components/lesson/GrammarCard.jsx
git commit -m "feat(ui): create GrammarCard component for 1-minute grammar micro-guides"
```

---

### Task 5: Integrate Grammar Guides into `LessonPlayer.jsx`

**Files:**
- Modify: `src/pages/LessonPlayer.jsx`

**Interfaces:**
- Consumes: `<GrammarCard>`, `<Modal>`, `grammarGuide` from current lesson.

- [ ] **Step 1: Add Step 0 (Pre-Lesson Grammar Guide) state to `LessonPlayer`**
- Initialize `currentStep`: If `lesson.grammarGuide` is present, display `<GrammarCard>` before exercises begin (`isPreLessonGuide: true`).
- Display progress bar as 0% during the guide step.
- When user clicks "Start Exercises", transition smoothly to exercise 1.

- [ ] **Step 2: Add in-flight "Grammar Rule" button & peek Modal in header**
- In the `LessonPlayer` header next to the close button and hearts, add a button: `<Button variant="secondary" size="sm" icon={BookOpen} onClick={() => setShowGrammarModal(true)}>Rule</Button>`.
- Render a `<Modal isOpen={showGrammarModal} onClose={() => setShowGrammarModal(false)} title="Grammar Micro-Guide">` containing `<GrammarCard isModalView grammarGuide={lesson.grammarGuide} langCode={lesson.languageId} />`.

- [ ] **Step 3: Verify keyboard accessibility & Escape dismissal**
Ensure pressing Escape closes the grammar modal and returns focus to the active exercise without losing player state or answers.

- [ ] **Step 4: Commit LessonPlayer integration**

```bash
git add src/pages/LessonPlayer.jsx
git commit -m "feat(player): integrate pre-lesson grammar guide step and in-flight peek modal"
```

---

### Task 6: Connect Expanded Lexicon to Practice Arena & SRS Gym

**Files:**
- Modify: `src/pages/Practice.jsx`

**Interfaces:**
- Consumes: `getLexiconByLanguage` from `src/data/lexicon` and `lessonsByLanguage`.

- [ ] **Step 1: Merge Lexicon into `allVocabWords` in `Practice.jsx`**
Update `allVocabWords` memo to combine:
1. All vocabulary from `lessonsByLanguage[currentLang]`.
2. All vocabulary from `getLexiconByLanguage(currentLang)`.
Deduplicate by ID or clean word text.

- [ ] **Step 2: Update Level Filters and Search in Practice Arena**
Ensure:
- SRS Flashcard pool draws from the combined active pool.
- Speed Drills and Listening Ear Training can draw prompts from the expanded lexicon.
- Master Vocabulary Library search and level badges (`A1`, `A2`, `B1`, `N5`, `N4`, `N3`) filter correctly over the 150+ items.

- [ ] **Step 3: Commit Practice page integration**

```bash
git add src/pages/Practice.jsx
git commit -m "feat(practice): integrate 600+ word core lexicon into SRS gym, speed drills, and master library"
```

---

### Task 7: Comprehensive Verification & Production Build

**Files:**
- Verification: `scripts/verify-curriculum.js`
- Verification: `npm run build`

- [ ] **Step 1: Run curriculum verification script**

Run: `npm run test:curriculum`
Expected: PASS (0 errors, 40 grammar guides verified, 600+ vocabulary items validated across 4 languages).

- [ ] **Step 2: Run production build**

Run: `npm run build`
Expected: Clean Vite build without bundle errors or missing imports.

- [ ] **Step 3: Verify live interactions**
- Start dev server or preview: verify `LessonPlayer` shows the Grammar Micro-Guide as Step 0 and allows continuing to exercises.
- Verify in-exercise "Rule" button opens the grammar modal and closes with Escape.
- Verify audio controls in GrammarCard play speech cleanly.
- Verify Practice page displays 150+ words in Master Vocabulary Library for all selected languages.

- [ ] **Step 4: Commit final verification and updates**

```bash
git add -A
git commit -m "chore: complete Phase 1 high-yield vocabulary expansion and grammar micro-guides"
```
