/**
 * @module useSpeechRecognition
 * @description Provides speech-to-text recognition via browser-native Web Speech API.
 * Supports continuous streaming, interim partial results, language tag mapping (BCP 47),
 * auto-stop on silence, and safe error handling for denied mic or unsupported browsers.
 */

import { useState, useEffect, useRef, useCallback } from 'react';

const LANG_MAP = {
  es: 'es-ES',
  ja: 'ja-JP',
  fr: 'fr-FR',
  de: 'de-DE',
  en: 'en-US',
};

/**
 * Hook for speech recognition in modern browsers.
 *
 * @returns {{
 *   isListening: boolean,
 *   transcript: string,
 *   interimTranscript: string,
 *   error: string | null,
 *   isSupported: boolean,
 *   startListening: (options?: { lang?: string }) => void,
 *   stopListening: () => void,
 *   resetTranscript: () => void
 * }}
 */
export default function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState(null);
  const [isSupported, setIsSupported] = useState(false);

  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      typeof window !== 'undefined' &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);
    setIsSupported(Boolean(SpeechRecognition));
  }, []);

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  const stopListening = useCallback(() => {
    clearSilenceTimer();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore if already stopped
      }
    }
    setIsListening(false);
  }, [clearSilenceTimer]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setError(null);
  }, []);

  const startListening = useCallback(
    (options = {}) => {
      setError(null);
      setTranscript('');
      setInterimTranscript('');
      clearSilenceTimer();

      const SpeechRecognition =
        typeof window !== 'undefined' &&
        (window.SpeechRecognition || window.webkitSpeechRecognition);

      if (!SpeechRecognition) {
        setError('unsupported');
        return;
      }

      // If already running, abort first
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      const langCode = options.lang || 'en';
      recognition.lang = LANG_MAP[langCode] || langCode;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        // Initial silence timeout if user never speaks: 8 seconds
        clearSilenceTimer();
        silenceTimerRef.current = setTimeout(() => {
          stopListening();
        }, 8000);
      };

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let currentInterim = '';

        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript + ' ';
          } else {
            currentInterim += result[0].transcript;
          }
        }

        const trimmedFinal = finalTranscript.trim();
        if (trimmedFinal) {
          setTranscript(trimmedFinal);
        }
        setInterimTranscript(currentInterim.trim());

        // Once speech is detected, set a 2.5s silence timeout to auto-complete
        clearSilenceTimer();
        silenceTimerRef.current = setTimeout(() => {
          stopListening();
        }, 2500);
      };

      recognition.onerror = (event) => {
        clearSilenceTimer();
        setIsListening(false);
        // Common error codes: 'not-allowed', 'no-speech', 'audio-capture', 'network'
        if (event.error === 'not-allowed') {
          setError('not-allowed');
        } else if (event.error === 'no-speech') {
          setError('no-speech');
        } else {
          setError(event.error || 'unknown');
        }
      };

      recognition.onend = () => {
        clearSilenceTimer();
        setIsListening(false);
      };

      try {
        recognition.start();
      } catch (err) {
        setError('start-failed');
        setIsListening(false);
      }
    },
    [clearSilenceTimer, stopListening]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearSilenceTimer();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, [clearSilenceTimer]);

  return {
    isListening,
    transcript,
    interimTranscript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  };
}
