/**
 * @file FlashCard.jsx
 * @description 3D interactive flashcard with front/back flip, audio pronunciation, and example usage.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Turtle, RotateCw, CheckCircle2 } from 'lucide-react';
import { useUser } from '../../context/UserContext';

const transitionEase = [0.16, 1, 0.3, 1];

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
  const { speech } = useUser();

  const handleSpeak = (e) => {
    e.stopPropagation();
    if (speech?.speak) {
      speech.speak(word, langCode);
    }
  };

  const handleSpeakSlow = (e) => {
    e.stopPropagation();
    if (speech?.speakSlow) {
      speech.speakSlow(word, langCode);
    }
  };

  const handleFlip = () => {
    setFlipped((prev) => !prev);
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-md mx-auto w-full">
      <p className="text-sm font-medium text-ink-500 mb-3 flex items-center gap-1.5">
        <RotateCw className="w-4 h-4 text-brand-600 animate-spin-reverse" />
        Tap card to flip & reveal translation
      </p>

      {/* 3D Card Container */}
      <div
        className="relative w-full h-80 cursor-pointer select-none perspective-1000"
        onClick={handleFlip}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleFlip();
          }
        }}
        aria-label={`Flashcard for ${word}. Click to flip.`}
      >
        <motion.div
          className="w-full h-full relative"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.5, ease: transitionEase }}
        >
          {/* ── Front Face ── */}
          <div
            className="absolute inset-0 bg-white rounded-card p-8 border-2 border-brand-200/80 shadow-soft-lg flex flex-col justify-between items-center text-center backface-hidden"
          >
            <div className="w-full flex justify-between items-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-1 rounded-pill">
                Target Word
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleSpeak}
                  className="w-9 h-9 rounded-full bg-brand-50 text-brand-700 hover:bg-brand-100 flex items-center justify-center transition-colors"
                  title="Normal speed audio"
                  aria-label="Normal speed audio"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleSpeakSlow}
                  className="w-9 h-9 rounded-full bg-amber-50 text-amber-700 hover:bg-amber-100 flex items-center justify-center transition-colors"
                  title="Turtle mode (slow 0.65x speed)"
                  aria-label="Turtle mode slow speed audio"
                >
                  <Turtle className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="my-auto">
              <h2 className="font-display font-bold text-4xl text-ink-900 mb-2 tracking-tight">
                {word}
              </h2>
              {pronunciation && (
                <p className="text-sm text-ink-500 font-medium">/{pronunciation}/</p>
              )}
            </div>

            <p className="text-xs text-ink-400">Click anywhere to flip</p>
          </div>

          {/* ── Back Face ── */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-brand-50/80 to-white rounded-card p-8 border-2 border-brand-300 shadow-soft-lg flex flex-col justify-between items-center text-center backface-hidden"
            style={{ transform: 'rotateY(180deg)' }}
          >
            <div className="w-full flex justify-between items-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-pill">
                Meaning
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleSpeak}
                  className="w-9 h-9 rounded-full bg-brand-50 text-brand-700 hover:bg-brand-100 flex items-center justify-center transition-colors"
                  title="Normal speed audio"
                  aria-label="Normal speed audio"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleSpeakSlow}
                  className="w-9 h-9 rounded-full bg-amber-50 text-amber-700 hover:bg-amber-100 flex items-center justify-center transition-colors"
                  title="Turtle mode (slow 0.65x speed)"
                  aria-label="Turtle mode slow speed audio"
                >
                  <Turtle className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="my-auto">
              <p className="text-xs text-ink-400 font-semibold uppercase tracking-wide mb-1">
                Translation
              </p>
              <h2 className="font-display font-bold text-3xl text-brand-800 mb-4">
                {translation}
              </h2>

              {example && (
                <div className="bg-white/80 border border-brand-100 rounded-xl p-3 max-w-xs mx-auto text-left">
                  <p className="text-xs font-semibold text-ink-700">"{example}"</p>
                  {exampleTranslation && (
                    <p className="text-xs text-ink-500 italic mt-0.5">
                      {exampleTranslation}
                    </p>
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onComplete) onComplete(true);
              }}
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm px-6 py-2.5 rounded-pill shadow-soft-sm hover:shadow-glow-brand transition-all active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" /> Got it! Continue
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

