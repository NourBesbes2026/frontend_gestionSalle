import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const serverMessage = error.error?.message as string | undefined;

      if (error.status === 401) {
        authService.logout();
        router.navigate(['/connexion']);
        toast.error(serverMessage ?? 'Session expirée, veuillez vous reconnecter.');
      } else if (error.status === 403) {
        toast.error(serverMessage ?? 'Accès refusé : privilèges insuffisants.');
      } else if (error.status === 409) {
        toast.error(serverMessage ?? 'Conflit détecté sur cette ressource.');
      } else if (error.status === 0) {
        toast.error('Impossible de joindre le serveur. Vérifiez votre connexion.');
      } else {
        toast.error(serverMessage ?? 'Une erreur est survenue, veuillez réessayer.');
      }

      return throwError(() => error);
    })
  );
};
