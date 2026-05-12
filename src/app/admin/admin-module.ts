import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminRoutingModule } from './admin-routing-module';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';
import { QuizManage } from './quiz-manage/quiz-manage';
import { LiveMonitor } from './live-monitor/live-monitor';
import { SharedModule } from '../shared/shared-module';

@NgModule({
  declarations: [Login, Dashboard, QuizManage, LiveMonitor],
  imports: [CommonModule, ReactiveFormsModule, RouterModule, AdminRoutingModule, SharedModule]
})
export class AdminModule {}
