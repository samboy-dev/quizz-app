import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store, select } from '@ngxs/store';
import { AdminState } from '../../store/admin.state';
import { LoadAdminQuestions, CreateQuestion, UpdateQuestion, DeleteQuestion } from '../../store/admin.actions';
import { Question } from '../../core/models';

@Component({
    selector: 'app-quiz-manage', templateUrl: './quiz-manage.html', styleUrl: './quiz-manage.scss',
    imports: [ReactiveFormsModule]
})
export class QuizManage implements OnInit {
  private route = inject(ActivatedRoute);
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  questions = select(AdminState.questions);
  loading = select(AdminState.loading);

  quizId = '';
  showModal = false;
  editingId: string | null = null;
  form!: FormGroup;

  ngOnInit() {
    this.quizId = this.route.snapshot.paramMap.get('id')!;
    this.store.dispatch(new LoadAdminQuestions(this.quizId));
    this.initForm();
  }

  initForm(q?: Question) {
    this.form = this.fb.group({
      text: [q?.text || '', [Validators.required, Validators.minLength(5)]],
      options: this.fb.array([
        this.fb.group({ id: [q?.options[0]?.id || 'a'], text: [q?.options[0]?.text || '', Validators.required] }),
        this.fb.group({ id: [q?.options[1]?.id || 'b'], text: [q?.options[1]?.text || '', Validators.required] }),
        this.fb.group({ id: [q?.options[2]?.id || 'c'], text: [q?.options[2]?.text || '', Validators.required] }),
        this.fb.group({ id: [q?.options[3]?.id || 'd'], text: [q?.options[3]?.text || '', Validators.required] }),
      ]),
      correctOptionId: [q?.correctOptionId || 'a', Validators.required],
      order: [q?.order || 0]
    });
  }

  get optionsArray() { return this.form.get('options') as FormArray; }

  openCreate() { this.editingId = null; this.initForm(); this.showModal = true; }

  openEdit(q: Question) {
    this.editingId = q.id!;
    this.initForm(q);
    this.showModal = true;
  }

  closeModal() { this.showModal = false; this.editingId = null; }

  saveQuestion() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const questions = this.questions();
    const val = { ...this.form.value, order: questions.length };
    if (this.editingId) {
      this.store.dispatch(new UpdateQuestion(this.quizId, this.editingId, val));
    } else {
      this.store.dispatch(new CreateQuestion(this.quizId, val));
    }
    this.closeModal();
  }

  deleteQuestion(id: string) {
    if (confirm('Delete this question?')) this.store.dispatch(new DeleteQuestion(this.quizId, id));
  }

  getLabel(i: number) { return String.fromCharCode(65 + i); }
  back() { this.router.navigate(['/admin']); }
}
