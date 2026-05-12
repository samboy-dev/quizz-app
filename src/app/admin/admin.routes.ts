import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';
import { QuizManage } from './quiz-manage/quiz-manage';
import { LiveMonitor } from './live-monitor/live-monitor';
import { AdminGuard } from '../core/guards/admin-guard';

export const adminRoutes: Routes = [
  { path: 'login', component: Login },
  { path: '', component: Dashboard, canActivate: [AdminGuard] },
  { path: 'quiz/:id', component: QuizManage, canActivate: [AdminGuard] },
  { path: 'monitor/:id', component: LiveMonitor, canActivate: [AdminGuard] },
];
