import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentCard } from './incident-card.component';

describe('IncidentCard', () => {
  let component: IncidentCard;
  let fixture: ComponentFixture<IncidentCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncidentCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
