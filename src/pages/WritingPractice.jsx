/**
 * @file WritingPractice.jsx
 * @description Dedicated Writing Lab optimized for tablets, styluses (Apple Pencil / S-Pen), and touch.
 * Features categorized character decks, custom text tracing mode, stroke count metrics,
 * pronunciation audio with slow Turtle mode (0.65x), and an interactive digital calligraphy canvas.
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PenTool,
  Volume2,
  Turtle,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Info,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Type,
  Layers,
  Sparkle,
} from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import { useUser } from '../context/UserContext';
import writingPrompts from '../data/writingPrompts';
import languages from '../data/languages';
import WritingCanvas from '../components/writing/WritingCanvas';

const transitionEase = [0.16, 1, 0.3, 1];

// Preset custom practice suggestions per language
const CUSTOM_SUGGESTIONS = {
  ja: [
    { text: 'ありがとう', label: 'Arigatou (Thank you)' },
    { text: 'さようなら', label: 'Sayounara (Goodbye)' },
    { text: '日本', label: 'Nihon (Japan)' },
    { text: '桜', label: 'Sakura (Cherry blossom)' },
    { text: '猫', label: 'Neko (Cat)' },
    { text: '東京', label: 'Toukyou (Tokyo)' },
  ],
  es: [
    { text: '¡Hola!', label: 'Hello!' },
    { text: 'Gracias', label: 'Thank you' },
    { text: 'Buenos días', label: 'Good morning' },
    { text: 'Amigo', label: 'Friend' },
    { text: 'Mañana', label: 'Tomorrow' },
    { text: 'Corazón', label: 'Heart' },
  ],
  fr: [
    { text: 'Bonjour', label: 'Hello' },
    { text: 'Merci', label: 'Thank you' },
    { text: 'Enchanté', label: 'Nice to meet you' },
    { text: 'Café', label: 'Coffee' },
    { text: 'Cœur', label: 'Heart' },
    { text: 'Liberté', label: 'Freedom' },
  ],
  de: [
    { text: 'Guten Tag', label: 'Good day' },
    { text: 'Danke', label: 'Thank you' },
    { text: 'Gemütlich', label: 'Cozy' },
    { text: 'Tschüss', label: 'Bye' },
    { text: 'Schön', label: 'Beautiful' },
    { text: 'Frühling', label: 'Spring' },
  ],
};

export default function WritingPractice() {
  const { user, speech, xp, streak } = useUser();
  const currentLang = user.selectedLanguage || 'es';
  const langData = languages.find((l) => l.id === currentLang);

  // Tab mode: 'curated' (character deck) or 'custom' (free text tracing)
  const [activeTabMode, setActiveTabMode] = useState('curated');

  // Custom tracing mode state
  const defaultCustomText = currentLang === 'ja' ? '桜' : currentLang === 'de' ? 'Schön' : currentLang === 'fr' ? 'Café' : 'Amigo';
  const [customText, setCustomText] = useState(defaultCustomText);
  const [customGrid, setCustomGrid] = useState(currentLang === 'ja' ? 'rice' : 'lined');

  // Get prompts for current language (fallback to Japanese if not found)
  const prompts = useMemo(() => {
    return writingPrompts[currentLang] || writingPrompts.es || [];
  }, [currentLang]);

  // Unique categories for this language
  const categories = useMemo(() => {
    const set = new Set(prompts.map((p) => p.category));
    return ['All', ...Array.from(set)];
  }, [prompts]);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedIds, setCompletedIds] = useState(new Set());

  // Filtered prompt list
  const filteredPrompts = useMemo(() => {
    if (selectedCategory === 'All') return prompts;
    return prompts.filter((p) => p.category === selectedCategory);
  }, [prompts, selectedCategory]);

  const activePrompt = filteredPrompts[currentIndex] || filteredPrompts[0];

  // Handle completion from canvas
  const handleCanvasComplete = (passed) => {
    if (passed) {
      xp.addXP(15);
      streak.recordActivity();
      if (activeTabMode === 'curated' && activePrompt) {
        setCompletedIds((prev) => new Set(prev).add(activePrompt.id));
      }
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < filteredPrompts.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      setCurrentIndex(0); // loop back
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };

  const currentSuggestions = CUSTOM_SUGGESTIONS[currentLang] || CUSTOM_SUGGESTIONS.es;

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto">
        {/* ── Page Header ── */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-display-md text-ink-900 flex items-center gap-2">
              <PenTool className="w-8 h-8 text-brand-600" />
              Handwriting & Calligraphy Lab
            </h1>
            <p className="text-body-md text-ink-500 mt-1">
              Practice drawing letters, accents, and characters in {langData?.name} {langData?.flag} with a stylus, Apple Pencil, or touch.
            </p>
          </div>

          {/* Mode Switcher Pill */}
          <div className="flex items-center gap-1 p-1 bg-ink-100 rounded-pill border border-ink-200 self-start md:self-auto shadow-inner-sm">
            <button
              type="button"
              onClick={() => setActiveTabMode('curated')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-pill text-xs font-semibold transition-all ${
                activeTabMode === 'curated'
                  ? 'bg-white text-brand-700 shadow-soft-sm'
                  : 'text-ink-600 hover:text-ink-900'
              }`}
            >
              <Layers size={14} /> Character Decks
            </button>
            <button
              type="button"
              onClick={() => setActiveTabMode('custom')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-pill text-xs font-semibold transition-all ${
                activeTabMode === 'custom'
                  ? 'bg-white text-brand-700 shadow-soft-sm'
                  : 'text-ink-600 hover:text-ink-900'
              }`}
            >
              <Type size={14} /> Custom Tracing
            </button>
          </div>
        </div>

        {/* ── MODE 1: Curated Character Decks ── */}
        {activeTabMode === 'curated' && (
          <div>
            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCurrentIndex(0);
                  }}
                  className={`px-3.5 py-1.5 rounded-pill text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? 'bg-brand-600 text-white shadow-soft-sm'
                      : 'bg-white border border-ink-200 text-ink-600 hover:border-brand-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Tablet Split Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Reference Character & Tips */}
              <div className="lg:col-span-5 space-y-4">
                {activePrompt && (
                  <div className="bg-white rounded-card p-6 border border-ink-200/80 shadow-soft-sm">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-semibold uppercase tracking-wider text-brand-700 bg-brand-50 px-2.5 py-1 rounded-pill">
                        {activePrompt.category}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {activePrompt.strokeCount && (
                          <span className="text-xs text-ink-500 font-medium">
                            {activePrompt.strokeCount} {activePrompt.strokeCount === 1 ? 'stroke' : 'strokes'}
                          </span>
                        )}
                        {completedIds.has(activePrompt.id) && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-pill">
                            <CheckCircle2 size={12} /> Mastered
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Big Reference Character with Normal & Slow Turtle Audio */}
                    <div className="text-center py-6 bg-gradient-to-br from-brand-50/50 to-amber-50/30 rounded-2xl border border-brand-100 mb-6 relative">
                      {/* Audio Controls (Normal & Slow) */}
                      <div className="absolute top-3 right-3 flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => speech?.speak(activePrompt.character, currentLang)}
                          className="p-2 rounded-full bg-white/90 hover:bg-white text-brand-700 shadow-soft-sm transition-all active:scale-95"
                          title="Normal pronunciation"
                          aria-label="Normal pronunciation audio"
                        >
                          <Volume2 size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => speech?.speakSlow(activePrompt.character, currentLang)}
                          className="p-2 rounded-full bg-amber-50/90 hover:bg-amber-100 text-amber-800 shadow-soft-sm transition-all active:scale-95"
                          title="Turtle mode (slow 0.65x pronunciation)"
                          aria-label="Turtle mode slow pronunciation audio"
                        >
                          <Turtle size={16} />
                        </button>
                      </div>

                      <h2
                        className="font-display font-bold text-ink-900 tracking-tight leading-none select-none"
                        style={{
                          fontSize: activePrompt.character.length > 3 ? '3.5rem' : '5.5rem',
                        }}
                      >
                        {activePrompt.character}
                      </h2>

                      <p className="font-display font-semibold text-lg text-brand-800 mt-3">
                        /{activePrompt.pronunciation}/
                      </p>
                      <p className="text-sm text-ink-500 mt-0.5">
                        {activePrompt.translation}
                      </p>
                    </div>

                    {/* Stroke Technique Tips */}
                    {activePrompt.tips && (
                      <div className="p-4 rounded-xl bg-ink-50/80 border border-ink-200/60 mb-6">
                        <p className="text-xs font-bold uppercase tracking-wider text-ink-700 flex items-center gap-1.5 mb-1.5">
                          <Info size={14} className="text-brand-600" /> Stroke Technique Tip
                        </p>
                        <p className="text-xs text-ink-600 leading-relaxed">
                          {activePrompt.tips}
                        </p>
                      </div>
                    )}

                    {/* Navigation Carousel controls */}
                    <div className="flex items-center justify-between pt-2 border-t border-ink-100">
                      <button
                        type="button"
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                        className="p-2 rounded-full border border-ink-200 text-ink-600 hover:bg-ink-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft size={18} />
                      </button>

                      <span className="text-xs font-semibold text-ink-500">
                        {currentIndex + 1} of {filteredPrompts.length}
                      </span>

                      <button
                        type="button"
                        onClick={handleNext}
                        className="inline-flex items-center gap-1 px-4 py-2 rounded-pill bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-soft-sm transition-all active:scale-95"
                      >
                        Next <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Quick Character Selector Grid */}
                <div className="bg-white rounded-card p-4 border border-ink-200/80 shadow-soft-sm">
                  <p className="text-xs font-bold uppercase tracking-wider text-ink-500 mb-3">
                    Character Deck ({filteredPrompts.length})
                  </p>
                  <div className="grid grid-cols-5 gap-2 max-h-48 overflow-y-auto pr-1">
                    {filteredPrompts.map((p, idx) => {
                      const isCurrent = idx === currentIndex;
                      const isDone = completedIds.has(p.id);

                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setCurrentIndex(idx)}
                          className={`p-2 rounded-xl text-center font-display font-bold text-lg border-2 transition-all select-none ${
                            isCurrent
                              ? 'border-brand-600 bg-brand-50 text-brand-900 shadow-soft-sm ring-2 ring-brand-500/20'
                              : isDone
                              ? 'border-green-200 bg-green-50/60 text-green-800'
                              : 'border-ink-200 hover:border-ink-300 bg-white text-ink-800'
                          }`}
                        >
                          {p.character}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Writing Canvas with Stroke Accuracy Metric & PNG Export */}
              <div className="lg:col-span-7">
                {activePrompt && (
                  <WritingCanvas
                    targetCharacter={activePrompt.character}
                    gridType={activePrompt.gridType || 'rice'}
                    expectedStrokes={activePrompt.strokeCount}
                    onComplete={handleCanvasComplete}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── MODE 2: Custom Text Tracing Mode ── */}
        {activeTabMode === 'custom' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Custom Text Configurator & Audio */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-card p-6 border border-ink-200/80 shadow-soft-sm">
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-700 bg-brand-50 px-2.5 py-1 rounded-pill inline-block mb-3">
                  Custom Tracing Studio
                </span>
                <h3 className="font-display font-bold text-xl text-ink-900 mb-1">
                  Type Any Character or Phrase
                </h3>
                <p className="text-xs text-ink-500 mb-4">
                  Write your name, special kanji, or target vocabulary words to project onto the canvas ghost guide.
                </p>

                {/* Input Field */}
                <div className="mb-4">
                  <label className="block text-xs font-bold text-ink-700 uppercase tracking-wide mb-1.5">
                    Target Text
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      placeholder="e.g. 桜, こんにちは, Bonjour..."
                      className="w-full px-4 py-3 rounded-xl border-2 border-brand-200 focus:border-brand-500 focus:outline-none font-display font-semibold text-lg text-ink-900 placeholder:text-ink-300"
                    />
                  </div>
                </div>

                {/* Audio Listen for Custom Text */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-ink-50 border border-ink-200/70 mb-4">
                  <span className="text-xs font-semibold text-ink-600">
                    Listen to custom phrase:
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={!customText.trim()}
                      onClick={() => speech?.speak(customText, currentLang)}
                      className="px-2.5 py-1.5 rounded-pill bg-white text-brand-700 border border-brand-200 hover:bg-brand-50 text-xs font-semibold flex items-center gap-1 shadow-soft-sm transition-all active:scale-95 disabled:opacity-40"
                      title="Normal audio"
                    >
                      <Volume2 size={14} /> Normal
                    </button>
                    <button
                      type="button"
                      disabled={!customText.trim()}
                      onClick={() => speech?.speakSlow(customText, currentLang)}
                      className="px-2.5 py-1.5 rounded-pill bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 text-xs font-semibold flex items-center gap-1 shadow-soft-sm transition-all active:scale-95 disabled:opacity-40"
                      title="Slow turtle audio"
                    >
                      <Turtle size={14} /> Turtle
                    </button>
                  </div>
                </div>

                {/* Grid Type Selector */}
                <div className="mb-4">
                  <label className="block text-xs font-bold text-ink-700 uppercase tracking-wide mb-1.5">
                    Guideline Style
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'rice', label: '田 Rice Grid' },
                      { id: 'lined', label: '≡ Lined' },
                      { id: 'none', label: '◻ Blank' },
                    ].map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setCustomGrid(g.id)}
                        className={`py-2 px-2 text-xs font-semibold rounded-xl border text-center transition-all ${
                          customGrid === g.id
                            ? 'border-brand-500 bg-brand-50 text-brand-800 ring-2 ring-brand-500/20'
                            : 'border-ink-200 hover:border-ink-300 text-ink-600 bg-white'
                        }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preset Suggestions */}
                <div>
                  <label className="block text-xs font-bold text-ink-700 uppercase tracking-wide mb-2">
                    Popular Suggestions
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {currentSuggestions.map((sug) => (
                      <button
                        key={sug.text}
                        type="button"
                        onClick={() => setCustomText(sug.text)}
                        className="px-2.5 py-1 rounded-pill bg-white hover:bg-brand-50 border border-ink-200 hover:border-brand-300 text-xs font-medium text-ink-700 transition-colors"
                        title={sug.label}
                      >
                        {sug.text}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Writing Canvas with Custom Text */}
            <div className="lg:col-span-7">
              <WritingCanvas
                targetCharacter={customText}
                gridType={customGrid}
                onComplete={handleCanvasComplete}
              />
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
