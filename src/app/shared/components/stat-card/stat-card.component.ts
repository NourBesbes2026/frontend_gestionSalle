import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stat-card">
      <div class="stat-card__top">
        <span class="stat-card__icon" [class]="'stat-card__icon--' + accent">
          <ng-content select="[icon]"></ng-content>
        </span>
        @if (trend) {
          <span class="stat-card__trend">{{ trend }}</span>
        }
      </div>
      <p class="stat-card__value">{{ value }}</p>
      <p class="stat-card__label">{{ label }}</p>
    </div>
  `,
  styles: [`
    .stat-card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: 20px;
      box-shadow: var(--shadow-sm);
      position: relative;
      overflow: hidden;
    }
    .stat-card__top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 18px;
    }
    .stat-card__icon {
      width: 38px;
      height: 38px;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;

      ::ng-deep svg { width: 19px; height: 19px; }

      &--primary { background: var(--color-primary); }
      &--accent { background: var(--color-accent); }
      &--info { background: var(--color-info); }
      &--success { background: var(--color-success); }
    }
    .stat-card__trend {
      font-size: 12px;
      font-weight: 600;
      color: var(--color-slate);
    }
    .stat-card__value {
      font-family: var(--font-display);
      font-size: 28px;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
      color: var(--color-ink);
      margin-bottom: 4px;
    }
    .stat-card__label {
      font-size: 13px;
      color: var(--color-slate);
    }
  `],
})
export class StatCardComponent {
  @Input({ required: true }) value!: string | number;
  @Input({ required: true }) label!: string;
  @Input() accent: 'primary' | 'accent' | 'info' | 'success' = 'primary';
  @Input() trend?: string;
}
