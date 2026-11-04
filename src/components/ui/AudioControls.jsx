/**
 * @file AudioControls.jsx
 * @description The normal / turtle (0.65x) playback pair used wherever a word or
 * phrase can be heard.
 *
 * Why this is in the kit: the pair appears on the SRS card, in the vocabulary
 * library, on the Writing Lab reference tile and in the custom tracing panel.
 * Each copy used to re-declare `h-11 w-11 rounded-pill text-brand-700 …`, which is
 * how the app ended up with audio buttons of three different sizes and two
 * different turtle-colour recipes.
 *
 * Design notes:
 * - 44x44 targets (WCAG 2.1 §2.5.5) — these are touch controls, mostly used with a
 *   stylus or a finger over a canvas.
 * - The pair is icon-only, so each button carries an `aria-label` naming the text
 *   being spoken. `title=` is deliberately absent: it is unreachable on touch, and
 *   where it differs from the accessible name it breaks WCAG 2.5.3 for
 *   speech-input users.
 * - Slow playback keeps the amber hue but the *icon* carries the meaning too, so
 *   the pair is still distinguishable in greyscale (WCAG 1.4.1).
 * - Idle and hover tones live in separate constant strings; two `bg-*` utilities in
 *   one class attribute resolve by stylesheet position, not by intent.
 */

import React from 'react';
import { Volume2, Turtle } from 'lucide-react';

const BTN_BASE =
  'inline-flex items-center justify-center shrink-0 h-11 w-11 rounded-pill transition-colors';
const BTN_NORMAL = `${BTN_BASE} text-brand-700 hover:bg-brand-100`;
const BTN_SLOW = `${BTN_BASE} text-amber-700 hover:bg-amber-100`;
const BTN_DISABLED = 'opacity-50 cursor-not-allowed';

/**
 * @param {object} props
 * @param {string} props.text - The word or phrase to speak.
 * @param {string} props.lang - Language id used for the voice (e.g. `ja`).
 * @param {object} [props.speech] - The `speech` value from `useUser()`; absent or
 *   unsupported leaves the pair disabled rather than silently dead.
 * @param {boolean} [props.stopPropagation=false] - Set when the pair sits inside a
 *   clickable card, so replaying a word does not also open it.
 * @param {string} [props.className]
 * @returns {JSX.Element}
 */
export default function AudioControls({
  text,
  lang,
  speech,
  stopPropagation = false,
  className = '',
}) {
  const phrase = typeof text === 'string' ? text.trim() : '';
  const canSpeak = Boolean(speech?.speak) && phrase.length > 0;

  const fire = (fn) => (e) => {
    if (stopPropagation) e.stopPropagation();
    if (canSpeak) fn(phrase);
  };

  return (
    <div className={`flex items-center gap-1.5 shrink-0 ${className}`}>
      <button
        type="button"
        disabled={!canSpeak}
        onClick={fire((value) => speech.speak(value, lang))}
        className={`${BTN_NORMAL} ${canSpeak ? '' : BTN_DISABLED}`}
        aria-label={`Play ${phrase || 'this'} at normal speed`}
      >
        <Volume2 className="w-5 h-5" aria-hidden="true" />
      </button>
      <button
        type="button"
        disabled={!canSpeak}
        onClick={fire((value) => speech.speakSlow?.(value, lang))}
        className={`${BTN_SLOW} ${canSpeak ? '' : BTN_DISABLED}`}
        aria-label={`Play ${phrase || 'this'} slowly`}
      >
        <Turtle className="w-5 h-5" aria-hidden="true" />
      </button>
    </div>
  );
}
