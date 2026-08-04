'use client';

import { useMemo, useState } from 'react';
import { QuizQuestion } from '@/types';
import { QUIZ_PASS_THRESHOLD } from '@/lib/quiz';

interface EpisodeQuizProps {
  quiz: QuizQuestion[];
  onPass: (score: number) => void;
  onFail?: (score: number) => void;
}

interface ShuffledQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

function shuffleQuestion(q: QuizQuestion): ShuffledQuestion {
  const order = q.options.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return {
    question: q.question,
    options: order.map((i) => q.options[i]),
    correctIndex: order.indexOf(q.correctIndex),
  };
}

export default function EpisodeQuiz({ quiz, onPass, onFail }: EpisodeQuizProps) {
  const [attempt, setAttempt] = useState(0);
  const shuffled = useMemo(
    () => quiz.map(shuffleQuestion),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [quiz, attempt]
  );

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  if (quiz.length === 0) {
    return null;
  }

  const current = shuffled[index];
  const isLast = index === shuffled.length - 1;
  const passed = correctCount >= QUIZ_PASS_THRESHOLD;

  const handleSelect = (optionIndex: number) => {
    if (selected !== null) return;
    setSelected(optionIndex);
    if (optionIndex === current.correctIndex) {
      setCorrectCount((c) => c + 1);
    }
  };

  const handleNext = () => {
    if (isLast) {
      const finalScore = correctCount;
      setFinished(true);
      if (finalScore >= QUIZ_PASS_THRESHOLD) {
        onPass(finalScore);
      } else {
        onFail?.(finalScore);
      }
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
  };

  const handleRetry = () => {
    setAttempt((a) => a + 1);
    setIndex(0);
    setSelected(null);
    setCorrectCount(0);
    setFinished(false);
  };

  if (finished && !passed) {
    return (
      <div className="card-antiquarian p-8 text-center animate-fade-in-up">
        <h3 className="font-display text-2xl font-bold text-ink mb-2">
          {correctCount}/{quiz.length} — Not quite
        </h3>
        <p className="font-body text-sepia mb-6">
          You need {QUIZ_PASS_THRESHOLD}/{quiz.length} to earn XP and unlock badges for this episode. Give it another go — the questions are the same, but shuffled.
        </p>
        <button onClick={handleRetry} className="btn-primary !px-6 !py-3">
          Try Again
        </button>
      </div>
    );
  }

  if (finished && passed) {
    return (
      <div className="card-antiquarian p-8 text-center animate-fade-in-up">
        <h3 className="font-display text-2xl font-bold text-ink mb-2">
          {correctCount}/{quiz.length} — Nailed it
        </h3>
        <p className="font-body text-sepia">
          XP and badge progress for this episode are unlocked.
        </p>
      </div>
    );
  }

  return (
    <div className="card-antiquarian p-8 animate-fade-in-up">
      <div className="flex items-center justify-between mb-4">
        <span className="tag-empire text-xs">
          Question {index + 1} of {shuffled.length}
        </span>
        <span className="font-body text-xs text-sepia-light">
          {correctCount} correct so far
        </span>
      </div>

      <h3 className="font-display text-xl font-bold text-ink mb-6">
        {current.question}
      </h3>

      <div className="space-y-3">
        {current.options.map((option, i) => {
          const isSelected = selected === i;
          const isCorrectOption = i === current.correctIndex;
          const revealState = selected !== null;

          let stateClasses = 'border-brass/20 hover:border-brass/50';
          if (revealState && isCorrectOption) {
            stateClasses = 'border-green-600 bg-green-50 text-green-900';
          } else if (revealState && isSelected && !isCorrectOption) {
            stateClasses = 'border-burgundy bg-burgundy/5 text-burgundy';
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={revealState}
              className={`w-full text-left px-5 py-3 rounded-lg border-2 font-body text-ink transition-colors ${stateClasses} ${revealState ? 'cursor-default' : 'cursor-pointer'}`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div className="mt-6 flex justify-end">
          <button onClick={handleNext} className="btn-primary !px-6 !py-2.5">
            {isLast ? 'See Results' : 'Next Question'}
          </button>
        </div>
      )}
    </div>
  );
}
