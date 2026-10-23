import { InjectionToken } from '@angular/core';

/** URL base de la API. El backend ya permite CORS desde http://localhost:4200. */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => 'http://localhost:8080/api/v1',
});
/**
 * Interruptor de datos: false = API real (Spring Boot), true = datos de prueba (mocks).
 * Un único lugar para cambiar de modo en desarrollo.
 */
export const USE_MOCK_API = false;