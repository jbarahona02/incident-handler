import { TestBed } from '@angular/core/testing';

import { EquipmentLocationService } from './equipment-location.service';

describe('EquipmentLocationService', () => {
  let service: EquipmentLocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EquipmentLocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
