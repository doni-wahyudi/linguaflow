import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { spring, transitionEase } from '../utils/motion';
import {
  ArrowRight,
  ArrowLeft,
  Plane,
  Briefcase,
  Heart,
  Sparkles,
  Check,
  Clock,
  Target,
  BookOpen,
  Zap,
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { languages } from '../data/languages';
import { Logo, Flag, SemanticIcon } from '../components/brand';
import { Button, Input } from '../components/ui';

/**
 * Onboarding — Multi-step setup flow
 *
 * Steps:
 * 1. Choose language (with SVG flag cards)
 * 2. Select motivation (why learning?)
 * 3. Proficiency level (beginner/elementary/intermediate/advanced)
 * 4. Daily goal (5/10/15/20 min)
 * 5. Welcome screen (personalized)
 *
 * Selection cards carry `aria-pressed` so the chosen option is announced, and
 * every colour comes from the token scale: `ink-600` was used here before and is
 * not a token, so those labels rendered with no colour at all.
 */

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: transitionEase },
  },
  exit: (direction) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    transition: { duration: 0.3, ease: transitionEase },
  }),
};

/* Motivation options */
const motivations = [
  { id: 'travel', icon: Plane, label: 'Travel', description: 'Explore the world with confidence' },
  { id: 'career', icon: Briefcase, label: 'Career', description: 'Boost your professional opportunities' },
  { id: 'culture', icon: Heart, label: 'Culture', description: 'Connect with people and traditions' },
  { id: 'personal', icon: Sparkles, label: 'Personal Growth', description: 'Challenge yourself and grow' },
];

/* Proficiency levels — `icon` is resolved by components/brand/icons.jsx */
const levels = [
  { id: 'beginner', label: 'Beginner', description: "I'm just starting out", icon: 'beginner' },
  { id: 'elementary', label: 'Elementary', description: 'I know some basics', icon: 'elementary' },
  { id: 'intermediate', label: 'Intermediate', description: 'I can hold simple conversations', icon: 'intermediate' },
  { id: 'advanced', label: 'Advanced', description: 'I want to refine my skills', icon: 'advanced' },
];

/* Daily goal options */
const dailyGoals = [
  { minutes: 5, label: 'Casual', description: '5 min/day', icon: 'casual', lessons: 1 },
  { minutes: 10, label: 'Regular', description: '10 min/day', icon: 'regular', lessons: 2 },
  { minutes: 15, label: 'Serious', description: '15 min/day', icon: 'serious', lessons: 3 },
  { minutes: 20, label: 'Intense', description: '20 min/day', icon: 'intense', lessons: 4 },
];

const TOTAL_STEPS = 5;

/* Shared option-card styling so every step selects the same way.
   Alignment is left to the call site: `text-left` must not live here, because a
   centred card adding `text-center` would collide with it and Tailwind would
   resolve that by stylesheet position, not by which class was written last. */
const optionCard = (selected) =>
  [
    'w-full rounded-card border-2 transition-colors duration-200 group',
    selected ? 'border-brand-700 bg-brand-50' : 'border-ink-200 bg-surface-card hover:border-ink-300',
  ].join(' ');

/* Radio-style selection tick, aria-hidden because aria-pressed carries the state. */
const OptionTick = ({ selected }) => (
  <span
    aria-hidden="true"
    className={`w-6 h-6 rounded-pill border-2 grid place-items-center shrink-0 transition-colors ${
      selected ? 'border-brand-700 bg-brand-700' : 'border-ink-300 bg-surface-card'
    }`}
  >
    {selected && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
  </span>
);

export default function Onboarding() {
  const navigate = useNavigate();
  const { completeOnboarding } = useUser();

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward

  // Form state
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedMotivation, setSelectedMotivation] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [userName, setUserName] = useState('');

  const canProceed = () => {
    switch (step) {
      case 1: return selectedLanguage !== null;
      case 2: return selectedMotivation !== null;
      case 3: return selectedLevel !== null;
      case 4: return selectedGoal !== null;
      case 5: return true;
      default: return false;
    }
  };

  const goNext = () => {
    if (!canProceed()) return;
    if (step === TOTAL_STEPS) {
      // Complete onboarding
      completeOnboarding({
        name: userName || 'Learner',
        selectedLanguage,
        motivation: selectedMotivation,
        level: selectedLevel,
        dailyGoal: selectedGoal,
      });
      navigate('/dashboard');
      return;
    }
    setDirection(1);
    setStep((s) => s + 1);
  };

  const goBack = () => {
    if (step === 1) return;
    setDirection(-1);
    setStep((s) => s - 1);
  };

  const langData = languages.find((l) => l.id === selectedLanguage);

  return (
    <div className="min-h-screen bg-surface-bg flex flex-col">
      {/* ── Header ── */}
      <header className="px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
        <Logo variant="full" size="md" />

        {/* Step indicator — decorative: the "Step n of 5" overline inside each
            step already states the position in text, so the dots duplicate it. */}
        <div className="flex items-center gap-2" aria-hidden="true">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <div
              key={i}
              className={`h-2 rounded-pill transition-all duration-300 ${
                i + 1 === step
                  ? 'w-8 bg-brand-700'
                  : i + 1 < step
                  ? 'w-2 bg-brand-200'
                  : 'w-2 bg-ink-200'
              }`}
            />
          ))}
        </div>
      </header>

      {/* ── Content ── */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {/* Step 1: Choose Language */}
              {step === 1 && (
                <div>
                  <p className="text-overline uppercase text-brand-700 mb-2">Step 1 of {TOTAL_STEPS}</p>
                  <h1 className="font-display text-display-md text-ink-900 mb-3">
                    Which language do you want to learn?
                  </h1>
                  <p className="text-body-md text-ink-500 mb-8">
                    Pick one to get started. You can always switch or add more later.
                  </p>

                  <div className="grid grid-cols-1 gap-3">
                    {languages.map((lang) => {
                      const selected = selectedLanguage === lang.id;
                      return (
                        <button
                          key={lang.id}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => setSelectedLanguage(lang.id)}
                          className={`${optionCard(selected)} flex items-center gap-4 p-4 text-left`}
                        >
                          <Flag code={lang.flagCode} size={32} decorative className="group-hover:scale-110 transition-transform duration-200" />
                          <span className="flex-1 min-w-0">
                            <span className="block font-display font-semibold text-body-lg text-ink-900">{lang.name}</span>
                            <span className="block text-body-sm text-ink-500">{lang.nativeName} · {lang.speakers}</span>
                          </span>
                          <OptionTick selected={selected} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 2: Motivation */}
              {step === 2 && (
                <div>
                  <p className="text-overline uppercase text-brand-700 mb-2">Step 2 of {TOTAL_STEPS}</p>
                  <h1 className="font-display text-display-md text-ink-900 mb-3">
                    Why are you learning {langData?.name}?
                  </h1>
                  <p className="text-body-md text-ink-500 mb-8">
                    This helps us personalize your learning path.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {motivations.map((m) => {
                      const selected = selectedMotivation === m.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => setSelectedMotivation(m.id)}
                          className={`${optionCard(selected)} flex flex-col items-center gap-3 p-6 text-center`}
                        >
                          <span
                            aria-hidden="true"
                            className={`w-12 h-12 rounded-card grid place-items-center transition-colors duration-200 ${
                              selected
                                ? 'bg-brand-700 text-white'
                                : 'bg-ink-100 text-ink-700 group-hover:bg-ink-200'
                            }`}
                          >
                            <m.icon className="w-6 h-6" />
                          </span>
                          <span>
                            <span className="block font-display font-semibold text-body-md text-ink-900">{m.label}</span>
                            <span className="block text-body-sm text-ink-500 mt-0.5">{m.description}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 3: Proficiency Level */}
              {step === 3 && (
                <div>
                  <p className="text-overline uppercase text-brand-700 mb-2">Step 3 of {TOTAL_STEPS}</p>
                  <h1 className="font-display text-display-md text-ink-900 mb-3">
                    What's your current level?
                  </h1>
                  <p className="text-body-md text-ink-500 mb-8">
                    No worries — we'll adjust as you go. Just give us a starting point.
                  </p>

                  <div className="grid grid-cols-1 gap-3">
                    {levels.map((lvl) => {
                      const selected = selectedLevel === lvl.id;
                      return (
                        <button
                          key={lvl.id}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => setSelectedLevel(lvl.id)}
                          className={`${optionCard(selected)} flex items-center gap-4 p-4 text-left`}
                        >
                          <span
                            aria-hidden="true"
                            className={`w-11 h-11 rounded-card grid place-items-center shrink-0 ${
                              selected ? 'bg-brand-100 text-brand-700' : 'bg-ink-100 text-ink-700'
                            }`}
                          >
                            <SemanticIcon name={lvl.icon} size={22} />
                          </span>
                          <span className="flex-1 min-w-0">
                            <span className="block font-display font-semibold text-body-md text-ink-900">{lvl.label}</span>
                            <span className="block text-body-sm text-ink-500">{lvl.description}</span>
                          </span>
                          <OptionTick selected={selected} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 4: Daily Goal */}
              {step === 4 && (
                <div>
                  <p className="text-overline uppercase text-brand-700 mb-2">Step 4 of {TOTAL_STEPS}</p>
                  <h1 className="font-display text-display-md text-ink-900 mb-3">
                    Set your daily goal
                  </h1>
                  <p className="text-body-md text-ink-500 mb-8">
                    Consistency beats intensity. Pick something sustainable.
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    {dailyGoals.map((goal) => {
                      const selected = selectedGoal === goal.minutes;
                      return (
                        <button
                          key={goal.minutes}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => setSelectedGoal(goal.minutes)}
                          className={`${optionCard(selected)} flex flex-col items-center gap-2 p-5 text-center`}
                        >
                          <span aria-hidden="true" className="text-brand-700 group-hover:scale-110 transition-transform duration-200">
                            <SemanticIcon name={goal.icon} size={30} />
                          </span>
                          <span className="font-display font-semibold text-body-md text-ink-900">{goal.label}</span>
                          <span className="text-body-sm text-ink-500">{goal.description}</span>
                          <span className="text-caption text-ink-500 tabular-nums">
                            {goal.lessons} lesson{goal.lessons > 1 ? 's' : ''}/day
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 5: Welcome */}
              {step === 5 && (
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={spring.glide}
                    className="w-20 h-20 mx-auto mb-6 rounded-modal bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center shadow-glow-brand"
                  >
                    <Sparkles className="w-10 h-10 text-white" aria-hidden="true" />
                  </motion.div>

                  <h1 className="font-display text-display-md text-ink-900 mb-3">
                    You're all set!
                  </h1>
                  <p className="text-body-md text-ink-500 mb-8 max-w-sm mx-auto">
                    Your personalized {langData?.name} learning path is ready. Let's start your journey!
                  </p>

                  {/* Optional name input */}
                  <div className="max-w-xs mx-auto mb-8 text-left">
                    <Input
                      label="What should we call you?"
                      helperText={'Optional — leave blank to stay “Learner”.'}
                      placeholder="Your name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </div>

                  {/* Summary */}
                  <div className="bg-brand-50 rounded-card p-5 max-w-sm mx-auto text-left mb-2 border border-brand-200">
                    <p className="text-body-sm font-semibold text-brand-800 mb-3">Your Plan</p>
                    <ul className="space-y-2.5 text-body-sm text-ink-700">
                      <li className="flex items-center gap-3">
                        <BookOpen className="w-4 h-4 text-brand-700 flex-shrink-0" aria-hidden="true" />
                        <span className="flex items-center gap-1.5">
                          Learning <strong className="font-semibold">{langData?.name}</strong>
                          {langData && <Flag code={langData.flagCode} size={16} decorative />}
                        </span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Target className="w-4 h-4 text-brand-700 flex-shrink-0" aria-hidden="true" />
                        <span>{motivations.find((m) => m.id === selectedMotivation)?.label} focused</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Zap className="w-4 h-4 text-brand-700 flex-shrink-0" aria-hidden="true" />
                        <span>{levels.find((l) => l.id === selectedLevel)?.label} level</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-brand-700 flex-shrink-0" aria-hidden="true" />
                        <span className="tabular-nums">{selectedGoal} minutes per day</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* ── Footer Navigation ── */}
      <footer className="px-4 sm:px-6 py-6 border-t border-ink-200">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            shape="pill"
            icon={ArrowLeft}
            onClick={goBack}
            disabled={step === 1}
          >
            Back
          </Button>

          <Button
            shape="pill"
            size="lg"
            icon={ArrowRight}
            iconPosition="right"
            onClick={goNext}
            disabled={!canProceed()}
          >
            {step === TOTAL_STEPS ? 'Start Learning' : 'Continue'}
          </Button>
        </div>
      </footer>
    </div>
  );
}

