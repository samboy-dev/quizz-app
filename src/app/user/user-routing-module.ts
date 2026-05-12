import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PinEntry } from './pin-entry/pin-entry';
import { Register } from './register/register';
import { Question } from './question/question';
import { Result } from './result/result';
import { SessionGuard } from '../core/guards/session-guard';

const routes: Routes = [
  { path: '', component: PinEntry },
  { path: 'register', component: Register },
  { path: 'question', component: Question, canActivate: [SessionGuard] },
  { path: 'result', component: Result, canActivate: [SessionGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}
