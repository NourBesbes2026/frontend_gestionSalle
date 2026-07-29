export type StatutReservation = 'EN_ATTENTE' | 'VALIDEE' | 'REFUSEE';
export type TypeReservation = 'RECCURENTE' | 'NON_RECCURENTE';
export type TypeReunion = 'REUNION_CLIENTE' | 'REUNION_INTERNE' | 'FORMATION';

export interface Reservation {
  id: number;
  date: string;
  heure_debut: string;
  heure_fin: string;
  sujet: string;
  type_reservation: TypeReservation;
  duree: number;
  type_reunion: TypeReunion;
  statut: StatutReservation;
  utilisateur_id: number;
  salle_id: number;
  groupe_recurrence: string | null;
  user_nom?: string;
  user_prenom?: string;
  salle_nom?: string;
  created_at?: string;
}

export const STATUT_RESERVATION_LABELS: Record<StatutReservation, string> = {
  EN_ATTENTE: 'En attente',
  VALIDEE: 'Validée',
  REFUSEE: 'Refusée',
};

export const TYPE_REUNION_LABELS: Record<TypeReunion, string> = {
  REUNION_CLIENTE: 'Réunion cliente',
  REUNION_INTERNE: 'Réunion interne',
  FORMATION: 'Formation',
};

export interface ConflitReservation {
  salle_alternatives: Array<{ id: number; nom: string; capacite: number }>;
  creneau_en_conflit: { date: string };
}
