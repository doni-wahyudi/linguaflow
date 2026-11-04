/**
 * @file ExamPlayer.jsx
 * @description Fullscreen authentic examination simulator for CEFR and JLPT mock exams.
 * Features strict countdown timer, multi-section navigation, audio listening comprehension,
 * reading passage layouts, question review palette, and accredited Certificate generation.
 *
 * Design notes:
 * - Kit-only. The score report, section breakdown, certificate and both dialogs
 *   were hand-rolled, which is where `emerald-*`, `red-*`, `rounded-xl`,
 *   `text-[11px]` and four different "pass" greens came from.
 * - `shadow-soft-xs` (×2) and `text-amber-950` are not declared tokens, so they
 *   rendered as nothing at all; they now use `shadow-soft-sm` / `amber-800`.
 * - The countdown effect used to call `handleSubmitExam()` from inside the
 *   `setTimeRemaining` updater while its closure was pinned to the mount render,
 *   so a timed-out exam submitted against an empty answer map — a silent zero.
 *   The clock now only ticks; a separate effect submits with a latest-ref.
 * - Dialogs are the kit `Modal`, so they get the focus trap, the ref-counted
 *   scroll lock, Escape dismissal and a real accessible name. `dismissOnBackdrop`
 *   is off: an exam is exactly the context where a stray click must not destroy
 *   work.
 * - No emoji glyphs. The reading passage and the unanswered-questions warning use
 *   Lucide icons, matching the rest of the app.
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  X,
  Clock,
  Flag,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Volume2,
  Turtle,
  ArrowRight,
  ArrowLeft,
  Award,
  Trophy,
  ShieldCheck,
  Printer,
  HelpCircle,
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { getExamById } from '../data/exams';
import Confetti from '../components/ui/Confetti';
import { playCelebration, playIncorrect, playClick } from '../utils/soundEffects';
import { Badge, Button, Card, Modal, ProgressBar, SegmentedControl, segmentIds } from '../components/ui';

/* The score-report rail is the kit SegmentedControl; ids are generated from this
   namespace so the tabs and the panels agree (WCAG 1.3.1). */
const reportIds = segmentIds('exam-report');
const REPORT_TABS = [
  { id: 'result', label: 'Official Certificate' },
  { id: 'review', label: 'Answer Key Review' },
];

export default function ExamPlayer() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { user, progress, speech, streak, xp } = useUser();

  const exam = useMemo(() => getExamById(examId), [examId]);

  // Flatten questions with section metadata
  const allQuestions = useMemo(() => {
    if (!exam) return [];
    const flat = [];
    exam.sections.forEach((sec, secIdx) => {
      sec.questions.forEach((q, qIdx) => {
        flat.push({
          ...q,
          sectionId: sec.id,
          sectionName: sec.name,
          sectionWeight: sec.weight,
          sectionIndex: secIdx,
          sectionPassage: sec.passage,
          globalIndex: flat.length,
        });
      });
    });
    return flat;
  }, [exam]);

  // Exam runtime state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [questionId]: selectedOptionIndex }
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [timeRemaining, setTimeRemaining] = useState(
    exam ? exam.durationMinutes * 60 : 1200
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [listenCounts, setListenCounts] = useState({}); // { [questionId]: count }
  const [activeTab, setActiveTab] = useState('exam'); // 'exam' | 'result' | 'review'

  const currentQ = allQuestions[currentQuestionIndex];

  // If exam doesn't exist, redirect
  useEffect(() => {
    if (!exam) {
      navigate('/exams', { replace: true });
    }
  }, [exam, navigate]);

  // Countdown Timer
  useEffect(() => {
    if (isSubmitted || !exam) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted, exam]);

  /* Keep the submit closure pointing at the CURRENT render. The first build
     called handleSubmitExam() from inside the tick updater, whose closure was
     pinned to the mount render, so the answers it read were always `{}` — a
     timed-out exam scored zero no matter what the candidate had answered. */
  const submitRef = useRef(null);
  useEffect(() => {
    submitRef.current = handleSubmitExam;
  });

  useEffect(() => {
    if (isSubmitted || !exam || timeRemaining > 0) return;
    submitRef.current?.();
  }, [timeRemaining, isSubmitted, exam]);

  if (!exam || !currentQ) return null;

  // Format MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isTimeCritical = timeRemaining < 180; // less than 3 mins

  // Select answer
  const handleSelectOption = (optionIndex) => {
    playClick();
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionIndex,
    }));
  };

  // Toggle flag
  const toggleFlag = (qId) => {
    setFlaggedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  };

  // Audio player for listening questions
  const handlePlayAudio = (isSlow = false) => {
    if (!currentQ.audioScript) return;
    setListenCounts((prev) => ({
      ...prev,
      [currentQ.id]: (prev[currentQ.id] || 0) + 1,
    }));

    if (isSlow) {
      speech?.speakSlow(currentQ.audioScript, exam.languageId);
    } else {
      speech?.speak(currentQ.audioScript, exam.languageId);
    }
  };

  // Submit Exam
  const handleSubmitExam = () => {
    setShowConfirmModal(false);

    // Calculate score per section and overall
    let totalScore = 0;
    const sectionResults = {};

    exam.sections.forEach((sec) => {
      const secQs = allQuestions.filter((q) => q.sectionId === sec.id);
      let secCorrect = 0;

      secQs.forEach((q) => {
        if (userAnswers[q.id] === q.correctIndex) {
          secCorrect++;
        }
      });

      const secPercentage =
        secQs.length > 0 ? Math.round((secCorrect / secQs.length) * 100) : 100;
      sectionResults[sec.id] = {
        name: sec.name,
        correct: secCorrect,
        total: secQs.length,
        percentage: secPercentage,
      };

      // Weighted score
      totalScore += (secPercentage * (sec.weight / 100));
    });

    const finalPercentage = Math.round(totalScore);
    const passed = finalPercentage >= exam.passingScore;

    // Record result in progress
    progress.saveExamResult(exam.id, {
      score: finalPercentage,
      percentage: finalPercentage,
      passed,
      sections: sectionResults,
      userAnswers,
    });

    if (passed) {
      xp.addXP(exam.xpReward);
      streak.recordActivity();
      playCelebration();
    } else {
      playIncorrect();
    }

    setIsSubmitted(true);
    setActiveTab('result');
  };

  // Calculation for result view
  const answeredCount = Object.keys(userAnswers).length;
  const unansweredCount = allQuestions.length - answeredCount;

  // ── Result / Score Report & Certificate View ──────────────────────────────
  if (isSubmitted) {
    const examRecord = progress.getExamResult(exam.id) || {};
    const finalPercentage = examRecord.percentage || 0;
    const isPassed = examRecord.passed;
    const isDistinction = finalPercentage >= 85;

    return (
      <div className="min-h-screen bg-surface-bg flex flex-col justify-between p-4 sm:p-8">
        {isPassed && <Confetti duration={4000} particleCount={130} />}

        <div className="max-w-4xl mx-auto w-full space-y-6">
          {/* Top navigation tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-ink-200 pb-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-11 h-11 rounded-button bg-brand-50 border border-brand-200 text-brand-700 shrink-0">
                <ShieldCheck className="w-6 h-6" aria-hidden="true" />
              </span>
              <div>
                <h1 className="font-display font-bold text-display-sm text-ink-900">
                  {exam.title}
                </h1>
                <p className="text-caption text-ink-500">Official Score Report &amp; Verification</p>
              </div>
            </div>

            <SegmentedControl
              name="exam-report"
              label="Score report sections"
              tabs={REPORT_TABS}
              value={activeTab}
              onChange={setActiveTab}
            />
          </div>

          {/* TAB 1: Official Score Report & Certificate */}
          {activeTab === 'result' && (
            <div role="tabpanel" id={reportIds.panelId('result')} aria-labelledby={reportIds.tabId('result')} className="space-y-6">
              {/* Verdict Banner */}
              <Card tone={isPassed ? 'success' : 'warning'} padding="md" className="border-2">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4 text-center sm:text-left">
                    <div
                      className={`w-16 h-16 rounded-button flex items-center justify-center shrink-0 border ${
                        isPassed
                          ? 'bg-surface-card border-success-border text-success-strong'
                          : 'bg-surface-card border-warning-border text-warning-strong'
                      }`}
                    >
                      {isPassed ? (
                        <Trophy className="w-8 h-8" aria-hidden="true" />
                      ) : (
                        <AlertCircle className="w-8 h-8" aria-hidden="true" />
                      )}
                    </div>
                    <div>
                      {/* Overline rather than a filled chip: a `success` badge on a
                          `success`-tinted banner is the same colour as its background,
                          so the chip would simply vanish. */}
                      <p
                        className={`text-overline uppercase tracking-wide mb-1 ${
                          isPassed ? 'text-success-strong' : 'text-warning-strong'
                        }`}
                      >
                        {isDistinction
                          ? 'Passed with Distinction'
                          : isPassed
                          ? 'Official Pass'
                          : 'Review Required'}
                      </p>
                      <h2 className="font-display font-bold text-display-sm text-ink-900">
                        {isPassed
                          ? `Congratulations! You scored ${finalPercentage}%`
                          : `Final Score: ${finalPercentage}% (Pass: ${exam.passingScore}%)`}
                      </h2>
                      <p className="text-body-sm text-ink-700 mt-0.5">
                        {isPassed
                          ? `You have officially demonstrated Level ${exam.level} proficiency under standard examination conditions.`
                          : `You were close! Review the incorrect answers below and retake to earn your official certificate.`}
                      </p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col gap-2 shrink-0">
                    <Button
                      variant="outline"
                      shape="pill"
                      size="md"
                      icon={Printer}
                      onClick={() => window.print()}
                    >
                      Print Report
                    </Button>
                    <Button shape="pill" size="md" onClick={() => navigate('/exams')}>
                      All Exams
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Section-by-Section Breakdown */}
              <Card padding="md">
                <h3 className="font-display font-bold text-display-xs text-ink-900 mb-4">
                  Competency Section Scores
                </h3>
                <div className="space-y-4">
                  {exam.sections.map((sec) => {
                    const secScore = examRecord.sections?.[sec.id] || {
                      correct: 0,
                      total: sec.questions.length,
                      percentage: 0,
                    };
                    const meetsBar = secScore.percentage >= 60;

                    return (
                      <div key={sec.id}>
                        <div className="flex items-center justify-between text-body-sm font-semibold mb-1.5">
                          <span className="text-ink-900">{sec.name}</span>
                          <span className="text-ink-500 tabular-nums">
                            {secScore.correct} / {secScore.total} correct ({secScore.percentage}%)
                          </span>
                        </div>
                        {/* Colour is paired with the numeric readout above, so the
                            fill never carries the pass/fail verdict alone. */}
                        <ProgressBar
                          value={secScore.percentage}
                          max={100}
                          size="sm"
                          color={meetsBar ? 'success' : 'amber'}
                          animated={false}
                          label={`${sec.name} score`}
                          valueText={`${secScore.percentage} percent — ${meetsBar ? 'meets the 60% section bar' : 'below the 60% section bar'}`}
                        />
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Accredited Certificate Card (If Passed) */}
              {isPassed && (
                <div className="bg-gradient-to-br from-surface-bg to-amber-50 rounded-card p-8 border-4 border-double border-amber-300 shadow-soft-lg text-center relative overflow-hidden">
                  <div className="max-w-xl mx-auto space-y-4">
                    <div className="w-16 h-16 rounded-pill bg-amber-50 border border-amber-300 mx-auto flex items-center justify-center text-amber-700">
                      <Award className="w-9 h-9" aria-hidden="true" />
                    </div>

                    <p className="text-caption uppercase tracking-widest font-bold text-amber-800">
                      Certificate of Language Proficiency
                    </p>

                    <h2 className="font-display font-bold text-display-md text-ink-900 tracking-tight">
                      {user.name || 'Candidate'}
                    </h2>

                    <p className="text-body-sm text-ink-700 max-w-md mx-auto leading-relaxed">
                      has successfully satisfied all testing requirements and demonstrated certified foreign language competence in
                    </p>

                    <div className="py-2 px-6 bg-surface-card rounded-button border border-amber-200 inline-block shadow-soft-sm">
                      <span className="font-display font-bold text-display-xs text-brand-900 block">
                        {exam.title}
                      </span>
                      <span className="text-body-sm text-brand-700 font-semibold">
                        Grade: {finalPercentage}% • Level {exam.level} ({exam.framework})
                      </span>
                    </div>

                    <div className="pt-4 border-t border-amber-200 flex items-center justify-between text-caption text-ink-700">
                      <span>Authority: {exam.certifyingBody}</span>
                      <span>Verified: {new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Detailed Pedagogical Answer Key Review */}
          {activeTab === 'review' && (
            <div role="tabpanel" id={reportIds.panelId('review')} aria-labelledby={reportIds.tabId('review')} className="space-y-4">
              <h3 className="font-display font-bold text-display-sm text-ink-900">
                Question by Question Detailed Review
              </h3>
              <div className="space-y-4">
                {allQuestions.map((q, idx) => {
                  const userAnswer = userAnswers[q.id];
                  const isCorrect = userAnswer === q.correctIndex;

                  return (
                    <Card key={q.id} accent={isCorrect ? 'success' : 'error'}>
                      <div className="flex items-center justify-between mb-2 gap-3">
                        <span className="text-caption font-bold text-ink-700">
                          Question {idx + 1} • {q.sectionName}
                        </span>
                        <Badge
                          variant={isCorrect ? 'success' : 'error'}
                          icon={isCorrect ? CheckCircle2 : AlertCircle}
                        >
                          {isCorrect ? 'Correct' : 'Incorrect'}
                        </Badge>
                      </div>

                      {q.sentence && (
                        <p className="font-display font-semibold text-display-xs text-ink-900 mb-2">
                          {q.sentence}
                        </p>
                      )}

                      <p className="text-body-md text-ink-700 mb-3">{q.prompt}</p>

                      {/* Options */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = userAnswer === optIdx;
                          const isRealCorrect = q.correctIndex === optIdx;

                          return (
                            <div
                              key={optIdx}
                              className={`flex items-center justify-between gap-2 p-3 rounded-button border-2 text-body-sm font-semibold ${
                                isRealCorrect
                                  ? 'bg-success-bg border-success text-success-strong'
                                  : isSelected
                                  ? 'bg-error-bg border-error text-error-strong'
                                  : 'bg-surface-100 border-ink-200 text-ink-700'
                              }`}
                            >
                              <span>
                                {String.fromCharCode(65 + optIdx)}. {opt}
                              </span>
                              {isRealCorrect && (
                                <span className="text-caption uppercase font-bold text-success-strong shrink-0">
                                  Correct answer
                                </span>
                              )}
                              {isSelected && !isRealCorrect && (
                                <span className="text-caption uppercase font-bold text-error-strong shrink-0">
                                  Your choice
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation */}
                      {q.explanation && (
                        <div className="p-3 rounded-button bg-brand-50 border border-brand-200 text-body-sm text-ink-700">
                          <span className="font-bold text-brand-800 block mb-0.5">
                            Linguistic Explanation:
                          </span>
                          {q.explanation}
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Active Testing Environment ──────────────────────────────────────────
  return (
    <div className="min-h-screen bg-surface-bg flex flex-col justify-between">
      {/* ── Top Bar: Exam Info & Countdown Timer ── */}
      <header className="min-h-16 px-4 sm:px-8 py-3 bg-surface-card border-b border-ink-200 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-soft-sm">
        <div className="flex items-center gap-3 min-w-0">
          <Button
            variant="outline"
            size="lg"
            iconOnly
            icon={X}
            onClick={() => setShowExitModal(true)}
            aria-label="Exit exam"
          />
          <div className="min-w-0">
            <Badge variant="brand" uppercase className="mb-0.5">
              Level {exam.level}
            </Badge>
            {/* h1, not h2: this is the only page heading in the active testing view,
                and the question below it is an h2 — WCAG 1.3.1 heading hierarchy. */}
            <h1 className="font-display font-bold text-body-lg text-ink-900 truncate max-w-48 sm:max-w-md">
              {exam.title}
            </h1>
          </div>
        </div>

        {/* Live Countdown Timer. `aria-live="off"` because a per-second polite
            announcement is worse than silence; the value is available on demand. */}
        <div
          className={`flex items-center gap-2 px-3.5 h-10 rounded-pill border font-semibold text-body-md tabular-nums transition-colors ${
            isTimeCritical
              ? 'bg-error-bg border-error text-error-strong animate-pulse'
              : 'bg-ink-100 border-ink-200 text-ink-900'
          }`}
          role="timer"
          aria-label={isTimeCritical ? `Time remaining: ${formatTime(timeRemaining)} — under three minutes` : `Time remaining: ${formatTime(timeRemaining)}`}
        >
          <Clock className={`w-4 h-4 ${isTimeCritical ? 'text-error-strong' : 'text-ink-500'}`} aria-hidden="true" />
          <span>{formatTime(timeRemaining)}</span>
        </div>

        {/* Finish / Submit Button */}
        <Button shape="pill" size="md" onClick={() => setShowConfirmModal(true)}>
          Submit Exam
        </Button>
      </header>

      {/* ── Main Exam Arena ── */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-8 space-y-6">
        {/* Section Indicator Breadcrumb */}
        <div className="flex items-center justify-between text-body-sm text-ink-500 font-medium gap-3">
          <span className="text-overline uppercase text-brand-800 truncate">
            {currentQ.sectionName}
          </span>
          <span className="tabular-nums shrink-0">
            Question {currentQuestionIndex + 1} of {allQuestions.length}
          </span>
        </div>

        {/* Reading Passage Container (if applicable) */}
        {currentQ.sectionPassage && (
          <Card tone="amber" padding="md">
            {/* h2: the testing view's only page heading is the exam title (h1), so
                the passage sits directly under it — an h3 here skipped a level. */}
            <h2 className="font-display font-bold text-display-xs text-amber-800 mb-2 flex items-center gap-2">
              <BookOpen className="w-5 h-5 shrink-0" aria-hidden="true" />
              {currentQ.sectionPassage.title}
            </h2>
            <p className="text-body-md text-ink-900 leading-relaxed whitespace-pre-line">
              {currentQ.sectionPassage.text}
            </p>
          </Card>
        )}

        {/* Listening Audio Widget (if applicable) */}
        {currentQ.audioScript && (
          <Card tone="brand" padding="md">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-pill bg-brand-700 text-white flex items-center justify-center shrink-0">
                  <Volume2 className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="text-left">
                  <p className="font-display font-bold text-body-md text-ink-900">
                    Audio Listening Task
                  </p>
                  <p className="text-caption text-ink-700" aria-live="polite">
                    Played {listenCounts[currentQ.id] || 0} {listenCounts[currentQ.id] === 1 ? 'time' : 'times'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button size="md" icon={Volume2} onClick={() => handlePlayAudio(false)}>
                  Play Normal
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  icon={Turtle}
                  onClick={() => handlePlayAudio(true)}
                >
                  Slow
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Question Card */}
        <Card padding="md" className="sm:p-8">
          <div className="space-y-6">
            {currentQ.sentence && (
              <div className="p-4 rounded-button bg-surface-100 border border-ink-200">
                <h2 className="font-display font-bold text-display-sm sm:text-display-md text-ink-900 leading-snug">
                  {currentQ.sentence}
                </h2>
              </div>
            )}

            <p className="font-medium text-body-md sm:text-body-lg text-ink-900 leading-relaxed">
              {currentQ.prompt}
            </p>

            {/* Options — same group / aria-pressed pattern the lesson exercise uses. */}
            <div
              className="space-y-3"
              role="group"
              aria-label={`Answer options for question ${currentQuestionIndex + 1} of ${allQuestions.length}`}
            >
              {currentQ.options.map((opt, idx) => {
                const isSelected = userAnswers[currentQ.id] === idx;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    aria-pressed={isSelected}
                    className={`w-full min-h-14 p-4 rounded-card text-left border-2 flex items-center justify-between gap-3 transition-colors ${
                      isSelected
                        ? 'border-brand-700 bg-brand-50 text-ink-900 shadow-soft-sm'
                        : 'border-ink-200 bg-surface-card text-ink-900 hover:border-brand-600 hover:bg-brand-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        aria-hidden="true"
                        className={`w-8 h-8 rounded-pill text-caption font-bold flex items-center justify-center shrink-0 border-2 ${
                          isSelected
                            ? 'bg-brand-700 text-white border-brand-700'
                            : 'bg-surface-card text-ink-700 border-ink-300'
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="font-medium text-body-md">{opt}</span>
                    </div>

                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-brand-700 shrink-0" aria-hidden="true" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </Card>

        {/* ── Question Navigator Palette ── */}
        <Card padding="sm">
          <div className="flex items-center justify-between mb-3 text-body-sm gap-3">
            <span className="font-bold text-ink-900">Question Palette</span>
            <div className="flex items-center gap-3 text-caption">
              <span className="flex items-center gap-1.5 text-ink-700">
                <span className="w-2.5 h-2.5 rounded-pill bg-brand-700 inline-block shrink-0" aria-hidden="true" />
                Answered <span className="tabular-nums font-semibold">({answeredCount})</span>
              </span>
              <span className="flex items-center gap-1.5 text-amber-700">
                <Flag size={12} className="shrink-0" aria-hidden="true" />
                Flagged <span className="tabular-nums font-semibold">({flaggedQuestions.size})</span>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {allQuestions.map((q, idx) => {
              const isAnswered = userAnswers[q.id] !== undefined;
              const isCurrent = idx === currentQuestionIndex;
              const isFlagged = flaggedQuestions.has(q.id);

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setCurrentQuestionIndex(idx)}
                  aria-current={isCurrent ? 'true' : undefined}
                  aria-label={`Question ${idx + 1}${isAnswered ? ', answered' : ', not answered'}${isFlagged ? ', flagged for review' : ''}`}
                  className={`w-10 h-10 rounded-button text-caption font-bold transition-colors relative ${
                    isCurrent
                      ? 'bg-brand-700 text-white'
                      : isAnswered
                      ? 'bg-brand-100 text-brand-800 border border-brand-300 hover:bg-brand-200'
                      : 'bg-ink-100 text-ink-700 border border-ink-200 hover:bg-ink-200'
                  }`}
                >
                  <span className="tabular-nums">{idx + 1}</span>
                  {isFlagged && (
                    /* amber-700, not amber-500: the dot is non-text UI and needs
                       3:1 against the tile it sits on (amber-500 measured 1.9:1
                       against ink-100). The white ring is what separates it from
                       the brand-700 "current" tile. */
                    <span
                      className="absolute -top-1 -right-1 w-3 h-3 bg-amber-700 rounded-pill ring-2 ring-surface-card"
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </Card>
      </main>

      {/* ── Bottom Bar: Navigation & Flagging ── */}
      <footer className="min-h-16 px-4 sm:px-8 py-3 bg-surface-card border-t border-ink-200 flex items-center justify-between gap-4 sticky bottom-0 z-30">
        <Button
          variant={flaggedQuestions.has(currentQ.id) ? 'secondary' : 'outline'}
          shape="pill"
          size="md"
          aria-pressed={flaggedQuestions.has(currentQ.id)}
          onClick={() => toggleFlag(currentQ.id)}
          icon={Flag}
        >
          {flaggedQuestions.has(currentQ.id) ? 'Flagged for Review' : 'Flag Question'}
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            shape="pill"
            size="md"
            disabled={currentQuestionIndex === 0}
            icon={ArrowLeft}
            onClick={() => setCurrentQuestionIndex((i) => Math.max(0, i - 1))}
          >
            Previous
          </Button>

          {currentQuestionIndex + 1 < allQuestions.length ? (
            <Button
              shape="pill"
              size="md"
              icon={ArrowRight}
              iconPosition="right"
              onClick={() => setCurrentQuestionIndex((i) => i + 1)}
            >
              Next
            </Button>
          ) : (
            <Button
              shape="pill"
              size="md"
              icon={CheckCircle2}
              iconPosition="right"
              onClick={() => setShowConfirmModal(true)}
            >
              Review &amp; Finish
            </Button>
          )}
        </div>
      </footer>

      {/* ── Submission Confirmation Modal ── */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Submit Examination?"
        size="sm"
        /* An exam is the one place a stray click must not destroy work. */
        dismissOnBackdrop={false}
        footer={
          <>
            <Button variant="outline" shape="pill" size="lg" fullWidth onClick={() => setShowConfirmModal(false)}>
              Return to Test
            </Button>
            <Button shape="pill" size="lg" fullWidth onClick={handleSubmitExam}>
              Confirm &amp; Submit
            </Button>
          </>
        }
      >
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-button bg-amber-50 border border-amber-200 text-amber-700 mx-auto flex items-center justify-center">
            <HelpCircle className="w-7 h-7" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <p className="text-body-md text-ink-700 leading-relaxed">
              You have answered <strong className="text-ink-900">{answeredCount}</strong> of{' '}
              <strong className="text-ink-900">{allQuestions.length}</strong> questions.
            </p>
            {unansweredCount > 0 && (
              <p className="flex items-center justify-center gap-2 text-body-sm font-semibold text-warning-strong bg-warning-bg border border-warning-border rounded-button px-3 py-2">
                <AlertCircle size={16} className="shrink-0" aria-hidden="true" />
                You still have {unansweredCount} unanswered {unansweredCount === 1 ? 'question' : 'questions'}!
              </p>
            )}
            {flaggedQuestions.size > 0 && (
              <p className="text-body-sm text-ink-700">
                {flaggedQuestions.size} {flaggedQuestions.size === 1 ? 'question is' : 'questions are'} flagged for review.
              </p>
            )}
          </div>
        </div>
      </Modal>

      {/* ── Quit / Exit Modal ── */}
      <Modal
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        title="Abandon Examination?"
        size="sm"
        dismissOnBackdrop={false}
        footer={
          <>
            <Button variant="outline" shape="pill" size="lg" fullWidth onClick={() => setShowExitModal(false)}>
              Stay in Exam
            </Button>
            <Button variant="danger" shape="pill" size="lg" fullWidth onClick={() => navigate('/exams')}>
              Quit Exam
            </Button>
          </>
        }
      >
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-button bg-error-bg border border-error-border text-error-strong mx-auto flex items-center justify-center">
            <AlertCircle className="w-7 h-7" aria-hidden="true" />
          </div>
          <p className="text-body-md text-ink-700 leading-relaxed">
            Exiting will cancel this exam attempt. Your answers will not be recorded and you will need to restart from the beginning.
          </p>
        </div>
      </Modal>
    </div>
  );
}

