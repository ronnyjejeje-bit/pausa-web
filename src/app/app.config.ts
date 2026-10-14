import { PropertyRepository } from './data/repositories/property.repository';
import { MockPropertyRepository } from './data/repositories/mock-property.repository';
import { ApplicationConfig } from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: PropertyRepository, useClass: MockPropertyRepository },
    provideRouter(
      routes,
      withComponentInputBinding(), // los params de ruta llegan como @Input / input()
      withInMemoryScrolling({ scrollPositionRestoration: 'top' }),
    ),
  ],
};