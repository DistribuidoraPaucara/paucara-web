// Domain: codigos-barra - Tipos para gestión de códigos de barra
import type { Id, Timestamp } from './shared';
import type { BaseEntity, BaseFormData } from './generic';

// Enum de tipos de código de barra (debe coincidir con backend)
export enum TipoCodigoEnum {
  EAN = 'EAN',
  UPC = 'UPC',
  CODE128 = 'CODE128',
  INTERNAL = 'INTERNAL',
  QR = 'QR',
}

// Interfaz principal para un código de barra
export interface CodigoBarra extends BaseEntity {
  id: Id;
  producto_id: Id;
  codigo: string;
  tipo: TipoCodigoEnum | string;
  tipo_label?: string;
  es_principal: boolean;
  activo: boolean;
  created_at?: Timestamp;
  updated_at?: Timestamp;
}

// Formulario para crear/editar código de barra
export interface CodigoBarraFormData extends BaseFormData {
  id?: Id;
  producto_id: Id;
  codigo?: string;
  tipo: TipoCodigoEnum | string;
  es_principal?: boolean;
  activo?: boolean;
  auto_generar?: boolean; // Para generar automáticamente
}

// Respuesta API para validación
export interface ValidacionCodigoResponse {
  valido: boolean;
  mensaje: string;
  errores: string[];
}

// Respuesta API para búsqueda de producto por código
export interface BusquedaCodigoResponse {
  id: Id;
  nombre: string;
  sku: string;
  codigo_principal?: string;
  segundo_codigo?: string;
}

// Respuesta API para generación de código
export interface GeneracionCodigoResponse {
  codigo: string;
  tipo: TipoCodigoEnum | string;
  valido: boolean;
}

// Opciones para select/dropdown
export interface TipoCodigoOption {
  value: TipoCodigoEnum | string;
  label: string;
  color?: string;
  requiere_validacion?: boolean;
  es_automatizable?: boolean;
}

// Filtros para búsqueda/listado
export interface CodigoBarraFilters {
  q?: string;
  tipo?: TipoCodigoEnum | string;
  activo?: boolean;
  es_principal?: boolean;
}

// Respuesta de listado de códigos
export interface ListadoCodigosResponse {
  producto_id: Id;
  nombre_producto: string;
  codigos: CodigoBarra[];
  total: number;
}
