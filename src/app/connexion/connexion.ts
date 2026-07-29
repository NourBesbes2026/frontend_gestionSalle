import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth';
import { ChangeDetectorRef } from '@angular/core';

/**
 * Page de connexion — Sopra HR Software
 * Connectée à AuthController::login (POST /api/auth/login).
 *
 * Le rôle choisi dans l'onglet (Employé / Administrateur RH) sert
 * uniquement de vérification côté front : le vrai rôle vient du compte
 * renvoyé par le backend. Si l'utilisateur se trompe d'onglet, on l'informe
 * plutôt que de le laisser accéder au mauvais espace.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './connexion.html',
  styleUrls: ['./connexion.css']
})
export class Connexion {

  role: 'rh' | 'employe' = 'employe';

  email: string = '';
  password: string = '';
  showPassword: boolean = false;

  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private router: Router, private authService: AuthService, private cdr:ChangeDetectorRef) {}

  selectRole(role: 'rh' | 'employe'): void {
    this.role = role;
    this.errorMessage = '';
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Merci de renseigner votre identifiant et votre mot de passe.';
      return;
    }

    this.isLoading = true;

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.isLoading = false;

        const actualRole = res.data.user.role; // 'ADMIN' | 'EMPLOYE'
        this.cdr.detectChanges();
        const expectedRole = this.role === 'rh' ? 'ADMIN' : 'EMPLOYE';

        if (actualRole !== expectedRole) {
          this.errorMessage = this.role === 'rh'
            ? "Ce compte n'a pas les droits administrateur RH."
            : "Ce compte est un compte administrateur, utilisez l'onglet Administrateur RH.";
          // On annule la session ouverte par erreur côté front
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          return;
        }

        this.router.navigate([actualRole === 'ADMIN' ? '/admin/tableau-de-bord' : '/employe/reservations']);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.status === 401
          ? 'Identifiants incorrects.'
          : (err.error?.message || 'Impossible de se connecter pour le moment.');
      }
    });
  }
}
