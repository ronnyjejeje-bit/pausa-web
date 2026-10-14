import { Component, computed, input, signal } from '@angular/core';
import { Icon } from './icon';

@Component({
  selector: 'pausa-image-gallery',
  imports: [Icon],
  host: { '(document:keydown)': 'onKey($event)' },
  template: `
    <div class="grid">
      @for (src of shown(); track src; let i = $index) {
        <button type="button" class="cell" [class.main]="i === 0" (click)="show(i)"
          [attr.aria-label]="'Ver foto ' + (i + 1) + ' de ' + title()">
          <img [src]="src" [alt]="title() + ', foto ' + (i + 1)" [attr.loading]="i === 0 ? 'eager' : 'lazy'" (error)="hide($event)" />
        </button>
      }
      <button type="button" class="btn btn--ghost all" (click)="show(0)">
        <pausa-icon name="grid" /> Ver las {{ images().length }} fotos
      </button>
    </div>

    @if (open()) {
      <div class="lightbox" role="dialog" aria-modal="true" aria-label="Galería de fotos" (click)="close()">
        <button type="button" class="x" (click)="close()" aria-label="Cerrar galería"><pausa-icon name="x" /></button>
        <button type="button" class="nav prev" (click)="step(-1); $event.stopPropagation()" aria-label="Foto anterior"><pausa-icon name="chevron-left" /></button>
        <figure (click)="$event.stopPropagation()">
          <img [src]="images()[index()]" [alt]="title() + ', foto ' + (index() + 1)" />
          <figcaption>{{ index() + 1 }} / {{ images().length }}</figcaption>
        </figure>
        <button type="button" class="nav next" (click)="step(1); $event.stopPropagation()" aria-label="Foto siguiente"><pausa-icon name="chevron-right" /></button>
      </div>
    }
  `,
  styles: `
    :host { display: block; }
    .grid { position: relative; display: block; height: 17rem; border-radius: var(--radius-lg); overflow: hidden; }
    .cell { display: block; width: 100%; height: 100%; padding: 0; border: 0; background: linear-gradient(135deg, var(--color-surface-alt), var(--color-border)); overflow: hidden; }
    .cell:not(.main) { display: none; }
    .cell img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s var(--ease), filter 0.3s; }
    .cell:hover img { transform: scale(1.03); filter: brightness(0.94); }
    .all { position: absolute; right: 0.75rem; bottom: 0.75rem; box-shadow: var(--shadow-md); }
    .lightbox { position: fixed; inset: 0; z-index: 90; display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: var(--space-3);
      padding: var(--space-5); background: rgb(15 22 18 / 92%); animation: rise 0.25s var(--ease) both; }
    figure { margin: 0; display: grid; gap: var(--space-2); justify-items: center; min-width: 0; }
    figure img { max-height: 80dvh; max-width: 100%; object-fit: contain; border-radius: var(--radius-md); }
    figcaption { color: #fff; font-size: var(--text-sm); }
    .x, .nav { display: grid; place-items: center; width: 2.75rem; height: 2.75rem; border-radius: 50%; border: 0; background: rgb(255 255 255 / 14%); color: #fff; font-size: 1.3rem; }
    .x:hover, .nav:hover { background: rgb(255 255 255 / 28%); }
    .x { position: absolute; top: 1rem; right: 1rem; }
    @media (min-width: 900px) {
      .grid { display: grid; height: 28rem; grid-template-columns: 2fr 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 0.5rem; }
      .cell:not(.main) { display: block; }
      .cell.main { grid-row: span 2; }
    }
    @media (max-width: 599px) { .lightbox { grid-template-columns: 1fr; } .nav { display: none; } }
  `,
})
export class ImageGallery {
  readonly images = input.required<string[]>();
  readonly title = input('Alojamiento');
  protected readonly shown = computed(() => this.images().slice(0, 5));
  protected readonly open = signal(false);
  protected readonly index = signal(0);

  protected show(i: number): void { this.index.set(i); this.open.set(true); }
  protected close(): void { this.open.set(false); }
  protected step(d: number): void {
    const n = this.images().length;
    this.index.update((i) => (i + d + n) % n);
  }
  protected hide(e: Event): void { (e.target as HTMLImageElement).style.visibility = 'hidden'; }
  protected onKey(e: KeyboardEvent): void {
    if (!this.open()) return;
    if (e.key === 'Escape') this.close();
    if (e.key === 'ArrowLeft') this.step(-1);
    if (e.key === 'ArrowRight') this.step(1);
  }
}