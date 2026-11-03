/**
 * @file FillBlank.jsx
 * @description Fill-in-the-blank exercise with hint support and forgiving character checking.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Lightbulb, ArrowRight } from 'lucide-react';

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
      <span className="text-xs font-semibold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-pill inline-block mb-3">
        Fill in the missing word
      </span>

      {/* Sentence display */}
      <div className="bg-white rounded-card p-6 border border-ink-200/80 shadow-soft-sm mb-6">
        <p className="font-display font-medium text-2xl sm:text-3xl text-ink-900 leading-relaxed mb-2">
          {parts[0]}
          <span className="inline-block border-b-2 border-brand-500 font-bold px-2 mx-1 text-brand-700 min-w-[60px] text-center">
            {submitted ? answer : inputVal || '_____'}
          </span>
          {parts[1]}
        </p>
        {translation && (
          <p className="text-sm text-ink-500 italic mt-2">
            "{translation}"
          </p>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2 justify-center max-w-sm mx-auto">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={submitted || disabled}
            placeholder="Type your answer..."
            autoFocus
            className={`flex-1 px-4 py-3 rounded-button border-2 text-center font-medium text-lg transition-all focus:outline-none ${
              submitted
                ? isMatch
                  ? 'border-green-500 bg-green-50 text-green-900'
                  : 'border-red-500 bg-red-50 text-red-900'
                : 'border-ink-300 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20'
            }`}
          />

          {!submitted && (
            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="bg-brand-600 hover:bg-brand-700 disabled:bg-ink-200 disabled:text-ink-400 text-white font-semibold px-5 rounded-button shadow-soft-sm transition-all active:scale-95"
            >
              Check
            </button>
          )}
        </div>

        {/* Hint toggle */}
        {!submitted && hint && (
          <div>
            <button
              type="button"
              onClick={() => setShowHint((s) => !s)}
              className="inline-flex items-center gap-1.5 text-xs text-amber-700 hover:text-amber-800 font-medium bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-pill transition-colors"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              {showHint ? `Hint: ${hint}` : 'Need a hint?'}
            </button>
          </div>
        )}

        {/* Feedback message */}
        {submitted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-4 rounded-card border max-w-sm mx-auto text-left flex items-center gap-3 ${
              isMatch
                ? 'bg-green-50 border-green-200 text-green-900'
                : 'bg-red-50 border-red-200 text-red-900'
            }`}
          >
            {isMatch ? (
              <Check className="w-6 h-6 text-green-600 flex-shrink-0" />
            ) : (
              <X className="w-6 h-6 text-red-600 flex-shrink-0" />
            )}
            <div>
              <p className="font-bold text-sm">
                {isMatch ? 'Exactly right!' : 'Not quite right'}
              </p>
              {!isMatch && (
                <p className="text-xs mt-0.5">
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

