// Domain: estadosLogistica - Updated to extend generic types
import type { Id } from './shared';
import type { BaseEntity, BaseFormData } from './generic';

export interface EstadoLogistica extends BaseEntity {
  id: Id;
  codigo: string;
  categoria: string;
  nombre: string;
  descripcion?: string | null;
  orden: number;
  activo: boolean;
  color?: string | null;
  icono?: string | null;
  estado_anterior_id?: Id | null;
  estado_siguiente_id?: Id | null;
  es_estado_final: boolean;
  permite_edicion: boolean;
  requiere_aprobacion: boolean;
  metadatos?: Record<string, any> | null;
  estadoAnterior?: EstadoLogistica | null;
  estadoSiguiente?: EstadoLogistica | null;
}

export interface EstadoLogisticaFormData extends BaseFormData {
  id?: Id;
  codigo: string;
  categoria: string;
  nombre: string;
  descripcion?: string | null;
  orden?: number;
  activo?: boolean;
  color?: string | null;
  icono?: string | null;
  estado_anterior_id?: Id | null;
  estado_siguiente_id?: Id | null;
  es_estado_final?: boolean;
  permite_edicion?: boolean;
  requiere_aprobacion?: boolean;
  metadatos?: Record<string, any> | null;
}
