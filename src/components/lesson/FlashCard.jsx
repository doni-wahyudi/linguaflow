/**
 * @file FlashCard.jsx
 * @description 3D interactive flashcard with front/back flip, audio
 * pronunciation, and example usage.
 *
 * Design notes:
 * - The card used to be a `<div role="button" tabIndex={0}>` that CONTAINED
 *   three real buttons. Nested interactive controls are the one pattern screen
 *   readers reliably get wrong — the reader announces a button whose children are
 *   also buttons, and keyboard users cannot predict what Space does. Flipping now
 *   has its own explicit button; the card surface still flips on click for
 *   pointer users, but it is not in the tab order.
 * - The audio controls appeared twice, byte-for-byte, so they are one component.
 * - Both audio buttons were 36px; the kit target floor is 44px (§4 touch targets).
 * - Chips use the kit Badge, sizes use the type scale, and the continue CTA is a
 *   kit Button (brand-700, because white on brand-600 measures 3.77:1).
 * - The flip is a `rotateY` transform, so MotionConfig's reduced-motion handling
 *   covers it; the card switches faces without animating.
 */

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2, RotateCw } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { AudioControls, Badge, Button } from '../ui';
import { transitionEase } from '../../utils/motion';

export default function FlashCard({
  word,
  translation,
  pronunciation,
  example,
  exampleTranslation,
  langCode = 'es',
  onComplete,
}) {
  const [flipped, setFlipped] = useState(false);
  const reduceMotion = useReducedMotion();
  const { speech } = useUser();

  const handleFlip = () => {
    setFlipped((prev) => !prev);
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-md mx-auto w-full">
      {/* 3D Card Container */}
      <div
        className="relative w-full h-80 cursor-pointer select-none perspective-1000"
        onClick={handleFlip}
      >
        <motion.div
          className="w-full h-full relative"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={
            reduceMotion ? { duration: 0 } : { duration: 0.5, ease: transitionEase }
          }
        >
          {/* ── Front Face ──
              `backface-visibility` hides the face from paint only, so without the
              matching aria-hidden a screen reader read the word and its meaning
              together and gave away the answer (WCAG 1.3.1). */}
          <div
            aria-hidden={flipped}
            inert={flipped ? '' : undefined}
            className="absolute inset-0 bg-surface-card rounded-card p-6 sm:p-8 border-2 border-brand-200 shadow-soft-lg flex flex-col justify-between items-center text-center backface-hidden"
          >
            <div className="w-full flex justify-between items-center gap-2">
              <Badge variant="brand" uppercase>
                Target word
              </Badge>
              <AudioControls text={word} lang={langCode} speech={speech} stopPropagation />
            </div>

            <div className="my-auto">
              <h2 className="font-display font-bold text-display-md text-ink-900 mb-2">
                {word}
              </h2>
              {pronunciation && (
                <p className="text-body-sm text-ink-500 font-medium">/{pronunciation}/</p>
              )}
            </div>

            <p className="text-caption text-ink-500">Click the card to flip</p>
          </div>

          {/* ── Back Face ──
              `inert` (empty string, not `true`, so React 18 omits it when the face
              is showing) removes the hidden side from the tab order as well as the
              accessibility tree — aria-hidden alone would leave its audio and
              "Got it" buttons focusable but invisible, which is worse for keyboard
              users than announcing both faces. */}
          <div
            aria-hidden={!flipped}
            inert={!flipped ? '' : undefined}
            className="absolute inset-0 bg-gradient-to-br from-brand-50 to-surface-card rounded-card p-6 sm:p-8 border-2 border-brand-200 shadow-soft-lg flex flex-col justify-between items-center text-center backface-hidden"
            style={{ transform: 'rotateY(180deg)' }}
          >
            <div className="w-full flex justify-between items-center gap-2">
              <Badge variant="amber" uppercase>
                Meaning
              </Badge>
              <AudioControls text={word} lang={langCode} speech={speech} stopPropagation />
            </div>

            <div className="my-auto">
              <p className="text-overline uppercase text-ink-700 mb-1">Translation</p>
              <h2 className="font-display font-bold text-display-sm text-brand-800 mb-4">
                {translation}
              </h2>

              {example && (
                <div className="bg-surface-card border border-brand-200 rounded-card p-3 max-w-xs mx-auto text-left">
                  <p className="text-body-sm font-semibold text-ink-900">“{example}”</p>
                  {exampleTranslation && (
                    <p className="text-caption text-ink-500 italic mt-0.5">{exampleTranslation}</p>
                  )}
                </div>
              )}
            </div>

            <Button
              type="button"
              shape="pill"
              icon={CheckCircle2}
              onClick={(e) => {
                e.stopPropagation();
                if (onComplete) onComplete(true);
              }}
            >
              Got it · Continue
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Keyboard path for the flip. The card itself is a click target, but a
          control that is only reachable by mouse is not a control. */}
      <button
        type="button"
        onClick={handleFlip}
        aria-expanded={flipped}
        className="inline-flex items-center gap-1.5 mt-4 min-h-11 px-4 rounded-pill text-body-sm font-semibold text-brand-700 hover:bg-brand-50 transition-colors"
      >
        <RotateCw className="w-4 h-4" aria-hidden="true" />
        {flipped ? 'Show the word again' : 'Flip to reveal the meaning'}
      </button>
    </div>
  );
}

