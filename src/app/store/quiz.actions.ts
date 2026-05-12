import { Quiz, Question } from '../core/models';

export class LoadQuizByPin {
  static readonly type = '[Quiz] Load By PIN';
  constructor(public pin: string) {}
}
export class SetActiveQuiz {
  static readonly type = '[Quiz] Set Active';
  constructor(public quiz: Quiz) {}
}
export class LoadQuestions {
  static readonly type = '[Quiz] Load Questions';
  constructor(public quizId: string) {}
}
export class SetQuestions {
  static readonly type = '[Quiz] Set Questions';
  constructor(public questions: Question[]) {}
}
export class NextQuestion {
  static readonly type = '[Quiz] Next Question';
}
export class ResetQuiz {
  static readonly type = '[Quiz] Reset';
}
