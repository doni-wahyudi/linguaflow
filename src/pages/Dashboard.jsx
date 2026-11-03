import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  Lock,
  CheckCircle2,
  Clock,
  Award,
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { languages } from '../data/languages';
import { categories } from '../data/categories';
import { lessonsByLanguage } from '../data/lessons';
import { getLevel, getNextLevel, getLevelProgress } from '../utils/xp';
import PageWrapper from '../components/layout/PageWrapper';

/**
 * Dashboard — Main hub after onboarding
 *
 * Sections:
 * 1. Welcome header with greeting + streak + XP
 * 2. Daily goal progress
 * 3. Continue learning (last incomplete lesson)
 * 4. Recommended lessons
 * 5. Weekly activity
 */

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

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

  // Recent lessons (last 3 completed)
  const recentCompletions = useMemo(() => {
    return progress.completedLessons
      .slice(-3)
      .reverse()
      .map((cl) => langLessons.find((l) => l.id === cl.lessonId))
      .filter(Boolean);
  }, [progress.completedLessons, langLessons]);

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
            <div>
              <h1 className="font-display text-display-md text-ink-900">
                {getGreeting()}, {user.name}! {langData?.flag}
              </h1>
              <p className="text-body-md text-ink-500 mt-1">
                Continue your {langData?.name} journey
              </p>
            </div>

            {/* Quick stats */}
            <div className="flex items-center gap-4">
              {/* Streak */}
              <div className={`flex items-center gap-2 px-4 py-2 rounded-pill ${
                streak.currentStreak > 0 ? 'bg-amber-50 border border-amber-200' : 'bg-ink-100 border border-ink-200'
              }`}>
                <Flame className={`w-5 h-5 ${streak.currentStreak > 0 ? 'text-amber-500' : 'text-ink-400'}`} />
                <span className={`font-display font-bold text-lg ${streak.currentStreak > 0 ? 'text-amber-700' : 'text-ink-500'}`}>
                  {streak.currentStreak}
                </span>
              </div>

              {/* XP */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-pill bg-brand-50 border border-brand-200">
                <Zap className="w-5 h-5 text-brand-600" />
                <span className="font-display font-bold text-lg text-brand-700">{xp.totalXP}</span>
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
                <div className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-card p-6 text-white shadow-soft-lg relative overflow-hidden">
                  {/* Decorative circle */}
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
                  <div className="absolute -bottom-8 -right-4 w-24 h-24 bg-white/5 rounded-full" />

                  <div className="relative z-10">
                    <p className="text-brand-200 text-sm font-medium mb-2 flex items-center gap-1.5">
                      <Play className="w-4 h-4" /> Continue Learning
                    </p>
                    <h2 className="font-display font-bold text-2xl mb-1">
                      {nextLesson.title}
                    </h2>
                    <p className="text-brand-100 text-sm mb-5">
                      {nextLesson.description}
                    </p>
                    <button
                      onClick={() => navigate(`/learn/${nextLesson.id}`)}
                      className="inline-flex items-center gap-2 bg-white text-brand-700 font-semibold px-6 py-2.5 rounded-pill hover:bg-brand-50 transition-all duration-200 active:scale-[0.98] shadow-soft-sm"
                    >
                      Start Lesson
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Daily Goal */}
            <motion.div variants={fadeUp}>
              <div className="bg-surface-card rounded-card p-5 border border-ink-200/50 shadow-soft-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                      <Target className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-ink-900">Daily Goal</h3>
                      <p className="text-xs text-ink-500">{user.dailyGoal} min/day</p>
                    </div>
                  </div>
                  {dailyGoalMet && (
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-pill">
                      <CheckCircle2 className="w-4 h-4" /> Complete!
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {Array.from({ length: dailyGoalLessons }, (_, i) => (
                    <div key={i} className="flex-1">
                      <div className={`h-3 rounded-full transition-all duration-500 ${
                        i < todayCompleted
                          ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                          : 'bg-ink-100'
                      }`} />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-ink-500 mt-2">
                  {todayCompleted} of {dailyGoalLessons} lessons completed today
                </p>
              </div>
            </motion.div>

            {/* Lesson Categories */}
            <motion.div variants={fadeUp}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold text-xl text-ink-900">Lessons</h2>
                <Link
                  to="/lessons"
                  className="text-sm font-medium text-brand-600 hover:text-brand-700 inline-flex items-center gap-1 transition-colors"
                >
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {langCategories.slice(0, 4).map((cat) => {
                  const catLessons = langLessons.filter((l) => l.categoryId === cat.id);
                  const completedCount = catLessons.filter((l) => progress.isLessonCompleted(l.id)).length;
                  const isLocked = cat.unlockAfter && !langCategories
                    .find(c => c.id === cat.unlockAfter)
                    ?.id;
                  const prog = catLessons.length > 0 ? (completedCount / catLessons.length) * 100 : 0;

                  return (
                    <Link
                      key={cat.id}
                      to="/lessons"
                      className="bg-surface-card rounded-card p-4 border border-ink-200/50 shadow-soft-sm hover:shadow-soft-md hover:-translate-y-0.5 transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{cat.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-display font-semibold text-ink-900 truncate">{cat.name}</p>
                          <p className="text-xs text-ink-500">{completedCount}/{catLessons.length} lessons</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-ink-400 group-hover:text-brand-600 transition-colors" />
                      </div>

                      {/* Progress bar */}
                      <div className="h-1.5 bg-ink-100 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${prog}%` }}
                          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        />
                      </div>
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
              <div className="bg-surface-card rounded-card p-5 border border-ink-200/50 shadow-soft-sm">
                <h3 className="font-display font-semibold text-ink-900 mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" /> Your Level
                </h3>

                <div className="text-center mb-4">
                  <span className="text-4xl block mb-2">{currentLevel.emoji}</span>
                  <p className="font-display font-bold text-lg text-ink-900">{currentLevel.name}</p>
                  {nextLevel && (
                    <p className="text-xs text-ink-500 mt-1">
                      {xp.xpToNextLevel} XP to {nextLevel.name} {nextLevel.emoji}
                    </p>
                  )}
                </div>

                {/* Level progress bar */}
                <div className="h-2.5 bg-ink-100 rounded-full overflow-hidden mb-2">
                  <motion.div
                    className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${levelProg * 100}%` }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
                <p className="text-xs text-ink-500 text-center">
                  {xp.totalXP} XP total
                </p>
              </div>
            </motion.div>

            {/* Weekly Activity */}
            <motion.div variants={fadeUp}>
              <div className="bg-surface-card rounded-card p-5 border border-ink-200/50 shadow-soft-sm">
                <h3 className="font-display font-semibold text-ink-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-brand-600" /> This Week
                </h3>

                <div className="flex items-end justify-between gap-2 h-24">
                  {weeklyData.map((day, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full flex items-end justify-center" style={{ height: '64px' }}>
                        <motion.div
                          className={`w-full max-w-[28px] rounded-md ${
                            day.isToday
                              ? 'bg-brand-500'
                              : day.value > 0
                              ? 'bg-brand-200'
                              : 'bg-ink-100'
                          }`}
                          initial={{ height: 0 }}
                          animate={{ height: day.value > 0 ? `${Math.max((day.value / maxWeekly) * 100, 20)}%` : '12%' }}
                          transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                        />
                      </div>
                      <span className={`text-xs font-medium ${
                        day.isToday ? 'text-brand-600' : 'text-ink-400'
                      }`}>
                        {day.day}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={fadeUp}>
              <div className="bg-surface-card rounded-card p-5 border border-ink-200/50 shadow-soft-sm">
                <h3 className="font-display font-semibold text-ink-900 mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <Link
                    to="/practice"
                    className="flex items-center gap-3 p-3 rounded-button hover:bg-brand-50 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center group-hover:bg-brand-100 transition-colors">
                      <Repeat className="w-4 h-4 text-brand-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink-900">Practice Hub</p>
                      <p className="text-xs text-ink-500">Flashcards, drills & audio</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-ink-400 ml-auto" />
                  </Link>

                  <Link
                    to="/exams"
                    className="flex items-center gap-3 p-3 rounded-button hover:bg-emerald-50 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                      <Award className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink-900">Official Exams</p>
                      <p className="text-xs text-ink-500">CEFR & JLPT certified tests</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-ink-400 ml-auto" />
                  </Link>

                  <Link
                    to="/writing"
                    className="flex items-center gap-3 p-3 rounded-button hover:bg-purple-50 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                      <PenTool className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink-900">Handwriting Lab</p>
                      <p className="text-xs text-ink-500">Stylus & touch practice</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-ink-400 ml-auto" />
                  </Link>

                  <Link
                    to="/lessons"
                    className="flex items-center gap-3 p-3 rounded-button hover:bg-amber-50 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                      <BookOpen className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink-900">Browse Lessons</p>
                      <p className="text-xs text-ink-500">All categories</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-ink-400 ml-auto" />
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Streak Card */}
            <motion.div variants={fadeUp}>
              <div className={`rounded-card p-5 border shadow-soft-sm ${
                streak.currentStreak > 0
                  ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200'
                  : 'bg-surface-card border-ink-200/50'
              }`}>
                <div className="flex items-center gap-3 mb-3">
                  <Flame className={`w-8 h-8 ${streak.currentStreak > 0 ? 'text-amber-500' : 'text-ink-300'}`} />
                  <div>
                    <p className="font-display font-bold text-2xl text-ink-900">{streak.currentStreak}</p>
                    <p className="text-xs text-ink-500">day streak</p>
                  </div>
                </div>
                {streak.currentStreak > 0 ? (
                  <p className="text-sm text-amber-700">
                    🔥 Keep it going! Longest: {streak.longestStreak} days
                  </p>
                ) : (
                  <p className="text-sm text-ink-500">
                    Complete a lesson today to start your streak!
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </PageWrapper>
  );
}

