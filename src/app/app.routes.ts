import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  { path: '', loadChildren: () => import('./user/user.routes').then(m => m.userRoutes) },
  { path: 'admin', loadChildren: () => import('./admin/admin.routes').then(m => m.adminRoutes) },
  { path: 'ranking', loadChildren: () => import('./ranking/ranking.routes').then(m => m.rankingRoutes) },
  { path: '**', redirectTo: '' }
];
