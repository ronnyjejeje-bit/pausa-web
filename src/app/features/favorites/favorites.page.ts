import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { FavoritesService } from '../../core/state/favorites.service';
import { PropertyRepository } from '../../data/repositories/property.repository';
import { EmptyState } from '../../shared/ui/empty-state';
import { PropertyCard } from '../../shared/ui/property-card';
import { SkeletonCard } from '../../shared/ui/skeleton-card';

@Component({
  selector: 'pausa-favorites',
  imports: [EmptyState, PropertyCard, RouterLink, SkeletonCard],
  template: `
    <section class="container page">
      <h1>Tus favoritos</h1>
      <p class="sub">Los alojamientos que guardaste se quedan en este navegador.</p>

      @if (items(); as list) {
        @if (list.length === 0) {
          <pausa-empty-state icon="heart" title="Aún no guardaste ningún alojamiento"
            message="Toca el corazón en cualquier alojamiento para guardarlo y compararlo después.">
            <a class="btn btn--primary" routerLink="/buscar">Explorar alojamientos</a>
          </pausa-empty-state>
        } @else {
          <div class="grid">@for (p of list; track p.id) { <pausa-property-card [property]="p" /> }</div>
        }
      } @else {
        <div class="grid">@for (n of [1, 2, 3]; track n) { <pausa-skeleton-card /> }</div>
      }
    </section>
  `,
  styles: `
    .page { padding-block: var(--space-6) 0; display: grid; gap: var(--space-3); }
    h1 { font-size: var(--text-xl); }
    .sub { color: var(--color-ink-soft); margin-bottom: var(--space-4); }
    .grid { display: grid; gap: var(--space-5); grid-template-columns: repeat(auto-fill, minmax(16.5rem, 1fr)); }
  `,
})
export class FavoritesPage {
  private readonly favs = inject(FavoritesService);
  // Se cargan una vez; quitar un favorito lo oculta al instante sin recargar.
  private readonly loaded = toSignal(inject(PropertyRepository).getByIds(this.favs.ids()), { initialValue: null });
  protected readonly items = computed(() => this.loaded()?.filter((p) => this.favs.ids().includes(p.id)) ?? null);
}