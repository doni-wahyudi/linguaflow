/**
 * @file MultipleChoice.jsx
 * @description Multiple choice quiz exercise with animated selection and
 * instant feedback.
 *
 * Migrated onto the design system:
 * - The prompt chip was a hand-rolled `text-brand-600 bg-brand-50` span, and the
 *   same recipe was repeated in FillBlank, MatchPairs and ExerciseRenderer. It is
 *   now the kit `Badge variant="brand"`, which measures brand-700 on brand-50
 *   (5.21:1). The old pair measured 3.58:1 — a fail at 12px.
 * - Correct / wrong came from raw `green-*` and `red-*`. The design system
 *   reserves `success-*` / `error-*` for validation messaging, and those are the
 *   tiers measured against their own `-bg` tints (5.21:1 and 5.91:1). White on
 *   green-500 was 2.69:1, which is why the tick chip moved to `bg-success`
 *   (3.77:1 — legal, because the glyph is an icon and the meaning is carried by
 *   its shape as much as its colour).
 * - The answer letters sat at `text-ink-400` (2.41:1). They are text, so they
 *   use ink-500 (4.59:1).
 * - Feedback is now announced: the options form a labelled group and the
 *   explanation is a live region, so a screen reader hears the result instead of
 *   having to notice a colour change.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, HelpCircle } from 'lucide-react';
import { shakeX, transitionEase } from '../../utils/motion';
import { Badge, FuriganaText } from '../ui';

export default function MultipleChoice({
  question,
  options = [],
  correctIndex,
  explanation,
  onAnswer,
  disabled = false,
  showFurigana = true,
  showRomaji = false,
}) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (idx) => {
    if (submitted || disabled) return;
    setSelectedIndex(idx);
    setSubmitted(true);
    const isCorrect = idx === correctIndex;
    if (onAnswer) {
      onAnswer(isCorrect);
    }
  };

  const isRight = submitted && selectedIndex === correctIndex;

  return (
    <div className="max-w-xl mx-auto w-full">
      {/* Question prompt */}
      <div className="text-center mb-8">
        <Badge variant="brand" uppercase size="md" className="mb-3">
          Select the correct answer
        </Badge>
        <h2 className="font-display font-bold text-display-md text-ink-900 leading-snug">
          {typeof question === 'string' && question.includes('[') ? (
            <FuriganaText text={question} showFurigana={showFurigana} showRomaji={showRomaji} />
          ) : (
            question
          )}
        </h2>
      </div>

      {/* Options grid */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6"
        role="group"
        aria-label={`Answer options for: ${question}`}
      >
        {options.map((option, idx) => {
          const isSelected = selectedIndex === idx;
          const isCorrect = idx === correctIndex;

          let btnStyles =
            'border-2 border-ink-200 bg-surface-card text-ink-900 hover:border-brand-600 hover:bg-brand-50';

          if (submitted) {
            if (isCorrect) {
              btnStyles =
                'border-2 border-success bg-success-bg text-success-strong font-semibold shadow-soft-sm';
            } else if (isSelected && !isCorrect) {
              btnStyles = 'border-2 border-error bg-error-bg text-error-strong';
            } else {
              btnStyles = 'border border-ink-200 bg-surface-100 text-ink-500 opacity-60';
            }
          }

          return (
            <motion.button
              key={idx}
              type="button"
              disabled={submitted || disabled}
              onClick={() => handleSelect(idx)}
              whileHover={!submitted ? { y: -2 } : {}}
              whileTap={!submitted ? { scale: 0.98 } : {}}
              animate={submitted && isSelected && !isCorrect ? { x: shakeX } : {}}
              transition={{ duration: 0.3, ease: transitionEase }}
              aria-pressed={isSelected}
              className={`p-4 rounded-card text-left transition-colors duration-200 flex items-center justify-between gap-3 group ${btnStyles}`}
            >
              <span className="font-body text-body-md">{option}</span>

              {/* Indicator: decorative once the live region below states the
                  outcome, so AT is not told "check mark A". */}
              <span
                aria-hidden="true"
                className={`w-6 h-6 rounded-pill flex items-center justify-center shrink-0 transition-colors ${
                  submitted && isCorrect
                    ? 'bg-success text-white'
                    : submitted && isSelected && !isCorrect
                      ? 'bg-error text-white'
                      : 'border-2 border-ink-300 group-hover:border-brand-600 text-transparent'
                }`}
              >
                {submitted && isCorrect ? (
                  <Check size={14} strokeWidth={3} />
                ) : submitted && isSelected && !isCorrect ? (
                  <X size={14} strokeWidth={3} />
                ) : (
                  <span className="text-caption font-bold text-ink-500 group-hover:text-brand-700">
                    {String.fromCharCode(65 + idx)}
                  </span>
                )}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Explanation Banner */}
      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: transitionEase }}
          role="status"
          aria-live="polite"
          className={`p-4 rounded-card border flex items-start gap-3 ${
            isRight
              ? 'bg-success-bg border-success-border text-success-strong'
              : 'bg-warning-bg border-warning-border text-warning-strong'
          }`}
        >
          {isRight ? (
            <Check className="w-5 h-5 flex-shrink-0 mt-0.5" aria-hidden="true" />
          ) : (
            <HelpCircle className="w-5 h-5 flex-shrink-0 mt-0.5" aria-hidden="true" />
          )}
          <div>
            <p className="font-semibold mb-0.5 text-body-md">
              {isRight ? 'Correct' : 'Learning note'}
            </p>
            {explanation && (
              <p className="text-body-sm leading-relaxed text-ink-700">{explanation}</p>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}

