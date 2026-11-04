/**
 * @file Exams.jsx
 * @description Official Proficiency Examination Hub and Hall of Certification.
 * Presents real CEFR (DELE, Goethe, DELF) & JLPT mock exams with strict time limits,
 * authentic question formats, passing thresholds, and printable certificates.
 *
 * Design-system migration notes:
 * - Surfaces come from the kit: the info banner and every exam card are `Card`,
 *   status chips are `Badge`, and the call to action is `Button`. The cards were
 *   raw `bg-white … border-2` motion.divs, which is how they ended up with a
 *   different radius, shadow and border weight from the rest of the app.
 * - `emerald-*` is gone. The build had seven emerald steps standing in for
 *   "success" (50/200/300/400/600/700/800) alongside `green-*` elsewhere; the
 *   sanctioned vocabulary is `success / success-bg / success-border /
 *   success-strong`, and `brand-*` for anything that is on-palette rather than a
 *   verdict.
 * - The dark hero is measured, not guessed. Its worst-case background is
 *   `brand-800` (the via-stop), and against it brand-100 = 6.78:1, brand-200 =
 *   5.99:1, brand-300 = 5.04:1, amber-300 = 5.33:1. The metric labels used to sit
 *   on `text-brand-200/80 text-xs`, which composites to 4.48:1 — a fail at 12px —
 *   so the alpha is dropped and the size token is `text-caption`.
 * - Section names were truncated behind a `title=` attribute. Tooltips are not
 *   reachable on touch and are unreliable for AT, and the Spanish/German names
 *   ("Prueba 2: Uso de la Lengua y Gramática") were being cut. The full name now
 *   wraps and the section's weight is shown — information the exam already
 *   carries and the hub was hiding.
 * - "Certified" is no longer colour alone: `accent="success"` adds the §5.2 left
 *   bar and the verdict is also written as text inside a Badge.
 */

import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Award,
  Clock,
  CheckCircle2,
  Headphones,
  ArrowRight,
  ShieldCheck,
  Trophy,
  RotateCcw,
  GraduationCap,
} from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import { Flag } from '../components/brand';
import { Badge, Button, Card } from '../components/ui';
import { useUser } from '../context/UserContext';
import { getExamsByLanguage } from '../data/exams';
import languages from '../data/languages';
import { transitionEase } from '../utils/motion';

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
        <div className="bg-gradient-to-br from-brand-900 via-brand-800 to-ink-900 rounded-card p-6 sm:p-10 text-white relative overflow-hidden shadow-soft-xl border border-brand-700">
          {/* Decorative glows: hidden from AT, tokenised radius */}
          <div
            aria-hidden="true"
            className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-pill blur-3xl pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="absolute bottom-0 right-1/4 w-64 h-64 bg-amber-500/10 rounded-pill blur-2xl pointer-events-none"
          />

          <div className="relative z-10 max-w-2xl">
            <Badge
              variant="inverse"
              size="md"
              icon={ShieldCheck}
              className="backdrop-blur-md mb-4"
            >
              Official Examination Standard • {langData?.framework?.name} Framework
            </Badge>

            <h1 className="font-display text-display-md sm:text-display-lg tracking-tight mb-3">
              Official Mock Proficiency Exams
            </h1>

            <p className="text-body-md text-brand-100 leading-relaxed mb-6">
              Test your true mastery under realistic exam conditions in{' '}
              <strong className="font-semibold text-white">{langData?.name}</strong>{' '}
              <Flag code={langData?.flagCode} size={16} decorative />
              . Timed countdowns, authentic reading texts, native audio listening
              tasks, and an accredited Certificate of Proficiency upon passing.
            </p>

            {/* Quick metrics */}
            <div className="grid grid-cols-3 gap-3 max-w-md pt-4 border-t border-surface-card/15">
              <div>
                <p className="font-display text-display-sm text-white tabular-nums">
                  {stats.passedCount} / {stats.totalCount}
                </p>
                <p className="text-caption text-brand-200 font-medium">Passed Exams</p>
              </div>

              <div>
                <p className="font-display text-display-sm text-amber-300 tabular-nums">
                  {langData?.framework?.levels?.[0]?.code} –{' '}
                  {langData?.framework?.levels?.[2]?.code || 'B1'}
                </p>
                <p className="text-caption text-brand-200 font-medium">Levels Covered</p>
              </div>

              <div>
                <p className="font-display text-display-sm text-brand-300 tabular-nums">
                  60%
                </p>
                <p className="text-caption text-brand-200 font-medium">Pass Threshold</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Exam Hall Information Banner ── */}
        <Card padding="sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div
                aria-hidden="true"
                className="w-12 h-12 rounded-card bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0"
              >
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-display font-bold text-body-md text-ink-900">
                  How Official Exams Work
                </h2>
                <p className="text-caption text-ink-500 mt-0.5 leading-relaxed">
                  Each mock exam replicates the exact section weighting, reading
                  lengths, and time pressure of the certified foreign language
                  examination.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-caption font-semibold text-ink-700 shrink-0">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-brand-700" aria-hidden="true" />
                Real-time Clock
              </span>
              <span className="flex items-center gap-1.5">
                <Headphones className="w-4 h-4 text-brand-700" aria-hidden="true" />
                Audio Listening
              </span>
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-700" aria-hidden="true" />
                Printable Certificate
              </span>
            </div>
          </div>
        </Card>

        {/* ── Exam Cards Grid ── */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="font-display font-bold text-display-sm text-ink-900">
                Available Mock Exams ({exams.length})
              </h2>
              {stats.attemptedCount > 0 && (
                <p className="text-caption text-ink-500 mt-1 tabular-nums">
                  You have sat {stats.attemptedCount} of {stats.totalCount} ·{' '}
                  {stats.passedCount} certified.
                </p>
              )}
            </div>
            <span className="text-caption text-ink-500 font-medium">
              Framework: {langData?.framework?.fullName}
            </span>
          </div>

          {exams.length === 0 ? (
            <Card tone="quiet" padding="lg" className="text-center">
              <p className="font-display font-bold text-display-xs text-ink-900 mb-1">
                No official exams for {langData?.name} yet
              </p>
              <p className="text-body-sm text-ink-500 mb-5">
                Mock examinations are written against each certifying body&apos;s own
                format and appear here as soon as they are ready.
              </p>
              <Button variant="outline" shape="pill" onClick={() => navigate('/lessons')}>
                Continue with lessons
              </Button>
            </Card>
          ) : (
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
                <Card
                  key={exam.id}
                  accent={isPassed ? 'success' : undefined}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.08, ease: transitionEase }}
                  className="h-full flex flex-col justify-between hover:shadow-card-hover"
                >
                  <div>
                    {/* Level & result header */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <Badge variant="brand" size="md">
                        Level {exam.level}
                      </Badge>

                      {isPassed ? (
                        <Badge variant="success" icon={CheckCircle2} numeric>
                          Certified {record.percentage}%
                        </Badge>
                      ) : hasAttempted ? (
                        <Badge variant="warning" icon={RotateCcw} numeric>
                          Score {record.percentage}%
                        </Badge>
                      ) : (
                        <Badge variant="outline">Ready to take</Badge>
                      )}
                    </div>

                    <h3 className="font-display font-bold text-display-xs text-ink-900 mb-1 leading-snug">
                      {exam.title}
                    </h3>

                    {exam.subtitle && (
                      <p className="text-caption text-brand-700 font-semibold mb-2">
                        {exam.subtitle}
                      </p>
                    )}

                    <p className="text-body-sm text-ink-500 line-clamp-2 leading-relaxed mb-4">
                      {exam.description}
                    </p>

                    {/* Certifying Authority */}
                    <div className="p-3 rounded-button bg-surface-100 border border-ink-200 mb-4">
                      <p className="text-overline uppercase text-ink-500 mb-0.5">
                        Certifying body
                      </p>
                      <p className="text-caption text-ink-700">{exam.certifyingBody}</p>
                    </div>

                    {/* Section weighting */}
                    <div className="mb-5">
                      <p className="text-overline uppercase text-ink-500 mb-2">
                        Exam sections
                      </p>
                      <ul className="space-y-1.5">
                        {exam.sections.map((sec) => (
                          <li
                            key={sec.id}
                            className="flex items-start justify-between gap-3 text-caption"
                          >
                            <span className="text-ink-700">{sec.name}</span>
                            <span className="shrink-0 tabular-nums text-ink-500">
                              {sec.weight}%
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Footer Stats & CTA */}
                  <div className="pt-4 border-t border-ink-200 mt-auto">
                    <div className="flex items-center justify-between text-caption text-ink-500 font-medium mb-4 tabular-nums">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-ink-500" aria-hidden="true" />
                        {exam.durationMinutes} min
                      </span>
                      <span>{totalQuestions} questions</span>
                      <span className="text-brand-700 font-semibold">
                        +{exam.xpReward} XP
                      </span>
                    </div>

                    <Button
                      shape="pill"
                      size="md"
                      fullWidth
                      variant={isPassed ? 'secondary' : 'primary'}
                      icon={isPassed ? Trophy : hasAttempted ? RotateCcw : ArrowRight}
                      iconPosition={isPassed || hasAttempted ? 'left' : 'right'}
                      onClick={() => navigate(`/exam/${exam.id}`)}
                    >
                      {isPassed
                        ? 'View certificate & retake'
                        : hasAttempted
                          ? 'Retake examination'
                          : 'Begin official exam'}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}

