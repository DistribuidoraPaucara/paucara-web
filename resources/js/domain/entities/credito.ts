// Domain: Créditos
import type { BaseEntity, BaseFormData } from './generic';
import type { Id } from './shared';

/**
 * Estado del crédito
 * - disponible: 0% utilización
 * - en_uso: 1-79% utilización
 * - critico: 80-99% utilización
 * - excedido: >= 100% utilización
 */
export type CreditoEstado = 'disponible' | 'en_uso' | 'critico' | 'excedido';

/**
 * Estado de una cuenta por cobrar
 * - pendiente: Sin vencer y no pagada
 * - vencida: Pasó la fecha de vencimiento
 * - pagada: Completamente pagada
 * - parcial: Parcialmente pagada
 */
export type CuentaEstado = 'pendiente' | 'vencida' | 'pagada' | 'parcial';

/**
 * Tipos de pago aceptados
 */
export type TipoPago = 'efectivo' | 'transferencia' | 'cheque' | 'tarjeta' | 'deposito' | 'otro';

// ==================== CREDITO ====================

/**
 * Crédito principal del cliente
 * Representa el límite de crédito aprobado y su utilización
 */
export interface Credito extends BaseEntity {
  id: Id;
  cliente_id: Id;
  limite_credito_aprobado: number;
  saldo_disponible: number;
  saldo_utilizado: number;
  porcentaje_utilizado: number;
  estado: CreditoEstado;
  cuentas_vencidas_count: number;
  cuentas_pendientes_count: number;
  fecha_aprobacion: string;
  fecha_ultima_actualizacion?: string | null;
}

/**
 * Datos para crear o actualizar un crédito
 */
export interface CreditoFormData extends BaseFormData {
  id?: Id;
  cliente_id: Id;
  limite_credito_aprobado: number;
  saldo_utilizado?: number;
}

// ==================== CUENTA POR COBRAR ====================

/**
 * Cuenta por cobrar (deuda de un cliente por una venta)
 * Representa cada transacción de crédito individual
 */
export interface CuentaPorCobrar extends BaseEntity {
  id: Id;
  cliente_id: Id;
  venta_id: Id;
  monto_original: number;
  saldo_pendiente: number;
  dias_vencido: number;
  fecha_vencimiento: string;
  estado: CuentaEstado;
  cliente_nombre?: string | null;
  venta_numero?: string | null;
  pagos?: Pago[] | null;
}

/**
 * Datos para crear o actualizar una cuenta por cobrar
 */
export interface CuentaPorCobrarFormData extends BaseFormData {
  id?: Id;
  cliente_id: Id;
  venta_id: Id;
  monto_original: number;
  fecha_vencimiento: string;
}

// ==================== PAGO ====================

/**
 * Pago aplicado a una cuenta por cobrar
 * Registra cada pago parcial o total realizado
 */
export interface Pago extends BaseEntity {
  id: Id;
  cuenta_por_cobrar_id: Id;
  monto: number;
  tipo_pago: TipoPago;
  numero_recibo?: string | null;
  fecha_pago: string;
  observaciones?: string | null;
  usuario_id?: Id | null;
  usuario_nombre?: string | null;
}

/**
 * Datos para crear o actualizar un pago
 */
export interface PagoFormData extends BaseFormData {
  id?: Id;
  cuenta_por_cobrar_id: Id;
  monto: number;
  tipo_pago: TipoPago;
  numero_recibo?: string;
  fecha_pago: string;
  observaciones?: string;
}

// ==================== DETALLES CLIENTE ====================

/**
 * Detalles completos de crédito para un cliente
 * Agrupa crédito, cuentas pendientes y pagos
 */
export interface ClienteCreditoDetalles {
  credito: Credito;
  cuentas_por_cobrar: CuentaPorCobrar[];
  pagos_recientes: Pago[];
  total_pendiente: number;
  total_vencido: number;
  dias_promedio_vencimiento: number;
}

// ==================== RESUMEN CREDITO ====================

/**
 * Resumen de crédito para dashboard
 * Información condensada del estado crediticio
 */
export interface CreditoResumen {
  id: Id;
  cliente_id: Id;
  cliente_nombre: string;
  limite_credito: number;
  saldo_disponible: number;
  saldo_utilizado: number;
  porcentaje_utilizado: number;
  estado: CreditoEstado;
  cuentas_pendientes: number;
  cuentas_vencidas: number;
  monto_total_vencido: number;
}

// ==================== HISTORIAL PAGO ====================

/**
 * Entrada de historial de pago
 * Usado para mostrar histórico de pagos por cliente
 */
export interface HistorialPago {
  id: Id;
  fecha: string;
  cliente_nombre: string;
  monto: number;
  tipo_pago: TipoPago;
  usuario_nombre?: string | null;
  numero_recibo?: string | null;
}

// ==================== VALIDACIONES Y HELPERS ====================

/**
 * Obtener color según estado de crédito
 */
export const getCreditoColorByEstado = (estado: CreditoEstado): string => {
  switch (estado) {
    case 'disponible':
      return '#388E3C'; // Verde
    case 'en_uso':
      return '#1976D2'; // Azul
    case 'critico':
      return '#F57C00'; // Naranja
    case 'excedido':
      return '#D32F2F'; // Rojo
    default:
      return '#757575'; // Gris
  }
};

/**
 * Obtener color según estado de cuenta
 */
export const getCuentaColorByEstado = (estado: CuentaEstado): string => {
  switch (estado) {
    case 'pendiente':
      return '#1976D2'; // Azul
    case 'vencida':
      return '#D32F2F'; // Rojo
    case 'pagada':
      return '#388E3C'; // Verde
    case 'parcial':
      return '#F57C00'; // Naranja
    default:
      return '#757575'; // Gris
  }
};

/**
 * Obtener etiqueta legible del estado
 */
export const getCreditoEstadoLabel = (estado: CreditoEstado): string => {
  switch (estado) {
    case 'disponible':
      return 'Disponible';
    case 'en_uso':
      return 'En Uso';
    case 'critico':
      return 'Crítico';
    case 'excedido':
      return 'Excedido';
    default:
      return 'Desconocido';
  }
};

/**
 * Obtener etiqueta legible del estado de cuenta
 */
export const getCuentaEstadoLabel = (estado: CuentaEstado): string => {
  switch (estado) {
    case 'pendiente':
      return 'Pendiente';
    case 'vencida':
      return 'Vencida';
    case 'pagada':
      return 'Pagada';
    case 'parcial':
      return 'Parcial';
    default:
      return 'Desconocido';
  }
};

/**
 * Obtener etiqueta legible del tipo de pago
 */
export const getTipoPagoLabel = (tipo: TipoPago): string => {
  switch (tipo) {
    case 'efectivo':
      return 'Efectivo';
    case 'transferencia':
      return 'Transferencia';
    case 'cheque':
      return 'Cheque';
    case 'tarjeta':
      return 'Tarjeta';
    case 'deposito':
      return 'Depósito';
    case 'otro':
      return 'Otro';
    default:
      return 'Desconocido';
  }
};
