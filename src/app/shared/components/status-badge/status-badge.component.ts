import { Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `<span class="badge" [class]="'badge--' + tone()">{{ label() }}</span>`,
})
export class StatusBadgeComponent {
  private readonly labelSignal = signal('');
  private readonly toneSignal = signal<BadgeTone>('neutral');

  readonly label = computed(() => this.labelSignal());
  readonly tone = computed(() => this.toneSignal());

  @Input({ required: true }) set text(value: string) {
    this.labelSignal.set(value);
  }

  @Input({ required: true }) set toneName(value: BadgeTone) {
    this.toneSignal.set(value);
  }
}
