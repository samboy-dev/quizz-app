import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RankingRoutingModule } from './ranking-routing-module';
import { Bracket } from './bracket/bracket';

@NgModule({
  declarations: [Bracket],
  imports: [CommonModule, RouterModule, RankingRoutingModule]
})
export class RankingModule {}
