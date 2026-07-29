import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ReservationService } from '../../services/reservation.service';
import { AvisService } from '../../services/avis.service';
import { ToastService } from '../../services/toast.service';
import { Reservation } from '../../models/reservation.model';

@Component({
  selector: 'app-employee-avis',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './avis.component.html',
  styleUrl: './avis.component.scss',
})
export class EmployeeAvisComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly reservationService = inject(ReservationService);
  private readonly avisService = inject(AvisService);
  private readonly toast = inject(ToastService);

  readonly loading = signal(true);
  readonly submitting = signal(false);
  readonly submittedIds = signal<Set<number>>(new Set());

  /** Seules les réservations validées peuvent recevoir un avis. */
  readonly reservationsValidees = signal<Reservation[]>([]);

  readonly form = this.fb.nonNullable.group({
    reservation_id: [0, [Validators.required, Validators.min(1)]],
    confort: [false],
    proprete: [false],
    equipFonctionnel: [false],
    wifi: [false],
    reservationSimple: [false],
    commentaire: [''],
  });

  readonly selectedReservation = computed(() => {
    const id = this.form.controls.reservation_id.value;
    return this.reservationsValidees().find((r) => r.id === Number(id)) ?? null;
  });

  ngOnInit(): void {
    this.reservationService.getAll({ statut: 'VALIDEE' }).subscribe({
      next: (reservations) => {
        this.reservationsValidees.set(reservations);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.submitting.set(true);

    this.avisService
      .create({
        reservation_id: Number(value.reservation_id),
        confort: value.confort,
        proprete: value.proprete,
        equipFonctionnel: value.equipFonctionnel,
        wifi: value.wifi,
        reservationSimple: value.reservationSimple,
        commentaire: value.commentaire,
      })
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.toast.success('Merci, votre avis a bien été enregistré !');
          this.submittedIds.update((set) => new Set(set).add(Number(value.reservation_id)));
          this.form.reset({
            reservation_id: 0,
            confort: false,
            proprete: false,
            equipFonctionnel: false,
            wifi: false,
            reservationSimple: false,
            commentaire: '',
          });
        },
        error: () => this.submitting.set(false),
      });
  }
}
