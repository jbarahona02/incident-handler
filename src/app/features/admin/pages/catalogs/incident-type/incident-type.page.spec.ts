import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentTypePage } from './incident-type.page';

describe('IncidentTypePage', () => {
  let component: IncidentTypePage;
  let fixture: ComponentFixture<IncidentTypePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentTypePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncidentTypePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
