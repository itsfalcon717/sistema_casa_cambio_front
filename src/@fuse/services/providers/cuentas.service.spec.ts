/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CuentasService } from './cuentas.service';

describe('Service: Cuentas', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CuentasService]
    });
  });

  it('should ...', inject([CuentasService], (service: CuentasService) => {
    expect(service).toBeTruthy();
  }));
});
