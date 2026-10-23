import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';

import { routes } from './app.routes';
import { USE_MOCK_API } from './core/api/api-config';
import { PropertyRepository } from './data/repositories/property.repository';
import { MockPropertyRepository } from './data/repositories/mock-property.repository';
import { HttpPropertyRepository } from './data/repositories/http-property.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    {
      provide: PropertyRepository,
      useClass: USE_MOCK_API ? MockPropertyRepository : HttpPropertyRepository,
    },
    provideRouter(
      routes,
      withComponentInputBinding(), // los params de ruta llegan como @Input / input()
      withInMemoryScrolling({ scrollPositionRestoration: 'top' }),
    ),
  ],
};