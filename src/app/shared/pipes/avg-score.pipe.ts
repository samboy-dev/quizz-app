import { Pipe, PipeTransform } from '@angular/core';
import { UserSession } from '../../core/models';
@Pipe({ standalone: false, name: 'avgScore' })
export class AvgScorePipe implements PipeTransform {
  transform(sessions: UserSession[]): number {
    if (!sessions.length) return 0;
    const total = sessions.reduce((acc, s) => acc + (s.totalQuestions ? (s.score / s.totalQuestions) * 100 : 0), 0);
    return Math.round(total / sessions.length);
  }
}
