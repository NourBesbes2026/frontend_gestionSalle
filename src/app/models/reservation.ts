/**
 * Types et interfaces liés aux réservations.
 * L'orthographe "RECCURENTE" (double C) vient du backend PHP, on la garde
 * telle quelle pour que les valeurs envoyées correspondent exactement.
 */
export type TypeReservation = 'NON_RECCURENTE' | 'RECCURENTE';
export type TypeReunion = 'REUNION_CLIENT' | 'REUNION_INTERNE' | 'FORMATION';

export interface Recurrence {
  frequence: 'WEEKLY' | 'MONTHLY';
  occurrences: number;
}

/**
 * Payload attendu par ReservationController::store.
 */
export interface ReservationPayload {
  salle_id: number;
  date: string;          // format 'YYYY-MM-DD'
  heure_debut: string;   // format 'HH:mm'
  heure_fin: string;     // format 'HH:mm'
  sujet: string;
  duree: number;
  type_reunion: TypeReunion;
  type_reservation: TypeReservation;
  recurrence?: Recurrence; // uniquement si type_reservation === 'RECCURENTE'
}

/**
 * Forme brute renvoyée par ReservationController (voir Reservation.php).
 */
export interface Reservation {
  id: number;
  date: string;
  heure_debut: string;
  heure_fin: string;
  sujet: string;
  type_reservation: TypeReservation;
  duree: number;
  type_reunion: TypeReunion;
  statut: 'EN_ATTENTE' | 'VALIDEE' | 'REFUSEE';
  utilisateur_id: number;
  salle_id: number;
  user_nom?: string;
  user_prenom?: string;
  salle_nom?: string;
}

export interface ReservationFilters {
  statut?: string;
  salle_id?: number;
  date_debut?: string;
  date_fin?: string;
}
