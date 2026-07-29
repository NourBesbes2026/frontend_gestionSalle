import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToastService);

  if (authService.isAuthenticated() && authService.isAdmin()) {
    return true;
  }

  if (authService.isAuthenticated()) {
    // Employé authentifié qui tente d'accéder à l'espace admin : renvoi vers son espace.
    return router.createUrlTree(['/employe/reservations']);
  }

  toast.error("Cet espace est réservé à l'administrateur.");
  return router.createUrlTree(['/connexion']);
};
