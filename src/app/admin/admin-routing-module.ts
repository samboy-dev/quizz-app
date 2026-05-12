import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';
import { QuizManage } from './quiz-manage/quiz-manage';
import { LiveMonitor } from './live-monitor/live-monitor';
import { AdminGuard } from '../core/guards/admin-guard';

const routes: Routes = [
  { path: 'login', component: Login },
  { path: '', component: Dashboard, canActivate: [AdminGuard] },
  { path: 'quiz/:id', component: QuizManage, canActivate: [AdminGuard] },
  { path: 'monitor/:id', component: LiveMonitor, canActivate: [AdminGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
