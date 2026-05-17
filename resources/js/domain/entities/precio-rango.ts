import { BaseEntity, BaseFormData, Pagination } from '@/domain/entities/generic';

export interface PrecioRango extends BaseEntity {
  id: number;
  empresa_id: number;
  producto_id: number;
  tipo_precio_id: number;
  cantidad_minima: number;
  cantidad_maxima: number | null;
  fecha_vigencia_inicio: string | null;
  fecha_vigencia_fin: string | null;
  activo: boolean;
  orden: number;
  created_at: string;
  updated_at: string;

  // Relaciones cargadas
  producto?: {
    id: number;
    nombre: string;
    sku: string;
  };
  tipoPrecio?: {
    id: number;
    nombre: string;
    codigo: string;
  };
  // ✅ NUEVO: Soportar también formato snake_case del API
  tipo_precio?: {
    id: number;
    nombre: string;
    codigo: string;
  };
  rango_texto?: string;
  precio_unitario?: number;
  vigente?: boolean;
}

export interface PrecioRangoFormData extends BaseFormData {
  id?: number;
  producto_id: number;
  tipo_precio_id: number;
  cantidad_minima: number;
  cantidad_maxima: number | null;
  fecha_vigencia_inicio?: string | null;
  fecha_vigencia_fin?: string | null;
  activo?: boolean;
  orden?: number;
}

export interface PrecioRangoPaginatedResponse extends Pagination<PrecioRango> {
  data: PrecioRango[];
  total: number;
  per_page: number;
  current_page: number;
}

// Para mostrar resumen de rangos
export interface PrecioRangoResumen {
  id: number;
  cantidad_minima: number;
  cantidad_maxima: number | null;
  rango_texto: string;  // Ej: "1-9", "10-49", "50+"
  tipo_precio: {
    id: number;
    nombre: string;
    codigo: string;
  };
  precio_unitario: number;
  activo: boolean;
  vigente: boolean;
}

export interface IntegridadRangos {
  es_valido: boolean;
  problemas: string[];
  cantidad_rangos: number;
}
