export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: unknown;
}

export interface ReservationParMois {
  mois: string;
  total: number;
}

export interface ProblemeParStatut {
  statut: string;
  total: number;
}

export interface DashboardStats {
  nombre_total_salles: number;
  salles_disponibles: number;
  salles_occupees: number;
  taux_occupation: number;
  reservations_par_mois: ReservationParMois[];
  reservations_validees: number;
  reservations_refusees: number;
  reservations_en_attente: number;
  nombre_problemes: number;
  problemes_par_statut: ProblemeParStatut[];
  nombre_avis: number;
}
