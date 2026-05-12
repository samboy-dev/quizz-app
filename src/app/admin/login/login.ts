import { Component, OnInit, inject, effect } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Store, select } from '@ngxs/store';
import { AdminLogin } from '../../store/admin.actions';
import { AdminState } from '../../store/admin.state';

@Component({
    selector: 'app-login', templateUrl: './login.html', styleUrl: './login.scss',
    imports: [ReactiveFormsModule, RouterLink]
})
export class Login implements OnInit {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private router = inject(Router);

  error = select(AdminState.error);
  isAuthenticated = select(AdminState.isAuthenticated);
  form!: FormGroup;

  constructor() {
    effect(() => {
      if (this.isAuthenticated()) this.router.navigate(['/admin']);
    });
  }

  ngOnInit() {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.store.dispatch(new AdminLogin(this.form.value.username, this.form.value.password));
  }
}
