import { TestBed } from '@angular/core/testing';

import { IncidentPriorityLevelService } from './incident-priority-level.service';

describe('IncidentPriorityLevelService', () => {
  let service: IncidentPriorityLevelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncidentPriorityLevelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
