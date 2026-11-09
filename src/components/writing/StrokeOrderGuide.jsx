/**
 * @file StrokeOrderGuide.jsx
 * @description Interactive visual stroke order & direction breakdown guide.
 * Displays step-by-step stroke pill sequence, directional arrow rotations,
 * hand-movement cues, and canonical East Asian calligraphy rules.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Info,
  ChevronDown,
  ChevronUp,
  Compass,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Badge, Button, Card } from '../ui';
import {
  getStrokeData,
  CANONICAL_STROKE_RULES,
} from '../../data/characters/strokeData.js';

// Number to circled unicode mapping (1-20)
const CIRCLED_NUMBERS = [
  '①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩',
  '⑪', '⑫', '⑬', '⑭', '⑮', '⑯', '⑰', '⑱', '⑲', '⑳'
];

export default function StrokeOrderGuide({
  character = '',
  activeStroke = null,
  onSelectStroke,
  className = '',
}) {
  const [showRulesInfo, setShowRulesInfo] = useState(false);
  const strokeData = getStrokeData(character);

  if (!strokeData || !strokeData.strokes || strokeData.strokes.length === 0) {
    return null;
  }

  const { strokeCount, strokes, principles } = strokeData;

  const handlePillClick = (order) => {
    if (onSelectStroke) {
      onSelectStroke(order);
    }
  };

  return (
    <div
      data-testid="stroke-order-guide"
      className={`bg-surface-card border border-ink-200 rounded-card p-4 shadow-soft-sm ${className}`}
    >
      {/* ── Header: Character, Stroke Count & Principles ── */}
      <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-button bg-brand-50 border border-brand-200 flex items-center justify-center font-display font-bold text-display-xs text-brand-700">
            {character || strokeData.char}
          </div>
          <div>
            <h4 className="font-display font-bold text-body-sm text-ink-900 leading-tight">
              Stroke Order (筆順)
            </h4>
            <span className="text-caption text-ink-500">
              {strokeCount} {strokeCount === 1 ? 'stroke total' : 'strokes total'}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowRulesInfo((v) => !v)}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-caption font-semibold rounded-pill bg-surface-bg border border-ink-200 text-ink-700 hover:text-brand-700 hover:border-brand-300 transition-colors"
          aria-expanded={showRulesInfo}
          aria-label="Toggle calligraphy principles explanation"
        >
          <Compass size={13} aria-hidden="true" className="text-brand-600" />
          <span>Calligraphy Rules</span>
          {showRulesInfo ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
      </div>

      {/* ── Calligraphy Principles Badges ── */}
      {principles && principles.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          {principles.map((pr, idx) => (
            <Badge key={idx} variant="brand" size="sm" className="font-medium text-[11px]">
              {pr}
            </Badge>
          ))}
        </div>
      )}

      {/* ── Collapsible Canonical Rules Card ── */}
      <AnimatePresence>
        {showRulesInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-4"
          >
            <div className="p-3 bg-brand-50/50 border border-brand-200 rounded-button text-caption space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-brand-900">
                <Info size={14} className="text-brand-600" />
                <span>The 7 Canonical Rules of East Asian Calligraphy</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {CANONICAL_STROKE_RULES.map((rule) => (
                  <div key={rule.id} className="bg-surface-card p-2 rounded border border-brand-100">
                    <p className="font-bold text-ink-900 text-[11px]">
                      {rule.title} <span className="text-brand-700 font-normal">({rule.titleJa})</span>
                    </p>
                    <p className="text-[11px] text-ink-600 mt-0.5">{rule.description}</p>
                    <span className="text-[10px] text-brand-600 font-mono mt-0.5 block">
                      Examples: {rule.example}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Visual Step Pills Carousel ── */}
      <div className="mb-3.5">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-ink-400 block mb-1.5">
          Stroke Sequence (Click to inspect)
        </label>
        <div
          role="tablist"
          aria-label="Stroke sequence step buttons"
          className="flex items-center gap-1.5 flex-wrap"
        >
          {strokes.map((stroke, idx) => {
            const isSelected = activeStroke === stroke.order;
            const circleChar = CIRCLED_NUMBERS[idx] || `${idx + 1}`;
            return (
              <button
                key={stroke.order}
                type="button"
                role="tab"
                data-testid={`step-pill-${stroke.order}`}
                aria-selected={isSelected}
                aria-label={`Stroke ${stroke.order}: ${stroke.direction}`}
                onClick={() => handlePillClick(stroke.order)}
                className={`group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-caption font-semibold transition-all border ${
                  isSelected
                    ? 'bg-brand-50 border-brand-600 text-brand-800 shadow-soft-xs ring-2 ring-brand-200'
                    : 'bg-surface-card border-ink-200 text-ink-700 hover:border-brand-400 hover:text-ink-900'
                }`}
              >
                <span className="font-mono text-body-xs font-bold text-brand-700">
                  {circleChar}
                </span>
                <span
                  style={{ transform: `rotate(${stroke.arrowAngle}deg)` }}
                  className="inline-block transition-transform duration-200 text-ink-500 group-hover:text-brand-600"
                  aria-hidden="true"
                >
                  ➔
                </span>
                <span className="text-[11px] font-mono text-ink-500 capitalize">
                  {stroke.direction.replace(/-/g, ' ')}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Step-by-Step Movement Instructions List ── */}
      <div className="space-y-2 border-t border-ink-100 pt-3">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-ink-400 block mb-1">
          Hand Trajectory & Direction
        </label>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {strokes.map((stroke, idx) => {
            const isSelected = activeStroke === stroke.order;
            const circleChar = CIRCLED_NUMBERS[idx] || `${idx + 1}`;
            return (
              <div
                key={stroke.order}
                onClick={() => handlePillClick(stroke.order)}
                className={`p-2 rounded-button border text-left cursor-pointer transition-all flex items-start gap-2.5 ${
                  isSelected
                    ? 'bg-brand-50/70 border-brand-500 shadow-soft-2xs'
                    : 'bg-surface-card border-ink-100 hover:border-ink-200 hover:bg-ink-50/50'
                }`}
              >
                {/* Number & Arrow Badge */}
                <div className="shrink-0 w-6 h-6 rounded-pill bg-brand-100/70 border border-brand-300 flex items-center justify-center text-caption font-bold text-brand-800">
                  {circleChar}
                </div>

                {/* Description & Angle */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-caption font-semibold text-ink-900 capitalize">
                      {stroke.direction.replace(/-/g, ' ')}
                    </span>
                    <span className="text-[10px] text-ink-400 font-mono">
                      {stroke.arrowAngle}°
                    </span>
                  </div>
                  <p className="text-[12px] text-ink-600 leading-snug">
                    {stroke.description}
                  </p>
                </div>

                {/* Trajectory Direction Indicator */}
                <div
                  style={{ transform: `rotate(${stroke.arrowAngle}deg)` }}
                  className="shrink-0 text-brand-600 text-body-xs font-bold pt-0.5"
                  aria-hidden="true"
                >
                  ➔
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
