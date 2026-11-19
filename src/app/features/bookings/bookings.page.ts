import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookingService } from '../../core/state/booking.service';
import { MoneyPipe } from '../../shared/pipes/money.pipe';
import { EmptyState } from '../../shared/ui/empty-state';
import { Icon } from '../../shared/ui/icon';

@Component({
  selector: 'pausa-bookings',
  imports: [EmptyState, Icon, MoneyPipe, RouterLink],
  template: `
    <section class="container page">
      <h1>Mis Reservas</h1>
      <p class="sub">Consulta tus próximas estadías y tu historial de alojamientos.</p>

      @if (bookings().length === 0) {
        <pausa-empty-state icon="home" title="Aún no tienes ninguna reserva"
          message="Cuando confirmes una estadía en cualquier alojamiento, aparecerá detallada en esta sección.">
          <a class="btn btn--primary" routerLink="/buscar">Explorar alojamientos</a>
        </pausa-empty-state>
      } @else {
        <div class="list">
          @for (b of bookings(); track b.id) {
            <article class="card" [class.cancelled]="b.status === 'CANCELLED'">
              <img [src]="b.propertyImage" [alt]="b.propertyTitle" />
              <div class="info">
                <header>
                  <h2>{{ b.propertyTitle }}</h2>
                  <span class="badge" [class.danger]="b.status === 'CANCELLED'">
                    {{ b.status === 'CONFIRMED' ? 'Confirmada' : 'Cancelada' }}
                  </span>
                </header>
                <p class="loc"><pausa-icon name="map-pin" /> {{ b.city }}</p>
                <p class="dates">
                  <pausa-icon name="calendar" /> {{ b.checkIn }} al {{ b.checkOut }} · {{ b.guests }} huésped(es)
                </p>
                <p class="price">Total pagado: <strong>{{ b.totalPrice | money }}</strong></p>
              </div>
              @if (b.status === 'CONFIRMED') {
                <button type="button" class="btn btn--ghost danger-btn" (click)="bookingService.cancelBooking(b.id)">
                  Cancelar reserva
                </button>
              }
            </article>
          }
        </div>
      }
    </section>
  `,
  styles: `
    .page { padding-block: var(--space-6) 0; display: grid; gap: var(--space-3); }
    h1 { font-size: var(--text-xl); }
    .sub { color: var(--color-ink-soft); margin-bottom: var(--space-4); }
    .list { display: grid; gap: var(--space-4); }
    .card { display: grid; grid-template-columns: 8rem 1fr auto; gap: var(--space-4); padding: var(--space-4); border: 1px solid var(--color-border); border-radius: var(--radius-lg); background: var(--color-surface); align-items: center; }
    .card.cancelled { opacity: 0.6; }
    .card img { width: 100%; height: 6rem; object-fit: cover; border-radius: var(--radius-md); }
    .info { display: grid; gap: 0.2rem; }
    .info header { display: flex; align-items: center; gap: var(--space-3); }
    .info h2 { font-size: var(--text-md); margin: 0; }
    .loc, .dates { color: var(--color-ink-soft); font-size: var(--text-sm); display: flex; align-items: center; gap: 0.4rem; }
    .badge { padding: 0.2rem 0.6rem; border-radius: var(--radius-pill); font-size: 0.75rem; background: #e6f4ea; color: #137333; font-weight: 600; }
    .badge.danger { background: #fce8e6; color: #c5221f; }
    .danger-btn { color: #c5221f; }
    @media (max-width: 650px) { .card { grid-template-columns: 1fr; } }
  `,
})
export class BookingsPage {
  protected readonly bookingService = inject(BookingService);
  protected readonly bookings = this.bookingService.bookings;
}