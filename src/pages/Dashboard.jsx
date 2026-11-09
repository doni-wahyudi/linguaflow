import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { transitionEase } from '../utils/motion';
import {
  Flame,
  Zap,
  BookOpen,
  ArrowRight,
  Trophy,
  Target,
  Calendar,
  ChevronRight,
  Play,
  Repeat,
  PenTool,
  CheckCircle2,
  Award,
  Mic,
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { languages } from '../data/languages';
import { categories } from '../data/categories';
import { lessonsByLanguage } from '../data/lessons';
import { getLevel, getNextLevel, getLevelProgress } from '../utils/xp';
import PageWrapper from '../components/layout/PageWrapper';
import { Flag, SemanticIcon } from '../components/brand';
import { Card, Badge, ProgressBar, Button } from '../components/ui';

/**
 * Dashboard — Main hub after onboarding
 *
 * Sections:
 * 1. Welcome header with greeting + streak + XP
 * 2. Daily goal progress
 * 3. Continue learning (last incomplete lesson)
 * 4. Recommended lessons
 * 5. Weekly activity
 *
 * Colour tiers follow the measured contrast rules documented in tailwind.config.js.
 * The emerald hero runs a brand-700→800 gradient with brand-100 text (worst point
 * 4.84:1); the previous brand-600 gradient with a brand-200 eyebrow measured 2.94:1.
 */

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: transitionEase } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

/* Icon chips: four sanctioned palette roles, one per destination, with the glyph
   on the -700 tier so each chip clears 3:1 as a non-text element. */
const tintClasses = {
  brand: 'bg-brand-50 border-brand-100 text-brand-700 group-hover:bg-brand-100',
  amber: 'bg-amber-50 border-amber-100 text-amber-700 group-hover:bg-amber-100',
  coral: 'bg-coral-50 border-coral-100 text-coral-700 group-hover:bg-coral-100',
  info: 'bg-info-bg border-info-bg text-info-strong group-hover:bg-info/10',
};

const quickActions = [
  { to: '/practice?tab=speaking', icon: Mic, tint: 'brand', title: 'Speaking Studio', subtitle: 'Oral production & voice score' },
  { to: '/exams', icon: Award, tint: 'info', title: 'Official Exams', subtitle: 'CEFR & JLPT certified tests' },
  { to: '/practice', icon: Repeat, tint: 'amber', title: 'Practice Hub', subtitle: 'Flashcards, drills & audio' },
  { to: '/characters', icon: PenTool, tint: 'coral', title: 'Characters & Script', subtitle: 'Kana, Kanji & calligraphy' },
  { to: '/lessons', icon: BookOpen, tint: 'brand', title: 'Browse Lessons', subtitle: 'All curriculum units' },
];

export default function Dashboard() {
  const { user, progress, streak, xp } = useUser();
  const navigate = useNavigate();

  const langData = languages.find((l) => l.id === user.selectedLanguage);
  const currentLevel = getLevel(xp.totalXP);
  const nextLevel = getNextLevel(xp.totalXP);
  const levelProg = getLevelProgress(xp.totalXP);

  // Get lessons for selected language
  const langLessons = useMemo(() => {
    return lessonsByLanguage[user.selectedLanguage] || [];
  }, [user.selectedLanguage]);

  // Get current language categories
  const langCategories = useMemo(() => {
    return categories.filter(
      (c) => !c.languageId || c.languageId === user.selectedLanguage
    );
  }, [user.selectedLanguage]);

  // Find next lesson to continue
  const nextLesson = useMemo(() => {
    for (const cat of langCategories) {
      const catLessons = langLessons.filter((l) => l.categoryId === cat.id);
      for (const lesson of catLessons) {
        if (!progress.isLessonCompleted(lesson.id)) {
          return lesson;
        }
      }
    }
    return null;
  }, [langCategories, langLessons, progress]);

  // Calculate today's completed lessons
  const todayCompleted = useMemo(() => {
    const today = new Date().toDateString();
    return progress.completedLessons.filter((cl) => {
      return new Date(cl.completedAt).toDateString() === today;
    }).length;
  }, [progress.completedLessons]);

  const dailyGoalLessons = user.dailyGoal <= 5 ? 1 : user.dailyGoal <= 10 ? 2 : user.dailyGoal <= 15 ? 3 : 4;
  const dailyGoalMet = todayCompleted >= dailyGoalLessons;

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Weekly activity data (last 7 days)
  const weeklyData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const data = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();

      const lessonsOnDay = progress.completedLessons.filter(
        (cl) => new Date(cl.completedAt).toDateString() === dateStr
      ).length;

      data.push({
        day: days[date.getDay()],
        value: lessonsOnDay,
        isToday: i === 0,
        date: dateStr,
      });
    }
    return data;
  }, [progress.completedLessons]);

  const maxWeekly = Math.max(...weeklyData.map((d) => d.value), 1);
  const weeklyTotal = weeklyData.reduce((sum, d) => sum + d.value, 0);

  return (
    <PageWrapper>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="max-w-5xl mx-auto"
      >
        {/* ── Welcome Header ── */}
        <motion.div variants={fadeUp} className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="min-w-0">
              <h1 className="font-display text-display-lg text-ink-900 flex items-center gap-3">
                <span className="min-w-0 truncate">{getGreeting()}, {user.name}</span>
                {langData && (
                  <Flag code={langData.flagCode} size={22} />
                )}
              </h1>
              <p className="text-body-md text-ink-500 mt-1">
                Continue your {langData?.name} journey
              </p>
            </div>

            {/* Streak is the coral role, XP the amber one (§2.4) */}
            <div className="flex items-center gap-3">
              <div
                className={`flex items-center gap-2 px-4 h-10 rounded-pill border ${
                  streak.currentStreak > 0
                    ? 'bg-coral-50 border-coral-200'
                    : 'bg-surface-100 border-ink-200'
                }`}
              >
                <Flame
                  className={`w-5 h-5 ${streak.currentStreak > 0 ? 'text-coral-600' : 'text-ink-500'}`}
                  aria-hidden="true"
                />
                <span
                  className={`font-display font-bold text-body-lg tabular-nums ${
                    streak.currentStreak > 0 ? 'text-coral-700' : 'text-ink-700'
                  }`}
                >
                  {streak.currentStreak}
                  <span className="sr-only"> day streak</span>
                </span>
              </div>

              <div className="flex items-center gap-2 px-4 h-10 rounded-pill bg-amber-50 border border-amber-200">
                <Zap className="w-5 h-5 text-amber-700" aria-hidden="true" />
                <span className="font-display font-bold text-body-lg text-amber-800 tabular-nums">
                  {xp.totalXP}
                  <span className="sr-only"> total XP</span>
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* ── Left Column (2 cols on lg) ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Continue Learning Card */}
            {nextLesson && (
              <motion.div variants={fadeUp}>
                <div className="bg-gradient-to-br from-brand-700 to-brand-800 rounded-card p-6 text-white shadow-soft-lg relative overflow-hidden">
                  {/* Decorative circles are noise and must not read as content. */}
                  <div aria-hidden="true" className="absolute -top-10 -right-10 w-40 h-40 bg-surface-card/10 rounded-pill" />
                  <div aria-hidden="true" className="absolute -bottom-8 -right-4 w-24 h-24 bg-surface-card/5 rounded-pill" />

                  <div className="relative z-10">
                    <p className="text-overline text-brand-100 mb-3 flex items-center gap-1.5">
                      <Play className="w-4 h-4" aria-hidden="true" /> Continue learning
                    </p>
                    <h2 className="font-display font-bold text-display-sm mb-1.5">
                      {nextLesson.title}
                    </h2>
                    <p className="text-body-sm text-brand-100 mb-5 max-w-prose">
                      {nextLesson.description}
                    </p>
                    <Button
                      variant="inverse"
                      shape="pill"
                      size="lg"
                      icon={ArrowRight}
                      iconPosition="right"
                      onClick={() => navigate(`/learn/${nextLesson.id}`)}
                    >
                      Start Lesson
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Flagship Hubs: Speaking Studio & Official Exams */}
            <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                to="/practice?tab=speaking"
                className="group block p-4 rounded-card bg-surface-card border border-ink-200 hover:border-brand-500 hover:shadow-card-hover transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-button bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Mic className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display font-semibold text-body-sm text-ink-900 group-hover:text-brand-700 transition-colors">
                      Speaking Studio
                    </h3>
                    <p className="text-caption text-ink-500 truncate">
                      Real-time voice & enunciation feedback
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-ink-400 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                </div>
              </Link>

              <Link
                to="/exams"
                className="group block p-4 rounded-card bg-surface-card border border-ink-200 hover:border-amber-500 hover:shadow-card-hover transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-button bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Award className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display font-semibold text-body-sm text-ink-900 group-hover:text-amber-700 transition-colors">
                      Official Mock Exams
                    </h3>
                    <p className="text-caption text-ink-500 truncate">
                      CEFR & JLPT certified assessments
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-ink-400 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                </div>
              </Link>
            </motion.div>

            {/* Daily Goal */}
            <motion.div variants={fadeUp}>
              <Card padding="sm">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-button bg-amber-50 border border-amber-200 flex items-center justify-center">
                      <Target className="w-5 h-5 text-amber-700" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-ink-900">Daily Goal</h3>
                      <p className="text-caption text-ink-500">{user.dailyGoal} min/day</p>
                    </div>
                  </div>
                  {dailyGoalMet && (
                    <Badge variant="success" icon={CheckCircle2}>Complete</Badge>
                  )}
                </div>

                <ProgressBar
                  value={todayCompleted}
                  max={dailyGoalLessons}
                  color="amber"
                  label="Daily goal"
                  valueText={`${todayCompleted} of ${dailyGoalLessons} lessons`}
                />
                <p className="text-body-sm text-ink-500 mt-2 tabular-nums">
                  {todayCompleted} of {dailyGoalLessons} lessons completed today
                </p>
              </Card>
            </motion.div>

            {/* Lesson Categories */}
            <motion.div variants={fadeUp}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold text-display-xs text-ink-900">Lessons</h2>
                <Link
                  to="/lessons"
                  className="text-body-sm font-semibold text-brand-700 hover:text-brand-800 inline-flex items-center gap-1 transition-colors"
                >
                  View all <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {langCategories.slice(0, 4).map((cat) => {
                  const catLessons = langLessons.filter((l) => l.categoryId === cat.id);
                  const completedCount = catLessons.filter((l) => progress.isLessonCompleted(l.id)).length;

                  return (
                    <Link key={cat.id} to="/lessons" className="group block">
                      <Card padding="sm" className="h-full hover:shadow-card-hover hover:-translate-y-0.5">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="w-9 h-9 rounded-button bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0">
                            <SemanticIcon name={cat.icon} size={18} className="text-brand-700" />
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="font-display font-semibold text-ink-900 truncate">{cat.name}</p>
                            <p className="text-caption text-ink-500 tabular-nums">
                              {completedCount}/{catLessons.length} lessons
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-ink-500 group-hover:text-brand-700 transition-colors" aria-hidden="true" />
                        </div>

                        <ProgressBar
                          value={completedCount}
                          max={catLessons.length || 1}
                          size="sm"
                          label={`${cat.name} progress`}
                        />
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* ── Right Sidebar ── */}
          <div className="space-y-5">
            {/* Level Progress */}
            <motion.div variants={fadeUp}>
              <Card padding="sm">
                <h3 className="font-display font-semibold text-ink-900 mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-700" aria-hidden="true" /> Your Level
                </h3>

                <div className="text-center mb-4">
                  <span className="w-14 h-14 mx-auto mb-2 rounded-card bg-brand-50 border border-brand-100 flex items-center justify-center">
                    <SemanticIcon
                      name={currentLevel.icon}
                      size={28}
                      className="text-brand-700"
                      label={currentLevel.name}
                    />
                  </span>
                  <p className="font-display font-bold text-body-lg text-ink-900">{currentLevel.name}</p>
                  {nextLevel && (
                    <p className="text-caption text-ink-500 mt-1 tabular-nums">
                      {xp.xpToNextLevel} XP to {nextLevel.name}
                    </p>
                  )}
                </div>

                <ProgressBar
                  value={levelProg}
                  max={1}
                  label="Progress to next level"
                  valueText={`${Math.round(levelProg * 100)}% to ${nextLevel?.name || 'the next level'}`}
                  className="mb-2"
                />
                <p className="text-caption text-ink-500 text-center tabular-nums">
                  {xp.totalXP} XP total
                </p>
              </Card>
            </motion.div>

            {/* Weekly Activity */}
            <motion.div variants={fadeUp}>
              <Card padding="sm">
                <div className="flex items-baseline justify-between gap-2 mb-4">
                  <h3 className="font-display font-semibold text-ink-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-brand-700" aria-hidden="true" /> Weekly activity
                  </h3>
                  <span className="text-caption text-ink-500">Last 7 days</span>
                </div>

                {weeklyTotal === 0 ? (
                  /* An all-zero bar chart read as a broken widget; say it in words. */
                  <div className="py-6 text-center">
                    <p className="text-body-sm text-ink-700">No lessons in the last 7 days</p>
                    <p className="text-caption text-ink-500 mt-1">
                      Finish one lesson today and this fills in.
                    </p>
                  </div>
                ) : (
                  <div
                    className="flex items-end justify-between gap-2 h-28"
                    role="group"
                    aria-label={`Lessons completed per day over the last 7 days, ${weeklyTotal} total`}
                  >
                    {weeklyData.map((day, i) => (
                      <div key={day.date} className="flex-1 flex flex-col items-center gap-1.5">
                        <span className="text-caption text-ink-700 tabular-nums leading-none h-4">
                          {day.value > 0 ? day.value : ''}
                        </span>
                        <div className="w-full h-14 flex items-end justify-center">
                          <motion.div
                            role="img"
                            aria-label={`${day.day}: ${day.value} lesson${day.value === 1 ? '' : 's'}`}
                            className={`w-full max-w-7 rounded-button ${
                              day.value > 0
                                ? day.isToday ? 'bg-brand-700' : 'bg-brand-600'
                                : 'bg-ink-200'
                            }`}
                            initial={{ height: 0 }}
                            animate={{
                              height: day.value > 0 ? `${Math.max((day.value / maxWeekly) * 100, 20)}%` : '12%',
                            }}
                            transition={{ duration: 0.5, delay: i * 0.05, ease: transitionEase }}
                          />
                        </div>
                        <span className={`text-caption ${day.isToday ? 'text-ink-900 font-bold' : 'text-ink-500'}`}>
                          {day.day}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={fadeUp}>
              <Card padding="sm">
                <h3 className="font-display font-semibold text-ink-900 mb-3">Quick Actions</h3>
                <div className="space-y-1">
                  {quickActions.map(({ to, icon: Icon, tint, title, subtitle }) => (
                    <Link
                      key={to}
                      to={to}
                      className="flex items-center gap-3 p-3 rounded-button hover:bg-surface-100 transition-colors group"
                    >
                      <div className={`w-9 h-9 rounded-button border flex items-center justify-center transition-colors ${tintClasses[tint]}`}>
                        <Icon className="w-4 h-4" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-body-sm font-semibold text-ink-900">{title}</p>
                        <p className="text-caption text-ink-500">{subtitle}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-ink-500 ml-auto" aria-hidden="true" />
                    </Link>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Streak Card */}
            <motion.div variants={fadeUp}>
              <Card padding="sm" tone={streak.currentStreak > 0 ? 'coral' : 'quiet'}>
                <div className="flex items-center gap-3 mb-3">
                  <Flame
                    className={`w-8 h-8 ${streak.currentStreak > 0 ? 'text-coral-600' : 'text-ink-300'}`}
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-display font-bold text-display-sm text-ink-900 tabular-nums">
                      {streak.currentStreak}
                    </p>
                    <p className="text-caption text-ink-500">day streak</p>
                  </div>
                </div>
                {streak.currentStreak > 0 ? (
                  <p className="text-body-sm text-coral-700">
                    Keep it going — longest run {streak.longestStreak} days.
                  </p>
                ) : (
                  <p className="text-body-sm text-ink-500">
                    Complete a lesson today to start your streak.
                  </p>
                )}
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </PageWrapper>
  );
}

