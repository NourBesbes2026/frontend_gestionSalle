/**
 * Forme brute renvoyée par SalleController (voir Salle.php).
 */
export interface Salle {
  id: number;
  nom: string;
  capacite: number;
  statut: 'DISPONIBLE' | 'RESERVEE' | 'EN_ATTENTE' | 'EN_MAINTENANCE';
  equipements: string[];
  created_at?: string;
}

export interface SalleFilters {
  statut?: string;
  capacite_min?: number;
}
