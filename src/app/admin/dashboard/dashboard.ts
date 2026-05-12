import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store, select } from '@ngxs/store';
import { AdminState } from '../../store/admin.state';
import { LoadAllQuizzes, CreateQuiz, DeleteQuiz, AdminLogout, SetQuizStatus } from '../../store/admin.actions';
import { Quiz } from '../../core/models';

@Component({
    selector: 'app-dashboard', templateUrl: './dashboard.html', styleUrl: './dashboard.scss',
    imports: [ReactiveFormsModule]
})
export class Dashboard implements OnInit {
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  quizzes = select(AdminState.quizzes);
  loading = select(AdminState.loading);

  showModal = false;
  createForm!: FormGroup;

  ngOnInit() {
    this.store.dispatch(new LoadAllQuizzes());
    this.createForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      pin: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]]
    });
  }

  openModal() { this.showModal = true; }
  closeModal() { this.showModal = false; this.createForm.reset(); }

  createQuiz() {
    if (this.createForm.invalid) { this.createForm.markAllAsTouched(); return; }
    this.store.dispatch(new CreateQuiz({ title: this.createForm.value.title, pin: this.createForm.value.pin, status: 'waiting' }));
    this.closeModal();
  }

  deleteQuiz(id: string) {
    if (confirm('Delete this quiz and all its questions?')) this.store.dispatch(new DeleteQuiz(id));
  }

  manageQuestions(id: string) { this.router.navigate(['/admin/quiz', id]); }
  monitor(id: string) { this.router.navigate(['/admin/monitor', id]); }
  viewRanking(id: string) { this.router.navigate(['/ranking', id]); }

  setStatus(quiz: Quiz, status: 'waiting' | 'active' | 'finished') {
    this.store.dispatch(new SetQuizStatus(quiz.id!, status));
  }

  logout() {
    this.store.dispatch(new AdminLogout());
    this.router.navigate(['/admin/login']);
  }
}
