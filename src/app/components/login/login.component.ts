import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup;
  registerForm: FormGroup;
  isLoginMode = true;
  errorMessage = '';
  loading = false;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registerForm = this.fb.group({
      displayName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
  }

  async onLogin() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor, completa todos los campos correctamente.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      const { email, password } = this.loginForm.value;
      await this.authService.login(email, password);
      this.router.navigate(['/evaluaciones']);
    } catch (error: any) {
      this.errorMessage = this.getErrorMessage(error.code);
    } finally {
      this.loading = false;
    }
  }

  async onRegister() {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Por favor, completa todos los campos correctamente.';
      return;
    }

    const { password, confirmPassword } = this.registerForm.value;
    if (password !== confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      const { displayName, email, password } = this.registerForm.value;
      await this.authService.register(email, password, displayName);
      this.router.navigate(['/evaluaciones']);
    } catch (error: any) {
      this.errorMessage = this.getErrorMessage(error.code);
    } finally {
      this.loading = false;
    }
  }

  private getErrorMessage(errorCode: string): string {
    const errorMessages: { [key: string]: string } = {
      'auth/email-already-in-use': 'Este correo electrónico ya está registrado.',
      'auth/invalid-email': 'El correo electrónico no es válido.',
      'auth/operation-not-allowed': 'Operación no permitida.',
      'auth/weak-password': 'La contraseña es demasiado débil.',
      'auth/user-disabled': 'Esta cuenta ha sido deshabilitada.',
      'auth/user-not-found': 'No existe una cuenta con este correo.',
      'auth/wrong-password': 'Contraseña incorrecta.',
      'auth/invalid-credential': 'Credenciales inválidas. Verifica tu correo y contraseña.'
    };

    return errorMessages[errorCode] || 'Ocurrió un error. Inténtalo de nuevo.';
  }
}
