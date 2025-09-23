import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentTypePage } from './equipment-type.page';

describe('EquipmentTypePage', () => {
  let component: EquipmentTypePage;
  let fixture: ComponentFixture<EquipmentTypePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquipmentTypePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EquipmentTypePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
