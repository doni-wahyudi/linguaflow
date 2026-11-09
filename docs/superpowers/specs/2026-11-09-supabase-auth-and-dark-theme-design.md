# Design Specification: Supabase Authentication, Cloud Sync & Dark Theme Contrast Overhaul

**Date**: 2026-11-09  
**Status**: Draft for User Review  
**Branch**: `feat/phase2-oral-production`  
**Authors**: Software Dev Team (Project Manager, Full-stack Engineer, Test Engineer, Code Reviewer)

---

## 1. Executive Summary & Goals

This specification outlines the architecture and implementation for two major enhancements to LinguaFlow:
1. **Supabase Integration & Authentication (Option B)**:
   - Build-time configuration via `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
   - Comprehensive Supabase Auth (Email & Password signup, sign-in, logout, password recovery, session restore).
   - Bi-directional cloud synchronization for User Profile, Lesson Progress, Spaced Repetition (SRS) vocabulary, Streaks, and XP.
   - **Offline-First Guest Mode**: The application remains 100% functional without logging in. When a guest signs up or logs in, their local progress is seamlessly migrated and merged into their Supabase cloud account.
   - Complete SQL setup script (`supabase/schema.sql`) for one-click setup in Supabase SQL Editor with strict Row Level Security (RLS).
2. **Comprehensive Dark Theme Contrast & Visibility Overhaul**:
   - Complete overhaul of `[data-theme='dark']` semantic tokens in `src/styles/index.css`.
   - Fix all low-contrast feedback banners (success, error, warning, info), card borders, form inputs, muted text, and exercise tiles.
   - Guarantee WCAG 2.1 AA (≥ 4.5:1 text, ≥ 3.0:1 UI components) and AAA (≥ 7.0:1) compliance across all dark mode screens.

---

## 2. Supabase Cloud & Authentication Architecture

### 2.1 Environment Configuration
- `.env.example`:
  ```bash
  # Supabase Project Configuration
  # Find these in Supabase Dashboard -> Project Settings -> API
  VITE_SUPABASE_URL=https://your-project-id.supabase.co
  VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```
- If the environment variables are absent, `src/lib/supabaseClient.js` gracefully logs an informational note and runs in standalone offline mode without throwing exceptions.

### 2.2 Database Schema (`supabase/schema.sql`)
The cloud database consists of three core tables linked to `auth.users(id)`:

```sql
-- 1. User Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT DEFAULT '',
  selected_language TEXT DEFAULT 'es',
  daily_goal INTEGER DEFAULT 10,
  motivation TEXT DEFAULT '',
  level TEXT DEFAULT 'beginner',
  theme TEXT DEFAULT 'system',
  sound_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. User Progress (Lessons, Vocabulary SRS, Exam Records)
CREATE TABLE IF NOT EXISTS public.user_progress (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  completed_lessons JSONB DEFAULT '[]'::jsonb NOT NULL,
  word_progress JSONB DEFAULT '{}'::jsonb NOT NULL,
  exam_records JSONB DEFAULT '{}'::jsonb NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. User Gamification & Stats (XP, Streaks, Activity)
CREATE TABLE IF NOT EXISTS public.user_stats (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_xp INTEGER DEFAULT 0 NOT NULL,
  current_streak INTEGER DEFAULT 0 NOT NULL,
  longest_streak INTEGER DEFAULT 0 NOT NULL,
  last_active_date TEXT,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own profile" ON public.profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can manage own progress" ON public.user_progress
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own stats" ON public.user_stats
  FOR ALL USING (auth.uid() = user_id);

-- Auto-provision profile on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'name', 'Learner'));
  
  INSERT INTO public.user_progress (user_id)
  VALUES (new.id);

  INSERT INTO public.user_stats (user_id)
  VALUES (new.id);

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

### 2.3 Authentication Flow & Guest Merge Engine
1. **Unauthenticated (Guest Mode)**:
   - Data writes directly to `localStorage` via existing hooks (`useProgress`, `useStreak`, `useXP`, `UserContext`).
2. **Sign Up / Log In**:
   - `AuthModal.jsx` provides accessible tabs for Sign In, Sign Up, and Forgot Password.
   - Upon successful auth session (`SIGNED_IN` event in `AuthContext`):
     - Fetches existing cloud records from Supabase.
     - **Merge Strategy**:
       - `completedLessons`: Union of unique `lessonId`s (taking the higher score).
       - `wordProgress`: Merge dictionary of learned words (taking the more mature SRS level or latest review).
       - `totalXP`: `Math.max(localXP, cloudXP)`.
       - `streak`: Merges latest active date and takes max longest streak.
     - Writes merged state back to both `localStorage` and Supabase.
3. **Session Persistence**:
   - `supabase.auth.onAuthStateChange()` restores session on reload and updates global `useAuth()` hook.
4. **Sign Out**:
   - Clears auth session, switches user back to guest mode without clearing local educational content.

---

## 3. Dark Theme Contrast & Visibility Overhaul

### 3.1 Problem Analysis
In `src/styles/index.css`, `[data-theme='dark']` previously only adjusted basic surfaces and inks (`--surface-bg`, `--ink-900`), leaving feedback backgrounds and borders unconfigured.

**Key Contrast Failures Identified**:
1. **Feedback Backgrounds**: Light pastel fills (`rgb(254 242 242)` for errors, `rgb(236 253 245)` for success) with white or light text. In dark mode, this rendered unreadable blinding pastel rectangles with invisible text.
2. **Card Surfaces**: Card surface `#292524` with border `#44403C` against dark page `#1C1917` resulted in muddy, indistinguishable boundaries.
3. **Muted Inks**: `--ink-500: 168 162 158` (contrast ratio ~3.2:1 against card surface) failed WCAG AA (4.5:1 minimum).
4. **Form Controls & Interactive Tiles**: Form inputs, audio control pills, and `SentenceBuilder` word tiles had dark text on dark surfaces or inverted borders that vanished.

### 3.2 Semantic Token Redesign for Dark Mode
In `src/styles/index.css`:

```css
[data-theme='dark'] {
  /* Surfaces — Balanced Slate/Zinc Charcoal (OLED friendly, non-fatiguing) */
  --surface-bg: 18 18 20;           /* #121214 deep charcoal */
  --surface-50: 24 24 27;           /* #18181b */
  --surface-100: 32 32 36;          /* #202024 */
  --surface-200: 45 45 52;          /* #2d2d34 */
  --surface-card: 26 26 30;         /* #1a1a1e elevated card */
  --surface-elevated: 36 36 42;     /* #24242a high elevation */

  /* Inks — High Contrast Scale (WCAG 2.1 AAA Compliant) */
  --ink-900: 250 250 250;           /* 16.5:1 ratio on surface-bg */
  --ink-700: 228 228 231;           /* 13.2:1 ratio */
  --ink-500: 212 212 216;           /* 11.4:1 ratio (clears AA & AAA for secondary/captions) */
  --ink-400: 161 161 170;           /* 6.8:1 ratio (clears AA) */
  --ink-300: 113 113 122;           /* 3.8:1 ratio (disabled text / non-text UI) */
  --ink-200: 63 63 70;              /* Card borders (distinct, visible edge) */
  --ink-100: 39 39 42;              /* Subtle dividers */
  --ink-50: 24 24 27;

  /* Brand Emerald Adapted for Dark Mode */
  --brand-50: 6 78 59;
  --brand-100: 6 95 70;
  --brand-200: 4 120 87;
  --brand-300: 5 150 105;
  --brand-400: 16 185 129;
  --brand-500: 52 211 153;          /* Vibrant emerald for dark mode icons/focus */
  --brand-600: 110 231 183;
  --brand-700: 167 243 208;
  --brand-800: 209 250 229;
  --brand-900: 236 253 245;

  /* Semantic Feedback States — Deep translucent fills with luminous text */
  --success: 52 211 153;            /* Luminous emerald */
  --success-strong: 110 231 183;
  --success-bg: 6 44 32;            /* Deep forest emerald */
  --success-border: 16 185 129;

  --error: 248 113 113;             /* Luminous coral/red */
  --error-strong: 252 165 165;
  --error-bg: 54 18 18;             /* Deep muted crimson */
  --error-border: 239 68 68;

  --warning: 251 191 36;            /* Luminous amber */
  --warning-strong: 252 211 77;
  --warning-bg: 48 34 10;           /* Deep dark amber */
  --warning-border: 217 119 6;

  --info: 96 165 250;               /* Luminous sky blue */
  --info-strong: 147 197 253;
  --info-bg: 15 32 67;              /* Deep sapphire */
  --info-border: 59 130 246;
}
```

### 3.3 Component-Level Dark Mode Verification
- `Badge.jsx` & `Chip.jsx`: Ensure variant fills (`success`, `error`, `brand`, `warning`) use `--*-bg` and `--*-strong` tokens with crisp borders.
- `Card.jsx`: Guarantee border contrast with `border-ink-200` and `shadow-sm`.
- `Input.jsx`: Ensure form input background is `bg-surface-50` or `bg-surface-card` with `text-ink-900` and high-contrast placeholder `placeholder:text-ink-400`.
- `GrammarCard.jsx` & `DialoguePlayer.jsx`: Ensure rule callouts and message speech bubbles use semantic tokens so text never blends with background fills.
- `SentenceBuilder.jsx` & `CharacterStudio.jsx`: Ensure word tiles and stroke cards have distinct active/hover borders.

---

## 4. File Changes & Additions

| File Path | Nature | Purpose |
|---|---|---|
| `supabase/schema.sql` | **New** | SQL script for Supabase tables, triggers, and Row Level Security policies |
| `.env.example` | **New** | Template for `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` |
| `src/lib/supabaseClient.js` | **New** | Supabase client instance with graceful offline fallback |
| `src/context/AuthContext.jsx` | **New** | Auth state provider (user session, sign in, sign up, sign out, password reset) |
| `src/components/auth/AuthModal.jsx` | **New** | Accessible authentication modal with form validation |
| `src/styles/index.css` | **Update** | Comprehensive dark mode tokens (feedback fills, high contrast inks, card borders) |
| `src/components/layout/Navbar.jsx` | **Update** | Add "Sign In" button / user account menu indicator |
| `src/components/layout/MobileNav.jsx` | **Update** | Add profile/account auth status badge |
| `src/pages/Profile.jsx` | **Update** | Display Supabase Cloud Sync status, account email, and Sign In / Sign Out button |
| `src/context/UserContext.jsx` | **Update** | Connect data sync engine between local storage and Supabase cloud tables |
| `scripts/verify-supabase.js` | **New** | Automated verification script testing client fallback, schema syntax, and sync logic |
| `package.json` | **Update** | Add `@supabase/supabase-js` dependency |

---

## 5. Verification & Testing Strategy

1. **Schema & Client Automated Verification (`node scripts/verify-supabase.js`)**:
   - Verify Supabase client initializes cleanly without `.env` credentials (offline fallback).
   - Verify SQL schema passes syntax validation and defines all necessary columns, constraints, and RLS policies.
   - Verify merge algorithm (union of completed lessons, max XP, latest streak).
2. **Dark Theme Contrast Automated Verification**:
   - Contrast calculation test asserting WCAG AA (≥ 4.5:1) for all dark mode tokens against dark card and page surfaces.
3. **Automated Regression Suite (`npm test && npm run test:interactions`)**:
   - Ensure all 16 existing browser interaction flows and 3 curriculum/phonics suites continue to pass at 100%.
4. **Production Build (`npm run build`)**:
   - Ensure clean bundle compilation and chunking with zero errors.
