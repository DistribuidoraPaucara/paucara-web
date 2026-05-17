// Domain: Tipos de Ajuste de Inventario entity
import type { BaseEntity, BaseFormData } from './generic';

export interface TipoAjusteInventario extends BaseEntity {
  clave: string;
  label: string;
  tipo_operacion?: 'entrada' | 'salida' | 'ambos';
  descripcion?: string;
  color?: string;
  bg_color?: string;
  text_color?: string;
  activo?: boolean;
}

export interface TipoAjusteInventarioFormData extends BaseFormData {
  clave: string;
  label: string;
  tipo_operacion?: 'entrada' | 'salida' | 'ambos';
  descripcion?: string;
  color?: string;
  bg_color?: string;
  text_color?: string;
  activo?: boolean;
}
