/**
 * @file LessonPlayer.jsx
 * @description Fullscreen interactive lesson player with progress bar, hearts system,
 * dynamic exercise runner, instant feedback, and gamified summary completion screen.
 *
 * Design notes:
 * - Every surface here is a kit component. The first build hand-rolled its own
 *   dialogs (`bg-white rounded-card p-8 border-red-200`), its own progress track
 *   (`bg-ink-100` + a brand-500→brand-400 gradient) and its own buttons, which is
 *   where the off-palette greens, reds and oranges entered. Card / Badge / Button /
 *   ProgressBar now own those decisions.
 * - The header progress fill was `brand-400` on a light track — 1.9:1, a WCAG 2.1
 *   §1.4.11 failure. ProgressBar's fill tiers are pre-measured against `ink-200`,
 *   so the bar is the compliance fix as well as the deduplication.
 * - `amber-400 → amber-500` behind a white trophy icon measured 2.15:1. The trophy
 *   now sits on a `brand`/`amber` 50-step tint with a `-700` glyph, the same
 *   convention the achievement cards use.
 * - Icon-only controls in the header are 44px (WCAG 2.1 §2.5.5 target size); the
 *   previous `p-2` variants measured 36px.
 * - Feedback colour is never carried by hue alone: the verdict chips pair the tone
 *   with an icon and a word, and the hearts row exposes its count to assistive tech.
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Heart,
  Zap,
  Flame,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Trophy,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { getLessonById } from '../data/lessons';
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
import { Badge, Button, Card, ProgressBar } from '../components/ui';
import { transitionEase } from '../utils/motion';

/* Icon-only header controls come from the kit: <Button size="lg" iconOnly> is a
   44x44 target (WCAG 2.1 §2.5.5) with the same focus ring as every other action,
   so the local 44px recipe that used to live here is gone. */

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
        <Card
          padding="lg"
          className="max-w-md w-full text-center relative z-10 shadow-soft-xl"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: transitionEase }}
        >
          {/* Trophy Header — tinted plate + `-700` glyph; white on amber-400 measured 2.15:1. */}
          <div className="w-20 h-20 rounded-card bg-amber-50 border border-amber-200 mx-auto flex items-center justify-center text-amber-700 mb-6">
            <Trophy className="w-10 h-10" aria-hidden="true" />
          </div>

          <Badge variant="brand" uppercase className="mb-2">
            Lesson Finished
          </Badge>

          <h1 className="font-display font-bold text-display-md text-ink-900 mb-2">
            Awesome Work!
          </h1>
          <p className="text-body-sm text-ink-500 mb-6">
            You completed <strong className="text-ink-700 font-semibold">{lesson.title}</strong>
          </p>

          {/* Stats Bento */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="bg-amber-50 border border-amber-200 rounded-card p-3">
              <Zap className="w-5 h-5 text-amber-700 mx-auto mb-1" aria-hidden="true" />
              <p className="font-display font-bold text-display-xs text-ink-900 tabular-nums">+{earnedXP}</p>
              <p className="text-caption text-ink-500">XP Earned</p>
            </div>

            <div className="bg-brand-50 border border-brand-200 rounded-card p-3">
              <CheckCircle2 className="w-5 h-5 text-brand-700 mx-auto mb-1" aria-hidden="true" />
              <p className="font-display font-bold text-display-xs text-ink-900 tabular-nums">{percentage}%</p>
              <p className="text-caption text-ink-500">Accuracy</p>
            </div>

            <div className="bg-coral-50 border border-coral-200 rounded-card p-3">
              <Flame className="w-5 h-5 text-coral-700 mx-auto mb-1" aria-hidden="true" />
              <p className="font-display font-bold text-display-xs text-ink-900 tabular-nums">
                {streak.currentStreak}
              </p>
              <p className="text-caption text-ink-500">Day Streak</p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col gap-3">
            <Button
              shape="pill"
              size="lg"
              fullWidth
              icon={ArrowRight}
              iconPosition="right"
              onClick={() => navigate('/dashboard')}
            >
              Continue to Dashboard
            </Button>

            <Button variant="outline" shape="pill" size="lg" fullWidth onClick={handleRetry}>
              Practice Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // ── Out of Lives / Hearts Screen ─────────────────────────────────────────
  if (hearts === 0) {
    return (
      <div className="min-h-screen bg-surface-bg flex flex-col items-center justify-center p-4">
        <Card
          tone="error"
          padding="lg"
          className="max-w-md w-full text-center shadow-soft-xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: transitionEase }}
        >
          <div className="w-16 h-16 rounded-pill bg-surface-card border border-error-border mx-auto flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 fill-error text-error" aria-hidden="true" />
          </div>
          <h2 className="font-display font-bold text-display-sm text-ink-900 mb-2">
            Out of Hearts!
          </h2>
          <p className="text-body-sm text-ink-700 mb-6 leading-relaxed">
            Don't worry — language learning is built on making mistakes. Take a deep breath and give it another try!
          </p>
          <div className="flex gap-3">
            <Button shape="pill" size="lg" fullWidth onClick={handleRetry}>
              Try Again
            </Button>
            <Button variant="outline" shape="pill" size="lg" fullWidth onClick={() => navigate('/dashboard')}>
              Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // ── Main Lesson Flow ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-surface-bg flex flex-col justify-between">
      {/* ── Top Bar ── */}
      <header className="px-4 sm:px-6 h-16 border-b border-ink-200 bg-surface-card flex items-center justify-between gap-4">
        {/* Close Button */}
        <Button
          variant="outline"
          size="lg"
          iconOnly
          icon={X}
          onClick={() => navigate('/lessons')}
          aria-label="Exit lesson"
        />

        {/* Lesson identity. The compact quiz header never had a heading at all, so
            screen-reader users landed on a page whose only name was "Exit lesson".
            Visible from `sm` up; on a phone it stays in the accessible tree via
            `sr-only` rather than stealing width from the progress bar. */}
        <h1 className="sr-only sm:not-sr-only sm:min-w-0 sm:truncate font-display font-bold text-body-md text-ink-900">
          {lesson.title}
        </h1>

        {/* Progress — kit ProgressBar: the brand-500→brand-400 gradient this
            replaced measured 1.9:1 against its track (WCAG 2.1 §1.4.11). */}
        <div className="flex-1 max-w-xl mx-2 min-w-0">
          <ProgressBar
            value={progressPercent}
            max={100}
            size="md"
            color="brand"
            label="Lesson progress"
            valueText={`Exercise ${currentIndex + 1} of ${exercises.length}`}
          />
        </div>

        {/* Right Header Actions: Sound Toggle + Hearts */}
        <div className="flex items-center gap-3">
          {/* Sound FX Toggle — `tint` when on, neutral outline when off. The two
              states used to be hand-written class strings stacked on a local
              ICON_BTN recipe, which is also what made its idle label ink-500
              (4.6:1) instead of the kit's stronger tone. */}
          <Button
            variant={soundOn ? 'tint' : 'outline'}
            size="lg"
            iconOnly
            icon={soundOn ? Volume2 : VolumeX}
            onClick={handleToggleSound}
            aria-pressed={soundOn}
            aria-label={soundOn ? 'Mute sound effects' : 'Enable sound effects'}
          />

          {/* Hearts indicator — role="img" so the count is announced as one value
              instead of three unnamed glyphs. */}
          <div
            className="flex items-center gap-1.5"
            role="img"
            aria-label={`${hearts} of 3 hearts remaining`}
          >
            {Array.from({ length: 3 }, (_, i) => (
              <Heart
                key={i}
                aria-hidden="true"
                className={`w-5 h-5 transition-transform ${
                  i < hearts
                    ? 'text-error fill-error scale-100'
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
            ? 'bg-surface-card border-ink-200'
            : currentCorrect
            ? 'bg-success-bg border-success-border'
            : 'bg-error-bg border-error-border'
        }`}
      >
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          {/* Status Message — announced when the verdict changes. */}
          <div className="flex items-center gap-3" role="status" aria-live="polite">
            {currentAnswered ? (
              currentCorrect ? (
                <>
                  <div className="w-11 h-11 rounded-pill bg-surface-card border border-success-border flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-success-strong" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-body-lg text-success-strong">
                      Excellent!
                    </p>
                    <p className="text-body-sm text-ink-700">Ready for the next one</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-11 h-11 rounded-pill bg-surface-card border border-error-border flex items-center justify-center shrink-0">
                    <AlertCircle className="w-6 h-6 text-error-strong" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-body-lg text-error-strong">
                      Don't give up!
                    </p>
                    <p className="text-body-sm text-ink-700">Review and keep practicing</p>
                  </div>
                </>
              )
            ) : (
              <span className="text-body-sm text-ink-500">
                Exercise {currentIndex + 1} of {exercises.length}
              </span>
            )}
          </div>

          {/* Continue button */}
          <Button
            shape="pill"
            size="lg"
            variant={currentAnswered && !currentCorrect ? 'danger' : 'primary'}
            disabled={!currentAnswered}
            icon={ArrowRight}
            iconPosition="right"
            onClick={handleContinue}
          >
            {currentIndex + 1 === exercises.length ? 'Finish Lesson' : 'Continue'}
          </Button>
        </div>
      </footer>
    </div>
  );
}

