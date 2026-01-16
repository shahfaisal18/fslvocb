
export enum Difficulty {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
  RANDOM = 'Random'
}

export interface Word {
  id: string;
  term: string;
  meaning: string;
  partOfSpeech: string;
  example: string;
  synonyms: string[];
  antonyms: string[];
  difficulty: Difficulty;
  isLearned?: boolean;
  savedAt?: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface UserProgress {
  learnedCount: number;
  streak: number;
  lastActive: string;
  history: { date: string; count: number }[];
}

export interface User {
  name: string;
  email: string;
  isLoggedIn: boolean;
}
