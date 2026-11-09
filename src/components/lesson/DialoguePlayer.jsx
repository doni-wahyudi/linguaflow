/**
 * @file DialoguePlayer.jsx
 * @description Interactive multi-turn conversational roleplay exercise component.
 * Features animated chat bubble progressions, contextual response selection, audio playback,
 * and reading assistance (Furigana / Romaji).
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Volume2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  User,
  Bot,
} from 'lucide-react';
import { Badge, Button, Card, FuriganaText } from '../ui';
import { useUser } from '../../context/UserContext';
import { playClick, playCorrect, playIncorrect } from '../../utils/soundEffects';
import { transitionEase } from '../../utils/motion';

export default function DialoguePlayer({
  exercise,
  langCode = 'es',
  onAnswer,
  disabled = false,
  showFurigana = true,
  showRomaji = false,
}) {
  const { speech } = useUser();
  const {
    scenario = 'Conversational Dialogue',
    context: scenarioContext = '',
    turns = [],
  } = exercise || {};

  const [currentTurnIdx, setCurrentTurnIdx] = useState(0);
  const [history, setHistory] = useState([]);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState(null);
  const [optionFeedback, setOptionFeedback] = useState(null);
  const [hadMistake, setHadMistake] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const scrollRef = useRef(null);

  // Initialize dialogue with the first turn(s)
  useEffect(() => {
    if (!turns || turns.length === 0) return;

    // Reset state
    setCurrentTurnIdx(0);
    setSelectedOptionIdx(null);
    setOptionFeedback(null);
    setHadMistake(false);
    setIsDone(false);

    // If first turn is partner/bot, add it to history
    if (!turns[0].isUser) {
      setHistory([
        {
          ...turns[0],
          id: 'turn-0',
        },
      ]);
      // Speak first turn text
      if (speech?.speak && turns[0].text) {
        speech.speak(turns[0].text, langCode);
      }
    } else {
      setHistory([]);
    }
  }, [turns, langCode]);

  // Scroll to bottom of chat thread when history updates
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, optionFeedback]);

  // Current turn being played
  // If first turn was partner and history has it, current interactive turn is index 1
  const activeTurnIdx = history.length === 0 ? 0 : history.length;
  const currentTurn = turns[activeTurnIdx];

  // Play audio for a speech bubble
  const handlePlayAudio = (text) => {
    if (speech?.speak && text) {
      playClick();
      speech.speak(text, langCode);
    }
  };

  // User selects an option
  const handleOptionSelect = (option, idx) => {
    if (isDone || disabled || selectedOptionIdx !== null) return;
    playClick();
    setSelectedOptionIdx(idx);

    if (option.isCorrect) {
      playCorrect();
      setOptionFeedback({
        isCorrect: true,
        text: option.feedback || 'Great choice! Natural and polite.',
      });

      // Add user turn to history after short pause
      setTimeout(() => {
        const userBubble = {
          speaker: currentTurn.speaker || 'You',
          isUser: true,
          text: option.text,
          translation: option.translation || '',
          id: `turn-user-${activeTurnIdx}`,
        };

        const nextIdx = activeTurnIdx + 1;
        const nextTurn = turns[nextIdx];

        if (nextTurn && !nextTurn.isUser) {
          // Partner replies
          const partnerBubble = {
            ...nextTurn,
            id: `turn-partner-${nextIdx}`,
          };
          setHistory((prev) => [...prev, userBubble, partnerBubble]);
          setSelectedOptionIdx(null);
          setOptionFeedback(null);

          // Audio playback for partner reply
          if (speech?.speak && nextTurn.text) {
            setTimeout(() => {
              speech.speak(nextTurn.text, langCode);
            }, 300);
          }

          // Check if dialogue is complete after partner reply
          if (nextIdx + 1 >= turns.length) {
            setIsDone(true);
            if (onAnswer) {
              onAnswer(!hadMistake);
            }
          }
        } else if (nextIdx >= turns.length) {
          // Conversation ends on user turn
          setHistory((prev) => [...prev, userBubble]);
          setSelectedOptionIdx(null);
          setOptionFeedback(null);
          setIsDone(true);
          if (onAnswer) {
            onAnswer(!hadMistake);
          }
        } else {
          // Another user turn follows
          setHistory((prev) => [...prev, userBubble]);
          setSelectedOptionIdx(null);
          setOptionFeedback(null);
        }
      }, 700);
    } else {
      playIncorrect();
      setHadMistake(true);
      setOptionFeedback({
        isCorrect: false,
        text: option.feedback || 'Not quite appropriate for this situation. Try another option!',
      });
      // Allow retry after 1.2s
      setTimeout(() => {
        setSelectedOptionIdx(null);
      }, 1200);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full">
      {/* Header Scenario Badge */}
      <div className="text-center mb-6">
        <Badge variant="brand" uppercase size="md" className="mb-2">
          Roleplay Dialogue
        </Badge>
        <h2 className="font-display font-bold text-display-sm text-ink-900 mb-1">
          {scenario}
        </h2>
        {scenarioContext && (
          <p className="text-body-sm text-ink-600 max-w-lg mx-auto">
            {scenarioContext}
          </p>
        )}
      </div>

      {/* Conversation Thread Box */}
      <div
        ref={scrollRef}
        className="bg-surface-card rounded-card border border-ink-200 p-4 sm:p-5 mb-6 max-h-[380px] overflow-y-auto space-y-4 shadow-soft-xs"
        role="log"
        aria-label="Conversation dialogue history"
      >
        {history.map((turn, i) => {
          const isUser = turn.isUser;
          return (
            <motion.div
              key={turn.id || i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: transitionEase }}
              className={`flex items-start gap-2.5 sm:gap-3 ${
                isUser ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar Icon */}
              <div
                className={`w-8 h-8 rounded-pill flex items-center justify-center shrink-0 text-caption font-bold shadow-soft-xs ${
                  isUser
                    ? 'bg-brand-500 text-white'
                    : 'bg-surface-bg border border-ink-300 text-ink-700'
                }`}
                aria-hidden="true"
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Chat Bubble */}
              <div
                className={`max-w-[82%] sm:max-w-[75%] rounded-2xl p-3.5 ${
                  isUser
                    ? 'bg-brand-50 border border-brand-200 text-ink-900 rounded-tr-none'
                    : 'bg-surface-bg border border-ink-200 text-ink-900 rounded-tl-none'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-1">
                  <span className="text-caption font-semibold text-ink-500">
                    {turn.speaker}
                  </span>
                  {!isUser && turn.text && (
                    <button
                      type="button"
                      onClick={() => handlePlayAudio(turn.text)}
                      className="p-1 text-brand-600 hover:text-brand-800 rounded-pill hover:bg-brand-100 transition-colors"
                      title="Play audio"
                      aria-label={`Listen to ${turn.speaker}`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Bubble Text with optional Furigana */}
                <div className="text-body-md font-medium leading-relaxed">
                  {langCode === 'ja' && (turn.furigana || turn.text.includes('[')) ? (
                    <FuriganaText
                      text={turn.text}
                      furigana={turn.furigana}
                      reading={turn.reading}
                      romaji={turn.romaji}
                      showFurigana={showFurigana}
                      showRomaji={showRomaji}
                    />
                  ) : (
                    turn.text
                  )}
                </div>

                {/* English Translation */}
                {turn.translation && (
                  <p className="text-caption text-ink-500 mt-1 italic">
                    "{turn.translation}"
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}

        {/* Finished Badge */}
        {isDone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-2"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-success-bg border border-success-border text-success-strong text-caption font-bold rounded-pill">
              <CheckCircle2 className="w-3.5 h-3.5" /> Dialogue Completed!
            </span>
          </motion.div>
        )}
      </div>

      {/* Interactive Turn Prompt & Option Cards */}
      {!isDone && currentTurn && currentTurn.isUser && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2 px-1">
            <span className="w-2 h-2 rounded-pill bg-brand-500 animate-pulse" />
            <span className="text-caption font-bold uppercase tracking-wider text-brand-700">
              Your Turn: {currentTurn.prompt || 'Choose your response'}
            </span>
          </div>

          <div
            className="grid grid-cols-1 gap-2.5"
            role="group"
            aria-label="Dialogue response options"
          >
            {currentTurn.options?.map((opt, idx) => {
              const isSelected = selectedOptionIdx === idx;
              let btnClass =
                'border-2 border-ink-200 bg-surface-card text-ink-900 hover:border-brand-500 hover:bg-brand-50';

              if (isSelected) {
                if (opt.isCorrect) {
                  btnClass =
                    'border-2 border-success bg-success-bg text-success-strong shadow-soft-sm';
                } else {
                  btnClass =
                    'border-2 border-error bg-error-bg text-error-strong shadow-soft-sm';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleOptionSelect(opt, idx)}
                  disabled={selectedOptionIdx !== null || disabled}
                  className={`w-full text-left p-3.5 rounded-card transition-all flex items-start justify-between gap-3 ${btnClass}`}
                >
                  <div>
                    <p className="font-medium text-body-md">
                      {langCode === 'ja' && opt.text.includes('[') ? (
                        <FuriganaText
                          text={opt.text}
                          showFurigana={showFurigana}
                          showRomaji={showRomaji}
                        />
                      ) : (
                        opt.text
                      )}
                    </p>
                    {opt.translation && (
                      <p className="text-caption text-ink-500 mt-0.5">
                        {opt.translation}
                      </p>
                    )}
                  </div>
                  {isSelected && opt.isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                  )}
                  {isSelected && !opt.isCorrect && (
                    <AlertCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback banner */}
          <AnimatePresence>
            {optionFeedback && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`p-3 rounded-card text-body-sm font-medium border ${
                  optionFeedback.isCorrect
                    ? 'bg-success-bg border-success-border text-success-strong'
                    : 'bg-error-bg border-error-border text-error-strong'
                }`}
              >
                {optionFeedback.text}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
