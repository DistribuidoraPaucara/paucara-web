// Domain: empresas
import type { Id } from './shared';
import type { BaseEntity, BaseFormData } from './generic';

export interface Empresa extends BaseEntity {
  id: Id;
  nombre_comercial: string;
  razon_social: string;
  nit?: string | null;
  telefono?: string | null;
  email?: string | null;
  sitio_web?: string | null;
  direccion?: string | null;
  ciudad?: string | null;
  pais?: string | null;
  logo_principal?: string | null;
  logo_compacto?: string | null;
  logo_footer?: string | null;
  mensaje_footer?: string | null;
  mensaje_legal?: string | null;
  configuracion_impresion?: Record<string, any>;
  activo: boolean;
  es_principal: boolean;
  permite_productos_fraccionados?: boolean; // ✨ NUEVO
  es_farmacia?: boolean; // ✨ NUEVO
  created_at?: string;
  updated_at?: string;
}

export interface EmpresaFormData extends BaseFormData {
  id?: Id;
  nombre_comercial: string;
  razon_social: string;
  nit?: string | null;
  telefono?: string | null;
  email?: string | null;
  sitio_web?: string | null;
  direccion?: string | null;
  ciudad?: string | null;
  pais?: string | null;
  logo_principal?: File | string | null;
  logo_compacto?: File | string | null;
  logo_footer?: File | string | null;
  mensaje_footer?: string | null;
  mensaje_legal?: string | null;
  activo?: boolean;
  es_principal?: boolean;
  permite_productos_fraccionados?: boolean; // ✨ NUEVO
  es_farmacia?: boolean; // ✨ NUEVO
}
