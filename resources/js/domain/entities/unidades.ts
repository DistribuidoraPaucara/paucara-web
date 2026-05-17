// Domain: Unidades de Medida
import type { Id } from './shared';
import type { BaseEntity, BaseFormData } from './generic';

export interface UnidadMedida extends BaseEntity {
  id: Id;
  codigo: string;
  nombre: string;
  abreviatura?: string | null;
  activo: boolean;
}

export interface UnidadMedidaFormData extends BaseFormData {
  id?: Id;
  codigo: string;
  nombre: string;
  abreviatura?: string | null;
  activo?: boolean;
}
