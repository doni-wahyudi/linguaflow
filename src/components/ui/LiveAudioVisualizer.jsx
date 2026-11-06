/**
 * @file LiveAudioVisualizer.jsx
 * @description Lightweight 5-bar live soundwave visualizer that confirms microphone
 * activity and volume dynamics to the learner while speaking.
 */

import React from 'react';
import { motion } from 'framer-motion';

/**
 * @param {object} props
 * @param {boolean} [props.isListening=false]
 * @param {string} [props.className]
 * @returns {JSX.Element}
 */
export default function LiveAudioVisualizer({ isListening = false, className = '' }) {
  const bars = [0.4, 0.8, 1.0, 0.7, 0.5];

  if (!isListening) {
    return (
      <div
        className={`flex items-center justify-center gap-1 h-8 opacity-40 ${className}`}
        aria-hidden="true"
      >
        {bars.map((_, i) => (
          <span
            key={i}
            className="w-1.5 h-2 bg-ink-300 rounded-pill transition-all"
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center gap-1.5 h-8 ${className}`}
      aria-label="Microphone audio active"
      role="status"
    >
      {bars.map((initialScale, i) => (
        <motion.span
          key={i}
          className="w-1.5 rounded-pill bg-brand-600"
          initial={{ height: 8 }}
          animate={{
            height: [8, 12 + initialScale * 18, 6, 16 + initialScale * 14, 8],
          }}
          transition={{
            duration: 0.8 + i * 0.15,
            repeat: Infinity,
            ease: 'easeInOut',
            repeatType: 'mirror',
          }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
