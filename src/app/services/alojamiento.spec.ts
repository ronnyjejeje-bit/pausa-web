
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AlojamientoService } from './alojamiento';

describe('AlojamientoService', () => {
  let service: AlojamientoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(AlojamientoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
