import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (open) {
      <div class="dialog-scrim" (click)="cancel.emit()">
        <div class="dialog" role="alertdialog" aria-modal="true" (click)="$event.stopPropagation()">
          <h3>{{ title }}</h3>
          <p>{{ message }}</p>
          <div class="dialog__actions">
            <button type="button" class="btn btn--secondary" (click)="cancel.emit()">Annuler</button>
            <button type="button" class="btn btn--primary" (click)="confirm.emit()">{{ confirmLabel }}</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .dialog-scrim {
      position: fixed;
      inset: 0;
      background: rgba(33, 31, 31, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 200;
      padding: 20px;
    }
    .dialog {
      background: var(--color-surface);
      border-radius: var(--radius-lg);
      padding: 24px;
      max-width: 400px;
      width: 100%;
      box-shadow: var(--shadow-lg);
    }
    .dialog h3 { margin-bottom: 10px; font-size: 17px; }
    .dialog p { color: var(--color-slate); font-size: 13.5px; margin-bottom: 22px; }
    .dialog__actions { display: flex; justify-content: flex-end; gap: 10px; }
  `],
})
export class ConfirmDialogComponent {
  @Input() open = false;
  @Input() title = 'Confirmer l\'action';
  @Input() message = 'Cette action est irréversible.';
  @Input() confirmLabel = 'Confirmer';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
