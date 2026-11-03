import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe,
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

/**
 * Onboarding — Multi-step setup flow
 *
 * Steps:
 * 1. Choose language (with flag cards)
 * 2. Select motivation (why learning?)
 * 3. Proficiency level (beginner/elementary/intermediate/advanced)
 * 4. Daily goal (5/10/15/20 min)
 * 5. Welcome screen (personalized)
 */

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
  exit: (direction) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  }),
};

/* Motivation options */
const motivations = [
  { id: 'travel', icon: Plane, label: 'Travel', description: 'Explore the world with confidence' },
  { id: 'career', icon: Briefcase, label: 'Career', description: 'Boost your professional opportunities' },
  { id: 'culture', icon: Heart, label: 'Culture', description: 'Connect with people and traditions' },
  { id: 'personal', icon: Sparkles, label: 'Personal Growth', description: 'Challenge yourself and grow' },
];

/* Proficiency levels */
const levels = [
  { id: 'beginner', label: 'Beginner', description: "I'm just starting out", emoji: '🌱' },
  { id: 'elementary', label: 'Elementary', description: 'I know some basics', emoji: '🌿' },
  { id: 'intermediate', label: 'Intermediate', description: 'I can hold simple conversations', emoji: '🌳' },
  { id: 'advanced', label: 'Advanced', description: 'I want to refine my skills', emoji: '🏔️' },
];

/* Daily goal options */
const dailyGoals = [
  { minutes: 5, label: 'Casual', description: '5 min/day', emoji: '🐢', lessons: 1 },
  { minutes: 10, label: 'Regular', description: '10 min/day', emoji: '🐇', lessons: 2 },
  { minutes: 15, label: 'Serious', description: '15 min/day', emoji: '🦊', lessons: 3 },
  { minutes: 20, label: 'Intense', description: '20 min/day', emoji: '🦅', lessons: 4 },
];

const TOTAL_STEPS = 5;

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
      <header className="px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
            <Globe className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-lg text-ink-900">LinguaFlow</span>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i + 1 === step
                  ? 'w-8 bg-brand-600'
                  : i + 1 < step
                  ? 'w-2 bg-brand-400'
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
                  <p className="text-label uppercase text-brand-600 mb-2 tracking-widest">Step 1 of {TOTAL_STEPS}</p>
                  <h1 className="font-display text-display-md text-ink-900 mb-3">
                    Which language do you want to learn?
                  </h1>
                  <p className="text-body-md text-ink-500 mb-8">
                    Pick one to get started. You can always switch or add more later.
                  </p>

                  <div className="grid grid-cols-1 gap-3">
                    {languages.map((lang) => (
                      <button
                        key={lang.id}
                        onClick={() => setSelectedLanguage(lang.id)}
                        className={`flex items-center gap-4 p-4 rounded-card border-2 transition-all duration-200 text-left group ${
                          selectedLanguage === lang.id
                            ? 'border-brand-600 bg-brand-50 shadow-glow-brand'
                            : 'border-ink-200 bg-surface-card hover:border-ink-300 hover:shadow-soft-sm'
                        }`}
                      >
                        <span className="text-4xl group-hover:scale-110 transition-transform duration-200">
                          {lang.flag}
                        </span>
                        <div className="flex-1">
                          <p className="font-display font-semibold text-lg text-ink-900">{lang.name}</p>
                          <p className="text-sm text-ink-500">{lang.nativeName} · {lang.speakers}</p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          selectedLanguage === lang.id
                            ? 'border-brand-600 bg-brand-600'
                            : 'border-ink-300'
                        }`}>
                          {selectedLanguage === lang.id && <Check className="w-4 h-4 text-white" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Motivation */}
              {step === 2 && (
                <div>
                  <p className="text-label uppercase text-brand-600 mb-2 tracking-widest">Step 2 of {TOTAL_STEPS}</p>
                  <h1 className="font-display text-display-md text-ink-900 mb-3">
                    Why are you learning {langData?.name}?
                  </h1>
                  <p className="text-body-md text-ink-500 mb-8">
                    This helps us personalize your learning path.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {motivations.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setSelectedMotivation(m.id)}
                        className={`flex flex-col items-center gap-3 p-6 rounded-card border-2 transition-all duration-200 text-center group ${
                          selectedMotivation === m.id
                            ? 'border-brand-600 bg-brand-50 shadow-glow-brand'
                            : 'border-ink-200 bg-surface-card hover:border-ink-300 hover:shadow-soft-sm'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
                          selectedMotivation === m.id ? 'bg-brand-600' : 'bg-ink-100 group-hover:bg-ink-200'
                        }`}>
                          <m.icon className={`w-6 h-6 ${
                            selectedMotivation === m.id ? 'text-white' : 'text-ink-600'
                          }`} />
                        </div>
                        <div>
                          <p className="font-display font-semibold text-ink-900">{m.label}</p>
                          <p className="text-sm text-ink-500 mt-0.5">{m.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Proficiency Level */}
              {step === 3 && (
                <div>
                  <p className="text-label uppercase text-brand-600 mb-2 tracking-widest">Step 3 of {TOTAL_STEPS}</p>
                  <h1 className="font-display text-display-md text-ink-900 mb-3">
                    What's your current level?
                  </h1>
                  <p className="text-body-md text-ink-500 mb-8">
                    No worries — we'll adjust as you go. Just give us a starting point.
                  </p>

                  <div className="grid grid-cols-1 gap-3">
                    {levels.map((lvl) => (
                      <button
                        key={lvl.id}
                        onClick={() => setSelectedLevel(lvl.id)}
                        className={`flex items-center gap-4 p-4 rounded-card border-2 transition-all duration-200 text-left group ${
                          selectedLevel === lvl.id
                            ? 'border-brand-600 bg-brand-50 shadow-glow-brand'
                            : 'border-ink-200 bg-surface-card hover:border-ink-300 hover:shadow-soft-sm'
                        }`}
                      >
                        <span className="text-3xl">{lvl.emoji}</span>
                        <div className="flex-1">
                          <p className="font-display font-semibold text-ink-900">{lvl.label}</p>
                          <p className="text-sm text-ink-500">{lvl.description}</p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          selectedLevel === lvl.id
                            ? 'border-brand-600 bg-brand-600'
                            : 'border-ink-300'
                        }`}>
                          {selectedLevel === lvl.id && <Check className="w-4 h-4 text-white" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Daily Goal */}
              {step === 4 && (
                <div>
                  <p className="text-label uppercase text-brand-600 mb-2 tracking-widest">Step 4 of {TOTAL_STEPS}</p>
                  <h1 className="font-display text-display-md text-ink-900 mb-3">
                    Set your daily goal
                  </h1>
                  <p className="text-body-md text-ink-500 mb-8">
                    Consistency beats intensity. Pick something sustainable.
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    {dailyGoals.map((goal) => (
                      <button
                        key={goal.minutes}
                        onClick={() => setSelectedGoal(goal.minutes)}
                        className={`flex flex-col items-center gap-2 p-5 rounded-card border-2 transition-all duration-200 text-center group ${
                          selectedGoal === goal.minutes
                            ? 'border-brand-600 bg-brand-50 shadow-glow-brand'
                            : 'border-ink-200 bg-surface-card hover:border-ink-300 hover:shadow-soft-sm'
                        }`}
                      >
                        <span className="text-3xl group-hover:scale-110 transition-transform duration-200">
                          {goal.emoji}
                        </span>
                        <p className="font-display font-semibold text-ink-900">{goal.label}</p>
                        <p className="text-sm text-ink-500">{goal.description}</p>
                        <p className="text-xs text-ink-400">{goal.lessons} lesson{goal.lessons > 1 ? 's' : ''}/day</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 5: Welcome */}
              {step === 5 && (
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-glow-brand"
                  >
                    <Sparkles className="w-10 h-10 text-white" />
                  </motion.div>

                  <h1 className="font-display text-display-md text-ink-900 mb-3">
                    You're all set! 🎉
                  </h1>
                  <p className="text-body-md text-ink-500 mb-8 max-w-sm mx-auto">
                    Your personalized {langData?.name} {langData?.flag} learning path is ready.
                    Let's start your journey!
                  </p>

                  {/* Optional name input */}
                  <div className="max-w-xs mx-auto mb-8">
                    <label className="block text-sm font-medium text-ink-700 mb-2 text-left">
                      What should we call you? <span className="text-ink-400">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Your name"
                      className="w-full px-4 py-3 rounded-input border border-ink-300 text-ink-900 placeholder:text-ink-400 focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
                    />
                  </div>

                  {/* Summary */}
                  <div className="bg-brand-50 rounded-card p-5 max-w-sm mx-auto text-left mb-2 border border-brand-100">
                    <p className="text-sm font-semibold text-brand-800 mb-3">Your Plan</p>
                    <div className="space-y-2.5 text-sm">
                      <div className="flex items-center gap-3 text-ink-700">
                        <BookOpen className="w-4 h-4 text-brand-600 flex-shrink-0" />
                        <span>Learning <strong>{langData?.name}</strong> {langData?.flag}</span>
                      </div>
                      <div className="flex items-center gap-3 text-ink-700">
                        <Target className="w-4 h-4 text-brand-600 flex-shrink-0" />
                        <span>{motivations.find(m => m.id === selectedMotivation)?.label} focused</span>
                      </div>
                      <div className="flex items-center gap-3 text-ink-700">
                        <Zap className="w-4 h-4 text-brand-600 flex-shrink-0" />
                        <span>{levels.find(l => l.id === selectedLevel)?.label} level</span>
                      </div>
                      <div className="flex items-center gap-3 text-ink-700">
                        <Clock className="w-4 h-4 text-brand-600 flex-shrink-0" />
                        <span>{selectedGoal} minutes per day</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* ── Footer Navigation ── */}
      <footer className="px-4 sm:px-6 py-6 border-t border-ink-200/50">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <button
            onClick={goBack}
            disabled={step === 1}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-pill font-medium transition-all duration-200 ${
              step === 1
                ? 'text-ink-300 cursor-not-allowed'
                : 'text-ink-700 hover:bg-ink-100 active:scale-[0.98]'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <button
            onClick={goNext}
            disabled={!canProceed()}
            className={`inline-flex items-center gap-2 px-7 py-3 rounded-pill font-semibold transition-all duration-200 ${
              canProceed()
                ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-soft-sm hover:shadow-glow-brand active:scale-[0.98]'
                : 'bg-ink-200 text-ink-400 cursor-not-allowed'
            }`}
          >
            {step === TOTAL_STEPS ? 'Start Learning' : 'Continue'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}

