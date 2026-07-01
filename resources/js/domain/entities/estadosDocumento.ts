// Domain: estadosDocumento - Updated to extend generic types
import type { Id } from './shared';
import type { BaseEntity, BaseFormData } from './generic';

export interface EstadoDocumento extends BaseEntity {
  id: Id;
  codigo: string;
  nombre: string;
  descripcion?: string | null;
  activo: boolean;
  permite_edicion: boolean;
  permite_anulacion: boolean;
  es_estado_final: boolean;
  color?: string | null;
  icono?: string | null;
  estado_anterior_id?: Id | null;
  estado_siguiente_id?: Id | null;
  estadoAnterior?: EstadoDocumento | null;
  estadoSiguiente?: EstadoDocumento | null;
}

export interface EstadoDocumentoFormData extends BaseFormData {
  id?: Id;
  codigo: string;
  nombre: string;
  descripcion?: string | null;
  activo?: boolean;
  permite_edicion?: boolean;
  permite_anulacion?: boolean;
  es_estado_final?: boolean;
  color?: string | null;
  icono?: string | null;
  estado_anterior_id?: Id | null;
  estado_siguiente_id?: Id | null;
}
