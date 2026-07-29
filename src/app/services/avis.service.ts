import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Avis } from '../models/avis.model';

@Injectable({ providedIn: 'root' })
export class AvisService {
  private readonly baseUrl = `${environment.apiUrl}/avis`;

  constructor(private readonly http: HttpClient) {}

  getAll(filters: { salle_id?: number } = {}): Observable<Avis[]> {
    const query = Object.entries(filters)
      .filter(([, v]) => v !== undefined && v !== null )
      .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
      .join('&');

    const url = query ? `${this.baseUrl}?${query}` : this.baseUrl;
    return this.http.get<ApiResponse<Avis[]>>(url).pipe(map((res) => res.data));
  }

  create(payload: {
    reservation_id: number;
    confort: boolean;
    proprete: boolean;
    equipFonctionnel: boolean;
    wifi: boolean;
    reservationSimple: boolean;
    commentaire: string;
  }): Observable<ApiResponse<{ id: number }>> {
    return this.http.post<ApiResponse<{ id: number }>>(this.baseUrl, payload);
  }
}
