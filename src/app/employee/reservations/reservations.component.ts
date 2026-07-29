import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReservationService } from '../../services/reservation.service';
import { ToastService } from '../../services/toast.service';
import {
  Reservation,
  STATUT_RESERVATION_LABELS,
  StatutReservation,
  TYPE_REUNION_LABELS,
} from '../../models/reservation.model';
import { StatusBadgeComponent, BadgeTone } from '../../shared/components/status-badge/status-badge.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

const STATUT_TONE: Record<StatutReservation, BadgeTone> = {
  EN_ATTENTE: 'warning',
  VALIDEE: 'success',
  REFUSEE: 'danger',
};

@Component({
  selector: 'app-employee-reservations',
  standalone: true,
  imports: [CommonModule, RouterLink, StatusBadgeComponent, ConfirmDialogComponent],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.scss',
})
export class EmployeeReservationsComponent implements OnInit {
  private readonly reservationService = inject(ReservationService);
  private readonly toast = inject(ToastService);

  readonly loading = signal(true);
  readonly reservations = signal<Reservation[]>([]);

  readonly confirmCancelOpen = signal(false);
  readonly reservationToCancel = signal<Reservation | null>(null);

  readonly statutLabels = STATUT_RESERVATION_LABELS;
  readonly typeReunionLabels = TYPE_REUNION_LABELS;

  ngOnInit(): void {
    this.fetchReservations();
  }

  fetchReservations(): void {
    this.loading.set(true);
    // Le backend filtre automatiquement sur l'utilisateur connecté pour un rôle EMPLOYE.
    this.reservationService.getAll().subscribe({
      next: (reservations) => {
        this.reservations.set(reservations);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  tone(statut: StatutReservation): BadgeTone {
    return STATUT_TONE[statut];
  }

  canCancel(reservation: Reservation): boolean {
    return reservation.statut !== 'REFUSEE';
  }

  askCancel(reservation: Reservation): void {
    this.reservationToCancel.set(reservation);
    this.confirmCancelOpen.set(true);
  }

  confirmCancel(): void {
    const reservation = this.reservationToCancel();
    if (!reservation) return;

    this.reservationService.delete(reservation.id).subscribe({
      next: () => {
        this.toast.success('Réservation annulée.');
        this.confirmCancelOpen.set(false);
        this.reservationToCancel.set(null);
        this.fetchReservations();
      },
    });
  }

  cancelCancel(): void {
    this.confirmCancelOpen.set(false);
    this.reservationToCancel.set(null);
  }
}
