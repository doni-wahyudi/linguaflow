/**
 * @file Exams.jsx
 * @description Official Proficiency Examination Hub and Hall of Certification.
 * Presents real CEFR (DELE, Goethe, DELF) & JLPT mock exams with strict time limits,
 * authentic question formats, passing thresholds, and printable certificates.
 */

import React, { useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Award,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Headphones,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Trophy,
  Sparkles,
  RotateCcw,
  GraduationCap,
} from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import { useUser } from '../context/UserContext';
import { getExamsByLanguage } from '../data/exams';
import languages from '../data/languages';

const transitionEase = [0.16, 1, 0.3, 1];

export default function Exams() {
  const navigate = useNavigate();
  const { user, progress } = useUser();
  const currentLang = user.selectedLanguage || 'es';
  const langData = languages.find((l) => l.id === currentLang);

  const exams = useMemo(() => getExamsByLanguage(currentLang), [currentLang]);

  // Aggregate user exam stats
  const stats = useMemo(() => {
    let passedCount = 0;
    let attemptedCount = 0;

    exams.forEach((exam) => {
      const record = progress.getExamResult(exam.id);
      if (record) {
        attemptedCount++;
        if (record.passed) passedCount++;
      }
    });

    return { passedCount, attemptedCount, totalCount: exams.length };
  }, [exams, progress]);

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* ── Page Hero Header ── */}
        <div className="bg-gradient-to-br from-brand-900 via-brand-800 to-ink-900 rounded-card p-6 sm:p-10 text-white relative overflow-hidden shadow-soft-xl border border-brand-700/50">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-pill bg-white/10 backdrop-blur-md border border-white/20 text-brand-200 text-xs font-semibold mb-4">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Official Examination Standard • {langData?.framework?.name} Framework
            </div>

            <h1 className="font-display text-display-md sm:text-display-lg text-white font-bold tracking-tight mb-3">
              Official Mock Proficiency Exams
            </h1>

            <p className="text-body-md text-brand-100/90 leading-relaxed mb-6">
              Test your true mastery under realistic exam conditions in {langData?.name} {langData?.flag}.
              Timed countdowns, authentic reading texts, native audio listening tasks, and accredited Certificate of Proficiency upon passing.
            </p>

            {/* Quick Metrics Bento */}
            <div className="grid grid-cols-3 gap-3 max-w-md pt-2 border-t border-white/10">
              <div>
                <p className="text-2xl font-bold font-display text-white">
                  {stats.passedCount} / {stats.totalCount}
                </p>
                <p className="text-xs text-brand-200/80 font-medium">Passed Exams</p>
              </div>

              <div>
                <p className="text-2xl font-bold font-display text-amber-300">
                  {langData?.framework?.levels?.[0]?.code} – {langData?.framework?.levels?.[2]?.code || 'B1'}
                </p>
                <p className="text-xs text-brand-200/80 font-medium">Levels Covered</p>
              </div>

              <div>
                <p className="text-2xl font-bold font-display text-emerald-400">
                  60%
                </p>
                <p className="text-xs text-brand-200/80 font-medium">Pass Threshold</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Exam Hall Information Banner ── */}
        <div className="bg-white rounded-card p-5 border border-ink-200/80 shadow-soft-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-700 shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-ink-900 text-base">
                How Official Exams Work
              </h3>
              <p className="text-xs text-ink-500 mt-0.5">
                Each mock exam replicates the exact section weighting, reading lengths, and time pressure of the certified foreign language examination.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-ink-600 shrink-0">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-brand-600" /> Real-time Clock
            </span>
            <span className="flex items-center gap-1.5">
              <Headphones className="w-4 h-4 text-brand-600" /> Audio Listening
            </span>
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" /> Printable Certificate
            </span>
          </div>
        </div>

        {/* ── Exam Cards Grid ── */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-2xl text-ink-900">
              Available Mock Exams ({exams.length})
            </h2>
            <span className="text-xs text-ink-500 font-medium">
              Framework: {langData?.framework?.fullName}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam, idx) => {
              const record = progress.getExamResult(exam.id);
              const isPassed = record?.passed;
              const hasAttempted = !!record;

              // Total questions across sections
              const totalQuestions = exam.sections.reduce(
                (sum, s) => sum + s.questions.length,
                0
              );

              return (
                <motion.div
                  key={exam.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.08, ease: transitionEase }}
                  className={`bg-white rounded-card p-6 border-2 transition-all flex flex-col justify-between shadow-soft-sm hover:shadow-soft-lg ${
                    isPassed
                      ? 'border-emerald-300 ring-1 ring-emerald-200'
                      : 'border-ink-200/80 hover:border-brand-400'
                  }`}
                >
                  <div>
                    {/* Level & Certifying Body Header */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-3 py-1 rounded-pill bg-brand-50 text-brand-800 font-bold text-xs border border-brand-200">
                        Level {exam.level}
                      </span>

                      {isPassed ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-pill border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Certified ({record.percentage}%)
                        </span>
                      ) : hasAttempted ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-pill border border-amber-200">
                          <RotateCcw className="w-3.5 h-3.5" /> Score: {record.percentage}%
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-ink-400">
                          Ready to Take
                        </span>
                      )}
                    </div>

                    <h3 className="font-display font-bold text-xl text-ink-900 mb-1 leading-snug">
                      {exam.title}
                    </h3>

                    {exam.subtitle && (
                      <p className="text-xs text-brand-700 font-semibold mb-2">
                        {exam.subtitle}
                      </p>
                    )}

                    <p className="text-xs text-ink-500 line-clamp-2 leading-relaxed mb-4">
                      {exam.description}
                    </p>

                    {/* Certifying Authority */}
                    <div className="p-2.5 rounded-xl bg-ink-50/80 border border-ink-100 mb-4 text-[11px] text-ink-600">
                      <span className="font-bold text-ink-700 block">Certifying Body:</span>
                      {exam.certifyingBody}
                    </div>

                    {/* Section Breakdown Chips */}
                    <div className="space-y-1.5 mb-5">
                      <p className="text-[11px] uppercase tracking-wider font-bold text-ink-400">
                        Exam Sections:
                      </p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {exam.sections.map((sec) => (
                          <div
                            key={sec.id}
                            className="px-2 py-1 rounded-lg bg-surface-bg border border-ink-100 text-[11px] font-medium text-ink-700 truncate"
                            title={sec.name}
                          >
                            • {sec.name.split('(')[0].trim()}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer Stats & CTA */}
                  <div className="pt-4 border-t border-ink-100">
                    <div className="flex items-center justify-between text-xs text-ink-500 mb-4 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-ink-400" /> {exam.durationMinutes} min
                      </span>
                      <span>{totalQuestions} questions</span>
                      <span className="text-brand-700 font-semibold">+{exam.xpReward} XP</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate(`/exam/${exam.id}`)}
                      className={`w-full py-3 px-4 rounded-pill font-semibold text-sm flex items-center justify-center gap-2 shadow-soft-sm transition-all active:scale-95 ${
                        isPassed
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-brand-600 hover:bg-brand-700 text-white'
                      }`}
                    >
                      {isPassed ? (
                        <>
                          <Trophy className="w-4 h-4" /> View Certificate & Retake
                        </>
                      ) : hasAttempted ? (
                        <>
                          <RotateCcw className="w-4 h-4" /> Retake Examination
                        </>
                      ) : (
                        <>
                          Begin Official Exam <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

