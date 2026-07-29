import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const employeeGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/connexion']);
  }

  // Un administrateur qui navigue sur /employe est renvoyé vers son propre espace.
  if (authService.isAdmin()) {
    return router.createUrlTree(['/admin/tableau-de-bord']);
  }

  return true;
};
