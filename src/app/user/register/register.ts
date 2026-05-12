import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store, select } from '@ngxs/store';
import { QuizState } from '../../store/quiz.state';
import { CreateSession } from '../../store/session.actions';
import { LoadQuestions } from '../../store/quiz.actions';

@Component({
    selector: 'app-register', templateUrl: './register.html', styleUrl: './register.scss',
    imports: [ReactiveFormsModule]
})
export class Register implements OnInit {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private router = inject(Router);

  activeQuiz = select(QuizState.activeQuiz);
  form!: FormGroup;
  loading = false;

  ngOnInit() {
    const quiz = this.store.selectSnapshot(QuizState.activeQuiz);
    if (!quiz) { this.router.navigate(['/']); return; }
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{7,15}$/)]]
    });
  }

  async submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    const quiz = this.store.selectSnapshot(QuizState.activeQuiz);
    if (!quiz?.id) { this.loading = false; return; }
    await this.store.dispatch(new LoadQuestions(quiz.id)).toPromise();
    const questions = this.store.selectSnapshot(QuizState.questions);
    await this.store.dispatch(new CreateSession(quiz.id, this.form.value.name, this.form.value.phone, questions.length)).toPromise();
    this.loading = false;
    this.router.navigate(['/question']);
  }
}
