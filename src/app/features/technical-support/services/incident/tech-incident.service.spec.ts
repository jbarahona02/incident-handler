import { TestBed } from '@angular/core/testing';

import { TechIncidentService } from './tech-incident.service';

describe('TechIncidentServic', () => {
  let service: TechIncidentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TechIncidentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
