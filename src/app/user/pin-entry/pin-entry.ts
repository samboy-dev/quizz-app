import { Component, OnInit, inject, effect } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Store, select } from '@ngxs/store';
import { LoadQuizByPin, ResetQuiz } from '../../store/quiz.actions';
import { QuizState } from '../../store/quiz.state';
import { ResetSession } from '../../store/session.actions';

@Component({
    selector: 'app-pin-entry', templateUrl: './pin-entry.html', styleUrl: './pin-entry.scss',
    imports: [ReactiveFormsModule, RouterLink]
})
export class PinEntry implements OnInit {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private router = inject(Router);

  loading = select(QuizState.loading);
  error = select(QuizState.error);
  activeQuiz = select(QuizState.activeQuiz);

  form!: FormGroup;

  constructor() {
    effect(() => {
      if (this.activeQuiz()) this.router.navigate(['/register']);
    });
  }

  ngOnInit() {
    this.store.dispatch(new ResetQuiz());
    this.store.dispatch(new ResetSession());
    this.form = this.fb.group({ pin: ['', [Validators.required, Validators.minLength(4)]] });
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.store.dispatch(new LoadQuizByPin(this.form.value.pin.trim()));
  }
}
