import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly ADMIN_KEY = 'quizapp_admin';

  validateAdmin(username: string, password: string): boolean {
    const valid = username === environment.adminCredentials.username &&
                  password === environment.adminCredentials.password;
    if (valid) sessionStorage.setItem(this.ADMIN_KEY, 'true');
    return valid;
  }

  isAdminLoggedIn(): boolean {
    return sessionStorage.getItem(this.ADMIN_KEY) === 'true';
  }

  logout(): void {
    sessionStorage.removeItem(this.ADMIN_KEY);
  }
}
