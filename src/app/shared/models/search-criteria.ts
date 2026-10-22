import { ParamMap, Params } from '@angular/router';
import { PROPERTY_TYPES, PropertyType } from './property.model';
import { asIso } from '../utils/dates';

export type SortOption = 'recommended' | 'price-asc' | 'price-desc' | 'rating';

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'recommended', label: 'Recomendados' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
  { value: 'rating', label: 'Mejor valorados' },
];

export interface SearchCriteria {
  destination: string;
  checkIn: string | null;
  checkOut: string | null;
  guests: number;
  priceMin: number | null;
  priceMax: number | null;
  types: PropertyType[];
  amenities: string[];
  sort: SortOption;
}

export const DEFAULT_CRITERIA: SearchCriteria = {
  destination: '', checkIn: null, checkOut: null, guests: 1,
  priceMin: null, priceMax: null, types: [], amenities: [], sort: 'recommended',
};

const list = (v: string | null): string[] => (v ? v.split(',').filter(Boolean) : []);
const num = (v: string | null): number | null => {
  if (v === null || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : null;
};

/** Los filtros viven en la URL: se puede compartir y funciona el botón "atrás". */

export function criteriaFromParams(p: ParamMap): SearchCriteria {
  const guests = num(p.get('huespedes'));
  let priceMin = num(p.get('min'));
  let priceMax = num(p.get('max'));

  // Evitar rangos de precios contradictorios en la URL.
  if (priceMin !== null && priceMax !== null && priceMin > priceMax) {
    priceMin = null;
    priceMax = null;
  }

  return {
    destination: (p.get('destino') ?? '').trim(),
    checkIn: asIso(p.get('entrada')),
    checkOut: asIso(p.get('salida')),
    guests: guests !== null && guests >= 1 ? Math.floor(guests) : 1,
    priceMin,
    priceMax,
    types: list(p.get('tipos')).filter(
      (t): t is PropertyType => (PROPERTY_TYPES as string[]).includes(t),
    ),
    amenities: list(p.get('servicios')),
    sort: SORT_OPTIONS.find((o) => o.value === p.get('orden'))?.value ?? 'recommended',
  };
}


export function criteriaToParams(c: SearchCriteria): Params {
  const q: Params = {};
  if (c.destination) q['destino'] = c.destination;
  if (c.checkIn) q['entrada'] = c.checkIn;
  if (c.checkOut) q['salida'] = c.checkOut;
  if (c.guests > 1) q['huespedes'] = c.guests;
  if (c.priceMin !== null) q['min'] = c.priceMin;
  if (c.priceMax !== null) q['max'] = c.priceMax;
  if (c.types.length) q['tipos'] = c.types.join(',');
  if (c.amenities.length) q['servicios'] = c.amenities.join(',');
  if (c.sort !== 'recommended') q['orden'] = c.sort;
  return q;
}