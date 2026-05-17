// Domain: categorias - Updated to extend generic types
import type { Id } from './shared';
import type { BaseEntity, BaseFormData } from './generic';

export interface Categoria extends BaseEntity {
  id: Id;
  nombre: string;
  descripcion?: string | null;
  activo: boolean;
}

export interface CategoriaFormData extends BaseFormData {
  id?: Id;
  nombre: string;
  descripcion?: string | null;
  activo?: boolean;
}
