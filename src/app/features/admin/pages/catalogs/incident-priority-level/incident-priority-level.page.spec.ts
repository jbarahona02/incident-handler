import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentPriorityLevelPage } from './incident-priority-level.page';

describe('IncidentPriorityLevelPage', () => {
  let component: IncidentPriorityLevelPage;
  let fixture: ComponentFixture<IncidentPriorityLevelPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentPriorityLevelPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncidentPriorityLevelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
