import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Quiz, Question, UserSession } from '../core/models';
import { QuizService } from '../core/services/quiz';
import { AuthService } from '../core/services/auth';
import {
  AdminLogin, AdminLogout, LoadAllQuizzes, CreateQuiz, UpdateQuiz, DeleteQuiz,
  LoadAdminQuestions, CreateQuestion, UpdateQuestion, DeleteQuestion,
  LoadLiveParticipants, SetQuizStatus
} from './admin.actions';

export interface AdminStateModel {
  isAuthenticated: boolean;
  quizzes: Quiz[];
  activeQuizId: string | null;
  questions: Question[];
  participants: UserSession[];
  loading: boolean;
  error: string | null;
}

@State<AdminStateModel>({
  name: 'admin',
  defaults: { isAuthenticated: false, quizzes: [], activeQuizId: null, questions: [], participants: [], loading: false, error: null }
})
@Injectable()
export class AdminState {
  constructor(private quizService: QuizService, private authService: AuthService) {}

  @Selector() static isAuthenticated(s: AdminStateModel) { return s.isAuthenticated; }
  @Selector() static quizzes(s: AdminStateModel) { return s.quizzes; }
  @Selector() static questions(s: AdminStateModel) { return s.questions; }
  @Selector() static participants(s: AdminStateModel) { return s.participants; }
  @Selector() static loading(s: AdminStateModel) { return s.loading; }
  @Selector() static error(s: AdminStateModel) { return s.error; }
  @Selector() static activeQuizId(s: AdminStateModel) { return s.activeQuizId; }

  @Action(AdminLogin)
  login(ctx: StateContext<AdminStateModel>, { username, password }: AdminLogin) {
    const valid = this.authService.validateAdmin(username, password);
    if (valid) {
      ctx.patchState({ isAuthenticated: true, error: null });
    } else {
      ctx.patchState({ error: 'Invalid credentials' });
    }
  }

  @Action(AdminLogout)
  logout(ctx: StateContext<AdminStateModel>) {
    ctx.patchState({ isAuthenticated: false });
  }

  @Action(LoadAllQuizzes)
  async loadAll(ctx: StateContext<AdminStateModel>) {
    ctx.patchState({ loading: true });
    const quizzes = await this.quizService.getAllQuizzes();
    ctx.patchState({ quizzes, loading: false });
  }

  @Action(CreateQuiz)
  async createQuiz(ctx: StateContext<AdminStateModel>, { quiz }: CreateQuiz) {
    ctx.patchState({ loading: true });
    await this.quizService.createQuiz(quiz);
    const quizzes = await this.quizService.getAllQuizzes();
    ctx.patchState({ quizzes, loading: false });
  }

  @Action(UpdateQuiz)
  async updateQuiz(ctx: StateContext<AdminStateModel>, { id, quiz }: UpdateQuiz) {
    await this.quizService.updateQuiz(id, quiz);
    const quizzes = await this.quizService.getAllQuizzes();
    ctx.patchState({ quizzes });
  }

  @Action(DeleteQuiz)
  async deleteQuiz(ctx: StateContext<AdminStateModel>, { id }: DeleteQuiz) {
    await this.quizService.deleteQuiz(id);
    const quizzes = await this.quizService.getAllQuizzes();
    ctx.patchState({ quizzes });
  }

  @Action(LoadAdminQuestions)
  async loadQuestions(ctx: StateContext<AdminStateModel>, { quizId }: LoadAdminQuestions) {
    ctx.patchState({ loading: true, activeQuizId: quizId });
    const questions = await this.quizService.getQuestions(quizId);
    ctx.patchState({ questions, loading: false });
  }

  @Action(CreateQuestion)
  async createQuestion(ctx: StateContext<AdminStateModel>, { quizId, question }: CreateQuestion) {
    await this.quizService.createQuestion(quizId, question);
    const questions = await this.quizService.getQuestions(quizId);
    ctx.patchState({ questions });
  }

  @Action(UpdateQuestion)
  async updateQuestion(ctx: StateContext<AdminStateModel>, { quizId, questionId, question }: UpdateQuestion) {
    await this.quizService.updateQuestion(quizId, questionId, question);
    const questions = await this.quizService.getQuestions(quizId);
    ctx.patchState({ questions });
  }

  @Action(DeleteQuestion)
  async deleteQuestion(ctx: StateContext<AdminStateModel>, { quizId, questionId }: DeleteQuestion) {
    await this.quizService.deleteQuestion(quizId, questionId);
    const questions = await this.quizService.getQuestions(quizId);
    ctx.patchState({ questions });
  }

  @Action(LoadLiveParticipants)
  async loadParticipants(ctx: StateContext<AdminStateModel>, { quizId }: LoadLiveParticipants) {
    const participants = await this.quizService.getParticipants(quizId);
    ctx.patchState({ participants });
  }

  @Action(SetQuizStatus)
  async setStatus(ctx: StateContext<AdminStateModel>, { quizId, status }: SetQuizStatus) {
    await this.quizService.updateQuiz(quizId, { status });
    const quizzes = await this.quizService.getAllQuizzes();
    ctx.patchState({ quizzes });
  }
}
