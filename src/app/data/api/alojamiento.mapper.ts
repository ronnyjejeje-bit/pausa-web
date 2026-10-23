import { Property } from '../../shared/models/property.model';

/** AlojamientoResponseDto del backend. */
export interface AlojamientoDto {
  id: number;
  titulo: string;
  descripcion: string | null;
  ciudad: string;
  direccion: string | null;
  precioPorNoche: number | string;
  capacidadMaxima: number;
  imagenUrl: string | null;
  activo: boolean | null;
}

/**
 * Convención: 0, '' y [] significan "el backend no proporciona este dato".
 * La interfaz oculta esos valores en lugar de mostrar cifras inventadas.
 */
export function toProperty(a: AlojamientoDto): Property {
  return {
    id: String(a.id),
    title: a.titulo,
    tagline: a.direccion ?? '',
    description: a.descripcion ?? '',
        type: null, // el backend no lo ofrece
    city: a.ciudad,
    region: '',
    country: 'Perú',
    pricePerNight: Number(a.precioPorNoche),
    cleaningFee: 0,
    rating: 0,
    reviewCount: 0,
    maxGuests: a.capacidadMaxima,
    bedrooms: 0,
    beds: 0,
    bathrooms: 0,
    amenities: [],
    images: a.imagenUrl ? [a.imagenUrl] : [],
    host: { name: 'Anfitrión', since: 0 },
    rules: [],
  };
}