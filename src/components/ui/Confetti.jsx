/**
 * @file Confetti.jsx
 * @description Lightweight, zero-dependency HTML5 canvas confetti burst for
 * lesson and exam celebrations.
 *
 * Two things changed over the previous draft:
 *
 * 1. It now respects `prefers-reduced-motion`. MotionConfig cannot help here —
 *    this animates through requestAnimationFrame and direct canvas painting, not
 *    through Framer Motion, so no JS-side motion preference reaches it. A
 *    full-viewport storm of 100 spinning rectangles is exactly the kind of motion
 *    the preference exists for, so the component renders nothing at all and the
 *    celebration falls back to the static result card behind it.
 * 2. The palette is read from the design tokens instead of being hardcoded. The
 *    old list carried four colours that exist nowhere in the system (Azure
 *    #3B82F6, Purple #8B5CF6, Pink #EC4899, Gold #EAB308), which is how a
 *    celebration burst ended up contradicting the brand while it was happening.
 *    Colours now resolve from the CSS custom properties, so dark mode tints the
 *    confetti too.
 *
 * @example
 * {showConfetti && <Confetti />}
 */

import React, { useEffect, useRef } from 'react';

/** Token names, resolved to `rgb(r g b)` at mount time. */
const PALETTE_TOKENS = [
  '--brand-500',
  '--brand-600',
  '--amber-400',
  '--amber-500',
  '--coral-400',
  '--coral-500',
  '--info',
  '--brand-300',
];

/** Fallbacks for a context where the custom properties are unavailable (SSR,
 *  a test runner with no stylesheet). Same hues as the tokens above. */
const PALETTE_FALLBACK = [
  '#10B981',
  '#059669',
  '#FBBF24',
  '#F59E0B',
  '#FB923C',
  '#F97316',
  '#3B82F6',
  '#6EE7B7',
];

function resolvePalette() {
  if (typeof window === 'undefined') return PALETTE_FALLBACK;
  const styles = getComputedStyle(document.documentElement);
  const colors = PALETTE_TOKENS.map((token) => {
    const value = styles.getPropertyValue(token).trim();
    if (!value) return null;
    /* Emit the legacy comma form: the tokens are space-separated triplets, and
       `rgb(r g b)` inside a canvas fillStyle is newer syntax that some WebView
       engines still reject by returning a silently ignored invalid colour. */
    const [r, g, b] = value.split(/\s+/);
    return `rgb(${r}, ${g}, ${b})`;
  });
  return colors.some((c) => !c)
    ? PALETTE_FALLBACK
    : colors.map((c, i) => c || PALETTE_FALLBACK[i]);
}

/** Reads the OS preference; the listener keeps the flag honest if the user
 *  flips the setting while a celebration is on screen. */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

export default function Confetti({ duration = 3500, particleCount = 100 }) {
  const canvasRef = useRef(null);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reduceMotion) return undefined;

    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    const colors = resolvePalette();
    let animId;
    let startTime = Date.now();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: particleCount }, () => ({
      x: window.innerWidth * (0.3 + Math.random() * 0.4), // burst from center
      y: window.innerHeight * 0.4,
      vx: (Math.random() - 0.5) * 18,
      vy: (Math.random() - 0.9) * 16 - 4,
      size: Math.random() * 8 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vRotation: (Math.random() - 0.5) * 12,
      gravity: 0.35 + Math.random() * 0.2,
      wobble: Math.random() * 10,
      opacity: 1,
    }));

    const render = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed > duration) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.vRotation;
        p.wobble += 0.1;

        // Fade out in last 800ms
        if (elapsed > duration - 800) {
          p.opacity = Math.max(0, (duration - elapsed) / 800);
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        // Draw rectangle ribbon
        const w = p.size;
        const h = p.size * 0.45;
        ctx.fillRect(-w / 2, -h / 2, w, h);

        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [duration, particleCount, reduceMotion]);

  /* Decorative by definition: the message is in the result card underneath, so
     assistive tech should skip the canvas entirely. */
  if (reduceMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
    />
  );
}
