# LinguaFlow — Frontend Design Review

> **Version**: 1.0
> **Date**: 2026-11-04
> **Scope**: Whole frontend (all 11 routes), evaluated against `docs/02-DESIGN-SYSTEM.md` v1.0
> **Verdict**: **Needs fixes** — 2 blockers, 12 must-fix contract violations, 4 accessibility failures measured on the rendered app

---

## 1. What this project is

LinguaFlow is a client-only, gamified language-learning SPA.

| Layer | Choice |
|---|---|
| Framework | React 18 + Vite 6, `HashRouter`, deployed to GitHub Pages under `/linguaflow/` |
| Styling | Tailwind CSS 3 with an extended theme (`tailwind.config.js`) + one global CSS file |
| Motion | Framer Motion 11 (page transitions, micro-interactions, celebrations) |
| Icons | Lucide React |
| Persistence | `localStorage` only (`linguaflow_` prefix) — no backend, no auth, no accounts |
| Content | 4 languages (ES/JA/FR/DE), CEFR + JLPT curricula, 4 exercise types, spaced repetition, XP/level/streak, mock exams, handwriting lab |

The design intent is coherent and well-argued: warm cream surfaces, emerald = growth, amber = achievement, coral = streak, deliberately avoiding the purple "AI app" cliché. That foundation is good. The problems are in execution and, above all, **adoption**.

---

## 2. Evidence and confidence

**Reference used:** `docs/02-DESIGN-SYSTEM.md` (v1.0, treated as the approved contract). No Figma frames, mockups, or baseline screenshots exist in the repo, so this is **contract conformance + visual review**, not pixel alignment.

**Implementation captured:** dev server on `localhost:5199` in real Chromium on Windows.

- Landing page: viewport capture + full-page capture (504 px wide — the in-app browser pane could not be widened)
- Dashboard: rendered at true 1440 px via a same-origin iframe harness, plus computed-style measurements
- Practice / Exams / Writing Lab / Lessons / Profile: DOM + computed-style audits per route
- Static analysis: import graph, token usage, raw-element counts

**Confidence:** High on tokens, typography, component adoption, accessibility, and assets (all backed by measurements). Medium on desktop spacing rhythm for pages other than Dashboard, because only Dashboard was captured at 1440 px. No repo files were modified during this review; `package-lock.json` was restored after `npm install`.

---

## 3. Blockers

### B1 — Emoji flags render as bare letter pairs on Windows and Android

`Landing.jsx` uses flag emoji as the primary language visual, in the hero row and in all four language cards. Flag emoji are Unicode regional-indicator pairs, and **Microsoft and older Android do not ship flag glyphs** — they fall back to the two-letter code.

Measured on this machine (Windows, Chromium):

- Hero row renders `ES JP FR DE` instead of four flags
- Dashboard greeting renders `Good evening, QA Tester! ES`
- Lessons header renders `ES Spanish Curriculum`

The language cards — the section whose entire job is "choose your path" — become four white boxes with two letters in them. This is not a polish issue; on the world's most common desktop OS the marketing page and the app header both look broken.

It also violates the contract: §7.1 designates Lucide as the icon system, and §1.2 lists *Childish* as an explicit anti-pattern.

**Fix:** replace flag emoji with real SVG flag assets (or a `<LanguageBadge>` that pairs a Lucide icon with the language code), and add a `<Logo>` component so the brand mark is defined once. There are 12 flag references and 49 emoji-glyph occurrences across 13 files, including `data/categories.js` and `data/languages.js` where emoji are used as category icons (🌱 👋  🍽️) — the 🔢 keycap in particular renders as an inconsistent, near-illegible block at small sizes.

### B2 — The design system exists but is not consumed

This is the root cause of almost everything below.

```
Pages importing Button / Card / Badge / Input / ProgressBar / Modal:   0
Components imported by any page:                                      Confetti only (2 uses)
components/dashboard/* referenced outside their own file:             0  (all 5 orphaned)
Raw <button> elements across pages + feature components:              ~93
```

`src/components/ui/` is a well-built kit — `Button` has four variants, three sizes, loading state, `aria-busy`; `Modal` has a real focus trap and focus restore; `Input` wires `aria-describedby` and `aria-invalid`; `ProgressBar` has correct `role="progressbar"` semantics. Then the pages ignore it and re-derive styling inline.

Consequences that are already visible:

- `Badge`, `Input`, `Modal` and all five dashboard widgets are dead code.
- `ExamPlayer.jsx` (851 lines) hand-rolls two modals with raw `<div>`s, so it has **no focus trap and no focus restore** — a regression against the `Modal` that ships in the same repo.
- Hover, focus-visible, disabled and active states diverge per page, because each page defines them separately.
- The five orphaned widgets (`DailyGoal`, `StreakCounter`, `WeeklyChart`, `XPProgress`, `LessonCard`) are exactly the components the Dashboard re-implements inline.

**Fix:** treat adoption as the work item, not the individual pixel diffs. Migrate the highest-traffic surfaces first — Dashboard hero + lesson grid, LessonPlayer option buttons, ExamPlayer modals — onto the existing kit, then delete or wire up the orphaned widgets.

---

## 4. Must fix

### M1 — Typography scale is defined correctly and then misapplied

Measured on the rendered Dashboard at 1440 px:

| | Spec (§3.2) | Actual |
|---|---|---|
| Page H1 | 48 px, weight **800**, line-height **1.1**, tracking −0.025em | **36 px, weight 700, line-height 1.2, tracking −0.54px** |
| Section H2 | 36 px / 700 | 24 px |

The app's page titles use `text-display-md` — the token the config maps to spec H3/H4 — where the scale calls for `display-lg`/`display-xl`. The result is a flattened hierarchy: headings sit close to body weight and the H1 loses its authority. The fluid scale itself is good; it is just being read one or two steps low.

Also: `tailwind.config.js` defines a fourth tier (`display-xl`, up to 4rem) that §3.2 never sanctions, and `body-lg` uses line-height 1.7 against the spec's 1.6.

### M2 — Buttons do not match their own specification

Spec §5.1 defines three sizes with per-size height, padding and radius. `Button.jsx` uses one radius for all sizes and different padding:

| Size | Spec | Actual |
|---|---|---|
| sm | 32 h / 12 px pad / **8 px radius** | ~30 h / 12 px pad / **12 px radius** |
| md | 40 h / 16 px pad / **10 px radius** | 44 h / 20 px pad / **12 px radius** |
| lg | 48 h / 24 px pad / **12 px radius** | ~50 h / 28 px pad / **12 px radius** |

Disabled state uses a solid `bg-brand-300` instead of the specified `opacity: 0.5`, which reads as a different component rather than a disabled one.

### M3 — Two competing CTA shapes

`Button` uses `rounded-button` (12 px). The primary actions in `Landing.jsx` and the Dashboard hero pill are hand-written links using `rounded-pill` (9999 px) with one-off padding (`px-8 py-4`, `px-10 py-4`).

Measured: the Dashboard "Start Lesson" button is `border-radius: 9999px`, height 44 px. So the app's single most important action appears in two different shapes depending on where you are. Pill CTAs are a reasonable brand choice — but it should be one choice, expressed as a `Button` variant.

### M4 — Card surface drifts from spec

Spec §5.2: `border: 1px solid #E7E5E4`, hover `translateY(-2px)` + three-layer shadow.

Actual: `border-ink-200/50` — 50 % alpha over the cream page composites to roughly `#F3F2F0`, so the documented border is effectively invisible and cards rest entirely on a light shadow. The hover lift exists only on the `interactive` variant, and its shadow is an inline literal string (`'0 4px 8px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.08)'`) that duplicates `shadow-soft-lg` instead of using it.

### M5 — Two focus systems, neither matching spec

`styles/index.css` sets a global `*:focus-visible { outline: 2px solid #059669 }`, while `Button` also applies `focus-visible:ring-2 ring-brand-500/40 ring-offset-2`. Spec §5.1 asks for a `brand-400` ring. Three different colors, and the 40 %-alpha ring is decorative at best. Keyboard users get a doubled indicator whose appearance depends on which component they happen to be on.

Pick one system. The global rule is the right one to keep; strip the per-component rings.

### M6 — Progress bars contradict their definition

Spec §5.4: 12 px height, `#E7E5E4` track, fill gradient `brand-600 → brand-500`.

Actual: heights 6 / 10 / 16 px, track `bg-ink-100` (`#F5F5F4`, ~2 shades lighter than specified), fill `from-brand-500 to-brand-400` — both lighter than spec and in the reverse direction. Progress is the app's core visual metaphor, and it is rendering weaker than designed.

### M7 — Three names for one hue family

`brand-*` **is** Tailwind's emerald scale. The codebase nonetheless uses `emerald-*` (7+ distinct steps) and `green-*` (6+ steps) alongside `brand-*`, across 13 files including `Badge.jsx` itself. `Badge`'s `success` variant is `bg-green-50 text-green-700` where §5.5 specifies `success-bg #ECFDF5` with `brand-800` text.

This means "is this the brand color or a semantic success color?" is unanswerable from the code, and a future palette change or dark-mode pass will not reach these sites. `Badge` is also missing the `coral` and `info` variants §5.5 defines.

### M8 — Off-palette and off-token values

- `surface-100` / `surface-200` (§2.2) were never added to `tailwind.config.js`; pages substitute `ink-100`/`ink-200`, which are cool-neutral (`#F5F5F4`, `#E7E5E4`) rather than the warm cream-neutrals the spec chose (`#F5F5F0`, `#EDEDE8`). The warm/cool undertone is exactly what §1.2 says the brand is built on.
- `#FAF9F5` appears three times — a transposition of `#FAFAF7`, i.e. a typo'd background that is now load-bearing in `ExamPlayer` and `WritingCanvas`.
- `WritingCanvas.jsx` draws its ruling lines in `#E5E7EB`, `#F3F4F6`, `#CBD5E1` — Tailwind gray and slate, blue-based neutrals, on a deliberately warm surface.
- `Confetti.jsx` hardcodes `#8B5CF6` (purple) and `#EC4899` (pink) despite §1.3 explicitly rejecting purple.
- 18 × `text-[11px]` and 5 × `text-[10px]` arbitrary sizes bypass the type scale entirely; §3.2 sets 12 px as the floor.

### M9 — Reduced motion is not actually honoured

`index.css` has the correct `@media (prefers-reduced-motion: reduce)` block, and §6.5 pairs it with the Framer Motion `useReducedMotion` hook. **`useReducedMotion` appears zero times in `src/`.**

CSS media queries cannot interrupt JavaScript-driven animation. So the two `repeat: Infinity` loops — the floating hero flags and the pulsing streak flame — keep animating for users who have asked for no motion, as do all `whileInView` reveals and page transitions. §6.1 principle 3 ("Accessibility first") is unmet.

### M10 — Measured contrast failures

| Site | Pair | Size | Ratio | Needs |
|---|---|---|---|---|
| Dashboard hero subtitle (measured) | `brand-100` on `brand-600→700` gradient | 14 px | **3.32 : 1** at the light end | 4.5 |
| Landing stats labels | `brand-200` on `brand-600` | 14 px | **2.94 : 1** | 4.5 |
| MobileNav inactive tabs | `ink-400` on white | 11 px | **2.31 : 1** | 4.5 |
| Landing hero "Beautifully" | `text-gradient-brand` (`brand-600→500`) on cream | display | **~2.4 : 1** at the light end | 3.0 |

The first three were read from computed styles; the fourth is computed from token values. The `ink-400` mobile-nav case is the worst: the bottom tab bar is the *only* navigation on phones, and its inactive labels are both sub-spec size and effectively invisible to low-vision users. `§8.2` lists `text-tertiary #A8A29E` as being for placeholders and disabled text — it should never be carrying live navigation.

`text-gradient-brand` is itself an undocumented utility: §2 never authorizes gradient text, and gradient fills make contrast unpredictable because it varies across the word.

### M11 — Layout architecture diverges from the documented structure

§4.4 and §9.1 specify a persistent 240 px left sidebar on desktop, a collapsible sidebar on tablet, and a 4-tab bottom bar (Dashboard / Lessons / Practice / Profile) at 56 px.

The app ships a top navbar with inline links plus a right-hand rail, no sidebar at any breakpoint, and a 6-tab bottom bar at 64 px. The navigation model itself has grown past the document — five primary destinations now, with "Official Exams" and "Writing Lab" absent from the spec entirely.

To be fair: the top-navbar-plus-rail pattern is arguably the *better* choice for this content, and 6 tabs at 320 px still clears the 44 px tap-target minimum. This is a **needs-design-decision**, not a defect — but the contract and the product must be reconciled, because right now the document describes an app that does not exist.

### M12 — §10's dark-mode readiness claim is false

§10 states "All colors are referenced via CSS custom properties (design tokens), making a dark mode pass a matter of swapping token values without touching component code."

There are no CSS custom properties anywhere in the project. Colors live in `tailwind.config.js`, in ~40 inline hex literals, and in duplicated `emerald`/`green`/`brand` names. A dark-mode pass would be a full-codebase refactor, not a token swap. The claim should be removed or the token layer built.

---

## 5. Should fix

**Reveal-on-scroll leaves content invisible.** Every below-fold landing section starts at `opacity: 0` and depends on an IntersectionObserver firing. The full-page capture shows "How It Works", "Languages Available", the stats band and the final CTA as blank cream — the stats band renders as an empty green rectangle. Scrolling does reveal them correctly (verified: 0 invisible nodes after scroll), so real users are mostly fine, but this breaks print, PDF export, crawler snapshots, and any environment where the observer is late. Add a fallback that reveals content if the observer never fires.

**"See How It Works" has no affordance.** It is `text-ink-500` with no border, underline, or control semantics — it reads as body copy, not a link.

**The "This Week" chart has no empty state.** With zero activity the bars are invisible and the card shows a large blank region above seven tiny day labels. The rolling 7-day window also starts mid-week (measured: `Thu Fri Sat Sun Mon Tue Wed`), which is confusing for a habit-tracking visual.

**The Daily Goal card renders two unlabeled progress tracks.** At 1440 px they appear as two long empty pills with no captions, which reads as a layout bug rather than a goal indicator.

**Modal radius.** §5.6 specifies 20 px; `Modal.jsx` uses `rounded-card` (16 px).

**DESIGN.md scope.** The document is v1.0 "Finalized for MVP" and predates Exams, the Writing Lab, and the CEFR/JLPT tiering. Roughly a third of the app has no design contract at all, which is why those pages drifted furthest (Exams: 18 sub-12px text nodes and 10 contrast-flagged nodes; Writing Lab: 31 raw buttons).

---

## 6. Polish

- Hero has a large dead vertical band between the flag row and the "Why LinguaFlow" section at narrow widths.
- `text-label` already carries 0.08em tracking; `tracking-widest` is stacked on top of it in the Landing eyebrows, applying letter-spacing twice.
- `index.html` loads Inter 700 and Plus Jakarta Sans 400/500 — weights §3.1 does not use, costing font payload for styles the system forbids.
- Arbitrary one-off sizes: `w-[60px]`, `h-[300px]`, `w-[28px]`.
- `Landing` card hover lifts 4 px; §6.4 specifies 2 px.

---

## 7. What is genuinely good

Worth stating plainly, because it should be preserved through any remediation:

The palette rationale is real reasoning, not decoration — emerald for growth, amber for achievement, coral for streaks, and a deliberate rejection of the purple AI cliché. The warm-cream page surface against white cards is the right call for long study sessions. The fluid `clamp()` type scale and the layered soft shadows are well-constructed. Motion easing is consistent (`[0.16, 1, 0.3, 1]` throughout) and durations sit inside §6.2.

Most importantly, **the `ui/` kit is accessible by construction** — correct ARIA on `ProgressBar`, `aria-describedby`/`aria-invalid` wiring on `Input`, a genuine focus trap with focus restore in `Modal`, `aria-busy` on `Button`, `aria-label` on every icon-only control in `Navbar`, and `prefers-reduced-motion` in the stylesheet. The engineering taste is present. The failure is purely that the pages never call it.

---

## 8. Recommended order of work

1. **Kill the emoji assets** (B1) — replace flags and category emoji with SVG/Lucide, add a shared `<Logo>`. Highest user-visible impact, smallest diff.
2. **Fix the four contrast failures** (M10) — `ink-500` minimum for mobile-nav labels, `brand-50`/white for text on emerald surfaces, drop `text-gradient-brand` from headings.
3. **Wire `useReducedMotion`** (M9) into the two infinite loops and the page/section reveals.
4. **Migrate Dashboard + LessonPlayer + ExamPlayer onto the `ui/` kit** (B2), and reconcile the spec's button/card/progress values with what the design actually wants in one pass.
5. **Unify neutrals** (M7, M8) — delete `emerald-*`/`green-*` in favour of `brand-*`, add `surface-100`/`surface-200`, replace cool grays with warm `ink`, remove the `#FAF9F5` typo.
6. **Correct the type scale application** (M1) and button geometry (M2, M3).
7. **Reconcile §4.4/§9.1 with the shipped navigation, and rewrite §10** (M11, M12) — either restore the sidebar decision or update the document to bless the top-navbar model and extend it to Exams and Writing Lab.

Steps 1–3 are small, independent, and fix things users can see today. Step 4 is the structural one that stops the remaining drift from recurring.

---

## 9. Verification checklist

- [ ] Landing + Dashboard + Lessons captured on Windows Chromium show no regional-indicator letter fallbacks
- [ ] `grep -r "from '.*components/ui" src/pages` returns matches for Dashboard, Lessons, LessonPlayer, Practice, Exams, ExamPlayer, Writing, Profile
- [ ] `grep -rn "useReducedMotion" src` returns non-zero; hero float and streak pulse halt under reduced-motion emulation
- [ ] Measured contrast ≥ 4.5:1 for mobile-nav inactive labels, hero subtitle, landing stats labels
- [ ] Page H1 computes to 48 px / 800 / 1.1 at 1440 px
- [ ] `grep -rEoh "(emerald|green)-[0-9]+" src` returns 0 matches
- [ ] `grep -rn "#FAF9F5" src` returns 0 matches
- [ ] ExamPlayer dialogs trap focus and restore it on close (keyboard-only test)
- [ ] `components/dashboard/*` are either imported or deleted — no orphans remain
- [ ] `docs/02-DESIGN-SYSTEM.md` updated for Exams, Writing Lab, and the actual navigation model

---

## 10. Artifacts

| Item | Location |
|---|---|
| Design contract evaluated | `docs/02-DESIGN-SYSTEM.md` |
| Theme definition | `tailwind.config.js` |
| Global tokens / base styles | `src/styles/index.css` |
| Unconsumed component kit | `src/components/ui/`, `src/components/dashboard/` |
| Desktop capture (1440 px, Dashboard) | `%TEMP%\qoder-cli\lf_dash_1440.png` |
| Landing captures (504 px, viewport + full page) | in-session browser capture |

*No approved visual reference (Figma frame or baseline screenshot) exists for this project, so no pixel-diff verdict is possible or claimed. All findings above rest on the written contract plus measurements taken from the rendered application.*
