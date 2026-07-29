import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-stack">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast" [class]="'toast--' + toast.type" role="status">
          <span>{{ toast.message }}</span>
          <button type="button" class="toast__close" (click)="toastService.dismiss(toast.id)" aria-label="Fermer">
            &times;
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-stack {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 360px;
    }
    .toast {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
      padding: 13px 14px;
      border-radius: var(--radius-md);
      font-size: 13.5px;
      font-weight: 500;
      box-shadow: var(--shadow-lg);
      color: #fff;
      animation: slide-in 0.18s ease-out;
    }
    .toast--success { background: #1e9e64; }
    .toast--error { background: #e30613; }
    .toast--info { background: #2f6fb3; }
    .toast__close {
      background: none;
      border: none;
      color: inherit;
      font-size: 16px;
      line-height: 1;
      opacity: 0.8;
      &:hover { opacity: 1; }
    }
    @keyframes slide-in {
      from { transform: translateY(-8px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `],
})
export class ToastContainerComponent {
  protected readonly toastService = inject(ToastService);
}
