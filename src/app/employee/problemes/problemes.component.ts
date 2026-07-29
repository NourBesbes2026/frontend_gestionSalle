import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SalleService } from '../../services/salle.service';
import { ProblemeService } from '../../services/probleme.service';
import { ToastService } from '../../services/toast.service';
import { Salle } from '../../models/salle.model';
import { TYPE_PROBLEME_LABELS, TypeProbleme } from '../../models/probleme.model';

interface SignalementRecent {
  salleNom: string;
  type: string;
  date: string;
}

@Component({
  selector: 'app-employee-problemes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './problemes.component.html',
  styleUrl: './problemes.component.scss',
})
export class EmployeeProblemesComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly salleService = inject(SalleService);
  private readonly problemeService = inject(ProblemeService);
  private readonly toast = inject(ToastService);

  readonly loadingSalles = signal(true);
  readonly submitting = signal(false);
  readonly salles = signal<Salle[]>([]);
  readonly recentSignalements = signal<SignalementRecent[]>([]);

  readonly typeOptions: TypeProbleme[] = ['VIDEOPROJECTEUR', 'CONNEXION', 'MATERIEL', 'PROPRETE', 'AUTRE'];
  readonly typeLabels = TYPE_PROBLEME_LABELS;

  readonly form = this.fb.nonNullable.group({
    salle_id: [0, [Validators.required, Validators.min(1)]],
    type_probleme: ['AUTRE' as TypeProbleme, Validators.required],
    commentaire: ['', [Validators.required, Validators.minLength(10)]],
  });

  ngOnInit(): void {
    this.salleService.getAll().subscribe({
      next: (salles) => {
        this.salles.set(salles);
        this.loadingSalles.set(false);
      },
      error: () => this.loadingSalles.set(false),
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const salle = this.salles().find((s) => s.id === Number(value.salle_id));

    this.submitting.set(true);
    this.problemeService
      .create({
        salle_id: Number(value.salle_id),
        type_probleme: value.type_probleme,
        commentaire: value.commentaire,
      })
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.toast.success('Problème signalé avec succès. Merci pour votre retour !');
          this.recentSignalements.update((list) => [
            {
              salleNom: salle?.nom ?? '—',
              type: this.typeLabels[value.type_probleme],
              date: new Date().toLocaleString('fr-FR'),
            },
            ...list,
          ]);
          this.form.reset({ salle_id: 0, type_probleme: 'AUTRE', commentaire: '' });
        },
        error: () => this.submitting.set(false),
      });
  }
}
