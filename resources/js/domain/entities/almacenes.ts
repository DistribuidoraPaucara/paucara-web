// Domain: Almacenes
import type { Id } from './shared';
import type { BaseEntity, BaseFormData } from './generic';

export interface Almacen extends BaseEntity {
  id: Id;
  nombre: string;
  direccion?: string | null;
  responsable?: string | null;
  telefono?: string | null;
  activo: boolean;
  ubicacion_fisica?: string | null;
  requiere_transporte_externo?: boolean;
}

export interface AlmacenFormData extends BaseFormData {
  id?: Id;
  nombre: string;
  direccion?: string | null;
  responsable?: string | null;
  telefono?: string | null;
  activo?: boolean;
  ubicacion_fisica?: string | null;
  requiere_transporte_externo?: boolean;
}
