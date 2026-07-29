import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Probleme, StatutProbleme } from '../models/probleme.model';

@Injectable({ providedIn: 'root' })
export class ProblemeService {
  private readonly baseUrl = `${environment.apiUrl}/problemes`;

  constructor(private readonly http: HttpClient) {}

  getAll(filters: { statut?: string; salle_id?: number } = {}): Observable<Probleme[]> {
    const query = Object.entries(filters)
      .filter(([, v]) => v !== undefined && v !== null && v !== '')
      .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
      .join('&');

    const url = query ? `${this.baseUrl}?${query}` : this.baseUrl;
    return this.http.get<ApiResponse<Probleme[]>>(url).pipe(map((res) => res.data));
  }

  create(payload: {
    salle_id: number;
    type_probleme: string;
    commentaire: string;
    date?: string;
  }): Observable<ApiResponse<{ id: number }>> {
    return this.http.post<ApiResponse<{ id: number }>>(this.baseUrl, payload);
  }

  updateStatut(id: number, statut: StatutProbleme): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(`${this.baseUrl}/${id}/statut`, { statut });
  }
}
