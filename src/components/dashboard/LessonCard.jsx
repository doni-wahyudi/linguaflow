/**
 * @file LessonCard.jsx
 * @description Card for displaying a lesson in browse/dashboard views.
 * Shows title, description, category badge, progress, XP reward, and lesson state
 * (locked, available, completed) with interactive hover/tap animations.
 *
 * @example
 * <LessonCard
 *   lesson={{ title: 'Greetings', description: 'Learn basic greetings', category: 'Basics', xpReward: 50 }}
 *   progress="available"
 *   completedExercises={3}
 *   totalExercises={10}
 *   onClick={() => navigate('/lesson/1')}
 * />
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Card, Badge, ProgressBar } from '../ui';

const statusConfig = {
  locked: {
    badge: { variant: 'default', label: 'Locked' },
    overlay: true,
    icon: Lock,
    cta: null,
  },
  available: {
    badge: { variant: 'brand', label: 'Available' },
    overlay: false,
    icon: null,
    cta: { label: 'Start', icon: ArrowRight },
  },
  completed: {
    badge: { variant: 'success', label: 'Completed' },
    overlay: false,
    icon: CheckCircle2,
    cta: { label: 'Review', icon: ArrowRight },
  },
};

/**
 * Lesson display card with state-based styling.
 *
 * @param {object} props
 * @param {{ title: string, description?: string, category?: string, xpReward?: number }} props.lesson
 * @param {'locked'|'available'|'completed'} [props.progress='available'] - Lesson state.
 * @param {number} [props.completedExercises=0] - Exercises completed.
 * @param {number} [props.totalExercises=0] - Total exercises in the lesson.
 * @param {Function} [props.onClick] - Click handler.
 * @param {string} [props.className] - Additional CSS classes.
 * @returns {JSX.Element}
 */
const LessonCard = ({
  lesson = {},
  progress = 'available',
  completedExercises = 0,
  totalExercises = 0,
  onClick,
  className = '',
}) => {
  const config = statusConfig[progress] || statusConfig.available;
  const isLocked = progress === 'locked';
  const isCompleted = progress === 'completed';
  const StatusIcon = config.icon;

  return (
    <motion.div
      whileHover={isLocked ? {} : { y: -3 }}
      whileTap={isLocked ? {} : { scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card
        variant={isLocked ? 'outlined' : 'interactive'}
        padding="none"
        onClick={isLocked ? undefined : onClick}
        className={[
          'relative overflow-hidden',
          isLocked ? 'opacity-60 cursor-not-allowed' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        aria-label={`${lesson.title || 'Lesson'}${isLocked ? ' (locked)' : ''}`}
        aria-disabled={isLocked || undefined}
      >
        <div className="p-5 sm:p-6 flex flex-col gap-3">
          {/* Top row — Category badge + Status icon */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {lesson.category && (
                <Badge variant={config.badge.variant} size="sm">
                  {lesson.category}
                </Badge>
              )}
            </div>

            {StatusIcon && (
              <StatusIcon
                size={20}
                className={isCompleted ? 'text-success-strong' : 'text-ink-500'}
                aria-hidden="true"
              />
            )}
          </div>

          {/* Title & Description */}
          <div>
            <h3 className="font-display text-display-sm text-ink-900 leading-tight">
              {lesson.title || 'Untitled Lesson'}
            </h3>
            {lesson.description && (
              <p className="text-body-sm text-ink-500 mt-1 line-clamp-2">
                {lesson.description}
              </p>
            )}
          </div>

          {/* Progress bar (when exercises exist) */}
          {totalExercises > 0 && (
            <div className="flex flex-col gap-1.5">
              <ProgressBar
                value={completedExercises}
                max={totalExercises}
                size="sm"
                color="success"
                label={`${lesson.title || 'This lesson'} progress`}
                valueText={`${completedExercises} of ${totalExercises} exercises done`}
              />
              <span className="text-caption text-ink-500 tabular-nums">
                {completedExercises}/{totalExercises} exercises
              </span>
            </div>
          )}

          {/* Bottom row — XP reward + CTA */}
          <div className="flex items-center justify-between pt-1">
            {lesson.xpReward != null && (
              <span className="text-body-sm font-semibold text-amber-700">
                +{lesson.xpReward} XP
              </span>
            )}

            {config.cta && (
              <span className="inline-flex items-center gap-1 text-body-sm font-semibold text-brand-700">
                {config.cta.label}
                <config.cta.icon size={16} aria-hidden="true" />
              </span>
            )}
          </div>
        </div>

        {/* Locked overlay */}
        {isLocked && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-surface-card/70"
            aria-hidden="true"
          >
            <Lock size={28} className="text-ink-300" />
          </div>
        )}
      </Card>
    </motion.div>
  );
};

LessonCard.displayName = 'LessonCard';

export default LessonCard;
