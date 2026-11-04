/**
 * @file Flag.jsx
 * @description Real SVG flag assets for the supported languages.
 *
 * Why not emoji: flag emoji are Unicode regional-indicator PAIRS, and Microsoft
 * (plus older Android) ship no flag glyphs — they fall back to the bare letter
 * code. On Windows `🇪🇸` renders as "ES", which broke the landing hero, the four
 * language cards, the dashboard greeting and the lessons header. SVG renders
 * identically everywhere, scales cleanly, and can carry an accessible name.
 *
 * Flag colours are intentionally the official national colours rather than
 * LinguaFlow tokens: a flag is editorial content, not UI chrome, and must not
 * be re-tinted by the theme.
 *
 * @example
 * <Flag code="es" className="w-6 h-6" />
 * <Flag code="ja" label="Japanese" size={32} />
 */

import React from 'react';

/** Official flag artwork, drawn on a 3:2 field. */
const FLAGS = {
  es: {
    name: 'Spain',
    svg: (
      <>
        <rect width="24" height="16" fill="#C60B1E" />
        <rect y="4" width="24" height="8" fill="#FFCD00" />
        {/* Simplified crest: a plain mark keeps legibility at small sizes. */}
        <rect x="4" y="5.5" width="3.5" height="5" fill="#C60B1E" opacity="0.85" />
      </>
    ),
  },
  ja: {
    name: 'Japan',
    svg: (
      <>
        <rect width="24" height="16" fill="#FFFFFF" />
        <circle cx="12" cy="8" r="4.6" fill="#BC002D" />
      </>
    ),
  },
  fr: {
    name: 'France',
    svg: (
      <>
        <rect width="8" height="16" fill="#002395" />
        <rect x="8" width="8" height="16" fill="#FFFFFF" />
        <rect x="16" width="8" height="16" fill="#ED2939" />
      </>
    ),
  },
  de: {
    name: 'Germany',
    svg: (
      <>
        <rect width="24" height="5.34" fill="#000000" />
        <rect y="5.34" width="24" height="5.33" fill="#DD0000" />
        <rect y="10.67" width="24" height="5.33" fill="#FFCE00" />
      </>
    ),
  },
};

export const flagCodes = Object.keys(FLAGS);

/**
 * @param {object} props
 * @param {string} props.code - Language id / ISO country code (case-insensitive).
 * @param {number} [props.size=24] - Rendered height in px; width follows 3:2.
 * @param {string} [props.className=''] - Extra classes (overrides `size` if it sets width/height).
 * @param {string} [props.label] - Accessible name. Defaults to the country name.
 * @param {boolean} [props.decorative=false] - Hide from assistive tech when a text label sits beside it.
 *
 * The baseline nudge lives here rather than at each call site. It is em-relative
 * (`-0.15em`), so it stays proportional as the surrounding text scales — a fixed
 * `-3px` did not. It is the one intentional arbitrary value in the component layer.
 */
export default function Flag({ code, size = 24, className = '', label, decorative = false, ...rest }) {
  const flag = FLAGS[String(code || '').toLowerCase()];
  if (!flag) return null;

  return (
    <svg
      viewBox="0 0 24 16"
      width={size * 1.5}
      height={size}
      role={decorative ? 'presentation' : 'img'}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : label || flag.name}
      focusable="false"
      className={`inline-block shrink-0 rounded-flag align-[-0.15em] ring-1 ring-ink-900/10 ${className}`}
      {...rest}
    >
      {flag.svg}
    </svg>
  );
}

Flag.displayName = 'Flag';
