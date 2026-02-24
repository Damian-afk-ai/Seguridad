import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CardModule,
    FloatLabelModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email: string = '';
  password: string = '';

  // ── Credenciales hardcodeadas para validación ──
  private readonly VALID_EMAIL = 'admin@correo.com';
  private readonly VALID_PASSWORD = 'Seguridad1!';

  constructor(
    private messageService: MessageService,
    private router: Router
  ) { }

  login() {
    // Validar campos vacíos
    if (!this.email || !this.password) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos vacíos',
        detail: 'Por favor ingrese email y contraseña.',
      });
      return;
    }

    // Validar credenciales contra las hardcodeadas
    if (this.email === this.VALID_EMAIL && this.password === this.VALID_PASSWORD) {
      this.messageService.add({
        severity: 'success',
        summary: '¡Bienvenido!',
        detail: 'Inicio de sesión exitoso.',
      });
      // Redirigir al landing después de 1.5 segundos
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 1500);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error de autenticación',
        detail: 'Credenciales incorrectas. Intente de nuevo.',
      });
    }
  }
}
