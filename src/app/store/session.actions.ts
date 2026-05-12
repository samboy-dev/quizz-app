import { UserAnswer } from '../core/models';

export class CreateSession {
  static readonly type = '[Session] Create';
  constructor(public quizId: string, public name: string, public phone: string, public totalQuestions: number) {}
}
export class SubmitAnswer {
  static readonly type = '[Session] Submit Answer';
  constructor(public answer: UserAnswer) {}
}
export class CompleteSession {
  static readonly type = '[Session] Complete';
}
export class ResetSession {
  static readonly type = '[Session] Reset';
}
