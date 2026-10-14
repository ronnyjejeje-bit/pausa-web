import { Component, inject } from '@angular/core';
import { Icon } from './icon';
import { ToastService } from './toast.service';

@Component({
  selector: 'pausa-toast-host',
  imports: [Icon],
  template: `
    <div class="host" aria-live="polite" aria-atomic="false">
      @for (t of toasts.toasts(); track t.id) {
        <div class="toast reveal" [class]="t.kind" role="status">
          <span>{{ t.message }}</span>
          <button type="button" (click)="toasts.dismiss(t.id)" aria-label="Cerrar mensaje"><pausa-icon name="x" /></button>
        </div>
      }
    </div>
  `,
  styles: `
    .host { position: fixed; z-index: 100; left: 50%; bottom: 1rem; transform: translateX(-50%);
      display: grid; gap: var(--space-2); width: min(92vw, 26rem); pointer-events: none; }
    .toast { pointer-events: auto; display: flex; align-items: center; justify-content: space-between; gap: var(--space-3);
      padding: 0.8rem 1rem; border-radius: var(--radius-md); background: var(--color-ink); color: #fff;
      box-shadow: var(--shadow-lg); font-size: var(--text-sm); border-left: 4px solid var(--color-ink-soft); }
    .toast.success { border-left-color: #6fbf9a; }
    .toast.error { border-left-color: #e5806f; }
    button { border: 0; background: none; color: inherit; display: grid; place-items: center; opacity: 0.8; }
    button:hover { opacity: 1; }
  `,
})
export class ToastHost {
  protected readonly toasts = inject(ToastService);
}