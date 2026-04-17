import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../enviroments/enviroment';
import { AuthService } from './auth.service';
import type { ApiResponse } from '../models/api-response.model';

// ── Interfaces ────────────────────────────────────────────────────────────────

export type PriorityLevel =
  | 'Urgente' | 'Alta' | 'Media Alta' | 'Media' | 'Media Baja' | 'Baja' | 'Muy Baja';

export type TicketState =
  | 'Pendiente' | 'En progreso' | 'Revisión' | 'Hecho' | 'Bloqueado';

/** Columnas reales de la tabla `tickets` en Supabase */
export interface TicketDB {
  id: string;
  title: string;
  description: string | null;
  created_by: string;
  group_id: string;
  status: TicketState;
  priority: PriorityLevel;
  assignee: string | null;
  due_date: string | null;
  created_at?: string;
}

/** Interfaz app-friendly camelCase para componentes */
export interface TicketItem {
  id: string;
  groupId: string;
  title: string;
  state: TicketState;
  createdBy: string;
  assignee: string;
  priority: PriorityLevel;
  dueDate?: string | null;
  createdAt?: string;
  description?: string;
}

// ── Mapper DB → App ───────────────────────────────────────────────────────────
function dbToApp(row: TicketDB): TicketItem {
  return {
    id: row.id,
    groupId: row.group_id,
    title: row.title,
    state: row.status,
    createdBy: row.created_by,
    assignee: row.assignee ?? '',
    priority: row.priority,
    dueDate: row.due_date ?? null,
    createdAt: row.created_at ?? '',
    description: row.description ?? '',
  };
}

/** Helper opCode */
function opCode(status: number): string {
  return `SxTI${status}`;
}

function respond<T>(statusCode: number, data: T): ApiResponse<T> {
  return { statusCode, intOpCode: opCode(statusCode), data };
}

/**
 * TicketService — Usa HttpClient → API Gateway → Ticket Microservice.
 * Todas las respuestas siguen { statusCode, intOpCode, data }.
 */
@Injectable({ providedIn: 'root' })
export class TicketService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private api  = environment.apiUrl;

  // ── Obtener tickets de un grupo ────────────────────────────────────────────

  async getTicketsByGroup(groupId: string): Promise<ApiResponse<TicketItem[] | null>> {
    const user = this.auth.currentUser();
    if (!user) return respond(401, null);

    try {
      const res = await firstValueFrom(
        this.http.get<ApiResponse<TicketDB[]>>(`${this.api}/tickets`, {
          params: { group_id: groupId },
        })
      );

      if (res.statusCode === 200 && res.data) {
        return respond(200, res.data.map(dbToApp));
      }
      return respond(res.statusCode, null);
    } catch (err: any) {
      return respond(err?.status ?? 500, null);
    }
  }

  // ── Crear ticket ───────────────────────────────────────────────────────────

  async createTicket(ticket: Partial<TicketItem>): Promise<ApiResponse<TicketItem | null>> {
    const user = this.auth.currentUser();
    if (!user) return respond(401, null);

    const payload = {
      title: ticket.title,
      description: ticket.description ?? '',
      group_id: ticket.groupId ?? user.groupId,
      status: ticket.state ?? 'Pendiente',
      priority: ticket.priority ?? 'Media',
      assignee: ticket.assignee ?? null,
      due_date: ticket.dueDate ?? null,
    };

    try {
      const res = await firstValueFrom(
        this.http.post<ApiResponse<TicketDB>>(`${this.api}/tickets`, payload)
      );

      if ((res.statusCode === 201 || res.statusCode === 200) && res.data) {
        return respond(201, dbToApp(res.data));
      }
      return respond(res.statusCode, null);
    } catch (err: any) {
      // Rate limit (429) del trigger de DB
      const status = err?.status ?? 500;
      return respond(status, null);
    }
  }

  // ── Actualizar ticket (edición general) ────────────────────────────────────

  async updateTicket(
    ticketId: string,
    changes: Partial<TicketItem>
  ): Promise<ApiResponse<TicketItem | null>> {
    const payload: Partial<TicketDB> = {};
    if (changes.title !== undefined)       payload.title       = changes.title;
    if (changes.description !== undefined) payload.description = changes.description;
    if (changes.state !== undefined)       payload.status      = changes.state;
    if (changes.priority !== undefined)    payload.priority    = changes.priority;
    if (changes.assignee !== undefined)    payload.assignee    = changes.assignee;
    if (changes.dueDate !== undefined)     payload.due_date    = changes.dueDate;

    try {
      const res = await firstValueFrom(
        this.http.patch<ApiResponse<TicketDB>>(`${this.api}/tickets/${ticketId}`, payload)
      );

      if (res.statusCode === 200 && res.data) {
        return respond(200, dbToApp(res.data));
      }
      return respond(res.statusCode, null);
    } catch (err: any) {
      return respond(err?.status ?? 500, null);
    }
  }

  // ── Mover ticket (drag-and-drop Kanban) ────────────────────────────────────
  /**
   * moveTicket — Reglas de negocio del pizarrón:
   *   1. El usuario DEBE tener permiso "ticket:change_status".
   *   2. El ticket DEBE estar asignado al usuario que hace el movimiento.
   * Estas reglas ahora se validan en el backend (ticket-service).
   */
  async moveTicket(
    ticketId: string,
    newState: TicketState,
    ticketAssigneeId: string
  ): Promise<ApiResponse<TicketItem | null>> {
    const user = this.auth.currentUser();
    if (!user) return respond(401, null);

    try {
      const res = await firstValueFrom(
        this.http.patch<ApiResponse<TicketDB>>(`${this.api}/tickets/${ticketId}/move`, {
          newState,
          assigneeId: ticketAssigneeId,
        })
      );

      if (res.statusCode === 200 && res.data) {
        return respond(200, dbToApp(res.data));
      }
      return respond(res.statusCode, null);
    } catch (err: any) {
      const status = err?.status ?? 500;
      // Preservar intOpCode especial de ownership
      if (status === 403) {
        return { statusCode: 403, intOpCode: 'SxTI403_OWNER', data: null };
      }
      return respond(status, null);
    }
  }

  // ── Eliminar ticket ────────────────────────────────────────────────────────

  async deleteTicket(ticketId: string): Promise<ApiResponse<null>> {
    try {
      const res = await firstValueFrom(
        this.http.delete<ApiResponse<null>>(`${this.api}/tickets/${ticketId}`)
      );
      return respond(res.statusCode, null);
    } catch (err: any) {
      return respond(err?.status ?? 500, null);
    }
  }
}
