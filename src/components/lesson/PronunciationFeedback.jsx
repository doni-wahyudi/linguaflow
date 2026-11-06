/**
 * @file PronunciationFeedback.jsx
 * @description Renders real-time pronunciation evaluation metrics with word-by-word
 * color-coded pills (Green = accurate, Amber = partial, Red = missed) and overall accuracy gauge.
 */

import React from 'react';
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import Badge from '../ui/Badge';
import Card from '../ui/Card';
import AudioControls from '../ui/AudioControls';

/**
 * @param {object} props
 * @param {object} props.evaluation - Return object from scorePronunciation()
 * @param {string} props.targetText - Original target sentence
 * @param {string} [props.langCode='es']
 * @param {object} [props.speech]
 * @param {string} [props.className]
 * @returns {JSX.Element|null}
 */
export default function PronunciationFeedback({
  evaluation,
  targetText,
  langCode = 'es',
  speech,
  className = '',
}) {
  if (!evaluation) return null;

  const { score, passed, tokens = [], feedback } = evaluation;

  const badgeVariant = score >= 85 ? 'success' : score >= 70 ? 'brand' : 'amber';
  const Icon = score >= 85 ? CheckCircle2 : score >= 70 ? AlertCircle : XCircle;

  return (
    <Card
      padding="sm"
      tone={passed ? 'brand' : 'quiet'}
      className={`space-y-3 sm:space-y-4 text-center sm:text-left ${className}`}
    >
      {/* Top summary row: Accuracy Badge, Score, and Native Audio Button */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <Badge variant={badgeVariant} size="md" className="font-bold">
            <Icon className="w-4 h-4 mr-1 inline-block" aria-hidden="true" />
            {score}% Accurate
          </Badge>
          <span className="text-body-sm font-semibold text-ink-900">
            {passed ? 'Passed Evaluation' : 'Needs Practice'}
          </span>
        </div>

        {speech && targetText && (
          <div className="flex items-center gap-1.5 text-caption text-ink-500">
            <span>Model:</span>
            <AudioControls text={targetText} lang={langCode} speech={speech} />
          </div>
        )}
      </div>

      {/* Word-by-word token analysis */}
      <div>
        <p className="text-caption uppercase font-semibold text-ink-500 mb-2 text-left">
          Word-by-word pronunciation breakdown:
        </p>
        <div className="flex flex-wrap items-center gap-2" role="list" aria-label="Spoken words breakdown">
          {tokens.map((token, idx) => {
            let colorClasses = 'bg-danger-50 text-danger-700 border-danger-200';
            let label = 'Missed';
            if (token.status === 'correct') {
              colorClasses = 'bg-success-50 text-success-700 border-success-200';
              label = 'Accurate';
            } else if (token.status === 'partial') {
              colorClasses = 'bg-amber-50 text-amber-900 border-amber-200';
              label = 'Partial match';
            }

            return (
              <span
                key={`${token.word}-${idx}`}
                role="listitem"
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-pill text-body-sm font-medium border ${colorClasses}`}
                title={`${token.word}: ${label} (${Math.round(token.similarity * 100)}%)`}
              >
                <span>{token.word}</span>
                <span className="text-[11px] opacity-75 tabular-nums">
                  {Math.round(token.similarity * 100)}%
                </span>
              </span>
            );
          })}
        </div>
      </div>

      {/* Qualitative Feedback Hint */}
      {feedback && (
        <p className="text-body-sm text-ink-700 italic text-left pt-1">
          💡 {feedback}
        </p>
      )}
    </Card>
  );
}
