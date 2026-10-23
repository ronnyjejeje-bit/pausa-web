import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Property } from '../../shared/models/property.model';
import { DEFAULT_CRITERIA } from '../../shared/models/search-criteria';
import { ToastService } from '../../shared/ui/toast.service';
import { AlojamientoDto } from '../api/alojamiento.mapper';
import { HttpPropertyRepository } from './http-property.repository';

const URL = 'http://localhost:8080/api/v1/alojamientos';

const dto = (over: Partial<AlojamientoDto> = {}): AlojamientoDto => ({
  id: 1,
  titulo: 'Loft',
  descripcion: null,
  ciudad: 'Lima',
  direccion: null,
  precioPorNoche: 200,
  capacidadMaxima: 2,
  imagenUrl: null,
  activo: true,
  ...over,
});

describe('HttpPropertyRepository', () => {
  let repo: HttpPropertyRepository;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpPropertyRepository, provideHttpClient(), provideHttpClientTesting()],
    });
    repo = TestBed.inject(HttpPropertyRepository);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('search filtra por destino, precio y huéspedes, y descarta inactivos', () => {
    let result: Property[] = [];
    repo
      .search({ ...DEFAULT_CRITERIA, destination: 'lima', priceMax: 300, guests: 3 })
      .subscribe((r) => (result = r));

    http.expectOne(URL).flush([
      dto({ id: 1, ciudad: 'Lima', precioPorNoche: 200, capacidadMaxima: 4 }),
      dto({ id: 2, ciudad: 'Lima', precioPorNoche: 500, capacidadMaxima: 4 }),
      dto({ id: 3, ciudad: 'Cusco', precioPorNoche: 100, capacidadMaxima: 4 }),
      dto({ id: 4, ciudad: 'Lima', precioPorNoche: 100, capacidadMaxima: 2 }),
      dto({ id: 5, ciudad: 'Lima', precioPorNoche: 100, capacidadMaxima: 4, activo: false }),
    ]);

    expect(result.map((p) => p.id)).toEqual(['1']);
  });

  it('con la API vacía devuelve una lista vacía', () => {
    let result: Property[] | null = null;
    repo.search(DEFAULT_CRITERIA).subscribe((r) => (result = r));
    http.expectOne(URL).flush([]);
    expect(result).toEqual([]);
  });

  it('getById convierte un 404 en undefined sin mostrar aviso', () => {
    let result: Property | undefined | 'pendiente' = 'pendiente';
    repo.getById('99').subscribe((r) => (result = r));
    http.expectOne(`${URL}/99`).flush(null, { status: 404, statusText: 'Not Found' });
    expect(result).toBeUndefined();
    expect(TestBed.inject(ToastService).toasts().length).toBe(0);
  });

  it('getById no consulta la API con ids que no son numéricos', () => {
    let result: Property | undefined | 'pendiente' = 'pendiente';
    repo.getById('barranco-loft-arte').subscribe((r) => (result = r));
    http.expectNone(`${URL}/barranco-loft-arte`);
    expect(result).toBeUndefined();
  });

  it('si no hay conexión devuelve lista vacía y muestra un aviso', () => {
    let result: Property[] | null = null;
    repo.getFeatured(8).subscribe((r) => (result = r));
    http.expectOne(URL).error(new ProgressEvent('error'));
    expect(result).toEqual([]);
    expect(TestBed.inject(ToastService).toasts().length).toBe(1);
  });

  it('getUnavailableDates devuelve [] sin llamar a la API', () => {
    let result: string[] | null = null;
    repo.getUnavailableDates().subscribe((r) => (result = r));
    expect(result).toEqual([]);
  });
});