import { Component } from '@angular/core';

@Component({
  selector: 'pausa-skeleton-card',
  template: `
    <div class="card" aria-hidden="true">
      <div class="skeleton img"></div>
      <div class="body">
        <div class="skeleton l1"></div>
        <div class="skeleton l2"></div>
        <div class="skeleton l3"></div>
      </div>
    </div>
  `,
  styles: `
    .card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); overflow: hidden; }
    .img { aspect-ratio: 4 / 3; border-radius: 0; }
    .body { display: grid; gap: var(--space-3); padding: var(--space-4); }
    .l1 { height: 0.8rem; width: 45%; } .l2 { height: 1.2rem; width: 85%; } .l3 { height: 1rem; width: 35%; }
  `,
})
export class SkeletonCard {}