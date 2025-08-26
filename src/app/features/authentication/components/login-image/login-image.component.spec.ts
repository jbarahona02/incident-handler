import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginImage } from './login-image.component';

describe('LoginImage', () => {
  let component: LoginImage;
  let fixture: ComponentFixture<LoginImage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginImage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginImage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
