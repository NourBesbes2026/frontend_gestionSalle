import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SalleService } from '../services/salle';
import { Salle } from '../models/salle';
import { ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';


/**
 * Page "Salles" — liste des salles de l'entreprise (GET /api/salles).
 */
@Component({
  selector: 'app-salles',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './salles.html',
  styleUrls: ['./salles.css']
})
export class Salles implements OnInit {

  salles: Salle[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  user: any = null;

  // Filtres
  statutFilter: string = '';
  capaciteMinFilter: number | null = null;

  constructor(
  private salleService: SalleService,
  private cdr: ChangeDetectorRef,
  private router: Router,
  private authService:AuthService
) {}


  ngOnInit(): void {

  if (typeof window !== 'undefined') {

    const storedUser = localStorage.getItem('user');

    if (storedUser) {

  this.user = JSON.parse(storedUser);

  console.log('USER = ', this.user);

  this.cdr.detectChanges();
}
  }

  this.loadSalles();
}


  loadSalles(): void {

  console.log('1 - Début loadSalles');

  this.isLoading = true;
  this.errorMessage = '';

  this.salleService
    .getAll({
      statut: this.statutFilter || undefined,
      capacite_min: this.capaciteMinFilter || undefined
    })
    .subscribe({
      next: (salles) => {

  console.log('2 - Salles reçues = ', salles);

  this.salles = salles;

  console.log('3 - Nombre de salles = ', this.salles.length);

  this.isLoading = false;

  console.log('4 - isLoading = ', this.isLoading);

  this.cdr.detectChanges();
},

      error: (err) => {

  console.log('5 - ERREUR = ', err);

  this.errorMessage = 'Impossible de charger la liste des salles.';

  this.isLoading = false;

  console.log('6 - isLoading = ', this.isLoading);

  this.cdr.detectChanges();
}
    });
}

  onFilterChange(): void {
    this.loadSalles();
  }

  resetFilters(): void {
    this.statutFilter = '';
    this.capaciteMinFilter = null;
    this.loadSalles();
  }

  // Mappe le statut backend vers une classe CSS + un libellé lisible
  statutClass(statut: string): string {
    switch (statut) {
      case 'DISPONIBLE': return 'disponible';
      case 'EN_MAINTENANCE': return 'maintenance';
      default: return 'occupee'; // RESERVEE, EN_ATTENTE
    }
  }

reserverSalle(salle: Salle): void {

  if (salle.statut !== 'DISPONIBLE') {
    return;
  }

  this.router.navigate(
    ['/employe/reservations/nouvelle'],
    {
      queryParams: {
        salle: salle.id
      }
    }
  );
}

  statutLabel(statut: string): string {
    switch (statut) {
      case 'DISPONIBLE': return 'Disponible';
      case 'RESERVEE': return 'Réservée';
      case 'EN_MAINTENANCE': return 'Maintenance';
      default: return statut;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
