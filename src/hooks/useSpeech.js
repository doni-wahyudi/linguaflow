/**
 * @module useSpeech
 * @description Provides text-to-speech playback via the Web Speech API.
 *
 * The hook detects browser support on mount and exposes a simple
 * `speak(text, lang)` interface. Language codes are mapped to full BCP 47
 * tags so the browser can select an appropriate voice.
 */

import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * Map short language codes to BCP 47 tags used by SpeechSynthesis.
 * Extend this object when new languages are added to LinguaFlow.
 * @type {Record<string, string>}
 */
const LANG_MAP = {
  es: 'es-ES', // Spanish (Spain)
  ja: 'ja-JP', // Japanese
  fr: 'fr-FR', // French (France)
  de: 'de-DE', // German (Germany)
  en: 'en-US', // English (fallback)
};

/**
 * Hook return type.
 * @typedef {Object} SpeechHook
 * @property {Function} speak       — speak(text, lang)
 * @property {Function} stop        — cancel current utterance
 * @property {boolean}  isSpeaking  — whether audio is currently playing
 * @property {boolean}  isSupported — whether the browser supports speech synthesis
 */

/**
 * Text-to-speech hook.
 *
 * @returns {SpeechHook}
 */
const useSpeech = () => {
  // Detect support once on mount
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);

  // We keep a ref to the current utterance so `stop()` can cancel it
  const utteranceRef = useRef(null);

  useEffect(() => {
    // `window.speechSynthesis` may exist but voices load asynchronously.
    // We consider it "supported" if the API object itself is present.
    const supported =
      typeof window !== 'undefined' && 'speechSynthesis' in window;
    setIsSupported(supported);

    if (supported) {
      const loadVoices = () => {
        try {
          const list = window.speechSynthesis.getVoices() || [];
          if (list.length > 0) {
            setVoices(list);
          }
        } catch {
          // ignore
        }
      };

      loadVoices();

      if (typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
      window.speechSynthesis.addEventListener?.('voiceschanged', loadVoices);

      return () => {
        if (typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
          window.speechSynthesis.onvoiceschanged = null;
        }
        window.speechSynthesis.removeEventListener?.('voiceschanged', loadVoices);
      };
    }
  }, []);

  /**
   * Speak the given text in the specified language.
   *
   * @param {string} text — text to read aloud
   * @param {string} [lang='en'] — short language code (es, ja, fr, de, en)
   * @param {number} [rate=0.9] — playback rate (0.6 for slow, 0.9 for normal)
   */
  const speak = useCallback(
    (text, lang = 'en', rate = 0.9) => {
      if (!isSupported || !text) return;

      // Cancel any in-progress speech first
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = LANG_MAP[lang] || lang; // fallback to raw code
      utterance.rate = rate;
      utterance.pitch = 1;

      // Try to find a voice that matches the requested language
      const voiceList = voices.length > 0 ? voices : (window.speechSynthesis.getVoices?.() || []);
      const targetLang = LANG_MAP[lang] || lang;
      const matchingVoice = voiceList.find((v) =>
        v.lang && (
          v.lang.replace('_', '-').toLowerCase().startsWith(targetLang.toLowerCase()) ||
          v.lang.toLowerCase().startsWith(lang.toLowerCase())
        )
      );
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }

      // Track speaking state
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [isSupported, voices]
  );

  /**
   * Play speech in slow "turtle mode" (0.65x rate) for pronunciation clarity.
   */
  const speakSlow = useCallback(
    (text, lang = 'en') => {
      speak(text, lang, 0.65);
    },
    [speak]
  );

  /**
   * Stop any currently playing speech.
   */
  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [isSupported]);

  // Clean up on unmount — stop speech if component is removed
  useEffect(() => {
    return () => {
      if (isSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSupported]);

  return { speak, speakSlow, stop, isSpeaking, isSupported };
};

export default useSpeech;
