/**
 * @file Practice.jsx
 * @description Multi-modal language practice arena featuring:
 * 1. Spaced Repetition (SRS) Flashcard Gym
 * 2. Speed Drills & Quick Practice Quizzes (with level filters A1/N5, A2/N4, B1/N3)
 * 3. Listening Ear Training Studio (with normal & turtle audio)
 * 4. Searchable Master Vocabulary Library
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Repeat,
  Volume2,
  Turtle,
  Sparkles,
  CheckCircle2,
  Clock,
  BookOpen,
  Search,
  Filter,
  Check,
  RotateCw,
  Trophy,
  Zap,
  Headphones,
  Award,
  AlertCircle,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import { useUser } from '../context/UserContext';
import { lessonsByLanguage } from '../data/lessons';
import { getExamsByLanguage } from '../data/exams';
import languages from '../data/languages';
import { playCorrect, playIncorrect, playClick } from '../utils/soundEffects';

const transitionEase = [0.16, 1, 0.3, 1];

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
        {/* ── Page Header ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-display-md text-ink-900 flex items-center gap-2">
              <Repeat className="w-8 h-8 text-brand-600" />
              Practice & Training Arena
            </h1>
            <p className="text-body-md text-ink-500 mt-1">
              Active spaced repetition, speed drills, ear training, and vocabulary reinforcement for {langData?.name} {langData?.flag}.
            </p>
          </div>

          {/* Practice Mode Tab Selector */}
          <div className="flex flex-wrap gap-1 p-1 bg-ink-100 rounded-pill border border-ink-200 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('review')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-pill text-xs font-semibold transition-all ${
                activeTab === 'review'
                  ? 'bg-white text-brand-700 shadow-soft-sm'
                  : 'text-ink-600 hover:text-ink-900'
              }`}
            >
              <Sparkles size={14} /> Flashcards ({dueWordIds.length} Due)
            </button>

            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-pill text-xs font-semibold transition-all ${
                activeTab === 'quiz'
                  ? 'bg-white text-brand-700 shadow-soft-sm'
                  : 'text-ink-600 hover:text-ink-900'
              }`}
            >
              <Zap size={14} /> Speed Drills
            </button>

            <button
              onClick={() => setActiveTab('listening')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-pill text-xs font-semibold transition-all ${
                activeTab === 'listening'
                  ? 'bg-white text-brand-700 shadow-soft-sm'
                  : 'text-ink-600 hover:text-ink-900'
              }`}
            >
              <Headphones size={14} /> Ear Training
            </button>

            <button
              onClick={() => setActiveTab('words')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-pill text-xs font-semibold transition-all ${
                activeTab === 'words'
                  ? 'bg-white text-brand-700 shadow-soft-sm'
                  : 'text-ink-600 hover:text-ink-900'
              }`}
            >
              <BookOpen size={14} /> Word Library ({allVocabWords.length})
            </button>
          </div>
        </div>

        {/* ── TAB 1: Spaced Repetition (SRS) Flashcard Gym ── */}
        {activeTab === 'review' && (
          <div>
            {!sessionFinished && currentWord ? (
              <div className="max-w-md mx-auto">
                <div className="flex items-center justify-between text-xs text-ink-400 font-semibold mb-2">
                  <span>
                    Card {sessionIndex + 1} of {reviewWords.length}
                  </span>
                  <span className="text-brand-600 font-bold">
                    {dueWordIds.length > 0 ? 'Due for SRS review' : 'Daily practice'}
                  </span>
                </div>

                {/* Interactive Flashcard */}
                <div
                  onClick={() => setIsFlipped((f) => !f)}
                  className="bg-white rounded-card p-8 border-2 border-brand-200 shadow-soft-lg min-h-[300px] flex flex-col justify-between items-center text-center cursor-pointer select-none transition-all hover:border-brand-400 relative"
                >
                  <div className="w-full flex justify-between items-center">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-pill">
                      {isFlipped ? 'Translation' : 'Target Word'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          speech?.speak(currentWord.word, currentLang);
                        }}
                        className="p-1.5 rounded-full hover:bg-brand-50 text-brand-700 transition-colors"
                        title="Normal speed audio"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          speech?.speakSlow(currentWord.word, currentLang);
                        }}
                        className="p-1.5 rounded-full hover:bg-amber-50 text-amber-700 transition-colors"
                        title="Turtle mode (slow 0.65x speed)"
                      >
                        <Turtle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="my-auto py-6">
                    <h2 className="font-display font-bold text-4xl text-ink-900 mb-2">
                      {isFlipped ? currentWord.translation : currentWord.word}
                    </h2>
                    {!isFlipped && currentWord.pronunciation && (
                      <p className="text-sm text-ink-500 font-medium">/{currentWord.pronunciation}/</p>
                    )}
                    {isFlipped && currentWord.example && (
                      <p className="text-xs text-ink-500 italic mt-3 bg-brand-50/50 p-2.5 rounded-xl border border-brand-100 max-w-xs">
                        "{currentWord.example}"
                      </p>
                    )}
                  </div>

                  <p className="text-xs text-ink-400 flex items-center gap-1">
                    <RotateCw className="w-3.5 h-3.5" /> Tap card to flip
                  </p>
                </div>

                {/* Quality Ratings (SM-2 Spaced Repetition) */}
                <div className="mt-6">
                  <p className="text-xs font-semibold text-center uppercase tracking-wide text-ink-400 mb-3">
                    How well did you recall this word?
                  </p>

                  <div className="grid grid-cols-3 gap-2.5">
                    <button
                      onClick={() => handleRate(1)}
                      className="py-3 px-2 rounded-card border-2 border-red-200 bg-red-50/60 hover:bg-red-100 text-red-900 font-medium text-xs text-center transition-all active:scale-95"
                    >
                      <span className="block font-bold text-sm mb-0.5">Hard</span>
                      Need review
                    </button>

                    <button
                      onClick={() => handleRate(3)}
                      className="py-3 px-2 rounded-card border-2 border-amber-200 bg-amber-50/60 hover:bg-amber-100 text-amber-900 font-medium text-xs text-center transition-all active:scale-95"
                    >
                      <span className="block font-bold text-sm mb-0.5">Good</span>
                      Recalled
                    </button>

                    <button
                      onClick={() => handleRate(5)}
                      className="py-3 px-2 rounded-card border-2 border-brand-200 bg-brand-50/60 hover:bg-brand-100 text-brand-900 font-medium text-xs text-center transition-all active:scale-95"
                    >
                      <span className="block font-bold text-sm mb-0.5">Easy</span>
                      Mastered
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-md mx-auto text-center py-12 px-6 bg-white rounded-card border border-ink-200/80 shadow-soft-sm">
                <div className="w-16 h-16 rounded-full bg-brand-100 text-brand-700 mx-auto flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="font-display font-bold text-2xl text-ink-900 mb-2">
                  Session Complete! 🎉
                </h2>
                <p className="text-sm text-ink-500 mb-6">
                  You reviewed all cards for today. Your spaced repetition schedule has been updated!
                </p>
                <button
                  onClick={handleResetSession}
                  className="px-6 py-2.5 rounded-pill bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm transition-all"
                >
                  Review Again
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 2: Speed Drills & Practice Quiz ── */}
        {activeTab === 'quiz' && (
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Level Filter Bar */}
            <div className="flex items-center justify-between bg-white p-3 rounded-card border border-ink-200/80 shadow-soft-xs">
              <span className="text-xs font-bold text-ink-700 uppercase tracking-wide">
                Target Level:
              </span>
              <div className="flex gap-1">
                {['All', 'A1', 'A2', 'B1'].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => {
                      setDrillLevel(lvl);
                      handleDrillReset();
                    }}
                    className={`px-3 py-1 rounded-pill text-xs font-semibold transition-all ${
                      drillLevel === lvl
                        ? 'bg-brand-600 text-white shadow-soft-sm'
                        : 'bg-ink-100 text-ink-600 hover:bg-ink-200'
                    }`}
                  >
                    {lvl === 'All' ? 'All Levels' : lvl}
                  </button>
                ))}
              </div>
            </div>

            {!drillFinished && currentDrillQ ? (
              <div className="bg-white rounded-card p-6 sm:p-8 border border-ink-200/80 shadow-soft-md space-y-6">
                <div className="flex items-center justify-between text-xs text-ink-400 font-semibold">
                  <span className="text-brand-700 font-bold uppercase">
                    Level {currentDrillQ.level} • {currentDrillQ.lessonTitle}
                  </span>
                  <span>
                    Question {drillIndex + 1} of {drillQuestions.length}
                  </span>
                </div>

                <h3 className="font-display font-bold text-xl sm:text-2xl text-ink-900 leading-snug">
                  {currentDrillQ.question}
                </h3>

                <div className="space-y-2.5">
                  {currentDrillQ.options.map((opt, idx) => {
                    const isSelected = drillSelected === idx;
                    const isCorrect = idx === currentDrillQ.correctIndex;

                    let btnStyle = 'border-ink-200 hover:border-brand-400 bg-white text-ink-800';
                    if (drillAnswered) {
                      if (isCorrect) {
                        btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                      } else if (isSelected) {
                        btnStyle = 'border-red-500 bg-red-50 text-red-900';
                      } else {
                        btnStyle = 'border-ink-100 opacity-50 bg-white text-ink-400';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={drillAnswered}
                        onClick={() => handleDrillAnswer(idx)}
                        className={`w-full p-4 rounded-xl text-left border-2 text-sm font-medium flex items-center justify-between transition-all ${btnStyle}`}
                      >
                        <span>
                          {String.fromCharCode(65 + idx)}. {opt}
                        </span>
                        {drillAnswered && isCorrect && (
                          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                        )}
                        {drillAnswered && isSelected && !isCorrect && (
                          <AlertCircle size={16} className="text-red-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation on answered */}
                {drillAnswered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-brand-50/80 border border-brand-200 text-xs text-brand-900 space-y-3"
                  >
                    <div>
                      <span className="font-bold block mb-0.5">Answer Explanation:</span>
                      {currentDrillQ.explanation || 'Excellent grammar application.'}
                    </div>

                    <button
                      type="button"
                      onClick={handleDrillNext}
                      className="px-5 py-2 rounded-pill bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-soft-sm inline-flex items-center gap-1.5"
                    >
                      {drillIndex + 1 === drillQuestions.length ? 'See Results' : 'Next Question'}
                      <ArrowRight size={14} />
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-card p-8 border border-ink-200/80 shadow-soft-md text-center">
                <Trophy className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                <h3 className="font-display font-bold text-2xl text-ink-900 mb-1">
                  Speed Drill Completed!
                </h3>
                <p className="text-sm text-ink-500 mb-6">
                  You scored <strong>{drillScore}</strong> out of{' '}
                  <strong>{drillQuestions.length}</strong> ({Math.round((drillScore / Math.max(1, drillQuestions.length)) * 100)}%)
                </p>
                <button
                  type="button"
                  onClick={handleDrillReset}
                  className="px-6 py-2.5 rounded-pill bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-soft-sm"
                >
                  Start Another Drill
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 3: Listening Ear Training Studio ── */}
        {activeTab === 'listening' && (
          <div className="max-w-2xl mx-auto space-y-6">
            {currentListenQ ? (
              <div className="bg-white rounded-card p-6 sm:p-8 border border-ink-200/80 shadow-soft-md space-y-6">
                <div className="flex items-center justify-between text-xs text-ink-400 font-semibold">
                  <span className="text-brand-700 font-bold uppercase">
                    Level {currentListenQ.level} • {currentListenQ.examTitle}
                  </span>
                  <span>
                    Audio Task {listenIndex + 1} of {listeningExercises.length}
                  </span>
                </div>

                {/* Audio Player Controls */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-brand-50 to-amber-50/40 border border-brand-200 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-brand-600 text-white mx-auto flex items-center justify-center shadow-soft-sm">
                    <Headphones className="w-7 h-7" />
                  </div>
                  <h4 className="font-display font-bold text-lg text-ink-900">
                    Listen to the Native Dialogue
                  </h4>
                  <div className="flex items-center justify-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => speech?.speak(currentListenQ.audioScript, currentLang)}
                      className="px-4 py-2 rounded-pill bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-soft-sm active:scale-95"
                    >
                      <Volume2 size={15} /> Normal Audio (1x)
                    </button>
                    <button
                      type="button"
                      onClick={() => speech?.speakSlow(currentListenQ.audioScript, currentLang)}
                      className="px-4 py-2 rounded-pill bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold text-xs flex items-center gap-1.5 shadow-soft-sm active:scale-95"
                    >
                      <Turtle size={15} /> Turtle Mode (0.65x)
                    </button>
                  </div>
                </div>

                <p className="font-semibold text-base text-ink-900">
                  {currentListenQ.prompt}
                </p>

                <div className="space-y-2.5">
                  {currentListenQ.options.map((opt, idx) => {
                    const isSelected = listenSelected === idx;
                    const isCorrect = idx === currentListenQ.correctIndex;

                    let btnStyle = 'border-ink-200 hover:border-brand-400 bg-white text-ink-800';
                    if (listenAnswered) {
                      if (isCorrect) {
                        btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                      } else if (isSelected) {
                        btnStyle = 'border-red-500 bg-red-50 text-red-900';
                      } else {
                        btnStyle = 'border-ink-100 opacity-50 bg-white text-ink-400';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={listenAnswered}
                        onClick={() => handleListenAnswer(idx)}
                        className={`w-full p-4 rounded-xl text-left border-2 text-sm font-medium flex items-center justify-between transition-all ${btnStyle}`}
                      >
                        <span>
                          {String.fromCharCode(65 + idx)}. {opt}
                        </span>
                        {listenAnswered && isCorrect && (
                          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                        )}
                        {listenAnswered && isSelected && !isCorrect && (
                          <AlertCircle size={16} className="text-red-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {listenAnswered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-brand-50 border border-brand-200 text-xs text-brand-900 space-y-3"
                  >
                    <p>{currentListenQ.explanation}</p>
                    {listenIndex + 1 < listeningExercises.length && (
                      <button
                        type="button"
                        onClick={() => {
                          setListenIndex((i) => i + 1);
                          setListenAnswered(false);
                          setListenSelected(null);
                        }}
                        className="px-5 py-2 rounded-pill bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-soft-sm inline-flex items-center gap-1.5"
                      >
                        Next Audio Clip <ArrowRight size={14} />
                      </button>
                    )}
                  </motion.div>
                )}
              </div>
            ) : (
              <p className="text-center text-sm text-ink-500 py-12">
                No listening exercises found.
              </p>
            )}
          </div>
        )}

        {/* ── TAB 4: Searchable Vocabulary Library ── */}
        {activeTab === 'words' && (
          <div className="space-y-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search word or translation..."
                className="w-full pl-10 pr-4 py-2.5 rounded-pill border border-ink-200 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {filteredWords.map((item) => {
                const srsRecord = progress.wordProgress?.[item.id];
                const isMastered = srsRecord && srsRecord.repetitions >= 3;

                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-card bg-white border border-ink-200/60 shadow-soft-sm hover:shadow-soft-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-semibold uppercase text-ink-400 tracking-wider">
                          {item.level} • {item.lessonTitle}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => speech?.speak(item.word, currentLang)}
                            className="p-1 text-brand-600 hover:bg-brand-50 rounded-full transition-colors"
                            title="Normal audio"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => speech?.speakSlow(item.word, currentLang)}
                            className="p-1 text-amber-600 hover:bg-amber-50 rounded-full transition-colors"
                            title="Turtle slow audio"
                          >
                            <Turtle className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h3 className="font-display font-bold text-xl text-ink-900 mb-0.5">
                        {item.word}
                      </h3>
                      {item.pronunciation && (
                        <p className="text-xs text-ink-500 mb-2">/{item.pronunciation}/</p>
                      )}
                      <p className="text-sm font-medium text-brand-800">{item.translation}</p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-ink-100 flex items-center justify-between text-xs text-ink-400">
                      <span>
                        {srsRecord ? `Repetitions: ${srsRecord.repetitions}` : 'New word'}
                      </span>
                      {isMastered && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-pill">
                          <Check className="w-3 h-3" /> Mastered
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
