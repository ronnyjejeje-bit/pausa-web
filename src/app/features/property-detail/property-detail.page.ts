import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { startWith, switchMap } from 'rxjs';
import { PropertyRepository } from '../../data/repositories/property.repository';
import { PROPERTY_TYPE_LABELS, amenityById } from '../../shared/models/property.model';
import { MoneyPipe } from '../../shared/pipes/money.pipe';
import { AvailabilityCalendar, DateRange } from '../../shared/ui/availability-calendar';
import { EmptyState } from '../../shared/ui/empty-state';
import { FavoriteButton } from '../../shared/ui/favorite-button';
import { GuestSelector } from '../../shared/ui/guest-selector';
import { Icon } from '../../shared/ui/icon';
import { ImageGallery } from '../../shared/ui/image-gallery';
import { Rating } from '../../shared/ui/rating';
import { ToastService } from '../../shared/ui/toast.service';
import { asIso, nightsBetween, parseIso } from '../../shared/utils/dates';

@Component({
  selector: 'pausa-property-detail',
  imports: [AvailabilityCalendar, EmptyState, FavoriteButton, GuestSelector, Icon, ImageGallery, MoneyPipe, Rating, RouterLink],
  template: `
    @if (property() === null) {
      <div class="container page" aria-busy="true">
        <div class="skeleton" style="height: 2.4rem; width: 60%"></div>
        <div class="skeleton" style="height: 1rem; width: 30%; margin-top: 0.75rem"></div>
        <div class="skeleton" style="height: 24rem; margin-top: 1.5rem; border-radius: 1.5rem"></div>
        <div class="skeleton" style="height: 12rem; margin-top: 1.5rem"></div>
      </div>
    } @else if (property(); as p) {
      <article class="container page">
        <a class="back" routerLink="/buscar"><pausa-icon name="chevron-left" /> Volver a explorar</a>

        <header class="title">
          <div>
            <h1>{{ p.title }}</h1>
            <p class="loc"><pausa-icon name="map-pin" /> {{ p.city }}, {{ p.region }}, {{ p.country }}</p>
          </div>
          <div class="title-actions">
            <pausa-rating [rating]="p.rating" [count]="p.reviewCount" />
            <pausa-favorite-button [propertyId]="p.id" variant="inline" />
          </div>
        </header>

        <pausa-image-gallery [images]="p.images" [title]="p.title" />

        <div class="cols">
          <div class="main">
            <ul class="facts">
              <li><pausa-icon name="users" /> {{ p.maxGuests }} huéspedes</li>
              <li><pausa-icon name="home" /> {{ p.bedrooms }} {{ p.bedrooms === 1 ? 'dormitorio' : 'dormitorios' }}</li>
              <li><pausa-icon name="bed" /> {{ p.beds }} {{ p.beds === 1 ? 'cama' : 'camas' }}</li>
              <li><pausa-icon name="bath" /> {{ p.bathrooms }} {{ p.bathrooms === 1 ? 'baño' : 'baños' }}</li>
            </ul>

            <section class="host">
              <span class="avatar" aria-hidden="true">{{ p.host.name.charAt(0) }}</span>
              <div>
                <strong>{{ typeLabel(p.type) }} · Anfitrión: {{ p.host.name }}</strong>
                <small>Anfitrión desde {{ p.host.since }}@if (p.superhost) { · Anfitrión destacado }</small>
              </div>
            </section>

            <section>
              <h2>Acerca de este alojamiento</h2>
              <p class="tagline">{{ p.tagline }}</p>
              <p>{{ p.description }}</p>
            </section>

            <section>
              <h2>Lo que ofrece</h2>
              <ul class="amen">
                @for (id of p.amenities; track id) {
                  @let a = amenity(id);
                  @if (a) { <li><pausa-icon [name]="a.icon" /> {{ a.label }}</li> }
                }
              </ul>
            </section>

            <section id="disponibilidad">
              <h2>Disponibilidad</h2>
              <p class="hint">
                @if (nights() > 0) { {{ nights() }} {{ nights() === 1 ? 'noche seleccionada' : 'noches seleccionadas' }}. }
                @else { Elige tu llegada y tu salida en el calendario. }
              </p>
              <pausa-availability-calendar [unavailable]="unavailable()" [checkIn]="checkIn()" [checkOut]="checkOut()"
                (rangeChange)="onRange($event)" />
            </section>

            <section>
              <h2>Reglas de la casa</h2>
              <ul class="rules">@for (r of p.rules; track r) { <li><pausa-icon name="check" /> {{ r }}</li> }</ul>
            </section>
          </div>

          <aside class="booking" id="reserva">
            <div class="card">
              <p class="price"><strong>{{ p.pricePerNight | money }}</strong> <span>/ noche</span></p>

              <div class="dates">
                <button type="button" (click)="goCalendar()"><span class="label">Llegada</span><span>{{ short(checkIn()) }}</span></button>
                <button type="button" (click)="goCalendar()"><span class="label">Salida</span><span>{{ short(checkOut()) }}</span></button>
              </div>
              <pausa-guest-selector class="guest" [value]="guests()" [max]="p.maxGuests" (valueChange)="guests.set($event)" />

              @if (nights() > 0) {
                <dl class="breakdown">
                  <div><dt>{{ p.pricePerNight | money }} × {{ nights() }} {{ nights() === 1 ? 'noche' : 'noches' }}</dt><dd>{{ subtotal() | money }}</dd></div>
                  <div><dt>Tarifa de limpieza</dt><dd>{{ p.cleaningFee | money }}</dd></div>
                  <div class="total"><dt>Total</dt><dd>{{ total() | money }}</dd></div>
                </dl>
              }

              <button type="button" class="btn btn--primary btn--lg btn--block" (click)="reserve()">
                {{ nights() > 0 ? 'Reservar' : 'Elegir fechas' }}
              </button>
              <p class="note">Sin cargos ocultos. Todavía no se te cobra nada.</p>
            </div>
          </aside>
        </div>

        <div class="mbar">
          <p><strong>{{ p.pricePerNight | money }}</strong> <span>/ noche</span></p>
          <button type="button" class="btn btn--primary" (click)="goBooking()">{{ nights() > 0 ? 'Reservar' : 'Ver fechas' }}</button>
        </div>
      </article>
    } @else {
      <div class="container page">
        <pausa-empty-state icon="home" title="Este alojamiento no existe"
          message="Puede que el enlace sea incorrecto o que ya no esté disponible.">
          <a class="btn btn--primary" routerLink="/buscar">Explorar alojamientos</a>
        </pausa-empty-state>
      </div>
    }
  `,
  styles: `
    .page { padding-block: var(--space-5) 0; display: grid; gap: var(--space-4); }
    .back { display: inline-flex; align-items: center; gap: 0.3rem; width: fit-content; text-decoration: none; color: var(--color-ink-soft); font-size: var(--text-sm); }
    .back:hover { color: var(--color-ink); }
    .title { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: var(--space-3); }
    h1 { font-size: var(--text-xl); }
    .loc { display: inline-flex; align-items: center; gap: 0.3rem; margin-top: 0.4rem; color: var(--color-ink-soft); font-size: var(--text-sm); }
    .title-actions { display: flex; align-items: center; gap: var(--space-3); }
    .cols { display: grid; gap: var(--space-6); margin-top: var(--space-3); }
    .main { display: grid; gap: var(--space-6); min-width: 0; }
    .main section { display: grid; gap: var(--space-3); padding-bottom: var(--space-6); border-bottom: 1px solid var(--color-border); }
    .main section:last-child { border-bottom: 0; }
    h2 { font-size: var(--text-lg); }
    .facts { display: flex; flex-wrap: wrap; gap: var(--space-3) var(--space-5); margin: 0; padding: 0 0 var(--space-5); list-style: none; border-bottom: 1px solid var(--color-border); }
    .facts li { display: inline-flex; align-items: center; gap: 0.5rem; }
    .host { grid-auto-flow: column; justify-content: start; align-items: center; gap: var(--space-3) !important; }
    .host div { display: grid; }
    .host small { color: var(--color-ink-soft); }
    .avatar { display: grid; place-items: center; width: 3rem; height: 3rem; border-radius: 50%; background: var(--color-primary); color: #fff; font-family: var(--font-display); font-size: 1.2rem; }
    .tagline { font-family: var(--font-display); font-size: var(--text-lg); color: var(--color-primary); }
    .amen { display: grid; grid-template-columns: 1fr; gap: var(--space-3); margin: 0; padding: 0; list-style: none; }
    .amen li, .rules li { display: flex; align-items: center; gap: var(--space-3); }
    .rules { display: grid; gap: var(--space-2); margin: 0; padding: 0; list-style: none; color: var(--color-ink-soft); }
    .rules pausa-icon { color: var(--color-primary); }
    .hint { color: var(--color-ink-soft); font-size: var(--text-sm); }
    .booking .card { display: grid; gap: var(--space-4); padding: var(--space-5); border: 1px solid var(--color-border); border-radius: var(--radius-lg); background: var(--color-surface); box-shadow: var(--shadow-md); }
    .price strong { font-family: var(--font-display); font-size: var(--text-xl); }
    .price span, .note { color: var(--color-ink-soft); font-size: var(--text-sm); }
    .note { text-align: center; font-size: var(--text-xs); }
    .dates { display: grid; grid-template-columns: 1fr 1fr; border: 1px solid var(--color-border); border-radius: var(--radius-md); overflow: hidden; }
    .dates button { display: grid; gap: 2px; text-align: left; padding: 0.7rem 1rem; border: 0; background: none; font: inherit; }
    .dates button + button { border-left: 1px solid var(--color-border); }
    .dates button:hover { background: var(--color-bg); }
    .label { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: var(--color-ink-soft); }
    .guest { padding: 0.7rem 1rem; border: 1px solid var(--color-border); border-radius: var(--radius-md); }
    .breakdown { display: grid; gap: var(--space-2); margin: 0; font-size: var(--text-sm); }
    .breakdown div { display: flex; justify-content: space-between; gap: var(--space-3); }
    .breakdown dt { color: var(--color-ink-soft); }
    .breakdown dd { margin: 0; }
    .breakdown .total { padding-top: var(--space-3); border-top: 1px solid var(--color-border); font-weight: 600; font-size: var(--text-md); }
    .breakdown .total dt { color: var(--color-ink); }
    .mbar { position: sticky; bottom: 0; z-index: 20; display: flex; align-items: center; justify-content: space-between; gap: var(--space-3);
      margin-inline: calc(var(--space-4) * -1); padding: var(--space-3) var(--space-4); background: var(--color-surface); border-top: 1px solid var(--color-border); }
    .mbar span { color: var(--color-ink-soft); font-size: var(--text-sm); }
    @media (min-width: 600px) { .amen { grid-template-columns: 1fr 1fr; } }
    @media (min-width: 900px) {
      .cols { grid-template-columns: minmax(0, 1fr) 22rem; gap: var(--space-7); align-items: start; }
      .booking { position: sticky; top: calc(var(--header-height) + 1rem); }
      .mbar { display: none; }
    }
  `,
})
export class PropertyDetailPage {
  /** Llega desde la ruta :id (withComponentInputBinding). */
  readonly id = input.required<string>();

  private readonly repo = inject(PropertyRepository);
  private readonly toast = inject(ToastService);
  private readonly title = inject(Title);
  private readonly query = inject(ActivatedRoute).snapshot.queryParamMap;

  /** null = cargando, undefined = no existe. */
  protected readonly property = toSignal(
    toObservable(this.id).pipe(switchMap((id) => this.repo.getById(id).pipe(startWith(null)))),
    { initialValue: null },
  );
  protected readonly unavailable = toSignal(
    toObservable(this.id).pipe(switchMap((id) => this.repo.getUnavailableDates(id))),
    { initialValue: [] as string[] },
  );

  protected readonly checkIn = signal<string | null>(asIso(this.query.get('entrada')));
  protected readonly checkOut = signal<string | null>(asIso(this.query.get('salida')));
  protected readonly guests = signal(Math.max(1, Number(this.query.get('huespedes')) || 1));

  protected readonly nights = computed(() => {
    const a = this.checkIn(); const b = this.checkOut();
    return a && b && b > a ? nightsBetween(a, b) : 0;
  });
  protected readonly subtotal = computed(() => (this.property()?.pricePerNight ?? 0) * this.nights());
  protected readonly total = computed(() => this.subtotal() + (this.nights() > 0 ? (this.property()?.cleaningFee ?? 0) : 0));

  protected readonly amenity = amenityById;
  protected readonly typeLabel = (t: keyof typeof PROPERTY_TYPE_LABELS) => PROPERTY_TYPE_LABELS[t];

  constructor() {
    effect(() => {
      const p = this.property();
      if (p) this.title.setTitle(`${p.title} · Pausa`);
    });
  }

  protected onRange(r: DateRange): void {
    this.checkIn.set(r.checkIn);
    this.checkOut.set(r.checkOut);
  }
  protected short(iso: string | null): string {
    return iso ? parseIso(iso).toLocaleDateString('es-PE', { day: 'numeric', month: 'short' }) : 'Agregar fecha';
  }
  protected goCalendar(): void {
    document.getElementById('disponibilidad')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  protected goBooking(): void {
    if (this.nights() > 0) this.reserve();
    else this.goCalendar();
  }
  protected reserve(): void {
    const p = this.property();
    if (!p) return;
    if (this.nights() === 0) {
      this.toast.show('Elige tus fechas de llegada y salida para continuar.', 'error');
      this.goCalendar();
      return;
    }
    if (this.guests() > p.maxGuests) {
      this.toast.show(`Este alojamiento admite hasta ${p.maxGuests} huéspedes.`, 'error');
      return;
    }
    this.toast.show(`Reserva simulada: ${this.nights()} noches en ${p.city}. La confirmación real llegará con el backend.`, 'success', 5000);
  }
}