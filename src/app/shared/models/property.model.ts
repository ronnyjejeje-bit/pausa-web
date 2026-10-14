export type PropertyType = 'apartment' | 'house' | 'cabin' | 'villa' | 'boutique';

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  apartment: 'Departamento',
  house: 'Casa',
  cabin: 'Cabaña',
  villa: 'Villa',
  boutique: 'Hotel boutique',
};
export const PROPERTY_TYPES = Object.keys(PROPERTY_TYPE_LABELS) as PropertyType[];

export interface Amenity { id: string; label: string; icon: string; }

export const AMENITIES: Amenity[] = [
  { id: 'wifi', label: 'Wifi rápido', icon: 'wifi' },
  { id: 'ac', label: 'Aire acondicionado', icon: 'snowflake' },
  { id: 'kitchen', label: 'Cocina equipada', icon: 'utensils' },
  { id: 'pool', label: 'Piscina', icon: 'waves' },
  { id: 'parking', label: 'Estacionamiento', icon: 'car' },
  { id: 'tv', label: 'Televisión', icon: 'tv' },
  { id: 'washer', label: 'Lavadora', icon: 'washer' },
  { id: 'workspace', label: 'Espacio de trabajo', icon: 'briefcase' },
  { id: 'bbq', label: 'Parrilla', icon: 'flame' },
  { id: 'pets', label: 'Admite mascotas', icon: 'paw' },
];
export const amenityById = (id: string): Amenity | undefined => AMENITIES.find((a) => a.id === id);

export interface Property {
  id: string;
  title: string;
  tagline: string;
  description: string;
  type: PropertyType;
  city: string;
  region: string;
  country: string;
  pricePerNight: number;
  cleaningFee: number;
  rating: number;
  reviewCount: number;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  amenities: string[];
  images: string[];
  host: { name: string; since: number };
  rules: string[];
  superhost?: boolean;
}