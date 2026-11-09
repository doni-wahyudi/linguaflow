/**
 * @file CharacterStudio.jsx
 * @description Comprehensive Character & Writing Academy Hub.
 * Features 50-sound Gojūon audio charts for Hiragana and Katakana, complete N5 Kanji directory,
 * European phonics & orthography rules (ES, FR, DE), interactive digital calligraphy canvas,
 * and rapid character recognition drill gym.
 */

import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PenTool,
  Volume2,
  BookOpen,
  Sparkles,
  Zap,
  Grid,
  Search,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Layers,
  Award,
  Type,
  Flame,
} from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import { Flag } from '../components/brand';
import {
  Badge,
  Button,
  Card,
  Chip,
  Input,
  SegmentedControl,
  segmentIds,
} from '../components/ui';
import { useUser } from '../context/UserContext';
import {
  hiraganaData,
  katakanaData,
  kanjiN5Data,
  phonicsByLanguage,
  getHiragana,
  getKatakana,
  getKanji,
  getPhonics,
} from '../data/characters';
import WritingCanvas from '../components/writing/WritingCanvas';
import { playClick, playCorrect, playIncorrect, playCelebration } from '../utils/soundEffects';
import { transitionEase } from '../utils/motion';

const studioTabIds = segmentIds('character-studio-tabs');

export default function CharacterStudio() {
  const { user, speech, xp } = useUser();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const langCode = user.selectedLanguage || 'ja';
  const isJapanese = langCode === 'ja';

  // Available tabs depending on language
  const tabs = useMemo(() => {
    if (isJapanese) {
      return [
        { id: 'hiragana', label: 'Hiragana (ひらがな)', icon: Layers },
        { id: 'katakana', label: 'Katakana (カタカナ)', icon: Layers },
        { id: 'kanji', label: 'N5 Kanji (漢字)', icon: BookOpen },
        { id: 'canvas', label: 'Calligraphy Canvas', icon: PenTool },
        { id: 'gym', label: 'Recognition Gym', icon: Zap },
      ];
    }
    return [
      { id: 'alphabet', label: 'Alphabet & Audio', icon: Layers },
      { id: 'rules', label: 'Phonics & Rules', icon: BookOpen },
      { id: 'canvas', label: 'Handwriting Canvas', icon: PenTool },
      { id: 'gym', label: 'Recognition Gym', icon: Zap },
    ];
  }, [isJapanese]);

  const defaultTab = searchParams.get('tab') || tabs[0].id;
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Ensure activeTab is valid for current language tabs
  React.useEffect(() => {
    if (!tabs.some((t) => t.id === activeTab)) {
      setActiveTab(tabs[0].id);
    }
  }, [tabs, activeTab]);

  // Kana sub-filter
  const [kanaGroup, setKanaGroup] = useState('all'); // 'all', 'gojuon', 'dakuten', 'yoon'
  const [selectedKana, setSelectedKana] = useState(null);

  // Kanji sub-filter & search
  const [kanjiCategory, setKanjiCategory] = useState('All');
  const [kanjiSearch, setKanjiSearch] = useState('');
  const [selectedKanji, setSelectedKanji] = useState(null);

  // Canvas state
  const [canvasTarget, setCanvasTarget] = useState(isJapanese ? 'あ' : 'A');
  const [canvasGrid, setCanvasGrid] = useState(isJapanese ? 'rice' : 'lined');

  // Speed Recognition Gym state
  const [gymIndex, setGymIndex] = useState(0);
  const [gymScore, setGymScore] = useState(0);
  const [gymAnswered, setGymAnswered] = useState(false);
  const [gymSelected, setGymSelected] = useState(null);
  const [gymCompleted, setGymCompleted] = useState(false);

  // Play pronunciation via Web Speech
  const handlePlayAudio = (text, customLang) => {
    if (speech?.speak && text) {
      playClick();
      speech.speak(text, customLang || langCode);
    }
  };

  // Switch to canvas with specific character loaded
  const handleTraceCharacter = (char) => {
    setCanvasTarget(char);
    setActiveTab('canvas');
    playClick();
  };

  // Filter Kana dataset
  const filteredKana = useMemo(() => {
    const dataset = activeTab === 'katakana' ? katakanaData : hiraganaData;
    if (kanaGroup === 'all') return dataset;
    return dataset.filter((k) => k.group === kanaGroup);
  }, [activeTab, kanaGroup]);

  // Unique Kanji categories
  const kanjiCategories = useMemo(() => {
    const set = new Set();
    kanjiN5Data.forEach((k) => {
      if (k.category) set.add(k.category);
    });
    return ['All', ...Array.from(set)];
  }, []);

  // Filter Kanji dataset
  const filteredKanji = useMemo(() => {
    return kanjiN5Data.filter((k) => {
      const matchesCat = kanjiCategory === 'All' || k.category === kanjiCategory;
      if (!matchesCat) return false;
      if (!kanjiSearch.trim()) return true;
      const q = kanjiSearch.toLowerCase();
      const inKanji = k.kanji.includes(q);
      const inMeaning = k.meaning.toLowerCase().includes(q);
      const inOnyomi = k.onyomi.some((r) => r.includes(q));
      const inKunyomi = k.kunyomi.some((r) => r.includes(q));
      return inKanji || inMeaning || inOnyomi || inKunyomi;
    });
  }, [kanjiCategory, kanjiSearch]);

  // Phonics data for European languages
  const phonics = useMemo(() => {
    return getPhonics(langCode) || getPhonics('es');
  }, [langCode]);

  // Generate 10 random questions for Recognition Gym
  const gymQuestions = useMemo(() => {
    let sourcePool = [];
    if (isJapanese) {
      sourcePool = hiraganaData.filter((h) => h.group === 'gojuon');
    } else {
      sourcePool = phonics.alphabet || [];
    }

    // Pick 10 random items
    const shuffled = [...sourcePool].sort(() => 0.5 - Math.random()).slice(0, 10);
    return shuffled.map((item, qIdx) => {
      const correctText = isJapanese ? item.romaji : item.name || item.ipa;
      // Pick 3 distractors
      const otherItems = sourcePool
        .filter((o) => (isJapanese ? o.id !== item.id : o.letter !== item.letter))
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map((o) => (isJapanese ? o.romaji : o.name || o.ipa));

      const options = [correctText, ...otherItems].sort(() => 0.5 - Math.random());
      return {
        id: `gym-q-${qIdx}`,
        char: isJapanese ? item.char : item.letter,
        audioText: isJapanese ? item.char : item.letter,
        correct: correctText,
        options,
      };
    });
  }, [isJapanese, phonics, activeTab]);

  const currentGymQ = gymQuestions[gymIndex];

  // Handle Gym option select
  const handleGymAnswer = (option) => {
    if (gymAnswered || !currentGymQ) return;
    setGymSelected(option);
    setGymAnswered(true);

    const isRight = option === currentGymQ.correct;
    if (isRight) {
      playCorrect();
      setGymScore((s) => s + 1);
    } else {
      playIncorrect();
    }
  };

  const handleNextGym = () => {
    if (gymIndex + 1 < gymQuestions.length) {
      setGymIndex((i) => i + 1);
      setGymAnswered(false);
      setGymSelected(null);
    } else {
      setGymCompleted(true);
      playCelebration();
      if (xp?.awardXP) {
        xp.awardXP(25);
      }
    }
  };

  const handleResetGym = () => {
    setGymIndex(0);
    setGymScore(0);
    setGymAnswered(false);
    setGymSelected(null);
    setGymCompleted(false);
    playClick();
  };

  return (
    <PageWrapper
      title="Character & Alphabet Studio"
      subtitle="Master native writing systems with interactive audio charts, stroke order calligraphy, and rapid recognition drills."
      badge="Script Mastery"
      breadcrumbs={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Character Studio' }]}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <SegmentedControl
            name="character-studio-tabs"
            label="Character Studio Navigation"
            value={activeTab}
            onChange={(tab) => {
              setActiveTab(tab);
              setSearchParams({ tab });
              playClick();
            }}
            tabs={tabs}
            size="md"
          />

          <div className="flex items-center gap-2">
            <span className="text-caption text-ink-500 font-semibold uppercase tracking-wider">
              Language:
            </span>
            <Badge variant="brand" size="md">
              <Flag code={langCode} className="w-4 h-3 inline-block mr-1.5" />
              {isJapanese
                ? 'Japanese (日本語)'
                : langCode === 'es'
                ? 'Spanish (Español)'
                : langCode === 'fr'
                ? 'French (Français)'
                : 'German (Deutsch)'}
            </Badge>
          </div>
        </div>

        {/* ── TAB 1 & 2: JAPANESE KANA (HIRAGANA / KATAKANA) ── */}
        {(activeTab === 'hiragana' || activeTab === 'katakana') && (
          <div className="space-y-6">
            {/* Filter Sub-Bar */}
            <div className="flex items-center justify-between flex-wrap gap-3 bg-surface-card p-3 rounded-card border border-ink-200">
              <div className="flex items-center gap-2">
                <span className="text-caption font-semibold text-ink-600 uppercase tracking-wide">
                  Group:
                </span>
                <div className="flex gap-1.5 flex-wrap">
                  {[
                    { id: 'all', label: 'All 50-Sound' },
                    { id: 'gojuon', label: 'Basic (Gojūon)' },
                    { id: 'dakuten', label: 'Dakuten (が/ぱ)' },
                    { id: 'yoon', label: 'Yōon (きゃ/しゃ)' },
                  ].map((grp) => (
                    <button
                      key={grp.id}
                      type="button"
                      onClick={() => setKanaGroup(grp.id)}
                      className={`px-3 py-1 text-caption font-semibold rounded-pill transition-colors ${
                        kanaGroup === grp.id
                          ? 'bg-brand-500 text-white shadow-soft-xs'
                          : 'bg-surface-bg text-ink-700 hover:bg-ink-100 border border-ink-200'
                      }`}
                    >
                      {grp.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-caption text-ink-500">
                Showing {filteredKana.length} characters
              </div>
            </div>

            {/* Kana Interactive Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2.5">
              {filteredKana.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    handlePlayAudio(item.char);
                    setSelectedKana(item);
                  }}
                  className={`p-3 rounded-card border text-center cursor-pointer transition-all ${
                    selectedKana?.id === item.id
                      ? 'bg-brand-50 border-brand-500 shadow-soft-sm'
                      : 'bg-surface-card border-ink-200 hover:border-brand-400 hover:shadow-soft-xs'
                  }`}
                  role="button"
                  tabIndex={0}
                  aria-label={`Character ${item.char}, romaji ${item.romaji}`}
                >
                  <p className="font-display font-bold text-display-xs text-ink-900 mb-0.5">
                    {item.char}
                  </p>
                  <p className="text-caption font-mono font-medium text-brand-700">
                    {item.romaji}
                  </p>
                  <span className="text-[10px] text-ink-400 block mt-0.5">
                    {item.strokeCount} strk
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Selected Kana Detail Card */}
            {selectedKana && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <Card padding="lg" tone="quiet" className="border shadow-soft-sm">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-5 text-center sm:text-left">
                      <div className="w-20 h-20 rounded-card bg-surface-card border border-brand-200 flex items-center justify-center shadow-soft-xs">
                        <span className="font-display font-bold text-display-lg text-brand-700">
                          {selectedKana.char}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1 justify-center sm:justify-start">
                          <h3 className="font-display font-bold text-display-sm text-ink-900">
                            Romaji: {selectedKana.romaji}
                          </h3>
                          <button
                            type="button"
                            onClick={() => handlePlayAudio(selectedKana.char)}
                            className="p-1.5 text-brand-600 hover:bg-brand-100 rounded-pill transition-colors"
                            title="Play audio"
                            aria-label={`Listen to ${selectedKana.char}`}
                          >
                            <Volume2 className="w-5 h-5" />
                          </button>
                        </div>
                        <p className="text-body-sm text-ink-600">
                          {selectedKana.mnemonic || `Stroke Count: ${selectedKana.strokeCount} strokes`}
                        </p>
                        {selectedKana.examples && selectedKana.examples.length > 0 && (
                          <div className="flex items-center gap-3 mt-2 flex-wrap">
                            <span className="text-caption font-semibold text-ink-500">
                              Example words:
                            </span>
                            {selectedKana.examples.map((ex, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 bg-surface-card border border-ink-200 rounded-pill text-caption text-ink-800"
                              >
                                {ex.word} ({ex.reading}) - {ex.meaning}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 flex gap-2">
                      <Button
                        shape="pill"
                        icon={PenTool}
                        onClick={() => handleTraceCharacter(selectedKana.char)}
                      >
                        Trace in Canvas
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </div>
        )}

        {/* ── TAB 3: N5 KANJI DIRECTORY (JAPANESE) ── */}
        {activeTab === 'kanji' && (
          <div className="space-y-6">
            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-surface-card p-3 rounded-card border border-ink-200">
              <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                <span className="text-caption font-semibold text-ink-600 uppercase tracking-wide shrink-0">
                  Category:
                </span>
                <div className="flex gap-1.5">
                  {kanjiCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setKanjiCategory(cat)}
                      className={`px-3 py-1 text-caption font-semibold rounded-pill shrink-0 transition-colors ${
                        kanjiCategory === cat
                          ? 'bg-brand-500 text-white shadow-soft-xs'
                          : 'bg-surface-bg text-ink-700 hover:bg-ink-100 border border-ink-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="w-full md:w-64">
                <Input
                  value={kanjiSearch}
                  onChange={(e) => setKanjiSearch(e.target.value)}
                  placeholder="Search kanji or meaning..."
                  icon={Search}
                  size="sm"
                />
              </div>
            </div>

            {/* Kanji Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredKanji.map((item) => (
                <Card
                  key={item.id}
                  padding="md"
                  className="border border-ink-200 hover:border-brand-400 hover:shadow-soft-sm transition-all"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="font-display font-bold text-display-md text-brand-700">
                      {item.kanji}
                    </span>
                    <button
                      type="button"
                      onClick={() => handlePlayAudio(item.kanji)}
                      className="p-1.5 text-brand-600 hover:bg-brand-100 rounded-pill transition-colors"
                      title="Play audio"
                      aria-label={`Listen to ${item.kanji}`}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h4 className="font-display font-bold text-body-md text-ink-900 mb-1">
                    {item.meaning}
                  </h4>

                  <div className="text-caption space-y-0.5 mb-3 text-ink-600">
                    <p>
                      <span className="font-semibold text-ink-500">On: </span>
                      <span className="font-mono text-ink-800">{item.onyomi.join(', ')}</span>
                    </p>
                    <p>
                      <span className="font-semibold text-ink-500">Kun: </span>
                      <span className="font-mono text-ink-800">{item.kunyomi.join(', ')}</span>
                    </p>
                  </div>

                  {item.examples && item.examples.length > 0 && (
                    <div className="border-t border-ink-100 pt-2 mb-3">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-400 block mb-1">
                        Vocabulary
                      </span>
                      <ul className="text-caption text-ink-700 space-y-1">
                        {item.examples.slice(0, 2).map((ex, exIdx) => (
                          <li key={exIdx} className="flex items-center justify-between">
                            <span className="font-medium text-ink-900">{ex.word} ({ex.reading})</span>
                            <span className="text-ink-500 text-[11px]">{ex.meaning}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    shape="pill"
                    icon={PenTool}
                    onClick={() => handleTraceCharacter(item.kanji)}
                  >
                    Trace in Canvas
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB: EUROPEAN ALPHABET & AUDIO (ES, FR, DE) ── */}
        {activeTab === 'alphabet' && (
          <div className="space-y-6">
            <div className="bg-surface-card p-4 rounded-card border border-ink-200">
              <h3 className="font-display font-bold text-display-xs text-ink-900 mb-1">
                {phonics.title}
              </h3>
              <p className="text-body-sm text-ink-600">
                {phonics.description}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
              {phonics.alphabet?.map((item, idx) => (
                <Card
                  key={idx}
                  padding="md"
                  className="border border-ink-200 hover:border-brand-400 hover:shadow-soft-xs transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-display font-bold text-display-sm text-brand-700">
                      {item.letter}
                    </span>
                    <button
                      type="button"
                      onClick={() => handlePlayAudio(item.sampleWord || item.letter)}
                      className="p-1.5 text-brand-600 hover:bg-brand-100 rounded-pill transition-colors"
                      title="Listen"
                      aria-label={`Listen to ${item.letter}`}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-caption text-ink-600 mb-2">
                    <p className="font-mono font-semibold text-brand-600">{item.ipa}</p>
                    <p className="text-[11px] text-ink-500 mt-0.5">{item.soundTip}</p>
                  </div>
                  <div className="border-t border-ink-100 pt-1.5">
                    <p className="text-caption font-medium text-ink-900">
                      {item.sampleWord}
                    </p>
                    <p className="text-[11px] text-ink-500 italic">
                      "{item.translation}"
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB: EUROPEAN PHONICS RULES ── */}
        {activeTab === 'rules' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {phonics.rules?.map((rule, idx) => (
                <Card key={idx} padding="lg" className="border border-ink-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-brand-600 shrink-0" />
                    <h4 className="font-display font-bold text-body-lg text-ink-900">
                      {rule.title}
                    </h4>
                  </div>
                  <p className="text-body-sm text-ink-700 leading-relaxed mb-4">
                    {rule.rule}
                  </p>
                  {rule.examples && (
                    <div className="bg-surface-bg p-3 rounded-card border border-ink-200">
                      <span className="text-caption font-semibold uppercase tracking-wider text-ink-500 block mb-1.5">
                        Linguistic Examples
                      </span>
                      <ul className="space-y-1">
                        {rule.examples.map((ex, i) => (
                          <li key={i} className="text-body-sm text-ink-900 flex items-center justify-between">
                            <span>{ex}</span>
                            <button
                              type="button"
                              onClick={() => handlePlayAudio(ex.split(':')[1]?.trim() || ex)}
                              className="text-brand-600 hover:text-brand-800 p-1 rounded-pill"
                              aria-label="Listen"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB: CALLIGRAPHY CANVAS ── */}
        {activeTab === 'canvas' && (
          <div className="max-w-xl mx-auto space-y-6">
            <div className="bg-surface-card p-4 rounded-card border border-ink-200 text-center">
              <Badge variant="brand" uppercase size="md" className="mb-2">
                Digital Calligraphy Studio
              </Badge>
              <h3 className="font-display font-bold text-display-sm text-ink-900 mb-1">
                Tracing Character: “{canvasTarget}”
              </h3>
              <p className="text-body-sm text-ink-500">
                Use your mouse, finger, or tablet stylus to trace with smooth pressure sensitivity.
              </p>

              {/* Character quick selector / custom text input */}
              <div className="flex items-center justify-center gap-2 mt-4 max-w-sm mx-auto">
                <Input
                  value={canvasTarget}
                  onChange={(e) => setCanvasTarget(e.target.value)}
                  placeholder="Type character..."
                  size="sm"
                  className="text-center font-display font-bold"
                />
                <button
                  type="button"
                  onClick={() => handlePlayAudio(canvasTarget)}
                  className="p-2 bg-brand-50 text-brand-700 hover:bg-brand-100 rounded-pill border border-brand-200"
                  title="Listen"
                  aria-label="Listen to character pronunciation"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <WritingCanvas
              targetCharacter={canvasTarget}
              gridType={canvasGrid}
              onComplete={(isCorrect) => {
                if (isCorrect) playCorrect();
              }}
            />
          </div>
        )}

        {/* ── TAB: SPEED RECOGNITION GYM ── */}
        {activeTab === 'gym' && (
          <div className="max-w-xl mx-auto">
            {!gymCompleted && currentGymQ ? (
              <Card padding="lg" className="border border-ink-200 text-center shadow-soft-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-caption font-semibold uppercase tracking-wider text-ink-500">
                    Question {gymIndex + 1} of {gymQuestions.length}
                  </span>
                  <div className="flex items-center gap-1.5 text-coral-600 font-bold text-body-sm">
                    <Flame className="w-4 h-4 fill-coral-500 text-coral-500" />
                    <span>{gymScore} Correct</span>
                  </div>
                </div>

                <div className="my-6">
                  <div className="w-24 h-24 rounded-card bg-brand-50 border border-brand-200 mx-auto flex items-center justify-center mb-3 shadow-soft-xs">
                    <span className="font-display font-bold text-display-xl text-brand-800">
                      {currentGymQ.char}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Volume2}
                    onClick={() => handlePlayAudio(currentGymQ.audioText)}
                  >
                    Listen to Sound
                  </Button>
                </div>

                {/* Option Buttons */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {currentGymQ.options.map((opt, i) => {
                    const isSelected = gymSelected === opt;
                    const isCorrect = opt === currentGymQ.correct;

                    let btnClass =
                      'border-2 border-ink-200 bg-surface-card text-ink-900 hover:border-brand-500 hover:bg-brand-50';
                    if (gymAnswered) {
                      if (isCorrect) {
                        btnClass = 'border-2 border-success bg-success-bg text-success-strong font-bold';
                      } else if (isSelected && !isCorrect) {
                        btnClass = 'border-2 border-error bg-error-bg text-error-strong';
                      } else {
                        btnClass = 'border-2 border-ink-100 bg-surface-card opacity-50';
                      }
                    }

                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleGymAnswer(opt)}
                        disabled={gymAnswered}
                        className={`p-4 rounded-card font-display font-bold text-display-xs transition-all ${btnClass}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {gymAnswered && (
                  <Button
                    size="lg"
                    shape="pill"
                    fullWidth
                    icon={ArrowRight}
                    iconPosition="right"
                    onClick={handleNextGym}
                  >
                    {gymIndex + 1 < gymQuestions.length ? 'Next Question' : 'Complete Gym'}
                  </Button>
                )}
              </Card>
            ) : (
              <Card padding="lg" tone="quiet" className="border text-center shadow-soft-sm">
                <div className="w-16 h-16 rounded-pill bg-brand-50 border border-brand-200 mx-auto flex items-center justify-center mb-4">
                  <Award className="w-8 h-8 text-brand-700" />
                </div>
                <h3 className="font-display font-bold text-display-sm text-ink-900 mb-1">
                  Speed Drill Completed!
                </h3>
                <p className="text-body-md text-ink-600 mb-4">
                  You scored <span className="font-bold text-brand-700">{gymScore}</span> out of {gymQuestions.length} correct.
                </p>
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="bg-brand-50 border border-brand-200 rounded-card px-4 py-2">
                    <p className="font-bold text-display-xs text-brand-800">+25 XP</p>
                    <p className="text-caption text-ink-500">Reward</p>
                  </div>
                  <div className="bg-coral-50 border border-coral-200 rounded-card px-4 py-2">
                    <p className="font-bold text-display-xs text-coral-800">{Math.round((gymScore / gymQuestions.length) * 100)}%</p>
                    <p className="text-caption text-ink-500">Accuracy</p>
                  </div>
                </div>
                <Button shape="pill" size="lg" onClick={handleResetGym}>
                  Play Again
                </Button>
              </Card>
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
