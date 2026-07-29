import { Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface BarDatum {
  label: string;
  value: number;
}

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bar-chart">
      @for (item of items(); track item.label) {
        <div class="bar-chart__col">
          <div class="bar-chart__track">
            <div
              class="bar-chart__bar"
              [style.height.%]="maxValue() ? (item.value / maxValue()) * 100 : 0"
              [title]="item.value + ' réservation(s)'"
            ></div>
          </div>
          <span class="bar-chart__value">{{ item.value }}</span>
          <span class="bar-chart__label">{{ item.label }}</span>
        </div>
      }
      @if (!items().length) {
        <p class="text-muted">Aucune donnée disponible pour le moment.</p>
      }
    </div>
  `,
  styles: [`
    .bar-chart {
      display: flex;
      align-items: flex-end;
      gap: 14px;
      height: 160px;
      padding-top: 10px;
    }
    .bar-chart__col {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      flex: 1;
      min-width: 28px;
    }
    .bar-chart__track {
      width: 100%;
      max-width: 32px;
      height: 110px;
      display: flex;
      align-items: flex-end;
      background: var(--color-bg);
      border-radius: 6px;
      overflow: hidden;
    }
    .bar-chart__bar {
      width: 100%;
      min-height: 3px;
      background: var(--gradient-signature);
      border-radius: 6px 6px 0 0;
      transition: height 0.3s ease;
    }
    .bar-chart__value {
      font-size: 12px;
      font-weight: 700;
      color: var(--color-ink);
      font-variant-numeric: tabular-nums;
    }
    .bar-chart__label {
      font-size: 11px;
      color: var(--color-slate);
      text-align: center;
    }
  `],
})
export class BarChartComponent {
  private readonly itemsSignal = signal<BarDatum[]>([]);

  @Input({ required: true }) set data(value: BarDatum[]) {
    this.itemsSignal.set(value);
  }

  readonly items = computed(() => this.itemsSignal());
  readonly maxValue = computed(() => Math.max(...this.itemsSignal().map((i) => i.value), 0));
}
