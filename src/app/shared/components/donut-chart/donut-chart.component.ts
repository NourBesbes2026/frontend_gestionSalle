import { Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

interface ComputedSlice extends DonutSlice {
  dashArray: string;
  dashOffset: number;
  percent: number;
}

@Component({
  selector: 'app-donut-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="donut">
      <svg viewBox="0 0 120 120" class="donut__svg">
        <circle cx="60" cy="60" r="46" fill="none" stroke="var(--color-border)" stroke-width="16" />
        @for (slice of computedSlices(); track slice.label) {
          <circle
            cx="60" cy="60" r="46" fill="none"
            [attr.stroke]="slice.color"
            stroke-width="16"
            [attr.stroke-dasharray]="slice.dashArray"
            [attr.stroke-dashoffset]="slice.dashOffset"
            transform="rotate(-90 60 60)"
            stroke-linecap="round"
          />
        }
      </svg>
      <div class="donut__center">
        <span class="donut__total">{{ total() }}</span>
      </div>
    </div>
    <ul class="donut__legend">
      @for (slice of computedSlices(); track slice.label) {
        <li>
          <span class="donut__dot" [style.background]="slice.color"></span>
          {{ slice.label }} <strong>{{ slice.value }}</strong>
        </li>
      }
    </ul>
  `,
  styles: [`
    :host { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
    .donut { position: relative; width: 120px; height: 120px; flex-shrink: 0; }
    .donut__svg { width: 100%; height: 100%; }
    .donut__center {
      position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
    }
    .donut__total {
      font-family: var(--font-display);
      font-size: 22px;
      font-weight: 700;
      color: var(--color-ink);
    }
    .donut__legend {
      list-style: none; padding: 0; margin: 0;
      display: flex; flex-direction: column; gap: 8px;
      font-size: 13px; color: var(--color-slate);
    }
    .donut__legend li { display: flex; align-items: center; gap: 8px; }
    .donut__legend strong { color: var(--color-ink); margin-left: auto; padding-left: 10px; }
    .donut__dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
  `],
})
export class DonutChartComponent {
  private readonly slicesSignal = signal<DonutSlice[]>([]);

  @Input({ required: true }) set slices(value: DonutSlice[]) {
    this.slicesSignal.set(value);
  }

  readonly total = computed(() => this.slicesSignal().reduce((sum, s) => sum + s.value, 0));

  readonly computedSlices = computed<ComputedSlice[]>(() => {
    const circumference = 2 * Math.PI * 46;
    const total = this.total() || 1;
    let cumulative = 0;

    return this.slicesSignal().map((slice) => {
      const percent = slice.value / total;
      const dash = percent * circumference;
      const computed: ComputedSlice = {
        ...slice,
        percent,
        dashArray: `${dash} ${circumference - dash}`,
        dashOffset: -cumulative,
      };
      cumulative += dash;
      return computed;
    });
  });
}
