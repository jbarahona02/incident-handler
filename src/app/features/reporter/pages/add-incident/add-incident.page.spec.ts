import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIncidentPage } from './add-incident.page';

describe('AddIncidentPage', () => {
  let component: AddIncidentPage;
  let fixture: ComponentFixture<AddIncidentPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddIncidentPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddIncidentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
