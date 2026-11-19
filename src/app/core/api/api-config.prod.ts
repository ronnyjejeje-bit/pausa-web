import { InjectionToken } from '@angular/core';

/** Version de produccion: sustituye a api-config.ts en el build de produccion (ver angular.json). */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => '/api/v1', // no se usa mientras USE_MOCK_API sea true
});

/** En la web publicada (GitHub Pages) no hay backend, asi que se usan datos de prueba. */
export const USE_MOCK_API = true;
