import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { UserSession, UserAnswer } from '../core/models';
import { QuizService } from '../core/services/quiz';
import { CreateSession, SubmitAnswer, CompleteSession, ResetSession } from './session.actions';

export interface SessionStateModel {
  session: UserSession | null;
  answers: UserAnswer[];
  completed: boolean;
}

@State<SessionStateModel>({
  name: 'session',
  defaults: { session: null, answers: [], completed: false }
})
@Injectable()
export class SessionState {
  constructor(private quizService: QuizService) {}

  @Selector() static session(s: SessionStateModel) { return s.session; }
  @Selector() static answers(s: SessionStateModel) { return s.answers; }
  @Selector() static score(s: SessionStateModel) { return s.answers.filter(a => a.isCorrect).length; }
  @Selector() static completed(s: SessionStateModel) { return s.completed; }

  @Action(CreateSession)
  async createSession(ctx: StateContext<SessionStateModel>, { quizId, name, phone, totalQuestions }: CreateSession) {
    const session: UserSession = {
      quizId, name, phone, score: 0, totalQuestions,
      joinedAt: new Date()
    };
    const id = await this.quizService.createSession(session);
    ctx.patchState({ session: { ...session, id }, answers: [], completed: false });
  }

  @Action(SubmitAnswer)
  async submitAnswer(ctx: StateContext<SessionStateModel>, { answer }: SubmitAnswer) {
    const { session, answers } = ctx.getState();
    if (!session?.id) return;
    const newAnswers = [...answers, answer];
    const score = newAnswers.filter(a => a.isCorrect).length;
    await this.quizService.submitAnswer(session.id, answer);
    ctx.patchState({ answers: newAnswers, session: { ...session, score } });
  }

  @Action(CompleteSession)
  async completeSession(ctx: StateContext<SessionStateModel>) {
    const { session, answers } = ctx.getState();
    if (!session?.id) return;
    const score = answers.filter(a => a.isCorrect).length;
    await this.quizService.completeSession(session.id, score);
    ctx.patchState({ completed: true, session: { ...session, score, completedAt: new Date() } });
  }

  @Action(ResetSession)
  reset(ctx: StateContext<SessionStateModel>) {
    ctx.setState({ session: null, answers: [], completed: false });
  }
}
