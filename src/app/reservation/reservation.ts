import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Salle } from '../models/salle';

import { ReservationPayload, TypeReunion, TypeReservation } from '../models/reservation';
import { SalleService } from '../services/salle';
import { ReservationService } from '../services/reservation';
import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';

/**
 * Page "Réserver une salle" — Plateforme de réservation de salles de réunion
 * Connectée à l'API PHP (SalleService + ReservationService).
 */
@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './reservation.html',
  styleUrls: ['./reservation.css']
})
export class Reservation implements OnInit {

  // Colonnes horaires affichées dans la grille (usage visuel uniquement pour l'instant)
  hours: string[] = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  // Date affichée / utilisée pour la réservation
  selectedDate: string = new Date().toISOString().split('T')[0];

  // Salles chargées depuis l'API
  rooms: Salle[] = [];
  isLoadingRooms: boolean = false;
  loadRoomsError: string = '';

  // Modèle du formulaire — les noms correspondent à ce qu'attend ReservationController::store
  form = {
    salle_id: null as number | null,
    sujet: '',
    date: this.selectedDate,
    heure_debut: '09:30',
    heure_fin: '11:30',
    duree: 60,
    type_reunion: '' as TypeReunion | '',
    type_reservation: '' as TypeReservation | '',
    frequence: 'WEEKLY' as 'WEEKLY' | 'MONTHLY',
    occurrences: 4
  };

  isSubmitting: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  salleAlternatives: Salle[] = [];
  user: any = null;

  constructor(
    private salleService: SalleService,
    private reservationService: ReservationService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
  ) {}
/*
  ngOnInit(): void {

  if (typeof window !== 'undefined') {

    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      this.user = JSON.parse(storedUser);
      console.log('USER CONNECTE =', this.user);
    }

  }

  this.loadRooms();
}
  */


ngOnInit(): void {

  this.route.queryParams.subscribe(params => {

    if (params['salle']) {

      this.form.salle_id = Number(params['salle']);

      console.log('Salle sélectionnée =', this.form.salle_id);
    }

  });

  this.loadRooms();
}

  // Mappe le statut renvoyé par le backend (DISPONIBLE, RESERVEE, EN_ATTENTE, EN_MAINTENANCE)
  // vers les classes CSS déjà définies dans reservation.css (disponible, occupee, maintenance)
  roomStatusClass(statut: string): string {
    switch (statut) {
      case 'DISPONIBLE': return 'disponible';
      case 'EN_MAINTENANCE': return 'maintenance';
      default: return 'occupee'; // RESERVEE, EN_ATTENTE
    }
  }

  loadRooms(): void {
    this.isLoadingRooms = true;
    this.loadRoomsError = '';

    this.salleService.getAll({ statut: 'DISPONIBLE' }).subscribe({
      next: (salles) => {
        console.log('Salles reçues Angular :', salles);

        this.rooms = salles;

        console.log('rooms =', this.rooms);

        this.isLoadingRooms = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadRoomsError = 'Impossible de charger la liste des salles.';
        this.isLoadingRooms = false;
        this.cdr.detectChanges();
      }
    });
  }

  goToPreviousDay(): void {
    this.shiftDate(-1);
  }

  goToNextDay(): void {
    this.shiftDate(1);
  }

  goToToday(): void {
    this.selectedDate = new Date().toISOString().split('T')[0];
  }

  private shiftDate(days: number): void {
    const current = new Date(this.selectedDate);
    current.setDate(current.getDate() + days);
    this.selectedDate = current.toISOString().split('T')[0];
  }

  onSubmit(): void {
    console.log('1 - onSubmit appelé');
    this.errorMessage = '';
    this.successMessage = '';
    this.salleAlternatives = [];

    console.log('2 - Form', this.form);
    if (!this.form.sujet || !this.form.salle_id || !this.form.date || !this.form.type_reunion || !this.form.type_reservation) {
      this.errorMessage = 'Merci de compléter tous les champs obligatoires.';

       console.log('3 - Validation échouée');
      return;
    }
   

    if (this.form.heure_debut >= this.form.heure_fin) {
      this.errorMessage = "L'heure de début doit être avant l'heure de fin.";
      return;
    }

    console.log('4 - Validation OK');

    const payload: ReservationPayload = {
      salle_id: this.form.salle_id,
      date: this.form.date,
      heure_debut: this.form.heure_debut,
      heure_fin: this.form.heure_fin,
      sujet: this.form.sujet,
      duree: this.form.duree,
      type_reunion: this.form.type_reunion as TypeReunion,
      type_reservation: this.form.type_reservation as TypeReservation
    };
    console.log('5 - Payload', payload);
    // On n'ajoute "recurrence" que si la réservation est récurrente
    if (this.form.type_reservation === 'RECCURENTE') {
      payload.recurrence = {
        frequence: this.form.frequence,
        occurrences: this.form.occurrences
      };
    }

    this.isSubmitting = true;
    console.log('6 - Avant appel API');
    this.reservationService.create(payload).subscribe({
      next: (res) => {

        console.log('SUCCESS', res);

        this.isSubmitting = false;

        this.successMessage =
          res.message || 'Réservation créée avec succès.';

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('8 - ERROR', err);
        this.isSubmitting = false;

        // Le backend renvoie 409 + des salles alternatives en cas de conflit d'horaire
        if (err.status === 409) {
          this.errorMessage = err.error?.message || 'Conflit de réservation sur ce créneau.';
          this.salleAlternatives = err.error?.data?.salle_alternatives || [];
           this.cdr.detectChanges();
        } else {
          this.errorMessage = err.error?.message || 'Impossible de réserver cette salle.';
           this.cdr.detectChanges();
        }
      }
    });
  }}