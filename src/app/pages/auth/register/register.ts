import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CardModule,
    FloatLabelModule,
    ToastModule,
    DatePickerModule,
  ],
  providers: [MessageService],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerForm: FormGroup;
  maxDate: Date;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    // Fecha máxima permitida = hoy - 18 años (solo mayores de edad)
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);

    this.registerForm = this.fb.group(
      {
        usuario: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [Validators.required, Validators.minLength(10), this.passwordStrengthValidator],
        ],
        confirmPassword: ['', [Validators.required]],
        nombreCompleto: ['', [Validators.required, Validators.minLength(3)]],
        telefono: [
          '',
          [Validators.required, Validators.pattern(/^\d+$/), Validators.minLength(10), Validators.maxLength(10)],
        ],
        fechaNacimiento: [null, [Validators.required, this.ageValidator]],
        direccion: ['', [Validators.required, Validators.minLength(5)]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  /**
   * Validador de fortaleza de contraseña.
   * Requiere: al menos una mayúscula, una minúscula, un número
   * y un símbolo especial de los definidos: !@#$%^&*()_+-=
   */
  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const errors: ValidationErrors = {};
    if (!/[A-Z]/.test(value)) errors['noUpperCase'] = true;
    if (!/[a-z]/.test(value)) errors['noLowerCase'] = true;
    if (!/\d/.test(value)) errors['noNumber'] = true;
    if (!/[!@#$%^&*()_+\-=]/.test(value)) errors['noSpecialChar'] = true;

    return Object.keys(errors).length ? errors : null;
  }

  /**
   * Validador cruzado: las contraseñas deben coincidir
   */
  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    if (!confirmPassword) return null;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  /**
   * Validador de mayoría de edad (>= 18 años)
   */
  ageValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const birthDate = new Date(value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age >= 18 ? null : { underage: true };
  }

  register() {
    if (this.registerForm.invalid) {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.registerForm.controls).forEach((key) => {
        this.registerForm.get(key)?.markAsTouched();
      });

      this.messageService.add({
        severity: 'error',
        summary: 'Formulario inválido',
        detail: 'Por favor corrija los errores en el formulario.',
      });
      return;
    }

    // Registro exitoso
    this.messageService.add({
      severity: 'success',
      summary: '¡Registro exitoso!',
      detail: 'Tu cuenta ha sido creada correctamente.',
    });

    console.log('Datos del registro:', this.registerForm.value);
  }

  /** Helper: acceso rápido a los controles del formulario */
  get f() {
    return this.registerForm.controls;
  }

  /** Helper: indica si un campo específico es inválido y fue tocado */
  isInvalid(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!(control && control.invalid && control.touched);
  }
}
