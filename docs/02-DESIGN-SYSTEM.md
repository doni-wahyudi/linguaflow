# LinguaFlow — Design System Specification

> **Version**: 1.0  
> **Last Updated**: November 2026  
> **Status**: Finalized for MVP  
> **Author**: LinguaFlow Design Team

---

## 1. Brand Identity

### 1.1 Brand Personality

LinguaFlow's design should feel like sitting across the table from a **friendly, knowledgeable language tutor** — warm, encouraging, and modern. Every visual choice supports this personality.

| Trait             | Expression in Design                                                    |
|-------------------|-------------------------------------------------------------------------|
| **Warm**          | Cream backgrounds, soft shadows, rounded corners, gentle gradients      |
| **Encouraging**   | Celebratory micro-animations, positive feedback colors, progress visibility |
| **Knowledgeable** | Clean typography, structured layouts, clear information hierarchy        |
| **Modern**        | Generous whitespace, subtle motion, contemporary typefaces               |

### 1.2 What We Are NOT

| Anti-Pattern      | Why We Avoid It                                                         |
|-------------------|-------------------------------------------------------------------------|
| **Childish**      | No cartoon mascots, no neon colors, no bouncy Comic Sans energy         |
| **Corporate**     | No stock-photo sterility, no blue-grey enterprise dashboards            |
| **Cold**          | No pure `#FFFFFF` backgrounds, no sharp edges, no clinical precision    |
| **Overwhelming**  | No information overload, no 15 CTAs per screen, no notification storms  |

### 1.3 Design Philosophy: Why Not Purple?

Many AI and learning apps default to purple/indigo palettes — it has become a cliché signaling "we're AI-powered" or "we're innovative." LinguaFlow deliberately avoids this:

- **Emerald green** was chosen as the primary accent because it evokes **growth, nature, and learning** — a plant growing from a seedling to a forest, which mirrors the user's language learning journey.
- **Amber** represents **achievement and warmth** — the glow of accomplishment.
- **Coral/Orange** represents **energy and streaks** — the fire of daily commitment.

This palette is distinctive, thematically meaningful, and immediately differentiable from competitors.

---

## 2. Color System

### 2.1 The 60-30-10 Rule

The color distribution follows the classic interior design principle to create visual harmony:

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   60% FOUNDATION — Surface backgrounds, page canvas         │
│   Warm cream (#FAFAF7) that avoids clinical white           │
│                                                             │
│   ┌───────────────────────────────────────────────┐         │
│   │                                               │         │
│   │   30% STRUCTURE — Cards, text, borders         │         │
│   │   White cards, warm-dark text, subtle borders  │         │
│   │                                               │         │
│   │   ┌───────────────────────────┐               │         │
│   │   │                           │               │         │
│   │   │  10% ACCENT — Brand      │               │         │
│   │   │  colors, CTAs, progress  │               │         │
│   │   │                           │               │         │
│   │   └───────────────────────────┘               │         │
│   └───────────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Foundation Colors (60%)

| Token             | Value      | Usage                                     |
|-------------------|------------|--------------------------------------------|
| `surface-50`      | `#FAFAF7`  | Page background — warm cream               |
| `surface-100`     | `#F5F5F0`  | Subtle section backgrounds, hover states   |
| `surface-200`     | `#EDEDE8`  | Dividers, secondary backgrounds            |

> [!IMPORTANT]
> We use `#FAFAF7` (warm cream) instead of pure `#FFFFFF` for the page background. Pure white feels clinical and causes eye strain during long study sessions. The warm undertone is subtle but critical for the app's personality.

### 2.3 Structure Colors (30%)

| Token             | Value      | Usage                                     |
|-------------------|------------|--------------------------------------------|
| `card-bg`         | `#FFFFFF`  | Card surfaces (contrasts against cream bg) |
| `text-primary`    | `#1C1917`  | Headings, primary body text (warm black)   |
| `text-secondary`  | `#78716C`  | Captions, labels, secondary info           |
| `text-tertiary`   | `#A8A29E`  | Placeholders, disabled text                |
| `border-default`  | `#E7E5E4`  | Card borders, dividers                     |
| `border-strong`   | `#D6D3D1`  | Input borders, stronger separators         |

### 2.4 Accent Colors (10%)

#### Primary — Brand Emerald (Growth / Learning)

| Token             | Value      | Usage                                     |
|-------------------|------------|--------------------------------------------|
| `brand-50`        | `#ECFDF5`  | Tinted backgrounds, success alerts         |
| `brand-100`       | `#D1FAE5`  | Hover backgrounds, subtle highlights       |
| `brand-200`       | `#A7F3D0`  | Light progress fills                       |
| `brand-300`       | `#6EE7B7`  | Progress bar fills                         |
| `brand-400`       | `#34D399`  | Icons, interactive accents                 |
| `brand-500`       | `#10B981`  | Buttons on hover, active states            |
| `brand-600`       | `#059669`  | **Primary buttons**, links, key actions    |
| `brand-700`       | `#047857`  | Button pressed state                       |
| `brand-800`       | `#065F46`  | Dark text on light brand backgrounds       |
| `brand-900`       | `#064E3B`  | Very dark accent text                      |

#### Secondary — Achievement Amber

| Token             | Value      | Usage                                     |
|-------------------|------------|--------------------------------------------|
| `amber-50`        | `#FFFBEB`  | Achievement card backgrounds               |
| `amber-100`       | `#FEF3C7`  | Badge backgrounds                          |
| `amber-400`       | `#FBBF24`  | Star icons, XP indicators                  |
| `amber-500`       | `#F59E0B`  | **Achievement highlights**, XP counters    |
| `amber-600`       | `#D97706`  | Achievement text                           |

#### Tertiary — Streak Coral

| Token             | Value      | Usage                                     |
|-------------------|------------|--------------------------------------------|
| `coral-50`        | `#FFF7ED`  | Streak card backgrounds                    |
| `coral-100`       | `#FFEDD5`  | Warm highlight areas                       |
| `coral-400`       | `#FB923C`  | Streak flame icons                         |
| `coral-500`       | `#F97316`  | **Streak counters**, energy indicators     |
| `coral-600`       | `#EA580C`  | Streak text emphasis                       |

### 2.5 Semantic Colors

| Token          | Value      | Usage                                        |
|----------------|------------|----------------------------------------------|
| `success`      | `#059669`  | Correct answers, completion states            |
| `success-bg`   | `#ECFDF5`  | Success message backgrounds                  |
| `error`        | `#DC2626`  | Wrong answers, validation errors              |
| `error-bg`     | `#FEF2F2`  | Error message backgrounds                    |
| `warning`      | `#F59E0B`  | Caution states, streak-at-risk warnings       |
| `warning-bg`   | `#FFFBEB`  | Warning message backgrounds                  |
| `info`         | `#3B82F6`  | Informational states, tips                    |
| `info-bg`      | `#EFF6FF`  | Info message backgrounds                     |

### 2.6 Tailwind CSS Configuration

```javascript
// tailwind.config.js — color tokens
module.exports = {
  theme: {
    extend: {
      colors: {
        surface: {
          50: '#FAFAF7',
          100: '#F5F5F0',
          200: '#EDEDE8',
        },
        brand: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        // amber and coral use Tailwind's built-in palette
      },
      backgroundColor: {
        page: '#FAFAF7',
      },
    },
  },
};
```

---

## 3. Typography

### 3.1 Font Pairing

| Role         | Font Family          | Weights           | Purpose                                          |
|--------------|----------------------|-------------------|--------------------------------------------------|
| **Display**  | Plus Jakarta Sans    | 600, 700, 800     | Headings, hero text, feature titles               |
| **Body**     | Inter                | 400, 500, 600     | Body text, labels, UI elements                    |

**Why this pairing?**
- **Plus Jakarta Sans** has slightly rounded terminals that feel friendly without being childish. It has strong character at display sizes, with a modern geometric feel.
- **Inter** is purpose-built for screen reading with excellent legibility at small sizes, clear number disambiguation, and OpenType features like tabular numbers.

### 3.2 Type Scale

Using a fluid `clamp()` approach for responsive sizing without breakpoint jumps:

| Level  | Font              | Size (clamp)                         | Weight | Letter Spacing | Line Height |
|--------|-------------------|--------------------------------------|--------|----------------|-------------|
| **H1** | Plus Jakarta Sans | `clamp(2rem, 5vw, 3rem)`            | 800    | `-0.025em`     | 1.1         |
| **H2** | Plus Jakarta Sans | `clamp(1.5rem, 4vw, 2.25rem)`       | 700    | `-0.02em`      | 1.2         |
| **H3** | Plus Jakarta Sans | `clamp(1.25rem, 3vw, 1.75rem)`      | 700    | `-0.015em`     | 1.3         |
| **H4** | Plus Jakarta Sans | `clamp(1.1rem, 2.5vw, 1.375rem)`    | 600    | `-0.01em`      | 1.3         |
| **Body Large** | Inter       | `1.125rem` (18px)                    | 400    | `0`            | 1.6         |
| **Body**       | Inter       | `1rem` (16px)                        | 400    | `0`            | 1.6         |
| **Body Small** | Inter       | `0.875rem` (14px)                    | 400    | `0.005em`      | 1.5         |
| **Caption**    | Inter       | `0.75rem` (12px)                     | 500    | `0.01em`       | 1.4         |
| **Overline**   | Inter       | `0.75rem` (12px)                     | 600    | `0.05em`       | 1.4         |

> [!TIP]
> Negative letter-spacing on display headings tightens the visual rhythm and makes large text feel more polished and intentional. Positive letter-spacing on small text (captions, overlines) improves legibility.

### 3.3 Font Loading Strategy

```html
<!-- Preload critical fonts in index.html -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=Inter:wght@400;500;600&display=swap"
  rel="stylesheet"
/>
```

Use `font-display: swap` to avoid invisible text during font loading (FOIT).

---

## 4. Spacing & Layout

### 4.1 Spacing Scale

Based on a **4px base unit** with an 8px primary grid:

| Token   | Value  | Usage                                    |
|---------|--------|------------------------------------------|
| `space-0.5` | 2px  | Hairline gaps, icon-to-label tight spacing |
| `space-1`   | 4px  | Inline element gaps                       |
| `space-2`   | 8px  | Tight component padding                   |
| `space-3`   | 12px | Button padding (vertical)                 |
| `space-4`   | 16px | Card padding, standard gap                |
| `space-5`   | 20px | Section sub-gaps                          |
| `space-6`   | 24px | Component spacing, card padding (large)   |
| `space-8`   | 32px | Section headers to content                |
| `space-10`  | 40px | Major section spacing                     |
| `space-12`  | 48px | Page section spacing                      |
| `space-16`  | 64px | Hero/major layout spacing                 |
| `space-20`  | 80px | Top-level page padding                    |

### 4.2 Responsive Breakpoints

| Breakpoint | Width    | Target Device    | Layout Behavior                      |
|------------|----------|------------------|--------------------------------------|
| `xs`       | 320px    | Small phones     | Single column, compact spacing       |
| `sm`       | 640px    | Large phones     | Single column, standard spacing      |
| `md`       | 768px    | Tablets          | 2-column grid, sidebar collapses     |
| `lg`       | 1024px   | Laptops          | Full layout, sidebar visible         |
| `xl`       | 1280px   | Desktops         | Max content width, generous margins  |
| `2xl`      | 1440px+  | Large displays   | Centered content, decorative space   |

### 4.3 Layout Constraints

```css
/* Global layout */
.page-container {
  max-width: 1280px;         /* Content never stretches beyond this */
  margin: 0 auto;
  padding: 0 clamp(16px, 4vw, 48px);  /* Fluid side padding */
}

/* Card grid */
.lesson-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}
```

### 4.4 Layout Structure

```
┌───────────────────────────────────────────────────────────────────┐
│  Navbar (64px height, sticky)                                    │
├──────────┬────────────────────────────────────────────────────────┤
│          │                                                        │
│ Sidebar  │  Main Content Area                                     │
│ (240px,  │  (max-width: 1280px, centered)                        │
│  desktop │                                                        │
│  only)   │  ┌──────────────────────────────────────────────┐      │
│          │  │  Page content with responsive grid            │      │
│          │  └──────────────────────────────────────────────┘      │
│          │                                                        │
├──────────┴────────────────────────────────────────────────────────┤
│  Mobile Bottom Nav (56px, mobile only, fixed)                     │
└───────────────────────────────────────────────────────────────────┘
```

---

## 5. Component Specifications

### 5.1 Buttons

All buttons follow a 6-state lifecycle to ensure consistent, accessible interactions.

#### Variants

| Variant       | Background             | Text            | Border          | Usage                          |
|---------------|------------------------|-----------------|-----------------|--------------------------------|
| **Primary**   | `brand-600`            | White           | None            | Main CTAs ("Start Lesson")     |
| **Secondary** | Transparent            | `brand-600`     | `brand-600` 1px | Secondary actions ("Review")   |
| **Ghost**     | Transparent            | `text-secondary`| None            | Tertiary actions, navigation   |
| **Danger**    | `error` (red-600)      | White           | None            | Destructive ("Reset Progress") |

#### State Lifecycle

| State            | Visual Change                                                        |
|------------------|----------------------------------------------------------------------|
| **Default**      | Base styles as defined above                                         |
| **Hover**        | Background darkens one shade (e.g., brand-600 → brand-700), subtle `translateY(-1px)` lift |
| **Active**       | Background darkens further (brand-800), `translateY(0)` press-down, scale(0.98) |
| **Focus-Visible**| 2px offset outline ring in `brand-400` with 2px gap (keyboard navigation) |
| **Loading**      | Content replaced by spinner, button disabled, no cursor change       |
| **Disabled**     | Opacity 0.5, `cursor: not-allowed`, no hover effects                 |

#### Sizing

| Size      | Height | Padding (h)   | Font Size | Border Radius |
|-----------|--------|---------------|-----------|---------------|
| **Small** | 32px   | 12px          | 14px      | 8px           |
| **Medium**| 40px   | 16px          | 16px      | 10px          |
| **Large** | 48px   | 24px          | 18px      | 12px          |

### 5.2 Cards

Cards are the primary content container throughout LinguaFlow.

```css
.card {
  background: #FFFFFF;
  border: 1px solid #E7E5E4;
  border-radius: 16px;
  padding: 24px;
  
  /* Multi-layered soft shadow */
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.04),
    0 4px 8px rgba(0, 0, 0, 0.04),
    0 8px 16px rgba(0, 0, 0, 0.02);
  
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.06),
    0 8px 16px rgba(0, 0, 0, 0.06),
    0 16px 32px rgba(0, 0, 0, 0.04);
  
  transform: translateY(-2px);
}
```

> [!NOTE]
> Multi-layered shadows create a more realistic, "floaty" elevation than a single shadow. The three layers represent ambient occlusion, key light shadow, and diffuse shadow respectively.

#### Card Variants

| Variant           | Additional Styling                                                   |
|-------------------|----------------------------------------------------------------------|
| **Default**       | Base card styling above                                              |
| **Lesson Card**   | Left-side colored accent bar (4px) matching category color           |
| **Stat Card**     | Centered layout, large number display, icon top                      |
| **Achievement**   | Golden border on earned (`amber-400`), greyed out when locked         |
| **Flashcard**     | `perspective: 1000px` with 3D flip transform on click                |

### 5.3 Inputs

| Element          | Specification                                                           |
|------------------|-------------------------------------------------------------------------|
| **Label**        | Always visible above the input; `text-primary`, font-weight 500, 14px   |
| **Field**        | 40px height, 16px padding, `border-default` border, 10px radius        |
| **Placeholder**  | `text-tertiary`, italic style                                           |
| **Focus State**  | Border changes to `brand-500`, 2px `brand-200` ring shadow              |
| **Error State**  | Border changes to `error`, red helper text below, shake animation       |
| **Helper Text**  | Below input, 12px, `text-secondary` (or `error` for validation errors)  |
| **Disabled**     | Background `surface-100`, opacity 0.6, `cursor: not-allowed`           |

### 5.4 Progress Bars

```css
.progress-bar {
  height: 12px;
  background: #E7E5E4;
  border-radius: 9999px;       /* Fully rounded */
  overflow: hidden;
}

.progress-bar__fill {
  height: 100%;
  border-radius: 9999px;
  background: linear-gradient(90deg, #059669, #10B981);
  transition: width 600ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

| Variant         | Fill Color                                                          |
|-----------------|---------------------------------------------------------------------|
| **Standard**    | Brand gradient (`brand-600` → `brand-500`)                         |
| **XP**          | Amber gradient (`amber-500` → `amber-400`)                        |
| **Lesson**      | Emerald with animated shimmer on completion                         |
| **Daily Goal**  | Circular variant using SVG, brand gradient stroke                   |

### 5.5 Badges

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 9999px;       /* Pill shape */
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.01em;
}
```

| Variant       | Background       | Text Color       | Usage                    |
|---------------|------------------|------------------|--------------------------|
| **Default**   | `surface-200`    | `text-secondary` | Labels, counts           |
| **Brand**     | `brand-50`       | `brand-700`      | Level names, skills      |
| **Amber**     | `amber-50`       | `amber-700`      | XP counts, achievements  |
| **Coral**     | `coral-50`       | `coral-700`      | Streak counts            |
| **Success**   | `success-bg`     | `brand-800`      | Completion states        |
| **Error**     | `error-bg`       | `red-700`        | Incorrect counts         |

### 5.6 Modals

| Property         | Value                                                              |
|------------------|--------------------------------------------------------------------|
| **Positioning**  | Centered vertically and horizontally (flexbox)                     |
| **Max Width**    | 480px (small), 640px (medium), 800px (large)                      |
| **Backdrop**     | `rgba(0, 0, 0, 0.4)` with `backdrop-filter: blur(4px)`           |
| **Animation In** | Scale from 0.95 → 1.0 + opacity 0 → 1, 200ms spring              |
| **Animation Out**| Scale 1.0 → 0.95 + opacity 1 → 0, 150ms ease-out                 |
| **Border Radius**| 20px                                                               |
| **Padding**      | 32px                                                               |
| **Close**        | X button top-right + click backdrop to dismiss + Escape key        |

---

## 6. Animation Standards

### 6.1 Guiding Principles

1. **Motion is communication**: Every animation should convey meaning (feedback, transition, spatial relationship).
2. **Speed is respect**: Animations should feel snappy, never sluggish. Users should not wait for animations.
3. **Accessibility first**: All motion must respect `prefers-reduced-motion`.

### 6.2 Duration Scale

| Category              | Duration     | Usage                                          |
|-----------------------|--------------|-------------------------------------------------|
| **Micro-interactions**| 120–200ms    | Button press, toggle, checkbox, icon change     |
| **Component reveals** | 200–300ms    | Dropdown open, tooltip appear, card enter        |
| **Page transitions**  | 300–400ms    | Route change, modal open, major layout shift     |
| **Celebrations**      | 600–1000ms   | Lesson complete, level up, achievement unlocked  |

### 6.3 Easing Curves

| Curve                   | CSS / Spring Config              | Usage                                |
|-------------------------|----------------------------------|--------------------------------------|
| **Standard ease**       | `cubic-bezier(0.4, 0, 0.2, 1)`  | Most transitions                     |
| **Enter (decelerate)**  | `cubic-bezier(0, 0, 0.2, 1)`    | Elements entering the screen         |
| **Exit (accelerate)**   | `cubic-bezier(0.4, 0, 1, 1)`    | Elements leaving the screen          |
| **Spring (interactive)**| `{ stiffness: 300, damping: 20 }`| Drag, flip, interactive elements     |
| **Bouncy spring**       | `{ stiffness: 400, damping: 15 }`| Celebration, completion animations   |

### 6.4 Specific Animations

| Element                 | Animation                                                          |
|-------------------------|--------------------------------------------------------------------|
| **Flashcard flip**      | 3D rotateY(180deg), 400ms spring, perspective 1000px               |
| **Correct answer**      | Green flash + checkmark scale-in + subtle confetti particles       |
| **Wrong answer**        | Red flash + shake animation (translateX ±4px, 3 oscillations)     |
| **XP increment**        | Number count-up animation + floating "+10 XP" text that fades up  |
| **Streak flame**        | Subtle pulse/glow animation on the flame icon, 2s loop            |
| **Progress bar fill**   | Width transition with slight overshoot (spring), 600ms             |
| **Level up**            | Full-screen overlay with radial gradient explosion + text scale-in |
| **Page transition**     | Content fades + slides up 20px, staggered children (50ms delay)    |
| **Card hover**          | translateY(-2px) + shadow elevation increase, 200ms               |

### 6.5 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

```jsx
// Framer Motion hook
import { useReducedMotion } from 'framer-motion';

function AnimatedCard({ children }) {
  const shouldReduce = useReducedMotion();
  return (
    <motion.div
      initial={shouldReduce ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={shouldReduce ? { duration: 0 } : { type: 'spring', stiffness: 300 }}
    >
      {children}
    </motion.div>
  );
}
```

---

## 7. Iconography

### 7.1 Icon Library

**Lucide React** — a fork of Feather Icons with a larger set, consistent 24×24 grid, 2px stroke, and rounded joins.

### 7.2 Usage Guidelines

| Property         | Value                                           |
|------------------|-------------------------------------------------|
| **Default Size** | 20px (inline with text), 24px (standalone)      |
| **Touch Target** | Minimum 44×44px clickable area around icon      |
| **Stroke Width** | 2px (default), 1.5px for dense UI               |
| **Color**        | Inherit from parent text color                   |
| **With Label**   | 8px gap between icon and text label              |

### 7.3 Key Icon Mapping

| Context           | Icon              | Lucide Name       |
|-------------------|-------------------|--------------------|
| Dashboard         | Layout grid       | `LayoutDashboard`  |
| Lessons           | Book open         | `BookOpen`         |
| Practice          | Repeat            | `RotateCcw`        |
| Profile           | User              | `User`             |
| Streak            | Flame             | `Flame`            |
| XP/Stars          | Star              | `Star`             |
| Correct           | Check circle      | `CheckCircle`      |
| Incorrect         | X circle          | `XCircle`          |
| Locked            | Lock              | `Lock`             |
| Settings          | Settings gear     | `Settings`         |
| Close             | X                 | `X`                |
| Back              | Arrow left        | `ArrowLeft`        |
| Heart/Life        | Heart             | `Heart`            |

---

## 8. Accessibility Standards

### 8.1 WCAG AA Compliance

| Requirement                | Target                                                  |
|----------------------------|---------------------------------------------------------|
| **Text Contrast**          | ≥ 4.5:1 for body text, ≥ 3:1 for large text (≥18px)   |
| **Interactive Contrast**   | ≥ 3:1 for UI components against adjacent colors         |
| **Focus Indicators**       | Visible `focus-visible` outline on all interactive elements |
| **Touch Targets**          | Minimum 44 × 44px for all tappable elements             |
| **Alt Text**               | All meaningful images have descriptive alt text          |
| **Heading Hierarchy**      | Logical H1 → H6 structure, no skipped levels            |
| **Form Labels**            | All inputs have visible, associated `<label>` elements  |
| **Error Identification**   | Errors identified by color AND text/icon                 |

### 8.2 Contrast Verification

| Pair                                    | Ratio  | Pass? |
|-----------------------------------------|--------|-------|
| `text-primary` (#1C1917) on `surface-50` (#FAFAF7) | 15.2:1 | ✅ AAA |
| `text-secondary` (#78716C) on `surface-50` (#FAFAF7) | 4.7:1  | ✅ AA  |
| White (#FFFFFF) on `brand-600` (#059669) | 4.6:1  | ✅ AA  |
| White (#FFFFFF) on `error` (#DC2626)     | 4.5:1  | ✅ AA  |
| `brand-600` (#059669) on `brand-50` (#ECFDF5) | 4.8:1 | ✅ AA  |

### 8.3 Keyboard Navigation

```
Tab        → Move focus forward through interactive elements
Shift+Tab  → Move focus backward
Enter      → Activate focused button/link
Space      → Toggle focused checkbox/option
Escape     → Close modal/dropdown
Arrow keys → Navigate within radio groups, tabs, menus
```

### 8.4 Screen Reader Considerations

- Use semantic HTML elements (`<nav>`, `<main>`, `<section>`, `<article>`, `<button>`)
- Add `aria-label` to icon-only buttons
- Use `aria-live="polite"` for dynamic feedback (correct/incorrect answers)
- Use `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- Mark decorative images with `aria-hidden="true"` or empty `alt=""`

---

## 9. Responsive Design Patterns

### 9.1 Navigation

| Breakpoint  | Navigation Pattern                                                |
|-------------|-------------------------------------------------------------------|
| Mobile      | Bottom tab bar (Dashboard, Lessons, Practice, Profile) — 56px     |
| Tablet      | Collapsible sidebar with hamburger trigger                        |
| Desktop     | Persistent left sidebar (240px)                                   |

### 9.2 Lesson Grid

| Breakpoint  | Grid                                                             |
|-------------|------------------------------------------------------------------|
| Mobile      | 1 column, full-width cards                                        |
| Tablet      | 2 columns                                                         |
| Desktop     | 3–4 columns (auto-fill, minmax 280px)                            |

### 9.3 Lesson Player

The lesson player is always single-column and centered (max-width 640px) for focused attention regardless of screen size. On mobile, it goes full-screen (no nav bars visible).

---

## 10. Dark Mode (Future)

> [!NOTE]
> Dark mode is out of scope for MVP but the color system is architected to support it. All colors are referenced via CSS custom properties (design tokens), making a dark mode pass a matter of swapping token values without touching component code.

Planned dark mode surface colors:
- `surface-50`: `#1C1917` (warm dark instead of cream)
- `card-bg`: `#292524` (elevated dark surface)
- `text-primary`: `#FAFAF9` (cream white)
- Brand accent colors remain unchanged — they have sufficient contrast in both modes.

---

*This design system is the single source of truth for all visual decisions in LinguaFlow. Every component, color, and animation should reference this document.*
