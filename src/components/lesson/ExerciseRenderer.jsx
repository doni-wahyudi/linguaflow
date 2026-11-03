/**
 * @file ExerciseRenderer.jsx
 * @description Dynamic exercise dispatcher that maps exercise types to their component views.
 */

import React from 'react';
import FlashCard from './FlashCard';
import MultipleChoice from './MultipleChoice';
import FillBlank from './FillBlank';
import MatchPairs from './MatchPairs';
import WritingCanvas from '../writing/WritingCanvas';

export default function ExerciseRenderer({
  exercise,
  vocabularyMap = {},
  langCode = 'es',
  onAnswer,
  disabled = false,
}) {
  if (!exercise) return null;

  switch (exercise.type) {
    case 'writing': {
      const vocab = vocabularyMap[exercise.wordId] || exercise;
      const target = exercise.character || vocab?.word || exercise.word || '';
      return (
        <div className="w-full text-center">
          <div className="mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-pill inline-block mb-1">
              Handwriting Practice
            </span>
            <h2 className="font-display font-bold text-2xl text-ink-900">
              {exercise.prompt || `Practice writing "${target}"`}
            </h2>
            {exercise.translation && (
              <p className="text-sm text-ink-500 mt-1">Meaning: {exercise.translation}</p>
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

    default:
      return (
        <div className="p-8 text-center text-ink-500">
          Unknown exercise type: <code>{exercise.type}</code>
        </div>
      );
  }
}

