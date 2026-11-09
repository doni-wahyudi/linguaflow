/**
 * @file SentenceBuilder.jsx
 * @description Interactive word-tile scramble exercise for syntax and sentence construction.
 * Reinforces Japanese SOV particle ordering and European SVO grammar patterns.
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Undo2, Check, Sparkles, AlertCircle, HelpCircle } from 'lucide-react';
import { Badge, Button, Card, FuriganaText } from '../ui';
import { playClick } from '../../utils/soundEffects';
import { transitionEase } from '../../utils/motion';

/**
 * Normalizes a sentence for robust comparison.
 * Removes whitespace in CJK/Japanese text, strips trailing punctuation.
 */
function normalizeSentence(str, langCode) {
  if (!str) return '';
  const clean = str.trim().replace(/[.。!！?？]+$/, '');
  if (langCode === 'ja') {
    return clean.replace(/\s+/g, '');
  }
  return clean.replace(/\s+/g, ' ');
}

export default function SentenceBuilder({
  exercise,
  langCode = 'es',
  onAnswer,
  disabled = false,
  showFurigana = true,
  showRomaji = false,
}) {
  const {
    prompt = 'Construct the correct sentence:',
    targetSentence = '',
    tokens = [],
    distractors = [],
    translation = '',
    explanation = '',
  } = exercise || {};

  // Build tile pool with unique internal IDs
  const initialPool = useMemo(() => {
    const rawList = [...tokens, ...(distractors || [])];
    // Deterministic or pseudorandom shuffle based on items
    const seeded = rawList.map((text, idx) => ({
      id: `tile-${idx}-${text}`,
      text,
    }));
    // Fisher-Yates shuffle
    const shuffled = [...seeded];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [tokens, distractors]);

  const [bankTiles, setBankTiles] = useState(initialPool);
  const [trayTiles, setTrayTiles] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  // Reset if exercise changes
  useEffect(() => {
    setBankTiles(initialPool);
    setTrayTiles([]);
    setSubmitted(false);
    setIsCorrect(null);
  }, [initialPool]);

  // Handle tile click from bank to tray
  const handleSelectTile = (tile) => {
    if (submitted || disabled) return;
    playClick();
    setBankTiles((prev) => prev.filter((t) => t.id !== tile.id));
    setTrayTiles((prev) => [...prev, tile]);
  };

  // Handle tile click from tray back to bank
  const handleRemoveTile = (tile) => {
    if (submitted || disabled) return;
    playClick();
    setTrayTiles((prev) => prev.filter((t) => t.id !== tile.id));
    setBankTiles((prev) => [...prev, tile]);
  };

  // Undo last placed tile
  const handleUndo = () => {
    if (submitted || disabled || trayTiles.length === 0) return;
    playClick();
    const lastTile = trayTiles[trayTiles.length - 1];
    setTrayTiles((prev) => prev.slice(0, -1));
    setBankTiles((prev) => [...prev, lastTile]);
  };

  // Reset entire tray
  const handleReset = () => {
    if (submitted || disabled || trayTiles.length === 0) return;
    playClick();
    setTrayTiles([]);
    setBankTiles(initialPool);
  };

  // Check constructed sentence
  const handleCheck = () => {
    if (submitted || disabled || trayTiles.length === 0) return;

    const separator = langCode === 'ja' ? '' : ' ';
    const constructed = trayTiles.map((t) => t.text).join(separator);
    const normConstructed = normalizeSentence(constructed, langCode);
    const normTarget = normalizeSentence(targetSentence, langCode);

    const match = normConstructed === normTarget;
    setIsCorrect(match);
    setSubmitted(true);

    if (onAnswer) {
      onAnswer(match);
    }
  };

  const isJapanese = langCode === 'ja';

  return (
    <div className="max-w-2xl mx-auto w-full">
      {/* Prompt Header */}
      <div className="text-center mb-6">
        <Badge variant="brand" uppercase size="md" className="mb-2">
          Sentence Builder
        </Badge>
        <h2 className="font-display font-bold text-display-sm text-ink-900 mb-1">
          {prompt}
        </h2>
        {translation && (
          <p className="text-body-md text-ink-600 font-medium">
            "{translation}"
          </p>
        )}
      </div>

      {/* Answer Construction Tray */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-caption font-semibold uppercase tracking-wider text-ink-500">
            Constructed Sentence
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleUndo}
              disabled={trayTiles.length === 0 || submitted || disabled}
              className="p-1.5 text-ink-500 hover:text-ink-900 disabled:opacity-30 disabled:pointer-events-none rounded-pill transition-colors"
              title="Undo last tile"
              aria-label="Undo last placed tile"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={trayTiles.length === 0 || submitted || disabled}
              className="p-1.5 text-ink-500 hover:text-ink-900 disabled:opacity-30 disabled:pointer-events-none rounded-pill transition-colors"
              title="Reset all tiles"
              aria-label="Reset all tiles"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          className={`min-h-[72px] p-3 rounded-card border-2 transition-all flex flex-wrap items-center gap-2 ${
            submitted
              ? isCorrect
                ? 'bg-success-bg border-success shadow-soft-sm'
                : 'bg-error-bg border-error shadow-soft-sm'
              : trayTiles.length === 0
              ? 'bg-surface-bg border-dashed border-ink-300'
              : 'bg-surface-card border-brand-300 shadow-soft-xs'
          }`}
          role="region"
          aria-label="Answer sentence construction tray"
        >
          {trayTiles.length === 0 ? (
            <p className="text-ink-400 text-body-sm italic mx-auto select-none">
              Tap tiles below in order to assemble the sentence
            </p>
          ) : (
            trayTiles.map((tile, idx) => (
              <motion.button
                key={tile.id}
                layout
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.15, ease: transitionEase }}
                type="button"
                onClick={() => handleRemoveTile(tile)}
                disabled={submitted || disabled}
                className={`px-3 py-1.5 rounded-pill font-medium text-body-md shadow-soft-xs transition-colors flex items-center gap-1 ${
                  submitted
                    ? isCorrect
                      ? 'bg-surface-card text-success-strong border border-success'
                      : 'bg-surface-card text-error-strong border border-error'
                    : 'bg-brand-50 hover:bg-brand-100 text-brand-900 border border-brand-200 cursor-pointer'
                }`}
                title="Click to remove tile"
              >
                <span>{tile.text}</span>
              </motion.button>
            ))
          )}
        </div>
      </div>

      {/* Available Word Tiles Bank */}
      <div className="mb-8">
        <span className="block text-caption font-semibold uppercase tracking-wider text-ink-500 mb-2.5 px-1">
          Available Word Tiles
        </span>
        <div
          className="flex flex-wrap gap-2.5 min-h-[56px] p-3 bg-surface-card rounded-card border border-ink-200"
          role="group"
          aria-label="Available word tiles"
        >
          {bankTiles.length === 0 ? (
            <p className="text-ink-400 text-caption italic py-1 px-2 select-none">
              All tiles placed in the sentence
            </p>
          ) : (
            bankTiles.map((tile) => (
              <motion.button
                key={tile.id}
                layout
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={() => handleSelectTile(tile)}
                disabled={submitted || disabled}
                className="px-3.5 py-2 rounded-pill font-medium text-body-md bg-surface-card hover:bg-brand-50 text-ink-900 border border-ink-300 hover:border-brand-500 shadow-soft-xs transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                {tile.text}
              </motion.button>
            ))
          )}
        </div>
      </div>

      {/* Check Answer CTA */}
      {!submitted && (
        <div className="text-center">
          <Button
            size="lg"
            shape="pill"
            icon={Check}
            onClick={handleCheck}
            disabled={trayTiles.length === 0 || disabled}
          >
            Check Sentence
          </Button>
        </div>
      )}

      {/* Feedback & Explanation Card */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: transitionEase }}
            className="mt-6"
          >
            <Card
              tone={isCorrect ? 'success' : 'error'}
              padding="md"
              className="border shadow-soft-sm"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-pill flex items-center justify-center shrink-0 ${
                    isCorrect ? 'bg-success text-white' : 'bg-error text-white'
                  }`}
                >
                  {isCorrect ? (
                    <Sparkles className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-display font-bold text-body-md mb-1">
                    {isCorrect ? 'Correct Sentence Structure!' : 'Grammar Ordering Error'}
                  </p>
                  {!isCorrect && (
                    <div className="text-body-sm text-ink-800 mb-2">
                      <span className="font-semibold text-ink-900">Target sentence: </span>
                      <span className="font-medium text-brand-700">{targetSentence}</span>
                    </div>
                  )}
                  {explanation && (
                    <p className="text-body-sm text-ink-700 leading-relaxed bg-surface-card/60 p-2.5 rounded-card border border-ink-200/60 mt-1">
                      {explanation}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
