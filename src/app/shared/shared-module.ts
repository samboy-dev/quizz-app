import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompletedCountPipe } from './pipes/completed-count.pipe';
import { AvgScorePipe } from './pipes/avg-score.pipe';

@NgModule({
  declarations: [CompletedCountPipe, AvgScorePipe],
  imports: [CommonModule],
  exports: [CompletedCountPipe, AvgScorePipe]
})
export class SharedModule {}
