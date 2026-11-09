# Stroke Order & Stroke Direction Guidance Design Specification

> **Author:** Software Dev Team · Full-stack engineer  
> **Status:** Approved  
> **Date:** 2026-11-09  
> **Target Release:** LinguaFlow v1.4.0 (`feat/stroke-order-guidance`)  
> **Deployment Constraint:** 100% Client-Side, Zero-Backend, Zero-Paid APIs, Accessible WCAG 2.1 AA/AAA  

---

## 1. Executive Summary & Pedagogical Architecture

### 1.1 The Calligraphy & Stroke Order Imperative
In East Asian orthography (Japanese Hiragana, Katakana, and Kanji), stroke order (筆順 *hitsujun*) and stroke direction are foundational to character balance, legibility, and motor memory. Drawing a stroke in reverse (e.g., bottom-to-top instead of top-to-bottom, or right-to-left instead of left-to-right) destroys the natural brush taper and cadence of Japanese script.

Similarly, in European alphabets (Spanish, French, German), Latin penmanship relies on predictable ductus (downstrokes for vertical stems, left-to-right crossbars, counter-clockwise bowls).

### 1.2 Core Deliverables
1. **Comprehensive Stroke Dataset (`src/data/characters/strokeData.js`)**:
   - Universal 7 canonical calligraphy rules of East Asian calligraphy.
   - Detailed stroke geometry for Hiragana, Katakana, and all 50 Core N5 Kanji.
   - Direction heuristics and procedural fallback generator for Latin alphabet and unmapped characters.
   - Helper function `getStrokeData(char)` returning canonical stroke order, direction tags, normalized 0-100 coordinates, SVG drawing paths, arrow rotations, and plain-language cues.
2. **Visual Stroke Order Component (`src/components/writing/StrokeOrderGuide.jsx`)**:
   - Step-by-step visual pill sequence (`[ ① ➔ ] [ ② ↓ ] [ ③ ↻ ]`).
   - Detailed stroke list with directional badges, trajectory angles, and hand-movement cues.
   - Applicable calligraphy rule chips and educational reference drawer.
3. **Digital Calligraphy Canvas Enhancements (`src/components/writing/WritingCanvas.jsx`)**:
   - "Stroke Order (筆順)" toolbar toggle.
   - Interactive canvas overlay rendering numbered start anchors (`①`, `②`, `③`), trajectory paths, and directional chevron arrows.
   - Animated glowing stroke tracer and sequence replay.
   - Step scrubber controls (`Prev`, `Next`, `Play/Pause`, `All`).
4. **Character Studio Hub Integration (`src/pages/CharacterStudio.jsx`)**:
   - Stroke order badges and directional cues embedded into character cards.
   - Integrated side-by-side Calligraphy Canvas & Stroke Order Guide layout.
5. **Automated Verification Suite**:
   - `scripts/verify-stroke-order.js` unit verification for dataset integrity, coordinate boundaries, direction angles, and sequential order.
   - Extended `scripts/verify-live-interactions.js` (Test 19) validating stroke order controls and animations in headless browser.

---

## 2. Canonical Calligraphy Principles

The dataset exports `CANONICAL_STROKE_RULES`:
1. **Top to bottom (上から下へ)**: Higher strokes precede lower strokes (e.g. 三, 言, E, F).
2. **Left to right (左から右へ)**: Left-side radicals precede right-side radicals (e.g. 川, 行, H).
3. **Horizontal before vertical (横から縦へ)**: Intersecting strokes write horizontal bars before vertical stems (e.g. 十, 木, t).
4. **Center before sides (中から外へ)**: Vertically dominant center stems precede flanking wings (e.g. 小, 水, 山).
5. **Enclosure before inside (外側から内側へ)**: Outer bounding boxes are framed before placing interior contents (e.g. 日, 口, 月).
6. **Close enclosure last (囲みを最後に閉じる)**: Bottom horizontal baseline closes the box after interior strokes are complete (e.g. 田, 目, 四, 国).
7. **Minor dot last (最後に点を打つ)**: Diacritics, dots, and trailing release slashes are drawn last (e.g. 犬, 太, 玉, i, j).

---

## 3. Data Schema & Geometry Specification

Each character stroke sequence conforms to the following schema:
```javascript
{
  char: 'あ',
  strokeCount: 3,
  principles: ['Horizontal before vertical', 'Top to bottom'],
  strokes: [
    {
      order: 1,
      direction: 'left-to-right',
      startPoint: { x: 20, y: 32 },
      endPoint: { x: 80, y: 32 },
      path: 'M 20 32 L 80 32',
      arrowAngle: 0, // 0 deg = right
      description: 'Horizontal bar drawn firmly from left to right.'
    },
    {
      order: 2,
      direction: 'top-to-bottom-curve',
      startPoint: { x: 48, y: 15 },
      endPoint: { x: 42, y: 88 },
      path: 'M 48 15 Q 46 50 42 88',
      arrowAngle: 90, // 90 deg = down
      description: 'Vertical stem curving gently downwards through the center.'
    },
    {
      order: 3,
      direction: 'loop-clockwise',
      startPoint: { x: 68, y: 44 },
      endPoint: { x: 74, y: 78 },
      path: 'M 68 44 C 20 38, 16 88, 52 82 C 78 78, 86 52, 60 52 C 40 52, 42 76, 74 78',
      arrowAngle: 135,
      description: 'Starting at top-right, sweep down-left and create a wide clockwise loop.'
    }
  ]
}
```

---

## 4. Component Architecture & UI Contracts

### 4.1 `StrokeOrderGuide.jsx`
- **Props**:
  - `character`: string (glyph to display)
  - `activeStroke`: number | null (currently highlighted/scrubbed stroke index, 1-indexed)
  - `onSelectStroke`: (order: number) => void (callback when user clicks a stroke pill or item)
  - `className`: string
- **Renders**:
  - Pill carousel/flex bar: `[ ① ➔ ] [ ② ↓ ] [ ③ ↻ ]` with active states and keyboard navigation.
  - Step list: collapsible/scrollable card list showing order, directional badge, hand movement cue.
  - Rule tags: badges referencing relevant canonical rules with popover tooltips.

### 4.2 `WritingCanvas.jsx` Enhancements
- **New State**:
  - `showStrokeGuide`: boolean (defaults to `true` when stroke data is available)
  - `activeGuideStroke`: number (1-indexed or 0 for "All")
  - `isPlayingAnimation`: boolean
- **Canvas Overlay**:
  - Overlaid SVG layer positioned over the canvas matching container bounds (0-100 viewBox).
  - Renders circle badge for each stroke `startPoint` with stroke number (`1`, `2`, `3`).
  - Directional chevron arrow indicating initial trajectory (`arrowAngle`).
  - Animated tracer dot and path stroke rendering when animation plays.
  - Toolbar button: `Stroke Order (筆順)` toggle button with active indicator.
  - Sub-toolbar when guide is active: `[◀ Prev] [Stroke X/N] [Next ▶] [▶ Play / ⏸ Pause]`.

### 4.3 `CharacterStudio.jsx` Integration
- In Kana cards and detail cards: displays stroke count badge and opens stroke breakdown in detail modal.
- In Kanji cards: displays stroke count and directional summary.
- In Calligraphy Canvas tab: responsive grid with `WritingCanvas` and `StrokeOrderGuide` side-by-side, synchronizing active stroke scrubbing and playback.

---

## 5. Verification & Quality Gates
- `npm test`: Runs `verify-stroke-order.js` along with curriculum, character, pronunciation, dark contrast, supabase, and sync tests.
- `npm run test:all`: Extends interaction suite with Test 19 to test live canvas stroke overlay, scrubber step buttons, and character studio guide in headless Edge.
- `npm run build`: Zero errors, strict type & asset resolution.
