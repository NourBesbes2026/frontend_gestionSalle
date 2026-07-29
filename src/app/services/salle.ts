import { Injectable } from '@angular/core';
import { HttpClient, HttpParams,HttpHeaders  } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Salle, SalleFilters } from '../models/salle';
import { ApiResponse } from '../models/api-response';


@Injectable({ providedIn: 'root' })
export class SalleService {

  private baseUrl = `${environment.apiUrl}/salles`;

  constructor(private http: HttpClient) {}

  /**
   * GET /api/salles — liste des salles, avec filtres optionnels.
   */
  /*
  getAll(filters: SalleFilters = {}): Observable<Salle[]> {
    let params = new HttpParams();
    if (filters.statut) {
      params = params.set('statut', filters.statut);
    }
    if (filters.capacite_min) {
      params = params.set('capacite_min', filters.capacite_min);
    }

    return this.http
      .get<ApiResponse<Salle[]>>(this.baseUrl, { params })
      .pipe(map(res => res.data));
  }
  */

  getAll(filters: SalleFilters = {}): Observable<Salle[]> {

  let params = new HttpParams();

  if (filters.statut) {
    params = params.set('statut', filters.statut);
  }

  if (filters.capacite_min) {
    params = params.set('capacite_min', filters.capacite_min);
  }

  
let token = '';

if (typeof window !== 'undefined') {
  token = localStorage.getItem('token') || '';
}


  
const headers = new HttpHeaders({
  Authorization: `Bearer ${token}`
});


return this.http
  .get<ApiResponse<Salle[]>>(this.baseUrl, {
    params,
    headers
  })
  .pipe(
    map(res => {
      console.log('Réponse API =', res);
      return res.data;
    })
  );
}
  /**
   * GET /api/salles/{id}
   */
  getById(id: number): Observable<Salle> {
    return this.http
      .get<ApiResponse<Salle>>(`${this.baseUrl}/${id}`)
      .pipe(map(res => res.data));
  }
}




export type {Salle};

