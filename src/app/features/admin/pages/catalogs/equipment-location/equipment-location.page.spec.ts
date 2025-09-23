import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentLocationPage } from './equipment-location.page';

describe('EquipmentLocationPage', () => {
  let component: EquipmentLocationPage;
  let fixture: ComponentFixture<EquipmentLocationPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquipmentLocationPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EquipmentLocationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
