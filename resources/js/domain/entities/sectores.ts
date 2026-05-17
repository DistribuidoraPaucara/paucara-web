// Domain: Sectores
import type { Id } from './shared';
import type { BaseEntity, BaseFormData } from './generic';

export interface Sector extends BaseEntity {
  id: Id;
  almacen_id: Id;
  nombre: string;
  es_generico: boolean;
  descripcion?: string | null;
  stock_minimo?: number;
  stock_maximo?: number;
  created_at?: string;
  updated_at?: string;
}

export interface SectorFormData extends BaseFormData {
  id?: Id;
  almacen_id: Id;
  nombre: string;
  es_generico?: boolean;
  descripcion?: string | null;
  stock_minimo?: number;
  stock_maximo?: number;
}

// Para mostrar nombre formateado en selects
export interface SectorSelect extends Sector {
  label?: string;
  value?: Id;
}
