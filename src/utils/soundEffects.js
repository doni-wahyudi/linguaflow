/**
 * @file soundEffects.js
 * @description Zero-dependency Web Audio API sound synthesizer for interactive tactile feedback.
 * Generates procedural chimes, error boops, clicks, and celebratory fanfares.
 * Completely offline, zero asset downloads, 0ms latency.
 */

// Global AudioContext singleton
let audioCtx = null;

const getAudioContext = () => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

// Mute preference cached from localStorage
let soundEnabled = true;
try {
  const saved = localStorage.getItem('sound_enabled');
  if (saved !== null) {
    soundEnabled = JSON.parse(saved);
  }
} catch {
  soundEnabled = true;
}

export const isSoundEnabled = () => soundEnabled;

export const setSoundEnabled = (enabled) => {
  soundEnabled = Boolean(enabled);
  try {
    localStorage.setItem('sound_enabled', JSON.stringify(soundEnabled));
  } catch {}
};

/**
 * Play a bright, delightful major chord chime on correct answer.
 */
export const playCorrect = () => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // Notes: C5 (523.25Hz), E5 (659.25Hz), G5 (783.99Hz), C6 (1046.5Hz)
  const notes = [523.25, 659.25, 783.99, 1046.5];

  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now + idx * 0.06);

    gain.gain.setValueAtTime(0, now + idx * 0.06);
    gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.06 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + idx * 0.06);
    osc.stop(now + idx * 0.06 + 0.45);
  });
};

/**
 * Play a soft, gentle, non-punishing double boop on incorrect answer.
 */
export const playIncorrect = () => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [280, 220]; // D3 -> A2

  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + idx * 0.12);

    gain.gain.setValueAtTime(0, now + idx * 0.12);
    gain.gain.linearRampToValueAtTime(0.25, now + idx * 0.12 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + idx * 0.12);
    osc.stop(now + idx * 0.12 + 0.22);
  });
};

/**
 * Play a subtle tactile click / tap sound.
 */
export const playClick = () => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, now);
  osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.04);
};

/**
 * Play a triumphant fanfare on lesson completion.
 */
export const playCelebration = () => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // Fanfare sequence: G4 -> C5 -> E5 -> G5 (held)
  const notes = [
    { freq: 392.0, time: 0.0, dur: 0.12 },
    { freq: 523.25, time: 0.12, dur: 0.12 },
    { freq: 659.25, time: 0.24, dur: 0.14 },
    { freq: 783.99, time: 0.38, dur: 0.7 },
    { freq: 1046.5, time: 0.48, dur: 0.9 },
  ];

  notes.forEach((n) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(n.freq, now + n.time);

    gain.gain.setValueAtTime(0, now + n.time);
    gain.gain.linearRampToValueAtTime(0.25, now + n.time + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + n.time + n.dur);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + n.time);
    osc.stop(now + n.time + n.dur);
  });
};

export default {
  playCorrect,
  playIncorrect,
  playClick,
  playCelebration,
  isSoundEnabled,
  setSoundEnabled,
};

