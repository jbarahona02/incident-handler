import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolePage } from './role.page';

describe('RoleComponent', () => {
  let component: RolePage;
  let fixture: ComponentFixture<RolePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
