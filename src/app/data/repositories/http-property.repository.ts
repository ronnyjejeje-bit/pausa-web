import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { API_BASE_URL } from '../../core/api/api-config';
import { Property } from '../../shared/models/property.model';
import { SearchCriteria } from '../../shared/models/search-criteria';
import { ToastService } from '../../shared/ui/toast.service';
import { AlojamientoDto, toProperty } from '../api/alojamiento.mapper';
import { PropertyRepository } from './property.repository';

const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const isNumericId = (id: string) => /^\d+$/.test(id);

/**
 * Filtros que la API puede respaldar con sus datos: destino, precio y huéspedes.
 * Tipo, servicios y fechas se ignoran porque el backend aún no los tiene.
 */
export function applyCriteria(list: Property[], c: SearchCriteria): Property[] {
  const q = normalize(c.destination);
  const out = list.filter((p) => {
    if (q && !normalize(`${p.city} ${p.title}`).includes(q)) return false;
    if (p.maxGuests < c.guests) return false;
    if (c.priceMin !== null && p.pricePerNight < c.priceMin) return false;
    if (c.priceMax !== null && p.pricePerNight > c.priceMax) return false;
    return true;
  });
  switch (c.sort) {
    case 'price-asc': return out.sort((a, b) => a.pricePerNight - b.pricePerNight);
    case 'price-desc': return out.sort((a, b) => b.pricePerNight - a.pricePerNight);
    default: return out; // sin valoraciones en la API, se conserva el orden del servidor
  }
}

@Injectable()
export class HttpPropertyRepository extends PropertyRepository {
  private readonly http = inject(HttpClient);
  private readonly base = inject(API_BASE_URL);
  private readonly toast = inject(ToastService);

  search(c: SearchCriteria): Observable<Property[]> {
    return this.all().pipe(map((list) => applyCriteria(list, c)));
  }

  getById(id: string): Observable<Property | undefined> {
    // Los ids de los mocks (slugs) no existen en la API: evita un 400 innecesario.
    if (!isNumericId(id)) return of(undefined);
    return this.http.get<AlojamientoDto>(`${this.base}/alojamientos/${id}`).pipe(
      map((a) => (a.activo === false ? undefined : toProperty(a))),
      catchError((e: unknown) =>
        e instanceof HttpErrorResponse && e.status === 404
          ? of(undefined)
          : this.fail<Property | undefined>(e, undefined),
      ),
    );
  }

  getByIds(ids: string[]): Observable<Property[]> {
    const wanted = new Set(ids.filter(isNumericId));
    if (wanted.size === 0) return of([]);
    return this.all().pipe(map((list) => list.filter((p) => wanted.has(p.id))));
  }

  getFeatured(limit: number): Observable<Property[]> {
    return this.all().pipe(map((list) => list.slice(0, limit)));
  }

  /** La API todavía no expone disponibilidad: todo figura como libre. */
  getUnavailableDates(): Observable<string[]> {
    return of([]);
  }

  private all(): Observable<Property[]> {
    return this.http.get<AlojamientoDto[]>(`${this.base}/alojamientos`).pipe(
      map((list) => list.filter((a) => a.activo !== false).map(toProperty)),
      catchError((e: unknown) => this.fail<Property[]>(e, [])),
    );
  }

  private fail<T>(e: unknown, fallback: T): Observable<T> {
    const offline = !(e instanceof HttpErrorResponse) || e.status === 0;
    this.toast.show(
      offline
        ? 'No se pudo conectar con el servidor. ¿Está encendido el backend?'
        : 'El servidor devolvió un error. Inténtalo de nuevo.',
      'error',
      5000,
    );
    return of(fallback);
  }
}