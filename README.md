# Práctica 2 — Seguridad (8vo Cuatrimestre)

Aplicación web frontend desarrollada con **Angular 21** y **PrimeNG 21** como parte de la materia de Seguridad del 8vo cuatrimestre.

---

## 📋 Descripción del Proyecto

Este proyecto es una aplicación de una sola página (SPA) construida con Angular que implementa un sistema de autenticación con páginas de **Login**, **Registro** y una **Landing Page** de bienvenida. La interfaz utiliza componentes de PrimeNG con el tema **Aura** para ofrecer una experiencia de usuario moderna y consistente.

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Versión | Descripción |
|---|---|---|
| **Angular** | 21.1.x | Framework principal de desarrollo frontend |
| **TypeScript** | ~5.9.2 | Lenguaje de programación tipado |
| **PrimeNG** | 21.1.1 | Librería de componentes UI para Angular |
| **PrimeIcons** | 7.0.0 | Set de íconos complementario de PrimeNG |
| **@primeng/themes (Aura)** | 21.0.4 | Tema visual aplicado a los componentes |
| **RxJS** | ~7.8.0 | Librería para programación reactiva |
| **Vitest** | 4.0.8 | Framework de testing unitario |
| **Angular CLI** | 21.1.4 | Herramienta de línea de comandos para Angular |

---

## 📁 Estructura del Proyecto

```
practica2/
├── public/                      # Archivos estáticos públicos
├── src/
│   ├── index.html               # HTML principal de la aplicación
│   ├── main.ts                  # Punto de entrada (bootstrap de Angular)
│   ├── styles.css               # Estilos globales (fuente Inter)
│   └── app/
│       ├── app.ts               # Componente raíz (App) con RouterOutlet
│       ├── app.html             # Template del componente raíz (<router-outlet>)
│       ├── app.css              # Estilos del componente raíz
│       ├── app.config.ts        # Configuración de la app (Router, PrimeNG, Animaciones)
│       ├── app.routes.ts        # Definición de rutas de la aplicación
│       ├── app.spec.ts          # Tests del componente raíz
│       └── pages/
│           ├── pages-module.ts  # Módulo de páginas
│           ├── landing/
│           │   ├── landing.ts         # Componente Landing
│           │   ├── landing.html       # Template de la Landing Page
│           │   ├── landing.css        # Estilos de la Landing Page
│           │   └── landing.spec.ts    # Tests del componente Landing
│           └── auth/
│               ├── auth-module.ts     # Módulo de autenticación
│               ├── login/
│               │   ├── login.ts       # Componente Login
│               │   ├── login.html     # Template del formulario Login
│               │   ├── login.css      # Estilos del Login
│               │   └── login.spec.ts  # Tests del componente Login
│               └── register/
│                   ├── register.ts       # Componente Register
│                   ├── register.html     # Template del formulario Registro
│                   ├── register.css      # Estilos del Registro
│                   └── register.spec.ts  # Tests del componente Register
├── angular.json                 # Configuración del workspace de Angular
├── package.json                 # Dependencias y scripts de npm
├── tsconfig.json                # Configuración base de TypeScript
├── tsconfig.app.json            # Configuración de TS para la aplicación
├── tsconfig.spec.json           # Configuración de TS para tests
└── .editorconfig                # Configuración del editor
```

---

## 🧩 Componentes Implementados

### 1. `App` (Componente Raíz)
- **Archivo:** `src/app/app.ts`
- **Selector:** `app-root`
- Componente standalone que importa `RouterOutlet` para renderizar las páginas según la ruta activa.

### 2. `Landing` (Página de Bienvenida)
- **Archivo:** `src/app/pages/landing/landing.ts`
- **Selector:** `app-landing`
- **Ruta:** `/` (raíz)
- Muestra un título "Bienvenido" y dos botones de PrimeNG:
  - **"Ir a Login"** → navega a `/login`
  - **"Ir a Register"** → navega a `/register` (estilo secundario)
- Layout centrado vertical y horizontalmente con flexbox.

### 3. `Login` (Inicio de Sesión)
- **Archivo:** `src/app/pages/auth/login/login.ts`
- **Selector:** `app-login`
- **Ruta:** `/login`
- Formulario con dos campos utilizando PrimeNG:
  - **Email** — `InputText` con `FloatLabel`
  - **Password** — `Password` con `FloatLabel`, toggle de visibilidad y sin feedback de fortaleza
- Botón **"Iniciar Sesión"** que, al hacer submit, imprime los valores en consola.
- Utiliza `FormsModule` con `ngModel` para el binding bidireccional.

### 4. `Register` (Registro)
- **Archivo:** `src/app/pages/auth/register/register.ts`
- **Selector:** `app-register`
- **Ruta:** `/register`
- Formulario con tres campos utilizando PrimeNG:
  - **Nombre** — `InputText` con `FloatLabel`
  - **Email** — `InputText` con `FloatLabel`
  - **Password** — `Password` con `FloatLabel`, toggle de visibilidad y sin feedback de fortaleza
- Botón **"Registrarse"** que, al hacer submit, imprime los valores en consola.
- Utiliza `FormsModule` con `ngModel` para el binding bidireccional.

---

## 🗺️ Rutas de la Aplicación

| Ruta | Componente | Descripción |
|---|---|---|
| `/` | `Landing` | Página de bienvenida con navegación a Login y Register |
| `/login` | `Login` | Formulario de inicio de sesión |
| `/register` | `Register` | Formulario de registro de usuario |

---

## ⚙️ Configuración de la Aplicación

La configuración se define en `app.config.ts` e incluye:

- **`provideRouter(routes)`** — Habilita el sistema de enrutamiento con las rutas definidas.
- **`provideAnimationsAsync()`** — Habilita animaciones asíncronas de Angular (requerido por PrimeNG).
- **`providePrimeNG({ theme: { preset: Aura } })`** — Configura PrimeNG con el tema visual **Aura**.

---

## 🚀 Cómo Ejecutar el Proyecto

### Prerrequisitos

- **Node.js** (versión compatible con Angular 21)
- **npm** 11.6.2 o superior

### Instalación

```bash
npm install
```

### Servidor de desarrollo

```bash
ng serve
```

Abre tu navegador en `http://localhost:4200/`. La aplicación se recarga automáticamente al modificar archivos fuente.

### Build de producción

```bash
ng build
```

Los artefactos de compilación se guardan en el directorio `dist/`.

### Tests unitarios

```bash
ng test
```

Ejecuta los tests con el framework [Vitest](https://vitest.dev/).

---

## 📝 Resumen de lo Implementado

1. ✅ Proyecto Angular 21 generado con Angular CLI
2. ✅ Integración de PrimeNG 21 con tema Aura
3. ✅ Componentes standalone (sin NgModules en los componentes)
4. ✅ Sistema de enrutamiento con 3 rutas (Landing, Login, Register)
5. ✅ Página Landing con navegación a las páginas de autenticación
6. ✅ Formulario de Login con campos Email y Password (PrimeNG)
7. ✅ Formulario de Registro con campos Nombre, Email y Password (PrimeNG)
8. ✅ Float labels en todos los campos de formulario
9. ✅ Toggle de visibilidad en campos de contraseña
10. ✅ Binding bidireccional con `FormsModule` y `ngModel`
11. ✅ Estilos globales configurados con fuente Inter
12. ✅ Animaciones asíncronas habilitadas para PrimeNG
13. ✅ Estructura de carpetas organizada por páginas y módulos (`pages/auth/`, `pages/landing/`)

---

## 📌 Notas

- Los formularios actualmente solo imprimen los valores en consola (`console.log`). No hay integración con un backend ni validaciones avanzadas.
- Los módulos `AuthModule` y `PagesModule` están creados pero vacíos, ya que los componentes son **standalone** y no requieren declaración en un NgModule.
- El proyecto utiliza **Prettier** configurado en `package.json` con un ancho de 100 caracteres y comillas simples.
