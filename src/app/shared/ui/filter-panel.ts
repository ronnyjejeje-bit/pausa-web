import { Component, input, output } from '@angular/core';
import { AMENITIES, PROPERTY_TYPES, PROPERTY_TYPE_LABELS, PropertyType } from '../models/property.model';
import { SearchCriteria } from '../models/search-criteria';
import { Icon } from './icon';

@Component({
  selector: 'pausa-filter-panel',
  imports: [Icon],
  template: `
    <div class="panel">
      <header class="head">
        <h2>Filtros</h2>
        <button type="button" class="close" (click)="closed.emit()" aria-label="Cerrar filtros"><pausa-icon name="x" /></button>
      </header>

      <section>
        <h3>Precio por noche</h3>
        <div class="price">
          <label>Mínimo
            <input type="number" min="0" step="10" placeholder="0" [value]="criteria().priceMin ?? ''" (change)="onPrice('priceMin', $event)" />
          </label>
          <span aria-hidden="true">–</span>
          <label>Máximo
            <input type="number" min="0" step="10" placeholder="Sin límite" [value]="criteria().priceMax ?? ''" (change)="onPrice('priceMax', $event)" />
          </label>
        </div>
      </section>

      <section>
        <h3>Tipo de alojamiento</h3>
        <div class="chips">
          @for (t of types; track t) {
            <button type="button" class="chip" [attr.aria-pressed]="criteria().types.includes(t)" (click)="toggleType(t)">{{ labels[t] }}</button>
          }
        </div>
      </section>

      <section>
        <h3>Servicios</h3>
        <div class="amenities">
          @for (a of amenities; track a.id) {
            <label class="check">
              <input type="checkbox" [checked]="criteria().amenities.includes(a.id)" (change)="toggleAmenity(a.id)" />
              <pausa-icon [name]="a.icon" />
              <span>{{ a.label }}</span>
            </label>
          }
        </div>
      </section>

      <footer class="foot">
        <button type="button" class="btn btn--ghost" (click)="cleared.emit()">Limpiar filtros</button>
        <button type="button" class="btn btn--primary apply" (click)="closed.emit()">
          {{ count() === null ? 'Ver resultados' : 'Ver ' + count() + ' alojamientos' }}
        </button>
      </footer>
    </div>
  `,
  styles: `
    .panel { display: grid; gap: var(--space-5); padding: var(--space-5); background: var(--color-surface);
      border: 1px solid var(--color-border); border-radius: var(--radius-lg); }
    .head { display: flex; align-items: center; justify-content: space-between; }
    h2 { font-size: var(--text-lg); }
    h3 { font-family: var(--font-body); font-size: var(--text-sm); font-weight: 600; margin-bottom: var(--space-3); }
    .close { display: grid; place-items: center; width: 2.25rem; height: 2.25rem; border-radius: 50%; border: 1px solid var(--color-border); background: none; }
    .price { display: flex; align-items: flex-end; gap: var(--space-2); }
    .price label { display: grid; gap: 0.25rem; flex: 1; font-size: var(--text-xs); color: var(--color-ink-soft); }
    .price input { width: 100%; padding: 0.6rem 0.75rem; border: 1px solid var(--color-border); border-radius: var(--radius-sm);
      font: inherit; color: var(--color-ink); background: var(--color-bg); }
    .price span { padding-bottom: 0.6rem; }
    .chips { display: flex; flex-wrap: wrap; gap: var(--space-2); }
    .amenities { display: grid; gap: var(--space-1); }
    .check { display: flex; align-items: center; gap: var(--space-3); padding: 0.5rem 0.4rem; border-radius: var(--radius-sm); font-size: var(--text-sm); cursor: pointer; }
    .check:hover { background: var(--color-bg); }
    .check input { width: 1.1rem; height: 1.1rem; accent-color: var(--color-primary); }
    .check pausa-icon { color: var(--color-ink-soft); }
    .foot { display: flex; gap: var(--space-3); justify-content: space-between; }
    @media (min-width: 900px) { .close, .apply { display: none; } .foot { justify-content: flex-start; } }
    @media (max-width: 899px) { .panel { border: 0; border-radius: 0; } .apply { flex: 1; } }
  `,
})
export class FilterPanel {
  readonly criteria = input.required<SearchCriteria>();
  readonly count = input<number | null>(null);
  readonly patch = output<Partial<SearchCriteria>>();
  readonly cleared = output<void>();
  readonly closed = output<void>();

  protected readonly types = PROPERTY_TYPES;
  protected readonly labels = PROPERTY_TYPE_LABELS;
  protected readonly amenities = AMENITIES;

  protected onPrice(key: 'priceMin' | 'priceMax', e: Event): void {
    const raw = (e.target as HTMLInputElement).value;
    const value = raw === '' ? null : Math.max(0, Number(raw));
    this.patch.emit(key === 'priceMin' ? { priceMin: value } : { priceMax: value });
  }
  protected toggleType(t: PropertyType): void {
    const cur = this.criteria().types;
    this.patch.emit({ types: cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t] });
  }
  protected toggleAmenity(id: string): void {
    const cur = this.criteria().amenities;
    this.patch.emit({ amenities: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id] });
  }
}