import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Lock,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Play,
  Search,
  Award,
  Filter,
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { languages } from '../data/languages';
import { categories } from '../data/categories';
import { lessonsByLanguage } from '../data/lessons';
import PageWrapper from '../components/layout/PageWrapper';

/**
 * Lessons — Browse all curriculum categories organized by official proficiency levels (CEFR & JLPT).
 */

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

export default function Lessons() {
  const { user, progress } = useUser();
  const navigate = useNavigate();

  const langData = languages.find((l) => l.id === user.selectedLanguage) || languages[0];
  const frameworkName = langData.framework?.name || 'CEFR';

  const [selectedLevel, setSelectedLevel] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const langLessons = useMemo(() => lessonsByLanguage[user.selectedLanguage] || [], [user.selectedLanguage]);
  const langCategories = useMemo(() => categories.filter((c) => !c.languageId || c.languageId === user.selectedLanguage), [user.selectedLanguage]);

  // Determine level for category
  const getCategoryLevel = (cat) => {
    return user.selectedLanguage === 'ja' ? cat.jlptLevel : cat.cefrLevel;
  };

  // Available levels for current language
  const availableLevels = useMemo(() => {
    const set = new Set();
    langCategories.forEach((cat) => {
      set.add(getCategoryLevel(cat));
    });
    return ['All', ...Array.from(set)];
  }, [langCategories, user.selectedLanguage]);

  // Filter categories by level and search
  const filteredCategories = useMemo(() => {
    return langCategories.filter((cat) => {
      const catLevel = getCategoryLevel(cat);
      const matchesLevel = selectedLevel === 'All' || catLevel === selectedLevel;

      if (!matchesLevel) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const catLessons = langLessons.filter((l) => l.categoryId === cat.id);
      const matchesCatName = cat.name.toLowerCase().includes(q) || cat.description.toLowerCase().includes(q);
      const matchesLessons = catLessons.some(
        (l) => l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q)
      );
      return matchesCatName || matchesLessons;
    });
  }, [langCategories, langLessons, selectedLevel, searchQuery, user.selectedLanguage]);

  // Determine which categories are unlocked
  const isCategoryUnlocked = (cat) => {
    if (!cat.unlockAfter) return true;
    const reqCat = langCategories.find((c) => c.id === cat.unlockAfter);
    if (!reqCat) return true;
    const reqLessons = langLessons.filter((l) => l.categoryId === reqCat.id);
    return reqLessons.length > 0 && reqLessons.every((l) => progress.isLessonCompleted(l.id));
  };

  // Calculate level mastery summary
  const levelStats = useMemo(() => {
    const stats = {};
    availableLevels.filter((lvl) => lvl !== 'All').forEach((lvl) => {
      const catsForLevel = langCategories.filter((c) => getCategoryLevel(c) === lvl);
      const catIds = new Set(catsForLevel.map((c) => c.id));
      const lessonsForLevel = langLessons.filter((l) => catIds.has(l.categoryId));
      const completed = lessonsForLevel.filter((l) => progress.isLessonCompleted(l.id)).length;
      stats[lvl] = {
        total: lessonsForLevel.length,
        completed,
        percent: lessonsForLevel.length > 0 ? Math.round((completed / lessonsForLevel.length) * 100) : 0,
      };
    });
    return stats;
  }, [availableLevels, langCategories, langLessons, progress, user.selectedLanguage]);

  return (
    <PageWrapper>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={fadeUp} className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-display-md text-ink-900 mb-1 flex items-center gap-2">
              {langData.flag} {langData.name} Curriculum
            </h1>
            <p className="text-body-md text-ink-500">
              Structured according to the official <strong>{frameworkName}</strong> framework ({langData.framework?.fullName}).
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-ink-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search lessons or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-pill border border-ink-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
            />
          </div>
        </motion.div>

        {/* Level Progression Banner */}
        <motion.div variants={fadeUp} className="mb-6 bg-white rounded-card p-4 border border-ink-200/80 shadow-soft-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-600 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              {frameworkName} Certification Progress
            </span>
            <span className="text-xs text-ink-400">
              Complete lessons to unlock higher level exams
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(levelStats).map(([lvl, stat]) => (
              <div
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`p-3 rounded-xl border-2 transition-all cursor-pointer ${
                  selectedLevel === lvl
                    ? 'border-brand-600 bg-brand-50/50 shadow-soft-sm'
                    : 'border-ink-200/60 hover:border-ink-300 bg-ink-50/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-display font-bold text-sm text-ink-900">
                    {frameworkName} {lvl}
                  </span>
                  <span className="text-xs font-semibold text-brand-700">
                    {stat.percent}%
                  </span>
                </div>
                <div className="h-1.5 bg-ink-200 rounded-full overflow-hidden mb-1">
                  <div
                    className="h-full bg-brand-600 rounded-full"
                    style={{ width: `${stat.percent}%` }}
                  />
                </div>
                <p className="text-[11px] text-ink-500">
                  {stat.completed} of {stat.total} lessons
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Level Filter Tabs */}
        <motion.div variants={fadeUp} className="mb-8 flex flex-wrap gap-2 items-center">
          <span className="text-xs font-semibold text-ink-400 mr-1 flex items-center gap-1">
            <Filter size={13} /> Filter Level:
          </span>
          {availableLevels.map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setSelectedLevel(lvl)}
              className={`px-3.5 py-1.5 rounded-pill text-xs font-semibold transition-all ${
                selectedLevel === lvl
                  ? 'bg-brand-600 text-white shadow-soft-sm'
                  : 'bg-white border border-ink-200 text-ink-600 hover:bg-ink-100'
              }`}
            >
              {lvl === 'All' ? 'All Tiers' : `${frameworkName} ${lvl}`}
            </button>
          ))}
        </motion.div>

        {/* Category List */}
        <div className="space-y-8">
          {filteredCategories.map((cat) => {
            const catLessons = langLessons.filter((l) => l.categoryId === cat.id);
            const completedCount = catLessons.filter((l) => progress.isLessonCompleted(l.id)).length;
            const unlocked = isCategoryUnlocked(cat);
            const allDone = catLessons.length > 0 && completedCount === catLessons.length;
            const prog = catLessons.length > 0 ? (completedCount / catLessons.length) * 100 : 0;
            const catLevel = getCategoryLevel(cat);

            return (
              <motion.div key={cat.id} variants={fadeUp}>
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{cat.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <h2 className="font-display font-semibold text-xl text-ink-900">{cat.name}</h2>
                      {/* Level Badge */}
                      <span className="text-[11px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-pill">
                        {frameworkName} {catLevel}
                      </span>
                      {allDone && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 px-2.5 py-0.5 rounded-pill border border-green-200">
                          <CheckCircle2 className="w-3 h-3" /> Complete
                        </span>
                      )}
                      {!unlocked && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-ink-400 bg-ink-100 px-2 py-0.5 rounded-pill">
                          <Lock className="w-3 h-3" /> Locked
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-ink-500">{cat.description}</p>
                  </div>
                  <span className="text-sm font-semibold text-ink-600 flex-shrink-0">
                    {completedCount}/{catLessons.length}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 bg-ink-100 rounded-full overflow-hidden mb-4">
                  <motion.div
                    className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${prog}%` }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>

                {/* Lesson Cards */}
                {unlocked ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {catLessons.map((lesson, idx) => {
                      const completed = progress.isLessonCompleted(lesson.id);
                      const prevLesson = idx > 0 ? catLessons[idx - 1] : null;
                      const available = !prevLesson || progress.isLessonCompleted(prevLesson.id);

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => {
                            if (available || completed) {
                              navigate(`/learn/${lesson.id}`);
                            }
                          }}
                          disabled={!available && !completed}
                          className={`text-left p-4 rounded-card border transition-all duration-200 group ${
                            completed
                              ? 'bg-brand-50/50 border-brand-200 hover:shadow-soft-sm'
                              : available
                              ? 'bg-surface-card border-ink-200/50 hover:shadow-soft-md hover:-translate-y-0.5 cursor-pointer'
                              : 'bg-ink-50 border-ink-200/30 opacity-60 cursor-not-allowed'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {completed ? (
                                <CheckCircle2 className="w-5 h-5 text-brand-600 flex-shrink-0" />
                              ) : available ? (
                                <Play className="w-5 h-5 text-brand-600 flex-shrink-0 group-hover:text-brand-700" />
                              ) : (
                                <Lock className="w-5 h-5 text-ink-400 flex-shrink-0" />
                              )}
                              <h3 className="font-display font-semibold text-ink-900">{lesson.title}</h3>
                            </div>
                            {(available || completed) && (
                              <ChevronRight className="w-4 h-4 text-ink-400 group-hover:text-brand-600 transition-colors flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-ink-500 mb-2 leading-relaxed">{lesson.description}</p>
                          <div className="flex items-center gap-2.5 text-xs text-ink-400">
                            <span className="font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md">
                              {frameworkName} {lesson.level || catLevel}
                            </span>
                            <span>•</span>
                            <span>{lesson.vocabulary?.length || 0} words</span>
                            <span>•</span>
                            <span className="text-amber-600 font-medium">+{lesson.xpReward} XP</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-ink-50 rounded-card p-6 border border-ink-200/30 text-center">
                    <Lock className="w-8 h-8 text-ink-300 mx-auto mb-2" />
                    <p className="text-sm text-ink-500">
                      Complete <strong>{langCategories.find(c => c.id === cat.unlockAfter)?.name}</strong> ({frameworkName} {catLevel}) to unlock
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })}

          {filteredCategories.length === 0 && (
            <div className="text-center py-12 bg-white rounded-card border border-ink-200">
              <BookOpen className="w-10 h-10 text-ink-300 mx-auto mb-2" />
              <p className="font-semibold text-ink-700">No lessons found matching your filters</p>
              <button
                type="button"
                onClick={() => {
                  setSelectedLevel('All');
                  setSearchQuery('');
                }}
                className="mt-3 text-xs text-brand-600 font-semibold hover:underline"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </PageWrapper>
  );
}
