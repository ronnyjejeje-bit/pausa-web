import { Component, input } from '@angular/core';
import { Icon } from './icon';

@Component({
  selector: 'pausa-empty-state',
  imports: [Icon],
  template: `
    <div class="empty">
      <span class="ic"><pausa-icon [name]="icon()" /></span>
      <h2>{{ title() }}</h2>
      @if (message()) { <p>{{ message() }}</p> }
      <div class="actions"><ng-content /></div>
    </div>
  `,
  styles: `
    .empty { display: grid; justify-items: center; gap: var(--space-3); text-align: center; padding: var(--space-8) var(--space-4);
      border: 1px dashed var(--color-border); border-radius: var(--radius-lg); background: var(--color-surface); }
    .ic { display: grid; place-items: center; width: 4rem; height: 4rem; border-radius: 50%; background: var(--color-surface-alt);
      color: var(--color-primary); font-size: 1.6rem; }
    h2 { font-size: var(--text-xl); }
    p { max-width: 30rem; color: var(--color-ink-soft); }
    .actions { display: flex; gap: var(--space-3); flex-wrap: wrap; justify-content: center; margin-top: var(--space-2); }
  `,
})
export class EmptyState {
  readonly icon = input('search');
  readonly title = input.required<string>();
  readonly message = input('');
}