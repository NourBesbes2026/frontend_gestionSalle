import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProblemeService } from '../../services/probleme.service';
import { ToastService } from '../../services/toast.service';
import {
  Probleme,
  STATUT_PROBLEME_LABELS,
  StatutProbleme,
  TYPE_PROBLEME_LABELS,
} from '../../models/probleme.model';
import { StatusBadgeComponent, BadgeTone } from '../../shared/components/status-badge/status-badge.component';

const STATUT_TONE: Record<StatutProbleme, BadgeTone> = {
  OUVERT: 'danger',
  EN_COURS: 'warning',
  RESOLU: 'success',
};

@Component({
  selector: 'app-problemes',
  standalone: true,
  imports: [CommonModule, FormsModule, StatusBadgeComponent],
  templateUrl: './problemes.html',
  styleUrl: './problemes.css',
})
export class ProblemesComponent implements OnInit {
  private readonly problemeService = inject(ProblemeService);
  private readonly toast = inject(ToastService);

  readonly loading = signal(true);
  readonly problemes = signal<Probleme[]>([]);
  readonly statutFilter = signal<StatutProbleme | ''>('');

  readonly statutOptions: StatutProbleme[] = ['OUVERT', 'EN_COURS', 'RESOLU'];
  readonly statutLabels = STATUT_PROBLEME_LABELS;
  readonly typeLabels = TYPE_PROBLEME_LABELS;

  ngOnInit(): void {
    this.fetchProblemes();
  }

  fetchProblemes(): void {
    this.loading.set(true);
    this.problemeService.getAll({ statut: this.statutFilter() || undefined }).subscribe({
      next: (problemes) => {
        this.problemes.set(problemes);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  tone(statut: StatutProbleme): BadgeTone {
    return STATUT_TONE[statut];
  }

  updateStatut(probleme: Probleme, statut: StatutProbleme): void {
    this.problemeService.updateStatut(probleme.id, statut).subscribe({
      next: () => {
        this.toast.success('Statut du problème mis à jour.');
        this.fetchProblemes();
      },
    });
  }
}
