import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { transitionEase } from '../utils/motion';
import {
  Sparkles,
  Flame,
  Trophy,
  ArrowRight,
  Star,
  Zap,
  Brain,
  Target,
  PenTool,
  Heart,
  Mic,
  Award,
} from 'lucide-react';
import { Logo, Flag } from '../components/brand';
import { ButtonLink, Button } from '../components/ui';

/**
 * Landing — Public homepage / marketing page
 *
 * Sections:
 * 1. Hero with headline, subtitle, and CTA
 * 2. Features grid (bento layout)
 * 3. How it works (3-step flow)
 * 4. Languages showcase
 * 5. Social proof / stats
 * 6. Final CTA
 *
 * Contrast note: everything here sits on the cream page or a card, so the
 * `-600` tier is the floor for icons/large text and `-700` is required for
 * small labels. Solid brand fills use `brand-700` (white on brand-600 is
 * 3.77:1 — AA-large only).
 */

/* Animation variants */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: transitionEase } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: transitionEase } },
};

/* Feature data */
const features = [
  {
    icon: Mic,
    title: 'Pronunciation & Speaking Studio',
    description: 'Browser-native speech recognition with live audio visualizers, token-level Levenshtein scoring, and instant enunciation feedback.',
    color: 'brand',
  },
  {
    icon: Award,
    title: 'Official CEFR & JLPT Mock Exams',
    description: 'Timed full-length assessments with section breakdowns, CEFR (A1-B1) and JLPT (N5-N3) pass thresholds, and certifications.',
    color: 'amber',
  },
  {
    icon: PenTool,
    title: 'Characters & Handwriting Lab',
    description: 'Designed for tablets, Apple Pencil, and touch styluses. Practice Japanese stroke order, 50-sound Gojūon charts, and Kana gym.',
    color: 'coral',
  },
  {
    icon: Brain,
    title: 'Spaced Repetition (SRS)',
    description: 'Science-backed SM-2 algorithm that surfaces words right before memory decay. Learn more in less time.',
    color: 'amber',
  },
  {
    icon: Zap,
    title: 'Interactive Exercises',
    description: 'Sentence builders, dialogue roleplays, ear training listening, and rapid speed drills keep your recall razor sharp.',
    color: 'coral',
  },
  {
    icon: Trophy,
    title: 'Gamified Growth & Streaks',
    description: 'Unlock badges, track daily streaks, and level up from Seedling to Forest as you master hundreds of vocabulary words.',
    color: 'brand',
  },
];

/* Language cards — `code` feeds the SVG <Flag/>; the old emoji + gradient-chrome
   fields are gone (flag emoji have no glyph on Windows, and per-language rainbow
   tiles fought the 60-30-10 palette). */
const languageShowcase = [
  { code: 'es', name: 'Spanish', nativeName: 'Español', learners: '500M+ speakers' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', learners: '125M+ speakers' },
  { code: 'fr', name: 'French', nativeName: 'Français', learners: '280M+ speakers' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', learners: '130M+ speakers' },
];

/* Steps */
const steps = [
  { number: '01', title: 'Choose Your Language', description: 'Pick from Spanish, Japanese, French, or German. Set your daily goal and motivation.' },
  { number: '02', title: 'Learn Through Play', description: 'Interactive lessons with flashcards, quizzes, and typing exercises build real skills.' },
  { number: '03', title: 'Build Your Streak', description: 'Practice daily, earn XP, level up, and watch your vocabulary grow day by day.' },
];

export default function Landing() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-surface-bg">
      {/* ── Navigation ── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-surface-card/80 backdrop-blur-md border-b border-ink-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo — same component the app navbar renders */}
          <Link to="/" aria-label="LinguaFlow home">
            <Logo variant="full" size="md" />
          </Link>

          {/* CTA */}
          <ButtonLink
            to="/onboarding"
            variant="primary"
            shape="pill"
            icon={ArrowRight}
            iconPosition="right"
          >
            Start Learning
          </ButtonLink>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="pt-32 pb-20 sm:pt-40 sm:pb-28 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Eyebrow */}
            <motion.div variants={fadeUp} className="mb-6">
              <span className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 px-4 py-1.5 rounded-pill text-body-sm font-semibold border border-brand-200">
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                Free &amp; Open Source Language Learning
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className="font-display text-display-xl text-ink-900 mb-6"
            >
              Learn a New Language,{' '}
              <span className="text-gradient-brand">Beautifully</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeUp}
              className="text-body-lg text-ink-500 max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Master Spanish, Japanese, French, or German through interactive lessons,
              spaced repetition science, and a gamified experience that makes
              learning feel like play — not homework.
            </motion.p>

            {/* CTA Group — primary button + a ghost that reads as a button,
                so the secondary action is not mistaken for plain text */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <ButtonLink
                to="/onboarding"
                variant="primary"
                shape="pill"
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
              >
                Start Learning for Free
              </ButtonLink>
              {/* Under HashRouter an `href="#features"` anchor would be parsed as a
                  route and 404, so the in-page jump is a scripted scroll. */}
              <Button
                variant="secondary"
                shape="pill"
                size="lg"
                onClick={() =>
                  document
                    .getElementById('features')
                    ?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
                }
              >
                See How It Works
              </Button>
            </motion.div>

            {/* Language flags — SVG, so they render on every OS */}
            <motion.div
              variants={fadeUp}
              className="flex items-center justify-center gap-6 mt-12"
            >
              {languageShowcase.map((lang, i) => (
                <motion.span
                  key={lang.code}
                  className="inline-flex"
                  animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
                  transition={{
                    duration: 2.5,
                    repeat: reduceMotion ? 0 : Infinity,
                    delay: i * 0.3,
                    ease: 'easeInOut',
                  }}
                >
                  <Flag code={lang.code} size={32} />
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section id="features" data-reveal className="py-20 sm:py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} className="text-overline uppercase text-brand-700 mb-3">
              Why LinguaFlow
            </motion.p>
            <motion.h2 variants={fadeUp} className="font-display text-display-lg text-ink-900 mb-4">
              Everything You Need to Learn
            </motion.h2>
            <motion.p variants={fadeUp} className="text-body-lg text-ink-500 max-w-xl mx-auto">
              Built on proven learning science with a beautiful interface that keeps you coming back.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {features.map((feature) => {
              /* Icons are non-text UI, so -600 is the floor: on a -50 tile,
                 brand-500 measures 2.41:1 and amber-500 2.07:1 — both fail. */
              const colorMap = {
                brand: { bg: 'bg-brand-50', icon: 'text-brand-600', border: 'border-brand-200' },
                amber: { bg: 'bg-amber-50', icon: 'text-amber-600', border: 'border-amber-200' },
                coral: { bg: 'bg-coral-50', icon: 'text-coral-600', border: 'border-coral-200' },
              };
              const colors = colorMap[feature.color];

              return (
                <motion.div
                  key={feature.title}
                  variants={scaleIn}
                  className="bg-surface-card rounded-card p-6 border border-ink-200 shadow-card hover:shadow-card-hover transition-all duration-300 group"
                >
                  <div className={`w-12 h-12 rounded-button ${colors.bg} ${colors.border} border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`w-6 h-6 ${colors.icon}`} aria-hidden="true" />
                  </div>
                  <h3 className="font-display font-semibold text-display-sm text-ink-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-body-sm text-ink-500 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20 sm:py-28 px-4 bg-brand-50/30" data-reveal>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} className="text-overline uppercase text-brand-700 mb-3">
              Simple & Effective
            </motion.p>
            <motion.h2 variants={fadeUp} className="font-display text-display-lg text-ink-900">
              Start Learning in 3 Steps
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {steps.map((step, i) => (
              <motion.div key={step.number} variants={fadeUp} className="text-center md:text-left">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-card bg-brand-700 text-white font-display font-bold text-display-sm mb-5 shadow-soft-sm">
                  {step.number}
                </div>
                <h3 className="font-display font-semibold text-display-xs text-ink-900 mb-3">{step.title}</h3>
                <p className="text-body-md text-ink-500 leading-relaxed">{step.description}</p>
                {i < steps.length - 1 && (
                  <div className="hidden md:block mt-6">
                    <ArrowRight className="w-5 h-5 text-ink-300 mx-auto md:mx-0" aria-hidden="true" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Language Showcase ── */}
      <section className="py-20 sm:py-28 px-4" data-reveal>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} className="text-overline uppercase text-brand-700 mb-3">
              Choose Your Path
            </motion.p>
            <motion.h2 variants={fadeUp} className="font-display text-display-lg text-ink-900 mb-4">
              Languages Available
            </motion.h2>
            <motion.p variants={fadeUp} className="text-body-lg text-ink-500">
              Start with one — you can always add more later.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {languageShowcase.map((lang) => (
              <motion.div
                key={lang.code}
                variants={scaleIn}
                whileHover={{ y: -4 }}
                className="bg-surface-card rounded-card p-8 border border-ink-200 shadow-card hover:shadow-card-hover transition-all duration-300 text-center cursor-pointer group"
              >
                <Flag
                  code={lang.code}
                  size={44}
                  decorative
                  className="mb-4 inline-block group-hover:scale-110 transition-transform duration-300"
                />
                <h3 className="font-display font-bold text-display-xs text-ink-900 mb-1">
                  {lang.name}
                </h3>
                <p className="text-body-sm text-ink-500 mb-3">{lang.nativeName}</p>
                <span className="inline-flex items-center gap-1.5 text-caption text-ink-500 font-medium">
                  <Star className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
                  {lang.learners}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Stats ── */}
      {/* brand-700, not brand-600: white on brand-600 is 3.77:1, which fails AA
          for the 14px labels here; brand-100 labels clear 4.84:1 on brand-700. */}
      <section className="py-16 px-4 bg-brand-700" data-reveal>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {[
              { value: '4', label: 'Languages' },
              { value: '40', label: 'Graded Lessons' },
              { value: '800+', label: 'Vocabulary Words' },
              { value: '100%', label: 'Free Forever' },
            ].map((stat) => (
              <motion.div key={stat.label} variants={fadeUp}>
                <p className="font-display font-extrabold text-display-lg text-white mb-1 tabular-nums">{stat.value}</p>
                <p className="text-body-sm text-brand-100 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-20 sm:py-28 px-4" data-reveal>
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeUp} className="font-display text-display-lg text-ink-900 mb-6">
              Ready to Start Your Language Journey?
            </motion.h2>
            <motion.p variants={fadeUp} className="text-body-lg text-ink-500 mb-10">
              Join thousands of learners who are mastering new languages with LinguaFlow.
              No account needed — just pick a language and begin.
            </motion.p>
            <motion.div variants={fadeUp}>
              <ButtonLink
                to="/onboarding"
                variant="primary"
                shape="pill"
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
              >
                Begin Learning Now
              </ButtonLink>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-ink-200 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo variant="full" size="sm" />
          <p className="text-body-sm text-ink-500 inline-flex items-center gap-1.5">
            Built with <Heart size={14} className="text-coral-600" aria-hidden="true" /> for language learners everywhere
          </p>
        </div>
      </footer>
    </div>
  );
}

