import { Component, HostListener, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { Icon } from '../../shared/ui/icon';
import { ToastService } from '../../shared/ui/toast.service';
import { FavoritesService } from '../state/favorites.service';

@Component({
  selector: 'pausa-header',
  imports: [RouterLink, RouterLinkActive, Icon],
  template: `
    <header class="header" [class.scrolled]="scrolled()">
      <div class="container bar">
        <a routerLink="/" class="brand" aria-label="Pausa, ir al inicio">
          <svg class="mark" viewBox="0 0 32 32" aria-hidden="true">
            <circle cx="16" cy="16" r="15" fill="var(--color-primary)" />
            <path d="M9.5 21c0-4 2.8-7 6.5-7s6.5 3 6.5 7" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" />
            <circle cx="16" cy="9.5" r="2.2" fill="#e9a07f" />
          </svg>
          <span>Pausa</span>
        </a>

        <nav class="nav" aria-label="Principal">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Inicio</a>
          <a routerLink="/buscar" routerLinkActive="active">Explorar</a>
          <a routerLink="/favoritos" routerLinkActive="active">
            Favoritos @if (favs.count() > 0) { <span class="count">{{ favs.count() }}</span> }
          </a>
        </nav>

        <div class="actions">
          <button type="button" class="btn btn--ghost host" (click)="toast.soon()">Ofrece tu espacio</button>
          <button type="button" class="btn btn--primary" (click)="toast.soon()">Ingresar</button>
          <button type="button" class="burger" (click)="open.set(!open())" [attr.aria-expanded]="open()"
            aria-controls="mobile-menu" aria-label="Abrir menú">
            <pausa-icon [name]="open() ? 'x' : 'menu'" />
          </button>
        </div>
      </div>

      @if (open()) {
        <nav id="mobile-menu" class="mobile reveal" aria-label="Menú móvil">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Inicio</a>
          <a routerLink="/buscar" routerLinkActive="active">Explorar alojamientos</a>
          <a routerLink="/favoritos" routerLinkActive="active">
            Favoritos @if (favs.count() > 0) { <span class="count">{{ favs.count() }}</span> }
          </a>
          <button type="button" class="btn btn--ghost" (click)="toast.soon()">Ofrece tu espacio</button>
        </nav>
      }
    </header>
  `,
  styles: `
    :host { display: block; position: sticky; top: 0; z-index: 50; }
    .header { background: rgb(247 243 236 / 88%); backdrop-filter: blur(12px); border-bottom: 1px solid transparent;
      transition: border-color var(--duration-base) var(--ease), box-shadow var(--duration-base) var(--ease); }
    .header.scrolled { border-bottom-color: var(--color-border); box-shadow: var(--shadow-sm); }
    .bar { display: flex; align-items: center; justify-content: space-between; gap: var(--space-4); height: var(--header-height); }
    .brand { display: inline-flex; align-items: center; gap: var(--space-2); text-decoration: none; color: var(--color-primary);
      font-family: var(--font-display); font-weight: 600; font-size: 1.5rem; }
    .mark { width: 2rem; height: 2rem; }
    .nav { display: none; gap: var(--space-1); }
    .nav a, .mobile a { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.5rem 0.9rem; border-radius: var(--radius-pill);
      text-decoration: none; font-weight: 500; font-size: var(--text-sm); color: var(--color-ink-soft);
      transition: background var(--duration-fast) var(--ease), color var(--duration-fast) var(--ease); }
    .nav a:hover, .mobile a:hover { background: var(--color-surface-alt); color: var(--color-ink); }
    .nav a.active, .mobile a.active { background: var(--color-surface-alt); color: var(--color-primary); }
    .count { display: inline-grid; place-items: center; min-width: 1.25rem; height: 1.25rem; padding: 0 0.35rem; border-radius: var(--radius-pill);
      background: var(--color-primary); color: #fff; font-size: 0.75rem; }
    .actions { display: flex; align-items: center; gap: var(--space-2); }
    .host { display: none; }
    .burger { display: grid; place-items: center; width: 2.75rem; height: 2.75rem; border-radius: 50%;
      border: 1px solid var(--color-border); background: var(--color-surface); font-size: 1.25rem; }
    .mobile { display: grid; gap: var(--space-1); padding: var(--space-3) 1rem var(--space-5); border-top: 1px solid var(--color-border); background: var(--color-bg); }
    .mobile a { padding: 0.85rem 1rem; font-size: var(--text-md); }
    @media (min-width: 900px) {
      .nav { display: flex; }
      .host { display: inline-flex; }
      .burger, .mobile { display: none; }
    }
  `,
})
export class SiteHeader {
  protected readonly favs = inject(FavoritesService);
  protected readonly toast = inject(ToastService);
  protected readonly open = signal(false);
  protected readonly scrolled = signal(false);

  constructor() {
    inject(Router).events
      .pipe(filter((e) => e instanceof NavigationEnd), takeUntilDestroyed())
      .subscribe(() => this.open.set(false));
  }

  @HostListener('window:scroll')
  protected onScroll(): void {
    this.scrolled.set(window.scrollY > 8);
  }
}