/**
 * @file Practice.jsx
 * @description Multi-modal language practice arena featuring:
 * 1. Spaced Repetition (SRS) Flashcard Gym
 * 2. Speed Drills & Quick Practice Quizzes (with level filters A1/N5, A2/N4, B1/N3)
 * 3. Listening Ear Training Studio (with normal & turtle audio)
 * 4. Searchable Master Vocabulary Library
 *
 * Design notes:
 * - Kit-only: PageWrapper + Card + Badge + Button + Input. The drill and listening
 *   panels previously carried the same 12-line option-class block twice, with
 *   `emerald-500` in one and a different green in the other; both now render
 *   through <AnswerOptions>, which uses the measured `success-*` / `error-*` tiers.
 * - `text-ink-600` and `text-ink-800` do not exist in the ink scale (50/100/200/
 *   300/400/500/700/900), so those labels silently inherited their parent colour.
 *   Every one of them is now a real token.
 * - `shadow-soft-xs` is not a declared shadow either — it rendered nothing.
 * - The SRS card was a clickable <div> containing real audio <button>s, which is
 *   invalid nesting and unreachable by keyboard. The flip is now an explicit
 *   <button aria-expanded>, matching lesson/FlashCard.jsx.
 * - Audio controls are 44px (WCAG 2.1 §2.5.5) and named with aria-label; `title`
 *   alone is not an accessible name for touch or screen-reader users.
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Repeat,
  Volume2,
  Turtle,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Search,
  Check,
  RotateCw,
  Trophy,
  Zap,
  Headphones,
  ArrowRight,
  X,
} from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import { Flag } from '../components/brand';
import { useUser } from '../context/UserContext';
import { lessonsByLanguage } from '../data/lessons';
import { getExamsByLanguage } from '../data/exams';
import languages from '../data/languages';
import { playCorrect, playIncorrect } from '../utils/soundEffects';
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
import { transitionEase } from '../utils/motion';

const practiceIds = segmentIds('practice');

/**
 * Single-select answer list shared by the speed drill and the ear-training
 * studio. Feedback is never colour-alone: the state is carried by a glyph, a
 * word ("Correct answer" / "Your answer") and a live region.
 */
function AnswerOptions({ options, correctIndex, selectedIndex, answered, onSelect, label }) {
  return (
    <div className="space-y-2.5" role="group" aria-label={label}>
      {options.map((opt, idx) => {
        const isSelected = selectedIndex === idx;
        const isCorrect = idx === correctIndex;

        let optionStyle =
          'border-ink-200 bg-surface-card text-ink-900 hover:border-brand-600 hover:bg-brand-50';
        if (answered) {
          if (isCorrect) {
            optionStyle = 'border-success bg-success-bg text-success-strong font-semibold';
          } else if (isSelected) {
            optionStyle = 'border-error bg-error-bg text-error-strong';
          } else {
            optionStyle = 'border-ink-200 bg-surface-100 text-ink-500 opacity-60';
          }
        }

        return (
          <button
            key={idx}
            type="button"
            disabled={answered}
            onClick={() => onSelect(idx)}
            aria-pressed={isSelected}
            className={`min-h-14 w-full p-4 rounded-card text-left border-2 text-body-md flex items-center justify-between gap-3 transition-colors ${optionStyle}`}
          >
            <span className="flex items-center gap-3 min-w-0">
              <span
                aria-hidden="true"
                className={`inline-flex items-center justify-center w-7 h-7 rounded-pill border-2 text-caption font-bold shrink-0 ${
                  answered && isCorrect
                    ? 'border-success text-success-strong'
                    : answered && isSelected
                      ? 'border-error text-error-strong'
                      : 'border-ink-300 text-ink-700'
                }`}
              >
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="truncate">{opt}</span>
            </span>

            {answered && isCorrect && (
              <CheckCircle2 size={18} className="text-success-strong shrink-0" aria-hidden="true" />
            )}
            {answered && isSelected && !isCorrect && (
              <X size={18} className="text-error-strong shrink-0" aria-hidden="true" />
            )}
          </button>
        );
      })}
    </div>
  );
}

/** Post-answer explanation panel with the continue action. */
function VerdictPanel({ tone = 'info', children, onNext, nextLabel }) {
  const surfaces = {
    success: 'bg-success-bg border-success-border',
    error: 'bg-error-bg border-error-border',
    info: 'bg-info-bg border-info-border',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: transitionEase }}
      role="status"
      aria-live="polite"
      className={`p-4 rounded-card border space-y-3 ${surfaces[tone]}`}
    >
      <div className="text-body-sm text-ink-700 leading-relaxed">{children}</div>
      {onNext && (
        <Button shape="pill" size="md" icon={ArrowRight} iconPosition="right" onClick={onNext}>
          {nextLabel}
        </Button>
      )}
    </motion.div>
  );
}

export default function Practice() {
  const { user, progress, speech, streak, xp } = useUser();
  const currentLang = user.selectedLanguage || 'es';
  const langData = languages.find((l) => l.id === currentLang);

  // Active Practice Mode Tab
  const [activeTab, setActiveTab] = useState('review'); // 'review' | 'quiz' | 'listening' | 'words'
  const [searchQuery, setSearchQuery] = useState('');

  // ── 1. Vocabulary Pool & SRS ──────────────────────────────────────────────
  const allVocabWords = useMemo(() => {
    const list = lessonsByLanguage[currentLang] || [];
    const map = new Map();
    list.forEach((lesson) => {
      if (lesson.vocabulary) {
        lesson.vocabulary.forEach((v) => {
          if (!map.has(v.id)) {
            map.set(v.id, { ...v, category: lesson.categoryId, lessonTitle: lesson.title, level: lesson.level });
          }
        });
      }
    });
    return Array.from(map.values());
  }, [currentLang]);

  const dueWordIds = useMemo(() => {
    return progress.getWordsForReview();
  }, [progress]);

  const reviewWords = useMemo(() => {
    const dueSet = new Set(dueWordIds);
    const due = allVocabWords.filter((w) => dueSet.has(w.id));
    if (due.length > 0) return due;

    const learnedIds = new Set(Object.keys(progress.wordProgress || {}));
    const learned = allVocabWords.filter((w) => learnedIds.has(w.id));
    return learned.length > 0 ? learned : allVocabWords.slice(0, 10);
  }, [allVocabWords, dueWordIds, progress.wordProgress]);

  const [sessionIndex, setSessionIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionFinished, setSessionFinished] = useState(false);

  const currentWord = reviewWords[sessionIndex];

  const handleRate = (quality) => {
    if (!currentWord) return;
    progress.updateWordProgress(currentWord.id, quality);
    streak.recordActivity();
    xp.addXP(5);

    setIsFlipped(false);
    if (sessionIndex + 1 < reviewWords.length) {
      setSessionIndex((i) => i + 1);
    } else {
      setSessionFinished(true);
    }
  };

  const handleResetSession = () => {
    setSessionIndex(0);
    setIsFlipped(false);
    setSessionFinished(false);
  };

  // ── 2. Speed Drill & Practice Quiz State ──────────────────────────────────
  const [drillLevel, setDrillLevel] = useState('All');
  const [drillIndex, setDrillIndex] = useState(0);
  const [drillAnswered, setDrillAnswered] = useState(false);
  const [drillSelected, setDrillSelected] = useState(null);
  const [drillScore, setDrillScore] = useState(0);
  const [drillFinished, setDrillFinished] = useState(false);

  // Generate drill questions from lessons
  const drillQuestions = useMemo(() => {
    const list = lessonsByLanguage[currentLang] || [];
    const pool = [];

    list.forEach((lesson) => {
      if (drillLevel !== 'All' && lesson.level !== drillLevel) return;

      if (lesson.exercises) {
        lesson.exercises.forEach((ex) => {
          if (ex.type === 'multipleChoice' && ex.options && ex.options.length >= 2) {
            pool.push({
              id: `${lesson.id}-${pool.length}`,
              question: ex.question,
              options: ex.options,
              correctIndex: ex.correctIndex,
              explanation: ex.explanation,
              lessonTitle: lesson.title,
              level: lesson.level,
            });
          }
        });
      }
    });

    return pool.slice(0, 10);
  }, [currentLang, drillLevel]);

  const currentDrillQ = drillQuestions[drillIndex] || drillQuestions[0];

  const handleDrillAnswer = (optIdx) => {
    if (drillAnswered || !currentDrillQ) return;
    setDrillSelected(optIdx);
    setDrillAnswered(true);

    const isCorrect = optIdx === currentDrillQ.correctIndex;
    if (isCorrect) {
      setDrillScore((s) => s + 1);
      playCorrect();
      xp.addXP(10);
    } else {
      playIncorrect();
    }
  };

  const handleDrillNext = () => {
    if (drillIndex + 1 < drillQuestions.length) {
      setDrillIndex((i) => i + 1);
      setDrillAnswered(false);
      setDrillSelected(null);
    } else {
      setDrillFinished(true);
    }
  };

  const handleDrillReset = () => {
    setDrillIndex(0);
    setDrillAnswered(false);
    setDrillSelected(null);
    setDrillScore(0);
    setDrillFinished(false);
  };

  // ── 3. Listening Ear Training State ───────────────────────────────────────
  const listeningExercises = useMemo(() => {
    const exams = getExamsByLanguage(currentLang);
    const audioTasks = [];

    exams.forEach((exam) => {
      const listeningSec = exam.sections.find((s) => s.id === 'listening');
      if (listeningSec) {
        listeningSec.questions.forEach((q) => {
          audioTasks.push({
            ...q,
            level: exam.level,
            examTitle: exam.title,
          });
        });
      }
    });

    return audioTasks;
  }, [currentLang]);

  const [listenIndex, setListenIndex] = useState(0);
  const [listenAnswered, setListenAnswered] = useState(false);
  const [listenSelected, setListenSelected] = useState(null);
  const currentListenQ = listeningExercises[listenIndex] || listeningExercises[0];

  const handleListenAnswer = (idx) => {
    if (listenAnswered || !currentListenQ) return;
    setListenSelected(idx);
    setListenAnswered(true);

    if (idx === currentListenQ.correctIndex) {
      playCorrect();
      xp.addXP(15);
      streak.recordActivity();
    } else {
      playIncorrect();
    }
  };

  // ── 4. Vocabulary Library Search ──────────────────────────────────────────
  const filteredWords = useMemo(() => {
    if (!searchQuery.trim()) return allVocabWords;
    const q = searchQuery.toLowerCase();
    return allVocabWords.filter(
      (w) =>
        w.word.toLowerCase().includes(q) ||
        w.translation.toLowerCase().includes(q) ||
        (w.pronunciation && w.pronunciation.toLowerCase().includes(q))
    );
  }, [allVocabWords, searchQuery]);

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* ── Page Header ──
            The rail sits under the title rather than opposite it: four tabs plus
            the title block need ~1180px and the container caps at 1152px, so the
            side-by-side version wrapped one tab onto a second grey row. */}
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="font-display text-display-md text-ink-900 flex items-center gap-2">
              <Repeat className="w-8 h-8 text-brand-600" />
              Practice & Training Arena
            </h1>
            <p className="text-body-md text-ink-500 mt-1">
              Active spaced repetition, speed drills, ear training, and vocabulary reinforcement for{' '}
              <strong className="font-semibold text-ink-700">{langData?.name}</strong>{' '}
              <Flag code={langData?.flagCode} size={16} decorative />.
            </p>
          </div>

          {/* Practice Mode Tabs */}
          <SegmentedControl
            name="practice"
            label="Practice mode"
            value={activeTab}
            onChange={setActiveTab}
            className="self-start"
            tabs={[
              {
                id: 'review',
                icon: Sparkles,
                label: (
                  <>
                    Flashcards{' '}
                    <span className="tabular-nums">({dueWordIds.length} due)</span>
                  </>
                ),
              },
              { id: 'quiz', icon: Zap, label: 'Speed Drills' },
              { id: 'listening', icon: Headphones, label: 'Ear Training' },
              {
                id: 'words',
                icon: BookOpen,
                label: (
                  <>
                    Word Library{' '}
                    <span className="tabular-nums">({allVocabWords.length})</span>
                  </>
                ),
              },
            ]}
          />
        </div>

        {/* ── TAB 1: Spaced Repetition (SRS) Flashcard Gym ── */}
        {activeTab === 'review' && (
          <div
            role="tabpanel"
            id={practiceIds.panelId('review')}
            aria-labelledby={practiceIds.tabId('review')}
          >
            {!sessionFinished && currentWord ? (
              <div className="max-w-md mx-auto">
                <div className="flex items-center justify-between gap-3 text-body-sm text-ink-500 font-medium mb-2">
                  <span className="tabular-nums">
                    Card {sessionIndex + 1} of {reviewWords.length}
                  </span>
                  <Badge variant={dueWordIds.length > 0 ? 'amber' : 'brand'} uppercase>
                    {dueWordIds.length > 0 ? 'Due for SRS review' : 'Daily practice'}
                  </Badge>
                </div>

                {/* Interactive Flashcard — the flip is a real button, not a click
                    handler on the card that wraps the audio buttons. */}
                <Card padding="lg" className="min-h-72 flex flex-col text-center">
                  <div className="flex items-center justify-between gap-3">
                    <Badge variant="brand" uppercase>
                      {isFlipped ? 'Translation' : 'Target Word'}
                    </Badge>
                    <AudioControls
                      text={currentWord.word}
                      lang={currentLang}
                      speech={speech}
                    />
                  </div>

                  <div className="my-auto py-6">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={isFlipped ? 'answer' : 'prompt'}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18, ease: transitionEase }}
                      >
                        <h2 className="font-display font-bold text-display-md text-ink-900 mb-2">
                          {isFlipped ? currentWord.translation : currentWord.word}
                        </h2>
                        {!isFlipped && currentWord.pronunciation && (
                          <p className="text-body-sm text-ink-500 font-medium">
                            /{currentWord.pronunciation}/
                          </p>
                        )}
                        {isFlipped && currentWord.example && (
                          <p className="mt-3 mx-auto max-w-xs p-2.5 rounded-button border border-brand-200 bg-brand-50 text-body-sm text-ink-700 italic">
                            "{currentWord.example}"
                          </p>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <Button
                    variant="outline"
                    shape="pill"
                    size="md"
                    fullWidth
                    icon={RotateCw}
                    aria-expanded={isFlipped}
                    onClick={() => setIsFlipped((f) => !f)}
                  >
                    {isFlipped ? 'Show the target word' : 'Flip card'}
                  </Button>
                </Card>

                {/* Quality Ratings (SM-2 Spaced Repetition) */}
                <div className="mt-6">
                  <p className="text-overline uppercase text-center text-ink-700 mb-3">
                    How well did you recall this word?
                  </p>

                  <div className="grid grid-cols-3 gap-2.5">
                    <Button variant="danger" size="lg" fullWidth onClick={() => handleRate(1)}>
                      <span className="block leading-tight">
                        <span className="block font-bold">Hard</span>
                        <span className="block text-caption font-medium opacity-90">Need review</span>
                      </span>
                    </Button>

                    <Button variant="outline" size="lg" fullWidth onClick={() => handleRate(3)}>
                      <span className="block leading-tight">
                        <span className="block font-bold">Good</span>
                        <span className="block text-caption font-medium text-ink-500">Recalled</span>
                      </span>
                    </Button>

                    <Button size="lg" fullWidth onClick={() => handleRate(5)}>
                      <span className="block leading-tight">
                        <span className="block font-bold">Easy</span>
                        <span className="block text-caption font-medium opacity-90">Mastered</span>
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <Card padding="lg" className="max-w-md mx-auto text-center">
                <div className="w-16 h-16 rounded-pill bg-brand-50 border border-brand-200 text-brand-700 mx-auto flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
                </div>
                <h2 className="font-display font-bold text-display-sm text-ink-900 mb-2">
                  Session Complete!
                </h2>
                <p className="text-body-sm text-ink-500 mb-6">
                  You reviewed all cards for today. Your spaced repetition schedule has been updated!
                </p>
                <Button shape="pill" size="lg" onClick={handleResetSession}>
                  Review Again
                </Button>
              </Card>
            )}
          </div>
        )}

        {/* ── TAB 2: Speed Drills & Practice Quiz ── */}
        {activeTab === 'quiz' && (
          <div
            role="tabpanel"
            id={practiceIds.panelId('quiz')}
            aria-labelledby={practiceIds.tabId('quiz')}
            className="max-w-2xl mx-auto space-y-6"
          >
            {/* Level Filter Bar */}
            <Card padding="sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-overline uppercase text-ink-700">Target level</span>
                <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter drills by level">
                  {['All', 'A1', 'A2', 'B1'].map((lvl) => (
                    <Chip
                      key={lvl}
                      size="sm"
                      tone="card"
                      selected={drillLevel === lvl}
                      onClick={() => {
                        setDrillLevel(lvl);
                        handleDrillReset();
                      }}
                    >
                      {lvl === 'All' ? 'All levels' : lvl}
                    </Chip>
                  ))}
                </div>
              </div>
            </Card>

            {!drillFinished && currentDrillQ ? (
              <Card padding="md" className="sm:p-8">
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-body-sm text-ink-500">
                    <Badge variant="brand" uppercase>
                      Level {currentDrillQ.level} • {currentDrillQ.lessonTitle}
                    </Badge>
                    <span className="tabular-nums">
                      Question {drillIndex + 1} of {drillQuestions.length}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-display-sm text-ink-900 leading-snug">
                    {currentDrillQ.question}
                  </h3>

                  <AnswerOptions
                    options={currentDrillQ.options}
                    correctIndex={currentDrillQ.correctIndex}
                    selectedIndex={drillSelected}
                    answered={drillAnswered}
                    onSelect={handleDrillAnswer}
                    label={`Answer options for: ${currentDrillQ.question}`}
                  />

                  {/* Explanation on answered */}
                  {drillAnswered && (
                    <VerdictPanel
                      tone={drillSelected === currentDrillQ.correctIndex ? 'success' : 'error'}
                      onNext={handleDrillNext}
                      nextLabel={drillIndex + 1 === drillQuestions.length ? 'See Results' : 'Next Question'}
                    >
                      <span className="font-bold text-ink-900 block mb-0.5">
                        {drillSelected === currentDrillQ.correctIndex ? 'Correct answer' : 'Explanation'}
                      </span>
                      {currentDrillQ.explanation || 'Excellent grammar application.'}
                    </VerdictPanel>
                  )}
                </div>
              </Card>
            ) : (
              <Card padding="lg" className="text-center">
                <div className="w-16 h-16 rounded-card bg-amber-50 border border-amber-200 text-amber-700 mx-auto flex items-center justify-center mb-4">
                  <Trophy className="w-8 h-8" aria-hidden="true" />
                </div>
                <h3 className="font-display font-bold text-display-sm text-ink-900 mb-1">
                  Speed Drill Completed!
                </h3>
                <p className="text-body-sm text-ink-500 mb-6">
                  You scored{' '}
                  <strong className="text-ink-900 tabular-nums">{drillScore}</strong> out of{' '}
                  <strong className="text-ink-900 tabular-nums">{drillQuestions.length}</strong>{' '}
                  <span className="tabular-nums">
                    ({Math.round((drillScore / Math.max(1, drillQuestions.length)) * 100)}%)
                  </span>
                </p>
                <Button shape="pill" size="lg" onClick={handleDrillReset}>
                  Start Another Drill
                </Button>
              </Card>
            )}
          </div>
        )}

        {/* ── TAB 3: Listening Ear Training Studio ── */}
        {activeTab === 'listening' && (
          <div
            role="tabpanel"
            id={practiceIds.panelId('listening')}
            aria-labelledby={practiceIds.tabId('listening')}
            className="max-w-2xl mx-auto space-y-6"
          >
            {currentListenQ ? (
              <Card padding="md" className="sm:p-8">
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-body-sm text-ink-500">
                    <Badge variant="brand" uppercase>
                      Level {currentListenQ.level} • {currentListenQ.examTitle}
                    </Badge>
                    <span className="tabular-nums">
                      Audio Task {listenIndex + 1} of {listeningExercises.length}
                    </span>
                  </div>

                  {/* Audio Player Controls */}
                  <Card tone="brand" padding="md" className="text-center">
                    <div className="space-y-3">
                      <div className="w-14 h-14 rounded-pill bg-brand-700 text-white mx-auto flex items-center justify-center">
                        <Headphones className="w-7 h-7" aria-hidden="true" />
                      </div>
                      <h4 className="font-display font-bold text-display-xs text-ink-900">
                        Listen to the Native Dialogue
                      </h4>
                      <p className="text-caption text-ink-700">
                        Play the clip, then choose what you heard. Turtle mode reads it at 0.65x.
                      </p>
                      <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                        <Button size="md" icon={Volume2} onClick={() => speech?.speak(currentListenQ.audioScript, currentLang)}>
                          Normal Audio (1x)
                        </Button>
                        <Button
                          variant="outline"
                          size="md"
                          icon={Turtle}
                          onClick={() => speech?.speakSlow(currentListenQ.audioScript, currentLang)}
                        >
                          Turtle Mode (0.65x)
                        </Button>
                      </div>
                    </div>
                  </Card>

                  <p className="font-semibold text-body-lg text-ink-900">{currentListenQ.prompt}</p>

                  <AnswerOptions
                    options={currentListenQ.options}
                    correctIndex={currentListenQ.correctIndex}
                    selectedIndex={listenSelected}
                    answered={listenAnswered}
                    onSelect={handleListenAnswer}
                    label={`Answer options for: ${currentListenQ.prompt}`}
                  />

                  {listenAnswered && (
                    <VerdictPanel
                      tone={listenSelected === currentListenQ.correctIndex ? 'success' : 'error'}
                      onNext={
                        listenIndex + 1 < listeningExercises.length
                          ? () => {
                              setListenIndex((i) => i + 1);
                              setListenAnswered(false);
                              setListenSelected(null);
                            }
                          : undefined
                      }
                      nextLabel="Next Audio Clip"
                    >
                      {currentListenQ.explanation}
                    </VerdictPanel>
                  )}
                </div>
              </Card>
            ) : (
              /* Empty state — the page had no way to say "nothing here". */
              <Card padding="lg" tone="quiet" className="text-center">
                <div className="w-14 h-14 rounded-pill bg-surface-200 text-ink-700 mx-auto flex items-center justify-center mb-4">
                  <Headphones className="w-7 h-7" aria-hidden="true" />
                </div>
                <h3 className="font-display font-bold text-display-xs text-ink-900 mb-1">
                  No listening exercises yet
                </h3>
                <p className="text-body-sm text-ink-500 max-w-sm mx-auto">
                  Ear training pulls its clips from the listening sections of the official mock exams. Start a{' '}
                  {currentLang === 'ja' ? 'JLPT' : 'CEFR'} mock exam to unlock them here.
                </p>
              </Card>
            )}
          </div>
        )}

        {/* ── TAB 4: Searchable Vocabulary Library ── */}
        {activeTab === 'words' && (
          <div
            role="tabpanel"
            id={practiceIds.panelId('words')}
            aria-labelledby={practiceIds.tabId('words')}
            className="space-y-4"
          >
            <Input
              srOnlyLabel="Search the vocabulary library"
              type="search"
              icon={Search}
              placeholder="Search word or translation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="lg"
              className="max-w-md"
            />

            <p className="text-body-sm text-ink-500" role="status" aria-live="polite">
              Showing <span className="tabular-nums font-semibold text-ink-700">{filteredWords.length}</span> of{' '}
              <span className="tabular-nums font-semibold text-ink-700">{allVocabWords.length}</span> words
              {searchQuery.trim() ? ` for “${searchQuery.trim()}”` : ''}.
            </p>

            {filteredWords.length === 0 ? (
              <Card padding="lg" tone="quiet" className="text-center">
                <div className="w-14 h-14 rounded-pill bg-surface-200 text-ink-700 mx-auto flex items-center justify-center mb-4">
                  <Search className="w-7 h-7" aria-hidden="true" />
                </div>
                <h3 className="font-display font-bold text-display-xs text-ink-900 mb-1">
                  No matches for “{searchQuery.trim()}”
                </h3>
                <p className="text-body-sm text-ink-500 mb-4">
                  Try a shorter word, or the translation instead of the term.
                </p>
                <Button variant="outline" shape="pill" size="md" onClick={() => setSearchQuery('')}>
                  Clear search
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {filteredWords.map((item) => {
                  const srsRecord = progress.wordProgress?.[item.id];
                  const isMastered = srsRecord && srsRecord.repetitions >= 3;

                  return (
                    <Card key={item.id} padding="sm" className="flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <Badge variant="outline">{item.level}</Badge>
                          <AudioControls
                            text={item.word}
                            lang={currentLang}
                            speech={speech}
                          />
                        </div>

                        <h3 className="font-display font-bold text-display-xs text-ink-900 mb-0.5">
                          {item.word}
                        </h3>
                        {item.pronunciation && (
                          <p className="text-body-sm text-ink-500 mb-2">/{item.pronunciation}/</p>
                        )}
                        <p className="text-body-md font-medium text-brand-800">{item.translation}</p>
                        <p className="text-caption text-ink-500 mt-2">
                          from {item.lessonTitle}
                        </p>
                      </div>

                      <div className="mt-3 pt-3 border-t border-ink-200 flex items-center justify-between gap-2 text-caption text-ink-700">
                        <span>
                          {srsRecord
                            ? `Repetitions: ${srsRecord.repetitions}`
                            : 'New word'}
                        </span>
                        {isMastered && (
                          <Badge variant="success" icon={Check}>
                            Mastered
                          </Badge>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
