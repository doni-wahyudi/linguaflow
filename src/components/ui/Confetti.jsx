/**
 * @file Confetti.jsx
 * @description Lightweight, zero-dependency HTML5 canvas confetti explosion for celebrations.
 */

import React, { useEffect, useRef } from 'react';

const COLORS = [
  '#10B981', // Emerald
  '#059669', // Brand green
  '#F59E0B', // Amber
  '#F97316', // Coral
  '#3B82F6', // Azure
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#EAB308', // Gold
];

export default function Confetti({ duration = 3500, particleCount = 100 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let startTime = Date.now();

    // Resize canvas
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize particles
    const particles = Array.from({ length: particleCount }, () => ({
      x: window.innerWidth * (0.3 + Math.random() * 0.4), // burst from center
      y: window.innerHeight * 0.4,
      vx: (Math.random() - 0.5) * 18,
      vy: (Math.random() - 0.9) * 16 - 4,
      size: Math.random() * 8 + 6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
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
  }, [duration, particleCount]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
    />
  );
}

