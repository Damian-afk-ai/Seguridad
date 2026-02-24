Aplicación web frontend desarrollada con **Angular 21** y **PrimeNG 21** como parte de la materia de Seguridad del 8vo cuatrimestre.

---

## 📋 Descripción General

Este proyecto se ha desarrollado de forma incremental a lo largo de múltiples prácticas. Comenzó como una configuración inicial del entorno de desarrollo (Práctica 1) y ha evolucionado hasta convertirse en una SPA con sistema de autenticación (Práctica 2).

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

# Práctica 1 — Configuración Inicial del Proyecto

## 📋 Descripción

En esta primera práctica se generó el proyecto base con **Angular CLI**, se instaló y configuró **PrimeNG 21** con el tema **Aura**, y se verificó que el entorno de desarrollo funcionara correctamente mediante un componente de prueba.

## 🎯 Objetivos

1. Generar un nuevo proyecto Angular 21 utilizando Angular CLI.
2. Instalar y configurar la librería de componentes PrimeNG con el tema Aura.
3. Verificar el correcto funcionamiento del entorno mostrando un componente de prueba con PrimeNG.

## 📁 Estructura del Proyecto (Práctica 1)

```
proyecto-angular/
├── public/                      # Archivos estáticos públicos
├── src/
│   ├── index.html               # HTML principal de la aplicación
│   ├── main.ts                  # Punto de entrada (bootstrap de Angular)
│   ├── styles.css               # Estilos globales (vacío, listo para configuración)
│   └── app/
│       ├── app.ts               # Componente raíz (App) con template inline
│       ├── app.config.ts        # Configuración de la app (PrimeNG, Animaciones)
│       ├── app.routes.ts        # Definición de rutas (vacío)
│       └── app.spec.ts          # Tests del componente raíz
├── angular.json                 # Configuración del workspace de Angular
├── package.json                 # Dependencias y scripts de npm
├── tsconfig.json                # Configuración base de TypeScript
├── tsconfig.app.json            # Configuración de TS para la aplicación
├── tsconfig.spec.json           # Configuración de TS para tests
└── .editorconfig                # Configuración del editor
```

## 🧩 Componente Implementado

### `App` (Componente Raíz — Prueba de Concepto)
- **Archivo:** `src/app/app.ts`
- **Selector:** `app-root`
- Componente standalone con template inline que muestra:
  - Un título **"Angular 20 funcionando"** como verificación de que el framework está operativo.
  - Un **botón de PrimeNG** (`pButton`) con severidad `info` e ícono `pi pi-check` para confirmar que la integración con PrimeNG funciona correctamente.
- Importa `ButtonModule` de PrimeNG directamente en el componente.

## ⚙️ Configuración de la Aplicación (Práctica 1)

La configuración se define en `app.config.ts` e incluye:

- **`provideAnimations()`** — Habilita las animaciones de Angular (requerido por PrimeNG).
- **`providePrimeNG({ theme: { preset: Aura } })`** — Configura PrimeNG con el tema visual **Aura**.

> **Nota:** En esta práctica aún no se configura el sistema de enrutamiento (`provideRouter`), ya que el archivo `app.routes.ts` está vacío y no hay páginas adicionales.

## 📝 Resumen de lo Implementado (Práctica 1)

1. ✅ Proyecto Angular 21 generado con Angular CLI (`ng new proyecto-angular`)
2. ✅ Instalación de PrimeNG 21, PrimeIcons y @primeng/themes
3. ✅ Configuración del tema Aura en `app.config.ts`
4. ✅ Habilitación de animaciones para PrimeNG
5. ✅ Componente raíz standalone con template inline
6. ✅ Verificación de PrimeNG con un botón de prueba (`pButton` con ícono y severidad)
7. ✅ Archivo de rutas creado (`app.routes.ts`) pero vacío, preparado para futuras prácticas
8. ✅ Configuración de TypeScript con modo estricto (`strict: true`)
9. ✅ Configuración de Prettier (100 caracteres, comillas simples)
10. ✅ Tests unitarios iniciales con Vitest

## 📌 Notas (Práctica 1)

- El componente raíz utiliza un **template inline** (no un archivo `.html` separado) para simplificar la verificación inicial.
- No se configuraron rutas ni páginas adicionales; el objetivo fue exclusivamente validar el entorno de desarrollo.
- El archivo `styles.css` se dejó vacío, listo para configuración en prácticas posteriores.
- Las dependencias de PrimeNG (`primeng`, `primeicons`, `@primeng/themes`) quedaron correctamente instaladas y listas para uso.

---

# Práctica 2 — Sistema de Autenticación

## 📋 Descripción

En esta segunda práctica se extendió el proyecto base para implementar una aplicación de una sola página (SPA) con un sistema de autenticación compuesto por páginas de **Login**, **Registro** y una **Landing Page** de bienvenida. La interfaz utiliza componentes de PrimeNG con el tema **Aura** para ofrecer una experiencia de usuario moderna y consistente.

## 🎯 Objetivos

1. Implementar un sistema de enrutamiento con múltiples páginas.
2. Crear formularios de Login y Registro con componentes de PrimeNG.
3. Diseñar una Landing Page de bienvenida con navegación a las páginas de autenticación.
4. Utilizar Float Labels, binding bidireccional y estilos globales con la fuente Inter.

## 📁 Estructura del Proyecto (Práctica 2)

```
proyecto-angular/
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

## 🧩 Componentes Implementados (Práctica 2)

### 1. `App` (Componente Raíz — Actualizado)
- **Archivo:** `src/app/app.ts`
- **Selector:** `app-root`
- Componente standalone que importa `RouterOutlet` para renderizar las páginas según la ruta activa.
- Se reemplazó el template inline de la Práctica 1 por un archivo `.html` separado.

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

## 🗺️ Rutas de la Aplicación (Práctica 2)

| Ruta | Componente | Descripción |
|---|---|---|
| `/` | `Landing` | Página de bienvenida con navegación a Login y Register |
| `/login` | `Login` | Formulario de inicio de sesión |
| `/register` | `Register` | Formulario de registro de usuario |

## ⚙️ Configuración de la Aplicación (Práctica 2)

La configuración se actualizó en `app.config.ts` para incluir:

- **`provideRouter(routes)`** — Habilita el sistema de enrutamiento con las rutas definidas.
- **`provideAnimationsAsync()`** — Habilita animaciones asíncronas de Angular (requerido por PrimeNG).
- **`providePrimeNG({ theme: { preset: Aura } })`** — Configura PrimeNG con el tema visual **Aura**.

## 📝 Resumen de lo Implementado (Práctica 2)

1. ✅ Sistema de enrutamiento con 3 rutas (Landing, Login, Register)
2. ✅ Componente raíz actualizado con `RouterOutlet` y template externo
3. ✅ Página Landing con navegación a las páginas de autenticación
4. ✅ Formulario de Login con campos Email y Password (PrimeNG)
5. ✅ Formulario de Registro con campos Nombre, Email y Password (PrimeNG)
6. ✅ Float labels en todos los campos de formulario
7. ✅ Toggle de visibilidad en campos de contraseña
8. ✅ Binding bidireccional con `FormsModule` y `ngModel`
9. ✅ Estilos globales configurados con fuente Inter
10. ✅ Animaciones asíncronas habilitadas para PrimeNG
11. ✅ Estructura de carpetas organizada por páginas y módulos (`pages/auth/`, `pages/landing/`)
12. ✅ Componentes standalone (sin NgModules en los componentes)

## 📌 Notas (Práctica 2)

- Los formularios actualmente solo imprimen los valores en consola (`console.log`). No hay integración con un backend ni validaciones avanzadas.
- Los módulos `AuthModule` y `PagesModule` están creados pero vacíos, ya que los componentes son **standalone** y no requieren declaración en un NgModule.

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

## ⚙️ Configuración Adicional

- **Prettier:** Configurado en `package.json` con un ancho de 100 caracteres y comillas simples.
- **EditorConfig:** Indentación de 2 espacios, charset UTF-8, comillas simples en TypeScript.
- **TypeScript:** Modo estricto habilitado (`strict: true`) con opciones adicionales de seguridad.
