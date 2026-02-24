# Proyecto Angular — Seguridad (8vo Cuatrimestre)

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

