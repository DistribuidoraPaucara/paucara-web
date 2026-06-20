// Domain: TipoOperacionCaja - Entidad de dominio para Tipos de Operación de Caja
import type { Id } from './shared';
import type { BaseEntity, BaseFormData } from './generic';

export interface TipoOperacionCaja extends BaseEntity {
  id: Id;
  codigo: string;
  nombre: string;
  descripcion?: string | null;
  direccion?: string | null;
  activo: boolean;
}

export interface TipoOperacionCajaFormData extends BaseFormData {
  id?: Id;
  codigo: string;
  nombre: string;
  descripcion?: string | null;
  direccion?: string | null;
  activo?: boolean;
}
