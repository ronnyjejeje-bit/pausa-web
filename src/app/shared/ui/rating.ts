import { Component, input } from '@angular/core';
import { Icon } from './icon';

@Component({
  selector: 'pausa-rating',
  imports: [Icon],
  template: `
    <span class="r" [attr.aria-label]="'Valoración ' + rating() + ' de 5'">
      <pausa-icon name="star" [filled]="true" />
      <strong>{{ rating().toFixed(2).replace('.', ',') }}</strong>
      @if (count()) { <span class="c">({{ count() }})</span> }
    </span>
  `,
  styles: `
    .r { display: inline-flex; align-items: center; gap: 0.3rem; font-size: var(--text-sm); }
    pausa-icon { color: var(--color-star); font-size: 1rem; }
    .c { color: var(--color-ink-soft); }
  `,
})
export class Rating {
  readonly rating = input.required<number>();
  readonly count = input<number | null>(null);
}