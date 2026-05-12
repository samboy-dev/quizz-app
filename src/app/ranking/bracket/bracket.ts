import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { RankingState } from '../../store/ranking.state';
import { LoadRankings } from '../../store/ranking.actions';
import { UserSession } from '../../core/models';

@Component({ standalone: false, selector: 'app-bracket', templateUrl: './bracket.html', styleUrls: ['./bracket.scss'] })
export class Bracket implements OnInit {
  private route = inject(ActivatedRoute);
  private store = inject(Store);
  private router = inject(Router);

  participants = this.store.selectSignal(RankingState.participants);
  loading = this.store.selectSignal(RankingState.loading);

  quizId = '';

  ngOnInit() {
    this.quizId = this.route.snapshot.paramMap.get('quizId')!;
    this.store.dispatch(new LoadRankings(this.quizId));
  }

  getBarWidth(p: UserSession, all: UserSession[]): number {
    const max = all[0]?.score || 1;
    return Math.max(20, (p.score / Math.max(max, 1)) * 100);
  }

  getInitials(name: string): string {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }

  getRankColor(rank: number): string {
    if (rank === 1) return '#f7c26a';
    if (rank === 2) return '#b0b8c8';
    if (rank === 3) return '#cd7f32';
    return 'var(--primary)';
  }

  goHome() { this.router.navigate(['/']); }
}
