/**
 * @file ExamPlayer.jsx
 * @description Fullscreen authentic examination simulator for CEFR and JLPT mock exams.
 * Features strict countdown timer, multi-section navigation, audio listening comprehension,
 * reading passage layouts, question review palette, and accredited Certificate generation.
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Clock,
  Flag,
  CheckCircle2,
  AlertCircle,
  Volume2,
  Turtle,
  ArrowRight,
  ArrowLeft,
  Award,
  Trophy,
  ShieldCheck,
  RotateCcw,
  Printer,
  ChevronRight,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { getExamById } from '../data/exams';
import languages from '../data/languages';
import Confetti from '../components/ui/Confetti';
import { playCelebration, playCorrect, playIncorrect, playClick } from '../utils/soundEffects';

const transitionEase = [0.16, 1, 0.3, 1];

export default function ExamPlayer() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { user, progress, speech, streak, xp } = useUser();

  const exam = useMemo(() => getExamById(examId), [examId]);
  const langData = useMemo(
    () => languages.find((l) => l.id === exam?.languageId),
    [exam]
  );

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
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam(); // Auto-submit when time expires
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted, exam]);

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
          <div className="flex items-center justify-between border-b border-ink-200 pb-4">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-brand-50 text-brand-700">
                <ShieldCheck className="w-6 h-6" />
              </span>
              <div>
                <h1 className="font-display font-bold text-xl text-ink-900">
                  {exam.title}
                </h1>
                <p className="text-xs text-ink-500">Official Score Report & Verification</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('result')}
                className={`px-4 py-2 rounded-pill text-xs font-semibold transition-all ${
                  activeTab === 'result'
                    ? 'bg-brand-600 text-white shadow-soft-sm'
                    : 'bg-white border border-ink-200 text-ink-600 hover:bg-ink-50'
                }`}
              >
                Official Certificate
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('review')}
                className={`px-4 py-2 rounded-pill text-xs font-semibold transition-all ${
                  activeTab === 'review'
                    ? 'bg-brand-600 text-white shadow-soft-sm'
                    : 'bg-white border border-ink-200 text-ink-600 hover:bg-ink-50'
                }`}
              >
                Answer Key Review
              </button>
            </div>
          </div>

          {/* TAB 1: Official Score Report & Certificate */}
          {activeTab === 'result' && (
            <div className="space-y-6">
              {/* Verdict Banner */}
              <div
                className={`p-6 rounded-card border-2 flex flex-col sm:flex-row items-center justify-between gap-6 ${
                  isPassed
                    ? 'bg-emerald-50/80 border-emerald-300'
                    : 'bg-amber-50/80 border-amber-300'
                }`}
              >
                <div className="flex items-center gap-4 text-center sm:text-left">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${
                      isPassed
                        ? 'bg-emerald-600 text-white shadow-soft-md'
                        : 'bg-amber-500 text-white shadow-soft-md'
                    }`}
                  >
                    {isPassed ? <Trophy className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
                  </div>
                  <div>
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-pill inline-block mb-1 ${
                        isPassed
                          ? 'bg-emerald-200 text-emerald-900'
                          : 'bg-amber-200 text-amber-900'
                      }`}
                    >
                      {isDistinction
                        ? 'Passed with Distinction'
                        : isPassed
                        ? 'Official Pass'
                        : 'Review Required'}
                    </span>
                    <h2 className="font-display font-bold text-2xl text-ink-900">
                      {isPassed
                        ? `Congratulations! You scored ${finalPercentage}%`
                        : `Final Score: ${finalPercentage}% (Pass: ${exam.passingScore}%)`}
                    </h2>
                    <p className="text-xs text-ink-600 mt-0.5">
                      {isPassed
                        ? `You have officially demonstrated Level ${exam.level} proficiency under standard examination conditions.`
                        : `You were close! Review the incorrect answers below and retake to earn your official certificate.`}
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-4 py-2.5 rounded-pill bg-white border border-ink-300 text-ink-700 hover:bg-ink-50 font-semibold text-xs flex items-center gap-2 shadow-soft-sm"
                  >
                    <Printer className="w-4 h-4" /> Print Report
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/exams')}
                    className="px-4 py-2.5 rounded-pill bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center gap-2 shadow-soft-sm"
                  >
                    All Exams
                  </button>
                </div>
              </div>

              {/* Section-by-Section Breakdown Bento */}
              <div className="bg-white rounded-card p-6 border border-ink-200/80 shadow-soft-sm">
                <h3 className="font-display font-bold text-lg text-ink-900 mb-4">
                  Competency Section Scores
                </h3>
                <div className="space-y-4">
                  {exam.sections.map((sec) => {
                    const secScore = examRecord.sections?.[sec.id] || {
                      correct: 0,
                      total: sec.questions.length,
                      percentage: 0,
                    };

                    return (
                      <div key={sec.id}>
                        <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                          <span className="text-ink-800">{sec.name}</span>
                          <span className="text-ink-500">
                            {secScore.correct} / {secScore.total} correct ({secScore.percentage}%)
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-ink-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              secScore.percentage >= 60
                                ? 'bg-emerald-500'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${secScore.percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Accredited Certificate Card (If Passed) */}
              {isPassed && (
                <div className="bg-gradient-to-br from-[#FAF9F5] to-amber-50/40 rounded-card p-8 border-4 border-double border-amber-300/80 shadow-soft-lg text-center relative overflow-hidden">
                  <div className="max-w-xl mx-auto space-y-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 mx-auto flex items-center justify-center text-white shadow-soft-md">
                      <Award className="w-9 h-9" />
                    </div>

                    <p className="text-xs uppercase tracking-widest font-bold text-amber-800">
                      Certificate of Language Proficiency
                    </p>

                    <h2 className="font-display font-bold text-3xl text-ink-900 tracking-tight">
                      {user.name || 'Candidate'}
                    </h2>

                    <p className="text-xs text-ink-600 max-w-md mx-auto leading-relaxed">
                      has successfully satisfied all testing requirements and demonstrated certified foreign language competence in
                    </p>

                    <div className="py-2 px-6 bg-white rounded-2xl border border-amber-200 inline-block shadow-soft-sm">
                      <span className="font-display font-bold text-xl text-brand-900 block">
                        {exam.title}
                      </span>
                      <span className="text-xs text-brand-700 font-semibold">
                        Grade: {finalPercentage}% • Level {exam.level} ({exam.framework})
                      </span>
                    </div>

                    <div className="pt-4 border-t border-amber-200 flex items-center justify-between text-[11px] text-ink-500 font-medium">
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
            <div className="space-y-4">
              <h3 className="font-display font-bold text-xl text-ink-900">
                Question by Question Detailed Review
              </h3>
              <div className="space-y-4">
                {allQuestions.map((q, idx) => {
                  const userAnswer = userAnswers[q.id];
                  const isCorrect = userAnswer === q.correctIndex;

                  return (
                    <div
                      key={q.id}
                      className={`p-5 rounded-card bg-white border-2 transition-all ${
                        isCorrect ? 'border-emerald-200' : 'border-red-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-ink-500">
                          Question {idx + 1} • {q.sectionName}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-pill ${
                            isCorrect
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {isCorrect ? (
                            <>
                              <CheckCircle2 size={13} /> Correct
                            </>
                          ) : (
                            <>
                              <AlertCircle size={13} /> Incorrect
                            </>
                          )}
                        </span>
                      </div>

                      {q.sentence && (
                        <p className="font-display font-semibold text-lg text-ink-900 mb-2">
                          {q.sentence}
                        </p>
                      )}

                      <p className="text-sm text-ink-700 mb-3">{q.prompt}</p>

                      {/* Options */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = userAnswer === optIdx;
                          const isRealCorrect = q.correctIndex === optIdx;

                          return (
                            <div
                              key={optIdx}
                              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between ${
                                isRealCorrect
                                  ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                                  : isSelected
                                  ? 'bg-red-50 border-red-300 text-red-900'
                                  : 'bg-ink-50/50 border-ink-200 text-ink-600'
                              }`}
                            >
                              <span>
                                {String.fromCharCode(65 + optIdx)}. {opt}
                              </span>
                              {isRealCorrect && (
                                <span className="text-[10px] uppercase font-bold text-emerald-700">
                                  Correct Answer
                                </span>
                              )}
                              {isSelected && !isRealCorrect && (
                                <span className="text-[10px] uppercase font-bold text-red-700">
                                  Your Choice
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation */}
                      {q.explanation && (
                        <div className="p-3 rounded-xl bg-brand-50/80 border border-brand-200 text-xs text-brand-900">
                          <span className="font-bold block mb-0.5">Linguistic Explanation:</span>
                          {q.explanation}
                        </div>
                      )}
                    </div>
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
      <header className="h-16 px-4 sm:px-8 bg-white border-b border-ink-200/80 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-soft-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowExitModal(true)}
            className="p-2 rounded-full hover:bg-ink-100 text-ink-500 hover:text-ink-900 transition-colors"
            title="Exit Exam"
          >
            <X className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2 py-0.5 rounded-pill">
              Level {exam.level}
            </span>
            <h2 className="font-display font-bold text-sm sm:text-base text-ink-900 truncate max-w-[200px] sm:max-w-md">
              {exam.title}
            </h2>
          </div>
        </div>

        {/* Live Countdown Timer */}
        <div
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-pill border font-mono font-bold text-sm transition-all ${
            isTimeCritical
              ? 'bg-red-50 border-red-300 text-red-700 animate-pulse'
              : 'bg-ink-100 border-ink-200 text-ink-800'
          }`}
        >
          <Clock className="w-4 h-4 text-ink-500" />
          <span>{formatTime(timeRemaining)}</span>
        </div>

        {/* Finish / Submit Button */}
        <button
          type="button"
          onClick={() => setShowConfirmModal(true)}
          className="px-4 py-2 rounded-pill bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-soft-sm transition-all active:scale-95"
        >
          Submit Exam
        </button>
      </header>

      {/* ── Main Exam Arena ── */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-8 space-y-6">
        {/* Section Indicator Breadcrumb */}
        <div className="flex items-center justify-between text-xs text-ink-500 font-medium">
          <span className="font-bold text-brand-800 uppercase tracking-wide">
            {currentQ.sectionName}
          </span>
          <span>
            Question {currentQuestionIndex + 1} of {allQuestions.length}
          </span>
        </div>

        {/* Reading Passage Container (if applicable) */}
        {currentQ.sectionPassage && (
          <div className="p-6 rounded-card bg-amber-50/50 border border-amber-200/80 shadow-soft-xs">
            <h3 className="font-display font-bold text-base text-amber-950 mb-2">
              📖 {currentQ.sectionPassage.title}
            </h3>
            <p className="text-xs sm:text-sm text-ink-800 leading-relaxed whitespace-pre-line font-medium font-serif">
              {currentQ.sectionPassage.text}
            </p>
          </div>
        )}

        {/* Listening Audio Widget (if applicable) */}
        {currentQ.audioScript && (
          <div className="p-5 rounded-card bg-brand-50/60 border border-brand-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center shrink-0">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <p className="font-display font-bold text-sm text-ink-900">
                  Audio Listening Task
                </p>
                <p className="text-xs text-ink-500">
                  Listened {listenCounts[currentQ.id] || 0} times
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handlePlayAudio(false)}
                className="px-4 py-2 rounded-pill bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-soft-sm active:scale-95"
              >
                <Volume2 size={14} /> Play Normal
              </button>
              <button
                type="button"
                onClick={() => handlePlayAudio(true)}
                className="px-3.5 py-2 rounded-pill bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold text-xs flex items-center gap-1.5 shadow-soft-sm active:scale-95"
              >
                <Turtle size={14} /> Slow Turtle
              </button>
            </div>
          </div>
        )}

        {/* Question Card */}
        <div className="bg-white rounded-card p-6 sm:p-8 border border-ink-200/80 shadow-soft-md space-y-6">
          {currentQ.sentence && (
            <div className="p-4 rounded-xl bg-ink-50 border border-ink-100">
              <h2 className="font-display font-bold text-xl sm:text-2xl text-ink-900 leading-snug">
                {currentQ.sentence}
              </h2>
            </div>
          )}

          <p className="font-medium text-sm sm:text-base text-ink-800 leading-relaxed">
            {currentQ.prompt}
          </p>

          {/* Star Questions (Reorder) or Standard Multiple Choice */}
          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = userAnswers[currentQ.id] === idx;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-4 rounded-xl text-left border-2 flex items-center justify-between gap-3 transition-all ${
                    isSelected
                      ? 'border-brand-600 bg-brand-50/70 text-brand-900 ring-2 ring-brand-500/20 shadow-soft-sm'
                      : 'border-ink-200 hover:border-ink-300 hover:bg-ink-50/50 text-ink-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center shrink-0 border ${
                        isSelected
                          ? 'bg-brand-600 text-white border-brand-600'
                          : 'bg-white text-ink-600 border-ink-300'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="font-medium text-sm sm:text-base">{opt}</span>
                  </div>

                  {isSelected && (
                    <CheckCircle2 className="w-5 h-5 text-brand-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Question Navigator Palette ── */}
        <div className="bg-white rounded-card p-4 border border-ink-200/80 shadow-soft-sm">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-bold text-ink-700">Question Palette</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-ink-400">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-600 inline-block" /> Answered ({answeredCount})
              </span>
              <span className="flex items-center gap-1 text-amber-600">
                <Flag size={12} /> Flagged ({flaggedQuestions.size})
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
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all relative ${
                    isCurrent
                      ? 'bg-brand-600 text-white ring-2 ring-brand-500/40'
                      : isAnswered
                      ? 'bg-brand-100 text-brand-800 border border-brand-300'
                      : 'bg-ink-100 text-ink-600 hover:bg-ink-200'
                  }`}
                >
                  {idx + 1}
                  {isFlagged && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full ring-1 ring-white" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* ── Bottom Bar: Navigation & Flagging ── */}
      <footer className="h-16 px-4 sm:px-8 bg-white border-t border-ink-200/80 flex items-center justify-between gap-4 sticky bottom-0 z-30">
        <button
          type="button"
          onClick={() => toggleFlag(currentQ.id)}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-pill border text-xs font-semibold transition-all ${
            flaggedQuestions.has(currentQ.id)
              ? 'bg-amber-100 border-amber-300 text-amber-900'
              : 'border-ink-200 text-ink-600 hover:bg-ink-100'
          }`}
        >
          <Flag size={14} className={flaggedQuestions.has(currentQ.id) ? 'fill-amber-500' : ''} />
          {flaggedQuestions.has(currentQ.id) ? 'Flagged for Review' : 'Flag Question'}
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentQuestionIndex === 0}
            onClick={() => setCurrentQuestionIndex((i) => Math.max(0, i - 1))}
            className="px-4 py-2 rounded-pill border border-ink-300 text-ink-700 hover:bg-ink-100 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <ArrowLeft size={14} /> Previous
          </button>

          {currentQuestionIndex + 1 < allQuestions.length ? (
            <button
              type="button"
              onClick={() => setCurrentQuestionIndex((i) => i + 1)}
              className="px-5 py-2 rounded-pill bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold flex items-center gap-1 shadow-soft-sm"
            >
              Next <ArrowRight size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowConfirmModal(true)}
              className="px-5 py-2 rounded-pill bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 shadow-soft-sm"
            >
              Review & Finish <CheckCircle2 size={14} />
            </button>
          )}
        </div>
      </footer>

      {/* ── Submission Confirmation Modal ── */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-card p-6 max-w-md w-full shadow-soft-xl border border-ink-200 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 mx-auto flex items-center justify-center mb-4">
                <HelpCircle className="w-7 h-7" />
              </div>
              <h3 className="font-display font-bold text-xl text-ink-900 mb-2">
                Submit Examination?
              </h3>
              <p className="text-xs text-ink-500 mb-6 leading-relaxed">
                You have answered <strong>{answeredCount}</strong> of{' '}
                <strong>{allQuestions.length}</strong> questions.
                {unansweredCount > 0 && (
                  <span className="text-amber-700 block mt-1 font-semibold">
                    ⚠️ You still have {unansweredCount} unanswered questions!
                  </span>
                )}
                {flaggedQuestions.size > 0 && (
                  <span className="text-ink-600 block mt-0.5">
                    ({flaggedQuestions.size} questions are flagged for review).
                  </span>
                )}
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 py-2.5 px-4 rounded-pill border border-ink-300 text-ink-700 hover:bg-ink-100 font-semibold text-xs transition-colors"
                >
                  Return to Test
                </button>
                <button
                  type="button"
                  onClick={handleSubmitExam}
                  className="flex-1 py-2.5 px-4 rounded-pill bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-soft-sm transition-colors"
                >
                  Confirm & Submit
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Quit / Exit Modal ── */}
      <AnimatePresence>
        {showExitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-card p-6 max-w-md w-full shadow-soft-xl border border-red-200 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 mx-auto flex items-center justify-center mb-4">
                <AlertCircle className="w-7 h-7" />
              </div>
              <h3 className="font-display font-bold text-xl text-ink-900 mb-2">
                Abandon Examination?
              </h3>
              <p className="text-xs text-ink-500 mb-6">
                Exiting will cancel this exam attempt. Your answers will not be recorded and you will need to restart from the beginning.
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowExitModal(false)}
                  className="flex-1 py-2.5 px-4 rounded-pill border border-ink-300 text-ink-700 hover:bg-ink-100 font-semibold text-xs"
                >
                  Stay in Exam
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/exams')}
                  className="flex-1 py-2.5 px-4 rounded-pill bg-red-600 hover:bg-red-700 text-white font-semibold text-xs"
                >
                  Quit Exam
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

