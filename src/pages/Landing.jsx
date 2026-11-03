import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Globe,
  Sparkles,
  BookOpen,
  Flame,
  Trophy,
  ArrowRight,
  Check,
  Star,
  Zap,
  Brain,
  Target,
  BarChart3,
  PenTool,
} from 'lucide-react';

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
 */

/* Animation variants */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
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
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

/* Feature data */
const features = [
  {
    icon: PenTool,
    title: 'Tablet Handwriting Lab',
    description: 'Designed for tablets, Apple Pencil, and touch styluses. Practice Japanese stroke order, German umlauts, and cursive words.',
    color: 'brand',
  },
  {
    icon: Brain,
    title: 'Spaced Repetition',
    description: 'Science-backed algorithm that shows you words right before you forget them. Learn more in less time.',
    color: 'amber',
  },
  {
    icon: Zap,
    title: 'Interactive Exercises',
    description: 'Flashcards, quizzes, matching games, fill-in-the-blank — variety keeps your brain engaged.',
    color: 'coral',
  },
  {
    icon: Target,
    title: 'Daily Goals',
    description: 'Set your pace. Whether 5 minutes or 30, build a consistent habit that sticks.',
    color: 'coral',
  },
  {
    icon: Flame,
    title: 'Streak System',
    description: "Don't break the chain! Daily streaks keep you motivated and coming back for more.",
    color: 'amber',
  },
  {
    icon: Trophy,
    title: 'Earn Achievements',
    description: 'Unlock badges and level up from Seedling to Forest as you master new vocabulary.',
    color: 'brand',
  },
];

/* Language cards */
const languageShowcase = [
  { flag: '🇪🇸', name: 'Spanish', nativeName: 'Español', learners: '500M+ speakers', color: 'from-red-400 to-orange-400' },
  { flag: '🇯🇵', name: 'Japanese', nativeName: '日本語', learners: '125M+ speakers', color: 'from-pink-400 to-red-400' },
  { flag: '🇫🇷', name: 'French', nativeName: 'Français', learners: '280M+ speakers', color: 'from-blue-400 to-indigo-400' },
  { flag: '🇩🇪', name: 'German', nativeName: 'Deutsch', learners: '130M+ speakers', color: 'from-amber-400 to-yellow-400' },
];

/* Steps */
const steps = [
  { number: '01', title: 'Choose Your Language', description: 'Pick from Spanish, Japanese, French, or German. Set your daily goal and motivation.' },
  { number: '02', title: 'Learn Through Play', description: 'Interactive lessons with flashcards, quizzes, and typing exercises build real skills.' },
  { number: '03', title: 'Build Your Streak', description: 'Practice daily, earn XP, level up, and watch your vocabulary grow day by day.' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-surface-bg">
      {/* ── Navigation ── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-ink-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-soft-sm group-hover:shadow-glow-brand transition-shadow duration-300">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-ink-900 tracking-tight">
              Lingua<span className="text-brand-600">Flow</span>
            </span>
          </Link>

          {/* CTA */}
          <Link
            to="/onboarding"
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-5 py-2.5 rounded-pill shadow-soft-sm hover:shadow-glow-brand transition-all duration-200 active:scale-[0.98]"
          >
            Start Learning
            <ArrowRight className="w-4 h-4" />
          </Link>
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
              <span className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 px-4 py-1.5 rounded-pill text-sm font-semibold border border-brand-100">
                <Sparkles className="w-4 h-4" />
                Free & Open Source Language Learning
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

            {/* CTA Group */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/onboarding"
                className="inline-flex items-center gap-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-8 py-4 rounded-pill text-lg shadow-soft-md hover:shadow-glow-brand transition-all duration-200 active:scale-[0.98]"
              >
                Start Learning for Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 text-ink-500 hover:text-ink-700 font-medium px-6 py-4 rounded-pill hover:bg-ink-100 transition-all duration-200"
              >
                See How It Works
              </a>
            </motion.div>

            {/* Language flags floating */}
            <motion.div
              variants={fadeUp}
              className="flex items-center justify-center gap-6 mt-12"
            >
              {['🇪🇸', '🇯🇵', '🇫🇷', '🇩🇪'].map((flag, i) => (
                <motion.span
                  key={flag}
                  className="text-4xl"
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: 'easeInOut',
                  }}
                >
                  {flag}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section id="features" className="py-20 sm:py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} className="text-label uppercase text-brand-600 mb-3 tracking-widest">
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
              const colorMap = {
                brand: { bg: 'bg-brand-50', icon: 'text-brand-600', border: 'border-brand-100' },
                amber: { bg: 'bg-amber-50', icon: 'text-amber-600', border: 'border-amber-100' },
                coral: { bg: 'bg-coral-50', icon: 'text-coral-600', border: 'border-coral-100' },
              };
              const colors = colorMap[feature.color];

              return (
                <motion.div
                  key={feature.title}
                  variants={scaleIn}
                  className="bg-surface-card rounded-card p-6 border border-ink-200/50 shadow-soft-sm hover:shadow-soft-md transition-all duration-300 group"
                >
                  <div className={`w-12 h-12 rounded-xl ${colors.bg} ${colors.border} border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`w-6 h-6 ${colors.icon}`} />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-ink-900 mb-2">
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
      <section className="py-20 sm:py-28 px-4 bg-brand-50/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} className="text-label uppercase text-brand-600 mb-3 tracking-widest">
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
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-600 text-white font-display font-bold text-xl mb-5 shadow-soft-sm">
                  {step.number}
                </div>
                <h3 className="font-display font-semibold text-xl text-ink-900 mb-3">{step.title}</h3>
                <p className="text-body-md text-ink-500 leading-relaxed">{step.description}</p>
                {i < steps.length - 1 && (
                  <div className="hidden md:block mt-6">
                    <ArrowRight className="w-5 h-5 text-ink-300 mx-auto md:mx-0" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Language Showcase ── */}
      <section className="py-20 sm:py-28 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} className="text-label uppercase text-brand-600 mb-3 tracking-widest">
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
                key={lang.name}
                variants={scaleIn}
                whileHover={{ y: -4 }}
                className="bg-surface-card rounded-card p-8 border border-ink-200/50 shadow-soft-sm hover:shadow-soft-lg transition-all duration-300 text-center cursor-pointer group"
              >
                <span className="text-6xl block mb-4 group-hover:scale-110 transition-transform duration-300">
                  {lang.flag}
                </span>
                <h3 className="font-display font-bold text-xl text-ink-900 mb-1">{lang.name}</h3>
                <p className="text-ink-500 text-sm mb-3">{lang.nativeName}</p>
                <span className="inline-flex items-center gap-1.5 text-xs text-ink-400 font-medium">
                  <Star className="w-3.5 h-3.5" />
                  {lang.learners}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 px-4 bg-brand-600">
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
                <p className="font-display font-extrabold text-4xl text-white mb-1">{stat.value}</p>
                <p className="text-brand-200 text-sm font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-20 sm:py-28 px-4">
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
              <Link
                to="/onboarding"
                className="inline-flex items-center gap-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-10 py-4 rounded-pill text-lg shadow-soft-md hover:shadow-glow-brand transition-all duration-200 active:scale-[0.98]"
              >
                Begin Learning Now
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-ink-200/50 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-brand-600" />
            <span className="font-display font-bold text-ink-900">LinguaFlow</span>
          </div>
          <p className="text-sm text-ink-400">
            Built with ❤️ for language learners everywhere
          </p>
        </div>
      </footer>
    </div>
  );
}

