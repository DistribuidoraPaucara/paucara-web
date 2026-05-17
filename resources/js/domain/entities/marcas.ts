// Domain: Marcas
import type { Id } from './shared';
import type { BaseEntity, BaseFormData } from './generic';

export interface Marca extends BaseEntity {
  id: Id;
  nombre: string;
  descripcion?: string | null;
  activo: boolean;
}

export interface MarcaFormData extends BaseFormData {
  id?: Id;
  nombre: string;
  descripcion?: string | null;
  activo?: boolean;
}
