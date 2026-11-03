/**
 * @file MatchPairs.jsx
 * @description Interactive vocabulary matching game. Connect source words with target translations.
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, CheckCircle2 } from 'lucide-react';

export default function MatchPairs({
  prompt = 'Match the pairs',
  pairs = [],
  onComplete,
  disabled = false,
}) {
  const [leftItems, setLeftItems] = useState([]);
  const [rightItems, setRightItems] = useState([]);

  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);

  const [matchedIds, setMatchedIds] = useState(new Set());
  const [wrongPair, setWrongPair] = useState(null);

  // Initialize and shuffle columns on mount
  useEffect(() => {
    const leftList = pairs.map((p, i) => ({ id: i, text: p.left }));
    const rightList = pairs.map((p, i) => ({ id: i, text: p.right }));

    // Shuffle both independently
    setLeftItems([...leftList].sort(() => Math.random() - 0.5));
    setRightItems([...rightList].sort(() => Math.random() - 0.5));
    setMatchedIds(new Set());
  }, [pairs]);

  // Check match whenever both are selected
  useEffect(() => {
    if (selectedLeft !== null && selectedRight !== null) {
      if (selectedLeft === selectedRight) {
        // Correct match!
        setMatchedIds((prev) => {
          const next = new Set(prev);
          next.add(selectedLeft);
          if (next.size === pairs.length && onComplete) {
            setTimeout(() => onComplete(true), 400);
          }
          return next;
        });
        setSelectedLeft(null);
        setSelectedRight(null);
      } else {
        // Mismatch!
        setWrongPair({ left: selectedLeft, right: selectedRight });
        const timer = setTimeout(() => {
          setWrongPair(null);
          setSelectedLeft(null);
          setSelectedRight(null);
        }, 600);
        return () => clearTimeout(timer);
      }
    }
  }, [selectedLeft, selectedRight, pairs.length, onComplete]);

  const allCompleted = matchedIds.size === pairs.length && pairs.length > 0;

  return (
    <div className="max-w-xl mx-auto w-full">
      <div className="text-center mb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-pill inline-block mb-2">
          Tap matching pairs
        </span>
        <h2 className="font-display font-bold text-2xl text-ink-900">{prompt}</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-6">
        {/* Left Column */}
        <div className="space-y-3">
          {leftItems.map((item) => {
            const isMatched = matchedIds.has(item.id);
            const isSelected = selectedLeft === item.id;
            const isWrong = wrongPair?.left === item.id;

            return (
              <motion.button
                key={`left-${item.id}`}
                type="button"
                disabled={isMatched || disabled}
                onClick={() => setSelectedLeft(item.id)}
                whileTap={!isMatched ? { scale: 0.98 } : {}}
                animate={isWrong ? { x: [-4, 4, -4, 4, 0] } : {}}
                className={`w-full p-4 rounded-card border-2 text-center font-medium transition-all duration-200 select-none ${
                  isMatched
                    ? 'border-green-300 bg-green-50/60 text-green-700 opacity-50 cursor-default line-through'
                    : isWrong
                    ? 'border-red-500 bg-red-50 text-red-900 shadow-soft-sm'
                    : isSelected
                    ? 'border-brand-600 bg-brand-50 text-brand-900 shadow-glow-brand ring-2 ring-brand-500/20'
                    : 'border-ink-200 bg-white hover:border-brand-400 hover:bg-brand-50/20 text-ink-800 shadow-soft-sm'
                }`}
              >
                {item.text}
              </motion.button>
            );
          })}
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          {rightItems.map((item) => {
            const isMatched = matchedIds.has(item.id);
            const isSelected = selectedRight === item.id;
            const isWrong = wrongPair?.right === item.id;

            return (
              <motion.button
                key={`right-${item.id}`}
                type="button"
                disabled={isMatched || disabled}
                onClick={() => setSelectedRight(item.id)}
                whileTap={!isMatched ? { scale: 0.98 } : {}}
                animate={isWrong ? { x: [-4, 4, -4, 4, 0] } : {}}
                className={`w-full p-4 rounded-card border-2 text-center font-medium transition-all duration-200 select-none ${
                  isMatched
                    ? 'border-green-300 bg-green-50/60 text-green-700 opacity-50 cursor-default line-through'
                    : isWrong
                    ? 'border-red-500 bg-red-50 text-red-900 shadow-soft-sm'
                    : isSelected
                    ? 'border-brand-600 bg-brand-50 text-brand-900 shadow-glow-brand ring-2 ring-brand-500/20'
                    : 'border-ink-200 bg-white hover:border-brand-400 hover:bg-brand-50/20 text-ink-800 shadow-soft-sm'
                }`}
              >
                {item.text}
              </motion.button>
            );
          })}
        </div>
      </div>

      {allCompleted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-green-50 border border-green-200 rounded-card flex items-center justify-center gap-2 text-green-800 font-medium text-sm"
        >
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          All pairs matched correctly!
        </motion.div>
      )}
    </div>
  );
}

