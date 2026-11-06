/**
 * @file Practice.jsx
 * @description Multi-modal language practice arena featuring:
 * 1. Spaced Repetition (SRS) Flashcard Gym
 * 2. Speed Drills & Quick Practice Quizzes (with level filters A1/N5, A2/N4, B1/N3)
 * 3. Listening Ear Training Studio (with normal & turtle audio)
 * 4. Searchable Master Vocabulary Library
 *
 * Design notes:
 * - Kit-only: PageWrapper + Card + Badge + Button + Input. The drill and listening
 *   panels previously carried the same 12-line option-class block twice, with
 *   `emerald-500` in one and a different green in the other; both now render
 *   through <AnswerOptions>, which uses the measured `success-*` / `error-*` tiers.
 * - Ink 600 and 800 tiers do not exist in the ink scale (50/100/200/
 *   300/400/500/700/900), so those labels silently inherited their parent colour.
 *   Every one of them is now a real token.
 * - `shadow-soft-xs` is not a declared shadow either — it rendered nothing.
 * - The SRS card was a clickable <div> containing real audio <button>s, which is
 *   invalid nesting and unreachable by keyboard. The flip is now an explicit
 *   <button aria-expanded>, matching lesson/FlashCard.jsx.
 * - Audio controls are 44px (WCAG 2.1 §2.5.5) and named with aria-label; `title`
 *   alone is not an accessible name for touch or screen-reader users.
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Repeat,
  Volume2,
  Turtle,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Search,
  Check,
  RotateCw,
  Trophy,
  Zap,
  Headphones,
  ArrowRight,
  ArrowLeft,
  X,
  Mic,
} from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import { Flag } from '../components/brand';
import { useUser } from '../context/UserContext';
import { lessonsByLanguage } from '../data/lessons';
import { getLexiconByLanguage } from '../data/lexicon';
import { getExamsByLanguage } from '../data/exams';
import languages from '../data/languages';
import { playCorrect, playIncorrect } from '../utils/soundEffects';
import {
  AudioControls,
  Badge,
  Button,
  Card,
  Chip,
  Input,
  SegmentedControl,
  segmentIds,
  MicButton,
  LiveAudioVisualizer,
} from '../components/ui';
import PronunciationFeedback from '../components/lesson/PronunciationFeedback';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import { scorePronunciation } from '../utils/pronunciationScorer';
import { transitionEase } from '../utils/motion';

const practiceIds = segmentIds('practice');

/**
 * Single-select answer list shared by the speed drill and the ear-training
 * studio. Feedback is never colour-alone: the state is carried by a glyph, a
 * word ("Correct answer" / "Your answer") and a live region.
 */
function AnswerOptions({ options, correctIndex, selectedIndex, answered, onSelect, label }) {
  return (
    <div className="space-y-2.5" role="group" aria-label={label}>
      {options.map((opt, idx) => {
        const isSelected = selectedIndex === idx;
        const isCorrect = idx === correctIndex;

        let optionStyle =
          'border-ink-200 bg-surface-card text-ink-900 hover:border-brand-600 hover:bg-brand-50';
        if (answered) {
          if (isCorrect) {
            optionStyle = 'border-success bg-success-bg text-success-strong font-semibold';
          } else if (isSelected) {
            optionStyle = 'border-error bg-error-bg text-error-strong';
          } else {
            optionStyle = 'border-ink-200 bg-surface-100 text-ink-500 opacity-60';
          }
        }

        return (
          <button
            key={idx}
            type="button"
            disabled={answered}
            onClick={() => onSelect(idx)}
            aria-pressed={isSelected}
            className={`min-h-14 w-full p-4 rounded-card text-left border-2 text-body-md flex items-center justify-between gap-3 transition-colors ${optionStyle}`}
          >
            <span className="flex items-center gap-3 min-w-0">
              <span
                aria-hidden="true"
                className={`inline-flex items-center justify-center w-7 h-7 rounded-pill border-2 text-caption font-bold shrink-0 ${
                  answered && isCorrect
                    ? 'border-success text-success-strong'
                    : answered && isSelected
                      ? 'border-error text-error-strong'
                      : 'border-ink-300 text-ink-700'
                }`}
              >
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="truncate">{opt}</span>
            </span>

            {answered && isCorrect && (
              <CheckCircle2 size={18} className="text-success-strong shrink-0" aria-hidden="true" />
            )}
            {answered && isSelected && !isCorrect && (
              <X size={18} className="text-error-strong shrink-0" aria-hidden="true" />
            )}
          </button>
        );
      })}
    </div>
  );
}

/** Post-answer explanation panel with the continue action. */
function VerdictPanel({ tone = 'info', children, onNext, nextLabel }) {
  const surfaces = {
    success: 'bg-success-bg border-success-border',
    error: 'bg-error-bg border-error-border',
    info: 'bg-info-bg border-info-border',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: transitionEase }}
      role="status"
      aria-live="polite"
      className={`p-4 rounded-card border space-y-3 ${surfaces[tone]}`}
    >
      <div className="text-body-sm text-ink-700 leading-relaxed">{children}</div>
      {onNext && (
        <Button shape="pill" size="md" icon={ArrowRight} iconPosition="right" onClick={onNext}>
          {nextLabel}
        </Button>
      )}
    </motion.div>
  );
}

/**
 * Checks whether an item's level matches a selected filter level,
 * taking into account CEFR <-> JLPT cross-framework equivalencies.
 */
function matchesLevel(itemLevel, filterLevel) {
  if (!filterLevel || filterLevel === 'All') return true;
  if (!itemLevel) return false;
  if (itemLevel === filterLevel) return true;

  const equivalents = {
    A1: 'N5',
    N5: 'A1',
    A2: 'N4',
    N4: 'A2',
    B1: 'N3',
    N3: 'B1',
  };

  if (equivalents[filterLevel] === itemLevel) return true;
  if (
    filterLevel.includes('/') &&
    filterLevel.split('/').some((l) => l.trim() === itemLevel)
  ) {
    return true;
  }
  return false;
}

/**
 * Generates 3 distinct distractor translation strings for multiple-choice questions.
 */
function getVocabDistractors(currentWord, allWords, count = 3) {
  const targetTrans = (currentWord.translation || '').trim().toLowerCase();
  const distractors = [];
  const used = new Set([targetTrans]);

  // Try same level first for closer distractors
  const sameLevel = allWords.filter(
    (w) => w.level === currentWord.level && w.id !== currentWord.id
  );
  const candidatePool = sameLevel.length >= count ? sameLevel : allWords;
  const poolLen = candidatePool.length;

  if (poolLen === 0) {
    const defaultFallbacks = ['To understand', 'Tomorrow morning', 'Important message', 'Good evening'];
    return defaultFallbacks.slice(0, count);
  }

  // Stride through candidates deterministically using character codes of id
  const idSum = (currentWord.id || '').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const startIndex = Math.abs(idSum) % poolLen;

  // Pick a stride coprime to poolLen to guarantee full traversal without skipping
  // (avoids stride of 3 skipping 2/3 of items when pool length is a multiple of 3)
  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
  let stride = 1;
  for (const testStride of [3, 7, 11, 13, 17, 19, 23, 29, 31, 1]) {
    if (gcd(testStride, poolLen) === 1) {
      stride = testStride;
      break;
    }
  }

  for (let i = 0; i < poolLen && distractors.length < count; i++) {
    const candidate = candidatePool[(startIndex + i * stride) % poolLen];
    if (candidate && candidate.translation) {
      const clean = candidate.translation.trim().toLowerCase();
      if (!used.has(clean)) {
        used.add(clean);
        distractors.push(candidate.translation);
      }
    }
  }

  // Safety fallbacks if candidate pool is small
  const defaultFallbacks = ['To understand', 'Tomorrow morning', 'Important message', 'Good evening'];
  for (const fb of defaultFallbacks) {
    if (distractors.length >= count) break;
    if (!used.has(fb.toLowerCase())) {
      used.add(fb.toLowerCase());
      distractors.push(fb);
    }
  }

  return distractors;
}

export default function Practice() {
  const { user, progress, speech, streak, xp } = useUser();
  const currentLang = user.selectedLanguage || 'es';
  const langData = languages.find((l) => l.id === currentLang);

  // Active Practice Mode Tab
  const [activeTab, setActiveTab] = useState('review'); // 'review' | 'quiz' | 'listening' | 'words'
  const [searchQuery, setSearchQuery] = useState('');

  // Level choices adapted for current language framework (CEFR vs JLPT)
  const availableLevels = useMemo(() => {
    return currentLang === 'ja'
      ? ['All', 'N5', 'N4', 'N3']
      : ['All', 'A1', 'A2', 'B1'];
  }, [currentLang]);

  // ── 1. Vocabulary Pool & SRS ──────────────────────────────────────────────
  const allVocabWords = useMemo(() => {
    const list = lessonsByLanguage[currentLang] || [];
    const map = new Map();
    const wordKeySet = new Set();
    // Normalize words for deduplication: strip parenthesized furigana/readings and leading articles
    const normalizeWord = (w) =>
      (w || '')
        .replace(/\s*\([^)]*\)/g, '')
        .replace(/^(el|la|los|las|le|les|der|die|das|ein|eine)\s+|^l['’]/i, '')
        .trim()
        .toLowerCase();

    // 1. Vocabulary from curriculum lessons
    list.forEach((lesson) => {
      if (lesson.vocabulary) {
        lesson.vocabulary.forEach((v) => {
          if (!map.has(v.id)) {
            const entry = {
              ...v,
              category: lesson.categoryId || 'general',
              lessonTitle: lesson.title,
              level: lesson.level || (currentLang === 'ja' ? 'N5' : 'A1'),
            };
            map.set(v.id, entry);
            if (v.word) {
              wordKeySet.add(normalizeWord(v.word));
            }
          }
        });
      }
    });

    // 2. Vocabulary from expanded core lexicon
    const lexiconList = getLexiconByLanguage(currentLang) || [];
    lexiconList.forEach((item) => {
      const norm = normalizeWord(item.word);
      if (map.has(item.id)) {
        return;
      }
      if (norm && wordKeySet.has(norm)) {
        // Merge missing fields into existing lesson entry so entries remain unique
        for (const [existingId, existingEntry] of map.entries()) {
          if (normalizeWord(existingEntry.word) === norm) {
            map.set(existingId, {
              ...item,
              ...existingEntry,
              exampleTranslation: existingEntry.exampleTranslation || item.exampleTranslation,
              gender: existingEntry.gender || item.gender,
              article: existingEntry.article || item.article,
              kanji: existingEntry.kanji || item.kanji,
              reading: existingEntry.reading || item.reading,
            });
            break;
          }
        }
        return;
      }

      // Add unique lexicon entry formatted as specified
      map.set(item.id, {
        id: item.id,
        word: item.word,
        translation: item.translation,
        pronunciation: item.pronunciation,
        example: item.example,
        exampleTranslation: item.exampleTranslation,
        category: item.category || 'general',
        lessonTitle: 'Core Lexicon',
        level: item.level || (currentLang === 'ja' ? 'N5' : 'A1'),
        gender: item.gender,
        article: item.article,
        kanji: item.kanji,
        reading: item.reading,
      });
      if (norm) {
        wordKeySet.add(norm);
      }
    });

    return Array.from(map.values());
  }, [currentLang]);

  const dueWordIds = useMemo(() => {
    const due = progress.getWordsForReview() || [];
    return due.map((wp) => (typeof wp === 'string' ? wp : wp.wordId)).filter(Boolean);
  }, [progress]);

  const fallbackReviewPool = useMemo(() => {
    const dueSet = new Set(dueWordIds);
    const due = allVocabWords.filter((w) => dueSet.has(w.id));
    if (due.length > 0) return due;

    // Daily practice session: prioritize words already encountered, padded up to 15 cards with vocabulary
    const learnedIds = new Set(Object.keys(progress.wordProgress || {}));
    const learned = allVocabWords.filter((w) => learnedIds.has(w.id));
    if (learned.length >= 15) {
      return learned.slice(0, 15);
    }
    const unlearned = allVocabWords.filter((w) => !learnedIds.has(w.id));
    return [...learned, ...unlearned].slice(0, 15);
  }, [allVocabWords, dueWordIds, progress.wordProgress]);

  const [sessionCards, setSessionCards] = useState([]);
  const [sessionIndex, setSessionIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionFinished, setSessionFinished] = useState(false);

  // Initialize or re-seed session cards when language changes without mutating mid-session
  useEffect(() => {
    setSessionCards(fallbackReviewPool);
    setSessionIndex(0);
    setIsFlipped(false);
    setSessionFinished(false);
  }, [currentLang, allVocabWords]);

  const reviewWords = sessionCards.length > 0 ? sessionCards : fallbackReviewPool;
  const currentWord = reviewWords[sessionIndex];

  const handleRate = (quality) => {
    if (!currentWord) return;
    progress.updateWordProgress(currentWord.id, quality);
    streak.recordActivity();
    xp.addXP(5);

    setIsFlipped(false);
    if (sessionIndex + 1 < reviewWords.length) {
      setSessionIndex((i) => i + 1);
    } else {
      setSessionFinished(true);
    }
  };

  const handleResetSession = () => {
    setSessionCards(fallbackReviewPool);
    setSessionIndex(0);
    setIsFlipped(false);
    setSessionFinished(false);
  };

  // ── 2. Speed Drill & Practice Quiz State ──────────────────────────────────
  const DRILL_SESSION_SIZE = 10;
  const [drillLevel, setDrillLevel] = useState('All');
  const [drillIndex, setDrillIndex] = useState(0);
  const [drillAnswered, setDrillAnswered] = useState(false);
  const [drillSelected, setDrillSelected] = useState(null);
  const [drillScore, setDrillScore] = useState(0);
  const [drillFinished, setDrillFinished] = useState(false);
  const [drillSessionSeed, setDrillSessionSeed] = useState(0);

  // Generate drill questions from lessons and expanded lexicon bank
  const drillQuestions = useMemo(() => {
    const list = lessonsByLanguage[currentLang] || [];
    const pool = [];

    // 1. Multiple-choice questions from curriculum lessons
    list.forEach((lesson) => {
      if (drillLevel !== 'All' && !matchesLevel(lesson.level, drillLevel)) return;

      if (lesson.exercises) {
        lesson.exercises.forEach((ex) => {
          if (ex.type === 'multipleChoice' && ex.options && ex.options.length >= 2) {
            pool.push({
              id: `${lesson.id}-${pool.length}`,
              question: ex.question,
              options: ex.options,
              correctIndex: ex.correctIndex,
              explanation: ex.explanation,
              lessonTitle: lesson.title,
              level: lesson.level,
            });
          }
        });
      }
    });

    // 2. Vocabulary drill questions generated from expanded allVocabWords pool
    const matchingVocab = allVocabWords.filter(
      (w) => drillLevel === 'All' || matchesLevel(w.level, drillLevel)
    );

    matchingVocab.forEach((vocab, idx) => {
      const distractors = getVocabDistractors(vocab, allVocabWords, 3);
      const correctIndex = (idx + pool.length) % 4;
      const options = [];
      let dIdx = 0;
      for (let pos = 0; pos < 4; pos++) {
        if (pos === correctIndex) {
          options.push(vocab.translation);
        } else {
          options.push(distractors[dIdx++] || 'Other');
        }
      }

      const qWord =
        vocab.reading && vocab.reading !== vocab.word
          ? `${vocab.word} (${vocab.reading})`
          : vocab.word;

      let explanation = `“${vocab.word}” translates to “${vocab.translation}”.`;
      if (vocab.example) {
        explanation += ` Example: “${vocab.example}”`;
        if (vocab.exampleTranslation) {
          explanation += ` (${vocab.exampleTranslation})`;
        }
      }

      pool.push({
        id: `drill-vocab-${vocab.id}`,
        question: `What does “${qWord}” mean?`,
        options,
        correctIndex,
        explanation,
        lessonTitle: vocab.lessonTitle || 'Core Lexicon',
        level: vocab.level,
      });
    });

    if (pool.length <= DRILL_SESSION_SIZE) {
      return pool;
    }

    // Chunk to a bite-sized session of DRILL_SESSION_SIZE questions
    // Shuffle pool pseudo-randomly to give a diverse mix of curriculum exercises & vocabulary
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, DRILL_SESSION_SIZE);
  }, [currentLang, drillLevel, allVocabWords, drillSessionSeed]);

  const currentDrillQ = drillQuestions[drillIndex] || drillQuestions[0];

  const handleDrillAnswer = (optIdx) => {
    if (drillAnswered || !currentDrillQ) return;
    setDrillSelected(optIdx);
    setDrillAnswered(true);

    const isCorrect = optIdx === currentDrillQ.correctIndex;
    if (isCorrect) {
      setDrillScore((s) => s + 1);
      playCorrect();
      xp.addXP(10);
    } else {
      playIncorrect();
    }
  };

  const handleDrillNext = () => {
    if (drillIndex + 1 < drillQuestions.length) {
      setDrillIndex((i) => i + 1);
      setDrillAnswered(false);
      setDrillSelected(null);
    } else {
      setDrillFinished(true);
    }
  };

  const handleDrillReset = () => {
    setDrillSessionSeed((s) => s + 1);
    setDrillIndex(0);
    setDrillAnswered(false);
    setDrillSelected(null);
    setDrillScore(0);
    setDrillFinished(false);
  };

  // ── 3. Listening Ear Training State ───────────────────────────────────────
  const LISTEN_SESSION_SIZE = 10;
  const [listenLevel, setListenLevel] = useState('All');
  const [listenIndex, setListenIndex] = useState(0);
  const [listenAnswered, setListenAnswered] = useState(false);
  const [listenSelected, setListenSelected] = useState(null);
  const [listenScore, setListenScore] = useState(0);
  const [listenFinished, setListenFinished] = useState(false);
  const [listenSessionSeed, setListenSessionSeed] = useState(0);

  const listeningExercises = useMemo(() => {
    const audioTasks = [];

    // 1. Official exam listening sections
    const exams = getExamsByLanguage(currentLang);
    exams.forEach((exam) => {
      if (listenLevel !== 'All' && !matchesLevel(exam.level, listenLevel)) return;
      const listeningSec = exam.sections?.find((s) => s.id === 'listening');
      if (listeningSec && listeningSec.questions) {
        listeningSec.questions.forEach((q) => {
          if (q.audioScript && q.options && q.options.length >= 2) {
            audioTasks.push({
              ...q,
              level: exam.level,
              examTitle: exam.title,
            });
          }
        });
      }
    });

    // 2. Ear training audio tasks from expanded lexicon pool
    const matchingVocab = allVocabWords.filter(
      (w) => listenLevel === 'All' || matchesLevel(w.level, listenLevel)
    );

    matchingVocab.forEach((vocab, idx) => {
      const distractors = getVocabDistractors(vocab, allVocabWords, 3);
      const correctIndex = idx % 4;
      const options = [];
      let dIdx = 0;
      for (let pos = 0; pos < 4; pos++) {
        if (pos === correctIndex) {
          options.push(vocab.translation);
        } else {
          options.push(distractors[dIdx++] || 'Other');
        }
      }

      const rawAudio = vocab.example || vocab.word;
      // Strip parenthesized readings/gender markers for TTS speech synthesizer
      const audioScript = (rawAudio || '').replace(/\s*\([^)]*\)/g, '').trim();
      const prompt = vocab.example
        ? `Listen to the audio clip. What does this expression mean?`
        : `Listen to the spoken audio. What is the English translation?`;

      let explanation = `Audio text: “${audioScript}”. Translation: “${vocab.translation}”.`;
      if (vocab.example && vocab.exampleTranslation) {
        explanation += ` Sentence: “${vocab.exampleTranslation}”`;
      }

      audioTasks.push({
        id: `listen-vocab-${vocab.id}`,
        prompt,
        audioScript,
        options,
        correctIndex,
        explanation,
        level: vocab.level,
        examTitle: vocab.lessonTitle || 'Core Lexicon Audio',
      });
    });

    if (audioTasks.length <= LISTEN_SESSION_SIZE) {
      return audioTasks;
    }

    // Chunk to a bite-sized session of LISTEN_SESSION_SIZE questions
    const shuffled = [...audioTasks];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, LISTEN_SESSION_SIZE);
  }, [currentLang, listenLevel, allVocabWords, listenSessionSeed]);

  const currentListenQ = listeningExercises[listenIndex] || listeningExercises[0];

  const handleListenAnswer = (idx) => {
    if (listenAnswered || !currentListenQ) return;
    setListenSelected(idx);
    setListenAnswered(true);

    if (idx === currentListenQ.correctIndex) {
      setListenScore((s) => s + 1);
      playCorrect();
      xp.addXP(15);
      streak.recordActivity();
    } else {
      playIncorrect();
    }
  };

  const handleListenNext = () => {
    if (listenIndex + 1 < listeningExercises.length) {
      setListenIndex((i) => i + 1);
      setListenAnswered(false);
      setListenSelected(null);
    } else {
      setListenFinished(true);
    }
  };

  const handleListenReset = () => {
    setListenSessionSeed((s) => s + 1);
    setListenIndex(0);
    setListenAnswered(false);
    setListenSelected(null);
    setListenScore(0);
    setListenFinished(false);
  };

  // ── 4. Vocabulary Library Search & Filtering ──────────────────────────────
  const [libraryLevel, setLibraryLevel] = useState('All');
  const [libraryCategory, setLibraryCategory] = useState('All');

  const availableCategories = useMemo(() => {
    const cats = new Set();
    allVocabWords.forEach((w) => {
      if (w.category) {
        cats.add(w.category);
      }
    });
    return ['All', ...Array.from(cats).sort()];
  }, [allVocabWords]);

  const filteredWords = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return allVocabWords.filter((w) => {
      // Level filter
      if (libraryLevel !== 'All' && !matchesLevel(w.level, libraryLevel)) {
        return false;
      }
      // Category filter
      if (libraryCategory !== 'All' && w.category !== libraryCategory) {
        return false;
      }
      // Search query filter
      if (q) {
        const matchesWord = w.word && w.word.toLowerCase().includes(q);
        const matchesTrans = w.translation && w.translation.toLowerCase().includes(q);
        const matchesPron = w.pronunciation && w.pronunciation.toLowerCase().includes(q);
        const matchesKanji = w.kanji && w.kanji.toLowerCase().includes(q);
        const matchesReading = w.reading && w.reading.toLowerCase().includes(q);
        const matchesExample = w.example && w.example.toLowerCase().includes(q);
        const matchesCategory = w.category && w.category.toLowerCase().includes(q);
        return (
          matchesWord ||
          matchesTrans ||
          matchesPron ||
          matchesKanji ||
          matchesReading ||
          matchesExample ||
          matchesCategory
        );
      }
      return true;
    });
  }, [allVocabWords, searchQuery, libraryLevel, libraryCategory]);

  // ── 5. Pronunciation Studio (Oral Production & Speech Recognition) ──────────
  const [speakingLevel, setSpeakingLevel] = useState('All');
  const [speakingIndex, setSpeakingIndex] = useState(0);
  const [speakingEvaluation, setSpeakingEvaluation] = useState(null);
  const [masteredCount, setMasteredCount] = useState(0);

  const {
    isListening: isSpeakingListening,
    transcript: speakingTranscript,
    interimTranscript: speakingInterimTranscript,
    error: speechRecognitionError,
    isSupported: isSpeechRecognitionSupported,
    startListening: startSpeechRecognition,
    stopListening: stopSpeechRecognition,
    resetTranscript: resetSpeechTranscript,
  } = useSpeechRecognition();

  // Curate phrases pool from both lesson speaking exercises and expanded core vocabulary
  const speakingPhrases = useMemo(() => {
    const phrases = [];
    const seen = new Set();

    // 1. Target phrases from lesson speaking exercises
    const list = lessonsByLanguage[currentLang] || [];
    list.forEach((lesson) => {
      if (speakingLevel !== 'All' && !matchesLevel(lesson.level, speakingLevel)) return;
      if (lesson.exercises) {
        lesson.exercises.forEach((ex) => {
          if (ex.type === 'speaking' && ex.targetText && !seen.has(ex.targetText)) {
            seen.add(ex.targetText);
            phrases.push({
              id: ex.id,
              text: ex.targetText,
              translation: ex.translation,
              pronunciation: ex.pronunciation,
              reading: ex.reading,
              level: lesson.level,
              lessonTitle: lesson.title,
              wordId: ex.wordId,
            });
          }
        });
      }
    });

    // 2. High-value sentences and expressions from allVocabWords
    const matchingVocab = allVocabWords.filter(
      (w) => speakingLevel === 'All' || matchesLevel(w.level, speakingLevel)
    );

    matchingVocab.forEach((w) => {
      if (w.example && !seen.has(w.example)) {
        seen.add(w.example);
        phrases.push({
          id: `spk-ex-${w.id}`,
          text: w.example,
          translation: w.exampleTranslation || w.translation,
          pronunciation: w.pronunciation,
          reading: w.reading,
          level: w.level,
          lessonTitle: w.lessonTitle || 'Core Lexicon',
          wordId: w.id,
        });
      }

      if (w.word && !seen.has(w.word)) {
        seen.add(w.word);
        phrases.push({
          id: `spk-word-${w.id}`,
          text: w.word,
          translation: w.translation,
          pronunciation: w.pronunciation,
          reading: w.reading,
          level: w.level,
          lessonTitle: w.lessonTitle || 'Core Lexicon',
          wordId: w.id,
        });
      }
    });

    return phrases;
  }, [currentLang, speakingLevel, allVocabWords]);

  const currentSpeakingPhrase = speakingPhrases[speakingIndex] || speakingPhrases[0];

  // Evaluate spoken phrase when recognition stops
  useEffect(() => {
    if (speakingTranscript && !isSpeakingListening && currentSpeakingPhrase) {
      const result = scorePronunciation(
        currentSpeakingPhrase.text,
        speakingTranscript,
        currentLang,
        { reading: currentSpeakingPhrase.reading }
      );
      setSpeakingEvaluation(result);

      if (result.passed) {
        playCorrect();
        xp.addXP(15);
        streak.recordActivity();
        if (result.score >= 85) {
          setMasteredCount((c) => c + 1);
          if (currentSpeakingPhrase.wordId) {
            progress.updateWordProgress(currentSpeakingPhrase.wordId, 5);
          }
        }
      } else {
        playIncorrect();
      }
    }
  }, [speakingTranscript, isSpeakingListening, currentSpeakingPhrase, currentLang]);

  const handleToggleSpeaking = () => {
    if (isSpeakingListening) {
      stopSpeechRecognition();
    } else {
      setSpeakingEvaluation(null);
      resetSpeechTranscript();
      startSpeechRecognition({ lang: currentLang });
    }
  };

  const handleNextSpeakingPhrase = () => {
    setSpeakingEvaluation(null);
    resetSpeechTranscript();
    setSpeakingIndex((i) => (i + 1) % (speakingPhrases.length || 1));
  };

  const handlePrevSpeakingPhrase = () => {
    setSpeakingEvaluation(null);
    resetSpeechTranscript();
    setSpeakingIndex((i) => (i - 1 + (speakingPhrases.length || 1)) % (speakingPhrases.length || 1));
  };

  // Reset session and level state on language change
  useEffect(() => {
    setDrillSessionSeed((s) => s + 1);
    setDrillIndex(0);
    setDrillAnswered(false);
    setDrillSelected(null);
    setDrillScore(0);
    setDrillFinished(false);

    setListenIndex(0);
    setListenAnswered(false);
    setListenSelected(null);

    setSessionIndex(0);
    setIsFlipped(false);
    setSessionFinished(false);

    setSpeakingIndex(0);
    setSpeakingEvaluation(null);
    resetSpeechTranscript();

    if (drillLevel !== 'All' && !availableLevels.includes(drillLevel)) {
      setDrillLevel('All');
    }
    if (listenLevel !== 'All' && !availableLevels.includes(listenLevel)) {
      setListenLevel('All');
    }
    if (speakingLevel !== 'All' && !availableLevels.includes(speakingLevel)) {
      setSpeakingLevel('All');
    }
    if (libraryLevel !== 'All' && !availableLevels.includes(libraryLevel)) {
      setLibraryLevel('All');
    }
    setLibraryCategory('All');
  }, [currentLang, availableLevels, resetSpeechTranscript]);

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* ── Page Header ──
            The rail sits under the title rather than opposite it: four tabs plus
            the title block need ~1180px and the container caps at 1152px, so the
            side-by-side version wrapped one tab onto a second grey row. */}
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="font-display text-display-md text-ink-900 flex items-center gap-2">
              <Repeat className="w-8 h-8 text-brand-600" />
              Practice & Training Arena
            </h1>
            <p className="text-body-md text-ink-500 mt-1">
              Active spaced repetition, speed drills, ear training, and vocabulary reinforcement for{' '}
              <strong className="font-semibold text-ink-700">{langData?.name}</strong>{' '}
              <Flag code={langData?.flagCode} size={16} decorative />.
            </p>
          </div>

          {/* Practice Mode Tabs */}
          <SegmentedControl
            name="practice"
            label="Practice mode"
            value={activeTab}
            onChange={setActiveTab}
            className="self-start"
            tabs={[
              {
                id: 'review',
                icon: Sparkles,
                label: (
                  <>
                    Flashcards{' '}
                    <span className="tabular-nums">({dueWordIds.length} due)</span>
                  </>
                ),
              },
              { id: 'quiz', icon: Zap, label: 'Speed Drills' },
              { id: 'listening', icon: Headphones, label: 'Ear Training' },
              { id: 'speaking', icon: Mic, label: 'Pronunciation Studio' },
              {
                id: 'words',
                icon: BookOpen,
                label: (
                  <>
                    Word Library{' '}
                    <span className="tabular-nums">({allVocabWords.length})</span>
                  </>
                ),
              },
            ]}
          />
        </div>

        {/* ── TAB 1: Spaced Repetition (SRS) Flashcard Gym ── */}
        {activeTab === 'review' && (
          <div
            role="tabpanel"
            id={practiceIds.panelId('review')}
            aria-labelledby={practiceIds.tabId('review')}
          >
            {!sessionFinished && currentWord ? (
              <div className="max-w-md mx-auto">
                <div className="flex items-center justify-between gap-3 text-body-sm text-ink-500 font-medium mb-2">
                  <span className="tabular-nums">
                    Card {sessionIndex + 1} of {reviewWords.length}
                  </span>
                  <Badge variant={dueWordIds.length > 0 ? 'amber' : 'brand'} uppercase>
                    {dueWordIds.length > 0 ? 'Due for SRS review' : 'Daily practice'}
                  </Badge>
                </div>

                {/* Interactive Flashcard — the flip is a real button, not a click
                    handler on the card that wraps the audio buttons. */}
                <Card padding="lg" className="min-h-72 flex flex-col text-center">
                  <div className="flex items-center justify-between gap-3">
                    <Badge variant="brand" uppercase>
                      {isFlipped ? 'Translation' : 'Target Word'}
                    </Badge>
                    <AudioControls
                      text={currentWord.word}
                      lang={currentLang}
                      speech={speech}
                    />
                  </div>

                  <div className="my-auto py-6">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={isFlipped ? 'answer' : 'prompt'}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18, ease: transitionEase }}
                      >
                        <h2 className="font-display font-bold text-display-md text-ink-900 mb-2">
                          {isFlipped ? currentWord.translation : currentWord.word}
                        </h2>
                        {!isFlipped && currentWord.reading && currentWord.reading !== currentWord.word && (
                          <p className="text-body-sm text-ink-700 font-medium mb-1">
                            {currentWord.reading}
                          </p>
                        )}
                        {!isFlipped && currentWord.pronunciation && (
                          <p className="text-body-sm text-ink-500 font-medium">
                            /{currentWord.pronunciation}/
                          </p>
                        )}
                        {isFlipped && currentWord.example && (
                          <div className="mt-3 mx-auto max-w-sm p-3 rounded-button border border-brand-200 bg-brand-50 text-body-sm text-ink-700 italic">
                            <p>"{currentWord.example}"</p>
                            {currentWord.exampleTranslation && (
                              <p className="text-caption text-ink-500 not-italic mt-1">
                                "{currentWord.exampleTranslation}"
                              </p>
                            )}
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <Button
                    variant="outline"
                    shape="pill"
                    size="md"
                    fullWidth
                    icon={RotateCw}
                    aria-expanded={isFlipped}
                    onClick={() => setIsFlipped((f) => !f)}
                  >
                    {isFlipped ? 'Show the target word' : 'Flip card'}
                  </Button>
                </Card>

                {/* Quality Ratings (SM-2 Spaced Repetition) */}
                <div className="mt-6">
                  <p className="text-overline uppercase text-center text-ink-700 mb-3">
                    How well did you recall this word?
                  </p>

                  <div className="grid grid-cols-3 gap-2.5">
                    <Button variant="danger" size="lg" fullWidth onClick={() => handleRate(1)}>
                      <span className="block leading-tight">
                        <span className="block font-bold">Hard</span>
                        <span className="block text-caption font-medium opacity-90">Need review</span>
                      </span>
                    </Button>

                    <Button variant="outline" size="lg" fullWidth onClick={() => handleRate(3)}>
                      <span className="block leading-tight">
                        <span className="block font-bold">Good</span>
                        <span className="block text-caption font-medium text-ink-500">Recalled</span>
                      </span>
                    </Button>

                    <Button size="lg" fullWidth onClick={() => handleRate(5)}>
                      <span className="block leading-tight">
                        <span className="block font-bold">Easy</span>
                        <span className="block text-caption font-medium opacity-90">Mastered</span>
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <Card padding="lg" className="max-w-md mx-auto text-center">
                <div className="w-16 h-16 rounded-pill bg-brand-50 border border-brand-200 text-brand-700 mx-auto flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
                </div>
                <h2 className="font-display font-bold text-display-sm text-ink-900 mb-2">
                  Session Complete!
                </h2>
                <p className="text-body-sm text-ink-500 mb-6">
                  You reviewed all cards for today. Your spaced repetition schedule has been updated!
                </p>
                <Button shape="pill" size="lg" onClick={handleResetSession}>
                  Review Again
                </Button>
              </Card>
            )}
          </div>
        )}

        {/* ── TAB 2: Speed Drills & Practice Quiz ── */}
        {activeTab === 'quiz' && (
          <div
            role="tabpanel"
            id={practiceIds.panelId('quiz')}
            aria-labelledby={practiceIds.tabId('quiz')}
            className="max-w-2xl mx-auto space-y-6"
          >
            {/* Level Filter Bar */}
            <Card padding="sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-overline uppercase text-ink-700">Target level</span>
                <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter drills by level">
                  {availableLevels.map((lvl) => (
                    <Chip
                      key={lvl}
                      size="sm"
                      tone="card"
                      selected={drillLevel === lvl}
                      onClick={() => {
                        setDrillLevel(lvl);
                        handleDrillReset();
                      }}
                    >
                      {lvl === 'All' ? 'All levels' : lvl}
                    </Chip>
                  ))}
                </div>
              </div>
            </Card>

            {!drillFinished && currentDrillQ ? (
              <Card padding="md" className="sm:p-8">
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-body-sm text-ink-500">
                    <Badge variant="brand" uppercase>
                      Level {currentDrillQ.level} • {currentDrillQ.lessonTitle}
                    </Badge>
                    <span className="tabular-nums">
                      Question {drillIndex + 1} of {drillQuestions.length}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-display-sm text-ink-900 leading-snug">
                    {currentDrillQ.question}
                  </h3>

                  <AnswerOptions
                    options={currentDrillQ.options}
                    correctIndex={currentDrillQ.correctIndex}
                    selectedIndex={drillSelected}
                    answered={drillAnswered}
                    onSelect={handleDrillAnswer}
                    label={`Answer options for: ${currentDrillQ.question}`}
                  />

                  {/* Explanation on answered */}
                  {drillAnswered && (
                    <VerdictPanel
                      tone={drillSelected === currentDrillQ.correctIndex ? 'success' : 'error'}
                      onNext={handleDrillNext}
                      nextLabel={drillIndex + 1 === drillQuestions.length ? 'See Results' : 'Next Question'}
                    >
                      <span className="font-bold text-ink-900 block mb-0.5">
                        {drillSelected === currentDrillQ.correctIndex ? 'Correct answer' : 'Explanation'}
                      </span>
                      {currentDrillQ.explanation || 'Excellent grammar application.'}
                    </VerdictPanel>
                  )}
                </div>
              </Card>
            ) : (
              <Card padding="lg" className="text-center">
                <div className="w-16 h-16 rounded-card bg-amber-50 border border-amber-200 text-amber-700 mx-auto flex items-center justify-center mb-4">
                  <Trophy className="w-8 h-8" aria-hidden="true" />
                </div>
                <h3 className="font-display font-bold text-display-sm text-ink-900 mb-1">
                  Speed Drill Completed!
                </h3>
                <p className="text-body-sm text-ink-500 mb-6">
                  You scored{' '}
                  <strong className="text-ink-900 tabular-nums">{drillScore}</strong> out of{' '}
                  <strong className="text-ink-900 tabular-nums">{drillQuestions.length}</strong>{' '}
                  <span className="tabular-nums">
                    ({Math.round((drillScore / Math.max(1, drillQuestions.length)) * 100)}%)
                  </span>
                </p>
                <Button shape="pill" size="lg" onClick={handleDrillReset}>
                  Practice More
                </Button>
              </Card>
            )}
          </div>
        )}

        {/* ── TAB 3: Listening Ear Training Studio ── */}
        {activeTab === 'listening' && (
          <div
            role="tabpanel"
            id={practiceIds.panelId('listening')}
            aria-labelledby={practiceIds.tabId('listening')}
            className="max-w-2xl mx-auto space-y-6"
          >
            {/* Level Filter Bar */}
            <Card padding="sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-overline uppercase text-ink-700">Target level</span>
                <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter ear training by level">
                  {availableLevels.map((lvl) => (
                    <Chip
                      key={lvl}
                      size="sm"
                      tone="card"
                      selected={listenLevel === lvl}
                      onClick={() => {
                        setListenLevel(lvl);
                        handleListenReset();
                      }}
                    >
                      {lvl === 'All' ? 'All levels' : lvl}
                    </Chip>
                  ))}
                </div>
              </div>
            </Card>

            {!listenFinished && currentListenQ ? (
              <Card padding="md" className="sm:p-8">
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-body-sm text-ink-500">
                    <Badge variant="brand" uppercase>
                      Level {currentListenQ.level} • {currentListenQ.examTitle}
                    </Badge>
                    <span className="tabular-nums">
                      Audio Task {listenIndex + 1} of {listeningExercises.length}
                    </span>
                  </div>

                  {/* Audio Player Controls */}
                  <Card tone="brand" padding="md" className="text-center">
                    <div className="space-y-3">
                      <div className="w-14 h-14 rounded-pill bg-brand-700 text-white mx-auto flex items-center justify-center">
                        <Headphones className="w-7 h-7" aria-hidden="true" />
                      </div>
                      <h4 className="font-display font-bold text-display-xs text-ink-900">
                        Listen to the Native Dialogue
                      </h4>
                      <p className="text-caption text-ink-700">
                        Play the clip, then choose what you heard. Turtle mode reads it at 0.65x.
                      </p>
                      <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                        <Button size="lg" icon={Volume2} onClick={() => speech?.speak(currentListenQ.audioScript, currentLang)}>
                          Normal Audio (1x)
                        </Button>
                        <Button
                          variant="outline"
                          size="lg"
                          icon={Turtle}
                          onClick={() => speech?.speakSlow(currentListenQ.audioScript, currentLang)}
                        >
                          Turtle Mode (0.65x)
                        </Button>
                      </div>
                    </div>
                  </Card>

                  <p className="font-semibold text-body-lg text-ink-900">{currentListenQ.prompt}</p>

                  <AnswerOptions
                    options={currentListenQ.options}
                    correctIndex={currentListenQ.correctIndex}
                    selectedIndex={listenSelected}
                    answered={listenAnswered}
                    onSelect={handleListenAnswer}
                    label={`Answer options for: ${currentListenQ.prompt}`}
                  />

                  {listenAnswered && (
                    <VerdictPanel
                      tone={listenSelected === currentListenQ.correctIndex ? 'success' : 'error'}
                      onNext={handleListenNext}
                      nextLabel={listenIndex + 1 < listeningExercises.length ? 'Next Audio Clip' : 'Complete Session'}
                    >
                      {currentListenQ.explanation}
                    </VerdictPanel>
                  )}
                </div>
              </Card>
            ) : listenFinished ? (
              /* Session Complete Card */
              <Card padding="lg" className="max-w-md mx-auto text-center">
                <div className="w-16 h-16 rounded-pill bg-brand-50 border border-brand-200 text-brand-700 mx-auto flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
                </div>
                <h2 className="font-display font-bold text-display-sm text-ink-900 mb-2">
                  Ear Training Complete!
                </h2>
                <p className="text-body-sm text-ink-500 mb-2">
                  You scored <span className="font-bold text-brand-700">{listenScore}</span> out of{' '}
                  <span className="font-bold">{listeningExercises.length}</span> audio challenges.
                </p>
                <p className="text-caption text-ink-500 mb-6">
                  Native pronunciation recognition saved to your daily progress!
                </p>
                <Button shape="pill" size="lg" onClick={handleListenReset}>
                  Train Another Set
                </Button>
              </Card>
            ) : (
              /* Empty state */
              <Card padding="lg" tone="quiet" className="text-center">
                <div className="w-14 h-14 rounded-pill bg-surface-200 text-ink-700 mx-auto flex items-center justify-center mb-4">
                  <Headphones className="w-7 h-7" aria-hidden="true" />
                </div>
                <h3 className="font-display font-bold text-display-xs text-ink-900 mb-1">
                  No listening exercises for level {listenLevel}
                </h3>
                <p className="text-body-sm text-ink-500 max-w-sm mx-auto mb-4">
                  Try switching to another level or choosing “All levels”.
                </p>
                <Button variant="outline" shape="pill" size="md" onClick={() => setListenLevel('All')}>
                  Show all levels
                </Button>
              </Card>
            )}
          </div>
        )}

        {/* ── TAB 4: Dedicated Pronunciation Studio ── */}
        {activeTab === 'speaking' && (
          <div
            role="tabpanel"
            id={practiceIds.panelId('speaking')}
            aria-labelledby={practiceIds.tabId('speaking')}
            className="space-y-4"
          >
            {/* Filter Bar */}
            <Card padding="sm" className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-display-xs text-ink-900">
                    Pronunciation & Oral Production Studio
                  </h3>
                  <p className="text-body-sm text-ink-500">
                    Practice speaking authentic phrases aloud with instant browser-native phonetic accuracy evaluation.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="brand" uppercase size="md">
                    {speakingPhrases.length} Phrases
                  </Badge>
                  {masteredCount > 0 && (
                    <Badge variant="success" size="md">
                      {masteredCount} Mastered
                    </Badge>
                  )}
                </div>
              </div>

              {/* Level Filter Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-0.5">
                <span className="text-caption font-semibold uppercase text-ink-500 shrink-0">
                  Level:
                </span>
                {availableLevels.map((lvl) => (
                  <Chip
                    key={lvl}
                    size="sm"
                    selected={speakingLevel === lvl}
                    onClick={() => {
                      setSpeakingLevel(lvl);
                      setSpeakingIndex(0);
                      setSpeakingEvaluation(null);
                      resetSpeechTranscript();
                    }}
                  >
                    {lvl}
                  </Chip>
                ))}
              </div>
            </Card>

            {/* Main Interactive Pronunciation Card */}
            {currentSpeakingPhrase ? (
              <Card padding="lg" className="max-w-2xl mx-auto space-y-6 text-center">
                {/* Header: Progress Counter & Level Badge */}
                <div className="flex items-center justify-between gap-3 text-body-sm text-ink-500 font-medium">
                  <span className="tabular-nums">
                    Phrase {speakingIndex + 1} of {speakingPhrases.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge variant="brand" uppercase size="sm">
                      {currentSpeakingPhrase.level || 'All'}
                    </Badge>
                    {currentSpeakingPhrase.lessonTitle && (
                      <Badge variant="quiet" size="sm" className="hidden sm:inline-flex">
                        {currentSpeakingPhrase.lessonTitle}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Phrase Target Display */}
                <div className="space-y-2 py-2">
                  <p className="font-display font-bold text-display-sm sm:text-display-md text-ink-900 leading-relaxed">
                    {currentSpeakingPhrase.text}
                  </p>
                  {(currentSpeakingPhrase.pronunciation || currentSpeakingPhrase.reading) && (
                    <p className="text-body-md font-mono text-brand-600 font-medium">
                      /{currentSpeakingPhrase.pronunciation || currentSpeakingPhrase.reading}/
                    </p>
                  )}
                  {currentSpeakingPhrase.translation && (
                    <p className="text-body-md text-ink-500">
                      Meaning: <span className="text-ink-700 font-medium">{currentSpeakingPhrase.translation}</span>
                    </p>
                  )}
                </div>

                {/* Native Model Audio Playback */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2 border-t border-ink-100">
                  <span className="text-caption font-semibold text-ink-500 uppercase tracking-wide">
                    Listen to Native Model:
                  </span>
                  <AudioControls text={currentSpeakingPhrase.text} lang={currentLang} speech={speech} />
                </div>

                {/* Recording Controls & Visualizer */}
                <div className="flex flex-col items-center justify-center py-4 space-y-3 bg-surface-50 rounded-card border border-ink-100">
                  <LiveAudioVisualizer isListening={isSpeakingListening} />

                  <MicButton
                    isListening={isSpeakingListening}
                    isProcessing={Boolean(!isSpeakingListening && speakingTranscript && !speakingEvaluation)}
                    onClick={handleToggleSpeaking}
                    disabled={!isSpeechRecognitionSupported}
                    size="lg"
                  />

                  <p className="text-body-sm font-medium text-ink-700">
                    {!isSpeechRecognitionSupported
                      ? 'Speech recognition is not supported in this browser'
                      : isSpeakingListening
                      ? 'Listening... tap again or pause to finish'
                      : speakingEvaluation
                      ? 'Speech evaluated! Review your score below'
                      : 'Tap microphone and speak clearly'}
                  </p>

                  {/* Live Streaming Transcript */}
                  {(isSpeakingListening || (!speakingEvaluation && speakingTranscript)) && (
                    <div
                      className="bg-brand-50 border border-brand-200 rounded-card px-4 py-2 text-body-sm text-brand-900 italic max-w-md w-full"
                      role="status"
                      aria-live="polite"
                    >
                      &ldquo;{speakingInterimTranscript || speakingTranscript || 'Listening...'}&rdquo;
                    </div>
                  )}

                  {/* Speech Recognition Errors */}
                  {speechRecognitionError && (
                    <div className="bg-error-bg border border-error-border rounded-card px-4 py-2 text-body-sm text-error max-w-md w-full">
                      {speechRecognitionError === 'not-allowed'
                        ? 'Microphone access denied. Please grant microphone permission in your browser.'
                        : speechRecognitionError === 'no-speech'
                        ? 'No speech detected. Please speak closer to your microphone.'
                        : `Speech error: ${speechRecognitionError}. Please try again.`}
                    </div>
                  )}
                </div>

                {/* Evaluation Feedback */}
                {speakingEvaluation && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 pt-2"
                  >
                    <PronunciationFeedback
                      evaluation={speakingEvaluation}
                      targetText={currentSpeakingPhrase.text}
                      langCode={currentLang}
                      speech={speech}
                    />
                  </motion.div>
                )}

                {/* Bottom Navigation CTAs */}
                <div className="flex items-center justify-between gap-3 pt-4 border-t border-ink-100">
                  <Button
                    variant="outline"
                    shape="pill"
                    size="md"
                    icon={ArrowLeft}
                    onClick={handlePrevSpeakingPhrase}
                    disabled={speakingPhrases.length <= 1}
                  >
                    Previous
                  </Button>

                  <div className="flex items-center gap-2">
                    {speakingEvaluation && (
                      <Button
                        variant="outline"
                        shape="pill"
                        size="md"
                        icon={RotateCw}
                        onClick={() => {
                          setSpeakingEvaluation(null);
                          resetSpeechTranscript();
                        }}
                      >
                        Try Again
                      </Button>
                    )}

                    <Button
                      variant="primary"
                      shape="pill"
                      size="md"
                      icon={ArrowRight}
                      iconPosition="right"
                      onClick={handleNextSpeakingPhrase}
                    >
                      Next Phrase
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card padding="lg" tone="quiet" className="text-center">
                <div className="w-14 h-14 rounded-pill bg-surface-200 text-ink-700 mx-auto flex items-center justify-center mb-4">
                  <Mic className="w-7 h-7" aria-hidden="true" />
                </div>
                <h3 className="font-display font-bold text-display-xs text-ink-900 mb-1">
                  No phrases for level {speakingLevel}
                </h3>
                <p className="text-body-sm text-ink-500 max-w-sm mx-auto mb-4">
                  Try switching to another level or choosing “All levels”.
                </p>
                <Button variant="outline" shape="pill" size="md" onClick={() => setSpeakingLevel('All')}>
                  Show all levels
                </Button>
              </Card>
            )}
          </div>
        )}

        {/* ── TAB 5: Searchable Vocabulary Library ── */}
        {activeTab === 'words' && (
          <div
            role="tabpanel"
            id={practiceIds.panelId('words')}
            aria-labelledby={practiceIds.tabId('words')}
            className="space-y-4"
          >
            <Card padding="sm" className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                <Input
                  srOnlyLabel="Search the vocabulary library"
                  type="search"
                  icon={Search}
                  placeholder="Search word, translation, kanji..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  size="md"
                  className="max-w-md flex-1"
                />

                <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter vocabulary by level">
                  <span className="text-overline uppercase text-ink-700 mr-1">Level</span>
                  {availableLevels.map((lvl) => (
                    <Chip
                      key={lvl}
                      size="sm"
                      tone="card"
                      selected={libraryLevel === lvl}
                      onClick={() => setLibraryLevel(lvl)}
                    >
                      {lvl === 'All' ? 'All' : lvl}
                    </Chip>
                  ))}
                </div>
              </div>

              {availableCategories.length > 2 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-ink-100" role="group" aria-label="Filter vocabulary by category">
                  <span className="text-overline uppercase text-ink-700 mr-1">Category</span>
                  {availableCategories.map((cat) => (
                    <Chip
                      key={cat}
                      size="sm"
                      tone="quiet"
                      selected={libraryCategory === cat}
                      onClick={() => setLibraryCategory(cat)}
                    >
                      {cat === 'All' ? 'All categories' : cat}
                    </Chip>
                  ))}
                </div>
              )}
            </Card>

            <p className="text-body-sm text-ink-500" role="status" aria-live="polite">
              Showing <span className="tabular-nums font-semibold text-ink-700">{filteredWords.length}</span> of{' '}
              <span className="tabular-nums font-semibold text-ink-700">{allVocabWords.length}</span> words
              {searchQuery.trim() ? ` matching “${searchQuery.trim()}”` : ''}
              {libraryLevel !== 'All' ? ` at level ${libraryLevel}` : ''}
              {libraryCategory !== 'All' ? ` in ${libraryCategory}` : ''}.
            </p>

            {filteredWords.length === 0 ? (
              <Card padding="lg" tone="quiet" className="text-center">
                <div className="w-14 h-14 rounded-pill bg-surface-200 text-ink-700 mx-auto flex items-center justify-center mb-4">
                  <Search className="w-7 h-7" aria-hidden="true" />
                </div>
                <h3 className="font-display font-bold text-display-xs text-ink-900 mb-1">
                  No matching words found
                </h3>
                <p className="text-body-sm text-ink-500 mb-4">
                  Try adjusting your search query, level badge, or category filter.
                </p>
                <Button
                  variant="outline"
                  shape="pill"
                  size="md"
                  onClick={() => {
                    setSearchQuery('');
                    setLibraryLevel('All');
                    setLibraryCategory('All');
                  }}
                >
                  Reset filters
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {filteredWords.map((item) => {
                  const srsRecord = progress.wordProgress?.[item.id];
                  const isMastered = srsRecord && srsRecord.repetitions >= 3;

                  return (
                    <Card key={item.id} padding="sm" className="flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <Badge variant="outline">{item.level}</Badge>
                            {item.category && item.category !== 'general' && (
                              <Badge variant="quiet">{item.category}</Badge>
                            )}
                          </div>
                          <AudioControls
                            text={item.word}
                            lang={currentLang}
                            speech={speech}
                          />
                        </div>

                        <h3 className="font-display font-bold text-display-xs text-ink-900 mb-0.5">
                          {item.word}
                        </h3>
                        {item.reading && item.reading !== item.word && (
                          <p className="text-caption text-ink-700 font-medium mb-1">{item.reading}</p>
                        )}
                        {item.pronunciation && (
                          <p className="text-body-sm text-ink-500 mb-2">/{item.pronunciation}/</p>
                        )}
                        <p className="text-body-md font-medium text-brand-800">{item.translation}</p>
                        {item.example && (
                          <p className="text-caption text-ink-700 italic mt-2 line-clamp-2" title={item.example}>
                            “{item.example}”
                          </p>
                        )}
                        <p className="text-caption text-ink-400 mt-2">
                          from {item.lessonTitle}
                        </p>
                      </div>

                      <div className="mt-3 pt-3 border-t border-ink-200 flex items-center justify-between gap-2 text-caption text-ink-700">
                        <span>
                          {srsRecord
                            ? `Repetitions: ${srsRecord.repetitions}`
                            : 'New word'}
                        </span>
                        {isMastered && (
                          <Badge variant="success" icon={Check}>
                            Mastered
                          </Badge>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
