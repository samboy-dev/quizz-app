import { Routes } from '@angular/router';
import { Bracket } from './bracket/bracket';

export const rankingRoutes: Routes = [
  { path: ':quizId', component: Bracket },
  { path: '', redirectTo: '/', pathMatch: 'full' }
];
