# 📘 CONTEXTO TÉCNICO COMPLETO — Sistema de Gestión de Tickets y Usuarios

> **Propósito**: Este documento consolida absolutamente toda la información técnica, arquitectónica, funcional y de seguridad del proyecto. Está diseñado para que cualquier IA pueda generar documentación completa sin necesidad de leer el código fuente.
>
> **Generado**: Abril 2026 — Última revisión del código fuente completo.
> **Última actualización**: Integración de backend Fastify con microservicios.

---

## 1. VISIÓN GENERAL DEL PROYECTO

### 1.1 Descripción
Aplicación web full-stack orientada a la gestión de usuarios, grupos de trabajo y tickets de soporte. Funciona como un mini-ERP con tablero Kanban, panel de administración de usuarios y sistema de Control de Acceso Basado en Roles (RBAC) granular. La aplicación implementa una **arquitectura de microservicios** con un API Gateway centralizado en el backend y una SPA en el frontend.

### 1.2 Contexto Académico
Proyecto desarrollado incrementalmente a lo largo de 10 prácticas para la materia de **Seguridad** del 8vo cuatrimestre universitario:

| Práctica | Descripción |
|---|---|
| **P1** | Configuración inicial: Angular CLI + PrimeNG + tema Aura |
| **P2** | SPA con sistema de autenticación: Login, Registro, Landing Page |
| **P3** | Validación de credenciales (hardcoded) + formulario de registro con ReactiveFormsModule + validaciones (contraseña segura, mayoría de edad, teléfono) |
| **P4** | Layout con MainLayout + Sidebar + Home + personalización de tema Teal con `definePreset` |
| **P5** | 5 sub-rutas nuevas + sidebar tipo árbol (tree) + migración a componentes PrimeNG |
| **P7** | Limpieza/refactorización: eliminación de código redundante para preparar JWT y Roles |
| **P8** | RBAC simulado: `PermissionsService` con Signals, directiva `*ifHasPermission`, guards de Angular |
| **P9-P10** | **Migración completa a Supabase**: Auth real, DB PostgreSQL, Kanban funcional, panel admin, eliminación de mocks |
| **Post-P10** | **Backend con microservicios Fastify**: API Gateway, Auth/Ticket/User Services, JWT propio, rate limiting backend, eliminación de Supabase del frontend |

---

## 2. STACK TECNOLÓGICO

### 2.1 Frontend

| Tecnología | Versión | Rol |
|---|---|---|
| **Angular** | ^20.0.0 | Framework frontend principal |
| **TypeScript** | ~5.9.2 | Lenguaje tipado |
| **PrimeNG** | ^20.0.0 | Librería de componentes UI |
| **PrimeIcons** | ^7.0.0 | Iconografía |
| **@primeng/themes (Aura)** | ^20.0.0 | Tema visual personalizado |
| **@angular/cdk** | ^20.0.0 | Component Dev Kit (drag-drop, etc.) |
| **chart.js** | ^4.5.1 | Gráficos (Dashboard) |
| **RxJS** | ~7.8.0 | Programación reactiva |

### 2.2 Backend (Microservicios)

| Tecnología | Versión | Rol |
|---|---|---|
| **Fastify** | ^5.3.3 | Framework HTTP para microservicios |
| **@fastify/cors** | ^11.0.0 | Control de CORS por servicio |
| **@fastify/rate-limit** | ^10.2.0 | Rate limiting en API Gateway |
| **@fastify/jwt** | ^9.1.0 | Generación y verificación de JWT propios |
| **@supabase/supabase-js** | ^2.101.0 | Cliente Supabase (solo en backend) |
| **dotenv** | ^16.5.0 | Variables de entorno |
| **tsx** | ^4.19.0 | Runtime TypeScript para desarrollo |
| **concurrently** | ^9.1.0 | Ejecución paralela de servicios |

### 2.3 Base de Datos / BaaS

| Tecnología | Rol |
|---|---|
| **Supabase** | Backend-as-a-Service: Auth + PostgreSQL |
| **PostgreSQL** | Base de datos relacional (gestionada por Supabase) |

### 2.4 Configuración del Tema Frontend

El preset se define en `app.config.ts` como `Noir`, basado en `Aura` con paleta `Teal`:

```typescript
const Noir = definePreset(Aura, {
    semantic: {
        primary: {
            50: '{teal.50}', 100: '{teal.100}', ..., 950: '{teal.950}'
        },
        colorScheme: {
            light: {
                primary: { color: '{teal.500}', contrastColor: '#ffffff', hoverColor: '{teal.600}', activeColor: '{teal.700}' },
                highlight: { background: '{teal.50}', focusBackground: '{teal.100}', color: '{teal.700}', focusColor: '{teal.800}' }
            },
            dark: { /* Definido pero deshabilitado */ }
        }
    }
});
// darkModeSelector: 'none' → dark mode desactivado
```

### 2.5 Variables de Entorno

**Frontend** — `src/enviroments/enviroment.ts`:
```typescript
export const environment = {
    production: false,
    apiUrl: 'http://localhost:3000/api',  // URL del API Gateway
    supabase: { url: '...', key: '...' } // YA NO SE USA en frontend
};
```

**Backend** — `backend/.env`:
```env
SUPABASE_URL=https://xxxxx.supabase.co       # URL de Supabase
SUPABASE_SERVICE_KEY=eyJ...                  # Service Role Key (acceso total, NUNCA expuesta)
JWT_SECRET=clave_secreta_larga               # Secreto para firmar JWT propios

GATEWAY_PORT=3000                            # API Gateway
AUTH_PORT=3001                               # Auth Service
TICKET_PORT=3002                             # Ticket Service
USER_PORT=3003                               # User Service
```

---

## 3. ARQUITECTURA DE MICROSERVICIOS

### 3.1 Diagrama General

```
┌──────────────────────────────────────────────────────────────────┐
│                     ANGULAR FRONTEND (:4200)                      │
│                                                                    │
│  AuthService ─────┐                                                │
│  TicketService ───┤── HttpClient + authInterceptor (JWT Bearer)   │
│  PermissionSvc ───┘         │                                      │
│                             │  HTTP REST                           │
│  Almacena JWT en            │  Todas las requests van a            │
│  localStorage               │  http://localhost:3000/api/*         │
└─────────────────────────────┼──────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    API GATEWAY — Fastify (:3000)                    │
│                                                                     │
│  • CORS (solo localhost:4200)                                       │
│  • Rate Limiting global (100 req/min/IP)                            │
│  • Enrutamiento por prefijo:                                        │
│      /api/auth/*        → forward a Auth Service (:3001)           │
│      /api/tickets/*     → forward a Ticket Service (:3002)         │
│      /api/users/*       → forward a User Service (:3003)           │
│      /api/groups/*      → forward a User Service (:3003)           │
│      /api/permissions/* → forward a User Service (:3003)           │
│  • Health Check: GET /health                                        │
│  • Error 502 si microservicio no disponible                         │
└─────┬──────────────────────┬──────────────────────┬─────────────────┘
      │                      │                      │
      ▼                      ▼                      ▼
┌───────────┐         ┌────────────┐         ┌────────────┐
│ Auth Svc  │         │ Ticket Svc │         │ User Svc   │
│  :3001    │         │  :3002     │         │  :3003     │
├───────────┤         ├────────────┤         ├────────────┤
│ POST login│         │ GET  list  │         │ GET  users │
│ POST reg  │         │ POST create│         │ PATCH user │
│ GET  sess │         │ PATCH edit │         │ DEL  user  │
│ GET health│         │ PATCH move │         │ GET groups │
│           │         │ DEL delete │         │ GET perms  │
│ Firma JWT │         │ GET health │         │ PATCH perm │
│ propio    │         │            │         │ GET health │
└─────┬─────┘         └─────┬──────┘         └─────┬──────┘
      │                      │                      │
      │  Supabase Service Role Key (acceso total)   │
      └──────────────────────┼──────────────────────┘
                             ▼
                 ┌───────────────────────┐
                 │  SUPABASE (PostgreSQL) │
                 │                       │
                 │  Tables:              │
                 │  • users              │
                 │  • groups             │
                 │  • permissions        │
                 │  • tickets            │
                 │                       │
                 │  Auth Module:         │
                 │  • signInWithPassword │
                 │  • signUp             │
                 │                       │
                 │  Triggers:            │
                 │  • rate_limit_tickets │
                 └───────────────────────┘
```

### 3.2 Estructura de Archivos del Proyecto Completo

```
Practica10/
│
├── src/                              # ── FRONTEND (Angular) ──
│   ├── app/
│   │   ├── app.ts                    # Componente raíz
│   │   ├── app.html                  # Template raíz (<router-outlet>)
│   │   ├── app.config.ts             # Providers: Router, HttpClient+Interceptor, PrimeNG
│   │   ├── app.routes.ts             # Definición de rutas
│   │   │
│   │   ├── components/
│   │   │   └── sidebar/              # Sidebar reutilizable (tree menu)
│   │   │
│   │   ├── directives/
│   │   │   └── has-permission/
│   │   │       └── has-permission.directive.ts  # Directiva estructural RBAC
│   │   │
│   │   ├── guards/
│   │   │   └── auth.guard.ts         # Guard: sesión + permisos por ruta
│   │   │
│   │   ├── interceptors/
│   │   │   └── auth.interceptor.ts   # JWT localStorage → Authorization header
│   │   │
│   │   ├── layout/
│   │   │   └── main-layout/          # Layout principal (Sidebar + <router-outlet>)
│   │   │
│   │   ├── models/
│   │   │   └── api-response.model.ts # Interface ApiResponse<T>
│   │   │
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── login/            # Login con rate limiting frontend
│   │   │   │   └── register/         # Registro con validaciones
│   │   │   ├── home/
│   │   │   │   ├── dashboard/        # Panel con gráficos Chart.js + métricas
│   │   │   │   ├── users/            # Perfil del usuario actual
│   │   │   │   ├── admin-users/      # CRUD de usuarios + permisos (admin)
│   │   │   │   ├── groups/
│   │   │   │   │   ├── groups-list/  # Lista de grupos con resumen
│   │   │   │   │   └── group-tickets/# Tablero Kanban
│   │   │   │   └── tickets/          # [OBSOLETO] datos mock
│   │   │   └── landing/              # Página pública
│   │   │
│   │   └── services/
│   │       ├── auth.service.ts       # HttpClient → /api/auth/* y /api/users/*
│   │       ├── permission.service.ts # RBAC: hasPermission + refresh vía HttpClient
│   │       ├── ticket.service.ts     # HttpClient → /api/tickets/*
│   │       ├── supabase.service.ts   # [LEGACY] Ya no se usa en frontend
│   │       └── api-gateway.service.ts# [LEGACY] Ya no se usa en frontend
│   │
│   └── enviroments/
│       └── enviroment.ts             # apiUrl + supabase config (legacy)
│
├── backend/                          # ── BACKEND (Fastify Microservicios) ──
│   ├── package.json                  # Scripts: dev → corre los 4 servicios
│   ├── tsconfig.json
│   ├── .env                          # Supabase Service Key + JWT Secret + puertos
│   │
│   ├── shared/                       # Código compartido entre microservicios
│   │   ├── supabase.ts               # Cliente Supabase singleton (Service Role Key)
│   │   ├── types.ts                  # Interfaces: DbUser, DbGroup, DbTicket, etc.
│   │   └── response.ts              # Helper ApiResponse con intOpCode
│   │
│   ├── gateway/                      # API Gateway — Puerto 3000
│   │   ├── index.ts                  # Entry: CORS, Rate Limit, Health
│   │   └── proxy.ts                  # Router: forward a microservicios
│   │
│   ├── auth-service/                 # Microservicio Auth — Puerto 3001
│   │   ├── index.ts                  # Entry point
│   │   └── routes/
│   │       ├── login.ts              # POST /auth/login → JWT propio
│   │       ├── register.ts           # POST /auth/register
│   │       ├── session.ts            # GET  /auth/session → validar JWT
│   │       └── health.ts
│   │
│   ├── ticket-service/               # Microservicio Tickets — Puerto 3002
│   │   ├── index.ts                  # Entry + JWT verification hook
│   │   └── routes/
│   │       ├── tickets.ts            # CRUD completo + moveTicket (ownership)
│   │       └── health.ts
│   │
│   └── user-service/                 # Microservicio Users — Puerto 3003
│       ├── index.ts                  # Entry + JWT verification hook
│       └── routes/
│           ├── users.ts              # GET/PATCH/DELETE /users
│           ├── groups.ts             # GET /groups
│           ├── permissions.ts        # GET/PATCH /permissions
│           └── health.ts
│
├── sql/
│   └── rate_limit_tickets.sql        # Trigger PostgreSQL de rate limiting
│
├── README.md
└── CONTEXTO_COMPLETO_IA.md           # Este documento
```

### 3.3 Comunicación entre Microservicios

Los microservicios **no se comunican entre sí directamente**. Toda la comunicación sigue el patrón:

```
Frontend → API Gateway → Microservicio específico → Supabase
```

El Gateway actúa como **proxy reverso**: reenvía requests con headers intactos (incluyendo `Authorization: Bearer <JWT>`) al microservicio correspondiente según el prefijo de la URL.

Cada microservicio valida el JWT de forma independiente usando `@fastify/jwt` con el mismo `JWT_SECRET` compartido.

---

## 4. ESQUEMA DE BASE DE DATOS (Supabase PostgreSQL)

### 4.1 Tabla `users`

| Columna | Tipo | Constraints | Descripción |
|---|---|---|---|
| `id` | UUID | PK, FK → Supabase Auth | Mismo ID que en auth.users |
| `email` | TEXT | NOT NULL | Correo del usuario |
| `full_name` | TEXT | NOT NULL | Nombre completo |
| `group_id` | UUID | FK → groups.id, NULLABLE | Grupo al que pertenece |
| `puesto` | TEXT | NULLABLE | Puesto/cargo interno |

### 4.2 Tabla `groups`

| Columna | Tipo | Constraints | Descripción |
|---|---|---|---|
| `id` | UUID | PK | Identificador del grupo |
| `name` | TEXT | NOT NULL | Nombre del grupo |
| `description` | TEXT | NULLABLE | Descripción del grupo |

### 4.3 Tabla `permissions`

| Columna | Tipo | Constraints | Descripción |
|---|---|---|---|
| `id` | UUID | PK | Identificador del permiso |
| `group_id` | UUID | FK → groups.id | Grupo al que aplica |
| `resource` | TEXT | NOT NULL | Recurso: `ticket`, `group`, `user` |
| `can_view` | BOOLEAN | DEFAULT false | Permiso de lectura |
| `can_create` | BOOLEAN | DEFAULT false | Permiso de creación |
| `can_edit` | BOOLEAN | DEFAULT false | Permiso de edición |
| `can_delete` | BOOLEAN | DEFAULT false | Permiso de eliminación |

**UNIQUE constraint**: `(group_id, resource)` — Un grupo tiene exactamente una fila por recurso.

### 4.4 Tabla `tickets`

| Columna | Tipo | Constraints | Descripción |
|---|---|---|---|
| `id` | UUID | PK | Identificador del ticket |
| `title` | TEXT | NOT NULL | Título del ticket |
| `description` | TEXT | NULLABLE | Descripción detallada |
| `created_by` | UUID | FK → users.id | Usuario creador |
| `group_id` | UUID | FK → groups.id | Grupo al que pertenece |
| `status` | TEXT | NOT NULL | Estado actual (enum lógico) |
| `priority` | TEXT | NOT NULL | Prioridad (enum lógico) |
| `assignee` | UUID | FK → users.id, NULLABLE | Usuario asignado |
| `due_date` | TIMESTAMP | NULLABLE | Fecha límite |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Fecha de creación |

**Valores de `status`**: `Pendiente`, `En progreso`, `Revisión`, `Hecho`, `Bloqueado`

**Valores de `priority`**: `Urgente`, `Alta`, `Media Alta`, `Media`, `Media Baja`, `Baja`, `Muy Baja`

### 4.5 Trigger de Rate Limiting (Base de Datos)

```sql
-- Función: check_ticket_rate_limit()
-- Trigger: trg_ticket_rate_limit BEFORE INSERT ON tickets
-- Regla: Máximo 5 tickets por minuto por usuario (created_by)
-- Error: RAISE EXCEPTION con ERRCODE = 'P0001', HINT = 'rate_limit_exceeded'
```

### 4.6 Diagrama Relacional

```
┌─────────────┐       ┌─────────────┐       ┌──────────────┐
│   groups    │       │    users    │       │   tickets    │
├─────────────┤       ├─────────────┤       ├──────────────┤
│ id (PK)     │◄──────│ group_id(FK)│       │ id (PK)      │
│ name        │       │ id (PK)     │◄──────│ created_by   │
│ description │       │ email       │◄──────│ assignee     │
└──────┬──────┘       │ full_name   │       │ group_id ────┼──► groups.id
       │              │ puesto      │       │ title        │
       │              └─────────────┘       │ description  │
       │                                    │ status       │
┌──────▼──────┐                             │ priority     │
│ permissions │                             │ due_date     │
├─────────────┤                             │ created_at   │
│ id (PK)     │                             └──────────────┘
│ group_id(FK)│
│ resource    │
│ can_view    │
│ can_create  │
│ can_edit    │
│ can_delete  │
└─────────────┘
```

---

## 5. API GATEWAY (Puerto 3000)

### 5.1 Responsabilidades

1. **CORS**: Solo permite requests desde `http://localhost:4200`
2. **Rate Limiting Global**: 100 requests/minuto por IP
3. **Proxy/Router**: Reenvía requests a microservicios internos con headers intactos
4. **Health Aggregation**: `GET /health` devuelve status del gateway + URLs de servicios
5. **Error 502**: Si un microservicio no responde, devuelve Bad Gateway

### 5.2 Tabla de Enrutamiento

| Ruta Frontend | Método | Microservicio Destino | Ruta Interna |
|---|---|---|---|
| `/api/auth/login` | POST | Auth (:3001) | `/auth/login` |
| `/api/auth/register` | POST | Auth (:3001) | `/auth/register` |
| `/api/auth/session` | GET | Auth (:3001) | `/auth/session` |
| `/api/tickets` | GET | Ticket (:3002) | `/tickets?group_id=xxx` |
| `/api/tickets` | POST | Ticket (:3002) | `/tickets` |
| `/api/tickets/:id` | PATCH | Ticket (:3002) | `/tickets/:id` |
| `/api/tickets/:id/move` | PATCH | Ticket (:3002) | `/tickets/:id/move` |
| `/api/tickets/:id` | DELETE | Ticket (:3002) | `/tickets/:id` |
| `/api/users` | GET | User (:3003) | `/users` |
| `/api/users/:id` | PATCH | User (:3003) | `/users/:id` |
| `/api/users/:id` | DELETE | User (:3003) | `/users/:id` |
| `/api/groups` | GET | User (:3003) | `/groups` |
| `/api/permissions/:groupId` | GET | User (:3003) | `/permissions/:groupId` |
| `/api/permissions/:id` | PATCH | User (:3003) | `/permissions/:id` |

### 5.3 Función `forward()` del Proxy

```typescript
// Cada request se reenvía así:
async function forward(targetBase, path, method, authHeader?, body?) {
    const url = `${targetBase}${path}`;
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json', Authorization: authHeader }, body });
    return { status: res.status, data: await res.json() };
}
// Si fetch falla → devuelve { status: 502, intOpCode: 'SxGW502' }
```

---

## 6. AUTH SERVICE (Puerto 3001)

### 6.1 Endpoints

| Endpoint | Método | Autenticación | Descripción |
|---|---|---|---|
| `/auth/login` | POST | Ninguna | Login con email+password |
| `/auth/register` | POST | Ninguna | Registro de nuevo usuario |
| `/auth/session` | GET | JWT requerido | Validar token y refrescar perfil |
| `/auth/health` | GET | Ninguna | Health check |

### 6.2 Flujo de Login Detallado

```
1. Frontend envía POST /api/auth/login { email, password }
2. Gateway (:3000) reenvía a Auth Service (:3001)
3. Auth Service:
   a. Llama supabase.auth.signInWithPassword({ email, password })
   b. Si error → responde 401
   c. Si OK → lee perfil de tabla `users` (id, full_name, email, group_id, puesto)
   d. Si user tiene group_id → lee tabla `permissions` para ese grupo
   e. Mapea filas de permissions → array de strings Permission[]
   f. Firma JWT propio con @fastify/jwt:
      payload: { userId, email, groupId, permissions }
      expira: 8 horas
   g. Responde: { token, user: { id, email, fullName, username, puesto, groupId, permissions } }
4. Gateway reenvía respuesta al Frontend
5. Frontend (AuthService):
   a. Guarda JWT en localStorage('auth_token')
   b. Establece currentUser Signal con datos del usuario
   c. Componente Login redirige a /home
```

### 6.3 Flujo de Registro

```
1. Frontend envía POST /api/auth/register { email, password, fullName, username }
2. Auth Service:
   a. supabase.auth.signUp({ email, password, options: { data: { full_name, username } } })
   b. Inserta fila en tabla `users`: { id: auth_user_id, email, full_name }
3. Responde 201 { userId }
4. Frontend redirige a /login con mensaje "Revisa tu correo"
```

### 6.4 Restauración de Sesión (App Start)

```
1. Angular carga → AuthService constructor
2. Lee localStorage('auth_token')
3. Si hay token → GET /api/auth/session (con JWT en header)
4. Auth Service valida JWT → lee perfil fresco de DB
5. Si válido → retorna perfil → Frontend establece currentUser
6. Si inválido (401) → Frontend limpia localStorage, currentUser = null
```

### 6.5 JWT Propio del Backend

```
Algoritmo: HS256
Secreto: JWT_SECRET (compartido entre todos los microservicios)
Expiración: 8 horas
Payload: {
    userId: string,     // UUID del usuario
    email: string,
    groupId: string | null,
    permissions: string[]  // Array de permisos derivados
}
```

---

## 7. TICKET SERVICE (Puerto 3002)

### 7.1 Endpoints

| Endpoint | Método | Permiso | Descripción |
|---|---|---|---|
| `/tickets?group_id=xxx` | GET | `ticket:view` | Listar tickets de un grupo |
| `/tickets` | POST | `ticket:create` | Crear ticket |
| `/tickets/:id` | PATCH | `ticket:edit` | Editar campos de ticket |
| `/tickets/:id/move` | PATCH | `ticket:change_status` + ownership | Mover en Kanban |
| `/tickets/:id` | DELETE | `ticket:delete` | Eliminar ticket |
| `/tickets/health` | GET | Ninguno | Health check |

### 7.2 Middleware JWT Global

```typescript
app.addHook('onRequest', async (request, reply) => {
    if (request.url === '/tickets/health') return;  // Skip health
    await request.jwtVerify();  // Falla → 401
});
```

Cada handler accede al usuario decodificado mediante `request.user as JwtPayload`.

### 7.3 Reglas de Negocio de moveTicket (Kanban)

```
Endpoint: PATCH /tickets/:id/move  Body: { newState, assigneeId }

Regla 1: El usuario DEBE tener permiso 'ticket:change_status'
    Si NO → 403 (SxTI403)

Regla 2: El ticket DEBE estar asignado al usuario que hace el movimiento
    EXCEPCIÓN: Si tiene TODOS los permisos de ticket (view+create+edit+delete+change_status)
               puede mover CUALQUIER ticket
    Si falla → 403 (SxTI403_OWNER)

Si pasa ambas validaciones → UPDATE tickets SET status = newState WHERE id = :id
```

### 7.4 Rate Limiting de Creación (DB)

```
Al hacer INSERT en tickets → PostgreSQL ejecuta trigger check_ticket_rate_limit()
Si el mismo created_by tiene >5 tickets creados en el último minuto:
    → RAISE EXCEPTION (ERRCODE 'P0001')
    → Ticket Service captura P0001 → responde 429
```

---

## 8. USER SERVICE (Puerto 3003)

### 8.1 Endpoints

| Endpoint | Método | Permiso | Descripción |
|---|---|---|---|
| `/users` | GET | `user:view` o `users:view` | Lista todos los usuarios |
| `/users/:id` | PATCH | `user:edit` | Actualizar nombre/puesto/grupo |
| `/users/:id` | DELETE | `user:delete` | Eliminar usuario |
| `/groups` | GET | `group:view` | Lista todos los grupos |
| `/permissions/:groupId` | GET | `user:manage_permissions` | Permisos de un grupo |
| `/permissions/:id` | PATCH | `user:manage_permissions` | Toggle permiso individual |
| `/users/health` | GET | Ninguno | Health check |

### 8.2 Whitelist de Campos (PATCH /users/:id)

Solo se permiten 3 campos en la actualización para evitar manipulación:
```typescript
const allowed = {};
if (body.full_name !== undefined) allowed.full_name = body.full_name;
if (body.puesto !== undefined) allowed.puesto = body.puesto;
if (body.group_id !== undefined) allowed.group_id = body.group_id;
```

---

## 9. MODELO DE RESPUESTAS (ApiResponse)

### 9.1 Interfaz (compartida Frontend + Backend)

```typescript
// Frontend
interface ApiResponse<T = any> {
    statusCode: number;    // 200, 201, 400, 401, 403, 429, 500, 502, 503
    intOpCode: string;     // Identificador de operación interna
    data: T;               // Payload (null en errores)
}

// Backend (extiende con metadata)
interface ApiResponse<T = any> {
    statusCode: number;
    intOpCode: string;
    data: T;
    timestamp: string;     // ISO 8601
    service: string;       // 'gateway' | 'auth-service' | 'ticket-service' | 'user-service'
}
```

### 9.2 Convención de intOpCode

Formato: `Sx` + primeras 2 letras del recurso en MAYÚSCULA + statusCode

| intOpCode | Significado |
|---|---|
| `SxTI200` | Ticket: operación exitosa |
| `SxTI201` | Ticket: creación exitosa |
| `SxTI401` | Ticket: no autenticado |
| `SxTI403` | Ticket: sin permiso |
| `SxTI403_OWNER` | Ticket: movimiento bloqueado (no es el asignado) |
| `SxTI429` | Ticket: rate limit excedido |
| `SxTI500` | Ticket: error de servidor |
| `SxUS200` | Users: operación exitosa |
| `SxUS401` | Users: no autenticado |
| `SxUS500` | Users: error de servidor |
| `SxGR200` | Groups: operación exitosa |
| `SxPE200` | Permissions: operación exitosa |
| `SxHE200` | Health: servicio disponible |
| `SxHE503` | Health: servicio no disponible |
| `SxGW429` | Gateway: rate limit global excedido |
| `SxGW502` | Gateway: microservicio no disponible |

---

## 10. SISTEMA DE RUTAS (Frontend Angular)

### 10.1 Mapa Completo (app.routes.ts)

```
RUTAS PÚBLICAS (sin autenticación):
  /              → Landing          Página pública de bienvenida
  /login         → Login            Inicio de sesión con rate limiting
  /register      → Register         Registro de nuevas cuentas

RUTAS PROTEGIDAS (requieren authGuard → sesión activa):
  /home                → MainLayout (Sidebar + <router-outlet>)
    /home/dashboard    → Dashboard           Solo requiere autenticación
    /home/users        → Users               Solo requiere autenticación (perfil propio)
    /home/groups       → GroupsList           Requiere permiso 'group:view'
    /home/groups/:id   → GroupTickets         Requiere permiso 'ticket:view'
    /home/admin-users  → AdminUsers           Requiere permiso 'user:manage_permissions'

  /**                  → Redirect a /         Wildcard: redirige a landing
```

### 10.2 Guard de Autenticación (authGuard)

```typescript
// Flujo:
// 1. Espera hidratación del usuario (polling: 20 reintentos × 150ms = 3s máx)
// 2. Si no hay sesión → redirect a /login
// 3. Si la ruta tiene data.permission y el usuario NO lo tiene → redirect a /home/dashboard
// 4. Si todo OK → permite acceso
```

---

## 11. SISTEMA RBAC (Control de Acceso Basado en Roles/Permisos)

### 11.1 Catálogo de 23 Permisos

```typescript
const ALL_PERMISSIONS = [
    'group:create', 'group:edit', 'group:delete', 'group:view', 'group:add',
    'group:add_member', 'group:remove_member',
    'ticket:create', 'ticket:edit', 'ticket:delete', 'ticket:view', 'ticket:add',
    'ticket:assign', 'ticket:change_status', 'ticket:edit_state', 'ticket:comment',
    'user:create', 'user:edit', 'user:add', 'user:delete', 'user:view',
    'users:view', 'user:manage_permissions',
] as const;
```

### 11.2 Derivación de Permisos (DB → App)

La tabla `permissions` solo tiene 4 columnas booleanas. El Auth Service **deriva** permisos granulares:

```
Si recurso = 'ticket':
  can_view   → ticket:view
  can_create → ticket:create, ticket:add, ticket:assign, ticket:comment, ticket:change_status, ticket:edit_state
  can_edit   → ticket:edit, ticket:edit_state, ticket:change_status, ticket:comment
  can_delete → ticket:delete

Si recurso = 'group':
  can_view   → group:view
  can_create → group:create, group:add, group:add_member, group:remove_member
  can_edit   → group:edit
  can_delete → group:delete

Si recurso = 'user':
  can_view   → user:view, users:view
  can_create → user:create, user:add, user:manage_permissions
  can_edit   → user:edit
  can_delete → user:delete
```

Este mapeo se ejecuta en el **Auth Service del backend** al generar el JWT, y los permisos viajan dentro del token.

### 11.3 Dónde se validan permisos (4 capas)

| Capa | Mecanismo | Ejemplo |
|---|---|---|
| **Backend — Microservicio** | Verificación en cada handler | `if (!user.permissions.includes('ticket:create')) → 403` |
| **Frontend — Guard** | `data.permission` en app.routes.ts | Ruta `/admin-users` requiere `user:manage_permissions` |
| **Frontend — Directiva** | `*appHasPermission` | `<button *appHasPermission="'ticket:add'">` |
| **Frontend — Componente** | Guard interno imperativo | AdminUsers redirige si no tiene permiso |

### 11.4 Directiva Estructural `*appHasPermission`

```html
<!-- Uso básico: elimina del DOM si no tiene permiso -->
<button *appHasPermission="'ticket:add'">Crear Ticket</button>

<!-- Con bloque else -->
<div *appHasPermission="'users:view'; else noAccess">
    Contenido protegido
</div>
<ng-template #noAccess><p>Sin permisos</p></ng-template>
```

- Usa `ViewContainerRef.clear()` → **elimina del DOM** (no oculta con CSS)
- Reactiva con `effect()` → escucha cambios en `currentUser` Signal

---

## 12. INTERCEPTOR HTTP (Frontend)

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const token = localStorage.getItem('auth_token');

    // Inyectar JWT si existe
    const authReq = token
        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : req;

    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                localStorage.removeItem('auth_token');
                router.navigate(['/login']);
            }
            if (error.status === 429) {
                console.error('Rate limit alcanzado');
            }
            return throwError(() => error);
        })
    );
};
```

---

## 13. SERVICIOS FRONTEND DETALLADOS

### 13.1 AuthService (HttpClient → Backend)

| Método | Endpoint Backend | Descripción |
|---|---|---|
| `login(email, password)` | `POST /api/auth/login` | Login → guarda JWT en localStorage |
| `register(email, password, fullName, username)` | `POST /api/auth/register` | Registro |
| `logout()` | — (local only) | Limpia localStorage + Signal |
| `restoreSession()` | `GET /api/auth/session` | Valida JWT al cargar la app |
| `getUsers()` | `GET /api/users` | Lista todos los usuarios |
| `getGroups()` | `GET /api/groups` | Lista todos los grupos |
| `updateUser(userId, payload)` | `PATCH /api/users/:id` | Actualiza nombre/puesto/grupo |
| `updateUserGroup(userId, groupId)` | `PATCH /api/users/:id` | Cambia grupo |
| `deleteUser(userId)` | `DELETE /api/users/:id` | Elimina usuario |
| `getGroupPermissions(groupId)` | `GET /api/permissions/:groupId` | Permisos de un grupo |
| `updatePermission(permId, changes)` | `PATCH /api/permissions/:id` | Toggle permiso |

Signal principal: `currentUser = signal<AppUser | null>(null)`

### 13.2 TicketService (HttpClient → Backend)

| Método | Endpoint Backend | Descripción |
|---|---|---|
| `getTicketsByGroup(groupId)` | `GET /api/tickets?group_id=xxx` | Lista tickets de un grupo |
| `createTicket(ticket)` | `POST /api/tickets` | Crea ticket |
| `updateTicket(ticketId, changes)` | `PATCH /api/tickets/:id` | Edición general |
| `moveTicket(ticketId, newState, assigneeId)` | `PATCH /api/tickets/:id/move` | Kanban drag-drop |
| `deleteTicket(ticketId)` | `DELETE /api/tickets/:id` | Elimina ticket |

### 13.3 PermissionService

Servicio reactivo que lee permisos del `currentUser` Signal:
- `hasPermission(permission: string): boolean`
- `hasAllPermissions(permissions: string[]): boolean`
- `hasAnyPermission(permissions: string[]): boolean`
- `refreshPermissionsForGroup(groupId)` → `GET /api/permissions/:groupId`

---

## 14. COMPONENTES FRONTEND (DETALLE)

### 14.1 Login

- Formulario: email + password (ReactiveFormsModule)
- Rate limiting frontend: 3 intentos → lockout 30s con countdown visual
- UI: Banner rojo con shake animation + banner amarillo de advertencia
- PrimeNG: Card, InputText, Password, Button, Toast
- Éxito → guarda JWT en localStorage → redirige a /home en 800ms

### 14.2 Register

- Formulario: fullName, username, email, password (mín 6), confirmPassword
- Validador cruzado: `passwordsMatch`
- Éxito → mensaje "Revisa tu correo" → redirige a /login en 1.5s

### 14.3 Dashboard

- Métricas en tiempo real (Signals): total tickets, por estado, prioridad, completitud
- 3 gráficos Chart.js (doughnut): Estado, Completitud, Prioridad
- Selector de grupo dinámico
- Actividad reciente (5 tickets más nuevos con tiempo relativo)
- Saludo personalizado: "Buenos días/tardes/noches" + fecha en español (es-MX)

### 14.4 GroupsList

- Fetch de grupos + tickets → resumen por grupo: totalTickets, pendientes, completionRate
- Barra de progreso per-grupo
- Botón "Ver Kanban" → navega a `/home/groups/{groupId}`

### 14.5 GroupTickets / Kanban

- Vista Kanban (5 columnas drag-and-drop): Pendiente, En Progreso, Revisión, Hecho, Bloqueado
- Vista Lista (tabla PrimeNG): alternativa via SelectButton
- Drag & Drop: Optimistic update → si falla → revierte + toast error
- Filtros: "Mis tickets", "Sin asignar", "Prioridad Alta"
- Crear ticket: modal con `isSaving` para evitar doble click
- Editar ticket: modal con todos los campos

### 14.6 AdminUsers

- Guard interno: redirige si no tiene `user:manage_permissions`
- Tabla de usuarios con búsqueda inteligente
- Diálogo editar usuario: Nombre, Puesto, Grupo (dropdown)
- Diálogo editar permisos: toggles por recurso + "Seleccionar/Deseleccionar todo"
- Eliminar usuario: confirm dialog

### 14.7 Users / Perfil

- Perfil del usuario actual (nombre, email, puesto, grupo)
- Tabla de permisos con búsqueda
- Stats de tickets asignados
- Edición de perfil propio (nombre y puesto)

---

## 15. SEGURIDAD — RESUMEN DE MECANISMOS (7 capas)

| # | Capa | Mecanismo | Ubicación |
|---|---|---|---|
| 1 | **Frontend — Login** | Rate limiting (3 intentos / 30s cooldown) | Login component |
| 2 | **Frontend — Interceptor** | JWT localStorage → Authorization header + 401/429 | auth.interceptor.ts |
| 3 | **Frontend — Guard** | authGuard (sesión + permisos por ruta) | auth.guard.ts |
| 4 | **Frontend — Directiva** | `*appHasPermission` (remove from DOM) | has-permission.directive.ts |
| 5 | **Backend — Gateway** | CORS + Rate Limit global (100/min/IP) | gateway/index.ts |
| 6 | **Backend — Microservicios** | JWT verification + RBAC en cada handler | `request.jwtVerify()` + permission check |
| 7 | **Backend — DB** | Trigger `check_ticket_rate_limit()` (5/min/user) | PostgreSQL trigger |

### Mejora de seguridad vs arquitectura anterior

| Antes (Supabase directo) | Después (Microservicios) |
|---|---|
| Supabase `anon key` expuesta en frontend | Solo backend tiene `Service Role Key` |
| Frontend accede directamente a DB | Frontend solo conoce `http://localhost:3000` |
| JWT de Supabase (no controlado) | JWT propio firmado por Auth Service |
| Validación RBAC solo en frontend | Validación RBAC duplicada en backend |
| Sin proxy → cualquiera puede llamar a Supabase | Gateway controla acceso + rate limit |

---

## 16. FLUJO COMPLETO DE UNA REQUEST (Ejemplo: Crear Ticket)

```
1. Usuario hace click en "Crear Ticket" en el Kanban (Angular :4200)

2. TicketService llama HttpClient:
   POST http://localhost:3000/api/tickets
   Headers: { Authorization: "Bearer eyJ..." }
   Body: { title, description, group_id, priority, assignee }

3. authInterceptor inyecta el JWT de localStorage automáticamente

4. API Gateway (:3000) recibe la request:
   → Verifica rate limit (100 req/min/IP)
   → Reenvía a Ticket Service:
     POST http://localhost:3002/tickets
     (pasa el header Authorization intacto)

5. Ticket Service (:3002) recibe la request:
   → Hook onRequest: request.jwtVerify() → extrae { userId, permissions }
   → Handler: ¿permissions incluye 'ticket:create'?
     → Si NO → 403 { intOpCode: 'SxTI403' }
     → Si SÍ → continúa

6. Ticket Service INSERT en PostgreSQL  via Supabase (Service Role Key):
   → Supabase ejecuta trigger check_ticket_rate_limit()
     → Si >5 tickets/min → error P0001 → Ticket Service devuelve 429
     → Si OK → retorna el ticket creado con 201

7. Respuesta sube de vuelta:
   Ticket Service → Gateway → Angular Frontend

8. Frontend (TicketService.createTicket):
   → Si 201 → agrega a lista + distribuye en Kanban + toast "Ticket creado"
   → Si 429 → toast "Has creado demasiados tickets"
   → Si 403 → toast "Sin permiso"
```

---

## 17. CÓMO EJECUTAR EL PROYECTO

### 17.1 Backend (4 servicios simultáneos)

```bash
cd backend
# 1. Instalar dependencias
npm install

# 2. Configurar .env (SUPABASE_SERVICE_KEY y JWT_SECRET)

# 3. Levantar todos los servicios
npm run dev

# Resultado:
# 🚪 API Gateway      → http://localhost:3000
# 🔐 Auth Service     → http://localhost:3001
# 🎫 Ticket Service   → http://localhost:3002
# 👤 User Service     → http://localhost:3003
```

### 17.2 Frontend

```bash
# Desde la raíz del proyecto
npm install
ng serve

# → http://localhost:4200
```

### 17.3 Verificar Health

```powershell
Invoke-RestMethod -Uri http://localhost:3000/health | ConvertTo-Json
# Debe responder: { statusCode: 200, intOpCode: "SxHE200", data: { gateway: "OK", services: {...} } }
```

---

## 18. COMPONENTES PrimeNG UTILIZADOS

| Componente | Uso |
|---|---|
| `p-card` | Contenedores de formularios y widgets |
| `p-button` | Botones de acción |
| `p-table` | Tablas de usuarios, permisos, tickets |
| `p-dialog` | Modales crear/editar |
| `p-toast` | Notificaciones |
| `p-select` | Dropdowns |
| `p-tag` | Badges estado/prioridad |
| `p-avatar` | Iniciales de usuarios |
| `p-skeleton` | Placeholders de carga |
| `p-confirmdialog` | Confirmación de eliminación |
| `p-dragdrop` | Drag & drop Kanban |
| `p-chart` | Gráficos doughnut Dashboard |
| `p-selectbutton` | Toggle Kanban/Lista |
| `p-toggleswitch` | Switches de permisos |

---

## 19. NOTAS IMPORTANTES

### 19.1 Servicios Legacy (aún existen pero no se usan)

- `supabase.service.ts` — Ya no se importa en ningún servicio activo
- `api-gateway.service.ts` — Reemplazado por el backend real

### 19.2 Patrón de Hidratación

Múltiples componentes implementan polling para esperar que el `currentUser` Signal esté disponible:

```typescript
let retries = 0;
while (!auth.currentUser()?.id && retries < 20) {
    await new Promise(r => setTimeout(r, 150));
    retries++;
}
```

### 19.3 Código Compartido (backend/shared/)

Los 3 microservicios comparten:
- `supabase.ts` — Cliente singleton con Service Role Key
- `types.ts` — Interfaces TypeScript (DbUser, DbTicket, JwtPayload, etc.)
- `response.ts` — Helper `respond()` que genera ApiResponse con intOpCode

---

> **Fin del documento de contexto.**
>
> Para usar con una IA: copia este documento completo y acompáñalo de la solicitud específica.
> Ejemplo: "Teniendo en cuenta el contexto anterior, genera la documentación técnica formal del proyecto."
