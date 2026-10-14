import { Injectable, computed, signal } from '@angular/core';

/** Favoritos en localStorage (provisional hasta tener backend y usuarios, Fase 5). */
@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly key = 'pausa:favorites';
  private readonly _ids = signal<string[]>(this.load());
  readonly ids = this._ids.asReadonly();
  readonly count = computed(() => this._ids().length);

  has(id: string): boolean {
    return this._ids().includes(id);
  }

  /** Devuelve true si quedó marcado como favorito. */
  toggle(id: string): boolean {
    const added = !this.has(id);
    this._ids.update((l) => (added ? [...l, id] : l.filter((x) => x !== id)));
    try { localStorage.setItem(this.key, JSON.stringify(this._ids())); } catch { /* almacenamiento no disponible */ }
    return added;
  }

  private load(): string[] {
    try {
      const raw = JSON.parse(localStorage.getItem(this.key) ?? '[]');
      return Array.isArray(raw) ? raw.filter((x) => typeof x === 'string') : [];
    } catch { return []; }
  }
}