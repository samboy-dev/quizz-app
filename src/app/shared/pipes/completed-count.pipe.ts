import { Pipe, PipeTransform } from '@angular/core';
import { UserSession } from '../../core/models';
@Pipe({ name: 'completedCount' })
export class CompletedCountPipe implements PipeTransform {
  transform(sessions: UserSession[]): number {
    return sessions.filter(s => s.completedAt).length;
  }
}
