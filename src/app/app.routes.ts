import { Routes } from '@angular/router';
import { Reservation } from './reservation/reservation';
import { Connexion } from './connexion/connexion';
import { Salles } from './salles/salles';
import { InformationsPersonnelles } from './informations-personnelles/informations-personnelles';
import { homeRedirectGuard } from './guards/home-redirect.guard';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { employeeGuard } from './guards/employee.guard';

export const routes: Routes = [
  { path: 'reservation', component: Reservation },
  { path: 'login', component: Connexion },
  { path: 'salles', component: Salles },
  { path: 'profil', component: InformationsPersonnelles },

  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },

  {
    path: 'admin',
    // canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./admin/layout/layout').then((m) => m.AdminLayoutComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'tableau-de-bord' },
      {
        path: 'tableau-de-bord',
        loadComponent: () =>
          import('./admin/dashboard/dashboard').then((m) => m.DashboardComponent),
        title: 'Tableau de bord',
      },
      {
        path: 'salles',
        loadComponent: () =>
          import('./admin/salles/salles').then((m) => m.SallesComponent),
        title: 'Salles',
      },
      {
        path: 'reservations',
        loadComponent: () =>
          import('./admin/reservations/reservations').then((m) => m.ReservationsComponent),
        title: 'Réservations',
      },
      {
        path: 'problemes',
        loadComponent: () =>
          import('./admin/problemes/problemes').then((m) => m.ProblemesComponent),
        title: 'Problèmes signalés',
      },
      {
        path: 'avis',
        loadComponent: () =>
          import('./admin/avis/avis').then((m) => m.AvisComponent),
        title: 'Avis',
      },
    ],
  },

  {
    path: 'employe',
    // canActivate: [authGuard, employeeGuard],
    loadComponent: () =>
      import('./employee/layout/employee-layout.component').then(
        (m) => m.EmployeeLayoutComponent
      ),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'reservations' },
      {
        path: 'reservations',
        loadComponent: () =>
          import('./employee/reservations/reservations.component').then(
            (m) => m.EmployeeReservationsComponent
          ),
        title: 'Mes réservations',
      },
      {
        path: 'reservations/nouvelle',
        loadComponent: () =>
          import('./employee/reservations/reservation-form/reservation-form.component').then(
            (m) => m.ReservationFormComponent
          ),
        title: 'Réserver une salle',
      },
      {
        path: 'problemes',
        loadComponent: () =>
          import('./employee/problemes/problemes.component').then(
            (m) => m.EmployeeProblemesComponent
          ),
        title: 'Signaler un problème',
      },
      {
        path: 'avis',
        loadComponent: () =>
          import('./employee/avis/avis.component').then(
            (m) => m.EmployeeAvisComponent
          ),
        title: 'Donner un avis',
      },
    ],
  },

  {
    path: '**',
    redirectTo: 'login'
  }
];