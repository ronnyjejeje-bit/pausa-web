import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { PROPERTIES } from '../mocks/properties.mock';
import { PropertyRepository } from './property.repository';
import { Property } from '../../shared/models/property.model';
import { SearchCriteria } from '../../shared/models/search-criteria';
import { addDaysIso, eachNight, todayIso } from '../../shared/utils/dates';

const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

/** Fechas ocupadas simuladas: deterministas por alojamiento, relativas a hoy. */
function bookedDates(id: string): Set<string> {
  let h = 0;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) % 9973;
  const set = new Set<string>();
  const start = todayIso();
  for (let k = 0; k < 4; k++) {
    const offset = 3 + ((h >> k) % 9) + k * 16;
    const length = 2 + ((h + k) % 5);
    for (let i = 0; i < length; i++) set.add(addDaysIso(start, offset + i));
  }
  return set;
}

@Injectable()
export class MockPropertyRepository extends PropertyRepository {
  private readonly latency = 650; // simula red para ver skeletons

  search(c: SearchCriteria): Observable<Property[]> {
    return this.respond(this.run(c));
  }
  getById(id: string): Observable<Property | undefined> {
    return this.respond(PROPERTIES.find((p) => p.id === id));
  }
  getByIds(ids: string[]): Observable<Property[]> {
    return this.respond(ids.map((id) => PROPERTIES.find((p) => p.id === id)).filter((p): p is Property => !!p));
  }
  getFeatured(limit: number): Observable<Property[]> {
    return this.respond([...PROPERTIES].sort((a, b) => b.rating - a.rating).slice(0, limit));
  }
  getUnavailableDates(id: string): Observable<string[]> {
    return this.respond([...bookedDates(id)].sort());
  }

  private respond<T>(value: T): Observable<T> {
    return of(value).pipe(delay(this.latency));
  }

  private run(c: SearchCriteria): Property[] {
    const q = normalize(c.destination);
    const nights = c.checkIn && c.checkOut && c.checkOut > c.checkIn ? eachNight(c.checkIn, c.checkOut) : [];

    const list = PROPERTIES.filter((p) => {
      if (q && !normalize(`${p.city} ${p.region} ${p.country} ${p.title}`).includes(q)) return false;
      if (p.maxGuests < c.guests) return false;
      if (c.priceMin !== null && p.pricePerNight < c.priceMin) return false;
      if (c.priceMax !== null && p.pricePerNight > c.priceMax) return false;
      if (c.types.length && !c.types.includes(p.type)) return false;
      if (!c.amenities.every((a) => p.amenities.includes(a))) return false;
      if (nights.length) {
        const booked = bookedDates(p.id);
        if (nights.some((n) => booked.has(n))) return false;
      }
      return true;
    });

    const score = (p: Property) => p.rating * Math.log10(p.reviewCount + 10);
    switch (c.sort) {
      case 'price-asc': return list.sort((a, b) => a.pricePerNight - b.pricePerNight);
      case 'price-desc': return list.sort((a, b) => b.pricePerNight - a.pricePerNight);
      case 'rating': return list.sort((a, b) => b.rating - a.rating);
      default: return list.sort((a, b) => score(b) - score(a));
    }
  }
}