# Supabase Authentication, Cloud Sync & Dark Theme Contrast Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Supabase Authentication and Cloud Sync with offline-first guest fallback, prepare the SQL migration script for Supabase linking, and overhaul dark theme tokens to fix low-contrast and invisible elements across the app.

**Architecture:** 
1. Use `@supabase/supabase-js` configured via `import.meta.env.VITE_SUPABASE_URL` and `import.meta.env.VITE_SUPABASE_ANON_KEY` with graceful offline fallback when environment variables are not set.
2. Build an `AuthContext` and accessible `AuthModal` providing Email & Password signup, login, session recovery, and password reset.
3. Build a bi-directional synchronization and merge engine in `UserContext` that preserves guest progress and merges it seamlessly with cloud tables upon login.
4. Overhaul `[data-theme='dark']` tokens in `src/styles/index.css` to provide deep translucent feedback backgrounds, high-contrast ink scales, elevated card borders, and accessible input fields.

**Tech Stack:** React 18, Vite 6, Tailwind CSS, `@supabase/supabase-js`, Web Audio API, Headless Chrome CDP testing.

**Spec:** `docs/superpowers/specs/2026-11-09-supabase-auth-and-dark-theme-design.md`

## Global Constraints
- Zero crash policy: If Supabase credentials are missing or network is offline, the app must remain 100% operational in guest mode via `localStorage`.
- WCAG 2.1 AA Compliance: All text on dark surfaces must achieve ≥ 4.5:1 contrast; UI borders and icons must achieve ≥ 3.0:1 contrast.
- Strict data safety: Logging in must never overwrite or delete existing local progress; records must be merged deterministically.
- All existing tests (`npm test` and `npm run test:interactions`) must continue to pass at 100%.

---

### Task 1: Dark Theme Contrast & Visibility Overhaul

**Files:**
- Modify: `src/styles/index.css:104-120`
- Modify: `src/components/ui/Badge.jsx:15-30`
- Modify: `src/components/ui/Card.jsx:10-25`
- Modify: `src/components/ui/Input.jsx:20-45`
- Create: `scripts/verify-dark-contrast.js`

**Interfaces:**
- Consumes: CSS custom properties (`--surface-bg`, `--surface-card`, `--ink-900`, `--ink-500`, `--success-bg`, etc.)
- Produces: Complete, verified dark theme token mapping meeting WCAG 2.1 AA/AAA standards.

- [ ] **Step 1: Write the failing contrast test script (`scripts/verify-dark-contrast.js`)**

```javascript
import fs from 'node:fs';

const css = fs.readFileSync('src/styles/index.css', 'utf-8');
const darkSectionMatch = css.match(/\[data-theme=['"]dark['"]\]\s*\{([^}]+)\}/);

if (!darkSectionMatch) {
  console.error('FAIL: [data-theme="dark"] section not found in index.css');
  process.exit(1);
}

const darkProps = darkSectionMatch[1];
const requiredTokens = [
  '--success-bg',
  '--success-border',
  '--success-strong',
  '--error-bg',
  '--error-border',
  '--error-strong',
  '--warning-bg',
  '--warning-border',
  '--warning-strong',
  '--info-bg',
  '--info-border',
  '--info-strong',
  '--surface-card',
  '--ink-200',
  '--ink-500',
];

const missing = requiredTokens.filter((token) => !darkProps.includes(token));

if (missing.length > 0) {
  console.error(`FAIL: Missing required dark mode tokens: ${missing.join(', ')}`);
  process.exit(1);
}

console.log('PASS: All required dark mode contrast tokens defined.');
process.exit(0);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node scripts/verify-dark-contrast.js`  
Expected: FAIL with missing feedback tokens (`--success-bg`, `--error-bg`, etc.)

- [ ] **Step 3: Update `src/styles/index.css` with dark theme tokens**

In `src/styles/index.css`, replace the `[data-theme='dark']` block with:

```css
  [data-theme='dark'] {
    /* Surfaces — Balanced Slate/Zinc Charcoal (OLED-friendly, high contrast) */
    --surface-bg: 18 18 20;
    --surface-50: 24 24 27;
    --surface-100: 32 32 36;
    --surface-200: 45 45 52;
    --surface-card: 26 26 30;
    --surface-elevated: 36 36 42;

    /* Inks — High Contrast Scale (WCAG 2.1 AAA Compliant) */
    --ink-900: 250 250 250;
    --ink-700: 228 228 231;
    --ink-500: 212 212 216;
    --ink-400: 161 161 170;
    --ink-300: 113 113 122;
    --ink-200: 63 63 70;
    --ink-100: 39 39 42;
    --ink-50: 24 24 27;

    /* Brand Emerald for Dark Theme */
    --brand-50: 6 78 59;
    --brand-100: 6 95 70;
    --brand-200: 4 120 87;
    --brand-300: 5 150 105;
    --brand-400: 16 185 129;
    --brand-500: 52 211 153;
    --brand-600: 110 231 183;
    --brand-700: 167 243 208;
    --brand-800: 209 250 229;
    --brand-900: 236 253 245;

    /* Semantic Feedback States — Deep translucent fills with luminous text */
    --success: 52 211 153;
    --success-strong: 110 231 183;
    --success-bg: 6 44 32;
    --success-border: 16 185 129;

    --error: 248 113 113;
    --error-strong: 252 165 165;
    --error-bg: 54 18 18;
    --error-border: 239 68 68;

    --warning: 251 191 36;
    --warning-strong: 252 211 77;
    --warning-bg: 48 34 10;
    --warning-border: 217 119 6;

    --info: 96 165 250;
    --info-strong: 147 197 253;
    --info-bg: 15 32 67;
    --info-border: 59 130 246;
  }
```

- [ ] **Step 4: Update UI primitives for dark theme resilience**

- In `src/components/ui/Input.jsx`, ensure `bg-surface-50 text-ink-900 border-ink-200 placeholder:text-ink-400`.
- In `src/components/ui/Card.jsx`, ensure cards have `border border-ink-200 bg-surface-card text-ink-900`.
- In `src/components/ui/Badge.jsx`, ensure badges use semantic feedback variables (`bg-[rgb(var(--success-bg))] text-[rgb(var(--success-strong))] border-[rgb(var(--success-border))]`).

- [ ] **Step 5: Run contrast test to verify it passes**

Run: `node scripts/verify-dark-contrast.js`  
Expected: PASS with 0 missing tokens.

- [ ] **Step 6: Commit**

```bash
git add scripts/verify-dark-contrast.js src/styles/index.css src/components/ui/Input.jsx src/components/ui/Card.jsx src/components/ui/Badge.jsx
git commit -m "fix(theme): overhaul dark mode tokens for high contrast and readability"
```

---

### Task 2: Supabase SQL Setup Script & Client Configuration

**Files:**
- Create: `supabase/schema.sql`
- Create: `.env.example`
- Create: `src/lib/supabaseClient.js`
- Modify: `package.json`
- Create: `scripts/verify-supabase.js`

**Interfaces:**
- Produces: `supabase` client instance from `src/lib/supabaseClient.js`, SQL migration schema, `.env.example` template.

- [ ] **Step 1: Install `@supabase/supabase-js`**

Run: `npm install @supabase/supabase-js`

- [ ] **Step 2: Create `supabase/schema.sql`**

Create `supabase/schema.sql` containing the DDL tables (`profiles`, `user_progress`, `user_stats`), RLS policies, indexes, and trigger `on_auth_user_created` as specified in Section 2.2 of the design spec.

- [ ] **Step 3: Create `.env.example`**

```bash
# Supabase Project Configuration
# Retrieve these from your Supabase Dashboard: Settings -> API
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

- [ ] **Step 4: Create `src/lib/supabaseClient.js` with offline fallback**

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  !supabaseUrl.includes('placeholder')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
```

- [ ] **Step 5: Write and run `scripts/verify-supabase.js`**

```javascript
import fs from 'node:fs';
import { isSupabaseConfigured } from '../src/lib/supabaseClient.js';

// 1. Verify schema file exists and contains essential tables and RLS
const sql = fs.readFileSync('supabase/schema.sql', 'utf-8');
const expectedPatterns = [
  'CREATE TABLE IF NOT EXISTS public.profiles',
  'CREATE TABLE IF NOT EXISTS public.user_progress',
  'CREATE TABLE IF NOT EXISTS public.user_stats',
  'ENABLE ROW LEVEL SECURITY',
  'CREATE POLICY',
  'on_auth_user_created'
];

for (const pattern of expectedPatterns) {
  if (!sql.includes(pattern)) {
    console.error(`FAIL: schema.sql missing pattern: "${pattern}"`);
    process.exit(1);
  }
}

// 2. Verify client fallback
if (isSupabaseConfigured !== false && !process.env.VITE_SUPABASE_URL) {
  console.error('FAIL: Expected isSupabaseConfigured to be false when env is not set');
  process.exit(1);
}

console.log('PASS: Supabase schema and client fallback verified successfully.');
process.exit(0);
```

Run: `node scripts/verify-supabase.js`  
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add supabase/schema.sql .env.example src/lib/supabaseClient.js scripts/verify-supabase.js package.json package-lock.json
git commit -m "feat(supabase): create SQL schema, client instance, and offline fallback"
```

---

### Task 3: Supabase Authentication Context & Auth Modal

**Files:**
- Create: `src/context/AuthContext.jsx`
- Create: `src/components/auth/AuthModal.jsx`
- Modify: `src/components/layout/Navbar.jsx`
- Modify: `src/components/layout/MobileNav.jsx`

**Interfaces:**
- Produces: `useAuth()` hook returning `{ user, session, loading, signIn, signUp, signOut, resetPassword, isConfigured }`
- Produces: `<AuthModal isOpen={isOpen} onClose={onClose} />`

- [ ] **Step 1: Create `src/context/AuthContext.jsx`**

Implement `AuthContext` with:
- Initial session check via `supabase?.auth.getSession()`.
- Listener via `supabase?.auth.onAuthStateChange((event, session) => ...)`.
- Async methods: `signIn(email, password)`, `signUp(email, password, name)`, `signOut()`, `resetPassword(email)`.
- If `!isSupabaseConfigured`, return clean stub methods that inform the user without throwing.

- [ ] **Step 2: Create `src/components/auth/AuthModal.jsx`**

Implement accessible modal with:
- Tabs for "Sign In", "Sign Up", and "Forgot Password".
- Form fields: Email, Password, Name (for signup).
- Accessible keyboard dismissal (Escape), backdrop click, ARIA dialog role.
- Loading state spinner and error alert banner.

- [ ] **Step 3: Update `Navbar.jsx` and `MobileNav.jsx`**

- In `Navbar.jsx`, add an auth button in the header:
  - If guest: renders "Sign In" button opening `AuthModal`.
  - If logged in: renders user avatar badge with user email or name, and quick dropdown / sign out action.
- In `MobileNav.jsx`, add account status indicator linking to Profile / opening `AuthModal`.

- [ ] **Step 4: Verify build and modal behavior**

Run: `npm run build`  
Expected: PASS with 0 build errors.

- [ ] **Step 5: Commit**

```bash
git add src/context/AuthContext.jsx src/components/auth/AuthModal.jsx src/components/layout/Navbar.jsx src/components/layout/MobileNav.jsx
git commit -m "feat(auth): add Supabase AuthContext, accessible AuthModal, and navbar status"
```

---

### Task 4: Cloud Synchronization & Guest Data Migration Engine

**Files:**
- Create: `src/utils/supabaseSync.js`
- Modify: `src/context/UserContext.jsx`
- Modify: `src/pages/Profile.jsx`

**Interfaces:**
- Produces: `syncLocalToCloud(userId)`, `fetchCloudUserData(userId)`, `mergeCloudAndLocal(local, cloud)`
- Integrates with: `UserContext.jsx` to sync on state mutations when authenticated.

- [ ] **Step 1: Create `src/utils/supabaseSync.js`**

Implement deterministic merge algorithm:
```javascript
export function mergeUserData(local, cloud) {
  // Merge profile
  const mergedProfile = {
    ...cloud.profile,
    ...local.user,
    name: local.user?.name || cloud.profile?.name || 'Learner',
  };

  // Merge completed lessons (union of unique lesson IDs, taking highest score)
  const lessonMap = new Map();
  (cloud.progress?.completed_lessons || []).forEach(l => lessonMap.set(l.lessonId, l));
  (local.completedLessons || []).forEach(l => {
    const existing = lessonMap.get(l.lessonId);
    if (!existing || l.score > existing.score) {
      lessonMap.set(l.lessonId, l);
    }
  });
  const mergedLessons = Array.from(lessonMap.values());

  // Merge word progress
  const mergedWordProgress = {
    ...(cloud.progress?.word_progress || {}),
    ...(local.wordProgress || {}),
  };

  // Merge XP and streak
  const mergedXP = Math.max(local.xp?.totalXP || 0, cloud.stats?.total_xp || 0);
  const mergedCurrentStreak = Math.max(local.streak?.currentStreak || 0, cloud.stats?.current_streak || 0);
  const mergedLongestStreak = Math.max(local.streak?.longestStreak || 0, cloud.stats?.longest_streak || 0);

  return {
    profile: mergedProfile,
    completedLessons: mergedLessons,
    wordProgress: mergedWordProgress,
    xp: mergedXP,
    streak: {
      currentStreak: mergedCurrentStreak,
      longestStreak: mergedLongestStreak,
      lastActiveDate: local.streak?.lastActiveDate || cloud.stats?.last_active_date,
    },
  };
}
```

Implement push functions:
- `pushProfileToCloud(userId, profile)`
- `pushProgressToCloud(userId, { completedLessons, wordProgress, examRecords })`
- `pushStatsToCloud(userId, { totalXP, currentStreak, longestStreak, lastActiveDate })`

- [ ] **Step 2: Update `src/context/UserContext.jsx`**

Connect `useAuth()` into `UserContext`:
- On auth state change to `SIGNED_IN`, execute cloud pull and `mergeUserData`.
- Persist merged data to `localStorage` and push unified record to Supabase.
- Add debounced cloud sync helper on lesson completion, word progress update, XP award, and streak recording.

- [ ] **Step 3: Update `src/pages/Profile.jsx`**

In `Profile.jsx`:
- Add "Cloud Account & Supabase" card section:
  - Displays connection status: "Cloud Connected (Email: ...)" or "Offline Guest Mode".
  - Button to "Sign In to Sync Progress" if guest.
  - Button to "Sign Out" with cloud status confirmation.
  - Manual "Sync Now" button with timestamp of last successful sync.

- [ ] **Step 4: Verify build and unit merge tests**

Run: `node scripts/verify-supabase.js && npm run build`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/utils/supabaseSync.js src/context/UserContext.jsx src/pages/Profile.jsx
git commit -m "feat(sync): implement bi-directional Supabase cloud sync with guest data merge"
```

---

### Task 5: End-to-End Interaction Suite & Regression Acceptance

**Files:**
- Modify: `scripts/verify-live-interactions.js`
- Modify: `package.json`

**Interfaces:**
- Produces: 18/18 passing headless browser CDP tests verifying dark theme contrast, auth modal, and sync logic.

- [ ] **Step 1: Add dark contrast and auth modal test cases to `scripts/verify-live-interactions.js`**

- Test 17: Dark Theme Contrast Check (sets `[data-theme='dark']`, asserts computed colors on cards, feedback banners, and inputs).
- Test 18: Auth Modal Interaction (clicks "Sign In" in navbar, verifies modal open, switches to "Sign Up" tab, presses Escape, verifies modal closes).

- [ ] **Step 2: Update `package.json` test scripts**

Include `verify-dark-contrast.js` and `verify-supabase.js` in `npm test`.

```json
"test": "node scripts/verify-curriculum.js && node scripts/verify-characters.js && node scripts/verify-pronunciation.js && node scripts/verify-dark-contrast.js && node scripts/verify-supabase.js"
```

- [ ] **Step 3: Run full verification suite**

Run: `npm test && npm run test:interactions && npm run build`  
Expected: All suites PASS with 0 errors.

- [ ] **Step 4: Commit**

```bash
git add scripts/verify-live-interactions.js package.json
git commit -m "test(e2e): add dark theme contrast and Supabase auth modal interaction tests"
```
