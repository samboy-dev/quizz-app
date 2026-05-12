import { Quiz, Question } from '../core/models';

export class AdminLogin {
  static readonly type = '[Admin] Login';
  constructor(public username: string, public password: string) {}
}
export class AdminLogout {
  static readonly type = '[Admin] Logout';
}
export class LoadAllQuizzes {
  static readonly type = '[Admin] Load All Quizzes';
}
export class CreateQuiz {
  static readonly type = '[Admin] Create Quiz';
  constructor(public quiz: Partial<Quiz>) {}
}
export class UpdateQuiz {
  static readonly type = '[Admin] Update Quiz';
  constructor(public id: string, public quiz: Partial<Quiz>) {}
}
export class DeleteQuiz {
  static readonly type = '[Admin] Delete Quiz';
  constructor(public id: string) {}
}
export class LoadAdminQuestions {
  static readonly type = '[Admin] Load Questions';
  constructor(public quizId: string) {}
}
export class CreateQuestion {
  static readonly type = '[Admin] Create Question';
  constructor(public quizId: string, public question: Partial<Question>) {}
}
export class UpdateQuestion {
  static readonly type = '[Admin] Update Question';
  constructor(public quizId: string, public questionId: string, public question: Partial<Question>) {}
}
export class DeleteQuestion {
  static readonly type = '[Admin] Delete Question';
  constructor(public quizId: string, public questionId: string) {}
}
export class LoadLiveParticipants {
  static readonly type = '[Admin] Load Live Participants';
  constructor(public quizId: string) {}
}
export class SetQuizStatus {
  static readonly type = '[Admin] Set Quiz Status';
  constructor(public quizId: string, public status: 'waiting' | 'active' | 'finished') {}
}
