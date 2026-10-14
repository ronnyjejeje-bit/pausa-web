import { Component, computed, input, output, signal } from '@angular/core';
import { eachNight, parseIso, toIso, todayIso } from '../utils/dates';
import { Icon } from './icon';

export interface DateRange { checkIn: string | null; checkOut: string | null; }
interface Cell { iso: string; day: number; }
interface Month { label: string; cells: (Cell | null)[]; }

const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);

function buildMonth(first: Date): Month {
  const y = first.getFullYear();
  const m = first.getMonth();
  const lead = (first.getDay() + 6) % 7; // semana empieza en lunes
  const total = new Date(y, m + 1, 0).getDate();
  const cells: (Cell | null)[] = Array(lead).fill(null);
  for (let d = 1; d <= total; d++) cells.push({ iso: toIso(new Date(y, m, d)), day: d });
  return { label: first.toLocaleDateString('es-PE', { month: 'long', year: 'numeric' }), cells };
}

@Component({
  selector: 'pausa-availability-calendar',
  imports: [Icon],
  template: `
    <div class="cal">
      <div class="nav">
        <button type="button" (click)="shift(-1)" [disabled]="!canGoBack()" aria-label="Mes anterior"><pausa-icon name="chevron-left" /></button>
        <button type="button" (click)="shift(1)" aria-label="Mes siguiente"><pausa-icon name="chevron-right" /></button>
      </div>
      <div class="months">
        @for (m of months(); track m.label) {
          <section class="month">
            <h3>{{ m.label }}</h3>
            <div class="grid dow" aria-hidden="true">
              @for (d of weekdays; track d) { <span>{{ d }}</span> }
            </div>
            <div class="grid">
              @for (c of m.cells; track $index) {
                @if (c) {
                  <button type="button" class="day" [disabled]="isDisabled(c.iso)"
                    [class.busy]="isBusy(c.iso)" [class.start]="c.iso === checkIn()" [class.end]="c.iso === checkOut()"
                    [class.range]="inRange(c.iso)" [attr.aria-label]="label(c.iso)"
                    [attr.aria-pressed]="c.iso === checkIn() || c.iso === checkOut()" (click)="pick(c.iso)">{{ c.day }}</button>
                } @else { <span></span> }
              }
            </div>
          </section>
        }
      </div>
      <div class="legend">
        <span><i class="sw sel"></i> Seleccionado</span>
        <span><i class="sw busy"></i> Ocupado</span>
        @if (checkIn()) { <button type="button" class="clear" (click)="clear()">Borrar fechas</button> }
      </div>
    </div>
  `,
  styles: `
    .cal { position: relative; }
    .nav { position: absolute; top: -0.25rem; left: 0; right: 0; display: flex; justify-content: space-between; pointer-events: none; }
    .nav button { pointer-events: auto; display: grid; place-items: center; width: 2.25rem; height: 2.25rem; border-radius: 50%;
      border: 1px solid var(--color-border); background: var(--color-surface); }
    .nav button:disabled { opacity: 0.35; cursor: not-allowed; }
    .months { display: grid; gap: var(--space-6); }
    h3 { text-align: center; font-family: var(--font-body); font-size: var(--text-md); font-weight: 600; text-transform: capitalize; margin-bottom: var(--space-3); }
    .grid { display: grid; grid-template-columns: repeat(7, 1fr); row-gap: 2px; }
    .dow span { text-align: center; font-size: var(--text-xs); color: var(--color-ink-soft); padding-bottom: var(--space-2); }
    .day { aspect-ratio: 1; max-height: 2.75rem; margin: 0 auto; width: 100%; border: 0; background: none; border-radius: 0; font-size: var(--text-sm); color: var(--color-ink); }
    .day:hover:not(:disabled) { background: var(--color-surface-alt); border-radius: 50%; }
    .day:disabled { color: var(--color-ink-soft); opacity: 0.4; cursor: not-allowed; }
    .day.busy:disabled { text-decoration: line-through; }
    .day.range { background: color-mix(in srgb, var(--color-primary) 14%, white); }
    .day.start, .day.end { background: var(--color-primary); color: #fff; border-radius: 50%; font-weight: 600; }
    .legend { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-4); margin-top: var(--space-4); font-size: var(--text-xs); color: var(--color-ink-soft); }
    .legend span { display: inline-flex; align-items: center; gap: 0.4rem; }
    .sw { display: inline-block; width: 0.9rem; height: 0.9rem; border-radius: 50%; }
    .sw.sel { background: var(--color-primary); }
    .sw.busy { background: var(--color-border); }
    .clear { margin-left: auto; border: 0; background: none; text-decoration: underline; font-size: var(--text-xs); color: var(--color-ink); }
    @media (min-width: 600px) { .months { grid-template-columns: 1fr 1fr; gap: var(--space-7); } }
  `,
})
export class AvailabilityCalendar {
  readonly unavailable = input<string[]>([]);
  readonly checkIn = input<string | null>(null);
  readonly checkOut = input<string | null>(null);
  readonly rangeChange = output<DateRange>();

  protected readonly weekdays = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  private readonly today = todayIso();
  private readonly busySet = computed(() => new Set(this.unavailable()));
  private readonly first = signal(startOfMonth(new Date()));

  protected readonly months = computed(() => {
    const f = this.first();
    return [0, 1].map((i) => buildMonth(new Date(f.getFullYear(), f.getMonth() + i, 1)));
  });
  protected readonly canGoBack = computed(() => this.first().getTime() > startOfMonth(new Date()).getTime());

  protected shift(n: number): void {
    const f = this.first();
    this.first.set(new Date(f.getFullYear(), f.getMonth() + n, 1));
  }
  protected isBusy(iso: string): boolean { return this.busySet().has(iso); }
  protected isDisabled(iso: string): boolean {
    return iso < this.today || (this.isBusy(iso) && !this.canBeCheckout(iso));
  }
  protected inRange(iso: string): boolean {
    const a = this.checkIn(); const b = this.checkOut();
    return !!a && !!b && iso > a && iso < b;
  }
  protected label(iso: string): string {
    const txt = parseIso(iso).toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' });
    return this.isBusy(iso) ? `${txt}, ocupado` : txt;
  }
  protected pick(iso: string): void {
    if (this.isDisabled(iso)) return;
    if (this.canBeCheckout(iso)) this.rangeChange.emit({ checkIn: this.checkIn(), checkOut: iso });
    else this.rangeChange.emit({ checkIn: iso, checkOut: null });
  }
  protected clear(): void { this.rangeChange.emit({ checkIn: null, checkOut: null }); }

  /** El día de salida puede coincidir con la primera noche ocupada de otra reserva. */
  private canBeCheckout(iso: string): boolean {
    const a = this.checkIn();
    return !!a && !this.checkOut() && iso > a && eachNight(a, iso).every((n) => !this.isBusy(n));
  }
}