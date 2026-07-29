import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Reservation, ReservationPayload, ReservationFilters } from '../models/reservation';
import { ApiResponse } from '../models/api-response';

@Injectable({ providedIn: 'root' })
export class ReservationService {

  private baseUrl = `${environment.apiUrl}/reservations`;

  constructor(private http: HttpClient) {}

  /**
   * GET /api/reservations — utile pour construire la grille de disponibilité
   * (filtrer avec date_debut = date_fin = la date affichée).
   */
  getAll(filters: ReservationFilters = {}): Observable<ApiResponse<Reservation[]>> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value as string);
      }
    });

    return this.http.get<ApiResponse<Reservation[]>>(this.baseUrl, { params });
  }

  /**
   * POST /api/reservations
   * En cas de conflit (409), le backend renvoie aussi des salles alternatives
   * dans l'erreur (voir ReservationController::store) — à gérer dans le composant.
   */
  create(payload: ReservationPayload): Observable<ApiResponse<{ ids: number[] }>> {
    return this.http.post<ApiResponse<{ ids: number[] }>>(this.baseUrl, payload);
  }

  valider(id: number): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(`${this.baseUrl}/${id}/valider`, {});
  }

  refuser(id: number): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(`${this.baseUrl}/${id}/refuser`, {});
  }

  remove(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.baseUrl}/${id}`);
  }
}
