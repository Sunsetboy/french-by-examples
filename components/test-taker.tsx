'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Test } from '@/types/test';
import { shuffleArray } from '@/lib/utils';

interface TestTakerProps {
  test: Test;
}

export function TestTaker({ test }: TestTakerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [shuffledOptions] = useState<Record<string, string[]>>(() => {
    const shuffled: Record<string, string[]> = {};
    test.questions.forEach((question) => {
      shuffled[question.id] = shuffleArray(question.options);
    });
    return shuffled;
  });

  const currentQuestion = test.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === test.questions.length - 1;

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    if (selectedAnswer) {
      setAnswers({ ...answers, [currentQuestion.id]: selectedAnswer });
      setSelectedAnswer(null);

      if (isLastQuestion) {
        setShowResults(true);
      } else {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(answers[test.questions[currentQuestionIndex - 1].id] || null);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    test.questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setAnswers({});
    setShowResults(false);
  };

  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / test.questions.length) * 100);

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Test Results
          </h1>

          <div className="text-center mb-8">
            <div className="text-6xl font-bold mb-4">
              <span className={percentage >= 70 ? 'text-green-600 dark:text-green-400' : percentage >= 50 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}>
                {percentage}%
              </span>
            </div>
            <p className="text-xl text-gray-700 dark:text-gray-300">
              {score} out of {test.questions.length} correct
            </p>
          </div>

          <div className="space-y-6 mb-8">
            {test.questions.map((question, index) => {
              const userAnswer = answers[question.id];
              const isCorrect = userAnswer === question.correctAnswer;

              return (
                <div
                  key={question.id}
                  className={`p-4 rounded-lg border-2 ${
                    isCorrect
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  }`}
                >
                  <p className="font-medium text-gray-900 dark:text-white mb-2">
                    {index + 1}. {question.sentence}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {question.translation}
                  </p>
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="font-semibold">Your answer:</span>{' '}
                      <span className={isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}>
                        {userAnswer}
                      </span>
                    </p>
                    {!isCorrect && (
                      <p className="text-sm">
                        <span className="font-semibold">Correct answer:</span>{' '}
                        <span className="text-green-700 dark:text-green-300">
                          {question.correctAnswer}
                        </span>
                      </p>
                    )}
                  </div>
                  {question.explanation && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 italic">
                      {question.explanation}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleRestart}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Retake Test
            </button>
            <Link
              href="/tests"
              className="px-6 py-3 bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-center"
            >
              Back to Tests
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const options = shuffledOptions[currentQuestion.id] || currentQuestion.options;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="mb-8 text-sm">
        <Link href="/tests" className="text-blue-600 dark:text-blue-400 hover:underline">
          ← Back to tests
        </Link>
      </nav>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {test.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Question {currentQuestionIndex + 1} of {test.questions.length}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-8">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{
              width: `${((currentQuestionIndex + 1) / test.questions.length) * 100}%`,
            }}
          />
        </div>

        {/* Question */}
        <div className="mb-8">
          <p className="text-xl font-medium text-gray-900 dark:text-white mb-4">
            {currentQuestion.sentence}
          </p>
          {currentQuestion.translation && (
            <p className="text-gray-600 dark:text-gray-400 italic">
              {currentQuestion.translation}
            </p>
          )}
        </div>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswerSelect(option)}
              className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                selectedAnswer === option
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-gray-900 dark:text-white'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-2 bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={!selectedAnswer}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLastQuestion ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
