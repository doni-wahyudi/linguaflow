/**
 * @file FillBlank.jsx
 * @description Fill-in-the-blank exercise with hint support and forgiving
 * character checking.
 *
 * Migrated onto the kit: the prompt chip is a Badge, the sentence is a Card, the
 * field is an Input (which previously had no accessible name at all — a
 * placeholder is not a label, WCAG 3.3.2), the submit is a Button, and the
 * verdict is a live region. Validation colours come from `success-*` / `error-*`
 * rather than raw `green-*` / `red-*`.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Lightbulb } from 'lucide-react';
import { transitionEase } from '../../utils/motion';
import { Badge, Card, Input, Button } from '../ui';

export default function FillBlank({
  sentence,
  answer,
  hint,
  translation,
  onAnswer,
  disabled = false,
}) {
  const [inputVal, setInputVal] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Normalize string for gentle comparison (remove punctuation, trim, lowercase)
  const clean = (str) =>
    (str || '')
      .toLowerCase()
      .trim()
      .replace(/[.,/#!$%^&*;:{}=\-_`~()?¿¡!]/g, '');

  const isMatch = clean(inputVal) === clean(answer);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (submitted || disabled || !inputVal.trim()) return;
    setSubmitted(true);
    if (onAnswer) {
      onAnswer(isMatch);
    }
  };

  // Replace '___' with highlight representation
  const parts = (sentence || '').split('___');

  return (
    <div className="max-w-xl mx-auto w-full text-center">
      <Badge variant="brand" uppercase size="md" className="mb-3">
        Fill in the missing word
      </Badge>

      {/* Sentence display */}
      <Card padding="md" className="mb-6">
        <p className="font-display font-medium text-display-sm sm:text-display-md text-ink-900 leading-relaxed mb-2">
          {parts[0]}
          <span className="inline-block border-b-2 border-brand-600 font-bold px-2 mx-1 text-brand-700 min-w-16 text-center">
            {submitted ? answer : inputVal || '_____'}
          </span>
          {parts[1]}
        </p>
        {translation && (
          <p className="text-body-sm text-ink-500 italic mt-2">“{translation}”</p>
        )}
      </Card>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2 justify-center items-start max-w-sm mx-auto">
          <Input
            className="flex-1 min-w-0 text-left"
            srOnlyLabel={`Type the missing word for: ${sentence || 'this sentence'}`}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={submitted || disabled}
            success={submitted && isMatch}
            invalid={submitted && !isMatch}
            placeholder="Type your answer…"
            size="lg"
            autoFocus
          />

          {!submitted && (
            <Button type="submit" size="lg" disabled={!inputVal.trim()} className="mt-0 shrink-0">
              Check
            </Button>
          )}
        </div>

        {/* Hint toggle */}
        {!submitted && hint && (
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={() => setShowHint((s) => !s)}
              aria-expanded={showHint}
              className="inline-flex items-center gap-1.5 text-caption text-amber-700 hover:text-amber-800 font-semibold bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-pill transition-colors min-h-9"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
              Need a hint?
            </button>
            {showHint && (
              <p className="text-body-sm text-ink-700 bg-warning-bg border border-warning-border rounded-card px-3 py-1.5 max-w-sm">
                {hint}
              </p>
            )}
          </div>
        )}

        {/* Feedback message */}
        {submitted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, ease: transitionEase }}
            role="status"
            aria-live="polite"
            className={`p-4 rounded-card border max-w-sm mx-auto text-left flex items-center gap-3 ${
              isMatch
                ? 'bg-success-bg border-success-border text-success-strong'
                : 'bg-error-bg border-error-border text-error-strong'
            }`}
          >
            {isMatch ? (
              <Check className="w-6 h-6 text-success-strong flex-shrink-0" aria-hidden="true" />
            ) : (
              <X className="w-6 h-6 text-error-strong flex-shrink-0" aria-hidden="true" />
            )}
            <div>
              <p className="font-bold text-body-md">
                {isMatch ? 'Exactly right' : 'Not quite right'}
              </p>
              {!isMatch && (
                <p className="text-body-sm mt-0.5 text-ink-700">
                  The correct answer was: <strong className="underline">{answer}</strong>
                </p>
              )}
            </div>
          </motion.div>
        )}
      </form>
    </div>
  );
}

