import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { ErrorState } from '../../../../shared/interfaces';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../../../admin/services/login/login.service';
import { AuthService } from '../../services/auth/auth-service';
import { LoginResponse } from '../../interfaces';

@Component({
  selector: 'app-login-form',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})
export class LoginFormComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  
  // Subjects para manejar el estado de errores
  private emailErrorSubject = new BehaviorSubject<ErrorState>({ show: false, errors: null });
  private passwordErrorSubject = new BehaviorSubject<ErrorState>({ show: false, errors: null });
  private $destroy = new Subject<void>();

  // Observables públicos para el template
  $emailErrors = this.emailErrorSubject.asObservable();
  $passwordErrors = this.passwordErrorSubject.asObservable();
  
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private loginService : LoginService,
    private authService: AuthService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")]],
      password: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(12)]]
    });
  }

  ngOnInit(): void {
    this.setupFormListeners();
  }

  ngOnDestroy(): void {
    this.$destroy.next();
    this.$destroy.complete();
  }

  private setupFormListeners(): void {
    const emailControl : AbstractControl<any, any, any> | null  = this.loginForm.get('email');
    const passwordControl : AbstractControl<any, any, any> | null  = this.loginForm.get('password');

    if (emailControl) {
      emailControl.valueChanges.pipe(
        takeUntil(this.$destroy)
      ).subscribe(() => {
        this.updateErrorState(emailControl, this.emailErrorSubject);
      });
    }

    if (passwordControl) {
      passwordControl.valueChanges.pipe(
        takeUntil(this.$destroy)
      ).subscribe(() => {
        this.updateErrorState(passwordControl, this.passwordErrorSubject);
      });
    }
  }

  private updateErrorState(control: AbstractControl<any, any, any>, subject: BehaviorSubject<ErrorState>): void {
    subject.next({
      show: control.touched && control.invalid,
      errors: control.errors
    });
  }

  async submit() {
    try {
      // this.router.navigate(["admin","home"]);
      if (this.loginForm.valid) {
      
        const loginResponse : LoginResponse =  await this.loginService.login(this.loginForm.value);

         // Guardar los tokens usando el AuthService
        this.authService.setTokens(
          loginResponse.accessToken,
          loginResponse.refreshToken,
          loginResponse.expiresIn,
          loginResponse.refreshExpiresIn
        );

        // Aquí puedes hacer la llamada al backend
        this.router.navigate(["admin","home"]);
      } else {
        // Marcar todos los campos como tocados para mostrar errores
        Object.keys(this.loginForm.controls).forEach(key => {
          const control = this.loginForm.get(key);
          if (control) {
            control.markAsTouched();
            this.updateErrorState(control, key === 'email' ? this.emailErrorSubject : this.passwordErrorSubject);
          }
        });
      }
    } catch(err){

    }
  }
}