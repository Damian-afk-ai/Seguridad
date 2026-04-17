import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../../services/auth.service';

// ── Rate Limit Config ────────────────────────────────────────────────────────
const MAX_ATTEMPTS = 3;
const COOLDOWN_SECONDS = 30;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login implements OnDestroy {
  loading = false;
  form!: FormGroup;

  // ── Rate Limiting ────────────────────────────────────────────────────────────
  failedAttempts = 0;
  isLocked = false;
  cooldownRemaining = 0;
  private cooldownTimer: any = null;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private msg: MessageService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnDestroy(): void {
    if (this.cooldownTimer) clearInterval(this.cooldownTimer);
  }

  async submit(): Promise<void> {
    // ── Bloqueado por rate limit ──────────────────────────────────────────────
    if (this.isLocked) {
      this.msg.add({
        severity: 'warn',
        summary: 'Acceso bloqueado temporalmente',
        detail: `Demasiados intentos fallidos. Espera ${this.cooldownRemaining}s antes de intentar de nuevo.`,
        life: 3000
      });
      return;
    }

    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.msg.add({
        severity: 'warn',
        summary: 'Campos incompletos',
        detail: 'Completa email y contraseña.'
      });
      return;
    }

    const { email, password } = this.form.value;
    this.loading = true;

    const result = await this.auth.login(email, password);

    this.loading = false;

    if (result.statusCode !== 200) {
      this.failedAttempts++;
      const remaining = MAX_ATTEMPTS - this.failedAttempts;

      if (this.failedAttempts >= MAX_ATTEMPTS) {
        // ── Activar cooldown ─────────────────────────────────────────────────
        this.startCooldown();
        this.msg.add({
          severity: 'error',
          summary: 'Cuenta bloqueada temporalmente',
          detail: `Has excedido ${MAX_ATTEMPTS} intentos. Espera ${COOLDOWN_SECONDS} segundos.`,
          life: 5000
        });
      } else {
        this.msg.add({
          severity: 'error',
          summary: 'Acceso denegado',
          detail: `Credenciales incorrectas. Te quedan ${remaining} intento${remaining > 1 ? 's' : ''}.`
        });
      }
      return;
    }

    // ── Login exitoso → resetear intentos ────────────────────────────────────
    this.failedAttempts = 0;

    this.msg.add({
      severity: 'success',
      summary: 'Bienvenido',
      detail: 'Inicio de sesión correcto.'
    });

    setTimeout(() => this.router.navigate(['/home']), 800);
  }

  // ── Cooldown timer ─────────────────────────────────────────────────────────
  private startCooldown(): void {
    this.isLocked = true;
    this.cooldownRemaining = COOLDOWN_SECONDS;

    this.cooldownTimer = setInterval(() => {
      this.cooldownRemaining--;
      if (this.cooldownRemaining <= 0) {
        clearInterval(this.cooldownTimer);
        this.cooldownTimer = null;
        this.isLocked = false;
        this.failedAttempts = 0;
        this.msg.add({
          severity: 'info',
          summary: 'Desbloqueado',
          detail: 'Ya puedes intentar iniciar sesión de nuevo.',
          life: 3000
        });
      }
    }, 1000);
  }
}