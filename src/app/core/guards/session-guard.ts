import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { SessionState } from '../../store/session.state';

@Injectable({ providedIn: 'root' })
export class SessionGuard implements CanActivate {
  constructor(private store: Store, private router: Router) {}
  canActivate(): boolean {
    const session = this.store.selectSnapshot(SessionState.session);
    if (!session) { this.router.navigate(['/']); return false; }
    return true;
  }
}
