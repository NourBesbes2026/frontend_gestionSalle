import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response';
import { LoginPayload, LoginResult, UserAccount } from '../models/auth';
import { ChangePasswordPayload } from '../models/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private baseUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  /**
   * POST /api/auth/login
   * Stocke le token et l'utilisateur dans le localStorage si succès
   * (le token est ensuite envoyé automatiquement par auth.interceptor.ts).
   */
  login(payload: LoginPayload): Observable<ApiResponse<LoginResult>> {
    return this.http.post<ApiResponse<LoginResult>>(`${this.baseUrl}/login`, payload).pipe(
      tap((res) => {
        if (res.success && res.data) {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('user', JSON.stringify(res.data.user));
        }
      })
    );
  }

  /**
   * POST /api/auth/logout
   */
  logout(): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.baseUrl}/logout`, {}).pipe(
      tap(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      })
    );
  }

  /**
   * GET /api/auth/me
   */
  me(): Observable<ApiResponse<UserAccount>> {
    return this.http.get<ApiResponse<UserAccount>>(`${this.baseUrl}/me`);
  }

  getStoredUser(): UserAccount | null {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  changePassword(payload: ChangePasswordPayload): Observable<ApiResponse<null>> {
  return this.http.put<ApiResponse<null>>(`${this.baseUrl}/password`, payload);}

}