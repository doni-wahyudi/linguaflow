# 🌿 LinguaFlow — Modern Language Learning Web Application

> **"Learn Languages Beautifully"**  
> A production-grade, human-crafted React + Vite single-page application built on evidence-based cognitive learning science (SM-2 Spaced Repetition) and tasteful gamification.

---

## 📚 Quick Navigation

- [1. Web Development 101 for Beginners](#1-web-development-101-for-beginners)
- [2. How This Project Was Engineered (SDLC)](#2-how-this-project-was-engineered-sdlc)
- [3. Getting Started & Running Locally](#3-getting-started--running-locally)
- [4. Project Architecture & Code Map](#4-project-architecture--code-map)
- [5. How the Features Work Under the Hood](#5-how-the-features-work-under-the-hood)
- [6. How to Add a New Language or Lesson](#6-how-to-add-a-new-language-or-lesson)
- [7. Production Build & Deployment](#7-production-build--deployment)

---

## 1. Web Development 101 for Beginners

If you are new to web development, here is how modern websites work in plain English:

### The 3 Core Building Blocks
1. **HTML (HyperText Markup Language)**: The skeleton of the page (headers, paragraphs, buttons, forms).
2. **CSS (Cascading Style Sheets)**: The clothes and styling (colors, fonts, padding, responsive layout). We use **Tailwind CSS**, which lets us style directly with utility classes.
3. **JavaScript / React**: The brain and interactivity. When you click a flashcard or answer a quiz, JavaScript calculates the score, updates the progress bar, and saves the result without reloading the page.

### Why Vite and React?
- **React**: A component-based library created by Facebook/Meta. Instead of writing huge messy HTML files, we build small, reusable LEGO bricks (`<Button>`, `<FlashCard>`, `<ProgressBar>`) and snap them together.
- **Vite** ("veet"): The ultra-fast modern build engine and development server. When you save code, Vite updates your browser instantly (Hot Module Replacement / HMR) in milliseconds.

```
You write React (.jsx) + Tailwind CSS
              │
              ▼
Vite builds & bundles your code
              │
              ▼
Browser runs fast JavaScript SPA + LocalStorage
```

---

## 2. How This Project Was Engineered (SDLC)

In professional software engineering, you never jump straight into typing code. We followed a complete **Software Development Life Cycle (SDLC)**:

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   Phase 1: PRD   │ ──► │ Phase 2: Design  │ ──► │  Phase 3: Arch   │
│ docs/01-PRD.md   │     │docs/02-DESIGN.md │     │ docs/03-ARCH.md  │
└──────────────────┘     └──────────────────┘     └──────────────────┘
                                                            │
┌──────────────────┐     ┌──────────────────┐               │
│Phase 6: Deploy   │ ◄── │ Phase 5: Test    │ ◄── Phase 4: Code ◄─┘
│ Vercel / Netlify │     │ Build & QA audit │     │ src/ Components  │
└──────────────────┘     └──────────────────┘
```

Detailed architectural blueprints are preserved in `/docs`:
- 📋 [**docs/01-PRD.md**](docs/01-PRD.md) — Product Requirements Document: Vision, target persona, feature specs, gamification equations, and success metrics.
- 🎨 [**docs/02-DESIGN-SYSTEM.md**](docs/02-DESIGN-SYSTEM.md) — Design System: 60-30-10 color architecture, typography pairings, fluid clamp sizing, tactile component states, and accessibility standards.
- 🏗️ [**docs/03-TECHNICAL-ARCHITECTURE.md**](docs/03-TECHNICAL-ARCHITECTURE.md) — Technical Architecture: State flow, SM-2 spaced repetition algorithm, routing map, and data schemas.

---

## 3. Getting Started & Running Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18 or higher recommended).

### 1. Install dependencies
```bash
npm install
```

### 2. Start the development server
```bash
npm run dev
```
Open your browser to `http://localhost:3000` (or the URL printed in your terminal).

### 3. Build for production
```bash
npm run build
```
This produces optimized production files in the `/dist` directory.

---

## 4. Project Architecture & Code Map

```
web_language/
├── docs/                             # SDLC Specifications
│   ├── 01-PRD.md                     # Product Requirements Document
│   ├── 02-DESIGN-SYSTEM.md           # Design Tokens & Component Anatomy
│   └── 03-TECHNICAL-ARCHITECTURE.md  # Technical Architecture & Algorithms
├── public/                           # Static assets & SVG icons
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── ui/                       # Base design system components
│   │   │   ├── Button.jsx            # 6-state tactile button
│   │   │   ├── Card.jsx              # Surface elevation cards
│   │   │   ├── ProgressBar.jsx       # Animated progress indicator
│   │   │   ├── Badge.jsx             # Semantic pill tags
│   │   │   ├── Modal.jsx             # Accessible backdrop dialog
│   │   │   └── Input.jsx             # Form inputs with floating labels
│   │   ├── layout/
│   │   │   ├── Navbar.jsx            # Sticky desktop top navigation
│   │   │   ├── MobileNav.jsx         # Bottom mobile tab navigation
│   │   │   └── PageWrapper.jsx       # Layout orchestrator + animations
│   │   ├── dashboard/
│   │   │   ├── StreakCounter.jsx     # Daily streak counter with flame
│   │   │   ├── XPProgress.jsx        # Level progression & XP bar
│   │   │   ├── DailyGoal.jsx         # Daily quota ring
│   │   │   ├── WeeklyChart.jsx       # 7-day visual activity bar chart
│   │   │   └── LessonCard.jsx        # Lesson selection card
│   │   ├── lesson/
│   │   │   ├── FlashCard.jsx         # 3D flippable card with pronunciation
│   │   │   ├── MultipleChoice.jsx    # Interactive quiz with feedback
│   │   │   ├── FillBlank.jsx         # Sentence cloze test with hint
│   │   │   ├── MatchPairs.jsx        # Drag/tap vocabulary pair matching
│   │   │   └── ExerciseRenderer.jsx  # Polymorphic exercise dispatcher
│   │   └── writing/
│   │       └── WritingCanvas.jsx     # Tablet stylus & touch handwriting canvas
│   ├── context/
│   │   ├── UserContext.jsx           # Global user profile, progress & XP
│   │   └── AppProvider.jsx           # Master context provider
│   ├── data/
│   │   ├── languages.js              # Supported languages metadata
│   │   ├── categories.js             # Lesson category hierarchy
│   │   ├── writingPrompts.js         # Handwriting prompts (Hiragana, Kanji, Umlauts)
│   │   └── lessons/
│   │       ├── spanish.js            # Spanish curriculum & exercises
│   │       ├── japanese.js           # Japanese curriculum & exercises
│   │       ├── french.js             # French curriculum & exercises
│   │       ├── german.js             # German curriculum & exercises
│   │       └── index.js              # Aggregated curriculum registry
│   ├── hooks/
│   │   ├── useLocalStorage.js        # Safe browser storage sync
│   │   ├── useProgress.js            # Lesson & word mastery tracking
│   │   ├── useStreak.js              # Consecutive day streak calculator
│   │   ├── useXP.js                  # Level progression (Seedling → Forest)
│   │   └── useSpeech.js              # Native Web Speech API audio synthesis
│   ├── pages/
│   │   ├── Landing.jsx               # High-converting landing page
│   │   ├── Onboarding.jsx            # 5-step personalized setup flow
│   │   ├── Dashboard.jsx             # Daily command center
│   │   ├── Lessons.jsx               # Category curriculum browser
│   │   ├── LessonPlayer.jsx          # Interactive exercise runner
│   │   ├── Practice.jsx              # Spaced repetition vocabulary trainer
│   │   ├── WritingPractice.jsx       # Tablet-optimized handwriting & calligraphy lab
│   │   ├── Profile.jsx               # Settings, stats & badges
│   │   └── NotFound.jsx              # 404 handler
│   ├── styles/
│   │   └── index.css                 # Tailwind directives + design tokens
│   ├── utils/
│   │   ├── storage.js                # Type-safe localStorage wrapper
│   │   ├── xp.js                     # XP equations & leveling tables
│   │   └── spacedRepetition.js       # SuperMemo SM-2 memory retention algo
│   ├── App.jsx                       # Root application component
│   ├── Router.jsx                    # Route guards & page definitions
│   └── main.jsx                      # Vite DOM entrypoint
├── package.json
├── tailwind.config.js                # Bespoke color & typography palette
└── vite.config.js
```

---

## 5. How the Features Work Under the Hood

### 1. Spaced Repetition (SM-2 Algorithm)
Located in `src/utils/spacedRepetition.js`:
- Words are tracked with an **Ease Factor** (default `2.5`), **Repetitions** count, and **Interval** (days).
- When a user rates a word (Quality 0 to 5):
  - Failed (0–2): Interval resets to 1 day.
  - Good (3–4): Interval multiplies by the ease factor.
  - Easy (5): Interval expands and ease factor increases.
- Words due for review are automatically surfaced on the **Practice** tab.

### 2. Audio Pronunciation
Located in `src/hooks/useSpeech.js`:
- Uses the browser's native **Web Speech API (`window.speechSynthesis`)**.
- Automatically selects the correct voice accent based on language code (`es-ES`, `ja-JP`, `fr-FR`, `de-DE`).
- Requires zero external API keys or subscription fees.

### 3. Gamification Engine
- **XP calculation** (`src/utils/xp.js`): Base XP per correct answer + daily streak multiplier + lesson completion bonus.
- **Tiers**:
  - 🌱 **Seedling** (0–100 XP)
  - 🌿 **Sprout** (100–500 XP)
  - 🌳 **Sapling** (500–1,500 XP)
  - 🏔️ **Tree** (1,500–5,000 XP)
  - 🌲 **Forest** (5,000+ XP)
- **Streaks** (`src/hooks/useStreak.js`): Automatically checks yesterday's date vs today's date to increment or gracefully reset streaks.

### 4. Tablet & Stylus Handwriting Lab
Located in `src/components/writing/WritingCanvas.jsx` and `src/pages/WritingPractice.jsx`:
- **Hardware Stylus Support**: Reads PointerEvent `e.pressure` (Apple Pencil, Samsung S-Pen, Surface Pen) to modulate line thickness naturally.
- **HiDPI Retina Rendering**: Automatically scales internal canvas buffer by `window.devicePixelRatio` for razor-sharp strokes.
- **Curved Quadratic Smoothing**: Interpolates between coordinates to avoid jagged lines.
- **Dual Guideline Grid**: Rice Grid (田字格 4-quadrant dashed crosshair) for Asian Kanji/Hiragana, and 3-line Notebook grid for European alphabets.
- **Ghost Tracing Watermark**: Faint outline of characters for tracing, with one-tap toggle for blind muscle-memory practice.
- **Touch Ergonomics**: Global `touch-action: manipulation` and canvas `touch-action: none` prevents accidental page scrolling or double-tap zoom while drawing.

### 5. Official Proficiency Frameworks (JLPT & CEFR)
Curriculums are rigorously graded across 3 tiers (40 lessons total):
- **🇯🇵 Japanese (JLPT)**:
  - **N5 Foundation (Beginner)**: Hiragana, Katakana, basic Kanji (一, 二, 三, 日, 月), daily welcomes, polite courtesy, numbers 1-10, and restaurant dining.
  - **N4 Elementary**: Shinkansen bullet trains, station directions, asking way around Tokyo, hotel check-in, family members (家族), and friends.
  - **N3 Intermediate**: Workplace communication (会議, 締切, 同僚, お疲れ様です) and expressing thoughts, opinions, and subtle nuances (〜と思います, 確かに, 例えば, 実は).
- **🇪🇸 Spanish, 🇩🇪 German & 🇫🇷 French (CEFR)**:
  - **A1 Breakthrough (Beginner)**: Foundational greetings, etiquette, counting, café dining, ordering bread, coffee, and water.
  - **A2 Waystage (Elementary)**: Travel (airports, railway stations, booking tickets, hotels), street directions (left, right, straight ahead), and describing family members.
  - **B1 Threshold (Intermediate)**: Professional life (office meetings, colleagues, deadlines, job interviews) and expressing nuanced viewpoints (in my opinion, agreeing/disagreeing, balanced arguments).

---

## 6. How to Add a New Language or Lesson

Adding new content takes just two simple steps:

### 1. Register the language
Open `src/data/languages.js` and add your language object:
```javascript
{
  id: 'de',
  name: 'German',
  nativeName: 'Deutsch',
  flag: '🇩🇪',
  description: 'Language of thinkers and engineers.',
  code: 'de-DE'
}
```

### 2. Create the lesson file
Create `src/data/lessons/german.js` and export your lessons:
```javascript
export const germanLessons = [
  {
    id: 'de-basics-1',
    categoryId: 'basics',
    languageId: 'de',
    title: 'Guten Tag & Basics',
    description: 'Learn everyday German greetings',
    order: 1,
    xpReward: 50,
    vocabulary: [
      { id: 'de-w-001', word: 'Hallo', translation: 'Hello', pronunciation: 'HAH-loh' }
    ],
    exercises: [
      {
        id: 'de-ex-101',
        type: 'multipleChoice',
        question: 'What does "Hallo" mean?',
        options: ['Hello', 'Goodbye', 'Please', 'Water'],
        correctIndex: 0
      }
    ]
  }
];
```
Export it in `src/data/lessons/index.js`, and the entire app (Dashboard, Lessons, Player, Practice, Speech) will automatically support it!

---

## 7. Production Build & Deployment

Because LinguaFlow is a client-side Single Page Application, it can be hosted for **free** on any static hosting provider:

### Option A: Vercel (Recommended)
1. Push your repository to GitHub.
2. Sign in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Framework Preset: **Vite**.
5. Click **Deploy**!

### Option B: Netlify
1. Run `npm run build`.
2. Drag and drop the `dist/` folder into [Netlify Drop](https://app.netlify.com/drop).
3. Your site is live immediately with SSL.

---

*Built with ❤️ for passionate language learners.*

