import { Component, OnInit, inject, effect } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { LoadQuizByPin, ResetQuiz } from '../../store/quiz.actions';
import { QuizState } from '../../store/quiz.state';
import { ResetSession } from '../../store/session.actions';

@Component({ standalone: false, selector: 'app-pin-entry', templateUrl: './pin-entry.html', styleUrls: ['./pin-entry.scss'] })
export class PinEntry implements OnInit {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private router = inject(Router);

  loading = this.store.selectSignal(QuizState.loading);
  error = this.store.selectSignal(QuizState.error);
  activeQuiz = this.store.selectSignal(QuizState.activeQuiz);

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
