import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { PropertyRepository } from '../../data/repositories/property.repository';
import { POPULAR_DESTINATIONS } from '../../shared/models/destinations';
import { DEFAULT_CRITERIA, criteriaToParams } from '../../shared/models/search-criteria';
import { Icon } from '../../shared/ui/icon';
import { PropertyCard } from '../../shared/ui/property-card';
import { SearchBar, SearchQuery } from '../../shared/ui/search-bar';
import { SkeletonCard } from '../../shared/ui/skeleton-card';
import { ToastService } from '../../shared/ui/toast.service';

@Component({
  selector: 'pausa-home',
  imports: [RouterLink, Icon, PropertyCard, SearchBar, SkeletonCard],
  template: `
    <section class="hero">
      <img class="bg" src="https://picsum.photos/seed/pausa-hero/1800/1000" alt="" />
      <div class="shade"></div>
      <div class="container inner">
        <p class="eyebrow reveal">Alojamientos con carácter en todo el Perú</p>
        <h1 class="reveal" style="animation-delay: 80ms">Encuentra tu pausa</h1>
        <p class="lead reveal" style="animation-delay: 160ms">
          Casas, cabañas y departamentos elegidos con cuidado para escapadas, vacaciones y estadías temporales.
        </p>
        <pausa-search-bar class="reveal" style="animation-delay: 240ms" (search)="onSearch($event)" />
      </div>
    </section>

    <section class="container block">
      <header class="head"><h2>Inspírate</h2><p>Colecciones para cada tipo de pausa.</p></header>
      <div class="collections">
        @for (c of collections; track c.title; let i = $index) {
          <a class="col reveal" [style.animation-delay.ms]="i * 70" routerLink="/buscar" [queryParams]="c.params">
            <img [src]="'https://picsum.photos/seed/' + c.seed + '/700/500'" alt="" loading="lazy" />
            <span class="cap"><strong>{{ c.title }}</strong><small>{{ c.subtitle }}</small></span>
          </a>
        }
      </div>
    </section>

    <section class="container block">
      <header class="head">
        <div><h2>Los más valorados</h2><p>Alojamientos que sus huéspedes recomiendan.</p></div>
        <a class="more" routerLink="/buscar">Ver todos <pausa-icon name="arrow-right" /></a>
      </header>
      <div class="cards">
        @if (featured(); as list) {
          @for (p of list; track p.id; let i = $index) {
            <pausa-property-card class="reveal" [style.animation-delay.ms]="(i % 8) * 50" [property]="p" />
          }
        } @else {
          @for (n of skeletons; track n) { <pausa-skeleton-card /> }
        }
      </div>
    </section>

    <section class="container block">
      <header class="head"><h2>Destinos populares</h2><p>Lugares para empezar a explorar.</p></header>
      <div class="dests">
        @for (d of destinations; track d.name) {
          <a class="dest" routerLink="/buscar" [queryParams]="{ destino: d.name }">
            <img [src]="'https://picsum.photos/seed/' + d.seed + '/500/500'" alt="" loading="lazy" />
            <span><strong>{{ d.name }}</strong><small>{{ d.region }}</small></span>
          </a>
        }
      </div>
    </section>

    <section class="container block">
      <header class="head"><h2>Por qué Pausa</h2></header>
      <div class="values">
        <article><pausa-icon name="tag" /><h3>Precio transparente</h3><p>Ves el desglose completo antes de reservar: sin cargos escondidos.</p></article>
        <article><pausa-icon name="sparkles" /><h3>Alojamientos curados</h3><p>Pocos lugares, bien descritos y con fotografías que muestran la realidad.</p></article>
        <article><pausa-icon name="shield" /><h3>Reserva con tranquilidad</h3><p>Disponibilidad clara en el calendario y reglas visibles desde el inicio.</p></article>
      </div>
    </section>

    <section class="container block">
      <div class="cta">
        <div><h2>¿Tienes un espacio que merece visitas?</h2><p>Publica tu alojamiento y recibe viajeros que cuidan tu casa.</p></div>
        <button type="button" class="btn btn--lg cta-btn" (click)="toast.soon()">Ofrece tu espacio</button>
      </div>
    </section>
  `,
  styles: `
    .hero { position: relative; isolation: isolate; color: #fff; margin-top: calc(var(--header-height) * -1); padding-top: var(--header-height); }
    .bg { position: absolute; inset: 0; z-index: -2; width: 100%; height: 100%; object-fit: cover; background: var(--color-primary); }
    .shade { position: absolute; inset: 0; z-index: -1; background: linear-gradient(180deg, rgb(20 32 26 / 62%), rgb(20 32 26 / 78%)); }
    .inner { display: grid; gap: var(--space-4); padding-block: var(--space-8) var(--space-7); }
    .eyebrow { font-size: var(--text-sm); letter-spacing: 0.08em; text-transform: uppercase; opacity: 0.9; }
    h1 { font-size: var(--text-2xl); max-width: 14ch; }
    .lead { max-width: 38rem; font-size: var(--text-lg); opacity: 0.95; }
    pausa-search-bar { margin-top: var(--space-4); color: var(--color-ink); max-width: 62rem; }
    .block { padding-top: var(--space-7); }
    .head { display: flex; align-items: flex-end; justify-content: space-between; gap: var(--space-4); margin-bottom: var(--space-5); flex-wrap: wrap; }
    .head h2 { font-size: var(--text-xl); }
    .head p { color: var(--color-ink-soft); margin-top: var(--space-1); }
    .more { display: inline-flex; align-items: center; gap: 0.4rem; font-weight: 500; text-decoration: none; color: var(--color-primary); }
    .more:hover { text-decoration: underline; }
    .collections { display: grid; gap: var(--space-4); grid-template-columns: 1fr 1fr; }
    .col { position: relative; display: block; aspect-ratio: 4 / 5; border-radius: var(--radius-lg); overflow: hidden; background: var(--color-surface-alt); text-decoration: none; color: #fff; }
    .col img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.7s var(--ease); }
    .col:hover img { transform: scale(1.06); }
    .cap { position: absolute; inset: auto 0 0 0; display: grid; gap: 0.15rem; padding: var(--space-4); background: linear-gradient(0deg, rgb(20 32 26 / 85%), transparent); }
    .cap strong { font-family: var(--font-display); font-size: var(--text-lg); }
    .cap small { opacity: 0.9; }
    .cards { display: grid; gap: var(--space-5); grid-template-columns: repeat(auto-fill, minmax(16.5rem, 1fr)); }
    .dests { display: grid; gap: var(--space-4); grid-template-columns: repeat(2, 1fr); }
    .dest { display: flex; align-items: center; gap: var(--space-3); padding: var(--space-2); border-radius: var(--radius-lg); border: 1px solid var(--color-border);
      background: var(--color-surface); text-decoration: none; transition: box-shadow var(--duration-base) var(--ease), transform var(--duration-base) var(--ease); }
    .dest:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
    .dest img { width: 3.5rem; height: 3.5rem; border-radius: var(--radius-md); object-fit: cover; background: var(--color-surface-alt); flex: none; }
    .dest span { display: grid; min-width: 0; }
    .dest small { color: var(--color-ink-soft); }
    .values { display: grid; gap: var(--space-4); }
    .values article { display: grid; gap: var(--space-2); padding: var(--space-5); border-radius: var(--radius-lg); background: var(--color-surface); border: 1px solid var(--color-border); }
    .values pausa-icon { font-size: 1.75rem; color: var(--color-primary); }
    .values h3 { font-size: var(--text-lg); }
    .values p { color: var(--color-ink-soft); font-size: var(--text-sm); }
    .cta { display: grid; gap: var(--space-4); padding: var(--space-6); border-radius: var(--radius-lg); background: var(--color-primary); color: #fff; align-items: center; }
    .cta h2 { font-size: var(--text-xl); }
    .cta p { opacity: 0.9; margin-top: var(--space-2); }
    .cta-btn { background: #fff; color: var(--color-primary); justify-self: start; }
    .cta-btn:hover { background: var(--color-surface-alt); }
    @media (min-width: 600px) { .dests { grid-template-columns: repeat(3, 1fr); } .values { grid-template-columns: repeat(3, 1fr); } }
    @media (min-width: 900px) {
      .collections { grid-template-columns: repeat(4, 1fr); }
      .dests { grid-template-columns: repeat(6, 1fr); }
      .dest { flex-direction: column; text-align: center; padding: var(--space-3); }
      .dest img { width: 100%; height: auto; aspect-ratio: 1; }
      .cta { grid-template-columns: 1fr auto; padding: var(--space-7); }
    }
  `,
})
export class HomePage {
  private readonly router = inject(Router);
  protected readonly toast = inject(ToastService);
  protected readonly featured = toSignal(inject(PropertyRepository).getFeatured(8), { initialValue: null });
  protected readonly skeletons = [1, 2, 3, 4];
  protected readonly destinations = POPULAR_DESTINATIONS;
  protected readonly collections = [
    { title: 'Escapadas frente al mar', subtitle: 'Playa, sol y piscina', seed: 'col-mar', params: { destino: 'Máncora' } },
    { title: 'Para trabajar con calma', subtitle: 'Wifi veloz y escritorio', seed: 'col-work', params: { servicios: 'workspace,wifi' } },
    { title: 'Cabañas y naturaleza', subtitle: 'Montaña, bosque y silencio', seed: 'col-cabin', params: { tipos: 'cabin' } },
    { title: 'Con mascotas bienvenidas', subtitle: 'Todos viajan', seed: 'col-pets', params: { servicios: 'pets' } },
  ];

  protected onSearch(q: SearchQuery): void {
    this.router.navigate(['/buscar'], { queryParams: criteriaToParams({ ...DEFAULT_CRITERIA, ...q }) });
  }
}