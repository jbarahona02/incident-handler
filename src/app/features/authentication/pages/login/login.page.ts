import { Component } from '@angular/core';
import { LoginImageComponent } from '../../components/login-image/login-image.component';
import { LoginFormComponent } from '../../components/login-form/login-form.component';

@Component({
  standalone: true,
  selector: 'app-login-page',
  imports: [LoginImageComponent,LoginFormComponent],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss'
})
export class LoginPage {
}
