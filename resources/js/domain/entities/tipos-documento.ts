import type { BaseEntity, BaseFormData } from './generic';

export interface TipoDocumento extends BaseEntity {
  codigo: string;
  nombre: string;
  descripcion?: string;
  genera_inventario: boolean;
  requiere_autorizacion: boolean;
  formato_numeracion?: string;
  siguiente_numero: number;
  activo: boolean;
}

export interface TipoDocumentoFormData extends BaseFormData {
  codigo: string;
  nombre: string;
  descripcion?: string;
  genera_inventario: boolean;
  requiere_autorizacion: boolean;
  formato_numeracion?: string;
  siguiente_numero: number;
  activo: boolean;
}
