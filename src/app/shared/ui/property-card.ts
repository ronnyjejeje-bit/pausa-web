import { Component, computed, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';
import { MoneyPipe } from '../pipes/money.pipe';
import { Amenity, PROPERTY_TYPE_LABELS, Property, amenityById } from '../models/property.model';
import { FavoriteButton } from './favorite-button';
import { Icon } from './icon';
import { Rating } from './rating';

@Component({
  selector: 'pausa-property-card',
  imports: [RouterLink, MoneyPipe, FavoriteButton, Icon, Rating],
  template: `
    @let p = property();
    <article class="card">
      <div class="media">
        @if (p.images[0]) {
          <img class="a" [src]="p.images[0]" [alt]="p.title" loading="lazy" (error)="hide($event)" />
        } @else {
          <span class="noimg" aria-hidden="true"><pausa-icon name="home" /></span>
        }
        @if (p.images[1]) {
          <img class="b" [src]="p.images[1]" alt="" loading="lazy" (error)="hide($event)" />
        }
        @if (p.superhost) { <span class="badge">Anfitrión destacado</span> }
        <pausa-favorite-button class="fav" [propertyId]="p.id" />
      </div>
      <div class="body">
        <div class="row">
          <p class="loc"><pausa-icon name="map-pin" /> {{ place() }}</p>
          <pausa-rating [rating]="p.rating" [count]="p.reviewCount" />
        </div>
        <h3>
          <a class="stretch" [routerLink]="['/alojamiento', p.id]" [queryParams]="queryParams()">{{ p.title }}</a>
        </h3>
        <p class="meta">
          @if (typeLabel()) { {{ typeLabel() }} · }
          hasta {{ p.maxGuests }} huéspedes
          @if (p.bedrooms > 0) { · {{ p.bedrooms }} hab. }
        </p>
        @if (topAmenities().length) {
          <ul class="amen">
            @for (a of topAmenities(); track a.id) { <li><pausa-icon [name]="a.icon" /> {{ a.label }}</li> }
          </ul>
        }
        <p class="price">
          <strong>{{ p.pricePerNight | money }}</strong> <span>/ noche</span>
          @if (nights() > 0) {
            <span class="total">· {{ total() | money }} por {{ nights() }} {{ nights() === 1 ? 'noche' : 'noches' }}</span>
          }
        </p>
      </div>
    </article>
  `,
  styles: `
    :host { display: block; }
    .card { position: relative; display: flex; flex-direction: column; height: 100%; background: var(--color-surface);
      border: 1px solid var(--color-border); border-radius: var(--radius-lg); overflow: hidden;
      transition: transform var(--duration-base) var(--ease), box-shadow var(--duration-base) var(--ease); }
    .card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }
    .media { position: relative; aspect-ratio: 4 / 3; background: linear-gradient(135deg, var(--color-surface-alt), var(--color-border)); overflow: hidden; }
    .media img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: opacity 0.5s var(--ease), transform 0.8s var(--ease); }
    .media .b { opacity: 0; }
    .card:hover .media .b { opacity: 1; }
    .card:hover .media img { transform: scale(1.04); }
    .noimg { position: absolute; inset: 0; display: grid; place-items: center; font-size: 2.5rem; color: var(--color-ink-soft); }
    .badge { position: absolute; z-index: 2; top: 0.75rem; left: 0.75rem; padding: 0.3rem 0.7rem; border-radius: var(--radius-pill);
      background: rgb(255 255 255 / 94%); font-size: 0.75rem; font-weight: 600; }
    .fav { position: absolute; z-index: 3; top: 0.6rem; right: 0.6rem; }
    .body { display: grid; gap: var(--space-2); padding: var(--space-4); }
    .row { display: flex; align-items: center; justify-content: space-between; gap: var(--space-2); }
    .loc { display: inline-flex; align-items: center; gap: 0.3rem; color: var(--color-ink-soft); font-size: var(--text-xs); }
    h3 { font-size: var(--text-lg); line-height: 1.25; }
    .stretch { text-decoration: none; }
    .stretch::after { content: ''; position: absolute; inset: 0; z-index: 1; }
    .meta { color: var(--color-ink-soft); font-size: var(--text-xs); }
    .amen { display: flex; flex-wrap: wrap; gap: 0.35rem 0.9rem; margin: 0; padding: 0; list-style: none; color: var(--color-ink-soft); font-size: var(--text-xs); }
    .amen li { display: inline-flex; align-items: center; gap: 0.3rem; }
    .price { margin-top: var(--space-1); font-size: var(--text-sm); color: var(--color-ink-soft); }
    .price strong { font-size: var(--text-lg); color: var(--color-ink); font-family: var(--font-display); }
    .total { color: var(--color-primary); font-weight: 500; }
    .fav { pointer-events: auto; }
  `,
})
export class PropertyCard {
  readonly property = input.required<Property>();
  readonly nights = input(0);
  readonly queryParams = input<Params | null>(null);

  protected readonly place = computed(() =>
    [this.property().city, this.property().region].filter(Boolean).join(', '),
  );
  protected readonly typeLabel = computed(() => {
    const t = this.property().type;
    return t ? PROPERTY_TYPE_LABELS[t] : '';
  });
  protected readonly topAmenities = computed(() =>
    this.property().amenities.slice(0, 3).map(amenityById).filter((a): a is Amenity => !!a),
  );
  protected readonly total = computed(() => this.property().pricePerNight * this.nights() + this.property().cleaningFee);

  protected hide(e: Event): void {
    (e.target as HTMLImageElement).style.visibility = 'hidden';
  }
}