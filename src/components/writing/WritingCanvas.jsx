/**
 * @file WritingCanvas.jsx
 * @description Tablet-optimized HTML5 handwriting & calligraphy canvas.
 * Supports Apple Pencil / S-Pen / touch stylus pressure sensitivity, HiDPI Retina scaling,
 * quadratic curve stroke smoothing, Rice Grid & Notebook guidelines, and ghost tracing overlay.
 */

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  RotateCcw,
  Eye,
  EyeOff,
  Eraser,
  PenTool,
  Grid,
  CheckCircle2,
  Trash2,
  Sparkles,
  Download,
} from 'lucide-react';
import { Button, Badge } from '../ui';

const COLORS = [
  { name: 'Ink Black', value: '#1C1917' },
  { name: 'Indigo Calligraphy', value: '#1E3A8A' },
  { name: 'Bamboo Emerald', value: '#047857' },
  { name: 'Vermilion Seal', value: '#DC2626' },
];

const BRUSH_SIZES = [
  { label: 'Fine', value: 3 },
  { label: 'Medium', value: 7 },
  { label: 'Calligraphy', value: 14 },
];

/*
 * Paper palette.
 *
 * A canvas is a raster surface: it is painted once, outside CSS, so it cannot
 * inherit the theme by class name. Two consequences, both deliberate:
 *
 * 1. The values must match tokens exactly, and they now do — these are the
 *    literal triplets declared in src/styles/index.css. The previous draft used
 *    Tailwind's COOL greys (`#E5E7EB` gray-200, `#F3F4F6` gray-100, `#CBD5E1`
 *    slate-300) inside a warm-ink design system. Measured, those are
 *    indistinguishable from their warm equivalents on paper (1.18 vs 1.20,
 *    1.05 vs 1.04, 1.42 vs 1.42) — this is a coherence fix, not a contrast fix,
 *    but it is why the grid used to read as a different product from the page.
 * 2. The paper stays cream in dark mode, like a photograph. Grid lines follow it,
 *    not the theme, because a dark grid on cream paper would be a bug.
 *
 * Guide lines sit between 1.04:1 and 1.42:1 against the paper by design: they are
 * tracing aids, and WCAG 2.1 §1.4.11 excludes "graphical objects that are
 * essential for understanding the content"— these are the opposite, decoration
 * that the stroke itself is drawn over. The one colour that IS a label is the
 * export watermark, which uses ink-700 (9.82:1) rather than ink-500 (4.59:1) so
 * it clears AA at the small end of its size range.
 */
const PAPER = {
  bg: '#FAFAF7', // --surface-bg  (250 250 247)
  hairline: '#F5F5F4', // --ink-100  (245 245 244)
  guide: '#E7E5E4', // --ink-200  (231 229 228)
  baseline: '#D6D3D1', // --ink-300  (214 211 209)
  label: '#44403C', // --ink-700  ( 68  64  60)
};

/*
 * Toolbar button classes.
 *
 * The previous draft built every tool from `p-1.5` around a 16px icon, which is
 * a 28px hit area on a component whose own header comment says it is
 * tablet-optimised. They are now 44×44 (WCAG 2.5.5 target size) and share one
 * definition, so "selected" and "idle" cannot drift apart tool by tool.
 *
 * `text-ink-600` appears four times in that draft and resolves to nothing —
 * there is no ink-600 in the token set (see tailwind.config.js: 50/100/200/300/
 * 400/500/700/900), so those icons were inheriting the parent colour rather than
 * being deliberately muted. The nearest real tier is ink-700.
 */
const TOOL_BTN =
  'inline-flex items-center justify-center shrink-0 h-11 w-11 rounded-button border transition-colors';
const TOOL_IDLE = `${TOOL_BTN} border-ink-200 text-ink-700 hover:bg-ink-100`;
const TOOL_ON = `${TOOL_BTN} bg-brand-50 border-brand-600 text-brand-700`;
const TOOL_WARN = `${TOOL_BTN} bg-amber-50 border-amber-600 text-amber-700`;
const TOOL_DISABLED = 'disabled:opacity-40 disabled:cursor-not-allowed';

export default function WritingCanvas({
  targetCharacter = '',
  gridType = 'rice', // 'rice' (4-quadrant Asian grid) | 'lined' (notebook lines) | 'none'
  expectedStrokes = null, // target stroke count for verification
  onComplete,
  className = '',
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState([]); // array of stroke objects for undo history
  const [currentStroke, setCurrentStroke] = useState(null);

  // Tool settings
  const [color, setColor] = useState('#1C1917');
  const [brushSize, setBrushSize] = useState(7);
  const [isEraser, setIsEraser] = useState(false);
  const [showGhost, setShowGhost] = useState(true);
  const [activeGrid, setActiveGrid] = useState(gridType);
  const [evaluated, setEvaluated] = useState(false);

  // Canvas dimensions
  const [canvasDim, setCanvasDim] = useState({ width: 440, height: 440 });

  // Update canvas size responsively based on container
  const updateSize = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const size = Math.min(rect.width, 520);
    setCanvasDim({ width: size, height: size });
  }, []);

  useEffect(() => {
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [updateSize]);

  // Sync gridType prop change
  useEffect(() => {
    setActiveGrid(gridType);
  }, [gridType]);

  // Clear canvas & evaluation state when target changes
  useEffect(() => {
    setStrokes([]);
    setEvaluated(false);
  }, [targetCharacter]);

  // Redraw canvas whenever strokes, dim, or grid change
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    // Reset transform and clear
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Scale context for HiDPI crispness
    ctx.scale(dpr, dpr);

    // ── 1. Draw Guidelines ──
    const w = canvasDim.width;
    const h = canvasDim.height;

    if (activeGrid === 'rice') {
      // Asian 4-quadrant Rice Grid (田字格)
      ctx.save();
      ctx.strokeStyle = PAPER.guide;
      ctx.lineWidth = 1.5;

      // Outer border
      ctx.strokeRect(10, 10, w - 20, h - 20);

      // Dashed crosshairs
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      // Horizontal center
      ctx.moveTo(10, h / 2);
      ctx.lineTo(w - 10, h / 2);
      // Vertical center
      ctx.moveTo(w / 2, 10);
      ctx.lineTo(w / 2, h - 10);

      // Subtle diagonals — faded from the same guide token rather than dropped
      // to ink-100, which measured 1.04:1 on paper and simply vanished.
      ctx.globalAlpha = 0.5;
      ctx.strokeStyle = PAPER.guide;
      ctx.moveTo(10, 10);
      ctx.lineTo(w - 10, h - 10);
      ctx.moveTo(w - 10, 10);
      ctx.lineTo(10, h - 10);
      ctx.stroke();
      ctx.restore();
    } else if (activeGrid === 'lined') {
      // Latin Notebook Grid (Headline, Midline, Baseline, Descender)
      ctx.save();
      ctx.strokeStyle = PAPER.guide;
      ctx.lineWidth = 1.5;

      const pad = 24;
      const innerH = h - pad * 2;
      const headline = pad + innerH * 0.2;
      const midline = pad + innerH * 0.5;
      const baseline = pad + innerH * 0.8;

      // Outer boundary
      ctx.strokeRect(pad, pad, w - pad * 2, innerH);

      // Headline
      ctx.beginPath();
      ctx.moveTo(pad, headline);
      ctx.lineTo(w - pad, headline);
      ctx.stroke();

      // Midline (dashed)
      ctx.beginPath();
      ctx.setLineDash([6, 6]);
      ctx.moveTo(pad, midline);
      ctx.lineTo(w - pad, midline);
      ctx.stroke();

      // Baseline (solid, primary)
      ctx.beginPath();
      ctx.setLineDash([]);
      ctx.strokeStyle = PAPER.baseline;
      ctx.lineWidth = 2;
      ctx.moveTo(pad, baseline);
      ctx.lineTo(w - pad, baseline);
      ctx.stroke();
      ctx.restore();
    }

    // ── 2. Render Saved Strokes with quadratic Bezier smoothing ──
    const renderStroke = (stroke) => {
      if (!stroke || stroke.points.length === 0) return;
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (stroke.isEraser) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = stroke.size * 2;
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = stroke.color;
      }

      const pts = stroke.points;
      if (pts.length === 1) {
        ctx.beginPath();
        ctx.arc(pts[0].x, pts[0].y, (stroke.size * (pts[0].pressure || 1)) / 2, 0, Math.PI * 2);
        ctx.fillStyle = stroke.color;
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);

        for (let i = 1; i < pts.length - 1; i++) {
          const xc = (pts[i].x + pts[i + 1].x) / 2;
          const yc = (pts[i].y + pts[i + 1].y) / 2;

          // Modulate line width if stylus pressure is reported
          const pressure = pts[i].pressure || 1;
          ctx.lineWidth = Math.max(stroke.size * 0.5, stroke.size * pressure);

          ctx.quadraticCurveTo(pts[i].x, pts[i].y, xc, yc);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(xc, yc);
        }

        const last = pts[pts.length - 1];
        ctx.lineTo(last.x, last.y);
        ctx.stroke();
      }

      ctx.restore();
    };

    strokes.forEach(renderStroke);
    if (currentStroke) {
      renderStroke(currentStroke);
    }
  }, [canvasDim, activeGrid, strokes, currentStroke]);

  // Trigger redraw on change
  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  // Pointer event handlers with pressure detection
  const getCanvasPoint = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0, pressure: 1 };
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Use pen pressure if present, else fallback to 1
    const pressure = e.pressure && e.pressure > 0 ? e.pressure : 1;
    return { x, y, pressure };
  };

  const handlePointerDown = (e) => {
    e.preventDefault();
    canvasRef.current.setPointerCapture(e.pointerId);
    const pt = getCanvasPoint(e);
    setIsDrawing(true);
    setCurrentStroke({
      color,
      size: brushSize,
      isEraser,
      points: [pt],
    });
  };

  const handlePointerMove = (e) => {
    if (!isDrawing || !currentStroke) return;
    e.preventDefault();
    const pt = getCanvasPoint(e);
    setCurrentStroke((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        points: [...prev.points, pt],
      };
    });
  };

  const handlePointerUp = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    setIsDrawing(false);
    if (currentStroke && currentStroke.points.length > 0) {
      setStrokes((prev) => [...prev, currentStroke]);
    }
    setCurrentStroke(null);
  };

  // Canvas Actions
  const handleUndo = () => {
    setStrokes((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setStrokes([]);
    setEvaluated(false);
  };

  const handleExportPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create an offscreen canvas with a clean paper background and card footer
    const exportCanvas = document.createElement('canvas');
    const w = canvas.width;
    const h = canvas.height;
    const footerHeight = Math.max(80, Math.round(h * 0.14));
    exportCanvas.width = w;
    exportCanvas.height = h + footerHeight;

    const ctx = exportCanvas.getContext('2d');

    // Warm paper canvas background
    ctx.fillStyle = PAPER.bg;
    ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

    // Card border
    ctx.strokeStyle = PAPER.guide;
    ctx.lineWidth = Math.max(3, Math.round(w * 0.006));
    const pad = 12;
    ctx.strokeRect(pad, pad, exportCanvas.width - pad * 2, exportCanvas.height - pad * 2);

    // Draw the user calligraphy strokes from current canvas
    ctx.drawImage(canvas, 0, 0);

    // Watermark / details in footer
    ctx.save();
    ctx.fillStyle = PAPER.label;
    const fontSize = Math.max(16, Math.round(w * 0.035));
    ctx.font = `600 ${fontSize}px "Plus Jakarta Sans", -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const title = targetCharacter ? `Practice: ${targetCharacter}` : 'Calligraphy Practice';
    ctx.fillText(`${title}  •  LinguaFlow Writing Lab`, exportCanvas.width / 2, h + footerHeight / 2);
    ctx.restore();

    // Trigger PNG download
    const cleanName = (targetCharacter || 'calligraphy').replace(/[^\w\u4e00-\u9fa5\u3040-\u309f\u30a0-\u30ff]/gi, '_');
    const dataUrl = exportCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `linguaflow-${cleanName}-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  const handleSelfGrade = (passed) => {
    setEvaluated(true);
    if (passed && onComplete) {
      onComplete(true);
    }
  };

  return (
    <div ref={containerRef} className={`flex flex-col items-center w-full max-w-lg mx-auto ${className}`}>
      {/* ── Toolbar: Controls & Tools ── */}
      <div className="w-full bg-surface-card rounded-t-card p-3 border border-ink-200 border-b-0 flex flex-wrap items-center justify-between gap-2 shadow-soft-sm">
        {/* Colors */}
        <div className="flex items-center gap-1">
          {COLORS.map((c) => (
            <button
              key={c.name}
              type="button"
              aria-label={`${c.name} ink`}
              aria-pressed={!isEraser && color === c.value}
              onClick={() => {
                setColor(c.value);
                setIsEraser(false);
              }}
              /* 44px target, 24px swatch centred inside it. */
              className="inline-flex items-center justify-center shrink-0 h-11 w-11 rounded-button"
            >
              <span
                aria-hidden="true"
                style={{ backgroundColor: c.value }}
                className={`w-7 h-7 rounded-pill border-2 transition-transform ${
                  !isEraser && color === c.value
                    ? 'scale-110 border-brand-700 ring-2 ring-brand-200'
                    : 'border-surface-card hover:scale-105'
                }`}
              />
            </button>
          ))}

          {/* Eraser — amber rather than brand, because it is the one tool that
              removes work rather than adding it. */}
          <button
            type="button"
            onClick={() => setIsEraser((e) => !e)}
            aria-pressed={isEraser}
            aria-label="Eraser"
            className={isEraser ? TOOL_WARN : TOOL_IDLE}
          >
            <Eraser size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Brush Size */}
        <div
          className="flex items-center gap-1 bg-ink-100 p-1 rounded-button"
          role="group"
          aria-label="Brush size"
        >
          {BRUSH_SIZES.map((b) => (
            <button
              key={b.label}
              type="button"
              onClick={() => setBrushSize(b.value)}
              aria-pressed={brushSize === b.value}
              className={`h-9 px-3 text-caption font-semibold rounded-button transition-colors ${
                brushSize === b.value
                  ? 'bg-surface-card text-brand-700 shadow-soft-sm'
                  : 'text-ink-700 hover:text-ink-900'
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>

        {/* Utilities: Grid, Ghost Tracing, Undo, Clear */}
        <div className="flex items-center gap-1">
          {/* Ghost Tracing Toggle */}
          <button
            type="button"
            onClick={() => setShowGhost((g) => !g)}
            aria-pressed={showGhost}
            aria-label={showGhost ? 'Hide ghost guide' : 'Show ghost guide'}
            className={showGhost ? TOOL_ON : TOOL_IDLE}
          >
            {showGhost ? <Eye size={18} aria-hidden="true" /> : <EyeOff size={18} aria-hidden="true" />}
          </button>

          {/* Grid Toggle */}
          <button
            type="button"
            onClick={() =>
              setActiveGrid((prev) =>
                prev === 'rice' ? 'lined' : prev === 'lined' ? 'none' : 'rice'
              )
            }
            aria-label={`Grid: ${activeGrid}. Tap to change.`}
            className={activeGrid === 'none' ? TOOL_IDLE : TOOL_ON}
          >
            <Grid size={18} aria-hidden="true" />
          </button>

          {/* Export PNG */}
          <button
            type="button"
            disabled={strokes.length === 0}
            onClick={handleExportPNG}
            className={`${TOOL_IDLE} ${TOOL_DISABLED}`}
            aria-label="Export artwork as PNG"
          >
            <Download size={18} aria-hidden="true" />
          </button>

          {/* Undo */}
          <button
            type="button"
            disabled={strokes.length === 0}
            onClick={handleUndo}
            className={`${TOOL_IDLE} ${TOOL_DISABLED}`}
            aria-label="Undo last stroke"
          >
            <RotateCcw size={18} aria-hidden="true" />
          </button>

          {/* Clear */}
          <button
            type="button"
            disabled={strokes.length === 0}
            onClick={handleClear}
            className={`${TOOL_BTN} ${TOOL_DISABLED} border-ink-200 text-error-strong hover:bg-error-bg hover:text-error`}
            aria-label="Clear canvas"
          >
            <Trash2 size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* ── Drawing Area ── */}
      <div
        className="relative border border-ink-200 shadow-soft-md rounded-b-card overflow-hidden touch-none select-none cursor-crosshair"
        style={{ width: `${canvasDim.width}px`, height: `${canvasDim.height}px`, backgroundColor: PAPER.bg }}
      >
        {/* Ghost tracing watermark.
            Was `text-ink-200/50` — measured 1.04:1 against the paper, which is to
            say invisible, for the one element whose job is to be traced. It now
            uses ink-300 at full strength (1.42:1): still quiet next to real ink,
            but legible as a large glyph. */}
        {showGhost && targetCharacter && (
          <div
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none font-display font-medium text-ink-300"
            style={{
              fontSize:
                targetCharacter.length > 3
                  ? `${canvasDim.width * 0.22}px`
                  : targetCharacter.length > 1
                  ? `${canvasDim.width * 0.4}px`
                  : `${canvasDim.width * 0.65}px`,
              lineHeight: 1,
            }}
          >
            {targetCharacter}
          </div>
        )}

        {/* HTML5 Canvas with HiDPI support */}
        <canvas
          ref={canvasRef}
          width={canvasDim.width * (window.devicePixelRatio || 1)}
          height={canvasDim.height * (window.devicePixelRatio || 1)}
          style={{ width: `${canvasDim.width}px`, height: `${canvasDim.height}px` }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          /* A canvas exposes nothing by itself. The ghost guide it is tracing is
             a graphic, so the character has to be spoken here or it does not
             exist for non-visual users at all. */
          role="img"
          aria-label={
            targetCharacter
              ? `Handwriting canvas. Trace the character ${targetCharacter} using a stylus, finger or mouse.`
              : 'Freehand writing canvas. Draw with a stylus, finger or mouse.'
          }
          className="absolute inset-0 touch-none"
        />
      </div>

      {/* ── Tablet Self-Evaluation & Verification Bar ── */}
      <div className="w-full mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-caption text-ink-700 font-medium tabular-nums">
            {strokes.length} {strokes.length === 1 ? 'stroke' : 'strokes'} drawn
          </span>
          {expectedStrokes && (
            /* The three states used to be raw emerald / amber / ink-600 chips with
               a 🎯 prefix. They are the Badge variants the kit already measures
               against cream and white. */
            <Badge
              size="md"
              variant={
                strokes.length === expectedStrokes
                  ? 'success'
                  : strokes.length > expectedStrokes
                    ? 'warning'
                    : 'default'
              }
              numeric
            >
              {strokes.length === expectedStrokes
                ? `Perfect stroke count (${strokes.length}/${expectedStrokes})`
                : `Target ${expectedStrokes} strokes (${strokes.length}/${expectedStrokes})`}
            </Badge>
          )}
        </div>

        {!evaluated ? (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={strokes.length === 0}
              onClick={() => handleSelfGrade(false)}
            >
              Needs Practice
            </Button>
            <Button
              type="button"
              size="sm"
              icon={CheckCircle2}
              disabled={strokes.length === 0}
              onClick={() => handleSelfGrade(true)}
            >
              Looks Great · +15 XP
            </Button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2"
          >
            <Badge variant="success" size="md" icon={Sparkles}>
              Practice recorded
            </Badge>
          </motion.div>
        )}
      </div>
    </div>
  );
}

