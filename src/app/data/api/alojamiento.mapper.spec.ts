import { describe, expect, it } from 'vitest';
import { AlojamientoDto, toProperty } from './alojamiento.mapper';

const dto: AlojamientoDto = {
  id: 7,
  titulo: 'Loft en Barranco',
  descripcion: 'Luminoso',
  ciudad: 'Lima',
  direccion: 'Av. Grau 100',
  precioPorNoche: '250.00',
  capacidadMaxima: 3,
  imagenUrl: 'https://ejemplo.pe/foto.jpg',
  activo: true,
};

describe('toProperty', () => {
  it('mapea los campos reales del backend', () => {
    const p = toProperty(dto);
    expect(p.id).toBe('7');
    expect(p.title).toBe('Loft en Barranco');
    expect(p.city).toBe('Lima');
    expect(p.pricePerNight).toBe(250);
    expect(p.maxGuests).toBe(3);
    expect(p.images).toEqual(['https://ejemplo.pe/foto.jpg']);
    expect(p.tagline).toBe('Av. Grau 100');
  });

  it('usa valores neutros para lo que el backend no ofrece', () => {
    const p = toProperty({ ...dto, descripcion: null, direccion: null, imagenUrl: null });
    expect(p.description).toBe('');
    expect(p.images).toEqual([]);
    expect(p.rating).toBe(0);
    expect(p.reviewCount).toBe(0);
    expect(p.amenities).toEqual([]);
    expect(p.rules).toEqual([]);
        expect(p.type).toBeNull();
  });
});