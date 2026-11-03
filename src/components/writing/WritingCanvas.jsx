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
      ctx.strokeStyle = '#E5E7EB';
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

      // Subtle diagonals
      ctx.strokeStyle = '#F3F4F6';
      ctx.moveTo(10, 10);
      ctx.lineTo(w - 10, h - 10);
      ctx.moveTo(w - 10, 10);
      ctx.lineTo(10, h - 10);
      ctx.stroke();
      ctx.restore();
    } else if (activeGrid === 'lined') {
      // Latin Notebook Grid (Headline, Midline, Baseline, Descender)
      ctx.save();
      ctx.strokeStyle = '#E5E7EB';
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
      ctx.strokeStyle = '#CBD5E1';
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

    // Warm paper canvas background (#FAF9F5)
    ctx.fillStyle = '#FAF9F5';
    ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

    // Card border
    ctx.strokeStyle = '#E7E5E4';
    ctx.lineWidth = Math.max(3, Math.round(w * 0.006));
    const pad = 12;
    ctx.strokeRect(pad, pad, exportCanvas.width - pad * 2, exportCanvas.height - pad * 2);

    // Draw the user calligraphy strokes from current canvas
    ctx.drawImage(canvas, 0, 0);

    // Watermark / details in footer
    ctx.save();
    ctx.fillStyle = '#78716C';
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
      <div className="w-full bg-white rounded-t-card p-3 border border-ink-200/80 border-b-0 flex flex-wrap items-center justify-between gap-2 shadow-soft-sm">
        {/* Colors */}
        <div className="flex items-center gap-1.5">
          {COLORS.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => {
                setColor(c.value);
                setIsEraser(false);
              }}
              style={{ backgroundColor: c.value }}
              title={c.name}
              className={`w-7 h-7 rounded-full border-2 transition-transform ${
                !isEraser && color === c.value
                  ? 'scale-110 border-brand-500 shadow-soft-sm'
                  : 'border-white hover:scale-105'
              }`}
            />
          ))}

          {/* Eraser */}
          <button
            type="button"
            onClick={() => setIsEraser((e) => !e)}
            className={`p-1.5 rounded-button border transition-colors ${
              isEraser
                ? 'bg-amber-100 border-amber-400 text-amber-900'
                : 'border-ink-200 text-ink-600 hover:bg-ink-100'
            }`}
            title="Eraser"
          >
            <Eraser size={16} />
          </button>
        </div>

        {/* Brush Size */}
        <div className="flex items-center gap-1 bg-ink-100 p-0.5 rounded-button">
          {BRUSH_SIZES.map((b) => (
            <button
              key={b.label}
              type="button"
              onClick={() => setBrushSize(b.value)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-button transition-all ${
                brushSize === b.value
                  ? 'bg-white text-brand-700 shadow-soft-sm'
                  : 'text-ink-500 hover:text-ink-900'
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
            className={`p-1.5 rounded-button border transition-colors ${
              showGhost
                ? 'bg-brand-50 border-brand-300 text-brand-700'
                : 'border-ink-200 text-ink-400 hover:bg-ink-100'
            }`}
            title={showGhost ? 'Hide Ghost Guide' : 'Show Ghost Guide'}
          >
            {showGhost ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>

          {/* Grid Toggle */}
          <button
            type="button"
            onClick={() =>
              setActiveGrid((prev) =>
                prev === 'rice' ? 'lined' : prev === 'lined' ? 'none' : 'rice'
              )
            }
            className="p-1.5 rounded-button border border-ink-200 text-ink-600 hover:bg-ink-100 transition-colors"
            title={`Grid: ${activeGrid}`}
          >
            <Grid size={16} />
          </button>

          {/* Export PNG */}
          <button
            type="button"
            disabled={strokes.length === 0}
            onClick={handleExportPNG}
            className="p-1.5 rounded-button border border-ink-200 text-ink-600 hover:bg-brand-50 hover:text-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Export Artwork as PNG"
            aria-label="Export Artwork as PNG"
          >
            <Download size={16} />
          </button>

          {/* Undo */}
          <button
            type="button"
            disabled={strokes.length === 0}
            onClick={handleUndo}
            className="p-1.5 rounded-button border border-ink-200 text-ink-600 hover:bg-ink-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Undo stroke"
          >
            <RotateCcw size={16} />
          </button>

          {/* Clear */}
          <button
            type="button"
            disabled={strokes.length === 0}
            onClick={handleClear}
            className="p-1.5 rounded-button border border-ink-200 text-ink-600 hover:bg-red-50 hover:text-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Clear canvas"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* ── Drawing Area ── */}
      <div
        className="relative bg-white border border-ink-200/80 shadow-soft-md rounded-b-card overflow-hidden touch-none select-none cursor-crosshair"
        style={{ width: `${canvasDim.width}px`, height: `${canvasDim.height}px` }}
      >
        {/* Ghost tracing watermark */}
        {showGhost && targetCharacter && (
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none font-display font-medium text-ink-200/50"
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
          className="absolute inset-0 touch-none"
        />
      </div>

      {/* ── Tablet Self-Evaluation & Verification Bar ── */}
      <div className="w-full mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-ink-500 font-medium">
            {strokes.length} {strokes.length === 1 ? 'stroke' : 'strokes'} drawn
          </span>
          {expectedStrokes && (
            <span
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-pill transition-all ${
                strokes.length === expectedStrokes
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : strokes.length > expectedStrokes
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-ink-100 text-ink-600 border border-ink-200'
              }`}
            >
              {strokes.length === expectedStrokes
                ? `🎯 Perfect Stroke Count (${strokes.length}/${expectedStrokes})`
                : `Target: ${expectedStrokes} strokes (${strokes.length}/${expectedStrokes})`}
            </span>
          )}
        </div>

        {!evaluated ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={strokes.length === 0}
              onClick={() => handleSelfGrade(false)}
              className="px-3.5 py-2 rounded-pill border border-ink-300 text-ink-700 hover:bg-ink-100 text-xs font-semibold transition-all disabled:opacity-40"
            >
              Needs Practice
            </button>
            <button
              type="button"
              disabled={strokes.length === 0}
              onClick={() => handleSelfGrade(true)}
              className="px-5 py-2 rounded-pill bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-soft-sm flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-40"
            >
              <CheckCircle2 size={15} /> Looks Great! (+15 XP)
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 text-xs font-bold text-green-700 bg-green-50 px-4 py-2 rounded-pill border border-green-200"
          >
            <Sparkles size={14} className="text-amber-500" /> Practice Recorded!
          </motion.div>
        )}
      </div>
    </div>
  );
}

