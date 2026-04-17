// ── Respuesta estándar de todos los microservicios ─────────────────────

export interface ApiResponse<T = any> {
  statusCode: number;
  intOpCode: string;
  data: T;
  timestamp: string;
  service: string;
}

// ── DB Types (reflejan tablas de Supabase PostgreSQL) ──────────────────

export interface DbUser {
  id: string;
  full_name: string;
  email: string;
  group_id: string | null;
  puesto: string | null;
}

export interface DbGroup {
  id: string;
  name: string;
  description: string | null;
}

export interface DbPermission {
  id: string;
  group_id: string;
  resource: string;
  can_view: boolean;
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
}

export interface DbTicket {
  id: string;
  title: string;
  description: string | null;
  created_by: string;
  group_id: string;
  status: string;
  priority: string;
  assignee: string | null;
  due_date: string | null;
  created_at: string;
}

// ── JWT Payload que viaja en cada request autenticado ──────────────────

export interface JwtPayload {
  userId: string;
  email: string;
  groupId: string | null;
  permissions: string[];
}
