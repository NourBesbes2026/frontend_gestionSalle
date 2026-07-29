export type TypeProbleme = 'VIDEOPROJECTEUR' | 'CONNEXION' | 'MATERIEL' | 'PROPRETE' | 'AUTRE';
export type StatutProbleme = 'OUVERT' | 'EN_COURS' | 'RESOLU';

export interface Probleme {
  id: number;
  type_probleme: TypeProbleme;
  commentaire: string;
  date: string;
  statut: StatutProbleme;
  utilisateur_id: number;
  salle_id: number;
  salle_nom?: string;
  user_nom?: string;
  user_prenom?: string;
  created_at?: string;
}

export const TYPE_PROBLEME_LABELS: Record<TypeProbleme, string> = {
  VIDEOPROJECTEUR: 'Vidéoprojecteur',
  CONNEXION: 'Connexion',
  MATERIEL: 'Matériel défectueux',
  PROPRETE: 'Salle non propre',
  AUTRE: 'Autre',
};

export const STATUT_PROBLEME_LABELS: Record<StatutProbleme, string> = {
  OUVERT: 'Ouvert',
  EN_COURS: 'En cours',
  RESOLU: 'Résolu',
};
