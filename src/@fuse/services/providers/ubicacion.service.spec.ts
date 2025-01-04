/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UbicacionService } from './ubicacion.service';

describe('Service: Ubicacion', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UbicacionService]
    });
  });

  it('should ...', inject([UbicacionService], (service: UbicacionService) => {
    expect(service).toBeTruthy();
  }));
});
