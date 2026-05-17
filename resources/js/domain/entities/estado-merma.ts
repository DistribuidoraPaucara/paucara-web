// Domain: Estado de Merma
import type { Id } from './shared';
import type { BaseEntity, BaseFormData } from './generic';

export interface EstadoMerma extends BaseEntity {
  id: Id;
  nombre: string;
  descripcion?: string | null;
  color?: string | null;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface EstadoMermaFormData extends BaseFormData {
  nombre: string;
  descripcion?: string;
  color?: string;
  activo?: boolean;
}
