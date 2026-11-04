/**
 * @file icons.jsx
 * @description Semantic icon registry.
 *
 * Replaces the emoji that were previously used as UI icons in `data/categories.js`,
 * `utils/xp.js`, `pages/Onboarding.jsx` and `pages/Profile.jsx`. Emoji are the
 * wrong tool for interface iconography: they render differently on every OS,
 * cannot be recoloured to the palette, cannot take a consistent stroke weight,
 * and spec §1.2 explicitly rejects them as "childish".
 *
 * Data files stay JSX-free by storing an icon *name* string; components resolve
 * it here. An unknown name renders nothing visible rather than crashing.
 *
 * @example
 * <SemanticIcon name="sprout" size={20} />
 * <CategoryIcon category={cat} size={24} />
 */

import React from 'react';
import {
  Sprout,
  Leaf,
  TreeDeciduous,
  TreePine,
  Trees,
  Hand,
  ListOrdered,
  Utensils,
  Plane,
  Users,
  Briefcase,
  Lightbulb,
  Flame,
  Zap,
  Star,
  Sparkles,
  Trophy,
  Award,
  Medal,
  BookOpen,
  GraduationCap,
  Target,
  Gauge,
  Rocket,
  Turtle,
  Rabbit,
  Mountain,
  Crown,
  Globe,
  PenTool,
  Keyboard,
  Headphones,
  Brain,
  Clock,
  CheckCircle2,
} from 'lucide-react';

/** name -> Lucide component. Add new semantic keys here, never inline-import in data. */
export const ICONS = {
  /* Growth ladder (XP levels) — seedling to forest, the brand's core metaphor */
  seedling: Sprout,
  sprout: Leaf,
  sapling: TreeDeciduous,
  tree: TreePine,
  forest: Trees,
  crown: Crown,

  /* Self-assessed proficiency — the ascent metaphor */
  beginner: Sprout,
  elementary: Leaf,
  intermediate: TreeDeciduous,
  advanced: Mountain,

  /* Lesson categories */
  basics: Sprout,
  greetings: Hand,
  numbers: ListOrdered,
  dining: Utensils,
  travel: Plane,
  family: Users,
  work: Briefcase,
  ideas: Lightbulb,

  /* Motivation / goals */
  casual: Turtle,
  regular: Rabbit,
  serious: Gauge,
  intense: Rocket,

  /* Achievement + status */
  streak: Flame,
  energy: Zap,
  star: Star,
  sparkle: Sparkles,
  trophy: Trophy,
  award: Award,
  medal: Medal,
  complete: CheckCircle2,

  /* Study modes */
  reading: BookOpen,
  study: GraduationCap,
  target: Target,
  writing: PenTool,
  typing: Keyboard,
  listening: Headphones,
  memory: Brain,
  time: Clock,
  language: Globe,
};

/** Resolve a registry name to a Lucide component (or null). */
export function resolveIcon(name) {
  if (!name) return null;
  return ICONS[String(name).toLowerCase()] || null;
}

/**
 * Renders a registry icon by semantic name.
 *
 * @param {object} props
 * @param {string} props.name - Key in `ICONS`.
 * @param {number} [props.size=20]
 * @param {string} [props.className='']
 * @param {number} [props.strokeWidth=2]
 * @param {string} [props.label] - Accessible name; omit for purely decorative icons.
 * @param {JSX.Element} [props.fallback] - Rendered when `name` is unknown.
 */
export default function SemanticIcon({
  name,
  size = 20,
  className = '',
  strokeWidth = 2,
  label,
  fallback = null,
}) {
  const Icon = resolveIcon(name);
  if (!Icon) return fallback;

  return (
    <Icon
      size={size}
      strokeWidth={strokeWidth}
      className={className}
      aria-label={label}
      role={label ? 'img' : undefined}
      aria-hidden={label ? undefined : true}
    />
  );
}

SemanticIcon.displayName = 'SemanticIcon';
