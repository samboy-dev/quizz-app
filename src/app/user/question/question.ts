import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { QuizState } from '../../store/quiz.state';
import { SessionState } from '../../store/session.state';
import { SubmitAnswer, CompleteSession } from '../../store/session.actions';
import { NextQuestion } from '../../store/quiz.actions';
import { Option } from '../../core/models';

@Component({ standalone: false, selector: 'app-question', templateUrl: './question.html', styleUrls: ['./question.scss'] })
export class Question implements OnInit {
  private store = inject(Store);
  private router = inject(Router);

  currentQuestion = this.store.selectSignal(QuizState.currentQuestion);
  currentIndex = this.store.selectSignal(QuizState.currentIndex);
  questions = this.store.selectSignal(QuizState.questions);
  progress = this.store.selectSignal(QuizState.progress);
  isLast = this.store.selectSignal(QuizState.isLastQuestion);
  score = this.store.selectSignal(SessionState.score);

  selectedOptionId: string | null = null;
  answered = false;
  correctOptionId: string | null = null;
  transitioning = false;

  ngOnInit() {
    const session = this.store.selectSnapshot(SessionState.session);
    if (!session) { this.router.navigate(['/']); return; }
    const questions = this.store.selectSnapshot(QuizState.questions);
    if (!questions?.length) { this.router.navigate(['/']); }
  }

  selectOption(option: Option) {
    if (this.answered) return;
    this.selectedOptionId = option.id;
    const q = this.currentQuestion();
    if (!q) return;
    this.answered = true;
    this.correctOptionId = q.correctOptionId;
    const isCorrect = option.id === q.correctOptionId;
    this.store.dispatch(new SubmitAnswer({ questionId: q.id!, selectedOptionId: option.id, isCorrect }));
  }

  async next() {
    if (this.transitioning) return;
    this.transitioning = true;
    const isLast = this.isLast();
    if (isLast) {
      await this.store.dispatch(new CompleteSession()).toPromise();
      this.router.navigate(['/result']);
    } else {
      this.store.dispatch(new NextQuestion());
      this.selectedOptionId = null;
      this.answered = false;
      this.correctOptionId = null;
      this.transitioning = false;
    }
  }

  optionClass(option: Option): string {
    if (!this.answered) return this.selectedOptionId === option.id ? 'selected' : '';
    if (option.id === this.correctOptionId) return 'correct';
    if (option.id === this.selectedOptionId) return 'wrong';
    return '';
  }

  getLabel(i: number): string { return String.fromCharCode(65 + i); }
}
