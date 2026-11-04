/**
 * @file MatchPairs.jsx
 * @description Interactive vocabulary matching game. Connect source words with
 * target translations.
 *
 * Design notes:
 * - Both columns previously repeated the same 4-branch class string verbatim.
 *   It is one `tileClasses()` helper now, which is also how the off-palette
 *   states got fixed in one pass instead of two.
 * - Validation colours come from `success-*` / `error-*`; the idle text colour
 *   was `text-ink-800`, which does not exist in the token set (ink is
 *   50/100/200/300/400/500/700/900) and so silently inherited the parent colour.
 * - A matched tile no longer relies on green: it carries a Check glyph and the
 *   `aria-pressed` state, so the information survives greyscale and colour
 *   blindness (WCAG 1.4.1).
 * - Matching and mismatches are announced through a polite live region.
 * - The shuffle was `sort(() => Math.random() - 0.5)`, which is measurably
 *   biased toward leaving items near their original index. It is a Fisher-Yates
 *   now.
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, CheckCircle2 } from 'lucide-react';
import { shakeX, transitionEase } from '../../utils/motion';
import { Badge } from '../ui';

/* One state machine, shared by both columns. */
function tileClasses({ isMatched, isWrong, isSelected }) {
  if (isMatched) {
    return 'border-success bg-success-bg text-success-strong cursor-default';
  }
  if (isWrong) {
    return 'border-error bg-error-bg text-error-strong shadow-soft-sm';
  }
  if (isSelected) {
    return 'border-brand-700 bg-brand-50 text-ink-900 shadow-glow-brand';
  }
  return 'border-ink-200 bg-surface-card hover:border-brand-600 hover:bg-brand-50 text-ink-900 shadow-soft-sm';
}

/** Unbiased shuffle — each item is equally likely to land in any slot. */
function shuffle(list) {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

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
  const [announcement, setAnnouncement] = useState('');

  // Initialize and shuffle columns on mount
  useEffect(() => {
    const leftList = pairs.map((p, i) => ({ id: i, text: p.left }));
    const rightList = pairs.map((p, i) => ({ id: i, text: p.right }));

    setLeftItems(shuffle(leftList));
    setRightItems(shuffle(rightList));
    setMatchedIds(new Set());
  }, [pairs]);

  // Check match whenever both are selected
  useEffect(() => {
    if (selectedLeft !== null && selectedRight !== null) {
      if (selectedLeft === selectedRight) {
        setAnnouncement('Pair matched.');
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
        setAnnouncement('No match, try again.');
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
        <Badge variant="brand" uppercase size="md" className="mb-2">
          Tap matching pairs
        </Badge>
        <h2 className="font-display font-bold text-display-md text-ink-900">{prompt}</h2>
      </div>

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>

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
                animate={isWrong ? { x: shakeX } : {}}
                transition={{ duration: 0.3, ease: transitionEase }}
                aria-pressed={isSelected}
                className={`w-full p-4 min-h-11 rounded-card border-2 text-center font-medium transition-colors duration-200 select-none flex items-center justify-center gap-2 text-body-md ${tileClasses(
                  { isMatched, isWrong, isSelected },
                )}`}
              >
                {isMatched && <Check size={16} strokeWidth={3} aria-hidden="true" />}
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
                animate={isWrong ? { x: shakeX } : {}}
                transition={{ duration: 0.3, ease: transitionEase }}
                aria-pressed={isSelected}
                className={`w-full p-4 min-h-11 rounded-card border-2 text-center font-medium transition-colors duration-200 select-none flex items-center justify-center gap-2 text-body-md ${tileClasses(
                  { isMatched, isWrong, isSelected },
                )}`}
              >
                {isMatched && <Check size={16} strokeWidth={3} aria-hidden="true" />}
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
          transition={{ duration: 0.2, ease: transitionEase }}
          role="status"
          className="p-3 bg-success-bg border border-success-border rounded-card flex items-center justify-center gap-2 text-success-strong font-semibold text-body-md"
        >
          <CheckCircle2 className="w-5 h-5 text-success-strong" aria-hidden="true" />
          All pairs matched
        </motion.div>
      )}
    </div>
  );
}

