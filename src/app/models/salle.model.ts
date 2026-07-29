export type StatutSalle = 'DISPONIBLE' | 'RESERVEE' | 'EN_ATTENTE' | 'EN_MAINTENANCE';

export interface Salle {
  id: number;
  nom: string;
  capacite: number;
  statut: StatutSalle;
  equipements: string[];
  created_at?: string;
  updated_at?: string;
}

export interface SalleFormValue {
  nom: string;
  capacite: number;
  statut: StatutSalle;
  equipements: string[];
}

export const STATUT_SALLE_LABELS: Record<StatutSalle, string> = {
  DISPONIBLE: 'Disponible',
  RESERVEE: 'Réservée',
  EN_ATTENTE: 'En attente',
  EN_MAINTENANCE: 'En maintenance',
};
