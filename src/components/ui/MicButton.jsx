/**
 * @file MicButton.jsx
 * @description Dedicated, accessible microphone recording toggle button meeting
 * WCAG 2.1 §2.5.5 touch target standards (56x56px circular button with 44px+ hit area).
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Loader2 } from 'lucide-react';

/**
 * @param {object} props
 * @param {boolean} [props.isListening=false]
 * @param {boolean} [props.isProcessing=false]
 * @param {() => void} props.onClick
 * @param {boolean} [props.disabled=false]
 * @param {string} [props.label]
 * @param {string} [props.className]
 * @returns {JSX.Element}
 */
export default function MicButton({
  isListening = false,
  isProcessing = false,
  onClick,
  disabled = false,
  label,
  className = '',
}) {
  const ariaLabel =
    label ||
    (isProcessing
      ? 'Evaluating pronunciation'
      : isListening
      ? 'Stop recording speech'
      : 'Start speaking into microphone');

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* Animated pulsing ripple ring when listening */}
      {isListening && (
        <motion.span
          className="absolute inset-0 rounded-pill bg-danger-500 pointer-events-none"
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 1.35, opacity: 0 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeOut',
          }}
          aria-hidden="true"
        />
      )}

      <button
        type="button"
        disabled={disabled || isProcessing}
        onClick={onClick}
        aria-label={ariaLabel}
        aria-pressed={isListening}
        className={`relative z-10 inline-flex items-center justify-center w-14 h-14 rounded-pill transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 select-none shadow-card ${
          disabled
            ? 'bg-surface-200 text-ink-300 cursor-not-allowed shadow-none'
            : isListening
            ? 'bg-danger-600 hover:bg-danger-700 text-white focus-visible:ring-danger-500 scale-105'
            : isProcessing
            ? 'bg-brand-600 text-white cursor-wait'
            : 'bg-brand-600 hover:bg-brand-700 text-white hover:scale-105 active:scale-95 focus-visible:ring-brand-500'
        }`}
      >
        {isProcessing ? (
          <Loader2 className="w-6 h-6 animate-spin" aria-hidden="true" />
        ) : isListening ? (
          <MicOff className="w-6 h-6" aria-hidden="true" />
        ) : (
          <Mic className="w-6 h-6" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
