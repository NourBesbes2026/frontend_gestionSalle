export interface LoginPayload {
  email: string;
  password: string;
}

/**
 * Correspond à ce que renvoie AuthController::login côté PHP
 * (le champ "password" est retiré côté backend avant l'envoi).
 */
export interface UserAccount {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: 'ADMIN' | 'EMPLOYE';
  created_at?: string;
}

export interface LoginResult {
  token: string;
  user: UserAccount;
}
export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}