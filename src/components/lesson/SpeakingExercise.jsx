/**
 * @file SpeakingExercise.jsx
 * @description Oral production exercise with browser-native Web Speech recognition,
 * real-time audio visualization, Levenshtein pronunciation evaluation, and universal
 * fallbacks ("Type instead" and "Can't speak right now").
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, Mic, RotateCcw, ArrowRight, Volume2, CheckCircle2 } from 'lucide-react';
import { transitionEase } from '../../utils/motion';
import { Badge, Card, Button, Input, MicButton, LiveAudioVisualizer, AudioControls } from '../ui';
import PronunciationFeedback from './PronunciationFeedback';
import useSpeechRecognition from '../../hooks/useSpeechRecognition';
import useSpeech from '../../hooks/useSpeech';
import { useUser } from '../../context/UserContext';
import { scorePronunciation, cleanForComparison, levenshteinSimilarity } from '../../utils/pronunciationScorer';

/**
 * @param {object} props
 * @param {object} props.exercise - Exercise schema with targetText, translation, pronunciation, prompt
 * @param {string} [props.langCode='es'] - Current language code (es, ja, fr, de)
 * @param {Function} props.onAnswer - Called with boolean (isCorrect)
 * @param {boolean} [props.disabled=false] - Whether exercise has been completed
 */
export default function SpeakingExercise({
  exercise,
  langCode = 'es',
  onAnswer,
  disabled = false,
}) {
  const targetText = exercise?.targetText || exercise?.sentence || exercise?.word || '';
  const translation = exercise?.translation || '';
  const phonetic = exercise?.pronunciation || exercise?.reading || '';
  const prompt = exercise?.prompt || 'Speak this sentence aloud';

  // Speech synthesis for native model audio
  let userSpeech = null;
  try {
    const userCtx = useUser();
    userSpeech = userCtx?.speech;
  } catch {
    // Fallback if tested outside UserProvider
  }
  const hookSpeech = useSpeech();
  const speech = userSpeech || hookSpeech;

  // Speech recognition hook
  const {
    isListening,
    transcript,
    interimTranscript,
    error: speechError,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  // Component states
  const [mode, setMode] = useState(isSupported ? 'voice' : 'type'); // 'voice' | 'type'
  const [typedInput, setTypedInput] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // If browser doesn't support Web Speech recognition, default to typing mode
  useEffect(() => {
    if (!isSupported) {
      setMode('type');
    }
  }, [isSupported]);

  // Handle evaluation when speech transcript updates
  useEffect(() => {
    if (transcript && !isListening) {
      const result = scorePronunciation(targetText, transcript, langCode, {
        reading: exercise?.reading,
      });
      setEvaluation(result);
    }
  }, [transcript, isListening, targetText, langCode, exercise?.reading]);

  // Toggle voice recording
  const handleToggleListening = useCallback(() => {
    if (disabled || hasSubmitted) return;

    if (isListening) {
      stopListening();
    } else {
      setEvaluation(null);
      resetTranscript();
      startListening({ lang: langCode });
    }
  }, [disabled, hasSubmitted, isListening, stopListening, resetTranscript, startListening, langCode]);

  // Reset attempt for another try
  const handleTryAgain = () => {
    setEvaluation(null);
    resetTranscript();
  };

  // Submit passing speech evaluation
  const handleConfirmSpeech = () => {
    if (disabled || hasSubmitted || !evaluation) return;
    setHasSubmitted(true);
    onAnswer?.(evaluation.passed);
  };

  // Submit typed fallback answer
  const handleTypedSubmit = (e) => {
    e?.preventDefault();
    if (disabled || hasSubmitted || !typedInput.trim()) return;

    const normInput = cleanForComparison(typedInput, langCode);
    const normTarget = cleanForComparison(targetText, langCode);

    // Exact or forgiving threshold (>= 0.70 similarity)
    const similarity = levenshteinSimilarity(normInput, normTarget);
    const isCorrect = normInput === normTarget || similarity >= 0.7;

    setHasSubmitted(true);
    onAnswer?.(isCorrect);
  };

  // "Can't speak right now" bypass handler
  const handleSkipSpeaking = () => {
    if (disabled || hasSubmitted) return;
    setHasSubmitted(true);
    // Grants credit and bypasses speaking task for accessibility
    onAnswer?.(true);
  };

  return (
    <div className="max-w-xl mx-auto w-full text-center space-y-6">
      {/* Exercise Header */}
      <div>
        <Badge variant="brand" uppercase size="md" className="mb-2">
          Speaking Practice
        </Badge>
        <h2 className="font-display font-bold text-display-xs sm:text-display-sm text-ink-900">
          {prompt}
        </h2>
      </div>

      {/* Target Phrase Display Card */}
      <Card padding="md" className="relative space-y-3 shadow-soft-sm">
        <div className="flex flex-col items-center justify-center space-y-1">
          <p className="font-display font-bold text-display-sm sm:text-display-md text-ink-900 leading-relaxed">
            {targetText}
          </p>
          {phonetic && (
            <p className="text-body-sm sm:text-body-md font-mono text-brand-600 font-medium">
              /{phonetic}/
            </p>
          )}
          {translation && (
            <p className="text-body-sm text-ink-500 pt-1">
              Meaning: <span className="text-ink-700 font-medium">{translation}</span>
            </p>
          )}
        </div>

        {/* Audio Model Playback Controls */}
        <div className="flex items-center justify-center gap-2 pt-2 border-t border-ink-100">
          <span className="text-caption font-semibold text-ink-500 uppercase tracking-wide">
            Native Model:
          </span>
          <AudioControls text={targetText} lang={langCode} speech={speech} />
        </div>
      </Card>

      {/* Main Interaction Area: Voice vs Typing Mode */}
      <AnimatePresence mode="wait">
        {mode === 'voice' ? (
          <motion.div
            key="voice-mode"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: transitionEase }}
            className="space-y-4"
          >
            {/* Visualizer & Mic Button */}
            <div className="flex flex-col items-center justify-center py-2 space-y-4">
              <LiveAudioVisualizer isListening={isListening} />

              <MicButton
                isListening={isListening}
                isProcessing={Boolean(!isListening && transcript && !evaluation)}
                onClick={handleToggleListening}
                disabled={disabled || hasSubmitted}
                size="lg"
              />

              <p className="text-body-sm font-medium text-ink-700">
                {isListening
                  ? 'Listening... tap again when finished'
                  : evaluation
                  ? 'Speech recorded!'
                  : 'Tap microphone and speak clearly'}
              </p>

              {/* Live Streaming Transcript */}
              {(isListening || (!evaluation && transcript)) && (
                <div
                  className="bg-brand-50 border border-brand-200 rounded-card px-4 py-2 text-body-sm text-brand-900 italic max-w-md w-full"
                  role="status"
                  aria-live="polite"
                >
                  &ldquo;{interimTranscript || transcript || 'Listening...'}&rdquo;
                </div>
              )}

              {/* Error alerts */}
              {speechError && (
                <div className="bg-error-bg border border-error-border rounded-card px-4 py-2 text-body-sm text-error max-w-md w-full">
                  {speechError === 'not-allowed'
                    ? 'Microphone permission was denied. Please allow mic access or use "Type instead".'
                    : speechError === 'no-speech'
                    ? 'No speech detected. Please speak closer to your microphone and try again.'
                    : `Speech error (${speechError}). You can try again or use typing.`}
                </div>
              )}
            </div>

            {/* Pronunciation Evaluation Results */}
            {evaluation && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <PronunciationFeedback
                  evaluation={evaluation}
                  targetText={targetText}
                  langCode={langCode}
                  speech={speech}
                />

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <Button
                    variant="outline"
                    size="md"
                    icon={RotateCcw}
                    onClick={handleTryAgain}
                    disabled={disabled || hasSubmitted}
                  >
                    Try Again
                  </Button>

                  <Button
                    variant={evaluation.passed ? 'primary' : 'secondary'}
                    size="md"
                    icon={evaluation.passed ? CheckCircle2 : ArrowRight}
                    onClick={handleConfirmSpeech}
                    disabled={disabled || hasSubmitted}
                  >
                    {evaluation.passed ? 'Submit Pronunciation' : 'Continue Anyway'}
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="type-mode"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: transitionEase }}
          >
            <Card padding="md" className="space-y-4 text-left">
              <form onSubmit={handleTypedSubmit} className="space-y-4">
                <Input
                  label="Type what you would say in the target language"
                  value={typedInput}
                  onChange={(e) => setTypedInput(e.target.value)}
                  placeholder={`Type "${targetText}"...`}
                  disabled={disabled || hasSubmitted}
                  autoFocus
                  required
                />
                <div className="flex items-center justify-end gap-3">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={disabled || hasSubmitted || !typedInput.trim()}
                  >
                    Check Answer
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Accessibility & Environment Fallback Controls */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-ink-500">
        {isSupported && (
          <button
            type="button"
            onClick={() => {
              setMode((m) => (m === 'voice' ? 'type' : 'voice'));
              setEvaluation(null);
              resetTranscript();
            }}
            disabled={disabled || hasSubmitted}
            className="inline-flex items-center gap-1.5 text-body-sm font-medium text-brand-600 hover:text-brand-700 underline underline-offset-2 transition-colors disabled:opacity-50"
          >
            {mode === 'voice' ? (
              <>
                <Keyboard className="w-4 h-4" aria-hidden="true" />
                <span>Type instead</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" aria-hidden="true" />
                <span>Switch to voice</span>
              </>
            )}
          </button>
        )}

        <span className="text-ink-300" aria-hidden="true">•</span>

        <button
          type="button"
          onClick={handleSkipSpeaking}
          disabled={disabled || hasSubmitted}
          className="inline-flex items-center gap-1.5 text-body-sm font-medium text-ink-500 hover:text-ink-700 underline underline-offset-2 transition-colors disabled:opacity-50"
        >
          Can&apos;t speak right now
        </button>
      </div>
    </div>
  );
}
