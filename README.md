Aplicación web frontend desarrollada con **Angular 21** y **PrimeNG 21** como parte de la materia de Seguridad del 8vo cuatrimestre.

---

## 📋 Descripción General

Este proyecto se ha desarrollado de forma incremental a lo largo de múltiples prácticas. Comenzó como una configuración inicial del entorno de desarrollo (Práctica 1), evolucionó a una SPA con sistema de autenticación (Práctica 2), se extendió con validación de credenciales hardcodeadas y formulario de registro con validaciones avanzadas (Práctica 3), se implementó una estructura de layout con Sidebar de navegación, página Home y personalización del tema visual con la paleta Teal (Práctica 4), se agregaron sub-rutas con páginas completas (Dashboard, Productos, Usuario, Grupos, Admin), un sidebar tipo tree con secciones expandibles, y se migró toda la UI a componentes exclusivos de PrimeNG (Práctica 5), y finalmente se implementó un **sistema de Control de Acceso Basado en Roles/Permisos (RBAC)** con Signals, directiva estructural `*ifHasPermission`, guards funcionales de ruta, simulación de JWT en el login y protección granular de la UI (Práctica 8).

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Versión | Descripción |
|---|---|---|
| **Angular** | 21.1.x | Framework principal de desarrollo frontend |
| **TypeScript** | ~5.9.2 | Lenguaje de programación tipado |
| **PrimeNG** | 21.1.1 | Librería de componentes UI para Angular |
| **PrimeIcons** | 7.0.0 | Set de íconos complementario de PrimeNG |
| **@primeuix/themes (Aura + Teal)** | 21.0.4 | Tema visual Aura personalizado con paleta Teal |
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

- Los módulos `AuthModule` y `PagesModule` están creados pero vacíos, ya que los componentes son **standalone** y no requieren declaración en un NgModule.

---

# Práctica 3 Actualizada — Validación de Credenciales y Formulario de Registro

## 📋 Descripción

En esta tercera práctica (recientemente actualizada con correcciones menores en validaciones de formulario y helpers de UI) se implementó la validación de credenciales en el **Login** utilizando datos hardcodeados en el código, y se reconstruyó completamente el formulario de **Registro** con validaciones exhaustivas en cada campo. Se utilizan componentes de **PrimeNG** (Toast, DatePicker, Password, etc.) y **Sileo Notifications** para ofrecer una experiencia de usuario profesional con alertas y mensajes de error en tiempo real.

## 🎯 Objetivos

1. Establecer credenciales hardcodeadas en el código para validar el login desde la interfaz.
2. Validar todos los campos del formulario de registro para no aceptar campos vacíos.
3. Implementar validación de contraseña con al menos 10 caracteres y símbolos especiales definidos.
4. Permitir solo el registro a mayores de edad (≥ 18 años).
5. Validar que el número de teléfono contenga solo números.
6. Utilizar componentes UI de PrimeNG para validaciones y alertas UX.

## 🔐 Login — Credenciales Hardcodeadas

Las credenciales de autenticación están definidas directamente en el código del componente `Login`:

| Campo | Valor |
|---|---|
| **Email** | `admin@correo.com` |
| **Contraseña** | `Seguridad1!` |

### Comportamiento del Login:
- **Campos vacíos** → Toast de advertencia (severity `warn`): *"Por favor ingrese email y contraseña."*
- **Credenciales incorrectas** → Toast de error (severity `error`): *"Credenciales incorrectas. Intente de nuevo."*
- **Credenciales correctas** → Toast de éxito (severity `success`): *"Inicio de sesión exitoso."* y redirección a `/home` después de 1.5 segundos.

### Implementación técnica:
- Las credenciales se almacenan como constantes `private readonly` en la clase `Login` (`login.ts`, líneas 33-34).
- La validación se realiza con comparación directa de strings en el método `login()`.
- Se utiliza `MessageService` de PrimeNG para las notificaciones Toast.
- Se utiliza `Router` de Angular para la redirección después del login exitoso.

## 📝 Registro — Formulario con Validaciones

El formulario de registro fue reconstruido utilizando **ReactiveFormsModule** (formularios reactivos de Angular) en lugar del anterior approach con `FormsModule`/`ngModel`, para permitir validaciones avanzadas.

### Campos del formulario:

| Campo | Tipo de Componente | Validaciones |
|---|---|---|
| **Usuario** | `pInputText` + `p-floatlabel` | Requerido, mínimo 3 caracteres |
| **Correo Electrónico** | `pInputText` + `p-floatlabel` | Requerido, formato email válido (`Validators.email`) |
| **Contraseña** | `p-password` + `p-floatlabel` | Requerido, mínimo 10 caracteres, debe contener: mayúscula, minúscula, número y símbolo especial |
| **Confirmar Contraseña** | `p-password` + `p-floatlabel` | Requerido, debe coincidir con la contraseña (validador cruzado) |
| **Nombre Completo** | `pInputText` + `p-floatlabel` | Requerido, mínimo 3 caracteres |
| **Teléfono** | `pInputText` + `p-floatlabel` | Requerido, solo números (`pattern: /^\d+$/`), mínimo 10 dígitos |
| **Fecha de Nacimiento** | `p-datepicker` + `p-floatlabel` | Requerido, mayor de 18 años (validador personalizado + `maxDate`) |
| **Dirección** | `pInputText` + `p-floatlabel` | Requerido, mínimo 5 caracteres |

### Validación de Contraseña — Símbolos Especiales Definidos

La contraseña debe cumplir **todas** estas reglas simultáneamente:

1. Mínimo **10 caracteres** de longitud.
2. Al menos una **letra mayúscula** (A-Z).
3. Al menos una **letra minúscula** (a-z).
4. Al menos un **número** (0-9).
5. Al menos un **símbolo especial** de los siguientes: `!@#$%^&*()_+-=`

El validador personalizado `passwordStrengthValidator` verifica cada regla de forma independiente y muestra mensajes de error específicos para cada una que no se cumpla.

### Validación de Mayoría de Edad

- Se utiliza un componente `p-datepicker` de PrimeNG con la propiedad `[maxDate]` configurada a la fecha actual menos 18 años, lo que impide seleccionar fechas que resulten en una edad menor.
- Adicionalmente, un validador personalizado `ageValidator` calcula la edad exacta y retorna un error `underage` si el usuario tiene menos de 18 años.

### Validación de Teléfono

- Se utiliza `Validators.pattern(/^\d+$/)` para asegurar que el campo solo contenga dígitos numéricos.
- Se requiere exactamente 10 dígitos (`Validators.minLength(10)` y `Validators.maxLength(10)`).
- El campo tiene un `maxlength="10"` en el HTML para limitar la entrada a 10 caracteres.

### Botón de Registro

- El botón **"Registrarse"** está **deshabilitado** (`[disabled]="registerForm.invalid"`) mientras el formulario tenga errores de validación.
- Solo se habilita cuando **todos** los campos son válidos.

### Validadores Personalizados Implementados

| Validador | Tipo | Descripción |
|---|---|---|
| `passwordStrengthValidator` | Campo | Verifica mayúscula, minúscula, número y símbolo especial |
| `passwordMatchValidator` | Formulario (cruzado) | Verifica que contraseña y confirmación coincidan |
| `ageValidator` | Campo | Calcula la edad y verifica que sea ≥ 18 años |

## 🧩 Componentes PrimeNG Utilizados (Práctica 3)

| Componente | Módulo | Uso |
|---|---|---|
| `p-toast` | `ToastModule` | Notificaciones emergentes de éxito, error y advertencia |
| `p-card` | `CardModule` | Contenedor visual del formulario |
| `p-floatlabel` | `FloatLabelModule` | Labels flotantes en cada campo de entrada |
| `p-password` | `PasswordModule` | Campos de contraseña con toggle de visibilidad |
| `p-button` | `ButtonModule` | Botones con íconos (pi pi-sign-in, pi pi-user-plus) |
| `p-datepicker` | `DatePickerModule` | Selector de fecha de nacimiento con restricción de edad |
| `pInputText` | `InputTextModule` | Inputs de texto estilizados |
| Clase `p-error` | (PrimeNG CSS) | Estilo rojo para mensajes de error inline |

## 📝 Resumen de lo Implementado (Práctica 3)

1. ✅ Credenciales hardcodeadas en el componente Login (`admin@correo.com` / `Seguridad1!`)
2. ✅ Validación de login con feedback visual mediante PrimeNG Toast (warn, error, success)
3. ✅ Redirección al Landing tras login exitoso con `Router`
4. ✅ Formulario de registro reconstruido con `ReactiveFormsModule`
5. ✅ Todos los campos requeridos (no se aceptan campos vacíos)
6. ✅ Contraseña con mínimo 10 caracteres y símbolos especiales definidos (`!@#$%^&*()_+-=`)
7. ✅ Validación de mayoría de edad (≥ 18 años) con `p-datepicker` y validador personalizado
8. ✅ Teléfono validado para solo aceptar exactamente 10 números
9. ✅ Confirmación de contraseña con validador cruzado
10. ✅ Botón de registro deshabilitado hasta que todos los campos sean válidos
11. ✅ Mensajes de error inline específicos por campo con clase `p-error` de PrimeNG
12. ✅ Toast de error al intentar enviar formulario inválido
13. ✅ Toast de éxito al registrarse correctamente

## 📌 Notas (Práctica 3)

- El login utiliza credenciales hardcodeadas (**no** hay integración con backend ni base de datos).
- El registro muestra un Toast de éxito y registra los datos en consola, pero **no** persiste la información.
- Se migró el formulario de registro de `FormsModule` (template-driven) a `ReactiveFormsModule` (reactive forms) para soportar validaciones complejas.
- El login se mantuvo con `FormsModule`/`ngModel` por simplicidad, ya que solo tiene 2 campos sin validaciones complejas.

---

# Práctica 4 — Layout con Sidebar, Página Home y Personalización del Tema

## 📋 Descripción

En esta cuarta práctica se implementó la estructura de layout de la aplicación siguiendo los lineamientos del pizarrón de clase. Se creó un **MainLayout** que integra un **Sidebar** de navegación como menú lateral, una página **Home** como panel principal, y se personalizó el tema visual de PrimeNG con la paleta de colores **Teal**. Además, se actualizó el flujo de autenticación para redirigir al Home tras el login exitoso, se integraron los **PrimeIcons** globalmente, y se aplicó la variante **On Label** en los Float Labels de los formularios.

## 🎯 Objetivos

1. Crear una estructura de layout con Sidebar como menú de navegación.
2. Implementar un MainLayout que envuelva las páginas protegidas.
3. Crear una página Home limpia como panel de control principal.
4. Redirigir al Home después del login exitoso.
5. Personalizar el tema de PrimeNG con la paleta Teal.
6. Integrar PrimeIcons en toda la aplicación.
7. Aplicar la variante On Label (`variant="on"`) en los Float Labels.
8. Asegurar una interfaz con buena UX: estilizada y sin desorden.

## 📁 Estructura del Proyecto (Práctica 4)

```
src/app/
├── app.ts                       # Componente raíz con RouterOutlet
├── app.html                     # Template del componente raíz
├── app.css                      # Estilos del componente raíz
├── app.config.ts                # Configuración (Router, PrimeNG con Teal)
├── app.routes.ts                # Rutas actualizadas con /home y MainLayout
├── app.spec.ts                  # Tests del componente raíz
├── components/                  # ← NUEVO: Carpeta de componentes reutilizables
│   └── sidebar/
│       ├── sidebar.ts           # Componente Sidebar con navegación
│       ├── sidebar.html         # Template del Sidebar (menú, logout)
│       └── sidebar.css          # Estilos del Sidebar (tema dark teal)
├── layout/                      # ← NUEVO: Carpeta de layouts
│   └── main-layout/
│       ├── main-layout.ts       # Layout principal (Sidebar + contenido)
│       ├── main-layout.html     # Template del layout (sidebar + router-outlet)
│       └── main-layout.css      # Estilos del layout (flexbox)
└── pages/
    ├── pages-module.ts
    ├── home/                    # ← NUEVO: Página Home
    │   ├── home.ts              # Componente Home (limpio, solo bienvenida)
    │   ├── home.html            # Template del Home ("Bienvenido")
    │   └── home.css             # Estilos del Home
    ├── landing/
    │   └── ...                  # (sin cambios)
    └── auth/
        ├── login/
        │   └── ...              # (actualizado: redirect a /home, botón teal 900, On Label)
        └── register/
            └── ...              # (actualizado: On Label en todos los campos)
```

## 🧩 Componentes Implementados (Práctica 4)

### 1. `Sidebar` (Componente de Navegación)
- **Archivo:** `src/app/components/sidebar/sidebar.ts`
- **Selector:** `app-sidebar`
- Sidebar lateral oscuro con tema **dark teal** que incluye:
  - **Header** con ícono `pi pi-bullseye` y título "Practica 4"
  - **Botón toggle** para colapsar/expandir el sidebar
  - **Menú de navegación** con ícono de Inicio (`pi pi-home`)
  - **Footer** con botón de "Cerrar sesión" (`pi pi-sign-out`) que redirige a `/login`
- Soporta **tooltips** (PrimeNG `pTooltip`) cuando está colapsado
- Utiliza `RouterLink` y `RouterLinkActive` para resaltar la ruta activa
- Animación suave de transición al colapsar (CSS `cubic-bezier`)

### 2. `MainLayout` (Layout Principal)
- **Archivo:** `src/app/layout/main-layout/main-layout.ts`
- **Selector:** `app-main-layout`
- Layout que combina el `Sidebar` a la izquierda con un área de contenido a la derecha
- Utiliza `<router-outlet>` para renderizar las páginas hijas (como Home)
- Implementado con **flexbox** y margen izquierdo de 260px para el sidebar

### 3. `Home` (Página Principal)
- **Archivo:** `src/app/pages/home/home.ts`
- **Selector:** `app-home`
- **Ruta:** `/home` (hijo de MainLayout)
- Página limpia que muestra únicamente el texto **"Bienvenido"** centrado
- Diseñada como panel de control minimalista, lista para extenderse con contenido futuro

## 🗺️ Rutas de la Aplicación (Práctica 4)

| Ruta | Componente | Layout | Descripción |
|---|---|---|---|
| `/` | `Landing` | — | Página de bienvenida con navegación a Login y Register |
| `/login` | `Login` | — | Formulario de inicio de sesión |
| `/register` | `Register` | — | Formulario de registro de usuario |
| `/home` | `Home` | `MainLayout` | Panel principal con Sidebar (tras autenticarse) |

> **Nota:** La ruta `/home` usa `MainLayout` como componente padre con rutas hijas (`children`), lo que permite que el Sidebar se muestre en todas las sub-páginas del home.

## 🎨 Personalización del Tema — Paleta Teal

Se personalizó el tema **Aura** de PrimeNG para usar la paleta de colores **Teal** como color primario mediante `definePreset`:

```typescript
const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{teal.50}',   100: '{teal.100}', 200: '{teal.200}',
      300: '{teal.300}',  400: '{teal.400}', 500: '{teal.500}',
      600: '{teal.600}',  700: '{teal.700}', 800: '{teal.800}',
      900: '{teal.900}',  950: '{teal.950}'
    }
  }
});
```

### Colores aplicados:
- **Botón de Login:** Teal 900 (`#134e4a`) con hover en Teal 800 (`#115e59`)
- **Sidebar fondo:** `#0f3d3e` (dark teal)
- **Sidebar header:** `#0a2e2f` (teal más oscuro)
- **Sidebar active item:** `rgba(20, 184, 166, 0.15)` con texto `#5eead4`
- **Sidebar active border:** `#14b8a6` (teal 500)
- **Componentes PrimeNG:** Todos usan la paleta Teal automáticamente

## 🏷️ Float Labels — Variante On Label

Se actualizó la variante de los `<p-floatlabel>` en los formularios de Login y Registro a **On Label** (`variant="on"`), donde el label se posiciona sobre el borde superior del input en lugar de flotar dentro del campo:

```html
<p-floatlabel variant="on">
    <input pInputText id="email" [(ngModel)]="email" name="email" />
    <label for="email">Email</label>
</p-floatlabel>
```

## 🔗 Integración de PrimeIcons

Se importó **PrimeIcons** globalmente en `styles.css` para que todos los íconos `pi pi-*` se carguen correctamente en toda la aplicación:

```css
@import 'primeicons/primeicons.css';
```

### Íconos utilizados en el Sidebar:
| Ícono | Clase | Uso |
|---|---|---|
| 🎯 | `pi pi-bullseye` | Logo del sidebar |
| 🏠 | `pi pi-home` | Menú: Inicio |
| ↪️ | `pi pi-sign-out` | Botón: Cerrar sesión |
| ◀ | `pi pi-angle-left` | Toggle: colapsar sidebar |
| ▶ | `pi pi-angle-right` | Toggle: expandir sidebar |

## ⚙️ Configuración de la Aplicación (Práctica 4)

La configuración en `app.config.ts` ahora incluye:

- **`provideRouter(routes)`** — Enrutamiento con rutas hijas para el layout.
- **`provideAnimationsAsync()`** — Animaciones asíncronas de Angular.
- **`providePrimeNG({ theme: { preset: MyPreset } })`** — Tema Aura personalizado con paleta **Teal** usando `definePreset` de `@primeuix/themes`.

## 📝 Resumen de lo Implementado (Práctica 4)

1. ✅ Componente `Sidebar` con navegación, íconos PrimeNG, toggle colapsable y logout
2. ✅ Componente `MainLayout` con Sidebar + router-outlet para páginas protegidas
3. ✅ Página `Home` limpia con texto "Bienvenido" centrado
4. ✅ Estructura de carpetas: `components/`, `layout/`, `pages/home/` con archivos `.html`, `.ts`, `.css`
5. ✅ Login redirige a `/home` tras autenticación exitosa
6. ✅ Tema Aura personalizado con paleta **Teal** (`definePreset`)
7. ✅ Botón de Login con color Teal 900 (`#134e4a`)
8. ✅ PrimeIcons integrados globalmente (`@import 'primeicons/primeicons.css'`)
9. ✅ Float Labels con variante **On Label** (`variant="on"`) en Login y Registro
10. ✅ Sidebar con diseño dark teal profesional con transiciones suaves
11. ✅ Ruta `/home` envuelta en `MainLayout` con rutas hijas (`children`)
12. ✅ UX limpia, estilizada y ordenada cumpliendo los requisitos del pizarrón

## 📌 Notas (Práctica 4)

- El Sidebar actualmente solo tiene el enlace de **Inicio**; se pueden agregar más opciones de menú fácilmente añadiendo objetos al arreglo `menuItems` en `sidebar.ts`.
- El `MainLayout` permite que cualquier página futura dentro de `/home/*` herede automáticamente el Sidebar.
- La personalización del tema se hace con `definePreset` de `@primeuix/themes`, que extiende el preset Aura sin modificarlo directamente.
- El botón de "Cerrar sesión" en el sidebar redirige a `/login` sin lógica de sesión (no hay backend).
- La estructura sigue los lineamientos del **pizarrón de clase**: Pages → Home, Layout → MainLayout, Components → Sidebar, con buena UX y uso de PrimeNG.

---

# Práctica 5 — Sub-rutas, Páginas de Gestión y Migración Completa a PrimeNG

## 📋 Descripción

En esta quinta práctica se extendió significativamente la aplicación con **5 nuevas sub-rutas** dentro del layout principal, se implementó un **sidebar tipo tree** con secciones expandibles, se creó una **página de perfil de usuario** para el administrador con funcionalidad de edición, y se realizó una **migración completa a componentes PrimeNG** en todas las páginas que anteriormente usaban HTML/CSS custom. Todo el proyecto ahora utiliza exclusivamente PrimeNG para la interfaz de usuario.

## 🎯 Objetivos

1. Crear sub-rutas dentro de `/home` para Dashboard, Productos, Usuario, Grupos y Admin.
2. Implementar un sidebar con navegación tipo tree (secciones expandibles).
3. Crear una página de perfil de usuario (admin) con edición de datos usando PrimeNG.
4. Crear páginas de Dashboard, Productos, Grupos y Admin con datos estáticos.
5. Agregar una página Home con cards de acceso rápido a todas las secciones.
6. Migrar **todas** las páginas a componentes exclusivos de PrimeNG (sin HTML/CSS custom).
7. Mantener toda la información estática (sin base de datos).

## 📁 Estructura del Proyecto (Práctica 5)

```
src/app/
├── app.ts                       # Componente raíz con RouterOutlet
├── app.html                     # Template del componente raíz
├── app.css                      # Estilos del componente raíz
├── app.config.ts                # Configuración (Router, PrimeNG con Teal)
├── app.routes.ts                # Rutas actualizadas con 5 sub-rutas
├── components/
│   └── sidebar/
│       ├── sidebar.ts           # Sidebar con navegación tipo tree
│       ├── sidebar.html         # Template con secciones expandibles
│       └── sidebar.css          # Estilos del sidebar con animaciones
├── layout/
│   └── main-layout/
│       ├── main-layout.ts       # Layout principal (Sidebar + contenido)
│       ├── main-layout.html     # Template del layout
│       └── main-layout.css      # Estilos del layout
└── pages/
    ├── home/
    │   ├── home.ts              # Home con quick-links usando p-card y p-button
    │   ├── home.html            # Template con cards de acceso rápido
    │   ├── home.css             # Estilos mínimos de layout
    │   ├── dashboard/           # ← NUEVO
    │   │   ├── dashboard.ts     # Dashboard con p-card y p-tag
    │   │   ├── dashboard.html   # Template con stat cards
    │   │   └── dashboard.css    # Estilos de layout
    │   ├── products/            # ← NUEVO
    │   │   ├── products.ts      # Productos con p-table y p-tag
    │   │   ├── products.html    # Template con tabla PrimeNG
    │   │   └── products.css     # Estilos mínimos
    │   ├── users/               # ← NUEVO (Perfil de Admin)
    │   │   ├── users.ts         # Perfil con edición, p-card, p-avatar, p-toast
    │   │   ├── users.html       # Template con campos p-floatlabel
    │   │   └── users.css        # Estilos mínimos de layout
    │   ├── groups/              # ← NUEVO
    │   │   ├── groups.ts        # Grupos con p-card, p-tag, p-divider
    │   │   ├── groups.html      # Template con cards de grupos
    │   │   └── groups.css       # Estilos de grid layout
    │   └── admin/               # ← NUEVO
    │       ├── admin.ts         # Admin con p-card, p-table, p-tag
    │       ├── admin.html       # Template con info cards y tabla de logs
    │       └── admin.css        # Estilos de layout
    ├── landing/
    │   └── ...                  # (sin cambios)
    └── auth/
        ├── login/
        │   └── ...              # (sin cambios)
        └── register/
            └── ...              # (sin cambios)
```

## 🧩 Componentes Implementados (Práctica 5)

### 1. `Home` (Página Principal — Actualizada)
- **Archivo:** `src/app/pages/home/home.ts`
- **Ruta:** `/home`
- Ahora muestra **cards de acceso rápido** a cada sección usando `p-card` y `p-button`
- Cada card tiene un ícono PrimeIcons, el nombre de la sección y un botón outlined "Ir a..."
- **Componentes PrimeNG:** `CardModule`, `ButtonModule`

### 2. `Dashboard` (Panel de Métricas)
- **Archivo:** `src/app/pages/home/dashboard/dashboard.ts`
- **Ruta:** `/home/dashboard`
- Muestra 2 cards con métricas estáticas:
  - **Total Proyectos** → 12 (severity: `info`)
  - **Avance General** → 78% (severity: `success`)
- **Componentes PrimeNG:** `CardModule`, `TagModule`

### 3. `Products` (Catálogo de Productos)
- **Archivo:** `src/app/pages/home/products/products.ts`
- **Ruta:** `/home/products`
- Tabla con 5 productos estáticos usando `p-table` con filas zebra (`stripedRows`)
- Badges de categoría y estado usando `p-tag` con severities dinámicas:
  - Activo → `success` (verde)
  - Inactivo → `danger` (rojo)
- **Componentes PrimeNG:** `CardModule`, `TableModule`, `TagModule`

### 4. `Users` (Perfil del Administrador)
- **Archivo:** `src/app/pages/home/users/users.ts`
- **Ruta:** `/home/users`
- Página de perfil del administrador con datos estáticos editables:
  - **Nombre:** Administrador
  - **Email:** admin@correo.com
  - **Contraseña:** Seguridad1!
  - **Teléfono:** 6141234567
  - **Rol:** Administrador (mostrado con `p-tag`)
- Funcionalidad de **editar/guardar/cancelar** con toggle de modo edición
- Float labels con **variant dinámico**: `"in"` cuando está deshabilitado (vista), `"on"` cuando está habilitado (edición), eliminando el contraste visual entre la label y el input gris
- Notificaciones Toast al guardar cambios
- **Componentes PrimeNG:** `CardModule`, `AvatarModule`, `TagModule`, `FloatLabelModule`, `InputTextModule`, `PasswordModule`, `DividerModule`, `ButtonModule`, `ToastModule`

### 5. `Groups` (Administración de Grupos)
- **Archivo:** `src/app/pages/home/groups/groups.ts`
- **Ruta:** `/home/groups`
- 4 cards de grupos con datos estáticos:
  - **Administradores** (3 miembros) — Acceso total al sistema
  - **Editores** (5 miembros) — Pueden crear y editar contenido
  - **Viewers** (12 miembros) — Solo lectura
  - **Soporte** (4 miembros) — Atención a incidencias
- Cada card muestra un ícono PrimeIcons, descripción, divider y tag con conteo de miembros
- **Componentes PrimeNG:** `CardModule`, `TagModule`, `DividerModule`

### 6. `Admin` (Panel de Administración)
- **Archivo:** `src/app/pages/home/admin/admin.ts`
- **Ruta:** `/home/admin`
- **Información del sistema** (4 info cards):
  - Versión del sistema: v0.0.5
  - Último despliegue: 27/Feb/2026
  - Usuarios activos: 24
  - Tiempo activo: 99.8%
- **Registro de Actividad** (tabla con 5 logs):
  - Cada log tiene hora, acción, usuario y tipo con `p-tag` por severity
  - Severities: `info`, `warn`, `success`, `danger`
- **Componentes PrimeNG:** `CardModule`, `TableModule`, `TagModule`

### 7. `Sidebar` (Navegación Tipo Tree — Actualizado)
- **Archivo:** `src/app/components/sidebar/sidebar.ts`
- Se actualizó para incluir **navegación tipo tree** con secciones expandibles:
  - **Inicio** → `/home`
  - **Dashboard** → `/home/dashboard`
  - **Gestión** (expandible con flecha `pi-chevron-down`):
    - **Usuario** → `/home/users`
    - **Grupos** → `/home/groups`
  - **Productos** → `/home/products`
  - **Admin** → `/home/admin`
- Sub-ítems con **animación slide-down** y conectores visuales
- Versión `0.0.5` mostrada en el footer del sidebar
- Título actualizado a "Practica 5"

## 🗺️ Rutas de la Aplicación (Práctica 5)

| Ruta | Componente | Layout | Descripción |
|---|---|---|---|
| `/` | `Landing` | — | Página de bienvenida |
| `/login` | `Login` | — | Formulario de inicio de sesión |
| `/register` | `Register` | — | Formulario de registro |
| `/home` | `Home` | `MainLayout` | Cards de acceso rápido a secciones |
| `/home/dashboard` | `Dashboard` | `MainLayout` | Métricas: Total Proyectos y Avance General |
| `/home/products` | `Products` | `MainLayout` | Tabla de productos con p-table |
| `/home/users` | `Users` | `MainLayout` | Perfil del administrador con edición |
| `/home/groups` | `Groups` | `MainLayout` | Cards de grupos y roles |
| `/home/admin` | `Admin` | `MainLayout` | Info del sistema y registro de actividad |

> Todas las rutas bajo `/home/*` heredan el `MainLayout` que incluye el Sidebar.

## 🧩 Componentes PrimeNG Utilizados (Práctica 5)

| Componente | Módulo | Páginas donde se usa |
|---|---|---|
| `p-card` | `CardModule` | Home, Dashboard, Products, Users, Groups, Admin |
| `p-table` | `TableModule` | Products, Admin |
| `p-tag` | `TagModule` | Dashboard, Products, Users, Groups, Admin |
| `p-button` | `ButtonModule` | Home, Users, Landing |
| `p-avatar` | `AvatarModule` | Users |
| `p-divider` | `DividerModule` | Users, Groups |
| `p-floatlabel` | `FloatLabelModule` | Users (con variant dinámico `in`/`on`) |
| `pInputText` | `InputTextModule` | Users |
| `p-password` | `PasswordModule` | Users |
| `p-toast` | `ToastModule` | Users |
| `pTooltip` | `TooltipModule` | Sidebar |
| `pRipple` | `RippleModule` | Sidebar |

## 🔧 Cambios de Configuración (Práctica 5)

- **`package.json`**: Nombre del proyecto actualizado de `practica2` a `practica5`, versión `0.0.5`
- **`angular.json`**: Build targets actualizados a `practica5:build:production` y `practica5:build:development`
- **`index.html`**: Título de la pestaña actualizado a `Practica5`
- **`app.routes.ts`**: Se agregaron 5 sub-rutas hijas bajo `/home`

## 📝 Resumen de lo Implementado (Práctica 5)

1. ✅ 5 nuevas sub-rutas bajo `/home`: Dashboard, Products, Users, Groups, Admin
2. ✅ Sidebar actualizado con navegación **tipo tree** (sección "Gestión" expandible)
3. ✅ Página **Home** con cards de acceso rápido (`p-card` + `p-button`)
4. ✅ Página **Dashboard** con 2 stat cards (`p-card` + `p-tag`)
5. ✅ Página **Productos** con tabla PrimeNG (`p-table` + `p-tag`)
6. ✅ Página **Usuario** (perfil del admin) con edición (`p-floatlabel`, `p-avatar`, `p-toast`)
7. ✅ Página **Grupos** con 4 cards de roles (`p-card` + `p-tag` + `p-divider`)
8. ✅ Página **Admin** con info del sistema y registro de actividad (`p-card` + `p-table` + `p-tag`)
9. ✅ Float labels con **variant dinámico** (`"in"` deshabilitado / `"on"` editando) en perfil de usuario
10. ✅ **Migración completa a PrimeNG** — Todas las páginas usan exclusivamente componentes PrimeNG
11. ✅ Nombre del proyecto actualizado a `practica5` con versión `0.0.5`
12. ✅ Título de la app actualizado a "Practica5" en `index.html`
13. ✅ Datos 100% estáticos (sin base de datos)

## 📌 Notas (Práctica 5)

- **Sin base de datos:** Todos los datos (productos, grupos, logs, perfil) están hardcodeados como arrays estáticos en los componentes TypeScript.
- **PrimeNG everywhere:** Se eliminó todo HTML/CSS custom en las páginas para usar exclusivamente componentes PrimeNG como `p-card`, `p-table`, `p-tag`, `p-avatar`, `p-button`, etc.
- **Float label variant dinámico:** En la página de usuario, el variant cambia de `"in"` (label dentro del campo gris) a `"on"` (label sobre el borde) según el estado de edición, evitando el contraste visual del fondo blanco de la label sobre inputs deshabilitados grises.
- **Sidebar tree:** La sección "Gestión" es expandible con animación slide-down y muestra sub-ítems "Usuario" y "Grupos" con líneas conectoras.
- **Edición de perfil:** El botón "Editar Perfil" habilita los campos, cambia a botones "Guardar" y "Cancelar", y muestra un Toast al guardar.

---

# Práctica 8 — Control de Acceso Basado en Roles/Permisos (RBAC)

## 📋 Descripción

En esta octava práctica se implementó un **sistema de seguridad RBAC (Role-Based Access Control)** completo en el frontend. Se creó un `PermissionsService` basado en **Angular Signals** para almacenar y consultar permisos del usuario, una **directiva estructural** `*ifHasPermission` para proteger elementos de la UI, **guards funcionales** de ruta para proteger el acceso a páginas, **simulación de JWT** en el login para cargar permisos dinámicamente, y un nuevo módulo de **Tickets** con tabla PrimeNG. Todo el sistema opera sin backend, simulando la decodificación de un token JWT hardcodeado.

## 🎯 Objetivos

1. Crear un `PermissionsService` con Signals para almacenar y consultar permisos del usuario.
2. Crear una directiva estructural `*ifHasPermission` reactiva para mostrar/ocultar elementos de la UI.
3. Implementar guards funcionales (`CanActivateFn`) para proteger rutas según permisos.
4. Simular la recepción y decodificación de un JWT en el login para extraer permisos.
5. Crear un módulo de Tickets con tabla PrimeNG y botones de acción protegidos.
6. Aplicar protección granular en la UI de Users, Groups y Tickets con la directiva de permisos.
7. Actualizar el menú del sidebar para incluir la opción de Tickets.

## 📁 Estructura del Proyecto (Práctica 8 — Archivos nuevos/modificados)

```
src/app/
├── services/                        ← NUEVO
│   └── permissions.service.ts       # PermissionsService con Signals
├── directives/                      ← NUEVO
│   └── if-has-permission.directive.ts  # Directiva estructural *ifHasPermission
├── guards/                          ← NUEVO
│   └── permission.guard.ts          # Guard funcional CanActivateFn
├── app.routes.ts                    # ← ACTUALIZADO: guards en rutas hijas
├── components/
│   └── sidebar/
│       ├── sidebar.ts               # ← ACTUALIZADO: menú Tickets + logout limpia permisos
│       └── sidebar.html             # ← ACTUALIZADO: Version 0.0.8
├── pages/
│   ├── auth/
│   │   └── login/
│   │       └── login.ts             # ← ACTUALIZADO: simulación JWT + carga de permisos
│   └── home/
│       ├── users/
│       │   ├── users.ts             # ← ACTUALIZADO: import directiva
│       │   └── users.html           # ← ACTUALIZADO: botones con *ifHasPermission
│       ├── groups/
│       │   ├── groups.ts            # ← ACTUALIZADO: import directiva
│       │   └── groups.html          # ← ACTUALIZADO: botones con *ifHasPermission
│       └── tickets/                 ← NUEVO
│           ├── tickets.ts           # Componente con tabla PrimeNG
│           ├── tickets.html         # Template con botones protegidos
│           └── tickets.css          # Estilos del componente
```

## 🧩 Componentes y Servicios Implementados (Práctica 8)

### 1. `PermissionsService` (Servicio de Permisos con Signals)
- **Archivo:** `src/app/services/permissions.service.ts`
- Servicio `providedIn: 'root'` que utiliza **Angular Signals** para almacenar permisos:
  - `setPermissions(permissions: string[])` — Establece los permisos del usuario (llamado tras login)
  - `hasPermission(permission: string)` — Verifica si tiene UN permiso específico
  - `hasAllPermissions(permissions: string[])` — Verifica si tiene TODOS los permisos
  - `hasAnyPermission(permissions: string[])` — Verifica si tiene AL MENOS UNO
  - `clearPermissions()` — Limpia los permisos (llamado en logout)
  - `currentPermissions` — Signal computado de solo lectura

### 2. `IfHasPermissionDirective` (Directiva Estructural)
- **Archivo:** `src/app/directives/if-has-permission.directive.ts`
- **Selector:** `*ifHasPermission`
- Directiva standalone que muestra/oculta elementos del DOM según permisos
- Utiliza `effect()` de Angular para ser **reactiva**: se re-evalúa automáticamente cuando los permisos cambian en el Signal
- Uso: `<ng-container *ifHasPermission="['users_edit']">...</ng-container>`

### 3. `permissionGuard` (Guard Funcional de Ruta)
- **Archivo:** `src/app/guards/permission.guard.ts`
- Guard funcional `CanActivateFn` que:
  - Lee el permiso requerido desde `route.data['permission']`
  - Verifica contra el `PermissionsService`
  - Redirige a `/home` si el usuario no tiene el permiso
  - Muestra mensaje en consola: `🚫 Acceso denegado: se requiere el permiso "xxx"`

### 4. `Login` (Actualizado — Simulación JWT)
- **Archivo:** `src/app/pages/auth/login/login.ts`
- Al ingresar credenciales correctas:
  1. Genera un **JWT falso** con estructura `header.payload.signature` en Base64
  2. **Decodifica** el payload del JWT para extraer el arreglo de permisos
  3. Llama a `permissionsService.setPermissions()` **antes** de redirigir a `/home`
- Permisos simulados en el JWT:
  - `users_view`, `users_edit`
  - `groups_view`
  - `tickets_view`, `tickets_add`, `tickets_edit`

### 5. `Tickets` (Nuevo Módulo)
- **Archivo:** `src/app/pages/home/tickets/tickets.ts`
- **Ruta:** `/home/tickets`
- Tabla PrimeNG con 5 tickets estáticos (Id, Asunto, Estado)
- Estados con severities: `Abierto` (info), `En Progreso` (warn), `Cerrado` (success)
- Botones de acción protegidos con `*ifHasPermission`:
  - **Crear Ticket** → requiere `tickets_add`
  - **Editar** → requiere `tickets_edit`
  - **Eliminar** → requiere `tickets_delete`
- **Componentes PrimeNG:** `TableModule`, `CardModule`, `TagModule`, `ButtonModule`, `ToastModule`, `TooltipModule`

### 6. `Sidebar` (Actualizado)
- Menú "Tickets" agregado bajo la sección "Gestión" con ícono `pi pi-ticket`
- Logout ahora llama a `permissionsService.clearPermissions()` para limpiar los permisos
- Versión actualizada a **Version 0.0.8**

## 🔐 Sistema de Permisos — Detalle

### Permisos del JWT Simulado

| Permiso | Efecto en la UI |
|---|---|
| `users_view` | ✅ Permite acceder a la ruta `/home/users` |
| `users_edit` | ✅ Muestra el botón "Editar Perfil" en Users |
| `groups_view` | ✅ Permite acceder a la ruta `/home/groups` |
| `tickets_view` | ✅ Permite acceder a la ruta `/home/tickets` |
| `tickets_add` | ✅ Muestra el botón "Crear Ticket" |
| `tickets_edit` | ✅ Muestra los iconos de editar en la tabla |

### Permisos NO incluidos (demuestran la protección)

| Permiso | Efecto en la UI |
|---|---|
| `users_delete` | ❌ Botón "Dar de baja" oculto en Users |
| `groups_add` | ❌ Botón "Agregar Grupo" oculto en Groups |
| `groups_edit` | ❌ Botones de editar/activar ocultos en Groups |
| `groups_delete` | ❌ Botón de eliminar oculto en Groups |
| `tickets_delete` | ❌ Iconos de eliminar ocultos en Tickets |

### Flujo de Autenticación y Permisos

```
Login (credenciales correctas)
  │
  ├── 1. Genera JWT falso (Base64)
  ├── 2. Decodifica payload → extrae permissions[]
  ├── 3. permissionsService.setPermissions(permissions)
  ├── 4. Redirige a /home
  │
  └── En cada ruta hija:
      ├── permissionGuard verifica route.data.permission
      └── *ifHasPermission muestra/oculta botones
```

## 🗺️ Rutas de la Aplicación (Práctica 8)

| Ruta | Componente | Guard | Permiso Requerido |
|---|---|---|---|
| `/` | `Landing` | — | — |
| `/login` | `Login` | — | — |
| `/register` | `Register` | — | — |
| `/home` | `Home` | — | — |
| `/home/users` | `Users` | `permissionGuard` | `users_view` |
| `/home/groups` | `Groups` | `permissionGuard` | `groups_view` |
| `/home/tickets` | `Tickets` | `permissionGuard` | `tickets_view` |

## 🛡️ Protección Granular en la UI — Ejemplos

### Users (`users.html`)
```html
<!-- Botón de editar: solo visible si tiene users_edit -->
<ng-container *ifHasPermission="['users_edit']">
    <p-button label="Editar Perfil" icon="pi pi-pencil" (onClick)="toggleEdit()" />
</ng-container>

<!-- Botón dar de baja: solo visible si tiene users_delete -->
<ng-container *ifHasPermission="['users_delete']">
    <p-button label="Dar de baja" icon="pi pi-ban" severity="danger" />
</ng-container>
```

### Groups (`groups.html`)
```html
<!-- Botón agregar: solo visible si tiene groups_add -->
<ng-container *ifHasPermission="['groups_add']">
    <p-button label="Agregar Grupo" icon="pi pi-plus" />
</ng-container>

<!-- Botón eliminar: solo visible si tiene groups_delete -->
<ng-container *ifHasPermission="['groups_delete']">
    <p-button icon="pi pi-trash" severity="danger" />
</ng-container>
```

### Tickets (`tickets.html`)
```html
<!-- Botón crear: solo visible si tiene tickets_add -->
<ng-container *ifHasPermission="['tickets_add']">
    <p-button label="Crear Ticket" icon="pi pi-plus" />
</ng-container>

<!-- Botón editar: solo visible si tiene tickets_edit -->
<ng-container *ifHasPermission="['tickets_edit']">
    <p-button icon="pi pi-pencil" severity="info" />
</ng-container>

<!-- Botón eliminar: solo visible si tiene tickets_delete -->
<ng-container *ifHasPermission="['tickets_delete']">
    <p-button icon="pi pi-trash" severity="danger" />
</ng-container>
```

## 📝 Resumen de lo Implementado (Práctica 8)

1. ✅ `PermissionsService` con Angular Signals (`signal`, `computed`, `effect`)
2. ✅ Directiva estructural `*ifHasPermission` reactiva para protección granular de la UI
3. ✅ Guard funcional `permissionGuard` (`CanActivateFn`) que lee `route.data.permission`
4. ✅ Simulación de JWT en el login con generación y decodificación de token Base64
5. ✅ Permisos cargados en el Signal antes de la redirección al `/home`
6. ✅ Nuevo módulo **Tickets** con tabla PrimeNG (Id, Asunto, Estado) y botones de acción
7. ✅ Guard aplicado a rutas: `/home/users` (users_view), `/home/groups` (groups_view), `/home/tickets` (tickets_view)
8. ✅ Menú de Tickets agregado al sidebar bajo "Gestión" con ícono `pi pi-ticket`
9. ✅ Versión del sidebar actualizada a **Version 0.0.8**
10. ✅ Logout limpia permisos con `clearPermissions()`
11. ✅ Botones de Users, Groups y Tickets protegidos con `*ifHasPermission`
12. ✅ Demostración funcional: botones de `*_delete` y `groups_add/edit` se ocultan correctamente
13. ✅ Datos 100% estáticos (sin backend, simulación pura de JWT)

## 📌 Notas (Práctica 8)

- **Sin backend:** La simulación de JWT se realiza enteramente en el frontend. No hay llamadas HTTP ni servidor.
- **Signals reactivos:** El `PermissionsService` usa Signals de Angular 21, lo que permite que la directiva `*ifHasPermission` se re-evalúe automáticamente cuando los permisos cambian (por ejemplo, al hacer login/logout).
- **Guard funcional:** Se usa la API moderna de Angular (`CanActivateFn`) en lugar de los guards basados en clases (deprecados).
- **Protección en dos niveles:** Las rutas están protegidas por guards (nivel de navegación) y los botones individuales por la directiva (nivel de UI).
- **Permisos granulares:** El sistema soporta permisos con formato `recurso_acción` (ej: `users_view`, `tickets_edit`), permitiendo control fino sobre cada operación CRUD por recurso.

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
