// Domain: Tipo de Merma
import type { Id } from './shared';
import type { BaseEntity, BaseFormData } from './generic';

export interface TipoMerma extends BaseEntity {
  id: Id;
  nombre: string;
  descripcion?: string | null;
  porcentaje_maximo?: number | null;
  requiere_autorizacion?: boolean;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TipoMermaFormData extends BaseFormData {
  nombre: string;
  descripcion?: string;
  porcentaje_maximo?: number;
  requiere_autorizacion?: boolean;
  activo?: boolean;
}
