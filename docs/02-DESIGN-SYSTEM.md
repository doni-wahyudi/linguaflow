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

Colours are **not** hex literals in the config. Each token resolves to an RGB
triplet declared in `src/styles/index.css`, so alpha modifiers work, so one
place owns the palette, and so a future dark mode is a variable swap:

```javascript
// tailwind.config.js — colour tokens resolve through CSS variables
colors: {
  surface: {
    50:      'rgb(var(--surface-50) / <alpha-value>)',
    100:     'rgb(var(--surface-100) / <alpha-value>)',
    200:     'rgb(var(--surface-200) / <alpha-value>)',
    bg:      'rgb(var(--surface-bg) / <alpha-value>)',   // the cream page
    card:    'rgb(var(--surface-card) / <alpha-value>)', // the white tile — never `bg-white`
    elevated:'rgb(var(--surface-elevated) / <alpha-value>)',
  },
  ink: {   // 50 · 100 · 200 · 300 · 400 · 500 · 700 · 900
    700: 'rgb(var(--ink-700) / <alpha-value>)',          // small-text tier
    // 600 and 800 deliberately do not exist. A class that matches no token
    // compiles to nothing and fails silently, which is how `text-ink-600`
    // ended up rendering as inherited colour in three places.
  },
  brand:   { /* 50 … 900, same triplet form */ },
  amber:   { /* built-in palette + -strong/-bg/-border tiers */ },
  coral:   { /* built-in palette */ },
  success: { DEFAULT, strong, bg, border },
  warning: { DEFAULT, strong, bg, border },
  error:   { DEFAULT, strong, bg, border },
  info:    { DEFAULT, strong, bg, border },
}
```

Non-colour scales, all in the same file:

| Scale        | Tokens                                                                                     |
|--------------|--------------------------------------------------------------------------------------------|
| **Radius**   | `card` 16 · `modal` 20 · `button` 12 · `button-sm` 8 · `button-md` 10 · `button-lg` 12 · `input` 10 · `pill` 9999 · `flag` 3 |
| **Shadow**   | `soft-sm` `soft-md` `soft-lg` `soft-xl` · `glow-brand` `glow-amber` · `card` `card-hover`   |
| **MaxWidth** | `modal-sm` 480 · `modal-md` 640 · `modal-lg` 800 · `modal-xl` 960                           |
| **MaxHeight**| `modal` 88vh                                                                               |
| **Z-index**  | `nav-overlay` 60 · `nav-drawer` 70 · `modal` 100 (above Tailwind's own `z-50`)              |
| **Type**     | `display-xl/lg/md/sm/xs` · `body-lg/md/sm` · `caption` · `overline` · `label`               |

`flag` (3px), the modal widths, `max-h-modal` and the named z-layers exist because
they had no analogue in the draft and were being re-typed at each call site as
`rounded-[3px]`, `max-w-[480px]`, `max-h-[88vh]`, `z-[60]`/`z-[70]`/`z-[100]`. A
stacking layer that is only ever written as a raw number is how a `z-[75]` starts a
war with the drawer.

Animation is tokenised the same way, in `src/utils/motion.js` rather than in
Tailwind: `transitionEase` (the one curve, §6.3), `spring.pop`, `spring.glide` and
`shakeX` (§6.4). It is a JS module because Framer Motion takes objects, not classes.

Three arbitrary values survive on purpose, and all three are a unit Tailwind's
scales do not speak:

| Value | Where | Why it stays |
|-------|-------|--------------|
| `align-[-0.15em]` | `brand/Flag.jsx` | The baseline nudge must be **em**-relative so it stays proportional when the surrounding text scales; a fixed px token would drift. Centralised in the one component that draws a flag |
| `min-w-[3ch]` | `ui/ProgressBar.jsx` | Reserves the width of a `tabular-nums` percentage so the label cannot jitter. `ch` is a font-relative measure, not a spacing step |
| `before:content-['']` | `ui/Card.jsx` | The empty string a pseudo-element needs to paint at all; there is no token for "no content" |

Two utilities are declared by a small in-config plugin rather than a token
scale: `perspective-1000` and `backface-hidden`, which Tailwind 3.4 does not
ship (§5.2).

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

> [!IMPORTANT]
> **Implemented 2026-11.** The 240px desktop sidebar in the original draft was
> never built, and adding it now would mean re-parenting every page for no
> measured benefit: the app has five destinations, which fit in a top bar with
> room to spare. The spec records what ships.

```
┌───────────────────────────────────────────────────────────────────┐
│  Navbar (64px, sticky) — Logo · 5 destinations · XP · streak ·     │
│  avatar                                                            │
├───────────────────────────────────────────────────────────────────┤
│  Main content (max-width 1152px = `max-w-6xl`, centered,           │
│  padding 0 clamp(16px, 4vw, 48px))                                 │
│                                                                    │
│  ┌─────────────────────────────────┬──────────────────────┐        │
│  │  Primary column (2/3)           │  Right rail (1/3)    │        │
│  │  page title + content grid      │  level / activity /  │        │
│  │                                 │  quick actions       │        │
│  └─────────────────────────────────┴──────────────────────┘        │
│  (rail stacks below the primary column under `lg`)                 │
├───────────────────────────────────────────────────────────────────┤
│  Mobile: same navbar, destinations collapse into a scrollable row  │
└───────────────────────────────────────────────────────────────────┘
```

The full-bleed flows — lesson player (`/learn/:id`) and exam player
(`/exam/:id`) — deliberately opt out of the container: they own the viewport
with their own 64px header, because a quiz and a countdown need every pixel and
must not scroll the chrome with the content.

---

## 5. Component Specifications

### 5.1 Buttons

All buttons come from `src/components/ui/Button.jsx`. Nothing outside the kit
may re-declare a button: five hand-written 44px icon recipes had drifted to
three sizes and two turtle colours before this was consolidated.

#### Variants

| Variant       | Background             | Text            | Border          | Usage                          |
|---------------|------------------------|-----------------|-----------------|--------------------------------|
| **Primary**   | `brand-700`            | White           | None            | Main CTAs ("Start Lesson")     |
| **Inverse**   | `surface-card` (white) | `brand-700`     | None            | CTA inside a brand-filled hero |
| **Secondary** | Transparent            | `brand-700`     | `brand-700` 1px | Affirmative-but-not-primary    |
| **Outline**   | `surface-card`         | `ink-700`       | `ink-300` 1px   | Neutral partner ("Needs Practice", "Not now") |
| **Tint**      | `brand-50`             | `brand-700`     | `brand-200` 1px | Selected-but-not-affirmative (sound on, active filter) |
| **Ghost**     | Transparent            | `ink-500`       | None            | Tertiary text actions          |
| **Danger**    | `error`                | White           | None            | Destructive ("Reset Progress") |

> [!IMPORTANT]
> **The fill sits on the `-700` tier, not `-600`.** Measured: white on
> `brand-600` is **3.77:1**, which fails AA for the 16px semibold label these
> buttons carry; white on `brand-700` is **5.48:1**. `brand-600` remains the
> accent for icons, borders, large type and non-text UI (all of which clear the
> 3:1 they need). The general rule for every token in §2: **small text uses the
> `-700` / `-strong` tier; `-600` is only safe for large text and non-text UI.**

#### Shape

Default radius follows the size tier (table below). Marketing and hero CTAs may
opt into the pill with `shape="pill"`, which emits `!rounded-pill`; it is a
variant, not a per-page class, so the two shapes never mix inside one surface.

`iconOnly` is a prop, not a class recipe: it makes the button a square whose
side is the size height (`aspect-square !px-0 !gap-0`), suppresses children, and
**requires `aria-label`** — a dev warning fires without one, because the icon is
decorative and the control would have no accessible name (WCAG 4.1.2).

#### State Lifecycle

| State            | Visual Change                                                        |
|------------------|----------------------------------------------------------------------|
| **Default**      | Base styles as defined above                                         |
| **Hover**        | Background darkens one shade (brand-700 → brand-800), subtle `translateY(-1px)` lift |
| **Active**       | Background darkens further (brand-900), `translateY(0)` press-down    |
| **Focus-Visible**| 2px ring in **`brand-600`** with a 2px offset                         |
| **Loading**      | Content replaced by spinner, button disabled                          |
| **Disabled**     | Opacity 0.5, `pointer-events: none`, no hover effects                 |

> [!IMPORTANT]
> **The focus ring is `brand-600`, not the `brand-400` in the original draft.**
> Measured against the cream page, `brand-400` is **1.83:1** — it fails WCAG 2.1
> §1.4.11 (non-text contrast, 3:1 minimum), so keyboard users could not reliably
> see focus. `brand-600` measures **3.60:1** and passes.

#### Sizing

| Size      | Height | Padding (h)   | Font Size      | Border Radius     |
|-----------|--------|---------------|----------------|-------------------|
| **Small** | 32px   | 12px          | `text-body-sm` | `button-sm` 8px   |
| **Medium**| 40px   | 16px          | `text-body-md` | `button-md` 10px  |
| **Large** | 48px   | 24px          | `text-body-lg` | `button-lg` 12px  |

Font sizes reference the type scale tokens (§3.2) rather than raw `text-sm`/`text-lg`,
so a button label can never drift from the rest of the scale. Icon-only buttons
at `lg` are 48x48, clearing the 44px target minimum (§8.1) with room to spare.

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

`<Card tone=… padding=… accent=…>` — the tones are the only sanctioned surfaces:

| Tone            | Surface                                     | Use for                      |
|-----------------|---------------------------------------------|------------------------------|
| **default**     | `surface-card` + `ink-200` border           | Everything that is not a message |
| **quiet**       | `surface-100` + `ink-200` border            | Empty states, secondary panels |
| **brand**       | `brand-50` + `brand-200`                    | Feature/level callouts        |
| **amber**       | `amber-50` + `amber-200`                    | Tips, reading passages        |
| **coral**       | `coral-50` + `coral-200`                    | Streak prompts                |
| **info**        | `info-bg` + `info/25`                       | Neutral notices               |
| **success**     | `success-bg` + `success-border`             | Passed / mastered / correct   |
| **warning**     | `warning-bg` + `warning-border`             | Borderline score, needs review |
| **error**       | `error-bg` + `error-border`                 | Failed / out of hearts        |
| **inverse**     | `brand-700` fill + white text               | Hero cards (white on brand-700 = 5.48:1) |

`accent="success"` draws the 4px left bar instead of tinting the whole surface —
which is the correct way to mark a card state inside a tinted region.

> [!WARNING]
> **Two rules that came from screenshots, not theory.**
> 1. *Badge-on-same-tint:* a `brand-50` Card with a `brand-50` Badge on it makes
>    the chip disappear. Put the state in `accent=` or an `text-overline` line,
>    or move the badge to a `surface-card` tile.
> 2. *Chart bars:* a bar is non-text UI, so `brand-600` is legal and preferred;
>    the value label above it is small text and must be `ink-700`. Never reuse
>    the semantic `success`/`error` reds and greens for ordinary magnitudes —
>    that trains the colour to mean "wrong".

#### Flashcard

`perspective: 1000px` with a 3D `rotateY(180deg)` flip on click. Both properties
are utilities defined in `tailwind.config.js` (`perspective-1000`,
`backface-hidden`) because Tailwind 3.4 ships no built-in for them — writing
them as unregistered classes produced nothing, both faces stayed visible, and
the mirrored back face painted over the front. The hidden face also carries
`aria-hidden` **and** `inert`, so the answer is neither announced nor tabbable
before the learner flips.

### 5.3 Inputs

From `src/components/ui/Input.jsx`.

| Element          | Specification                                                           |
|------------------|-------------------------------------------------------------------------|
| **Label**        | Always visible above the field; `text-body-sm font-medium text-ink-900`, wired with `htmlFor`. Search and filter fields may use `srOnlyLabel` — a placeholder is never the only name (WCAG 3.3.2). |
| **Field**        | 40px (`md`) / 48px (`lg`) height, 16px padding, `ink-300` border, `input` 10px radius |
| **Placeholder**  | `ink-500` italic                                                        |
| **Focus State**  | The app-wide 2px `:focus-visible` outline (see §5.1)                    |
| **Error State**  | `error` border, `text-error-strong` helper below, shake animation        |
| **Helper Text**  | Below field, `text-caption`, `ink-500` (or `text-error-strong` when it is the validation message); linked to the field with `aria-describedby` |
| **Disabled**     | `surface-100` background, opacity 0.5, `cursor: not-allowed`            |

> [!IMPORTANT]
> Two §5.3 values from the original draft measured as failures and were
> replaced: `text-tertiary` placeholders are **2.52:1** on a white field (a
> placeholder is real text, so it owes the 4.5:1 AA minimum) — hence `ink-500`;
> and the "2px `brand-200` ring shadow" is **1.5:1** against the page, invisible
> to exactly the users a focus ring exists for — hence the shared
> `:focus-visible` outline instead of a per-control shadow.

### 5.4 Progress Bars

```css
.progress-bar {
  height: 12px;                 /* md; sm = 8px, lg = 16px */
  background: #E7E5E4;          /* ink-200 track */
  border-radius: 9999px;
  overflow: hidden;
}

/* Fill runs dark -> light so that even the lightest pixel of the gradient
   clears 3:1 against the ink-200 track. */
.progress-bar__fill {
  background: linear-gradient(90deg, var(--brand-700), var(--brand-600));
  transition: width 600ms cubic-bezier(0.16, 1, 0.3, 1);
}
```

| Variant         | Fill                                                                 |
|-----------------|----------------------------------------------------------------------|
| **Standard**    | `brand-700 → brand-600`                                              |
| **XP**          | `amber-800 → amber-700`                                              |
| **Success**     | `brand-700 → brand-600` (completion uses the brand tier, not a second green) |
| **Error**       | `error-strong → error`                                               |
| **Daily Goal**  | `ProgressRing` — circular SVG, same brand stroke, `role="progressbar"` with `aria-valuenow/-valuemin/-valuemax/-valuetext`. Kit-only today: the only consumer is `dashboard/DailyGoal.jsx`, which no page imports (§11) |

> [!IMPORTANT]
> The draft's `brand-600 → brand-500` gradient measured **1.9:1** against the
> `ink-200` track — a progress fill is non-text UI and owes 3:1 (WCAG 2.1
> §1.4.11), so the light end of every fill is capped at the `-600`/`-700` tier.
> A bar also never stands alone: `valueText` names the position in words
> ("Exercise 3 of 6"), because a coloured rectangle carries no accessible value.

### 5.5 Badges

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;            /* md; sm = 2px 8px */
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.01em;
}
```

| Variant       | Background       | Text Color         | Usage                       |
|---------------|------------------|--------------------|-----------------------------|
| **Default**   | `surface-200`    | `ink-700`          | Labels, counts              |
| **Subtle**    | `ink-100`        | `ink-700`          | Metadata inside a filled surface |
| **Brand**     | `brand-50`       | `brand-700`        | Level names, skills         |
| **Amber**     | `amber-50`       | `amber-700`        | XP counts, achievements     |
| **Coral**     | `coral-50`       | `coral-700`        | Streak counts               |
| **Success**   | `success-bg`     | `success-strong`   | Completion states           |
| **Warning**   | `warning-bg`     | `warning-strong`   | Retry / borderline          |
| **Error**     | `error-bg`       | `error-strong`     | Incorrect counts            |
| **Info**      | `info-bg`        | `info-strong`      | Neutral annotation          |
| **Outline**   | transparent + `ink-300` hairline | `ink-700` | "Ready to take" — reads as annotation, not status |
| **Inverse**   | `surface-card/15` + hairline | `surface-card` | On emerald/dark hero surfaces |

Every tint pairs with the `-strong` text tier, never the `-600` one: `brand-600`
on `brand-50` measures **3.58:1** and fails for 12px text, while `brand-700` on
`brand-50` is **5.21:1**. `numeric` adds `tabular-nums` so counts in a list of
cards align instead of jittering.

### 5.6 Modals

| Property         | Value                                                              |
|------------------|--------------------------------------------------------------------|
| **Positioning**  | Centered vertically and horizontally (flexbox), `max-h-[88vh]` with internal scroll |
| **Max Width**    | `max-w-modal-sm` 480px · `max-w-modal-md` 640px · `max-w-modal-lg` 800px · `max-w-modal-xl` 960px |
| **Backdrop**     | `rgba(0, 0, 0, 0.4)` with `backdrop-filter: blur(4px)`           |
| **Animation In** | Scale 0.95 → 1.0 + opacity, 200ms on `transitionEase`; exits faster (150ms, §6.3) |
| **Animation Out**| Scale 1.0 → 0.95 + opacity 1 → 0, 150ms ease-out                 |
| **Border Radius**| `modal` 20px                                                       |
| **Padding**      | 32px                                                               |
| **Close**        | X button top-right + click backdrop to dismiss + Escape key        |
| **Focus**        | Trapped inside while open, restored to the opener on close; `role="dialog" aria-modal="true"` with `aria-labelledby` on the title |

The four widths are Tailwind `maxWidth` tokens rather than inline `max-w-[480px]`
values, because dialog measure is a design decision and belongs in the config
next to the radius and shadow scales. `xl` exists for the exam and writing
readers; the draft listed only three.

### 5.7 Selection and navigation primitives

These four components exist because the same recipe had been re-typed per page
and had started to drift. If a screen needs a tab rail, a filter, an audio pair
or a nameless icon button, it uses these — it does not write the classes again.

| Component | File | Contract |
|-----------|------|----------|
| **SegmentedControl** | `ui/SegmentedControl.jsx` | `role="tablist"` rail with roving `tabIndex`; ArrowLeft/Right/Up/Down/Home/End move focus and activate. `name` namespaces the generated ids (`segmentIds(name)`), so a page's panels and tabs always agree. `tone="page"` sits on the cream background, `tone="card"` inside a white card. `aria-controls` is emitted only on the selected tab, because only one panel is mounted. |
| **Chip** | `ui/Chip.jsx` | `role="group"` filter pill with `aria-pressed`, optional leading icon and check. Selected is `brand-700` with white text (5.48:1); unselected is `ink-700` on the surface. |
| **AudioControls** | `ui/AudioControls.jsx` | The normal + 0.65x playback pair. 44x44 targets, `aria-label` naming the phrase being spoken, `stopPropagation` for pairs inside a clickable card, and a visibly disabled state when the browser has no speech support — a control that silently does nothing is worse than one that looks dead. |
| **Button `iconOnly`** | `ui/Button.jsx` | Square icon button sized from the same scale as every other button; `aria-label` is mandatory (dev warning). Replaces the five hand-written `h-11 w-11 rounded-pill` recipes. |

Two rules that apply to all of them:

1. **Idle and active tones are separate class strings.** Two `bg-*` (or `text-*`)
   utilities in one `class` attribute resolve by position in the stylesheet, not
   by which one you wrote last — so `${BASE} ${selected ? ON : OFF}` only works
   when `ON` and `OFF` each carry one colour declaration.
2. **A rail never shares a row with a page title when the two cannot fit.**
   Practice's four tabs plus its title need ~1180px inside a 1152px container, so
   the rail sits under the title, left-aligned, on both tabbed pages.

### 5.8 Page coverage

Every page renders through the kit: `Landing`, `Onboarding`, `Dashboard`,
`Lessons`, `LessonPlayer`, `Practice`, `Exams`, `ExamPlayer`, `WritingPractice`,
`Profile`, `NotFound`. The last three were the stragglers — the Writing Lab had
a hand-rolled tab strip, inline `style={{ fontSize }}` on the reference glyph,
`title=` attributes as the only description, and `green-*` classes from outside
the palette; Exams computed a "1 of 3 sat" statistic it never displayed and had
no empty state at all. Both are now kit-only.

---

## 6. Animation Standards

### 6.1 Guiding Principles

1. **Motion is communication**: it reports an outcome — a shake means the answer was wrong, a fill means progress moved. Nothing animates purely to decorate.
2. **Speed is respect**: no animation blocks input (confetti is `pointer-events-none`), the longest non-celebration movement is 600ms, the shortest is 150ms.
3. **Accessibility first**: reduced motion is handled once at the root, so a component cannot forget it. See §6.5.

### 6.2 Duration Scale

Four tiers, as implemented:

| Tier                  | Duration            | Where it is used                                                                 |
|-----------------------|---------------------|----------------------------------------------------------------------------------|
| **Micro**             | 150–200ms           | Button / Card press, modal panel, inline feedback banners, the drill's prompt↔answer cross-fade (180ms) |
| **Standard**          | 250–300ms           | Wrong-answer shake, Onboarding step card, mobile drawer enter, the navbar underline (`layoutId`) |
| **Enter**             | 350–500ms           | Page enter and exercise switch (350ms), Dashboard card (400ms), flashcard flip and lesson-complete card (500ms) |
| **Progress**          | 600ms               | `ProgressBar` fill, `ProgressRing` arc                                            |
| **Celebration**       | 4000ms              | Confetti burst on a completed lesson or a passed exam                             |

List children stagger by 50–80ms (`Dashboard` 0.05, `Exams` 0.08 per card) so a group
reads as one arrival rather than a shotgun.

### 6.3 Easing Curves

One curve moves everything: **`cubic-bezier(0.16, 1, 0.3, 1)`** — fast out, long
settle, no overshoot. It is exported as `transitionEase` from
`src/utils/motion.js` and imported by every animated component.

That module is new. Before it, the literal was hand-copied into fifteen files and
three reveal animations silently used Framer Motion's default spring instead, so
the "standard" curve was really a habit — and habits drift. Durations stay as
literals at the call site on purpose: a different duration reads as hierarchy, a
different curve just reads as sloppy.

Four deliberate exceptions:

| Curve / spring                       | Where                              | Why                                            |
|--------------------------------------|------------------------------------|------------------------------------------------|
| `ease: 'easeInOut'`, 2.5s loop       | Landing hero flag bob              | An oscillation needs a symmetric curve; the enter curve makes it lurch |
| `ease: 'easeOut'` / `'easeIn'`, exit only | Modal panel exit (150ms), drawer exit (200ms) | A departure should be quicker than an arrival — the enter curve holds nothing on the way out |
| `spring.pop` (stiffness 400, damping 20) | `MobileNav` active-tab icon       | A tab is a physical toggle; a small bounce sells the press |
| `spring.glide` (stiffness 200, damping 15) | `Onboarding` welcome badge      | One-time reveal; the only scale-in where overshoot reads as celebration |

The CSS side keeps Tailwind's default `cubic-bezier(0.4, 0, 0.2, 1)` for every
`transition-colors` hover and focus fade — it is short enough that a second curve
would be invisible, and re-declaring it would only add bytes.

### 6.4 Specific Animations

Taken from the code, not from the wishlist. Anything the app does not do is said
so — a spec that lists unbuilt features as standards is how drift gets a seal of
approval.

| Element                 | What actually happens                                                             |
|-------------------------|-----------------------------------------------------------------------------------|
| **Flashcard flip**      | `rotateY(0 → 180)`, 500ms on `transitionEase`, with the `perspective-1000` / `backface-hidden` utilities of §5.6 |
| **Correct answer**      | `success-bg` fill, `success-border`, `success-strong` text, a `Check` glyph, and a 200ms banner that fades up. Confetti is reserved for the end of a lesson or exam |
| **Wrong answer**        | `error-*` tones, an `X` glyph, and the shared `shakeX` keyframes `[0, -6, 6, -4, 4, 0]` over 300ms |
| **Exercise switch**     | Incoming slide `x: 20 → 0`, outgoing `x: 0 → -20`, 350ms, `AnimatePresence mode="wait"` |
| **Progress fill**       | Bar: width 0 → target over 600ms. Ring: `stroke-dashoffset` over 600ms, starting at 12 o'clock — kit-only, no shipped page mounts `ProgressRing` (§11) |
| **Page enter**          | Fade + 12px lift over 350ms (`PageWrapper`)                                        |
| **Card / button hover** | Card `y: -2` + `shadow-card-hover`; Button `y: -1`; both 200ms, `whileTap` scale 0.98–0.99 |
| **Navbar underline**    | One `layoutId="nav-underline"` element that travels between links, 250ms            |
| **Streak flame pulse, XP count-up, level-up overlay** | **Not implemented.** The navbar flame is a static icon and the XP figure is plain `tabular-nums` text; the only count-up and infinite pulse live in `src/components/dashboard/*`, which no page imports (§11). Lesson completion is a scale-in card plus confetti, not a full-screen explosion |

Colour note: the draft's "green flash / red flash" is now the `success` and `error`
tokens. The brand is green; reusing brand green for a correct answer would make a
right answer and a selected answer the same colour.

### 6.5 Reduced Motion

Two mechanisms, because neither one covers the other:

```css
/* src/styles/index.css — CSS transitions and keyframes */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

```jsx
// src/App.jsx — every JS animation in the app
<MotionConfig reducedMotion="user">
```

`reducedMotion="user"` only neutralises **transform and layout** animation.
Opacity, `width` and `stroke-dashoffset` still run, so the components that animate
those gate them by hand with `useReducedMotion()`:

- `ProgressBar` — bar and ring jump straight to the value.
- `FlashCard` — `{ duration: 0 }`; the face swaps without turning.
- `Confetti` — renders `null`, and re-checks the preference if it changes mid-session.
- `Landing` — the infinite flag bob stops, and `scrollIntoView` falls back to `behavior: 'auto'`.

The `whileInView` reveals on the marketing page are a separate hazard that has
nothing to do with motion preference: an element that starts at `opacity: 0` is
also invisible to a print, a PDF export, and a crawler that never scrolls.
`App.jsx` adds `.lf-reveal-fallback` to `<html>` on `beforeprint` — and permanently
when motion is reduced — and `src/styles/index.css` forces
`.lf-reveal-fallback [data-reveal]` visible.

---

## 7. Iconography

### 7.1 Icon Library

**Lucide React** — a fork of Feather Icons with a larger set, consistent 24×24 grid, 2px stroke, and rounded joins.

### 7.2 Usage Guidelines

| Property         | Value                                                                              |
|------------------|------------------------------------------------------------------------------------|
| **Default size** | 20px inline with body text, 16px in the navbar metrics and inside compact controls, 24px standalone, 14px inside a filled status circle |
| **Touch target** | ≥ 44 × 44px around any *interactive* icon — the icon shrinks, the hit area does not (§4.3) |
| **Stroke width** | 2 (default) · 2.2 (the `Logo` globe, so it survives the gradient fill) · 2.4 (active tab) · 3 (a `Check`/`X` inside a filled disc, where a 2px stroke disappears) |
| **Colour**       | Inherit from the parent text colour; only status fills (`fill-error` hearts) set it explicitly |
| **With label**   | Gap comes from the control size, not a magic number: Button `gap-1.5` / `gap-2` / `gap-2.5` for sm / md / lg |
| **Decorative**   | `aria-hidden="true"`, always. `SemanticIcon` does it unless you pass `label`       |
| **Meaningful**   | `<Icon aria-label="…" role="img" />`, or an `aria-label` on the button that owns it |

### 7.3 Key Icon Mapping

The names below are what the code actually imports. The draft's table was wrong in
five rows: `RotateCcw` / `Star` / `CheckCircle` / `XCircle` / `Settings` are not
used, and `CheckCircle` / `XCircle` are deprecated aliases in `lucide-react` 0.460
that will break on a future upgrade — the live code uses `CheckCircle2`.

| Context        | Lucide name        | Where                                                  |
|----------------|--------------------|--------------------------------------------------------|
| Dashboard      | `LayoutDashboard`  | Navbar, MobileNav                                      |
| Lessons        | `BookOpen`         | Navbar, MobileNav, `icons.jsx` (`reading`)             |
| Practice       | `Repeat`           | Navbar, MobileNav                                      |
| Exams          | `Award`            | Navbar, MobileNav                                     |
| Writing Lab    | `PenTool`          | Navbar, MobileNav, `icons.jsx` (`writing`)             |
| Profile        | `User`             | Navbar, MobileNav                                      |
| Streak         | `Flame`            | Navbar metric, `icons.jsx` (`streak`)                  |
| XP             | `Zap`              | Navbar metric (not `Star`; `Star` is only a review rating on Landing) |
| Lives          | `Heart`            | LessonPlayer, filled with `fill-error` when spent      |
| Correct        | `Check` / `CheckCircle2` | Option disc / banners                           |
| Incorrect      | `X`                | Option disc, modal close, empty input                  |
| Hint           | `Lightbulb`        | FillBlank                                              |
| Locked         | `Lock`             | Lessons list                                           |
| Audio          | `Volume2` / `VolumeX` | `AudioControls`, LessonPlayer sound toggle        |
| Slow audio     | `Turtle`           | `AudioControls`, ExamPlayer                            |
| Flip           | `RotateCw`         | FlashCard keyboard control                             |
| Loading        | `Loader2`          | Button `loading` (spin is a CSS keyframe, so it is also reduced-motion safe) |
| Language       | `Globe`            | `Logo` mark                                            |
| Search / filter| `Search` / `Filter`| Lessons toolbar                                        |

### 7.4 No emoji, and one flag system

Emoji are not icons. They render differently on every OS, cannot be recoloured to
the palette, cannot take a consistent stroke weight, and §1.2 rejects them as
tonally wrong. The app used them in three places — the navbar logo, the language
switcher, and the category/goal icons in `data/categories.js`, `utils/xp.js`,
`pages/Onboarding.jsx` and `pages/Profile.jsx` — and all three are gone:

- **`<Logo>`** is the single brand mark, a `Globe` glyph on a `brand-500→600` tile
  with a `text-brand-600` wordmark. The marketing page and the navbar used to ship
  two different logos.
- **`<Flag>`** draws the country marks as inline SVG (§5.2), because flag emoji do
  not exist on Windows at all — the language menu rendered bare two-letter codes
  for every Windows visitor.
- **`<SemanticIcon name="…" />`** (`src/components/brand/icons.jsx`) is the registry
  that data files point at by name. Data stays JSX-free; components resolve the
  name here; an unknown name renders nothing rather than crashing. Add a semantic
  key to `ICONS`, never inline-import an icon into a data file.

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

Re-measured against the tokens actually emitted by `src/styles/index.css`
(2026-11). The draft's table was optimistic: white on `brand-600` is **3.77:1**,
not 4.6:1, which is why every interactive fill moved to `brand-700`.

| Pair                                                       | Ratio  | Pass?        |
|------------------------------------------------------------|--------|--------------|
| `ink-900` on `surface-bg`                                  | 15.2:1 | ✅ AAA       |
| `ink-700` on `surface-bg`                                  | 7.7:1  | ✅ AAA       |
| `ink-500` on `surface-card` (placeholder, captions)        | 4.8:1  | ✅ AA        |
| White on `brand-700` (primary fill)                        | 5.48:1 | ✅ AA        |
| White on `brand-600`                                       | 3.77:1 | ❌ small text — fill tier moved to -700 |
| `brand-700` on `brand-50` (badge, tint)                    | 5.21:1 | ✅ AA        |
| `brand-600` on `brand-50`                                  | 3.58:1 | ❌ small text — badge tier moved to -700 |
| White on `error`                                           | 4.5:1  | ✅ AA        |
| `brand-600` focus ring on `surface-bg`                     | 3.60:1 | ✅ non-text 3:1 |
| `brand-400` focus ring on `surface-bg`                     | 1.83:1 | ❌ non-text — ring moved to -600 |
| `brand-700→600` progress fill on `ink-200` track           | 4.00–4.12:1 | ✅ non-text |
| `brand-600→500` progress fill on `ink-200` track           | 1.9:1  | ❌ non-text — light end capped at -600 |

The pattern in the failures: a `-600` that passes as a *large* label or a
*border* fails as *small* text on a tint, and any `-400` fails as a focus
indicator. Hence the two-tier rule in §5.1.

### 8.3 Keyboard Navigation

```
Tab        → Move focus forward through interactive elements
Shift+Tab  → Move focus backward
Enter      → Activate focused button/link
Space      → Toggle focused checkbox/option/chip
Escape     → Close modal/dropdown
Arrow keys → Navigate within radio groups, tab rails (SegmentedControl), menus
Home/End   → Jump to the first/last tab in a rail
```

Arrow-key support is not optional on a tab rail: `role="tablist"` promises it to
assistive technology, so the kit implements it and pages inherit it rather than
discovering the gap in a screen-reader pass. Modals trap focus and restore it to
the opener.

### 8.4 Screen Reader Considerations

- Use semantic HTML elements (`<nav>`, `<main>`, `<section>`, `<article>`, `<button>`)
- Add `aria-label` to icon-only buttons — enforced by a dev warning in `Button`
- Use `aria-live="polite"` for dynamic feedback (correct/incorrect answers)
- Use `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuetext`
- Mark decorative images with `aria-hidden="true"` or empty `alt=""`
- Never use `title=` as the only description: it is unreachable on touch, and
  when it differs from the accessible name it breaks WCAG 2.5.3 for speech-input
  users. The repo is now `title`-free except on `Modal`, where it is a prop name.
- A heading is required per view: every route renders exactly one visible-or-
  `sr-only` `h1`, including the compact quiz and exam headers, which had none.
- Content that is only *painted* away (a flashcard's back face) needs
  `aria-hidden` **and** `inert`, so it is neither announced nor tabbable.

---

## 9. Responsive Design Patterns

### 9.1 Navigation

| Breakpoint  | Navigation Pattern                                                     |
|-------------|------------------------------------------------------------------------|
| < `md`      | Top bar with a hamburger opening a left drawer (`#mobile-nav-drawer`), focus-trapped and Escape-closable, `aria-expanded` + `aria-controls` on the trigger |
| ≥ `md`      | Top bar (64px, sticky, `surface-card/90` + blur) with all five destinations inline, XP · streak · avatar right-aligned |
| Dashboard / Profile | Same top bar plus a right rail that stacks below the primary column under `lg` |

The draft's bottom tab bar and persistent 240px left sidebar were never built;
see §4.4 for why the top bar plus right rail is the shipped model. The active
destination is `text-brand-700` with a `layoutId` underline in `brand-600`
(non-text UI, 3.7:1 against the bar), and `NavLink` supplies
`aria-current="page"` — so the current location survives both a screen-reader
pass and a greyscale screenshot.

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
> Dark mode is out of scope for MVP, but the precondition the draft claimed is
> now actually true: every colour in the app resolves through a CSS custom
> property triplet in `src/styles/index.css` (`rgb(var(--brand-600) /
> <alpha-value>)`), so a dark pass is a token swap rather than a component edit.
> Raw hex is gone from `className` strings, and `bg-white` has been replaced by
> `bg-surface-card` everywhere, which is the swap that would otherwise have been
> missed.

> [!WARNING]
> **The swap is not free, and "brand accents remain unchanged" is wrong as
> written.** Contrast is a *pair* property: `brand-700` on `brand-50` clears
> 5.21:1 on cream and will not clear the same ratio on a dark surface. Every
> `-700`/`-strong` small-text tier in §5.1 has to be re-measured against the new
> surfaces before dark mode ships, and the focus ring in particular has to be
> re-checked (it currently needs 3:1 against `surface-bg`). Treat this section as
> an architecture note, not a plan.

Planned dark mode surface tokens:
- `--surface-bg`: `#1C1917` (warm dark instead of cream)
- `--surface-card`: `#292524` (elevated dark surface)
- `--ink-900`: `#FAFAF9` (cream white) — note the ink scale inverts *with* the
  surface, which is why components reference `ink-700`, never `#57534E`
- Brand accents keep their hue but shift one tier lighter for text use.

---

## 11. Dead code: `src/components/dashboard/`

Five components — `DailyGoal.jsx`, `LessonCard.jsx`, `StreakCounter.jsx`,
`WeeklyChart.jsx`, `XPProgress.jsx` — have no importers. `Dashboard.jsx` draws its
own weekly bars, streak chip and goal ring through the `ui/` kit, so this folder is
a parallel implementation of the same page, written before the kit existed.

They were **repaired in place rather than deleted**: the hex fills are now tokens,
the non-existent `text-ink-600` is gone, the flame's `repeat: Infinity` loop is
gated on `useReducedMotion()`, and their animations still name the old curve
literal instead of importing `transitionEase` (§6.3) — the one thing left un-fixed,
along with `XPProgress`'s `w-[18px] h-[18px]`. Deleting tracked files needs an
explicit owner decision, and this pass was about the design contract, not the file
list. If they are confirmed dead, removing the folder is safe: the count-up and
pulse of §6.4 exist nowhere else, and nothing else can see them.

Everything in this document describes the code that actually ships. Sections 2–9
were re-checked against the components in November 2026; where the draft and the
implementation disagreed, the section now says which one moved and why.

---

*This design system is the single source of truth for all visual decisions in LinguaFlow. Every component, color, and animation should reference this document.*
