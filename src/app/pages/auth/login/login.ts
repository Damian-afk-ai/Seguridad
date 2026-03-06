import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { PermissionsService } from '../../../services/permissions.service';

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
    ToastModule,
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

  private messageService = inject(MessageService);
  private router = inject(Router);
  private permissionsService = inject(PermissionsService);

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
      // ── Simular recepción de JWT ──
      const fakeJwt = this.generateFakeJwt();
      console.log('🎫 JWT recibido (simulado):', fakeJwt);

      // ── Decodificar el payload del JWT falso ──
      const payload = this.decodeJwtPayload(fakeJwt);
      console.log('📦 Payload decodificado:', payload);

      // ── Cargar permisos en el servicio antes de redirigir ──
      this.permissionsService.setPermissions(payload.permissions);

      this.messageService.add({
        severity: 'success',
        summary: '¡Bienvenido!',
        detail: 'Inicio de sesión exitoso.',
      });

      // Redirigir al home después de 1.5 segundos
      setTimeout(() => {
        this.router.navigate(['/home']);
      }, 1500);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error de autenticación',
        detail: 'Credenciales incorrectas. Intente de nuevo.',
      });
    }
  }

  // ── Genera un JWT falso con estructura header.payload.signature ──
  private generateFakeJwt(): string {
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = {
      sub: '1',
      email: this.VALID_EMAIL,
      name: 'Administrador',
      permissions: [
        'users_view',
        'users_edit',
        'groups_view',
        'tickets_view',
        'tickets_add',
        'tickets_edit',
      ],
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
    };

    const encode = (obj: object) => btoa(JSON.stringify(obj));
    const fakeSignature = 'fake-signature-practica8';

    return `${encode(header)}.${encode(payload)}.${btoa(fakeSignature)}`;
  }

  // ── Decodifica el payload del JWT falso ──
  private decodeJwtPayload(token: string): any {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Token JWT inválido');
    }
    const payload = JSON.parse(atob(parts[1]));
    return payload;
  }
}
