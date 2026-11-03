# LinguaFlow — Technical Architecture Document

> **Version**: 1.0  
> **Last Updated**: November 2026  
> **Status**: Approved for MVP Development  
> **Author**: LinguaFlow Engineering Team

---

## 1. Architecture Overview

LinguaFlow is a **client-side Single Page Application (SPA)** built with React and Vite. All data is persisted in the browser's `localStorage`. There is no backend server, API, or database in the MVP — the entire application runs in the user's browser.

```
┌──────────────────────────────────────────────────────────────────┐
│                         User's Browser                           │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                    React Application                       │  │
│  │                                                            │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────┐ │  │
│  │  │  Pages   │  │Components│  │  Hooks   │  │  Context  │ │  │
│  │  │          │  │          │  │          │  │           │ │  │
│  │  │ Landing  │  │ UI       │  │ useXP    │  │ UserCtx   │ │  │
│  │  │ Onboard  │  │ Layout   │  │ useStreak│  │ AppProv   │ │  │
│  │  │ Dashboard│  │ Lesson   │  │ useLocal │  │           │ │  │
│  │  │ Lessons  │  │ Dashboard│  │ useSpRep │  │           │ │  │
│  │  │ Player   │  │          │  │          │  │           │ │  │
│  │  │ Practice │  │          │  │          │  │           │ │  │
│  │  │ Profile  │  │          │  │          │  │           │ │  │
│  │  └────┬─────┘  └──────────┘  └─────┬────┘  └─────┬─────┘ │  │
│  │       │                            │              │        │  │
│  │  ┌────▼────────────────────────────▼──────────────▼─────┐ │  │
│  │  │                   Data Layer                          │ │  │
│  │  │  ┌────────────┐  ┌───────────┐  ┌──────────────────┐ │ │  │
│  │  │  │ Static Data│  │  Utils    │  │   localStorage   │ │ │  │
│  │  │  │ (lessons,  │  │ (xp calc, │  │   (persistence)  │ │ │  │
│  │  │  │  languages)│  │  sr algo) │  │                  │ │ │  │
│  │  │  └────────────┘  └───────────┘  └──────────────────┘ │ │  │
│  │  └──────────────────────────────────────────────────────┘ │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Vite Dev Server (development) / Static Files (production) │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 2. Tech Stack

| Technology           | Version | Purpose                                          | Rationale                                                       |
|----------------------|---------|--------------------------------------------------|-----------------------------------------------------------------|
| **React**            | 18.x    | UI component library                             | Industry standard, large ecosystem, excellent DevEx             |
| **Vite**             | 6.x     | Build tool & dev server                          | Blazing fast HMR, native ES modules, small bundle output        |
| **React Router**     | v6      | Client-side routing                              | Standard React routing, nested routes, loaders                  |
| **Tailwind CSS**     | v3      | Utility-first CSS framework                      | Rapid styling, design token integration, small production CSS   |
| **Framer Motion**    | 11.x    | Animation library                                | Spring physics, layout animations, gesture support              |
| **Lucide React**     | latest  | Icon library                                     | Consistent, tree-shakeable, 1000+ icons                         |
| **localStorage**     | (native)| Client-side persistence                          | Zero setup, synchronous, sufficient for MVP data volume         |

### 2.1 Development Dependencies

| Tool                 | Purpose                                          |
|----------------------|--------------------------------------------------|
| **ESLint**           | Code linting with React rules                    |
| **Prettier**         | Code formatting                                  |
| **PostCSS**          | CSS processing (Tailwind requires it)            |
| **Autoprefixer**     | Vendor prefix automation                         |

### 2.2 Why These Choices?

**Why Vite over CRA or Next.js?**
- CRA is deprecated; Vite is the recommended replacement
- Next.js brings SSR/SSG complexity we don't need (no backend, no SEO-critical content)
- Vite's HMR is near-instant, improving developer velocity

**Why Tailwind over CSS Modules or styled-components?**
- Design tokens map directly to Tailwind config (colors, spacing, typography)
- Utility classes reduce context-switching between files
- Production CSS is purged to only used utilities — typically < 10KB
- Consistent spacing/sizing without inventing class names

**Why localStorage over IndexedDB?**
- Simpler API for the data volume we're handling (< 1MB of user progress)
- Synchronous reads simplify React rendering (no async loading states for user data)
- IndexedDB complexity is not justified until we handle binary data or large datasets

---

## 3. Project Structure

```
src/
├── components/
│   ├── ui/                     # Reusable, generic UI primitives
│   │   ├── Button.jsx          # Button with variants, sizes, states
│   │   ├── Card.jsx            # Base card with elevation variants
│   │   ├── ProgressBar.jsx     # Linear progress with gradient fill
│   │   ├── CircularProgress.jsx# Circular SVG progress indicator
│   │   ├── Badge.jsx           # Pill badges with color variants
│   │   ├── Modal.jsx           # Dialog with backdrop, animations
│   │   ├── Input.jsx           # Text input with label, validation
│   │   └── index.js            # Barrel export
│   │
│   ├── layout/                 # Structural layout components
│   │   ├── Navbar.jsx          # Top navigation bar
│   │   ├── Sidebar.jsx         # Desktop side navigation
│   │   ├── MobileNav.jsx       # Bottom tab bar for mobile
│   │   ├── PageWrapper.jsx     # Consistent page padding/max-width
│   │   └── index.js
│   │
│   ├── lesson/                 # Lesson-specific exercise components
│   │   ├── FlashCard.jsx       # 3D flip flashcard
│   │   ├── MultipleChoice.jsx  # 4-option quiz with feedback
│   │   ├── FillBlank.jsx       # Sentence completion from word bank
│   │   ├── MatchPairs.jsx      # Drag/tap matching exercise
│   │   ├── TypingExercise.jsx  # Free-text translation input
│   │   ├── VocabIntro.jsx      # New word presentation
│   │   ├── ExerciseRenderer.jsx# Routes exercise type → component
│   │   ├── LessonProgress.jsx  # Top progress bar + lives + XP
│   │   ├── LessonSummary.jsx   # End-of-lesson results screen
│   │   └── index.js
│   │
│   └── dashboard/              # Dashboard-specific widgets
│       ├── StreakCounter.jsx    # Flame icon + streak number
│       ├── XPProgress.jsx      # XP bar or ring with level info
│       ├── DailyGoal.jsx       # Circular progress for daily target
│       ├── WeeklyChart.jsx     # 7-day activity bar chart
│       ├── LessonCard.jsx      # Recommended/continue lesson card
│       ├── QuickStats.jsx      # Words learned, lessons, total XP
│       └── index.js
│
├── pages/                      # Route-level page components
│   ├── Landing.jsx             # Public landing/marketing page
│   ├── Onboarding.jsx          # Multi-step onboarding wizard
│   ├── Dashboard.jsx           # Main dashboard view
│   ├── Lessons.jsx             # Category browser grid
│   ├── CategoryDetail.jsx      # Lessons within a category
│   ├── LessonPlayer.jsx        # Active lesson experience
│   ├── Practice.jsx            # Spaced repetition review mode
│   ├── Profile.jsx             # User stats, achievements, settings
│   └── NotFound.jsx            # 404 page
│
├── data/                       # Static content data (no API)
│   ├── languages.js            # Available languages metadata
│   ├── categories.js           # Lesson categories per language
│   ├── achievements.js         # Achievement definitions
│   ├── levels.js               # XP level thresholds and metadata
│   └── lessons/
│       ├── spanish/
│       │   ├── basics.js       # Vocabulary + exercises for Basics
│       │   ├── greetings.js
│       │   ├── food.js
│       │   └── ...             # One file per category
│       ├── japanese/
│       │   ├── basics.js
│       │   └── ...
│       └── french/
│           ├── basics.js
│           └── ...
│
├── hooks/                      # Custom React hooks
│   ├── useProgress.js          # Lesson/category completion tracking
│   ├── useStreak.js            # Daily streak calculation
│   ├── useXP.js                # XP accumulation and level logic
│   ├── useLocalStorage.js      # Generic localStorage state hook
│   ├── useSpacedRepetition.js  # SM-2 algorithm for word review
│   └── useDailyGoal.js         # Daily practice time tracking
│
├── context/                    # React Context providers
│   ├── UserContext.jsx         # Global user state (profile, prefs)
│   └── AppProvider.jsx         # Wraps app with all providers
│
├── utils/                      # Pure utility functions
│   ├── xp.js                   # XP calculations, level thresholds
│   ├── storage.js              # localStorage helpers (get/set/clear)
│   ├── spacedRepetition.js     # SM-2 algorithm implementation
│   ├── streak.js               # Streak calculation logic
│   ├── date.js                 # Date formatting and comparison
│   └── constants.js            # App-wide constants
│
├── styles/
│   └── index.css               # Tailwind directives + global styles
│
├── App.jsx                     # Root component (providers + router)
├── Router.jsx                  # Route definitions
└── main.jsx                    # Entry point (ReactDOM.createRoot)
```

### 3.1 Directory Conventions

| Convention                | Rule                                                              |
|---------------------------|-------------------------------------------------------------------|
| **File naming**           | PascalCase for components (`.jsx`), camelCase for utilities (`.js`) |
| **Barrel exports**        | Each component directory has `index.js` for clean imports         |
| **Co-location**           | Tests sit next to components: `Button.test.jsx`                   |
| **One component per file**| No multi-component files except small internal sub-components     |

---

## 4. Routing Plan

### 4.1 Route Definitions

```jsx
// Router.jsx
import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/onboarding',
    element: <Onboarding />,
  },
  {
    element: <AppLayout />,       // Shared layout with nav
    children: [
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      {
        path: '/lessons',
        element: <Lessons />,
      },
      {
        path: '/lessons/:categoryId',
        element: <CategoryDetail />,
      },
      {
        path: '/practice',
        element: <Practice />,
      },
      {
        path: '/profile',
        element: <Profile />,
      },
    ],
  },
  {
    path: '/learn/:lessonId',
    element: <LessonPlayer />,    // Full-screen, no nav
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
```

### 4.2 Route Map

| Path                    | Page             | Layout    | Auth Guard         | Description                   |
|-------------------------|------------------|-----------|--------------------|-------------------------------|
| `/`                     | Landing          | None      | Redirect if onboarded | Marketing / welcome page   |
| `/onboarding`           | Onboarding       | None      | Redirect if onboarded | 5-step wizard              |
| `/dashboard`            | Dashboard        | AppLayout | Require onboarding    | Home / progress overview    |
| `/lessons`              | Lessons          | AppLayout | Require onboarding    | Category grid browser       |
| `/lessons/:categoryId`  | CategoryDetail   | AppLayout | Require onboarding    | Lessons in a category       |
| `/learn/:lessonId`      | LessonPlayer     | None (full-screen) | Require onboarding | Active lesson experience |
| `/practice`             | Practice         | AppLayout | Require onboarding    | Spaced repetition review    |
| `/profile`              | Profile          | AppLayout | Require onboarding    | Stats, achievements, settings|
| `*`                     | NotFound         | None      | None                  | 404 page                    |

### 4.3 Navigation Guards

```jsx
// hooks/useRequireOnboarding.js
function useRequireOnboarding() {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user.onboardingComplete) {
      navigate('/onboarding', { replace: true });
    }
  }, [user.onboardingComplete, navigate]);

  return user.onboardingComplete;
}
```

The guard checks `localStorage` for a completed onboarding flag. If absent, the user is redirected to `/onboarding`. Conversely, if onboarding is complete, visiting `/` or `/onboarding` redirects to `/dashboard`.

---

## 5. State Management

### 5.1 Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    React Context (Global)                  │
│                                                           │
│  UserContext: {                                           │
│    selectedLanguage: 'spanish',                           │
│    motivation: 'travel',                                  │
│    proficiencyLevel: 'beginner',                          │
│    dailyGoal: 10,          // minutes                     │
│    xp: 450,                                               │
│    streak: 7,                                             │
│    bestStreak: 12,                                        │
│    lastActiveDate: '2026-11-02',                          │
│    completedLessons: ['es-basics-1', 'es-basics-2'],      │
│    wordProgress: { ... },  // SM-2 data per word          │
│    achievements: ['first-steps', 'week-warrior'],         │
│    onboardingComplete: true,                              │
│    todayMinutes: 6,                                       │
│  }                                                        │
│                                                           │
│  Actions: updateXP(), completeLesson(), updateStreak(),   │
│           updateWordProgress(), unlockAchievement(),      │
│           resetProgress(), changeLanguage()               │
└───────────────────────────┬───────────────────────────────┘
                            │
                     Persists via
                            │
                ┌───────────▼────────────┐
                │     localStorage       │
                │                        │
                │  Key: 'linguaflow_user'│
                │  Value: JSON string    │
                └────────────────────────┘
```

### 5.2 Context Implementation

```jsx
// context/UserContext.jsx
const DEFAULT_USER = {
  selectedLanguage: null,
  motivation: null,
  proficiencyLevel: null,
  dailyGoal: 10,
  xp: 0,
  streak: 0,
  bestStreak: 0,
  lastActiveDate: null,
  completedLessons: [],
  wordProgress: {},
  achievements: [],
  onboardingComplete: false,
  todayMinutes: 0,
};

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useLocalStorage('linguaflow_user', DEFAULT_USER);

  const updateXP = useCallback((amount) => {
    setUser(prev => {
      const newXP = prev.xp + amount;
      return { ...prev, xp: newXP };
    });
  }, [setUser]);

  const completeLesson = useCallback((lessonId, xpEarned) => {
    setUser(prev => ({
      ...prev,
      completedLessons: [...new Set([...prev.completedLessons, lessonId])],
      xp: prev.xp + xpEarned,
    }));
  }, [setUser]);

  // ... additional actions

  const value = useMemo(
    () => ({ user, updateXP, completeLesson, /* ... */ }),
    [user, updateXP, completeLesson]
  );

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}
```

### 5.3 State Categories

| Category           | Scope              | Storage             | Example                            |
|--------------------|--------------------|----------------------|------------------------------------|
| **User Profile**   | Global (Context)   | localStorage         | Language, motivation, daily goal   |
| **Progress Data**  | Global (Context)   | localStorage         | Completed lessons, XP, streak     |
| **Word Progress**  | Global (Context)   | localStorage         | SM-2 data per word                 |
| **UI State**       | Component-local    | React `useState`     | Modal open, selected tab, hover   |
| **Lesson State**   | Component-local    | React `useState`     | Current exercise, lives, score    |
| **Form State**     | Component-local    | React `useState`     | Input values, validation errors   |

---

## 6. Data Architecture

### 6.1 Languages

```javascript
// data/languages.js
export const languages = [
  {
    id: 'spanish',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    description: 'Spoken by 500M+ people worldwide',
    available: true,
  },
  {
    id: 'japanese',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    description: 'The language of innovation and culture',
    available: true,
  },
  {
    id: 'french',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    description: 'The language of diplomacy and art',
    available: true,
  },
];
```

### 6.2 Categories

```javascript
// data/categories.js
export const categories = [
  {
    id: 'basics',
    name: 'Basics',
    icon: '📚',
    description: 'Alphabet, pronunciation, essentials',
    order: 1,
    prerequisite: null,           // First category, always unlocked
    lessonCount: 5,
  },
  {
    id: 'greetings',
    name: 'Greetings',
    icon: '👋',
    description: 'Hello, goodbye, introductions',
    order: 2,
    prerequisite: 'basics',       // Unlocks at 60% of Basics
    lessonCount: 5,
  },
  // ... remaining categories
];
```

### 6.3 Lessons & Vocabulary

```javascript
// data/lessons/spanish/basics.js
export const basics = {
  categoryId: 'basics',
  languageId: 'spanish',
  lessons: [
    {
      id: 'es-basics-1',
      title: 'Your First Words',
      description: 'Learn essential greetings and introductions',
      order: 1,
      xpReward: 50,
      vocabulary: [
        {
          id: 'es-hola',
          word: 'Hola',
          translation: 'Hello',
          romanization: null,       // Only for non-Latin scripts
          example: '¡Hola! ¿Cómo estás?',
          exampleTranslation: 'Hello! How are you?',
          partOfSpeech: 'interjection',
          difficulty: 1,
        },
        {
          id: 'es-gracias',
          word: 'Gracias',
          translation: 'Thank you',
          romanization: null,
          example: 'Muchas gracias por tu ayuda.',
          exampleTranslation: 'Thank you very much for your help.',
          partOfSpeech: 'noun',
          difficulty: 1,
        },
        // ... more vocabulary items
      ],
      exercises: [
        {
          type: 'vocab-intro',
          wordIds: ['es-hola', 'es-gracias', 'es-adios'],
        },
        {
          type: 'flashcard',
          wordIds: ['es-hola', 'es-gracias', 'es-adios'],
        },
        {
          type: 'multiple-choice',
          question: 'What does "Hola" mean?',
          options: ['Hello', 'Goodbye', 'Thank you', 'Please'],
          correctIndex: 0,
          wordId: 'es-hola',
        },
        {
          type: 'fill-blank',
          sentence: '¡___! ¿Cómo estás?',
          answer: 'Hola',
          wordBank: ['Hola', 'Adiós', 'Gracias', 'Por favor'],
          wordId: 'es-hola',
        },
        {
          type: 'match-pairs',
          pairs: [
            { left: 'Hola', right: 'Hello' },
            { left: 'Adiós', right: 'Goodbye' },
            { left: 'Gracias', right: 'Thank you' },
            { left: 'Por favor', right: 'Please' },
          ],
        },
        {
          type: 'typing',
          prompt: 'Type the Spanish word for "Hello"',
          answer: 'Hola',
          acceptAlternatives: ['hola'],  // Case-insensitive alternatives
          wordId: 'es-hola',
        },
      ],
    },
    // ... more lessons
  ],
};
```

### 6.4 User Progress (localStorage Schema)

```javascript
// Stored in localStorage under key 'linguaflow_user'
{
  // Onboarding
  selectedLanguage: 'spanish',
  motivation: 'travel',
  proficiencyLevel: 'beginner',
  dailyGoal: 10,
  onboardingComplete: true,

  // Progress
  xp: 1250,
  streak: 7,
  bestStreak: 12,
  lastActiveDate: '2026-11-03',
  todayMinutes: 8,
  completedLessons: ['es-basics-1', 'es-basics-2', 'es-greetings-1'],

  // Word-level progress (SM-2 algorithm data)
  wordProgress: {
    'es-hola': {
      easeFactor: 2.6,        // SM-2 ease factor (default 2.5)
      interval: 6,            // Days until next review
      repetitions: 3,         // Successful consecutive reviews
      nextReviewDate: '2026-11-09',
      lastReviewDate: '2026-11-03',
      correctCount: 5,
      incorrectCount: 1,
    },
    'es-gracias': {
      easeFactor: 2.1,
      interval: 1,
      repetitions: 1,
      nextReviewDate: '2026-11-04',
      lastReviewDate: '2026-11-03',
      correctCount: 2,
      incorrectCount: 2,
    },
    // ... one entry per learned word
  },

  // Achievements
  achievements: [
    { id: 'first-steps', unlockedAt: '2026-10-28' },
    { id: 'week-warrior', unlockedAt: '2026-11-03' },
  ],
}
```

### 6.5 Data Volume Estimates

| Data                     | Estimated Size   | Growth Rate              |
|--------------------------|------------------|--------------------------|
| User profile + settings  | ~200 bytes       | Static                   |
| Completed lessons (50)   | ~2 KB            | Grows slowly             |
| Word progress (500 words)| ~50 KB           | Main growth driver       |
| Achievements (10)        | ~500 bytes       | Grows slowly             |
| **Total (heavy user)**   | **~60 KB**       | Well within 5MB limit    |

> [!NOTE]
> `localStorage` has a ~5MB limit per origin in most browsers. Even a power user learning all three languages would use < 200KB, leaving ample headroom.

---

## 7. Key Algorithms

### 7.1 Spaced Repetition (SM-2 Simplified)

The SM-2 algorithm determines when each word should next be reviewed, based on the user's recall quality.

#### Algorithm

```javascript
// utils/spacedRepetition.js

/**
 * Calculate next review interval using SM-2 algorithm.
 *
 * @param {number} quality - User recall quality (0-5)
 *   0: Complete blackout
 *   1: Incorrect, but recognized after reveal
 *   2: Incorrect, but answer felt familiar
 *   3: Correct with significant difficulty
 *   4: Correct with minor hesitation
 *   5: Perfect, instant recall
 *
 * @param {Object} current - Current word progress
 * @returns {Object} Updated word progress
 */
export function calculateNextReview(quality, current) {
  let { easeFactor, interval, repetitions } = current;

  if (quality >= 3) {
    // Correct response
    if (repetitions === 0) {
      interval = 1;                    // First review: 1 day
    } else if (repetitions === 1) {
      interval = 6;                    // Second review: 6 days
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  } else {
    // Incorrect response — reset
    repetitions = 0;
    interval = 1;
  }

  // Update ease factor (minimum 1.3)
  easeFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  const nextReviewDate = addDays(new Date(), interval);

  return {
    easeFactor,
    interval,
    repetitions,
    nextReviewDate: formatDate(nextReviewDate),
    lastReviewDate: formatDate(new Date()),
  };
}

/**
 * Get words that are due for review today.
 */
export function getWordsForReview(wordProgress) {
  const today = formatDate(new Date());
  return Object.entries(wordProgress)
    .filter(([_, progress]) => progress.nextReviewDate <= today)
    .sort((a, b) => a[1].easeFactor - b[1].easeFactor)  // Hardest first
    .map(([wordId]) => wordId);
}
```

#### Quality Mapping from App Interactions

| Exercise Result            | SM-2 Quality |
|----------------------------|-------------|
| Wrong answer (all types)   | 1           |
| Correct but used hint      | 3           |
| Correct (normal)           | 4           |
| Correct (instant / < 3s)   | 5           |

### 7.2 XP Calculation

```javascript
// utils/xp.js

export const XP_REWARDS = {
  FLASHCARD_CORRECT: 5,
  QUIZ_CORRECT: 10,
  FILL_BLANK_CORRECT: 10,
  MATCH_PAIR_COMPLETE: 15,
  TYPING_CORRECT: 15,
  STREAK_BONUS: 5,          // Per correct answer when streak > 0
  LESSON_COMPLETE: 50,
  PERFECT_LESSON: 25,       // Bonus for 0 mistakes
  TIMED_CHALLENGE: 30,
};

export const LEVELS = [
  { name: 'Seedling', icon: '🌱', minXP: 0,    maxXP: 99 },
  { name: 'Sprout',   icon: '🌿', minXP: 100,  maxXP: 499 },
  { name: 'Sapling',  icon: '🌳', minXP: 500,  maxXP: 1499 },
  { name: 'Tree',     icon: '🌲', minXP: 1500, maxXP: 4999 },
  { name: 'Forest',   icon: '🌲', minXP: 5000, maxXP: Infinity },
];

/**
 * Get the user's current level based on total XP.
 */
export function getCurrentLevel(xp) {
  return LEVELS.find(level => xp >= level.minXP && xp <= level.maxXP);
}

/**
 * Get progress percentage toward next level.
 */
export function getLevelProgress(xp) {
  const current = getCurrentLevel(xp);
  const currentIndex = LEVELS.indexOf(current);

  if (currentIndex === LEVELS.length - 1) return 100; // Max level

  const next = LEVELS[currentIndex + 1];
  const progressInLevel = xp - current.minXP;
  const levelRange = next.minXP - current.minXP;

  return Math.round((progressInLevel / levelRange) * 100);
}

/**
 * Calculate total XP earned in a lesson.
 */
export function calculateLessonXP(results, hasStreak) {
  let total = 0;

  results.forEach(result => {
    if (result.correct) {
      total += XP_REWARDS[result.type] || 10;
      if (hasStreak) total += XP_REWARDS.STREAK_BONUS;
    }
  });

  total += XP_REWARDS.LESSON_COMPLETE;

  const allCorrect = results.every(r => r.correct);
  if (allCorrect) total += XP_REWARDS.PERFECT_LESSON;

  return total;
}
```

### 7.3 Streak Logic

```javascript
// utils/streak.js

/**
 * Update streak based on current date vs last active date.
 *
 * @returns {Object} { streak, bestStreak, lastActiveDate }
 */
export function updateStreak(currentStreak, bestStreak, lastActiveDate) {
  const today = formatDate(new Date());

  if (lastActiveDate === today) {
    // Already active today — no change
    return { streak: currentStreak, bestStreak, lastActiveDate };
  }

  const yesterday = formatDate(addDays(new Date(), -1));

  if (lastActiveDate === yesterday) {
    // Consecutive day — increment streak
    const newStreak = currentStreak + 1;
    return {
      streak: newStreak,
      bestStreak: Math.max(bestStreak, newStreak),
      lastActiveDate: today,
    };
  }

  // Gap of more than 1 day — reset streak
  return {
    streak: 1,                   // Today counts as day 1
    bestStreak,                  // Best streak preserved
    lastActiveDate: today,
  };
}
```

---

## 8. Component Architecture

### 8.1 ExerciseRenderer Pattern

The `ExerciseRenderer` component acts as a **strategy pattern** router, delegating to the correct exercise component based on the exercise type.

```jsx
// components/lesson/ExerciseRenderer.jsx

const EXERCISE_COMPONENTS = {
  'vocab-intro':      VocabIntro,
  'flashcard':        FlashCard,
  'multiple-choice':  MultipleChoice,
  'fill-blank':       FillBlank,
  'match-pairs':      MatchPairs,
  'typing':           TypingExercise,
};

export function ExerciseRenderer({ exercise, onComplete, onCorrect, onIncorrect }) {
  const Component = EXERCISE_COMPONENTS[exercise.type];

  if (!Component) {
    console.warn(`Unknown exercise type: ${exercise.type}`);
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={exercise.id || exercise.type}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <Component
          {...exercise}
          onComplete={onComplete}
          onCorrect={onCorrect}
          onIncorrect={onIncorrect}
        />
      </motion.div>
    </AnimatePresence>
  );
}
```

### 8.2 LessonPlayer State Machine

The lesson player follows a state machine pattern to manage the complex flow:

```
                  ┌─────────────┐
                  │   LOADING   │
                  └──────┬──────┘
                         │ lesson data loaded
                         ▼
                  ┌─────────────┐
            ┌─────│  EXERCISING  │◄────────────┐
            │     └──────┬──────┘              │
            │            │ answer submitted     │
            │            ▼                      │
            │     ┌─────────────┐              │
            │     │  FEEDBACK   │──── next ────┘
            │     └──────┬──────┘
            │            │ last exercise
            │            ▼
            │     ┌─────────────┐
            │     │  COMPLETE   │
            │     └─────────────┘
            │
            │ lives === 0
            ▼
     ┌─────────────┐
     │   FAILED    │
     └─────────────┘
```

```jsx
// pages/LessonPlayer.jsx — state management
const [state, setState] = useState('loading');    // loading | exercising | feedback | complete | failed
const [exerciseIndex, setExerciseIndex] = useState(0);
const [lives, setLives] = useState(3);
const [xpEarned, setXPEarned] = useState(0);
const [results, setResults] = useState([]);       // { type, correct, wordId }[]
```

---

## 9. Custom Hooks API

### 9.1 useLocalStorage

```javascript
// hooks/useLocalStorage.js
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    setStoredValue(prev => {
      const nextValue = typeof value === 'function' ? value(prev) : value;
      try {
        window.localStorage.setItem(key, JSON.stringify(nextValue));
      } catch (error) {
        console.warn(`Error writing localStorage key "${key}":`, error);
      }
      return nextValue;
    });
  }, [key]);

  return [storedValue, setValue];
}
```

### 9.2 useXP

```javascript
// hooks/useXP.js
export function useXP() {
  const { user, updateXP } = useUser();

  const currentLevel = getCurrentLevel(user.xp);
  const levelProgress = getLevelProgress(user.xp);
  const nextLevel = getNextLevel(user.xp);

  const addXP = useCallback((amount) => {
    const prevLevel = getCurrentLevel(user.xp);
    updateXP(amount);
    const newLevel = getCurrentLevel(user.xp + amount);

    if (newLevel.name !== prevLevel.name) {
      return { leveledUp: true, newLevel };
    }
    return { leveledUp: false };
  }, [user.xp, updateXP]);

  return { xp: user.xp, currentLevel, levelProgress, nextLevel, addXP };
}
```

### 9.3 useStreak

```javascript
// hooks/useStreak.js
export function useStreak() {
  const { user, setUser } = useUser();

  const checkAndUpdateStreak = useCallback(() => {
    const result = updateStreak(user.streak, user.bestStreak, user.lastActiveDate);
    setUser(prev => ({ ...prev, ...result }));
    return result;
  }, [user, setUser]);

  return {
    streak: user.streak,
    bestStreak: user.bestStreak,
    isActiveToday: user.lastActiveDate === formatDate(new Date()),
    checkAndUpdateStreak,
  };
}
```

---

## 10. Performance Considerations

### 10.1 Bundle Size Strategy

| Strategy                  | Implementation                                            |
|---------------------------|-----------------------------------------------------------|
| **Tree shaking**          | ES module imports; Lucide icons imported individually      |
| **Code splitting**        | React.lazy + Suspense for route-level page components     |
| **CSS purging**           | Tailwind's JIT mode only includes used utilities          |
| **Image optimization**    | SVG icons only (no raster images in MVP)                  |
| **Font subsetting**       | Google Fonts provides optimized subsets automatically      |

```jsx
// App.jsx — lazy loading
const Dashboard = lazy(() => import('./pages/Dashboard'));
const LessonPlayer = lazy(() => import('./pages/LessonPlayer'));
const Practice = lazy(() => import('./pages/Practice'));
const Profile = lazy(() => import('./pages/Profile'));
```

### 10.2 Target Performance Budgets

| Metric                     | Target                          |
|----------------------------|---------------------------------|
| **First Contentful Paint** | < 1.5s                          |
| **Largest Contentful Paint** | < 2.5s                        |
| **Time to Interactive**    | < 3.0s                          |
| **Total Bundle Size (gzip)** | < 200KB (JS) + < 15KB (CSS)  |
| **Lighthouse Score**       | ≥ 90 (Performance)             |

### 10.3 localStorage Performance

- Reads are synchronous and fast (< 1ms for our data volume)
- Writes are debounced to avoid excessive serialization during rapid interactions (e.g., during a lesson)
- The `useLocalStorage` hook batches updates within React's state update cycle

```javascript
// Debounced localStorage write
const debouncedSave = useMemo(
  () => debounce((key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  }, 300),
  []
);
```

---

## 11. Build & Development

### 11.1 Development Setup

```bash
# Install dependencies
npm install

# Start development server (Vite HMR on localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

### 11.2 Vite Configuration

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@pages': '/src/pages',
      '@hooks': '/src/hooks',
      '@utils': '/src/utils',
      '@data': '/src/data',
      '@context': '/src/context',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
        },
      },
    },
  },
});
```

### 11.3 Deployment

The production build produces static files (`dist/`) that can be deployed to any static hosting provider:

| Provider           | Command / Integration                            |
|--------------------|--------------------------------------------------|
| **Vercel**         | Git push → auto-deploy (zero config for Vite)    |
| **Netlify**        | Git push → auto-deploy, `build: npm run build`   |
| **GitHub Pages**   | `gh-pages` npm package                           |
| **Firebase Hosting** | `firebase deploy`                              |

> [!IMPORTANT]
> Since this is a client-side SPA with React Router, the hosting provider must be configured to serve `index.html` for all routes (SPA fallback / rewrite rule). Without this, direct navigation to `/dashboard` will return a 404.

---

## 12. Testing Strategy

### 12.1 Testing Pyramid

| Layer                | Tool              | Coverage Target | What to Test                           |
|----------------------|-------------------|-----------------|----------------------------------------|
| **Unit Tests**       | Vitest            | 80%+            | Utils (XP, SM-2, streak), pure functions |
| **Component Tests**  | Vitest + React Testing Library | Key flows | Exercise components, feedback states |
| **Integration Tests**| Vitest + RTL      | Critical paths  | Onboarding flow, lesson completion      |
| **E2E Tests**        | Playwright        | Happy paths     | Full user journey: onboard → lesson → dashboard |

### 12.2 Key Test Cases

```javascript
// utils/__tests__/spacedRepetition.test.js
describe('calculateNextReview', () => {
  it('sets interval to 1 day for first correct review');
  it('sets interval to 6 days for second correct review');
  it('multiplies interval by ease factor for subsequent reviews');
  it('resets repetitions to 0 on incorrect answer');
  it('never lets ease factor drop below 1.3');
  it('increases ease factor for quality 5 responses');
});

// utils/__tests__/streak.test.js
describe('updateStreak', () => {
  it('increments streak when last active was yesterday');
  it('resets streak to 1 when gap is more than 1 day');
  it('preserves best streak on reset');
  it('does not change streak when already active today');
});
```

---

## 13. Security Considerations

| Concern                    | Mitigation                                                     |
|----------------------------|----------------------------------------------------------------|
| **localStorage tampering** | Data is client-owned; no server-side validation needed in MVP. Users can only "cheat" themselves. |
| **XSS**                   | React's JSX auto-escapes rendered content. No `dangerouslySetInnerHTML` usage. |
| **Dependency vulnerabilities** | Regular `npm audit` runs; Dependabot enabled on repository. |
| **Content Security Policy**| Configured in hosting headers to prevent script injection.     |

---

## 14. Future Architecture Considerations

When the MVP evolves to include a backend, the following changes are anticipated:

| Current (MVP)            | Future (v2)                                                   |
|--------------------------|---------------------------------------------------------------|
| localStorage persistence | REST API with PostgreSQL backend                              |
| No authentication        | OAuth 2.0 (Google, GitHub) or email/password via Auth0        |
| Static lesson data       | CMS or admin panel for content management                     |
| Client-side analytics    | Server-side event tracking (PostHog, Mixpanel)                |
| No audio                 | Audio pronunciation via Web Audio API + CDN-hosted audio files|
| No speech                | Web Speech API for pronunciation practice                     |

The current architecture is designed with these transitions in mind:
- **Data layer abstraction**: All localStorage access goes through `useLocalStorage` and `storage.js` — swapping to API calls requires changing only these files.
- **Context API**: The `UserContext` interface remains the same whether backed by localStorage or an API.
- **Static data imports**: Lesson data can be migrated to API responses with minimal component changes (they already receive data as props).

---

*This document defines the technical foundation for LinguaFlow's MVP. All implementation decisions should align with this architecture.*
