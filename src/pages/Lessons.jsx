import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { transitionEase } from '../utils/motion';
import {
  BookOpen,
  Lock,
  CheckCircle2,
  ChevronRight,
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
import { Flag, SemanticIcon } from '../components/brand';
import { Card, Badge, ProgressBar, Input, Button } from '../components/ui';

/**
 * Lessons — Browse all curriculum categories organized by official proficiency levels (CEFR & JLPT).
 *
 * Presentation comes from the ui/ kit: level tiles and lesson cards are <Card>s,
 * completion meters are <ProgressBar>s (so they carry an accessible name), and
 * search is <Input>. Colours stay on the token scale — the previous build used
 * `text-ink-600`, which is not a token at all and silently rendered unstyled.
 */

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: transitionEase } },
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
              <Flag code={langData.flagCode} size={22} decorative />
              {langData.name} Curriculum
            </h1>
            <p className="text-body-md text-ink-500">
              Structured according to the official{' '}
              <strong className="font-semibold text-ink-700">{frameworkName}</strong> framework ({langData.framework?.fullName}).
            </p>
          </div>

          {/* Search — a real labelled field, not a bare styled input */}
          <div className="w-full md:w-72">
            <Input
              srOnlyLabel="Search lessons"
              placeholder="Search lessons or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={Search}
            />
          </div>
        </motion.div>

        {/* Level Progression Banner */}
        <motion.div variants={fadeUp} className="mb-6">
          <Card padding="sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <span className="text-caption uppercase font-semibold text-brand-700 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600" aria-hidden="true" />
                {frameworkName} Certification Progress
              </span>
              <span className="text-caption text-ink-500">
                Complete lessons to unlock higher level exams
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(levelStats).map(([lvl, stat]) => {
                const active = selectedLevel === lvl;
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSelectedLevel(lvl)}
                    aria-pressed={active}
                    className={[
                      'text-left p-3 rounded-card border bg-surface-card transition-colors',
                      active ? 'border-brand-700 bg-brand-50' : 'border-ink-200 hover:border-ink-300',
                    ].join(' ')}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-display font-bold text-body-sm text-ink-900">
                        {frameworkName} {lvl}
                      </span>
                      <span className="text-caption font-semibold tabular-nums text-brand-700">
                        {stat.percent}%
                      </span>
                    </div>
                    <ProgressBar
                      value={stat.percent}
                      size="sm"
                      label={`${frameworkName} ${lvl}`}
                      valueText={`${stat.completed} of ${stat.total} lessons`}
                    />
                  </button>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Level Filter Tabs */}
        <motion.div variants={fadeUp} className="mb-8 flex flex-wrap gap-2 items-center">
          <span className="text-caption font-semibold text-ink-500 mr-1 flex items-center gap-1.5">
            <Filter size={14} aria-hidden="true" /> Filter Level:
          </span>
          {availableLevels.map((lvl) => {
            const active = selectedLevel === lvl;
            return (
              <button
                key={lvl}
                type="button"
                onClick={() => setSelectedLevel(lvl)}
                aria-pressed={active}
                className={`px-3.5 h-8 rounded-pill text-caption font-semibold transition-colors ${
                  active
                    ? 'bg-brand-700 text-white'
                    : 'bg-surface-card border border-ink-300 text-ink-700 hover:bg-ink-100'
                }`}
              >
                {lvl === 'All' ? 'All Tiers' : `${frameworkName} ${lvl}`}
              </button>
            );
          })}
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
                  <span className="grid place-items-center w-11 h-11 rounded-card bg-brand-50 border border-brand-200 shrink-0">
                    <SemanticIcon name={cat.icon} size={22} className="text-brand-700" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <h2 className="font-display font-semibold text-display-xs text-ink-900">{cat.name}</h2>
                      <Badge variant="amber" size="sm">{frameworkName} {catLevel}</Badge>
                      {allDone && <Badge variant="success" size="sm" icon={CheckCircle2}>Complete</Badge>}
                      {!unlocked && <Badge variant="default" size="sm" icon={Lock}>Locked</Badge>}
                    </div>
                    <p className="text-body-sm text-ink-500">{cat.description}</p>
                  </div>
                  <span className="text-body-sm font-semibold tabular-nums text-ink-700 flex-shrink-0">
                    {completedCount}/{catLessons.length}
                  </span>
                </div>

                {/* Progress bar */}
                <ProgressBar
                  value={prog}
                  size="sm"
                  label={cat.name}
                  valueText={`${completedCount} of ${catLessons.length} lessons complete`}
                  className="mb-4"
                />

                {/* Lesson Cards */}
                {unlocked ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {catLessons.map((lesson, idx) => {
                      const completed = progress.isLessonCompleted(lesson.id);
                      const prevLesson = idx > 0 ? catLessons[idx - 1] : null;
                      const available = !prevLesson || progress.isLessonCompleted(prevLesson.id);
                      const disabled = !available && !completed;

                      return (
                        <Card
                          key={lesson.id}
                          tone={completed ? 'brand' : undefined}
                          padding="sm"
                          className={`h-full transition-shadow ${
                            disabled ? 'opacity-60' : 'hover:shadow-card-hover hover:-translate-y-0.5'
                          }`}
                        >
                          <button
                            type="button"
                            disabled={disabled}
                            onClick={() => { if (!disabled) navigate(`/learn/${lesson.id}`); }}
                            className="block w-full text-left disabled:cursor-not-allowed"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2 min-w-0">
                                {completed ? (
                                  <CheckCircle2 className="w-5 h-5 text-success-strong flex-shrink-0" aria-hidden="true" />
                                ) : available ? (
                                  <Play className="w-5 h-5 text-brand-700 flex-shrink-0" aria-hidden="true" />
                                ) : (
                                  <Lock className="w-5 h-5 text-ink-400 flex-shrink-0" aria-hidden="true" />
                                )}
                                <h3 className="font-display font-semibold text-body-md text-ink-900 truncate">
                                  {lesson.title}
                                </h3>
                              </div>
                              {!disabled && (
                                <ChevronRight className="w-4 h-4 text-ink-400 flex-shrink-0" aria-hidden="true" />
                              )}
                            </div>
                            <p className="text-body-sm text-ink-500 mb-2 leading-relaxed">{lesson.description}</p>
                            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-caption text-ink-500">
                              <span className="font-semibold text-brand-700 bg-brand-100 px-2 py-0.5 rounded-input">
                                {frameworkName} {lesson.level || catLevel}
                              </span>
                              <span aria-hidden="true">•</span>
                              <span className="tabular-nums">{lesson.vocabulary?.length || 0} words</span>
                              <span aria-hidden="true">•</span>
                              <span className="font-semibold text-amber-700 tabular-nums">+{lesson.xpReward} XP</span>
                            </div>
                            {disabled && <span className="sr-only">Locked — finish the previous lesson first</span>}
                          </button>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <Card tone="quiet" padding="md" className="border-dashed text-center">
                    <Lock className="w-8 h-8 text-ink-400 mx-auto mb-2" aria-hidden="true" />
                    <p className="text-body-sm text-ink-700">
                      Complete{' '}
                      <strong className="font-semibold">
                        {langCategories.find((c) => c.id === cat.unlockAfter)?.name}
                      </strong>{' '}
                      ({frameworkName} {catLevel}) to unlock
                    </p>
                  </Card>
                )}
              </motion.div>
            );
          })}

          {filteredCategories.length === 0 && (
            <Card padding="lg" className="text-center">
              <BookOpen className="w-10 h-10 text-ink-400 mx-auto mb-2" aria-hidden="true" />
              <p className="font-display font-semibold text-body-lg text-ink-900">
                No lessons found matching your filters
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-3 !text-brand-700 underline underline-offset-2"
                onClick={() => {
                  setSelectedLevel('All');
                  setSearchQuery('');
                }}
              >
                Reset filters
              </Button>
            </Card>
          )}
        </div>
      </motion.div>
    </PageWrapper>
  );
}
