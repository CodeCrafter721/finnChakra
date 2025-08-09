import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = 'http://localhost:8080/api/users';
  private tokenKey = 'jwtToken';
  private logoutTimer: any;

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService
  ) {}

  

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.api}/login`, { email, password }).pipe(
      tap((res: any) => {
        if (res.token) {
          localStorage.setItem(this.tokenKey, res.token);
          this.startTokenExpiryWatcher();
        }
      })
    );
  }

  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.api}/register`, { name, email, password });
  }

  logout(): void {
    this.clearTokenWatcher();
    localStorage.removeItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.jwtHelper.isTokenExpired(token);
  }

  autoLogoutIfExpired(): void {
    const token = this.getToken();
    if (token && this.jwtHelper.isTokenExpired(token)) {
      this.logout();
      window.location.href = '/auth/login';
    } else {
      this.startTokenExpiryWatcher();
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUserRole(): string | null {
    const payload = this.decodeTokenPayload();
    return payload?.role?.replace('ROLE_', '') || null;
  }

  getUserEmail(): string | null {
    const payload = this.decodeTokenPayload();
    return payload?.sub || null;
  }

  private decodeTokenPayload(): any | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const base64Payload = token.split('.')[1];
      const decodedPayload = atob(base64Payload);
      return JSON.parse(decodedPayload);
    } catch (err) {
      console.error('Invalid JWT token:', err);
      return null;
    }
  }

  startTokenExpiryWatcher(): void {
    this.clearTokenWatcher();

    const token = this.getToken();
    if (!token) return;

    const expirationDate = this.jwtHelper.getTokenExpirationDate(token);
    if (!expirationDate) return;

    const expiresInMs = expirationDate.getTime() - new Date().getTime();
    if (expiresInMs <= 0) return;

    if (expiresInMs > 60000) {
      setTimeout(() => {
        alert('⚠️ Your session will expire in 1 minute. Please save your work!');
      }, expiresInMs - 60000);
    }

    this.logoutTimer = setTimeout(() => {
      this.logout();
      window.location.href = '/auth/login';
      alert('🔒 Session expired. Please login again.');
    }, expiresInMs);
  }

  clearTokenWatcher(): void {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
      this.logoutTimer = null;
    }
  }
}
