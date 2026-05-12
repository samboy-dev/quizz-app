import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Quiz, Question } from '../core/models';
import { QuizService } from '../core/services/quiz';
import { LoadQuizByPin, SetActiveQuiz, LoadQuestions, SetQuestions, NextQuestion, ResetQuiz } from './quiz.actions';
import { tap } from 'rxjs/operators';

export interface QuizStateModel {
  activeQuiz: Quiz | null;
  questions: Question[];
  currentIndex: number;
  loading: boolean;
  error: string | null;
}

@State<QuizStateModel>({
  name: 'quiz',
  defaults: { activeQuiz: null, questions: [], currentIndex: 0, loading: false, error: null }
})
@Injectable()
export class QuizState {
  constructor(private quizService: QuizService) {}

  @Selector() static activeQuiz(s: QuizStateModel) { return s.activeQuiz; }
  @Selector() static questions(s: QuizStateModel) { return s.questions; }
  @Selector() static currentQuestion(s: QuizStateModel) { return s.questions[s.currentIndex] || null; }
  @Selector() static currentIndex(s: QuizStateModel) { return s.currentIndex; }
  @Selector() static loading(s: QuizStateModel) { return s.loading; }
  @Selector() static error(s: QuizStateModel) { return s.error; }
  @Selector() static isLastQuestion(s: QuizStateModel) { return s.currentIndex >= s.questions.length - 1; }
  @Selector() static progress(s: QuizStateModel) { return s.questions.length ? Math.round(((s.currentIndex) / s.questions.length) * 100) : 0; }

  @Action(LoadQuizByPin)
  async loadByPin(ctx: StateContext<QuizStateModel>, { pin }: LoadQuizByPin) {
    ctx.patchState({ loading: true, error: null });
    try {
      const quiz = await this.quizService.getQuizByPin(pin);
      if (!quiz) {
        ctx.patchState({ loading: false, error: 'Invalid PIN. Please try again.' });
      } else if (quiz.status === 'finished') {
        ctx.patchState({ loading: false, error: 'This quiz has already ended.' });
      } else {
        ctx.patchState({ activeQuiz: quiz, loading: false });
      }
    } catch (e) {
      ctx.patchState({ loading: false, error: 'Something went wrong. Please try again.' });
    }
  }

  @Action(LoadQuestions)
  async loadQuestions(ctx: StateContext<QuizStateModel>, { quizId }: LoadQuestions) {
    const questions = await this.quizService.getQuestions(quizId);
    ctx.patchState({ questions, currentIndex: 0 });
  }

  @Action(SetQuestions)
  setQuestions(ctx: StateContext<QuizStateModel>, { questions }: SetQuestions) {
    ctx.patchState({ questions, currentIndex: 0 });
  }

  @Action(NextQuestion)
  nextQuestion(ctx: StateContext<QuizStateModel>) {
    const { currentIndex, questions } = ctx.getState();
    if (currentIndex < questions.length - 1) {
      ctx.patchState({ currentIndex: currentIndex + 1 });
    }
  }

  @Action(ResetQuiz)
  reset(ctx: StateContext<QuizStateModel>) {
    ctx.setState({ activeQuiz: null, questions: [], currentIndex: 0, loading: false, error: null });
  }
}
