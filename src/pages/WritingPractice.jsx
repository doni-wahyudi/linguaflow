/**
 * @file WritingPractice.jsx
 * @description Dedicated Writing Lab optimized for tablets, styluses (Apple Pencil / S-Pen), and touch.
 * Features categorized character decks, custom text tracing mode, stroke count metrics,
 * pronunciation audio with slow Turtle mode (0.65x), and an interactive digital calligraphy canvas.
 *
 * Design-system migration notes:
 * - The mode switcher is the kit `SegmentedControl`, which is a real tablist with
 *   arrow-key movement. The hand-rolled rail it replaces used `text-ink-600` and
 *   `shadow-inner-sm` — neither is a declared token, so the unselected labels
 *   inherited black and the inset shadow never painted.
 * - Panels, chips, audio pairs and buttons all come from the kit (`Card`, `Chip`,
 *   `AudioControls`, `Button`). Icon-only step controls used to be 32px
 *   `p-2 rounded-full` circles; they are now 44px+ squares with `aria-label`s.
 * - `title=` is gone everywhere. It is unreachable on touch, and where it disagreed
 *   with the accessible name it broke WCAG 2.5.3 for speech-input users. The
 *   suggestion chips now show their translation instead of hiding it, and the audio
 *   buttons name the phrase they speak.
 * - `green-*` → `success-*`, `text-ink-800`/`text-ink-600` → real ink tiers, and
 *   `text-xs / text-[11px] / text-sm / text-lg / text-xl` → the type scale.
 * - The reference glyph was sized with an inline `style={{ fontSize: '5.5rem' }}`;
 *   it now uses `text-display-lg`, which is the fluid H1 tier and still fits a
 *   twelve-character phrase on a phone.
 * - The Guideline style control is a `fieldset` of native radios, so arrow keys,
 *   group announcement and checked state come from the platform instead of
 *   hand-synced `aria-pressed`.
 */

import React, { useState, useMemo } from 'react';
import {
  PenTool,
  ChevronLeft,
  ArrowRight,
  CheckCircle2,
  Info,
  Type,
  Layers,
} from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import { Flag } from '../components/brand';
import {
  AudioControls,
  Badge,
  Button,
  Card,
  Chip,
  Input,
  SegmentedControl,
  segmentIds,
} from '../components/ui';
import { useUser } from '../context/UserContext';
import writingPrompts from '../data/writingPrompts';
import languages from '../data/languages';
import WritingCanvas from '../components/writing/WritingCanvas';

const modeIds = segmentIds('writing-mode');

const MODE_TABS = [
  { id: 'curated', label: 'Character decks', icon: Layers },
  { id: 'custom', label: 'Custom tracing', icon: Type },
];

const GRID_OPTIONS = [
  { id: 'rice', label: '田 Rice grid' },
  { id: 'lined', label: '≡ Lined' },
  { id: 'none', label: 'Plain' },
];

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
  const defaultCustomText =
    currentLang === 'ja'
      ? '桜'
      : currentLang === 'de'
        ? 'Schön'
        : currentLang === 'fr'
          ? 'Café'
          : 'Amigo';
  const [customText, setCustomText] = useState(defaultCustomText);
  const [customGrid, setCustomGrid] = useState(currentLang === 'ja' ? 'rice' : 'lined');

  // Get prompts for current language (fallback to Spanish if not found)
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
    setCurrentIndex((i) => (i + 1 < filteredPrompts.length ? i + 1 : 0));
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
        {/* ── Page Header ── rail under the title, the same arrangement Practice
            uses, so the two tabbed pages do not look like different products. */}
        <div className="mb-6 flex flex-col gap-4">
          <div>
            <h1 className="font-display text-display-md text-ink-900 flex items-center gap-2">
              <PenTool className="w-8 h-8 text-brand-700 shrink-0" aria-hidden="true" />
              Handwriting & Calligraphy Lab
            </h1>
            <p className="text-body-md text-ink-500 mt-1">
              Practice drawing letters, accents, and characters in{' '}
              <strong className="font-semibold text-ink-700">{langData?.name}</strong>{' '}
              <Flag code={langData?.flagCode} size={16} decorative />{' '}
              with a stylus, Apple Pencil, or touch.
            </p>
          </div>

          <SegmentedControl
            name="writing-mode"
            label="Writing practice mode"
            tabs={MODE_TABS}
            value={activeTabMode}
            onChange={setActiveTabMode}
            className="self-start"
          />
        </div>

        {/* ── MODE 1: Curated Character Decks ── */}
        {activeTabMode === 'curated' && (
          <div
            role="tabpanel"
            id={modeIds.panelId('curated')}
            aria-labelledby={modeIds.tabId('curated')}
          >
            {/* Category Filter */}
            <div
              className="flex flex-wrap gap-1.5 mb-6"
              role="group"
              aria-label="Filter characters by category"
            >
              {categories.map((cat) => (
                <Chip
                  key={cat}
                  selected={selectedCategory === cat}
                  showCheck={false}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCurrentIndex(0);
                  }}
                >
                  {cat}
                </Chip>
              ))}
            </div>

            {filteredPrompts.length === 0 ? (
              <Card tone="quiet" padding="lg" className="text-center">
                <p className="font-display font-bold text-display-xs text-ink-900 mb-1">
                  No characters in this deck
                </p>
                <p className="text-body-sm text-ink-500">
                  {langData?.name} has no prompts tagged “{selectedCategory}”. Pick
                  another category or switch to custom tracing.
                </p>
              </Card>
            ) : (
              /* Tablet split workspace */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column: Reference Character & Tips */}
                <div className="lg:col-span-5 space-y-4">
                  {activePrompt && (
                    <Card>
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <Badge variant="brand" size="md" uppercase>
                          {activePrompt.category}
                        </Badge>
                        <div className="flex items-center gap-2">
                          {activePrompt.strokeCount && (
                            <span className="text-caption text-ink-500 tabular-nums">
                              {activePrompt.strokeCount}{' '}
                              {activePrompt.strokeCount === 1 ? 'stroke' : 'strokes'}
                            </span>
                          )}
                          {completedIds.has(activePrompt.id) && (
                            <Badge variant="success" icon={CheckCircle2}>
                              Mastered
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Big reference character with normal & slow audio */}
                      <div className="text-center py-6 px-4 bg-gradient-to-br from-brand-50 to-amber-50 rounded-card border border-brand-200 mb-6 relative">
                        <div className="absolute top-2 right-2">
                          <AudioControls
                            text={activePrompt.character}
                            lang={currentLang}
                            speech={speech}
                          />
                        </div>

                        <p className="text-overline uppercase text-ink-500 mb-2">
                          Trace this
                        </p>
                        <h2 className="font-display font-bold text-display-lg text-ink-900 tracking-tight leading-none select-none">
                          {activePrompt.character}
                        </h2>

                        <p className="font-display font-semibold text-body-lg text-brand-800 mt-3">
                          /{activePrompt.pronunciation}/
                        </p>
                        <p className="text-body-sm text-ink-500 mt-0.5">
                          {activePrompt.translation}
                        </p>
                      </div>

                      {/* Stroke Technique Tips */}
                      {activePrompt.tips && (
                        <div className="p-4 rounded-button bg-surface-100 border border-ink-200 mb-6">
                          <p className="text-overline uppercase text-ink-700 flex items-center gap-1.5 mb-1.5">
                            <Info size={14} className="text-brand-700" aria-hidden="true" />
                            Stroke technique tip
                          </p>
                          <p className="text-caption text-ink-700 leading-relaxed">
                            {activePrompt.tips}
                          </p>
                        </div>
                      )}

                      {/* Deck navigation */}
                      <div className="flex items-center justify-between gap-3 pt-4 border-t border-ink-200">
                        <Button
                          variant="outline"
                          size="lg"
                          iconOnly
                          icon={ChevronLeft}
                          aria-label="Previous character"
                          onClick={handlePrev}
                          disabled={currentIndex === 0}
                        />

                        <p className="text-body-sm font-semibold text-ink-700 tabular-nums">
                          {currentIndex + 1} of {filteredPrompts.length}
                        </p>

                        <Button
                          size="md"
                          shape="pill"
                          icon={ArrowRight}
                          iconPosition="right"
                          aria-label="Next character"
                          onClick={handleNext}
                        >
                          Next
                        </Button>
                      </div>
                    </Card>
                  )}

                  {/* Quick Character Selector */}
                  <Card padding="sm">
                    <p className="text-overline uppercase text-ink-500 mb-3">
                      Character deck ({filteredPrompts.length})
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
                            aria-current={isCurrent ? 'true' : undefined}
                            aria-label={isDone ? `${p.character} — practised` : p.character}
                            className={`min-h-11 px-2 py-2 rounded-button text-center font-display font-bold text-body-lg border-2 transition-colors select-none break-all ${
                              isCurrent
                                ? 'border-brand-700 bg-brand-50 text-brand-900'
                                : isDone
                                  ? 'border-success-border bg-success-bg text-success-strong'
                                  : 'border-ink-200 bg-surface-card text-ink-900 hover:border-brand-600'
                            }`}
                          >
                            {p.character}
                          </button>
                        );
                      })}
                    </div>
                  </Card>
                </div>

                {/* Right Column: Writing Canvas */}
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
            )}
          </div>
        )}

        {/* ── MODE 2: Custom Text Tracing ── */}
        {activeTabMode === 'custom' && (
          <div
            role="tabpanel"
            id={modeIds.panelId('custom')}
            aria-labelledby={modeIds.tabId('custom')}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Custom Text Configurator */}
              <div className="lg:col-span-5 space-y-4">
                <Card>
                  <Badge variant="brand" size="md" uppercase className="mb-3">
                    Custom tracing studio
                  </Badge>
                  <h2 className="font-display font-bold text-display-xs text-ink-900 mb-1">
                    Type any character or phrase
                  </h2>
                  <p className="text-caption text-ink-500 mb-4">
                    Write your name, special kanji, or target vocabulary to project
                    onto the canvas ghost guide.
                  </p>

                  <Input
                    label="Target text"
                    type="text"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="e.g. 桜, こんにちは, Bonjour…"
                    helperText="Anything you type is traced on the canvas beside this panel."
                    size="lg"
                    className="mb-4"
                  />

                  {/* Audio for the custom phrase */}
                  <div className="flex items-center justify-between gap-3 p-3 rounded-button bg-surface-100 border border-ink-200 mb-4">
                    <span className="text-caption font-semibold text-ink-700">
                      Listen to this phrase
                    </span>
                    <AudioControls text={customText} lang={currentLang} speech={speech} />
                  </div>

                  {/* Guideline style */}
                  <fieldset className="mb-4">
                    <legend className="text-overline uppercase text-ink-700 mb-1.5">
                      Guideline style
                    </legend>
                    <div className="grid grid-cols-3 gap-2">
                      {GRID_OPTIONS.map((g) => {
                        const isSelected = customGrid === g.id;
                        return (
                          <label
                            key={g.id}
                            className={`flex items-center justify-center min-h-11 px-2 rounded-button border text-body-sm font-semibold text-center cursor-pointer transition-colors ${
                              isSelected
                                ? 'border-brand-700 bg-brand-50 text-brand-800'
                                : 'border-ink-200 bg-surface-card text-ink-700 hover:border-brand-600'
                            }`}
                          >
                            <input
                              type="radio"
                              name="custom-grid"
                              value={g.id}
                              checked={isSelected}
                              onChange={() => setCustomGrid(g.id)}
                              className="sr-only"
                            />
                            {g.label}
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>

                  {/* Preset suggestions */}
                  <div>
                    <p
                      id="writing-suggestions"
                      className="text-overline uppercase text-ink-700 mb-2"
                    >
                      Popular suggestions
                    </p>
                    <div
                      className="flex flex-wrap gap-1.5"
                      role="group"
                      aria-labelledby="writing-suggestions"
                    >
                      {currentSuggestions.map((sug) => (
                        <Chip
                          key={sug.text}
                          size="sm"
                          showCheck={false}
                          selected={customText.trim() === sug.text}
                          onClick={() => setCustomText(sug.text)}
                        >
                          {sug.text}
                          <span className="font-normal text-ink-500">· {sug.label}</span>
                        </Chip>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right Column: Writing Canvas */}
              <div className="lg:col-span-7">
                <WritingCanvas
                  targetCharacter={customText}
                  gridType={customGrid}
                  onComplete={handleCanvasComplete}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
