import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentDetailTechComponent } from './incident-detail-tech.component';

describe('IncidentDetailTechComponent', () => {
  let component: IncidentDetailTechComponent;
  let fixture: ComponentFixture<IncidentDetailTechComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentDetailTechComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncidentDetailTechComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
