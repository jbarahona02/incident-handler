import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentsPage } from './incidents.page';

describe('IncidentsPage', () => {
  let component: IncidentsPage;
  let fixture: ComponentFixture<IncidentsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncidentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
