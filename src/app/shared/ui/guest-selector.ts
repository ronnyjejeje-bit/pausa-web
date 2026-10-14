import { Component, ElementRef, inject, input, output, signal } from '@angular/core';
import { Icon } from './icon';

@Component({
  selector: 'pausa-guest-selector',
  imports: [Icon],
  host: { '(document:click)': 'onDocClick($event)', '(document:keydown.escape)': 'open.set(false)' },
  template: `
    <span class="label" id="gs-label">Huéspedes</span>
    <button type="button" class="trigger" aria-haspopup="dialog" aria-labelledby="gs-label"
      [attr.aria-expanded]="open()" (click)="open.set(!open())">
      {{ value() === 1 ? '1 huésped' : value() + ' huéspedes' }}
    </button>
    @if (open()) {
      <div class="panel reveal" role="dialog" aria-label="Número de huéspedes">
        <div class="row">
          <div><strong>Huéspedes</strong><small>Máximo {{ max() }}</small></div>
          <div class="stepper">
            <button type="button" (click)="step(-1)" [disabled]="value() <= 1" aria-label="Quitar un huésped"><pausa-icon name="minus" /></button>
            <output>{{ value() }}</output>
            <button type="button" (click)="step(1)" [disabled]="value() >= max()" aria-label="Añadir un huésped"><pausa-icon name="plus" /></button>
          </div>
        </div>
        <button type="button" class="btn btn--primary btn--block" (click)="open.set(false)">Listo</button>
      </div>
    }
  `,
  styles: `
    :host { position: relative; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
    .label { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: var(--color-ink-soft); }
    .trigger { border: 0; background: none; padding: 0; text-align: left; font: inherit; color: var(--color-ink); }
    .panel { position: absolute; z-index: 30; top: calc(100% + 0.75rem); right: 0; width: min(20rem, 86vw); display: grid; gap: var(--space-4);
      padding: var(--space-4); background: var(--color-surface); border: 1px solid var(--color-border);
      border-radius: var(--radius-md); box-shadow: var(--shadow-lg); }
    .row { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); }
    small { display: block; color: var(--color-ink-soft); }
    .stepper { display: flex; align-items: center; gap: var(--space-3); }
    .stepper button { display: grid; place-items: center; width: 2.25rem; height: 2.25rem; border-radius: 50%;
      border: 1px solid var(--color-border); background: var(--color-surface); }
    .stepper button:disabled { opacity: 0.35; cursor: not-allowed; }
    output { min-width: 1.5rem; text-align: center; font-weight: 600; }
  `,
})
export class GuestSelector {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly value = input(1);
  readonly max = input(16);
  readonly valueChange = output<number>();
  protected readonly open = signal(false);

  protected step(delta: number): void {
    this.valueChange.emit(Math.min(this.max(), Math.max(1, this.value() + delta)));
  }
  protected onDocClick(e: Event): void {
    if (!this.el.nativeElement.contains(e.target as Node)) this.open.set(false);
  }
}