import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { map, startWith, switchMap } from 'rxjs';
import { PropertyRepository } from '../../data/repositories/property.repository';
import { PROPERTY_TYPE_LABELS, amenityById } from '../../shared/models/property.model';
import {
  SORT_OPTIONS, SearchCriteria, SortOption, criteriaFromParams, criteriaToParams,
} from '../../shared/models/search-criteria';
import { formatMoney } from '../../shared/pipes/money.pipe';
import { EmptyState } from '../../shared/ui/empty-state';
import { FilterPanel } from '../../shared/ui/filter-panel';
import { Icon } from '../../shared/ui/icon';
import { PropertyCard } from '../../shared/ui/property-card';
import { SearchBar, SearchQuery } from '../../shared/ui/search-bar';
import { SkeletonCard } from '../../shared/ui/skeleton-card';
import { nightsBetween } from '../../shared/utils/dates';

@Component({
  selector: 'pausa-search',
  imports: [EmptyState, FilterPanel, Icon, PropertyCard, SearchBar, SkeletonCard],
  template: `
    <section class="top">
      <div class="container"><pausa-search-bar variant="compact" [initial]="searchState()" (search)="update($event)" /></div>
    </section>

    <div class="container layout">
      <aside class="filters" [class.open]="filtersOpen()">
        <div class="backdrop" (click)="filtersOpen.set(false)"></div>
        <div class="sheet">
          <pausa-filter-panel [criteria]="criteria()" [count]="results()?.length ?? null"
            (patch)="update($event)" (cleared)="clearFilters()" (closed)="filtersOpen.set(false)" />
        </div>
      </aside>

      <section class="results" aria-live="polite">
        <header class="head">
          <div>
            <h1>{{ heading() }}</h1>
            <p class="count">
              @if (results(); as list) { {{ list.length }} {{ list.length === 1 ? 'alojamiento' : 'alojamientos' }} }
              @else { Buscando alojamientos… }
            </p>
          </div>
          <div class="tools">
            <button type="button" class="btn btn--ghost filters-btn" (click)="filtersOpen.set(true)">
              <pausa-icon name="sliders" /> Filtros @if (activeChips().length) { <span class="badge">{{ activeChips().length }}</span> }
            </button>
            <label class="sort">
              <span class="sr-only">Ordenar por</span>
              <select (change)="onSort($event)">
                @for (o of sortOptions; track o.value) {
                  <option [value]="o.value" [selected]="o.value === criteria().sort">{{ o.label }}</option>
                }
              </select>
            </label>
          </div>
        </header>

        @if (activeChips().length) {
          <div class="chips">
            @for (c of activeChips(); track c.label) {
              <button type="button" class="chip" (click)="c.remove()" [attr.aria-label]="'Quitar filtro ' + c.label">
                {{ c.label }} <pausa-icon name="x" />
              </button>
            }
            <button type="button" class="clear" (click)="clearFilters()">Limpiar todo</button>
          </div>
        }

        @if (results(); as list) {
          @if (list.length === 0) {
            <pausa-empty-state icon="search" title="No encontramos alojamientos con esos criterios"
              message="Prueba con otras fechas, un rango de precio más amplio o menos filtros.">
              <button type="button" class="btn btn--primary" (click)="clearFilters()">Quitar filtros</button>
              <button type="button" class="btn btn--ghost" (click)="clearAll()">Nueva búsqueda</button>
            </pausa-empty-state>
          } @else {
            <div class="grid">
              @for (p of list; track p.id; let i = $index) {
                <pausa-property-card class="reveal" [style.animation-delay.ms]="(i % 9) * 50"
                  [property]="p" [nights]="nights()" [queryParams]="cardParams()" />
              }
            </div>
          }
        } @else {
          <div class="grid">@for (n of skeletons; track n) { <pausa-skeleton-card /> }</div>
        }
      </section>
    </div>
  `,
  styles: `
    .top { padding-block: var(--space-4); }
    .layout { display: grid; gap: var(--space-5); padding-bottom: var(--space-6); }
    .head { display: flex; align-items: flex-end; justify-content: space-between; gap: var(--space-4); flex-wrap: wrap; margin-bottom: var(--space-4); }
    h1 { font-size: var(--text-xl); }
    .count { color: var(--color-ink-soft); font-size: var(--text-sm); margin-top: 0.25rem; }
    .tools { display: flex; gap: var(--space-2); align-items: center; }
    .badge { display: inline-grid; place-items: center; min-width: 1.25rem; height: 1.25rem; padding: 0 0.3rem; border-radius: var(--radius-pill);
      background: var(--color-primary); color: #fff; font-size: 0.75rem; }
    select { padding: 0.65rem 1rem; border-radius: var(--radius-pill); border: 1px solid var(--color-border); background: var(--color-surface); font: inherit; font-size: var(--text-sm); color: var(--color-ink); }
    .chips { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-2); margin-bottom: var(--space-4); }
    .chips .chip pausa-icon { font-size: 0.9rem; }
    .clear { border: 0; background: none; text-decoration: underline; font-size: var(--text-sm); }
    .grid { display: grid; gap: var(--space-5); grid-template-columns: repeat(auto-fill, minmax(16.5rem, 1fr)); }
    .filters .backdrop { display: none; }
    @media (max-width: 899px) {
      .filters { position: fixed; inset: 0; z-index: 70; display: none; }
      .filters.open { display: block; }
      .filters .backdrop { display: block; position: absolute; inset: 0; background: rgb(20 32 26 / 45%); }
      .sheet { position: absolute; inset: auto 0 0 0; max-height: 88dvh; overflow-y: auto; border-radius: var(--radius-lg) var(--radius-lg) 0 0; background: var(--color-surface); animation: rise 0.3s var(--ease) both; }
    }
    @media (min-width: 900px) {
      .layout { grid-template-columns: 18.5rem 1fr; align-items: start; }
      .filters { position: sticky; top: calc(var(--header-height) + 1rem); max-height: calc(100dvh - var(--header-height) - 2rem); overflow-y: auto; }
      .filters-btn { display: none; }
    }
  `,
})
export class SearchPage {
  private readonly repo = inject(PropertyRepository);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly criteria = toSignal(this.route.queryParamMap.pipe(map(criteriaFromParams)), {
    initialValue: criteriaFromParams(this.route.snapshot.queryParamMap),
  });

  /** null = cargando. Cada cambio de criterios vuelve a consultar. */
  protected readonly results = toSignal(
    toObservable(this.criteria).pipe(switchMap((c) => this.repo.search(c).pipe(startWith(null)))),
    { initialValue: null },
  );

  protected readonly filtersOpen = signal(false);
  protected readonly sortOptions = SORT_OPTIONS;
  protected readonly skeletons = [1, 2, 3, 4, 5, 6];

  protected readonly searchState = computed<SearchQuery>(() => {
    const c = this.criteria();
    return { destination: c.destination, checkIn: c.checkIn, checkOut: c.checkOut, guests: c.guests };
  });
  protected readonly heading = computed(() =>
    this.criteria().destination ? `Alojamientos en ${this.criteria().destination}` : 'Todos los alojamientos',
  );
  protected readonly nights = computed(() => {
    const { checkIn, checkOut } = this.criteria();
    return checkIn && checkOut && checkOut > checkIn ? nightsBetween(checkIn, checkOut) : 0;
  });
  protected readonly cardParams = computed(() => {
    const c = this.criteria();
    const p: Params = {};
    if (c.checkIn) p['entrada'] = c.checkIn;
    if (c.checkOut) p['salida'] = c.checkOut;
    if (c.guests > 1) p['huespedes'] = c.guests;
    return p;
  });
  protected readonly activeChips = computed(() => {
    const c = this.criteria();
    const chips: { label: string; remove: () => void }[] = [];
    if (c.priceMin !== null || c.priceMax !== null) {
      const max = c.priceMax !== null ? formatMoney(c.priceMax) : 'sin límite';
      chips.push({ label: `${formatMoney(c.priceMin ?? 0)} – ${max}`, remove: () => this.update({ priceMin: null, priceMax: null }) });
    }
    for (const t of c.types) {
      chips.push({ label: PROPERTY_TYPE_LABELS[t], remove: () => this.update({ types: c.types.filter((x) => x !== t) }) });
    }
    for (const id of c.amenities) {
      chips.push({ label: amenityById(id)?.label ?? id, remove: () => this.update({ amenities: c.amenities.filter((x) => x !== id) }) });
    }
    return chips;
  });

  protected update(patch: Partial<SearchCriteria>): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: criteriaToParams({ ...this.criteria(), ...patch }),
    });
  }
  protected clearFilters(): void {
    this.update({ priceMin: null, priceMax: null, types: [], amenities: [] });
  }
  protected clearAll(): void {
    this.router.navigate([], { relativeTo: this.route, queryParams: {} });
  }
  protected onSort(e: Event): void {
    this.update({ sort: (e.target as HTMLSelectElement).value as SortOption });
  }
}