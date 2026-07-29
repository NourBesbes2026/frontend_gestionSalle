import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../services/auth';
import { UserAccount } from '../models/auth';
import { ChangeDetectorRef } from '@angular/core';
/**
 * Page "Informations personnelles" — profil de l'utilisateur connecté.
 * Sidebar/topbar affichent dynamiquement le nom, les initiales et le rôle
 * de l'utilisateur connecté (via AuthService).
 */
@Component({
  selector: 'app-informations-personnelles',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './informations-personnelles.html',
  styleUrls: ['./informations-personnelles.css']
})
export class InformationsPersonnelles implements OnInit {

  user: UserAccount | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';

  // Formulaire de changement de mot de passe
  passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  isSavingPassword: boolean = false;
  passwordError: string = '';
  passwordSuccess: string = '';

  constructor(private authService: AuthService, private router: Router , private cdr:ChangeDetectorRef) {}

  ngOnInit(): void {
    // Affichage immédiat depuis le localStorage (sidebar/topbar remplis sans attendre le réseau)
    this.user = this.authService.getStoredUser();
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.me().subscribe({
      next: (res) => {
        this.user = res.data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger votre profil.';
        this.isLoading = false;
      }
    });
  }

  // Utilisé par la sidebar/topbar ET la carte profil
  initials(): string {
    if (!this.user) return '';
    return `${this.user.prenom?.[0] ?? ''}${this.user.nom?.[0] ?? ''}`.toUpperCase();
  }

  roleLabel(role: string | undefined): string {
    return role === 'ADMIN' ? 'Administrateur RH' : 'Employé';
  }

  changePassword(): void {
  this.passwordError = '';
  this.passwordSuccess = '';

  if (!this.passwordForm.currentPassword || !this.passwordForm.newPassword) {
    this.passwordError = 'Merci de remplir tous les champs.';
    return;
  }

  if (this.passwordForm.newPassword.length < 6) {
    this.passwordError = 'Le nouveau mot de passe doit contenir au moins 6 caractères.';
    return;
  }

  if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
    this.passwordError = 'Les deux mots de passe ne correspondent pas.';
    return;
  }

  console.log('1 - DEBUT appel, isSavingPassword =', this.isSavingPassword);
  this.isSavingPassword = true;
  console.log('2 - APRES mise a true, isSavingPassword =', this.isSavingPassword);

  this.authService.changePassword({
    currentPassword: this.passwordForm.currentPassword,
    newPassword: this.passwordForm.newPassword
  }).subscribe({
    next: (res) => {
      console.log('3 - SUCCES recu', res);
      this.isSavingPassword = false;
      console.log('4 - APRES mise a false, isSavingPassword =', this.isSavingPassword);
      this.passwordSuccess = 'Mot de passe mis à jour avec succès.';
      this.passwordForm = { currentPassword: '', newPassword: '', confirmPassword: '' };
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.log('3-ERR - ERREUR recue', err);
      this.isSavingPassword = false;
      this.passwordError = err.error?.message || 'Impossible de mettre à jour le mot de passe.';
      this.cdr.detectChanges();
    }
  });
}

  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login'])
    });
  }
}
