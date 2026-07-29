import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardStats } from '../../models/api-response.model';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { DonutChartComponent, DonutSlice } from '../../shared/components/donut-chart/donut-chart.component';
import { BarChartComponent, BarDatum } from '../../shared/components/bar-chart/bar-chart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, StatCardComponent, DonutChartComponent, BarChartComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);

  readonly loading = signal(true);
  readonly stats = signal<DashboardStats | null>(null);
  readonly lastUpdated = signal<Date | null>(null);

  readonly reservationsBarData = computed<BarDatum[]>(() => {
    const data = this.stats()?.reservations_par_mois ?? [];
    return [...data].reverse().map((item) => ({
      label: this.formatMonth(item.mois),
      value: item.total,
    }));
  });

  readonly problemesDonutData = computed<DonutSlice[]>(() => {
    const data = this.stats()?.problemes_par_statut ?? [];
    const colors: Record<string, string> = {
      OUVERT: 'var(--color-danger)',
      EN_COURS: 'var(--color-warning)',
      RESOLU: 'var(--color-success)',
    };
    const labels: Record<string, string> = {
      OUVERT: 'Ouverts',
      EN_COURS: 'En cours',
      RESOLU: 'Résolus',
    };
    return data.map((item) => ({
      label: labels[item.statut] ?? item.statut,
      value: item.total,
      color: colors[item.statut] ?? 'var(--color-neutral)',
    }));
  });

  ngOnInit(): void {
    this.dashboardService.getStats().subscribe({
      next: (stats) => {
        this.stats.set(stats);
        this.loading.set(false);
        this.lastUpdated.set(new Date());
      },
      error: () => this.loading.set(false),
    });
  }

  private formatMonth(value: string): string {
    const [year, month] = value.split('-');
    const date = new Date(Number(year), Number(month) - 1);
    return date.toLocaleDateString('fr-FR', { month: 'short' });
  }
}
