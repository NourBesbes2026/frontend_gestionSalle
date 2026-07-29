export interface Avis {
  id: number;
  confort: boolean;
  proprete: boolean;
  equip_fonctionnel: boolean;
  wifi: boolean;
  reservation_simple: boolean;
  commentaire: string | null;
  reservation_id: number;
  utilisateur_id: number;
  salle_id: number;
  salle_nom?: string;
  user_nom?: string;
  user_prenom?: string;
  created_at?: string;
}
