import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { AdminState } from '../../store/admin.state';
import { AuthService } from '../services/auth';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private store: Store, private router: Router, private authService: AuthService) {}
  canActivate(): boolean {
    const auth = this.store.selectSnapshot(AdminState.isAuthenticated) || this.authService.isAdminLoggedIn();
    if (!auth) { this.router.navigate(['/admin/login']); return false; }
    return true;
  }
}
