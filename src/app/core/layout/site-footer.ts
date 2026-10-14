import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../shared/ui/toast.service';

@Component({
  selector: 'pausa-footer',
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="container grid">
        <div class="brand">
          <p class="logo">Pausa</p>
          <p>Alojamientos con carácter para escapadas, vacaciones y estadías temporales.</p>
        </div>
        <nav aria-label="Destinos">
          <h2>Destinos</h2>
          <a routerLink="/buscar" [queryParams]="{ destino: 'Lima' }">Lima</a>
          <a routerLink="/buscar" [queryParams]="{ destino: 'Cusco' }">Cusco</a>
          <a routerLink="/buscar" [queryParams]="{ destino: 'Máncora' }">Máncora</a>
          <a routerLink="/buscar" [queryParams]="{ destino: 'Arequipa' }">Arequipa</a>
        </nav>
        <nav aria-label="Explorar">
          <h2>Explorar</h2>
          <a routerLink="/buscar" [queryParams]="{ tipos: 'cabin' }">Cabañas</a>
          <a routerLink="/buscar" [queryParams]="{ tipos: 'villa' }">Villas</a>
          <a routerLink="/buscar" [queryParams]="{ servicios: 'pool' }">Con piscina</a>
          <a routerLink="/buscar" [queryParams]="{ servicios: 'pets' }">Con mascotas</a>
        </nav>
        <nav aria-label="Pausa">
          <h2>Pausa</h2>
          <a href="#" (click)="soon($event)">Cómo funciona</a>
          <a href="#" (click)="soon($event)">Ofrece tu espacio</a>
          <a href="#" (click)="soon($event)">Centro de ayuda</a>
          <a href="#" (click)="soon($event)">Contacto</a>
        </nav>
      </div>
      <div class="container legal">
        <p>© {{ year }} Pausa. Proyecto de demostración.</p>
        <p><a href="#" (click)="soon($event)">Privacidad</a> · <a href="#" (click)="soon($event)">Términos</a> · Español · PEN</p>
      </div>
    </footer>
  `,
  styles: `
    .footer { margin-top: var(--space-8); padding-top: var(--space-7); background: var(--color-surface-alt); border-top: 1px solid var(--color-border); }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-6); padding-bottom: var(--space-6); }
    .brand { grid-column: 1 / -1; display: grid; gap: var(--space-2); max-width: 24rem; color: var(--color-ink-soft); }
    .logo { font-family: var(--font-display); font-size: 1.75rem; font-weight: 600; color: var(--color-primary); }
    nav { display: grid; align-content: start; gap: var(--space-2); }
    h2 { font-family: var(--font-body); font-size: var(--text-sm); font-weight: 600; margin-bottom: var(--space-1); }
    a { color: var(--color-ink-soft); text-decoration: none; font-size: var(--text-sm); }
    a:hover { color: var(--color-primary); text-decoration: underline; }
    .legal { display: flex; flex-direction: column; gap: var(--space-2); padding-block: var(--space-4); border-top: 1px solid var(--color-border);
      color: var(--color-ink-soft); font-size: var(--text-xs); }
    @media (min-width: 900px) {
      .grid { grid-template-columns: 1.6fr 1fr 1fr 1fr; }
      .brand { grid-column: auto; }
      .legal { flex-direction: row; justify-content: space-between; }
    }
  `,
})
export class SiteFooter {
  private readonly toast = inject(ToastService);
  protected readonly year = new Date().getFullYear();

  protected soon(e: Event): void {
    e.preventDefault();
    this.toast.soon();
  }
}