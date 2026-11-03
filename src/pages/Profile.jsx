/**
 * @file Profile.jsx
 * @description User profile hub, preferences, target language switcher, and achievements showcase.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Globe,
  Target,
  Trophy,
  Flame,
  Zap,
  BookOpen,
  Award,
  CheckCircle2,
  Settings,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import { useUser } from '../context/UserContext';
import languages from '../data/languages';
import { getLevel, getNextLevel, getLevelProgress } from '../utils/xp';

export default function Profile() {
  const { user, updateUser, progress, streak, xp, resetUser } = useUser();
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
      emoji: '🌱',
      unlocked: progress.completedLessons.length >= 1,
    },
    {
      id: 'streak_3',
      title: 'Habit Builder',
      description: 'Maintained a 3-day learning streak',
      emoji: '🔥',
      unlocked: streak.longestStreak >= 3 || streak.currentStreak >= 3,
    },
    {
      id: 'streak_7',
      title: 'Unstoppable',
      description: 'Maintained a 7-day streak',
      emoji: '⚡',
      unlocked: streak.longestStreak >= 7 || streak.currentStreak >= 7,
    },
    {
      id: 'vocab_10',
      title: 'Word Collector',
      description: 'Learned 10 or more vocabulary words',
      emoji: '📚',
      unlocked: progress.totalWordsLearned >= 10,
    },
    {
      id: 'xp_250',
      title: 'High Achiever',
      description: 'Earned 250+ experience points',
      emoji: '⭐',
      unlocked: xp.totalXP >= 250,
    },
    {
      id: 'level_sprout',
      title: 'Green Thumb',
      description: 'Reached Sprout level or above',
      emoji: '🌿',
      unlocked: xp.totalXP >= 100,
    },
  ];

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* ── User Profile Card ── */}
        <div className="bg-white rounded-card p-6 sm:p-8 border border-ink-200/60 shadow-soft-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-2xl font-bold shadow-soft-md">
                {user.name ? user.name.charAt(0).toUpperCase() : 'L'}
              </div>

              <div>
                {editingName ? (
                  <form onSubmit={handleSaveName} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="px-3 py-1.5 rounded-button border border-brand-500 text-sm focus:outline-none"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="bg-brand-600 text-white text-xs px-3 py-1.5 rounded-pill font-semibold"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingName(false)}
                      className="text-ink-400 text-xs px-2 py-1"
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center gap-2">
                    <h1 className="font-display font-bold text-2xl text-ink-900">
                      {user.name || 'Language Learner'}
                    </h1>
                    <button
                      onClick={() => {
                        setNameInput(user.name || '');
                        setEditingName(true);
                      }}
                      className="text-xs text-brand-600 hover:text-brand-700 font-medium ml-1"
                    >
                      Edit
                    </button>
                  </div>
                )}
                <p className="text-sm text-ink-500 flex items-center gap-2 mt-0.5">
                  Level {currentLevel.name} {currentLevel.emoji} · Active Learner
                </p>
              </div>
            </div>

            {/* Level badge */}
            <div className="bg-brand-50 border border-brand-200 rounded-2xl px-5 py-3 text-center sm:text-right w-full sm:w-auto">
              <p className="text-xs font-semibold text-brand-700 uppercase tracking-wider">
                Current Level
              </p>
              <p className="font-display font-bold text-lg text-brand-900">
                {currentLevel.name} {currentLevel.emoji}
              </p>
              <p className="text-xs text-ink-500 mt-0.5">
                {xp.totalXP} / {nextLevel?.minXP || '5000+'} XP
              </p>
            </div>
          </div>

          {/* Level Progress Bar */}
          <div className="mt-6">
            <div className="h-2.5 bg-ink-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${levelProgress * 100}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
            {nextLevel && (
              <p className="text-right text-xs text-ink-400 mt-1">
                {xp.xpToNextLevel} XP until {nextLevel.name} {nextLevel.emoji}
              </p>
            )}
          </div>
        </div>

        {/* ── Learning Stats Bento ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-card p-4 border border-ink-200/60 shadow-soft-sm">
            <Zap className="w-5 h-5 text-amber-500 mb-2" />
            <p className="font-display font-bold text-2xl text-ink-900">{xp.totalXP}</p>
            <p className="text-xs text-ink-500 font-medium">Total XP</p>
          </div>

          <div className="bg-white rounded-card p-4 border border-ink-200/60 shadow-soft-sm">
            <Flame className="w-5 h-5 text-orange-500 mb-2" />
            <p className="font-display font-bold text-2xl text-ink-900">
              {streak.currentStreak} days
            </p>
            <p className="text-xs text-ink-500 font-medium">
              Current Streak (Best: {streak.longestStreak})
            </p>
          </div>

          <div className="bg-white rounded-card p-4 border border-ink-200/60 shadow-soft-sm">
            <BookOpen className="w-5 h-5 text-brand-600 mb-2" />
            <p className="font-display font-bold text-2xl text-ink-900">
              {progress.completedLessons.length}
            </p>
            <p className="text-xs text-ink-500 font-medium">Lessons Completed</p>
          </div>

          <div className="bg-white rounded-card p-4 border border-ink-200/60 shadow-soft-sm">
            <Sparkles className="w-5 h-5 text-purple-500 mb-2" />
            <p className="font-display font-bold text-2xl text-ink-900">
              {progress.totalWordsLearned}
            </p>
            <p className="text-xs text-ink-500 font-medium">Words Learned</p>
          </div>
        </div>

        {/* ── Language Switcher & Settings ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Target Language */}
          <div className="bg-white rounded-card p-6 border border-ink-200/60 shadow-soft-sm">
            <h2 className="font-display font-semibold text-lg text-ink-900 mb-3 flex items-center gap-2">
              <Globe className="w-5 h-5 text-brand-600" /> Target Language
            </h2>
            <p className="text-xs text-ink-500 mb-4">
              Select which language curriculum you are currently focusing on:
            </p>

            <div className="space-y-2">
              {languages.map((l) => (
                <button
                  key={l.id}
                  onClick={() => handleLanguageChange(l.id)}
                  className={`w-full p-3 rounded-card border-2 flex items-center justify-between text-left transition-all ${
                    user.selectedLanguage === l.id
                      ? 'border-brand-600 bg-brand-50 text-brand-900 shadow-soft-sm'
                      : 'border-ink-200 hover:border-ink-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{l.flag}</span>
                    <div>
                      <p className="font-semibold text-sm">{l.name}</p>
                      <p className="text-xs text-ink-500">{l.nativeName}</p>
                    </div>
                  </div>
                  {user.selectedLanguage === l.id && (
                    <CheckCircle2 className="w-5 h-5 text-brand-600" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Daily Goal */}
          <div className="bg-white rounded-card p-6 border border-ink-200/60 shadow-soft-sm">
            <h2 className="font-display font-semibold text-lg text-ink-900 mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-amber-500" /> Daily Target
            </h2>
            <p className="text-xs text-ink-500 mb-4">
              Adjust your daily practice pace to stay consistent:
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { min: 5, label: '5 min/day', desc: 'Casual' },
                { min: 10, label: '10 min/day', desc: 'Regular' },
                { min: 15, label: '15 min/day', desc: 'Serious' },
                { min: 20, label: '20 min/day', desc: 'Intense' },
              ].map((g) => (
                <button
                  key={g.min}
                  onClick={() => handleGoalChange(g.min)}
                  className={`p-3 rounded-card border-2 text-center transition-all ${
                    user.dailyGoal === g.min
                      ? 'border-brand-600 bg-brand-50 text-brand-900 shadow-soft-sm'
                      : 'border-ink-200 hover:border-ink-300'
                  }`}
                >
                  <p className="font-bold text-sm">{g.label}</p>
                  <p className="text-xs text-ink-500">{g.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Badges & Achievements ── */}
        <div className="bg-white rounded-card p-6 border border-ink-200/60 shadow-soft-sm">
          <h2 className="font-display font-semibold text-lg text-ink-900 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" /> Achievements & Badges
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className={`p-4 rounded-card border transition-all flex items-start gap-3 ${
                  ach.unlocked
                    ? 'bg-amber-50/50 border-amber-200 text-ink-900'
                    : 'bg-ink-50/50 border-ink-200/50 text-ink-400 opacity-60'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
                    ach.unlocked ? 'bg-amber-100' : 'bg-ink-100 grayscale'
                  }`}
                >
                  {ach.emoji}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold text-sm truncate">
                    {ach.title}
                  </p>
                  <p className="text-xs leading-relaxed mt-0.5">{ach.description}</p>
                  <span className="text-[10px] uppercase font-bold tracking-wider mt-1.5 inline-block text-amber-700">
                    {ach.unlocked ? '✓ Unlocked' : 'Locked'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

