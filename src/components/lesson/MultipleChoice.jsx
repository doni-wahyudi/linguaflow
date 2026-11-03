/**
 * @file MultipleChoice.jsx
 * @description Multiple choice quiz exercise component with animated selection & instant feedback.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, HelpCircle, ArrowRight } from 'lucide-react';

export default function MultipleChoice({
  question,
  options = [],
  correctIndex,
  explanation,
  onAnswer,
  disabled = false,
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

  return (
    <div className="max-w-xl mx-auto w-full">
      {/* Question prompt */}
      <div className="text-center mb-8">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-pill inline-block mb-3">
          Select the correct answer
        </span>
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-ink-900 leading-snug">
          {question}
        </h2>
      </div>

      {/* Options grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
        {options.map((option, idx) => {
          const isSelected = selectedIndex === idx;
          const isCorrect = idx === correctIndex;

          let btnStyles =
            'border-2 border-ink-200 bg-white text-ink-900 hover:border-brand-500 hover:bg-brand-50/30';

          if (submitted) {
            if (isCorrect) {
              btnStyles = 'border-2 border-green-500 bg-green-50 text-green-900 font-semibold shadow-soft-sm';
            } else if (isSelected && !isCorrect) {
              btnStyles = 'border-2 border-red-500 bg-red-50 text-red-900';
            } else {
              btnStyles = 'border border-ink-200 bg-ink-50/50 text-ink-400 opacity-60';
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
              animate={
                submitted && isSelected && !isCorrect
                  ? { x: [0, -6, 6, -4, 4, 0] }
                  : {}
              }
              transition={{ duration: 0.3 }}
              className={`p-4 rounded-card text-left transition-all duration-200 flex items-center justify-between group ${btnStyles}`}
            >
              <span className="font-medium text-base">{option}</span>

              {/* Indicator icons */}
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                  submitted && isCorrect
                    ? 'bg-green-500 text-white'
                    : submitted && isSelected && !isCorrect
                    ? 'bg-red-500 text-white'
                    : 'border-2 border-ink-300 group-hover:border-brand-500 text-transparent'
                }`}
              >
                {submitted && isCorrect ? (
                  <Check size={14} strokeWidth={3} />
                ) : submitted && isSelected && !isCorrect ? (
                  <X size={14} strokeWidth={3} />
                ) : (
                  <span className="text-xs font-bold text-ink-400 group-hover:text-brand-600">
                    {String.fromCharCode(65 + idx)}
                  </span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Explanation Banner */}
      {submitted && explanation && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-card border text-sm flex items-start gap-3 ${
            selectedIndex === correctIndex
              ? 'bg-green-50 border-green-200 text-green-900'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}
        >
          <HelpCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold mb-0.5">
              {selectedIndex === correctIndex ? 'Great job!' : 'Learning Note'}
            </p>
            <p className="text-xs opacity-90 leading-relaxed">{explanation}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

