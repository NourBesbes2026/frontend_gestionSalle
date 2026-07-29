import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SalleService } from '../../services/salle.service';
import { ToastService } from '../../services/toast.service';
import { Salle, SalleFormValue, STATUT_SALLE_LABELS, StatutSalle } from '../../models/salle.model';
import { StatusBadgeComponent, BadgeTone } from '../../shared/components/status-badge/status-badge.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { SalleFormModalComponent } from './salle-form-modal/salle-form-modal.component';


const STATUT_TONE: Record<StatutSalle, BadgeTone> = {
  DISPONIBLE: 'success',
  RESERVEE: 'info',
  EN_ATTENTE: 'warning',
  EN_MAINTENANCE: 'danger',
};

@Component({
  selector: 'app-salles',
  standalone: true,
  imports: [CommonModule, FormsModule, StatusBadgeComponent, ConfirmDialogComponent, SalleFormModalComponent],
  templateUrl: './salles.html',
  styleUrl: './salles.css',
})
export class SallesComponent implements OnInit {
  
  private readonly salleService = inject(SalleService);
  private readonly toast = inject(ToastService);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly salles = signal<Salle[]>([]);
  readonly searchTerm = signal('');
  readonly statutFilter = signal<StatutSalle | ''>('');

  readonly modalOpen = signal(false);
  readonly editingSalle = signal<Salle | null>(null);

  readonly confirmDeleteOpen = signal(false);
  readonly salleToDelete = signal<Salle | null>(null);

  readonly statutOptions: StatutSalle[] = ['DISPONIBLE', 'RESERVEE',  'EN_MAINTENANCE'];
  readonly statutLabels = STATUT_SALLE_LABELS;

  readonly filteredSalles = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const statut = this.statutFilter();

    return this.salles().filter((s) => {
      const matchesTerm = !term || s.nom.toLowerCase().includes(term);
      const matchesStatut = !statut || s.statut === statut;
      return matchesTerm && matchesStatut;
     
    });
  });

  ngOnInit(): void {
    this.fetchSalles();
    
    
  }

  fetchSalles(): void {
    this.loading.set(true);
  
    this.salleService.getAll().subscribe({
      next: (salles) => {
        this.salles.set(salles);
        this.loading.set(false);
        
      },
      error: () => this.loading.set(false),
    });
  }

  tone(statut: StatutSalle): BadgeTone {
    return STATUT_TONE[statut];
  }

  openCreateModal(): void {
    this.editingSalle.set(null);
    this.modalOpen.set(true);
  }

  openEditModal(salle: Salle): void {
    this.editingSalle.set(salle);
    this.modalOpen.set(true);
  }

  closeModal(): void {
    this.modalOpen.set(false);
    this.editingSalle.set(null);
  }

  handleSave(value: SalleFormValue): void {
    this.saving.set(true);
    const editing = this.editingSalle();

    const request = editing
      ? this.salleService.update(editing.id, value)
      : this.salleService.create(value);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.toast.success(editing ? 'Salle mise à jour avec succès.' : 'Salle créée avec succès.');
        this.closeModal();
        this.fetchSalles();
      },
      error: () => this.saving.set(false),
    });
  }

  askDelete(salle: Salle): void {
    this.salleToDelete.set(salle);
    this.confirmDeleteOpen.set(true);
  }

  confirmDelete(): void {
    const salle = this.salleToDelete();
    if (!salle) return;

    this.salleService.delete(salle.id).subscribe({
      next: () => {
        this.toast.success('Salle supprimée avec succès.');
        this.confirmDeleteOpen.set(false);
        this.salleToDelete.set(null);
        this.fetchSalles();
        
      },
    });
  }

  cancelDelete(): void {
    this.confirmDeleteOpen.set(false);
    this.salleToDelete.set(null);
  }
}
