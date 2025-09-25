import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentDetailAdminComponent } from './incident-detail-admin.component';

describe('IncidentDetailAdminComponent', () => {
  let component: IncidentDetailAdminComponent;
  let fixture: ComponentFixture<IncidentDetailAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentDetailAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncidentDetailAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
