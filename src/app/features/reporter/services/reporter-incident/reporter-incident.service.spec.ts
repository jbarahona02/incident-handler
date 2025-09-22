import { TestBed } from '@angular/core/testing';

import { ReporterIncidentService } from './reporter-incident.service';

describe('ReporterIncidentService', () => {
  let service: ReporterIncidentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReporterIncidentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
