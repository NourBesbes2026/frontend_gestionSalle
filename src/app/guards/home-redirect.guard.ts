import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Utilisé sur la route '' pour envoyer chacun vers le bon espace
 * sans exposer d'URL commune entre admin et employé.
 */
export const homeRedirectGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/connexion']);
  }

  return router.createUrlTree([authService.isAdmin() ? '/admin/tableau-de-bord' : '/employe/reservations']);
};
