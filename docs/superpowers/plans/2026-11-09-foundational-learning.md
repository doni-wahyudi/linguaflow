# Foundational Literacy, Script Mastery & Multi-Skill Curriculum Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement comprehensive Japanese script mastery (Hiragana, Katakana, N5 Kanji), European phonics (ES, FR, DE), toggleable Furigana reading scaffolding, interactive Sentence Builders, and multi-turn Conversational Dialogue roleplay exercises.

**Architecture:** Client-side static reactive datasets under `src/data/characters/` combined with an upgraded `/characters` Studio Hub, `<FuriganaText>` `<ruby>` parser, `<SentenceBuilder>` chip scramble engine, `<DialoguePlayer>` multi-turn conversational roleplay component, and Level 0 curriculum foundations across all 4 languages.

**Tech Stack:** React 18, Tailwind CSS, Lucide React, Framer Motion, HTML5 Canvas & Ruby tags, Web Speech Synthesis & Recognition API, Vite.

**Spec:** [docs/superpowers/specs/2026-11-09-foundational-learning-design.md](/docs/superpowers/specs/2026-11-09-foundational-learning-design.md)

## Global Constraints
- 100% Client-Side execution (zero backend, zero database, zero external AI APIs, zero monthly hosting costs).
- GitHub Pages compatibility (HashRouter navigation, zero SSR requirements).
- WCAG 2.1 AA accessibility (44px+ touch targets per §2.5.5, 4.5:1 text contrast per §1.4.3, full keyboard support, aria-live updates).
- Design system compliance: utilize `@ui` design tokens and primitives exclusively (no arbitrary Tailwind colors or unvetted hex values).

---

### Task 1: Character & Phonics Datasets + Verification Harness

**Files:**
- Create: `src/data/characters/japanese.js`
- Create: `src/data/characters/phonics.js`
- Create: `src/data/characters/index.js`
- Create: `scripts/verify-characters.js`
- Modify: `package.json`

**Interfaces:**
- Consumes: None (pure data and test harness).
- Produces: `hiraganaData`, `katakanaData`, `kanjiN5Data`, `phonicsByLanguage`, `getCharacterById(id)`, `getCharactersByGroup(lang, group)`.

- [ ] **Step 1: Write the failing verification harness (`scripts/verify-characters.js`)**
- [ ] **Step 2: Add `"test:characters": "node scripts/verify-characters.js"` to `package.json` and verify it fails**
- [ ] **Step 3: Implement `src/data/characters/japanese.js` with complete Hiragana, Katakana, and N5 Kanji catalogs**
- [ ] **Step 4: Implement `src/data/characters/phonics.js` with Spanish, French, and German alphabet & phonics rules**
- [ ] **Step 5: Implement `src/data/characters/index.js` with lookup and query helpers**
- [ ] **Step 6: Run `npm run test:characters` to verify all datasets pass schema assertions**
- [ ] **Step 7: Commit Task 1**

```bash
git add src/data/characters/ package.json scripts/verify-characters.js
git commit -m "feat(characters): create Japanese kana/kanji and European phonics datasets"
```

---

### Task 2: FuriganaText Reading Helper Component & LessonPlayer Integration

**Files:**
- Create: `src/components/ui/FuriganaText.jsx`
- Modify: `src/components/ui/index.js`
- Modify: `src/pages/LessonPlayer.jsx`

**Interfaces:**
- Consumes: `user.selectedLanguage` from `UserContext`.
- Produces: `<FuriganaText text="..." reading="..." showFurigana={bool} showRomaji={bool} />`.

- [ ] **Step 1: Implement `src/components/ui/FuriganaText.jsx` parsing brackets `[漢字]{かんじ}` or regex reading pairs into `<ruby>`/`<rt>`**
- [ ] **Step 2: Export `FuriganaText` from `src/components/ui/index.js`**
- [ ] **Step 3: Integrate Furigana / Romaji toggle controls in `src/pages/LessonPlayer.jsx` header for Japanese lessons**
- [ ] **Step 4: Verify FuriganaText renders correctly with ruby tags in browser**
- [ ] **Step 5: Commit Task 2**

```bash
git add src/components/ui/FuriganaText.jsx src/components/ui/index.js src/pages/LessonPlayer.jsx
git commit -m "feat(ui): add FuriganaText component with in-lesson toggle controls"
```

---

### Task 3: Interactive SentenceBuilder (Word-Tile Scramble) Component

**Files:**
- Create: `src/components/lesson/SentenceBuilder.jsx`
- Modify: `src/components/lesson/ExerciseRenderer.jsx`

**Interfaces:**
- Consumes: `exercise: { targetSentence, tokens, distractors, translation, prompt }`, `onAnswer(isCorrect)`.
- Produces: Rendered interactive sentence constructor dispatched on `type: 'scramble'`.

- [ ] **Step 1: Implement `SentenceBuilder.jsx` with answer tray, available tile bank, chip movement animations, sound effects, and reset action**
- [ ] **Step 2: Wire `case 'scramble': case 'sentenceBuilder':` in `ExerciseRenderer.jsx`**
- [ ] **Step 3: Test tile reordering, undo, reset, and correct/incorrect evaluation**
- [ ] **Step 4: Commit Task 3**

```bash
git add src/components/lesson/SentenceBuilder.jsx src/components/lesson/ExerciseRenderer.jsx
git commit -m "feat(lesson): add SentenceBuilder word-tile scramble exercise component"
```

---

### Task 4: Interactive DialoguePlayer (Conversational Roleplay) Component

**Files:**
- Create: `src/components/lesson/DialoguePlayer.jsx`
- Modify: `src/components/lesson/ExerciseRenderer.jsx`

**Interfaces:**
- Consumes: `exercise: { scenario, dialogue: [{ speaker, text, translation, role, options, correctIndex }] }`, `onAnswer(isCorrect)`.
- Produces: Multi-turn chat-style conversational roleplay dispatched on `type: 'dialogue'`.

- [ ] **Step 1: Implement `DialoguePlayer.jsx` with chat bubble sequence, Speaker A audio playback, Speaker B choice prompts, and cultural notes**
- [ ] **Step 2: Wire `case 'dialogue':` in `ExerciseRenderer.jsx`**
- [ ] **Step 3: Test turn progression, audio triggers, and option validation**
- [ ] **Step 4: Commit Task 4**

```bash
git add src/components/lesson/DialoguePlayer.jsx src/components/lesson/ExerciseRenderer.jsx
git commit -m "feat(lesson): add DialoguePlayer multi-turn conversational roleplay component"
```

---

### Task 5: Character & Alphabet Studio Hub (`/characters` & `/writing`)

**Files:**
- Create: `src/components/characters/SoundChartGrid.jsx`
- Create: `src/components/characters/CharacterInspectorModal.jsx`
- Create: `src/pages/CharacterStudio.jsx`
- Modify: `src/Router.jsx`
- Modify: `src/components/layout/Navbar.jsx`

**Interfaces:**
- Consumes: Datasets from `src/data/characters/`, `useSpeech()`, `useUser()`.
- Produces: Complete 3-tab Studio Hub at `/characters` (with `/writing` alias).

- [ ] **Step 1: Implement `SoundChartGrid.jsx` for Gojūon (Hiragana/Katakana), Kanji cards, and European Phonics with audio on click**
- [ ] **Step 2: Implement `CharacterInspectorModal.jsx` for detailed stroke info, mnemonics, and vocabulary examples**
- [ ] **Step 3: Implement `CharacterStudio.jsx` integrating Sound Charts, Handwriting Canvas with guidelines, and Character Gym**
- [ ] **Step 4: Update `src/Router.jsx` with `/characters` route and `/writing` alias**
- [ ] **Step 5: Update `src/components/layout/Navbar.jsx` nav link to "Characters & Writing"**
- [ ] **Step 6: Commit Task 5**

```bash
git add src/components/characters/ src/pages/CharacterStudio.jsx src/Router.jsx src/components/layout/Navbar.jsx
git commit -m "feat(characters): implement Character & Alphabet Studio hub at /characters"
```

---

### Task 6: Level 0 Curriculum Enrichment Across All 4 Languages

**Files:**
- Modify: `src/data/categories.js`
- Modify: `src/data/lessons/japanese.js`
- Modify: `src/data/lessons/spanish.js`
- Modify: `src/data/lessons/french.js`
- Modify: `src/data/lessons/german.js`
- Modify: `scripts/verify-curriculum.js`

**Interfaces:**
- Consumes: Foundational lessons schema and new exercise types.
- Produces: 47 curriculum lessons (40 standard + 7 Level 0 foundational lessons), plus scramble and dialogue exercises across all languages.

- [ ] **Step 1: Add `foundations` category (`order: 0`) in `src/data/categories.js`**
- [ ] **Step 2: Add 4 foundational lessons (`ja-kana-1`, `ja-kana-2`, `ja-kana-3`, `ja-kanji-1`) and scramble/dialogue exercises to `src/data/lessons/japanese.js`**
- [ ] **Step 3: Add `es-phonics-1` and scramble/dialogue exercises to `src/data/lessons/spanish.js`**
- [ ] **Step 4: Add `fr-phonics-1` and scramble/dialogue exercises to `src/data/lessons/french.js`**
- [ ] **Step 5: Add `de-phonics-1` and scramble/dialogue exercises to `src/data/lessons/german.js`**
- [ ] **Step 6: Update `scripts/verify-curriculum.js` to assert Level 0 lessons and validate scramble & dialogue schemas**
- [ ] **Step 7: Run `npm run test:curriculum` to verify all 47 lessons and exercise schemas**
- [ ] **Step 8: Commit Task 6**

```bash
git add src/data/categories.js src/data/lessons/ scripts/verify-curriculum.js
git commit -m "feat(curriculum): enrich curriculum with Level 0 foundations, scramble, and dialogue exercises"
```

---

### Task 7: Comprehensive Verification & Production Build

**Files:**
- Modify: `scripts/verify-live-interactions.js`

**Interfaces:**
- Consumes: Headless browser CDP runner, all application routes and exercise components.
- Produces: 15 passing end-to-end tests and clean production build.

- [ ] **Step 1: Extend `scripts/verify-live-interactions.js` with Tests 12 to 15 (Character Studio, FuriganaText, SentenceBuilder, DialoguePlayer)**
- [ ] **Step 2: Run all test suites (`npm run test:characters`, `npm run test:pronunciation`, `npm run test:curriculum`, `npm run test:interactions`)**
- [ ] **Step 3: Run `npm run build` and ensure production build succeeds with zero errors**
- [ ] **Step 4: Commit Task 7**

```bash
git add scripts/verify-live-interactions.js
git commit -m "test(e2e): verify character studio, furigana, sentence builder, and dialogue interactions"
```
