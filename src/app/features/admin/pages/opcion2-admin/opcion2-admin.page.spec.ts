import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Opcion2AdminPage } from './opcion2-admin.page';

describe('Opcion2AdminPage', () => {
  let component: Opcion2AdminPage;
  let fixture: ComponentFixture<Opcion2AdminPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Opcion2AdminPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Opcion2AdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
