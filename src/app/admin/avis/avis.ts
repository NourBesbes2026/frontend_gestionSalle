import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvisService } from '../../services/avis.service';
import { Avis } from '../../models/avis.model';

interface CritereAffiche {
  label: string;
  value: boolean;
}

@Component({
  selector: 'app-avis',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avis.html',
  styleUrl: './avis.css',
})
export class AvisComponent implements OnInit {
  private readonly avisService = inject(AvisService);

  readonly loading = signal(true);
  readonly avisList = signal<Avis[]>([]);

  ngOnInit(): void {
    this.loading.set(true);
    this.avisService.getAll().subscribe({
      next: (avis) => {
        this.avisList.set(avis);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  criteres(avis: Avis): CritereAffiche[] {
    return [
      { label: 'Confort', value: avis.confort },
      { label: 'Propreté', value: avis.proprete },
      { label: 'Équipements', value: avis.equip_fonctionnel },
      { label: 'Wifi', value: avis.wifi },
      { label: 'Facilité de réservation', value: avis.reservation_simple },
    ];
  }

  score(avis: Avis): number {
    return this.criteres(avis).filter((c) => c.value).length;
  }
}
