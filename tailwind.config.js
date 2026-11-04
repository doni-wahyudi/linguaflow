/** @type {import('tailwindcss').Config} */

/*
 * Design tokens. Every color resolves to a CSS custom property declared in
 * src/styles/index.css, so a theme (e.g. dark mode) is a token swap in one
 * place rather than a codebase-wide find-and-replace. Values are stored as
 * space-separated RGB channels so Tailwind's opacity modifiers keep working.
 */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Primary — Brand Emerald: growth / learning (spec §2.4) */
        brand: {
          50: 'rgb(var(--brand-50) / <alpha-value>)',
          100: 'rgb(var(--brand-100) / <alpha-value>)',
          200: 'rgb(var(--brand-200) / <alpha-value>)',
          300: 'rgb(var(--brand-300) / <alpha-value>)',
          400: 'rgb(var(--brand-400) / <alpha-value>)',
          500: 'rgb(var(--brand-500) / <alpha-value>)',
          600: 'rgb(var(--brand-600) / <alpha-value>)',
          700: 'rgb(var(--brand-700) / <alpha-value>)',
          800: 'rgb(var(--brand-800) / <alpha-value>)',
          900: 'rgb(var(--brand-900) / <alpha-value>)',
        },
        /* Secondary — Achievement Amber: XP, achievements (spec §2.4) */
        amber: {
          50: 'rgb(var(--amber-50) / <alpha-value>)',
          100: 'rgb(var(--amber-100) / <alpha-value>)',
          200: 'rgb(var(--amber-200) / <alpha-value>)',
          300: 'rgb(var(--amber-300) / <alpha-value>)',
          400: 'rgb(var(--amber-400) / <alpha-value>)',
          500: 'rgb(var(--amber-500) / <alpha-value>)',
          600: 'rgb(var(--amber-600) / <alpha-value>)',
          700: 'rgb(var(--amber-700) / <alpha-value>)',
          800: 'rgb(var(--amber-800) / <alpha-value>)',
          900: 'rgb(var(--amber-900) / <alpha-value>)',
        },
        /* Tertiary — Streak Coral: energy, streaks (spec §2.4) */
        coral: {
          50: 'rgb(var(--coral-50) / <alpha-value>)',
          100: 'rgb(var(--coral-100) / <alpha-value>)',
          200: 'rgb(var(--coral-200) / <alpha-value>)',
          300: 'rgb(var(--coral-300) / <alpha-value>)',
          400: 'rgb(var(--coral-400) / <alpha-value>)',
          500: 'rgb(var(--coral-500) / <alpha-value>)',
          600: 'rgb(var(--coral-600) / <alpha-value>)',
          700: 'rgb(var(--coral-700) / <alpha-value>)',
          800: 'rgb(var(--coral-800) / <alpha-value>)',
          900: 'rgb(var(--coral-900) / <alpha-value>)',
        },
        /* Foundation surfaces — 60% of the 60-30-10 rule (spec §2.2) */
        surface: {
          bg: 'rgb(var(--surface-bg) / <alpha-value>)',
          50: 'rgb(var(--surface-50) / <alpha-value>)',
          100: 'rgb(var(--surface-100) / <alpha-value>)',
          200: 'rgb(var(--surface-200) / <alpha-value>)',
          card: 'rgb(var(--surface-card) / <alpha-value>)',
          elevated: 'rgb(var(--surface-elevated) / <alpha-value>)',
        },
        /* Warm ink neutrals — semantic map (spec §2.3):
             900 text-primary · 700 emphasized secondary · 500 text-secondary
             400 text-tertiary (placeholders + disabled ONLY)
             300 border-strong · 200 border-default · 100/50 quiet fills */
        ink: {
          900: 'rgb(var(--ink-900) / <alpha-value>)',
          700: 'rgb(var(--ink-700) / <alpha-value>)',
          500: 'rgb(var(--ink-500) / <alpha-value>)',
          400: 'rgb(var(--ink-400) / <alpha-value>)',
          300: 'rgb(var(--ink-300) / <alpha-value>)',
          200: 'rgb(var(--ink-200) / <alpha-value>)',
          100: 'rgb(var(--ink-100) / <alpha-value>)',
          50: 'rgb(var(--ink-50) / <alpha-value>)',
        },
        /* Semantic feedback states (spec §2.5). These are the ONLY sanctioned
           colors for correctness / validation messaging — do not reach for the
           raw green, red or emerald utility families.

           `strong` is the small-text tier. Contrast is measured against the cream
           page: `DEFAULT` as body text lands at 3.0–3.6:1 (AA-large only, or a
           fail), while `strong` lands at 4.8–6.4:1. So:
             bg-<state> / border-<state> / icon-<state>  -> DEFAULT is correct
             text-<state>-strong                         -> required for any label
           Badge.jsx and the button variants encode this; do not hand-pick. */
        success: {
          DEFAULT: 'rgb(var(--success) / <alpha-value>)',
          strong: 'rgb(var(--success-strong) / <alpha-value>)',
          bg: 'rgb(var(--success-bg) / <alpha-value>)',
          border: 'rgb(var(--success-border) / <alpha-value>)',
        },
        error: {
          DEFAULT: 'rgb(var(--error) / <alpha-value>)',
          strong: 'rgb(var(--error-strong) / <alpha-value>)',
          bg: 'rgb(var(--error-bg) / <alpha-value>)',
          border: 'rgb(var(--error-border) / <alpha-value>)',
        },
        warning: {
          DEFAULT: 'rgb(var(--warning) / <alpha-value>)',
          strong: 'rgb(var(--warning-strong) / <alpha-value>)',
          bg: 'rgb(var(--warning-bg) / <alpha-value>)',
          border: 'rgb(var(--warning-border) / <alpha-value>)',
        },
        info: {
          DEFAULT: 'rgb(var(--info) / <alpha-value>)',
          strong: 'rgb(var(--info-strong) / <alpha-value>)',
          bg: 'rgb(var(--info-bg) / <alpha-value>)',
          border: 'rgb(var(--info-border) / <alpha-value>)',
        },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      /* Type scale — spec §3.2.
         display-lg = H1 · display-md = H2 · display-sm = H3 · display-xs = H4.
         display-xl is the marketing-hero tier only (Landing); never for app page titles. */
      fontSize: {
        'display-xl': ['clamp(2.5rem, 1.75rem + 3.75vw, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.025em', fontWeight: '800' }],
        'display-lg': ['clamp(2rem, 5vw, 3rem)', { lineHeight: '1.1', letterSpacing: '-0.025em', fontWeight: '800' }],
        'display-md': ['clamp(1.5rem, 4vw, 2.25rem)', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-sm': ['clamp(1.25rem, 3vw, 1.75rem)', { lineHeight: '1.3', letterSpacing: '-0.015em', fontWeight: '700' }],
        'display-xs': ['clamp(1.1rem, 2.5vw, 1.375rem)', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6' }],
        'body-md': ['1rem', { lineHeight: '1.6' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.005em' }],
        'caption': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.01em', fontWeight: '500' }],
        'overline': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.05em', fontWeight: '600' }],
        /* `label` is the overline alias kept for existing call sites.
           It already carries tracking — never stack `tracking-*` on top of it. */
        'label': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.05em', fontWeight: '600' }],
      },
      /* Radius — spec §5. `button-sm/md/lg` are the per-size radii §5.1 requires. */
      borderRadius: {
        'card': '16px',
        'modal': '20px',
        'button': '12px',
        'button-sm': '8px',
        'button-md': '10px',
        'button-lg': '12px',
        'input': '10px',
        'pill': '9999px',
        /* §5.2 exception, now a token: the flag glyph is a 3:2 chip roughly 16–24px
           tall, where `button-sm` (8px) reads as a lozenge. It had no token, so every
           call site wrote `rounded-[3px]`. */
        'flag': '3px',
      },
      maxWidth: {
        /* Modal widths were `max-w-[480px]`…`max-w-[960px]` inline in Modal.jsx.
           Dialog measure is a design-system decision, so it is named here. */
        'modal-sm': '480px',
        'modal-md': '640px',
        'modal-lg': '800px',
        'modal-xl': '960px',
      },
      /* Stacking layers are named instead of written as `z-[60]`/`z-[100]`.
         Tailwind's built-in scale stops at 50, which is why the raw values
         appeared — the navbar drawer and the modal genuinely sit above it, and
         an unnamed `z-[70]` invites a `z-[75]` fight later. */
      zIndex: {
        'nav-overlay': '60',
        'nav-drawer': '70',
        modal: '100',
      },
      maxHeight: {
        /* A dialog that touches the viewport edge looks broken; 88vh is the
           measure the modal is designed to, so it is a token, not a magic number. */
        modal: '88vh',
      },
      boxShadow: {
        'soft-sm': '0 1px 2px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.06)',
        'soft-md': '0 2px 4px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.06)',
        'soft-lg': '0 4px 8px rgba(0, 0, 0, 0.04), 0 8px 24px rgba(0, 0, 0, 0.08)',
        'soft-xl': '0 8px 16px rgba(0, 0, 0, 0.04), 0 16px 40px rgba(0, 0, 0, 0.1)',
        'glow-brand': '0 0 20px rgba(5, 150, 105, 0.15), 0 0 40px rgba(5, 150, 105, 0.08)',
        'glow-amber': '0 0 20px rgba(245, 158, 11, 0.15), 0 0 40px rgba(245, 158, 11, 0.08)',
        /* Spec §5.2 three-layer card elevation: ambient occlusion + key light + diffuse.
           Cards use `card` / `card-hover` so hover depth is tokenised, not inline. */
        'card': '0 1px 2px rgba(0, 0, 0, 0.04), 0 4px 8px rgba(0, 0, 0, 0.04), 0 8px 16px rgba(0, 0, 0, 0.02)',
        'card-hover': '0 2px 4px rgba(0, 0, 0, 0.06), 0 8px 16px rgba(0, 0, 0, 0.06), 0 16px 32px rgba(0, 0, 0, 0.04)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slide-down 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fade-in 0.3s ease-out',
        'scale-in': 'scale-in 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'shake': 'shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
      },
      keyframes: {
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
        },
      },
    },
  },
  plugins: [
    /* FlashCard's 3D flip uses two properties Tailwind 3.4 ships no utility for.
       They were written as `perspective-1000` and `backface-hidden` in the
       className, produced nothing, and both faces stayed visible — so the
       mirrored back face painted over the front and every flashcard exercise
       showed reversed text before the learner had even flipped it. Silent
       utility typos are the reason these live in the config, not inline styles. */
    function flip3d({ addUtilities }) {
      addUtilities({
        '.perspective-1000': { perspective: '1000px' },
        '.backface-hidden': {
          '-webkit-backface-visibility': 'hidden',
          'backface-visibility': 'hidden',
        },
      });
    },
  ],
}
