# Stroke Order & Stroke Direction Guidance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement stroke order and stroke direction guidance for Japanese (Hiragana, Katakana, N5 Kanji) and European alphabets across the Digital Calligraphy Canvas and Character Studio cards with interactive visual tracers and step scrubbers.

**Architecture:** A static, comprehensive stroke dataset (`strokeData.js`) defines canonical stroke orders, directional angles, SVG paths, normalized 0-100 coordinates, and calligraphy principles. A dedicated `StrokeOrderGuide` component renders step-by-step visual pill sequences and direction cues. `WritingCanvas` renders on-canvas numbered start anchors with directional chevrons, animated glowing brush tracers, and step scrubbers, seamlessly linked with `CharacterStudio`.

**Tech Stack:** React 18, HTML5 Canvas 2D, SVG 0-100 normalized coordinate system, Framer Motion, Lucide Icons, Tailwind CSS, Node.js test runners.

**Spec:** `docs/superpowers/specs/2026-11-09-stroke-order-guidance-design.md`

## Global Constraints

- 100% Client-side zero-cost architecture with zero external paid APIs.
- Strict WCAG 2.1 AA/AAA dark and light theme contrast across all canvas overlays and guide components.
- Normalized 0-100 coordinate space for all stroke anchors and paths to scale cleanly across all screen sizes.
- Full offline-first fallback for any unmapped characters using heuristic directional generators.
- Complete regression suite (`npm test`, `npm run test:all`, `npm run build`) passing with 0 errors.

---

### Task 1: Comprehensive Stroke Order & Direction Dataset

**Files:**
- Create: `src/data/characters/strokeData.js`
- Modify: `src/data/characters/index.js`
- Create: `scripts/verify-stroke-order.js`
- Modify: `package.json`

**Interfaces:**
- Produces:
  - `CANONICAL_STROKE_RULES`: Array of 7 canonical calligraphy rules `{ id, title, titleJa, description, example }`.
  - `getStrokeData(char)`: Function returning `{ char, strokeCount, principles, strokes }`.
  - Each stroke in `strokes`: `{ order: number, direction: string, startPoint: { x, y }, endPoint: { x, y }, path: string, arrowAngle: number, description: string }`.

- [ ] **Step 1: Write verification script `scripts/verify-stroke-order.js`**

Write test verifying that `CANONICAL_STROKE_RULES` contains the 7 canonical rules, and `getStrokeData` returns valid continuous strokes for Hiragana, Katakana, Kanji, and Latin letters within the 0-100 coordinate range.

- [ ] **Step 2: Run verification to confirm it fails**

Run: `node scripts/verify-stroke-order.js`
Expected: FAIL (module not found)

- [ ] **Step 3: Implement `src/data/characters/strokeData.js`**

Implement:
- `CANONICAL_STROKE_RULES` with 7 canonical rules.
- Pre-mapped stroke entries for Hiragana, Katakana, and Core N5 Kanji.
- Procedural stroke generator for Latin letters (A-Z) and unmapped characters based on glyph anatomy.
- `getStrokeData(char)` helper.
- Export from `src/data/characters/index.js`.
- Add `node scripts/verify-stroke-order.js` to `package.json` test script.

- [ ] **Step 4: Run verification script to verify it passes**

Run: `node scripts/verify-stroke-order.js`
Expected: PASS with 0 errors.

- [ ] **Step 5: Run existing `npm test` suite**

Run: `npm test`
Expected: PASS (all tests pass including stroke order).

---

### Task 2: Visual Stroke Order Component (`StrokeOrderGuide.jsx`)

**Files:**
- Create: `src/components/writing/StrokeOrderGuide.jsx`

**Interfaces:**
- Consumes:
  - `getStrokeData(char)` from `src/data/characters/strokeData.js`
  - `CANONICAL_STROKE_RULES` from `src/data/characters/strokeData.js`
- Produces:
  - `<StrokeOrderGuide character={char} activeStroke={number} onSelectStroke={fn} className={string} />`

- [ ] **Step 1: Implement `StrokeOrderGuide.jsx`**

Implement:
- Horizontal pill sequence bar (`[ ① ➔ ] [ ② ↓ ] [ ③ ↻ ]`) with active stroke highlight.
- Expandable step-by-step list showing order badge, directional arrow with `transform: rotate(${arrowAngle}deg)`, description, and start/end coordinates.
- Calligraphy rule badges with rule explanations.
- Keyboard accessible navigation and high contrast styling in dark & light themes.

- [ ] **Step 2: Verify component imports and syntax**

Run: `node -e "import('./src/components/writing/StrokeOrderGuide.jsx').then(() => console.log('OK'))"`
Expected: OK

---

### Task 3: Digital Calligraphy Canvas Enhancements (`WritingCanvas.jsx`)

**Files:**
- Modify: `src/components/writing/WritingCanvas.jsx`

**Interfaces:**
- Consumes:
  - `getStrokeData(targetCharacter)` from `../../data/characters/strokeData.js`
- Produces:
  - Toolbar toggle button: `Stroke Order (筆順)`
  - Direct canvas overlay with numbered anchors (`①`, `②`, `③`), directional chevrons, and ghost stroke trajectories
  - Stroke animation player with glowing tracer ball
  - Step scrubber controls (`Prev`, `Next`, `Play All`, `Pause`)
  - Exposes `activeStroke` state for synchronization with external guides

- [ ] **Step 1: Enhance `WritingCanvas.jsx`**

Implement:
- Integrate `getStrokeData(targetCharacter)`.
- Add toolbar toggle button `Stroke Order (筆順)` (`aria-label="Toggle stroke order guidance"`).
- Overlay SVG canvas layer matching container dimensions:
  - Render numbered start point circles with directional chevron arrows rotated according to `arrowAngle`.
  - Draw ghost dashed stroke trajectories for active stroke or all strokes.
  - Render animated tracer particle when playback is active.
- Add scrubber control bar when guide is active:
  - `Prev Stroke` button
  - `Next Stroke` button
  - `Play / Pause` toggle
  - `Stroke X of Y` indicator
- Preserve all existing drawing, pressure sensitivity, undo, clear, and export features.

- [ ] **Step 2: Test bundle compilation**

Run: `npm run build`
Expected: PASS (0 errors).

---

### Task 4: Character Studio Integration (`CharacterStudio.jsx`)

**Files:**
- Modify: `src/pages/CharacterStudio.jsx`

**Interfaces:**
- Consumes:
  - `getStrokeData` from `../data/characters/strokeData.js`
  - `StrokeOrderGuide` from `../components/writing/StrokeOrderGuide.jsx`
  - `WritingCanvas` from `../components/writing/WritingCanvas.jsx`

- [ ] **Step 1: Update Character Cards & Detail Views**

Implement:
- In Kana grid & detail card: Show stroke order pills and full `StrokeOrderGuide` in the detail drawer/card.
- In Kanji cards: Display stroke order breakdown and rule badges.
- In Calligraphy Canvas tab:
  - Side-by-side or stacked layout: `WritingCanvas` on the left/top, and `StrokeOrderGuide` on the right/bottom.
  - Synchronize `activeStroke` between `StrokeOrderGuide` and `WritingCanvas`.

- [ ] **Step 2: Verify bundle build**

Run: `npm run build`
Expected: PASS.

---

### Task 5: End-to-End Live Browser Verification & Full Regression

**Files:**
- Modify: `scripts/verify-live-interactions.js`

**Interfaces:**
- Produces:
  - Test 19: Stroke Order Guidance in Canvas and Character Studio

- [ ] **Step 1: Add Test 19 to `verify-live-interactions.js`**

Implement Test 19 in `scripts/verify-live-interactions.js`:
- Navigates to `/characters?tab=canvas`.
- Verifies `Stroke Order (筆順)` toggle button is present and active.
- Verifies on-canvas stroke anchors (`[data-testid="stroke-anchor-1"]` or SVG stroke markers) are rendered.
- Tests clicking `Next Stroke` and `Prev Stroke` scrubber buttons.
- Verifies `StrokeOrderGuide` is mounted and interactive.
- Navigates to Japanese Kana tab and verifies stroke details in character cards.

- [ ] **Step 2: Run complete test suite**

Run: `npm test`
Expected: PASS (all 7 unit test scripts pass).

- [ ] **Step 3: Run live browser interaction suite**

Run: `npm run test:all`
Expected: PASS (all 19 end-to-end interactive tests pass).

- [ ] **Step 4: Run production build**

Run: `npm run build`
Expected: PASS (clean production build).
