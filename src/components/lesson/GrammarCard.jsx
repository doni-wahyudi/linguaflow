/**
 * @file GrammarCard.jsx
 * @description Dedicated 1-minute Grammar Micro-Guide component for lessons.
 *
 * Implements the Grammar Micro-Guide specification:
 * - Header: "1-min Grammar Guide" badge, read-time badge, display title, and context subtitle.
 * - Concept Callout: Highlighted core morphological/syntactical concept explanation.
 * - Rule Breakdown: Structured pattern cards with pattern formulas, target-language authentic
 *   examples, English translations, and TTS AudioControls.
 * - Memory Hook / Etiquette Tip: Amber callout card with practical mnemonic or cultural etiquette note.
 * - Footer Action: "Start Exercises" pill button (hidden in compact modal view).
 */

import React, { useContext } from 'react';
import { Clock, BookOpen, Sparkles, ArrowRight } from 'lucide-react';
import { Card, Badge, Button, AudioControls } from '../ui';
import UserContext from '../../context/UserContext';

/**
 * @param {object} props
 * @param {object} props.grammarGuide - The grammar guide data object.
 * @param {string} [props.grammarGuide.id]
 * @param {string} props.grammarGuide.title
 * @param {string} [props.grammarGuide.subtitle]
 * @param {number} [props.grammarGuide.readTimeMinutes=1]
 * @param {string} props.grammarGuide.concept
 * @param {Array<{ rule: string, pattern?: string, example: string, translation?: string, audioText?: string }>} [props.grammarGuide.rules]
 * @param {string} [props.grammarGuide.tip]
 * @param {'es'|'ja'|'fr'|'de'} [props.langCode='es'] - Current lesson language code.
 * @param {Function} [props.onStart] - Callback when clicking "Start Exercises".
 * @param {boolean} [props.isModalView=false] - Whether rendered inside an in-flight peek modal.
 * @param {object} [props.speech] - Optional speech hook override for TTS.
 * @param {string} [props.className] - Additional wrapper class names.
 */
export default function GrammarCard({
  grammarGuide,
  langCode = 'es',
  onStart,
  isModalView = false,
  speech: speechProp,
  className = '',
}) {
  const userCtx = useContext(UserContext);
  const speech = speechProp || userCtx?.speech;

  if (!grammarGuide) return null;

  const {
    title,
    subtitle,
    readTimeMinutes = 1,
    concept,
    rules = [],
    tip,
  } = grammarGuide;

  return (
    <div
      className={`w-full max-w-2xl mx-auto text-left ${
        isModalView ? 'space-y-4' : 'space-y-6'
      } ${className}`.trim()}
    >
      {/* Header */}
      <header className="space-y-1 text-left">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="brand" uppercase size="sm">
            1-min Grammar Guide
          </Badge>
          <Badge variant="outline" size="sm" className="inline-flex items-center gap-1 text-ink-700">
            <Clock size={13} aria-hidden="true" />
            <span>{readTimeMinutes || 1} min read</span>
          </Badge>
        </div>

        <h2 className="text-display-sm sm:text-display-md font-display font-bold text-ink-900 mt-2">
          {title}
        </h2>

        {subtitle && (
          <p className="text-body-sm text-ink-500 mt-0.5">
            {subtitle}
          </p>
        )}
      </header>

      {/* Core Concept Callout */}
      {concept && (
        <div className="bg-brand-50 border border-brand-200/70 rounded-card p-4 text-left">
          <div className="flex items-center gap-2 text-brand-700 font-semibold text-caption uppercase tracking-wider mb-1">
            <BookOpen size={15} aria-hidden="true" />
            <span>Core Concept</span>
          </div>
          <p className="text-body-md text-ink-900 leading-relaxed">
            {concept}
          </p>
        </div>
      )}

      {/* Rule Breakdown */}
      {rules && rules.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-caption font-bold text-ink-500 uppercase tracking-wider text-left">
            Key Patterns & Rules
          </h3>
          <div className="space-y-3">
            {rules.map((r, idx) => (
              <Card
                key={r.pattern || r.rule || idx}
                tone="surface"
                padding="md"
                className="space-y-3 text-left"
              >
                {/* Top row: Rule number pill + rule text */}
                <div className="flex items-start sm:items-center gap-2.5">
                  <Badge variant="brand" size="sm" className="shrink-0">
                    Rule {idx + 1}
                  </Badge>
                  <p className="font-semibold text-body-md text-ink-900">{r.rule}</p>
                </div>

                {/* Pattern formula box */}
                {r.pattern && (
                  <div>
                    <span className="bg-surface-100 border border-ink-200 rounded-button px-3 py-1.5 font-mono text-caption text-brand-700 font-semibold inline-block">
                      {r.pattern}
                    </span>
                  </div>
                )}

                {/* Example row with audio */}
                <div className="flex items-start sm:items-center justify-between gap-4 pt-2 border-t border-ink-100">
                  <div className="min-w-0 flex-1">
                    <p className="font-display font-bold text-body-lg text-ink-900">{r.example}</p>
                    {r.translation && (
                      <p className="text-body-sm text-ink-500 italic mt-0.5">{r.translation}</p>
                    )}
                  </div>
                  <AudioControls
                    text={r.audioText || r.example}
                    lang={langCode}
                    langCode={langCode}
                    speech={speech}
                    phraseLabel={r.example}
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Memory Hook / Etiquette Tip */}
      {tip && (
        <div className="bg-amber-50 border border-amber-200 rounded-card p-4 text-left flex items-start gap-3">
          <Sparkles className="text-amber-700 shrink-0 mt-0.5" size={18} aria-hidden="true" />
          <div className="space-y-0.5">
            <div className="text-caption font-bold uppercase tracking-wider text-amber-800">
              Pro Tip / Memory Hook
            </div>
            <p className="text-body-sm text-amber-900 font-medium">
              {tip}
            </p>
          </div>
        </div>
      )}

      {/* Footer Action */}
      {!isModalView && (
        <div className="pt-2 flex justify-center">
          <Button
            shape="pill"
            size="lg"
            icon={ArrowRight}
            iconPosition="right"
            onClick={onStart}
            className="w-full sm:w-auto min-w-48"
          >
            Start Exercises
          </Button>
        </div>
      )}
    </div>
  );
}
