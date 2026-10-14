import { Injectable, signal } from '@angular/core';

export interface Toast { id: number; message: string; kind: 'success' | 'info' | 'error'; }

@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 0;
  readonly toasts = signal<Toast[]>([]);

  show(message: string, kind: Toast['kind'] = 'info', ms = 3500): void {
    const id = ++this.nextId;
    this.toasts.update((l) => [...l, { id, message, kind }]);
    setTimeout(() => this.dismiss(id), ms);
  }

  dismiss(id: number): void {
    this.toasts.update((l) => l.filter((t) => t.id !== id));
  }

  soon(): void {
    this.show('Esta función llegará en una próxima fase del proyecto.');
  }
}