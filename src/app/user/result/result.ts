import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngxs/store';
import { SessionState } from '../../store/session.state';
import { QuizState } from '../../store/quiz.state';

@Component({
    selector: 'app-result', templateUrl: './result.html', styleUrl: './result.scss'
})
export class Result implements OnInit {
  private store = inject(Store);
  private router = inject(Router);

  session = select(SessionState.session);
  score = select(SessionState.score);
  quiz = select(QuizState.activeQuiz);
  questions = select(QuizState.questions);

  quizId: string = '';
  percentage = 0;

  ngOnInit() {
    const session = this.store.selectSnapshot(SessionState.session);
    const questions = this.store.selectSnapshot(QuizState.questions);
    if (!session) { this.router.navigate(['/']); return; }
    this.quizId = session.quizId;
    const score = this.store.selectSnapshot(SessionState.score);
    this.percentage = questions.length ? Math.round((score / questions.length) * 100) : 0;
  }

  goToRanking() { this.router.navigate(['/ranking', this.quizId]); }
  playAgain() { this.router.navigate(['/']); }

  getEmoji(): string {
    if (this.percentage >= 80) return '🏆';
    if (this.percentage >= 60) return '🎯';
    if (this.percentage >= 40) return '👍';
    return '💪';
  }
}
