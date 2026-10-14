import { Component, computed, effect, input, output, signal } from '@angular/core';
import { DESTINATION_SUGGESTIONS } from '../models/destinations';
import { addDaysIso, todayIso } from '../utils/dates';
import { GuestSelector } from './guest-selector';
import { Icon } from './icon';

export interface SearchQuery {
  destination: string;
  checkIn: string | null;
  checkOut: string | null;
  guests: number;
}

@Component({
  selector: 'pausa-search-bar',
  imports: [Icon, GuestSelector],
  template: `
    <form class="bar" [class.compact]="variant() === 'compact'" (submit)="submit($event)" role="search" novalidate>
      <label class="seg">
        <span class="label">Destino</span>
        <input type="text" name="destino" list="dest-list" placeholder="¿A dónde quieres ir?" autocomplete="off"
          [value]="destination()" (input)="onDestination($event)" />
        <datalist id="dest-list">
          @for (d of suggestions; track d) { <option [value]="d"></option> }
        </datalist>
      </label>
      <label class="seg">
        <span class="label">Llegada</span>
        <input type="date" name="entrada" [min]="today" [value]="checkIn() ?? ''" (change)="onCheckIn($event)" />
      </label>
      <label class="seg">
        <span class="label">Salida</span>
        <input type="date" name="salida" [min]="minCheckout()" [value]="checkOut() ?? ''" (change)="onCheckOut($event)" />
      </label>
      <pausa-guest-selector class="seg" [value]="guests()" (valueChange)="guests.set($event)" />
      <button type="submit" class="btn btn--primary submit"><pausa-icon name="search" /><span>Buscar</span></button>
    </form>
    @if (error()) { <p class="error" role="alert">{{ error() }}</p> }
  `,
  styles: `
    :host { display: block; }
    .bar { display: grid; grid-template-columns: 1fr; gap: var(--space-1); padding: var(--space-2); background: var(--color-surface);
      border: 1px solid var(--color-border); border-radius: var(--radius-lg); box-shadow: var(--shadow-lg); }
    .seg { display: flex; flex-direction: column; gap: 2px; padding: 0.7rem 1rem; border-radius: var(--radius-md); min-width: 0; cursor: text; }
    .seg:hover { background: var(--color-bg); }
    .seg + .seg { border-top: 1px solid var(--color-border); border-radius: 0; }
    .label { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: var(--color-ink-soft); }
    input { border: 0; background: transparent; padding: 0; width: 100%; font: inherit; color: var(--color-ink); }
    input::placeholder { color: var(--color-ink-soft); opacity: 0.8; }
    .submit { margin-top: var(--space-1); padding-block: 0.9rem; }
    .error { margin-top: var(--space-2); padding: 0.5rem 1rem; border-radius: var(--radius-sm); background: #fbe9e6; color: var(--color-danger); font-size: var(--text-sm); }
    .compact { box-shadow: var(--shadow-sm); }
    @media (min-width: 900px) {
      .bar { grid-template-columns: 1.5fr 1fr 1fr 1fr auto; align-items: center; gap: 0; border-radius: var(--radius-pill); padding: 0.4rem 0.4rem 0.4rem 0.75rem; }
      .seg { border-radius: var(--radius-pill); padding: 0.6rem 1.1rem; }
      .seg + .seg { border-top: 0; border-radius: var(--radius-pill); }
      .compact .seg { padding-block: 0.45rem; }
      .submit { margin: 0; padding: 0.95rem 1.5rem; }
    }
  `,
})
export class SearchBar {
  readonly variant = input<'hero' | 'compact'>('hero');
  readonly initial = input<SearchQuery | null>(null);
  readonly search = output<SearchQuery>();

  protected readonly suggestions = DESTINATION_SUGGESTIONS;
  protected readonly today = todayIso();
  protected readonly destination = signal('');
  protected readonly checkIn = signal<string | null>(null);
  protected readonly checkOut = signal<string | null>(null);
  protected readonly guests = signal(1);
  protected readonly error = signal('');
  protected readonly minCheckout = computed(() => addDaysIso(this.checkIn() ?? this.today, 1));

  constructor() {
    effect(() => {
      const i = this.initial();
      if (!i) return;
      this.destination.set(i.destination);
      this.checkIn.set(i.checkIn);
      this.checkOut.set(i.checkOut);
      this.guests.set(i.guests);
    });
  }

  protected onDestination(e: Event): void {
    this.destination.set((e.target as HTMLInputElement).value);
  }
  protected onCheckIn(e: Event): void {
    const v = (e.target as HTMLInputElement).value || null;
    this.checkIn.set(v);
    const out = this.checkOut();
    if (v && out && out <= v) this.checkOut.set(null);
    this.error.set('');
  }
  protected onCheckOut(e: Event): void {
    this.checkOut.set((e.target as HTMLInputElement).value || null);
    this.error.set('');
  }
  protected submit(e: Event): void {
    e.preventDefault();
    if (this.checkIn() && !this.checkOut()) {
      this.error.set('Elige también la fecha de salida para buscar por fechas.');
      return;
    }
    if (!this.checkIn() && this.checkOut()) {
      this.error.set('Elige también la fecha de llegada.');
      return;
    }
    this.error.set('');
    this.search.emit({
      destination: this.destination().trim(),
      checkIn: this.checkIn(),
      checkOut: this.checkOut(),
      guests: this.guests(),
    });
  }
}