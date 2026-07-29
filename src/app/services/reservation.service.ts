import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Reservation, TypeReservation, TypeReunion } from '../models/reservation.model';

export interface ReservationFilters {
  statut?: string;
  salle_id?: number;
  date_debut?: string;
  date_fin?: string;
}

export interface ReservationCreatePayload {
  salle_id: number;
  date: string;
  heure_debut: string;
  heure_fin: string;
  sujet: string;
  duree: number;
  type_reunion: TypeReunion;
  type_reservation: TypeReservation;
  recurrence?: { frequence: 'WEEKLY' | 'MONTHLY'; occurrences: number };
}

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private readonly baseUrl = `${environment.apiUrl}/reservations`;

  constructor(private readonly http: HttpClient) {}

  getAll(filters: ReservationFilters = {}): Observable<Reservation[]> {
    const query = Object.entries(filters)
      .filter(([, v]) => v !== undefined && v !== null && v !== '')
      .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
      .join('&');

    const url = query ? `${this.baseUrl}?${query}` : this.baseUrl;

    return this.http.get<ApiResponse<Reservation[]>>(url).pipe(map((res) => res.data));
  }

  create(payload: ReservationCreatePayload): Observable<ApiResponse<{ ids: number[] }>> {
    return this.http.post<ApiResponse<{ ids: number[] }>>(this.baseUrl, payload);
  }

  valider(id: number): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(`${this.baseUrl}/${id}/valider`, {});
  }

  refuser(id: number): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(`${this.baseUrl}/${id}/refuser`, {});
  }

  delete(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.baseUrl}/${id}`);
  }

 

 getPlanning(params?: any): Observable<Reservation[]> {
  return this.http
    .get<ApiResponse<Reservation[]>>(`${this.baseUrl}/planning`, { params })
    .pipe(map((res) => res.data));
}

}
