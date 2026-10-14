import { Component, inject, input } from '@angular/core';
import { FavoritesService } from '../../core/state/favorites.service';
import { Icon } from './icon';
import { ToastService } from './toast.service';

@Component({
  selector: 'pausa-favorite-button',
  imports: [Icon],
  template: `
    <button type="button" class="fav" [class.on]="favs.has(propertyId())" [class.inline]="variant() === 'inline'"
      [attr.aria-pressed]="favs.has(propertyId())"
      [attr.aria-label]="favs.has(propertyId()) ? 'Quitar de favoritos' : 'Guardar en favoritos'"
      (click)="toggle($event)">
      <pausa-icon name="heart" [filled]="favs.has(propertyId())" />
      @if (variant() === 'inline') { <span>{{ favs.has(propertyId()) ? 'Guardado' : 'Guardar' }}</span> }
    </button>
  `,
  styles: `
    :host { display: inline-flex; }
    .fav { display: grid; place-items: center; width: 2.5rem; height: 2.5rem; border-radius: 50%; border: 0;
      background: rgb(255 255 255 / 92%); color: var(--color-ink); box-shadow: var(--shadow-sm); font-size: 1.15rem;
      transition: transform var(--duration-fast) var(--ease), color var(--duration-fast) var(--ease); }
    .fav:hover { transform: scale(1.08); }
    .fav:active { transform: scale(0.92); }
    .fav.on { color: var(--color-accent); }
    .fav.inline { width: auto; display: inline-flex; gap: 0.4rem; padding: 0.55rem 1rem; border-radius: var(--radius-pill);
      border: 1px solid var(--color-border); background: var(--color-surface); font-size: var(--text-sm); box-shadow: none; }
    .fav.inline pausa-icon { font-size: 1.05rem; }
  `,
})
export class FavoriteButton {
  protected readonly favs = inject(FavoritesService);
  private readonly toast = inject(ToastService);
  readonly propertyId = input.required<string>();
  readonly variant = input<'overlay' | 'inline'>('overlay');

  protected toggle(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
    const added = this.favs.toggle(this.propertyId());
    this.toast.show(added ? 'Guardado en tus favoritos' : 'Quitado de tus favoritos', added ? 'success' : 'info', 2200);
  }
}