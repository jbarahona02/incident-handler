import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTypePage } from './user-type.page';

describe('UserTypePage', () => {
  let component: UserTypePage;
  let fixture: ComponentFixture<UserTypePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserTypePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserTypePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
