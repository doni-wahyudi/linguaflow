/**
 * @file Profile.jsx
 * @description User profile hub, preferences, target language switcher, and achievements showcase.
 */

import React, { useState } from 'react';
import {
  Globe,
  Target,
  Trophy,
  Flame,
  Zap,
  BookOpen,
  Award,
  CheckCircle2,
  Pencil,
} from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import { Flag, SemanticIcon } from '../components/brand';
import { Card, Badge, ProgressBar, Button, Input } from '../components/ui';
import { useUser } from '../context/UserContext';
import languages from '../data/languages';
import { getLevel, getNextLevel, getLevelProgress } from '../utils/xp';

/**
 * Profile — user identity, level progress, preferences and achievements.
 *
 * Built on the ui/ kit: every panel is a <Card> (so borders, radius and shadow
 * come from §5.2 tokens rather than `bg-white border-ink-200/60` strings that
 * composited to an almost invisible edge), the level meter is a <ProgressBar>,
 * and the two toggle grids are real buttons with `aria-pressed`.
 */

export default function Profile() {
  const { user, updateUser, progress, streak, xp } = useUser();
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user.name || '');

  const currentLevel = getLevel(xp.totalXP);
  const nextLevel = getNextLevel(xp.totalXP);
  const levelProgress = getLevelProgress(xp.totalXP);

  const handleSaveName = (e) => {
    e.preventDefault();
    if (nameInput.trim()) {
      updateUser({ name: nameInput.trim() });
      setEditingName(false);
    }
  };

  const handleLanguageChange = (langId) => {
    updateUser({ selectedLanguage: langId });
  };

  const handleGoalChange = (minutes) => {
    updateUser({ dailyGoal: minutes });
  };

  const achievements = [
    {
      id: 'first_lesson',
      title: 'First Step',
      description: 'Completed your very first lesson',
      icon: 'seedling',
      unlocked: progress.completedLessons.length >= 1,
    },
    {
      id: 'streak_3',
      title: 'Habit Builder',
      description: 'Maintained a 3-day learning streak',
      icon: 'streak',
      unlocked: streak.longestStreak >= 3 || streak.currentStreak >= 3,
    },
    {
      id: 'streak_7',
      title: 'Unstoppable',
      description: 'Maintained a 7-day streak',
      icon: 'energy',
      unlocked: streak.longestStreak >= 7 || streak.currentStreak >= 7,
    },
    {
      id: 'vocab_10',
      title: 'Word Collector',
      description: 'Learned 10 or more vocabulary words',
      icon: 'reading',
      unlocked: progress.totalWordsLearned >= 10,
    },
    {
      id: 'xp_250',
      title: 'High Achiever',
      description: 'Earned 250+ experience points',
      icon: 'star',
      unlocked: xp.totalXP >= 250,
    },
    {
      id: 'level_sprout',
      title: 'Green Thumb',
      description: 'Reached Sprout level or above',
      icon: 'sprout',
      unlocked: xp.totalXP >= 100,
    },
  ];

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* ── User Profile Card ── */}
        <Card padding="lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-card bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center text-white font-display text-display-sm font-bold shadow-soft-md">
                {user.name ? user.name.charAt(0).toUpperCase() : 'L'}
              </div>

              <div>
                {editingName ? (
                  <form onSubmit={handleSaveName} className="flex flex-wrap gap-2 items-center">
                    <Input
                      aria-label="Display name"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      size="sm"
                      autoFocus
                    />
                    <Button type="submit" size="sm">Save</Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => setEditingName(false)}>
                      Cancel
                    </Button>
                  </form>
                ) : (
                  <div className="flex items-center gap-2">
                    <h1 className="font-display font-bold text-display-xs text-ink-900">
                      {user.name || 'Language Learner'}
                    </h1>
                    <button
                      type="button"
                      onClick={() => {
                        setNameInput(user.name || '');
                        setEditingName(true);
                      }}
                      className="inline-flex items-center gap-1 text-caption font-semibold text-brand-700 hover:text-brand-800"
                    >
                      <Pencil size={13} aria-hidden="true" />
                      Edit
                      <span className="sr-only">display name</span>
                    </button>
                  </div>
                )}
                <p className="text-body-sm text-ink-500 flex items-center gap-2 mt-0.5">
                  <SemanticIcon name={currentLevel.icon} size={16} className="text-brand-700" />
                  Level {currentLevel.name} · Active Learner
                </p>
              </div>
            </div>

            {/* Level badge */}
            <Card tone="brand" padding="sm" className="w-full sm:w-auto text-center sm:text-right">
              <p className="text-caption uppercase font-semibold text-brand-700">Current Level</p>
              <p className="font-display font-bold text-display-xs text-brand-900 flex items-center justify-center sm:justify-end gap-2">
                <SemanticIcon name={currentLevel.icon} size={20} className="text-brand-700" />
                {currentLevel.name}
              </p>
              <p className="text-caption text-ink-500 mt-0.5 tabular-nums">
                {xp.totalXP} / {nextLevel?.minXP || '5000+'} XP
              </p>
            </Card>
          </div>

          {/* Level Progress Bar */}
          <ProgressBar
            className="mt-6"
            value={levelProgress * 100}
            size="md"
            label={`Progress to ${nextLevel?.name || 'next level'}`}
            valueText={`${xp.xpToNextLevel ?? 0} XP remaining`}
          />
          {nextLevel && (
            <p className="text-right text-caption text-ink-500 mt-1.5 tabular-nums">
              {xp.xpToNextLevel} XP until {nextLevel.name}
            </p>
          )}
        </Card>

        {/* ── Learning Stats Bento ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: Zap, tint: 'text-amber-600', value: xp.totalXP, label: 'Total XP' },
            {
              icon: Flame,
              tint: 'text-coral-600',
              value: `${streak.currentStreak} days`,
              label: `Current Streak (Best: ${streak.longestStreak})`,
            },
            {
              icon: BookOpen,
              tint: 'text-brand-600',
              value: progress.completedLessons.length,
              label: 'Lessons Completed',
            },
            {
              icon: Trophy,
              tint: 'text-brand-600',
              value: progress.totalWordsLearned,
              label: 'Words Learned',
            },
          ].map((stat) => (
            <Card key={stat.label} padding="sm" className="h-full">
              <stat.icon className={`w-5 h-5 ${stat.tint} mb-2`} aria-hidden="true" />
              <p className="font-display font-bold text-display-xs text-ink-900 tabular-nums">{stat.value}</p>
              <p className="text-caption text-ink-500 font-medium">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* ── Language Switcher & Settings ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Target Language */}
          <Card padding="md">
            <h2 className="font-display font-semibold text-display-sm text-ink-900 mb-3 flex items-center gap-2">
              <Globe className="w-5 h-5 text-brand-700" aria-hidden="true" /> Target Language
            </h2>
            <p className="text-caption text-ink-500 mb-4">
              Select which language curriculum you are currently focusing on:
            </p>

            <div className="space-y-2">
              {languages.map((l) => {
                const selected = user.selectedLanguage === l.id;
                return (
                  <button
                    key={l.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => handleLanguageChange(l.id)}
                    className={`w-full p-3 rounded-card border-2 flex items-center justify-between text-left transition-colors ${
                      selected
                        ? 'border-brand-700 bg-brand-50 text-ink-900'
                        : 'border-ink-200 bg-surface-card hover:border-ink-300 text-ink-700'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Flag code={l.flagCode} size={26} decorative />
                      <span>
                        <span className="block font-semibold text-body-sm">{l.name}</span>
                        <span className="block text-caption text-ink-500">{l.nativeName}</span>
                      </span>
                    </span>
                    {selected && <CheckCircle2 className="w-5 h-5 text-brand-700" aria-hidden="true" />}
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Daily Goal */}
          <Card padding="md">
            <h2 className="font-display font-semibold text-display-sm text-ink-900 mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-amber-700" aria-hidden="true" /> Daily Target
            </h2>
            <p className="text-caption text-ink-500 mb-4">
              Adjust your daily practice pace to stay consistent:
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { min: 5, label: '5 min/day', desc: 'Casual' },
                { min: 10, label: '10 min/day', desc: 'Regular' },
                { min: 15, label: '15 min/day', desc: 'Serious' },
                { min: 20, label: '20 min/day', desc: 'Intense' },
              ].map((g) => {
                const selected = user.dailyGoal === g.min;
                return (
                  <button
                    key={g.min}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => handleGoalChange(g.min)}
                    className={`p-3 rounded-card border-2 text-center transition-colors ${
                      selected
                        ? 'border-brand-700 bg-brand-50 text-ink-900'
                        : 'border-ink-200 bg-surface-card hover:border-ink-300 text-ink-700'
                    }`}
                  >
                    <p className="font-bold text-body-sm tabular-nums">{g.label}</p>
                    <p className="text-caption text-ink-500">{g.desc}</p>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* ── Badges & Achievements ── */}
        <Card padding="md">
          <h2 className="font-display font-semibold text-display-sm text-ink-900 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-700" aria-hidden="true" /> Achievements & Badges
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {achievements.map((ach) => (
              <Card
                key={ach.id}
                tone={ach.unlocked ? 'amber' : 'quiet'}
                padding="sm"
                className={`h-full ${ach.unlocked ? '' : 'opacity-60'}`}
              >
                <div className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className={`w-11 h-11 rounded-card grid place-items-center shrink-0 ${
                      ach.unlocked ? 'bg-amber-100 text-amber-700' : 'bg-ink-100 text-ink-500'
                    }`}
                  >
                    <SemanticIcon name={ach.icon} size={22} />
                  </span>

                  <div className="flex-1 min-w-0">
                    <p className="font-display font-bold text-body-sm text-ink-900 truncate">{ach.title}</p>
                    <p className="text-caption leading-relaxed mt-0.5 text-ink-500">{ach.description}</p>
                    <Badge
                      variant={ach.unlocked ? 'success' : 'subtle'}
                      size="sm"
                      className="mt-1.5"
                      icon={ach.unlocked ? CheckCircle2 : undefined}
                    >
                      {ach.unlocked ? 'Unlocked' : 'Locked'}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
}

