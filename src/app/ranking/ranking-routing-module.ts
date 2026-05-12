import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Bracket } from './bracket/bracket';

const routes: Routes = [
  { path: ':quizId', component: Bracket },
  { path: '', redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RankingRoutingModule {}
