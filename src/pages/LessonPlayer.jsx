/**
 * @file LessonPlayer.jsx
 * @description Fullscreen interactive lesson player with progress bar, hearts system,
 * dynamic exercise runner, instant feedback, and gamified summary completion screen.
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Heart,
  Zap,
  Flame,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Trophy,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { getLessonById, lessonsByLanguage } from '../data/lessons';
import ExerciseRenderer from '../components/lesson/ExerciseRenderer';
import { calculateXP } from '../utils/xp';
import {
  playCorrect,
  playIncorrect,
  playCelebration,
  playClick,
  isSoundEnabled,
  setSoundEnabled,
} from '../utils/soundEffects';
import Confetti from '../components/ui/Confetti';

const transitionEase = [0.16, 1, 0.3, 1];

export default function LessonPlayer() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { user, progress, streak, xp } = useUser();

  const lesson = useMemo(() => getLessonById(lessonId), [lessonId]);

  // Player state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [results, setResults] = useState([]); // array of booleans (correct/incorrect per exercise)
  const [currentAnswered, setCurrentAnswered] = useState(false);
  const [currentCorrect, setCurrentCorrect] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [soundOn, setSoundOn] = useState(isSoundEnabled());

  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundEnabled(next);
    setSoundOn(next);
    if (next) playClick();
  };

  // Vocabulary dictionary for fast lookup
  const vocabularyMap = useMemo(() => {
    if (!lesson?.vocabulary) return {};
    return lesson.vocabulary.reduce((acc, v) => {
      acc[v.id] = v;
      return acc;
    }, {});
  }, [lesson]);

  // If lesson doesn't exist, redirect to lessons overview
  useEffect(() => {
    if (!lesson) {
      navigate('/lessons', { replace: true });
    }
  }, [lesson, navigate]);

  if (!lesson) return null;

  const exercises = lesson.exercises || [];
  const currentExercise = exercises[currentIndex];
  const progressPercent = ((currentIndex) / exercises.length) * 100;

  // Exercise answer handler
  const handleAnswer = (isCorrect) => {
    setCurrentAnswered(true);
    setCurrentCorrect(isCorrect);

    if (isCorrect) {
      playCorrect();
    } else {
      playIncorrect();
      setHearts((h) => Math.max(0, h - 1));
    }
  };

  // Next exercise / finalize lesson
  const handleContinue = () => {
    const updatedResults = [...results, currentCorrect];
    setResults(updatedResults);

    if (currentIndex + 1 < exercises.length) {
      setCurrentIndex((i) => i + 1);
      setCurrentAnswered(false);
      setCurrentCorrect(null);
    } else {
      // Completed all exercises!
      finalizeLesson(updatedResults);
    }
  };

  const finalizeLesson = (finalResults) => {
    const correctCount = finalResults.filter(Boolean).length;
    const totalCount = finalResults.length;
    const score = totalCount > 0 ? correctCount / totalCount : 1;

    // Calculate XP
    const earnedXP = calculateXP(correctCount, totalCount, streak.currentStreak > 0);

    // Save progress
    progress.completeLesson(lesson.id, score);
    streak.recordActivity();
    xp.addXP(earnedXP);

    // Update spaced repetition records for words in this lesson
    if (lesson.vocabulary) {
      lesson.vocabulary.forEach((word) => {
        // Quality: 5 if answered cleanly, 3 if some mistakes
        const quality = score >= 0.8 ? 5 : 3;
        progress.updateWordProgress(word.id, quality);
      });
    }

    if (score >= 0.7) {
      playCelebration();
    }

    setIsCompleted(true);
  };

  // Restart attempt
  const handleRetry = () => {
    setCurrentIndex(0);
    setHearts(3);
    setResults([]);
    setCurrentAnswered(false);
    setCurrentCorrect(null);
    setIsCompleted(false);
  };

  // ── Finished / Summary View ──────────────────────────────────────────────
  if (isCompleted) {
    const correctCount = results.filter(Boolean).length;
    const totalCount = results.length;
    const percentage = Math.round((correctCount / totalCount) * 100);
    const earnedXP = calculateXP(correctCount, totalCount, streak.currentStreak > 0);

    return (
      <div className="min-h-screen bg-surface-bg flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {percentage >= 70 && <Confetti duration={4000} particleCount={120} />}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: transitionEase }}
          className="max-w-md w-full bg-white rounded-card p-8 border border-brand-200/80 shadow-soft-xl text-center relative z-10"
        >
          {/* Trophy Header */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 mx-auto flex items-center justify-center text-white shadow-glow-amber mb-6">
            <Trophy className="w-10 h-10" />
          </div>

          <span className="text-xs font-semibold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-pill inline-block mb-2">
            Lesson Finished
          </span>

          <h1 className="font-display font-bold text-3xl text-ink-900 mb-2">
            Awesome Work! 🎉
          </h1>
          <p className="text-ink-500 text-sm mb-6">
            You completed <strong>{lesson.title}</strong>
          </p>

          {/* Stats Bento */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="bg-amber-50/80 border border-amber-200/60 rounded-xl p-3">
              <Zap className="w-5 h-5 text-amber-500 mx-auto mb-1" />
              <p className="font-display font-bold text-lg text-ink-900">+{earnedXP}</p>
              <p className="text-[11px] text-ink-500 font-medium">XP Earned</p>
            </div>

            <div className="bg-brand-50/80 border border-brand-200/60 rounded-xl p-3">
              <CheckCircle2 className="w-5 h-5 text-brand-600 mx-auto mb-1" />
              <p className="font-display font-bold text-lg text-ink-900">{percentage}%</p>
              <p className="text-[11px] text-ink-500 font-medium">Accuracy</p>
            </div>

            <div className="bg-orange-50/80 border border-orange-200/60 rounded-xl p-3">
              <Flame className="w-5 h-5 text-orange-500 mx-auto mb-1" />
              <p className="font-display font-bold text-lg text-ink-900">
                {streak.currentStreak}
              </p>
              <p className="text-[11px] text-ink-500 font-medium">Day Streak</p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full py-3.5 px-6 rounded-pill bg-brand-600 hover:bg-brand-700 text-white font-semibold flex items-center justify-center gap-2 shadow-soft-sm hover:shadow-glow-brand transition-all active:scale-[0.98]"
            >
              Continue to Dashboard
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleRetry}
              className="w-full py-3 px-6 rounded-pill border border-ink-200 text-ink-700 hover:bg-ink-100 font-medium text-sm transition-colors"
            >
              Practice Again
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Out of Lives / Hearts Screen ─────────────────────────────────────────
  if (hearts === 0) {
    return (
      <div className="min-h-screen bg-surface-bg flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-card p-8 border border-red-200 shadow-soft-xl text-center"
        >
          <div className="w-16 h-16 rounded-full bg-red-100 mx-auto flex items-center justify-center text-red-500 mb-4">
            <Heart className="w-8 h-8 fill-red-500" />
          </div>
          <h2 className="font-display font-bold text-2xl text-ink-900 mb-2">
            Out of Hearts!
          </h2>
          <p className="text-ink-500 text-sm mb-6 leading-relaxed">
            Don't worry — language learning is built on making mistakes. Take a deep breath and give it another try!
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleRetry}
              className="flex-1 py-3 px-4 rounded-pill bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex-1 py-3 px-4 rounded-pill border border-ink-300 text-ink-700 hover:bg-ink-100 font-medium text-sm transition-colors"
            >
              Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Main Lesson Flow ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-surface-bg flex flex-col justify-between">
      {/* ── Top Bar ── */}
      <header className="px-4 sm:px-6 h-16 border-b border-ink-200/60 bg-white/80 backdrop-blur-md flex items-center justify-between gap-4">
        {/* Close Button */}
        <button
          onClick={() => navigate('/lessons')}
          className="p-2 rounded-full hover:bg-ink-100 text-ink-500 hover:text-ink-900 transition-colors"
          title="Exit lesson"
          aria-label="Exit lesson"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Progress Bar */}
        <div className="flex-1 max-w-xl mx-2">
          <div className="h-3 bg-ink-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.35, ease: transitionEase }}
            />
          </div>
        </div>

        {/* Right Header Actions: Sound Toggle + Hearts */}
        <div className="flex items-center gap-3">
          {/* Sound FX Toggle */}
          <button
            type="button"
            onClick={handleToggleSound}
            className={`p-2 rounded-full transition-colors ${
              soundOn
                ? 'text-brand-600 hover:bg-brand-50'
                : 'text-ink-400 hover:bg-ink-100'
            }`}
            title={soundOn ? 'Sound effects enabled' : 'Sound effects muted'}
            aria-label={soundOn ? 'Mute sound effects' : 'Enable sound effects'}
          >
            {soundOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* Hearts indicator */}
          <div className="flex items-center gap-1.5" aria-label={`${hearts} hearts remaining`}>
            {Array.from({ length: 3 }, (_, i) => (
              <Heart
                key={i}
                className={`w-5 h-5 transition-transform ${
                  i < hearts
                    ? 'text-red-500 fill-red-500 scale-100'
                    : 'text-ink-300 fill-transparent scale-90'
                }`}
              />
            ))}
          </div>
        </div>
      </header>

      {/* ── Main Exercise View ── */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 max-w-3xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35, ease: transitionEase }}
            className="w-full"
          >
            <ExerciseRenderer
              exercise={currentExercise}
              vocabularyMap={vocabularyMap}
              langCode={lesson.languageId}
              onAnswer={handleAnswer}
              disabled={currentAnswered}
            />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── Bottom Feedback Bar ── */}
      <footer
        className={`border-t p-4 sm:p-6 transition-colors duration-300 ${
          !currentAnswered
            ? 'bg-white border-ink-200/60'
            : currentCorrect
            ? 'bg-green-50/90 border-green-200'
            : 'bg-red-50/90 border-red-200'
        }`}
      >
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          {/* Status Message */}
          <div className="flex items-center gap-3">
            {currentAnswered ? (
              currentCorrect ? (
                <>
                  <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-green-900 text-base">
                      Excellent!
                    </p>
                    <p className="text-xs text-green-700">Ready for the next one</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-red-900 text-base">
                      Don't give up!
                    </p>
                    <p className="text-xs text-red-700">Review and keep practicing</p>
                  </div>
                </>
              )
            ) : (
              <span className="text-xs text-ink-400">
                Exercise {currentIndex + 1} of {exercises.length}
              </span>
            )}
          </div>

          {/* Continue button */}
          <button
            type="button"
            disabled={!currentAnswered}
            onClick={handleContinue}
            className={`px-8 py-3.5 rounded-pill font-semibold text-sm flex items-center gap-2 transition-all duration-200 ${
              !currentAnswered
                ? 'bg-ink-200 text-ink-400 cursor-not-allowed'
                : currentCorrect
                ? 'bg-green-600 hover:bg-green-700 text-white shadow-soft-sm active:scale-95'
                : 'bg-red-600 hover:bg-red-700 text-white shadow-soft-sm active:scale-95'
            }`}
          >
            {currentIndex + 1 === exercises.length ? 'Finish Lesson' : 'Continue'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}

