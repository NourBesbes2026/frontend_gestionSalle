import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { AuthResponse, User } from '../models/user.model';

const TOKEN_KEY = 'shf_token';
const USER_KEY = 'shf_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly currentUserSignal = signal<User | null>(
    this.readStoredUser()
  );

  readonly currentUser = computed(() => this.currentUserSignal());
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);
  readonly isAdmin = computed(
    () => this.currentUserSignal()?.role === 'ADMIN'
  );

  constructor(private readonly http: HttpClient) {}

  login(
    email: string,
    password: string
  ): Observable<ApiResponse<AuthResponse>> {
    return this.http
      .post<ApiResponse<AuthResponse>>(
        `${environment.apiUrl}/auth/login`,
        { email, password }
      )
      .pipe(
        tap((res) => {
          if (res.success) {
            this.persistSession(res.data.token, res.data.user);
          }
        })
      );
  }

  register(payload: {
    nom: string;
    prenom: string;
    email: string;
    password: string;
  }): Observable<ApiResponse<{ id: number }>> {
    return this.http.post<ApiResponse<{ id: number }>>(
      `${environment.apiUrl}/auth/register`,
      payload
    );
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }

    this.currentUserSignal.set(null);
  }

  getToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }

    return localStorage.getItem(TOKEN_KEY);
  }

  private persistSession(token: string, user: User): void {
    if (typeof window === 'undefined') {
      return;
    }

    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.currentUserSignal.set(user);
  }

  private readStoredUser(): User | null {
    if (typeof window === 'undefined') {
      return null;
    }

    const raw = localStorage.getItem(USER_KEY);

    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }
}