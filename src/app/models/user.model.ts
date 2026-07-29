export type Role = 'ADMIN' | 'EMPLOYE';

export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: Role;
  created_at?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
