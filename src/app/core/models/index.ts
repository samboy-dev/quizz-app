export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id?: string;
  text: string;
  options: Option[];
  correctOptionId: string;
  order: number;
}

export interface Quiz {
  id?: string;
  title: string;
  pin: string;
  status: 'waiting' | 'active' | 'finished';
  createdAt: Date | any;
  questionCount?: number;
}

export interface UserSession {
  id?: string;
  quizId: string;
  name: string;
  phone: string;
  score: number;
  totalQuestions: number;
  joinedAt: Date | any;
  completedAt?: Date | any;
  answers?: UserAnswer[];
}

export interface UserAnswer {
  id?: string;
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
}

export interface BracketNode {
  rank: number;
  name: string;
  score: number;
  totalQuestions: number;
  children?: BracketNode[];
}
