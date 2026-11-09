/**
 * @file ExerciseRenderer.jsx
 * @description Dynamic exercise dispatcher that maps exercise types to their
 * component views.
 */

import React from 'react';
import FlashCard from './FlashCard';
import MultipleChoice from './MultipleChoice';
import FillBlank from './FillBlank';
import MatchPairs from './MatchPairs';
import WritingCanvas from '../writing/WritingCanvas';
import SpeakingExercise from './SpeakingExercise';
import SentenceBuilder from './SentenceBuilder';
import DialoguePlayer from './DialoguePlayer';
import { Badge, Card } from '../ui';

/* The renderer is the only place that knows an exercise has no matching case, so
   the fallback is a real message rather than a blank panel. */
function UnknownExercise({ type }) {
  return (
    <Card padding="lg" tone="quiet" className="text-center">
      <p className="text-body-md font-semibold text-ink-900">This exercise can’t be shown</p>
      <p className="text-body-sm text-ink-500 mt-1">
        Unrecognised exercise type: <code className="font-mono text-caption">{type}</code>
      </p>
    </Card>
  );
}

export default function ExerciseRenderer({
  exercise,
  vocabularyMap = {},
  langCode = 'es',
  onAnswer,
  disabled = false,
  showFurigana = true,
  showRomaji = false,
}) {
  if (!exercise) return null;

  switch (exercise.type) {
    case 'writing': {
      const vocab = vocabularyMap[exercise.wordId] || exercise;
      const target = exercise.character || vocab?.word || exercise.word || '';
      return (
        <div className="w-full text-center">
          <div className="mb-4">
            <Badge variant="brand" uppercase size="md" className="mb-1">
              Handwriting practice
            </Badge>
            <h2 className="font-display font-bold text-display-md text-ink-900">
              {exercise.prompt || `Practice writing “${target}”`}
            </h2>
            {exercise.translation && (
              <p className="text-body-sm text-ink-500 mt-1">Meaning: {exercise.translation}</p>
            )}
          </div>
          <WritingCanvas
            targetCharacter={target}
            gridType={exercise.gridType || (langCode === 'ja' ? 'rice' : 'lined')}
            expectedStrokes={exercise.strokeCount || vocab?.strokeCount}
            onComplete={(isCorrect) => onAnswer(isCorrect)}
          />
        </div>
      );
    }
    case 'flashcard': {
      const vocab = vocabularyMap[exercise.wordId] || exercise;
      return (
        <FlashCard
          word={vocab.word}
          translation={vocab.translation}
          pronunciation={vocab.pronunciation}
          example={vocab.example}
          exampleTranslation={vocab.exampleTranslation}
          langCode={langCode}
          onComplete={(isCorrect) => onAnswer(isCorrect)}
        />
      );
    }

    case 'multipleChoice':
      return (
        <MultipleChoice
          question={exercise.question}
          options={exercise.options}
          correctIndex={exercise.correctIndex}
          explanation={exercise.explanation}
          onAnswer={onAnswer}
          disabled={disabled}
          showFurigana={showFurigana}
          showRomaji={showRomaji}
        />
      );

    case 'fillBlank':
      return (
        <FillBlank
          sentence={exercise.sentence}
          answer={exercise.answer}
          hint={exercise.hint}
          translation={exercise.translation}
          onAnswer={onAnswer}
          disabled={disabled}
        />
      );

    case 'matchPairs':
      return (
        <MatchPairs
          prompt={exercise.prompt}
          pairs={exercise.pairs}
          onComplete={onAnswer}
          disabled={disabled}
        />
      );

    case 'typing':
      return (
        <FillBlank
          sentence={`___ : ${exercise.prompt}`}
          answer={exercise.answer}
          hint={exercise.hint}
          translation={exercise.prompt}
          onAnswer={onAnswer}
          disabled={disabled}
        />
      );

    case 'speaking':
      return (
        <SpeakingExercise
          exercise={exercise}
          langCode={langCode}
          onAnswer={onAnswer}
          disabled={disabled}
        />
      );

    case 'scramble':
    case 'sentenceBuilder':
      return (
        <SentenceBuilder
          exercise={exercise}
          langCode={langCode}
          onAnswer={onAnswer}
          disabled={disabled}
          showFurigana={showFurigana}
          showRomaji={showRomaji}
        />
      );

    case 'dialogue':
    case 'roleplay':
      return (
        <DialoguePlayer
          exercise={exercise}
          langCode={langCode}
          onAnswer={onAnswer}
          disabled={disabled}
          showFurigana={showFurigana}
          showRomaji={showRomaji}
        />
      );

    default:
      return <UnknownExercise type={exercise.type} />;
  }
}

