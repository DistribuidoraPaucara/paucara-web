/**
 * Credit System Additional Types
 * API Response types, form DTOs, and utility types for credit management
 */

import type {
  Credito,
  CuentaPorCobrar,
  Pago,
  ClienteCreditoDetalles,
  CreditoResumen,
  CreditoFormData,
  CuentaPorCobrarFormData,
  PagoFormData,
} from '@/domain/entities/credito';
import type { Pagination } from '@/domain/entities/shared';

// ==================== API RESPONSE TYPES ====================

/**
 * Respuesta de API al obtener crédito
 */
export interface GetCreditoResponse {
  success: boolean;
  data: Credito;
  message?: string;
}

/**
 * Respuesta de API al obtener lista de créditos (paginada)
 */
export interface ListCreditosResponse {
  success: boolean;
  data: Pagination<Credito>;
  message?: string;
}

/**
 * Respuesta de API al obtener detalles de crédito de cliente
 */
export interface GetClienteCreditoDetallesResponse {
  success: boolean;
  data: ClienteCreditoDetalles;
  message?: string;
}

/**
 * Respuesta de API al obtener resumen de crédito
 */
export interface GetCreditoResumenResponse {
  success: boolean;
  data: CreditoResumen;
  message?: string;
}

/**
 * Respuesta de API al crear o actualizar crédito
 */
export interface CrudCreditoResponse {
  success: boolean;
  data: Credito;
  message: string;
}

/**
 * Respuesta de API al obtener cuentas por cobrar
 */
export interface ListCuentasResponse {
  success: boolean;
  data: Pagination<CuentaPorCobrar>;
  message?: string;
}

/**
 * Respuesta de API al obtener historial de pagos
 */
export interface ListPagosResponse {
  success: boolean;
  data: Pagination<Pago>;
  message?: string;
}

/**
 * Respuesta de API al registrar pago
 */
export interface RegistrarPagoResponse {
  success: boolean;
  data: {
    pago: Pago;
    cuenta_actualizada: CuentaPorCobrar;
    credito_actualizado: Credito;
  };
  message: string;
}

// ==================== FORM SUBMISSION TYPES ====================

/**
 * Datos enviados al crear/actualizar crédito
 */
export interface CreateUpdateCreditoPayload {
  cliente_id: number;
  limite_credito_aprobado: number;
}

/**
 * Datos enviados al registrar pago
 */
export interface RegistrarPagoPayload {
  cuenta_por_cobrar_id: number;
  monto: number;
  tipo_pago: string;
  numero_recibo?: string;
  observaciones?: string;
  fecha_pago: string;
}

/**
 * Datos enviados al ajustar límite de crédito
 */
export interface AjustarLimitePayload {
  cliente_id: number;
  nuevo_limite: number;
  razon?: string;
}

// ==================== FILTER AND SEARCH TYPES ====================

/**
 * Filtros para búsqueda de créditos
 */
export interface CreditoFilters {
  q?: string; // Búsqueda por nombre de cliente
  estado?: string; // Filtrar por estado (disponible, en_uso, critico, excedido)
  min_porcentaje?: number; // Mínimo porcentaje de utilización
  max_porcentaje?: number; // Máximo porcentaje de utilización
  tiene_vencidas?: boolean; // Filtrar clientes con cuentas vencidas
  sortBy?: 'cliente' | 'limite' | 'utilizado' | 'disponible' | 'porcentaje';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Filtros para búsqueda de cuentas por cobrar
 */
export interface CuentaFilters {
  q?: string; // Búsqueda por cliente/venta
  cliente_id?: number; // Filtrar por cliente
  estado?: string; // Filtrar por estado
  dias_vencimiento?: 'vencidas' | 'proximas' | 'pendientes'; // Filtros rápidos
  fecha_desde?: string;
  fecha_hasta?: string;
  sortBy?: 'fecha_vencimiento' | 'saldo_pendiente' | 'monto_original';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Filtros para búsqueda de pagos
 */
export interface PagoFilters {
  q?: string; // Búsqueda por cliente/recibo
  cliente_id?: number; // Filtrar por cliente
  tipo_pago?: string; // Filtrar por tipo de pago
  fecha_desde?: string;
  fecha_hasta?: string;
  sortBy?: 'fecha_pago' | 'monto';
  sortOrder?: 'asc' | 'desc';
}

// ==================== STATISTICS TYPES ====================

/**
 * Estadísticas de crédito para dashboard
 */
export interface CreditoStats {
  total_clientes_con_credito: number;
  total_limite_aprobado: number;
  total_saldo_utilizado: number;
  total_saldo_disponible: number;
  porcentaje_utilizacion_promedio: number;
  clientes_criticos: number;
  cuentas_vencidas_total: number;
  monto_vencido_total: number;
  clientes_al_dia: number;
}

// ==================== NOTIFICATION TYPES ====================

/**
 * Datos para notificación de crédito vencido
 */
export interface CreditoVencidoNotification {
  cuentaId: number;
  clienteNombre: string;
  saldoPendiente: number;
  diasVencido: number;
  fechaVencimiento: string;
}

/**
 * Datos para notificación de crédito crítico
 */
export interface CreditoCriticoNotification {
  clienteId: number;
  clienteNombre: string;
  porcentajeUtilizado: number;
  saldoDisponible: number;
  cuentasPendientes: number;
}

/**
 * Datos para notificación de pago registrado
 */
export interface CreditoPagoNotification {
  pagoId: number;
  clienteNombre: string;
  monto: number;
  metodoPago: string;
  saldoRestante: number;
}

// ==================== EXPORT TYPES ====================

/**
 * Datos para exportar reporte de créditos
 */
export interface ExportarCreditosPayload {
  formato: 'pdf' | 'excel';
  filtros?: CreditoFilters;
}

/**
 * Datos para exportar reporte de cuentas pendientes
 */
export interface ExportarCuentasPayload {
  formato: 'pdf' | 'excel';
  cliente_id?: number;
  filtros?: CuentaFilters;
}

// ==================== UTILITY TYPES ====================

/**
 * Resultado de validación de datos de pago
 */
export interface ValidarPagoResult {
  valido: boolean;
  errores: string[];
  advertencias?: string[];
}

/**
 * Resultado de búsqueda rápida
 */
export interface QuickSearchResult {
  tipo: 'cliente' | 'cuenta' | 'pago';
  id: number;
  titulo: string;
  subtitulo?: string;
  icono?: string;
  ruta: string;
}

/**
 * Detalle de cuenta por cobrar
 */
export interface CuentaPorCobrarDetalle {
  id: number;
  venta_id: number;
  numero_venta: string;
  fecha_venta: string;
  monto_original: number;
  saldo_pendiente: number;
  dias_vencido: number;
  fecha_vencimiento: string;
  estado: string;
}

/**
 * Detalle de cuenta por cobrar con pagos expandibles
 */
export interface CuentaPorCobrarExpandible extends CuentaPorCobrarDetalle {
  pagos: PagoDetalle[];
}

/**
 * Detalle de pago registrado
 */
export interface PagoDetalle {
  id: number;
  venta_id: number;
  numero_venta: string;     // ✅ NUEVO: número de venta relacionada
  fecha_venta?: string;     // ✅ NUEVO: fecha de venta
  monto: number;
  fecha_pago: string;
  tipo_pago: string;
  numero_recibo?: string;
  usuario?: string;
  observaciones?: string;
}

/**
 * Cambio registrado en auditoría de crédito
 */
export interface CambioAuditoria {
  anterior: string | number | unknown;
  actual: string | number | unknown;
}

/**
 * Registro de auditoría de cambios en crédito
 */
export interface AuditoriaCredito {
  id: number;
  responsable: string;
  fecha: string;
  accion: string;
  cambios?: Record<string, CambioAuditoria>;
  motivo?: string;
}

/**
 * Estado de carga async para operaciones
 */
export interface AsyncLoadingState {
  loading: boolean;
  error: string | null;
  success: boolean;
}
