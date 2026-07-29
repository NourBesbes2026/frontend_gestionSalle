import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Salle, SalleFormValue } from '../models/salle.model';

@Injectable({ providedIn: 'root' })
export class SalleService {
  private readonly baseUrl = `${environment.apiUrl}/salles`;

  constructor(private readonly http: HttpClient) {}

  getAll(filters: { statut?: string; capacite_min?: number } = {}): Observable<Salle[]> {
    let params = '';
    const query = Object.entries(filters)
      .filter(([, v]) => v !== undefined && v !== null && v !== '')
      .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`);
    if (query.length) {
      params = `?${query.join('&')}`;
    }

    return this.http
      .get<ApiResponse<Salle[]>>(`${this.baseUrl}${params}`)
      .pipe(map((res) => res.data));
  }

  getById(id: number): Observable<Salle> {
    return this.http.get<ApiResponse<Salle>>(`${this.baseUrl}/${id}`).pipe(map((res) => res.data));
  }

  create(payload: SalleFormValue): Observable<ApiResponse<{ id: number }>> {
    return this.http.post<ApiResponse<{ id: number }>>(this.baseUrl, payload);
  }

  update(id: number, payload: Partial<SalleFormValue>): Observable<ApiResponse<Salle>> {
    return this.http.put<ApiResponse<Salle>>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.baseUrl}/${id}`);
  }
}
