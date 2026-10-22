import { TestBed } from '@angular/core/testing';

import { Alojamiento } from './alojamiento';

describe('Alojamiento', () => {
  let service: Alojamiento;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Alojamiento);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
