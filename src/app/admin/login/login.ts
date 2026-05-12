import { Component, OnInit, inject, effect } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { AdminLogin } from '../../store/admin.actions';
import { AdminState } from '../../store/admin.state';

@Component({ standalone: false, selector: 'app-login', templateUrl: './login.html' })
export class Login implements OnInit {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private router = inject(Router);

  error = this.store.selectSignal(AdminState.error);
  isAuthenticated = this.store.selectSignal(AdminState.isAuthenticated);
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
