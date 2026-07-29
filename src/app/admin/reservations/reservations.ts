import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, FormsModule, StatusBadgeComponent, ConfirmDialogComponent],
  templateUrl: './reservations.html',
  styleUrl: './reservations.css',
})
export class ReservationsComponent implements OnInit {
  private readonly reservationService = inject(ReservationService);
  private readonly toast = inject(ToastService);

  readonly loading = signal(true);
  readonly reservations = signal<Reservation[]>([]);
  readonly statutFilter = signal<StatutReservation | ''>('');
  readonly dateDebut = signal('');
  readonly dateFin = signal('');

  readonly confirmRefusOpen = signal(false);
  readonly reservationToRefuse = signal<Reservation | null>(null);

  readonly statutOptions: StatutReservation[] = ['EN_ATTENTE', 'VALIDEE', 'REFUSEE'];
  readonly statutLabels = STATUT_RESERVATION_LABELS;
  readonly typeReunionLabels = TYPE_REUNION_LABELS;

  readonly enAttenteCount = computed(
    () => this.reservations().filter((r) => r.statut === 'EN_ATTENTE').length
  );

  ngOnInit(): void {
    this.fetchReservations();
  }

  fetchReservations(): void {
    this.loading.set(true);
    this.reservationService
      .getAll({
        statut: this.statutFilter() || undefined,
        date_debut: this.dateDebut() || undefined,
        date_fin: this.dateFin() || undefined,
      })
      .subscribe({
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

  valider(reservation: Reservation): void {
    this.reservationService.valider(reservation.id).subscribe({
      next: () => {
        this.toast.success('Réservation validée.');
        this.fetchReservations();
      },
    });
  }

  askRefuser(reservation: Reservation): void {
    this.reservationToRefuse.set(reservation);
    this.confirmRefusOpen.set(true);
  }

  confirmRefuser(): void {
    const reservation = this.reservationToRefuse();
    if (!reservation) return;

    this.reservationService.refuser(reservation.id).subscribe({
      next: () => {
        this.toast.success('Réservation refusée.');
        this.confirmRefusOpen.set(false);
        this.reservationToRefuse.set(null);
        this.fetchReservations();
      },
    });
  }

  cancelRefuser(): void {
    this.confirmRefusOpen.set(false);
    this.reservationToRefuse.set(null);
  }
}
