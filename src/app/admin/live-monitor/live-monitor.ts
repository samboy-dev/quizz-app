import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngxs/store';
import { interval, Subscription } from 'rxjs';
import { AdminState } from '../../store/admin.state';
import { LoadLiveParticipants } from '../../store/admin.actions';
import { CompletedCountPipe } from '../../shared/pipes/completed-count.pipe';
import { AvgScorePipe } from '../../shared/pipes/avg-score.pipe';

@Component({
    selector: 'app-live-monitor', templateUrl: './live-monitor.html', styleUrl: './live-monitor.scss',
    imports: [CompletedCountPipe, AvgScorePipe]
})
export class LiveMonitor implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private store = inject(Store);
  private router = inject(Router);

  participants = select(AdminState.participants);

  quizId = '';
  private pollSub?: Subscription;
  autoRefresh = true;

  ngOnInit() {
    this.quizId = this.route.snapshot.paramMap.get('id')!;
    this.load();
    this.pollSub = interval(5000).subscribe(() => { if (this.autoRefresh) this.load(); });
  }

  load() { this.store.dispatch(new LoadLiveParticipants(this.quizId)); }
  back() { this.router.navigate(['/admin']); }
  viewRanking() { this.router.navigate(['/ranking', this.quizId]); }

  ngOnDestroy() { this.pollSub?.unsubscribe(); }
}
