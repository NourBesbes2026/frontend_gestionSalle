import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { SalleService } from '../../../services/salle.service';
import { ReservationService } from '../../../services/reservation.service';
import { ToastService } from '../../../services/toast.service';
import { Salle } from '../../../models/salle.model';
import { ConflitReservation, Reservation, TYPE_REUNION_LABELS, TypeReunion } from '../../../models/reservation.model';

/** Statut d'un créneau dans la grille de disponibilité (calculé côté front, pas persisté). */
type CreneauStatut = 'DISPONIBLE' | 'OCCUPEE' | 'MAINTENANCE';

interface CreneauCell {
  heure: string;
  statut: CreneauStatut;
}

interface PlanningRow {
  salle: Salle;
  creneaux: CreneauCell[];
}

@Component({
  selector: 'app-reservation-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './reservation-form.component.html',
  styleUrl: './reservation-form.component.scss',
})
export class ReservationFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly salleService = inject(SalleService);
  private readonly reservationService = inject(ReservationService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  readonly loadingSalles = signal(true);
  readonly submitting = signal(false);
  readonly salles = signal<Salle[]>([]);
  readonly conflit = signal<ConflitReservation | null>(null);

  readonly typeReunionOptions: TypeReunion[] = ['FORMATION', 'REUNION_INTERNE', 'REUNION_CLIENTE'];
  readonly typeReunionLabels = TYPE_REUNION_LABELS;

  readonly form = this.fb.nonNullable.group({
    salle_id: [0, [Validators.required, Validators.min(1)]],
    date: ['', Validators.required],
    heure_debut: ['', Validators.required],
    heure_fin: ['', Validators.required],
    sujet: ['', Validators.required],
    type_reunion: ['FORMATION' as TypeReunion, Validators.required],
    est_recurrente: [false],
    frequence: ['WEEKLY' as 'WEEKLY' | 'MONTHLY'],
    occurrences: [4, [Validators.min(1), Validators.max(52)]],
  });

  readonly selectedSalle = computed(() => {
    const id = this.form.controls.salle_id.value;
    return this.salles().find((s) => s.id === Number(id)) ?? null;
  });

  // ---- Calendrier de disponibilité (à côté du formulaire) ----

  /** Créneaux horaires affichés dans la grille. Ajuste si tes salles ont d'autres horaires d'ouverture. */
  readonly HEURES: string[] = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00',
  ];

  readonly loadingPlanning = signal(true);
  readonly allSalles = signal<Salle[]>([]);
  readonly planningReservations = signal<Reservation[]>([]);
  readonly calendarDate = signal(this.todayIso());

  readonly calendarDateLabel = computed(() => {
    const d = this.parseIsoDate(this.calendarDate());
    const label = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(d);
    return label.charAt(0).toUpperCase() + label.slice(1);
  });

  readonly isToday = computed(() => this.calendarDate() === this.todayIso());

  readonly planningRows = computed<PlanningRow[]>(() => {
    const reservations = this.planningReservations();
    return this.allSalles().map((salle) => ({
      salle,
      creneaux: this.HEURES.map((heure) => ({
        heure,
        statut: this.creneauStatut(salle, heure, reservations),
      })),
    }));
  });

  ngOnInit(): void {
    this.salleService.getAll({ statut: 'DISPONIBLE' }).subscribe({
      next: (salles) => {
        this.salles.set(salles);
        this.loadingSalles.set(false);
      },
      error: () => this.loadingSalles.set(false),
    });

    // Toutes les salles (y compris en maintenance) pour donner une vue d'ensemble dans le calendrier.
    this.salleService.getAll().subscribe({
      next: (salles) => this.allSalles.set(salles),
      error: () => this.allSalles.set([]),
    });

    this.loadPlanning(this.calendarDate());
  }

  private loadPlanning(date: string): void {
    this.loadingPlanning.set(true);
    this.reservationService.getPlanning({ date_debut: date, date_fin: date }).subscribe({
      next: (reservations) => {
        this.planningReservations.set(reservations);
        this.loadingPlanning.set(false);
      },
      error: () => this.loadingPlanning.set(false),
    });
  }

  previousDay(): void {
    this.shiftCalendarDate(-1);
  }

  nextDay(): void {
    this.shiftCalendarDate(1);
  }

  goToToday(): void {
    const iso = this.todayIso();
    this.calendarDate.set(iso);
    this.loadPlanning(iso);
  }

  onCalendarDateChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    if (!value) return;
    this.calendarDate.set(value);
    this.loadPlanning(value);
  }

  private shiftCalendarDate(deltaDays: number): void {
    const d = this.parseIsoDate(this.calendarDate());
    d.setDate(d.getDate() + deltaDays);
    const iso = this.toIso(d);
    this.calendarDate.set(iso);
    this.loadPlanning(iso);
  }

  /** Sélectionne un créneau libre dans la grille et pré-remplit le formulaire. */
  selectCreneau(salle: Salle, heure: string, statut: CreneauStatut): void {
    if (statut !== 'DISPONIBLE') return;

    this.form.patchValue({
      salle_id: salle.id,
      date: this.calendarDate(),
      heure_debut: heure,
      heure_fin: this.addOneHour(heure),
    });
    this.conflit.set(null);
    this.toast.info('Créneau sélectionné. Complétez le sujet puis envoyez votre demande.');
  }

  private creneauStatut(salle: Salle, heure: string, reservations: Reservation[]): CreneauStatut {
    // Adapte 'MAINTENANCE' si le statut de salle utilise une autre valeur dans ton API.
    if ((salle as unknown as { statut?: string }).statut === 'MAINTENANCE') {
      return 'MAINTENANCE';
    }

    const heureFin = this.addOneHour(heure);
    const occupe = reservations.some(
      (r) =>
        (r as unknown as { salle_id?: number }).salle_id === salle.id &&
        r.statut !== 'REFUSEE' &&
        r.heure_debut < heureFin &&
        r.heure_fin > heure,
    );

    return occupe ? 'OCCUPEE' : 'DISPONIBLE';
  }

  private addOneHour(heure: string): string {
    const [h, m] = heure.split(':').map(Number);
    const total = h * 60 + m + 60;
    const hh = Math.floor(total / 60) % 24;
    const mm = total % 60;
    return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
  }

  private todayIso(): string {
    return this.toIso(new Date());
  }

  private toIso(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  private parseIsoDate(iso: string): Date {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, (m ?? 1) - 1, d ?? 1);
  }

  // ---- Formulaire (inchangé) ----

  private computeDuree(): number {
    const { heure_debut, heure_fin } = this.form.getRawValue();
    if (!heure_debut || !heure_fin) return 0;
    const [h1, m1] = heure_debut.split(':').map(Number);
    const [h2, m2] = heure_fin.split(':').map(Number);
    return Math.max(0, h2 * 60 + m2 - (h1 * 60 + m1));
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    if (value.heure_debut >= value.heure_fin) {
      this.toast.error("L'heure de début doit être inférieure à l'heure de fin.");
      return;
    }

    const duree = this.computeDuree();
    this.conflit.set(null);
    this.submitting.set(true);

    this.reservationService
      .create({
        salle_id: Number(value.salle_id),
        date: value.date,
        heure_debut: value.heure_debut,
        heure_fin: value.heure_fin,
        sujet: value.sujet,
        duree,
        type_reunion: value.type_reunion,
        type_reservation: value.est_recurrente ? 'RECCURENTE' : 'NON_RECCURENTE',
        ...(value.est_recurrente
          ? { recurrence: { frequence: value.frequence, occurrences: Number(value.occurrences) } }
          : {}),
      })
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.toast.success('Votre demande de réservation a été envoyée et est en attente de validation.');
          this.router.navigateByUrl('/employe/reservations');
        },
        error: (err: HttpErrorResponse) => {
          this.submitting.set(false);
          if (err.status === 409 && err.error?.errors) {
            this.conflit.set(err.error.errors as ConflitReservation);
          }
        },
      });
  }

  applySuggestion(salleId: number): void {
    this.form.controls.salle_id.setValue(salleId);
    this.conflit.set(null);
    this.toast.info('Salle alternative sélectionnée. Vous pouvez valider votre demande.');
  }
}