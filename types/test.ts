import { CEFRLevel, ConnectorType } from './connector';

export interface TestQuestion {
  id: string;
  sentence: string;
  correctAnswer: string;
  options: string[];
  explanation?: string;
  translation?: string;
}

export interface Test {
  id: string;
  title: string;
  description: string;
  cefrLevel: CEFRLevel;
  types: ConnectorType[];
  questions: TestQuestion[];
}

export interface TestResult {
  testId: string;
  score: number;
  totalQuestions: number;
  answers: {
    questionId: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }[];
  completedAt: Date;
}
