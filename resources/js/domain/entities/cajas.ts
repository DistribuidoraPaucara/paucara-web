/**
 * Domain Entities: Cajas (Box Management)
 *
 * Responsabilidades:
 * ✅ Define tipos de datos para el módulo de cajas
 * ✅ Interfaces de dominio: Caja, AperturaCaja, CierreCaja, MovimientoCaja
 * ✅ Props types para componentes
 */

export interface TipoOperacion {
    id: number;
    nombre: string;
    codigo: string;
}

export interface ComprobanteMovimiento {
    id: number;
    nombre_original: string;
    ruta_archivo: string;
    tipo_archivo: string;
    tamaño: number;
    created_at: string;
}

export interface Caja {
    id: number;
    nombre: string;
    ubicacion: string;
    monto_inicial_dia: number;
    activa: boolean;
}

export interface CierreCaja {
    id: number;
    monto_esperado: number;
    monto_real: number;
    diferencia: number;
    observaciones?: string;
    created_at: string;
}

export interface AperturaCaja {
    id: number;
    caja_id: number;
    user_id: number;
    fecha: string;
    monto_apertura: number;
    observaciones?: string;
    caja: Caja;
    cierre?: CierreCaja;
}

export interface MovimientoCaja {
    id: number;
    caja_id: number;
    numero_documento: string;
    observaciones: string;
    monto: number;
    fecha: string;
    created_at: string;
    tipo_operacion: TipoOperacion;
    tipo_pago?: any;  // ✅ NUEVO: Tipo de pago
    venta_id?: number;   // ✅ NUEVO: ID de venta para análisis de rango
    pago_id?: number;    // ✅ NUEVO: ID de pago para análisis de rango
    comprobantes?: ComprobanteMovimiento[];
    usuario?: Usuario;   // ✅ NUEVO: Usuario que realizó el movimiento
    venta?: {           // ✅ NUEVO (2026-02-11): Venta asociada con su estado y tipo entrega
        id: number;
        numero_documento?: string;
        numero?: string;
        tipo_entrega?: string; // ✅ NUEVO: DELIVERY o PICKUP
        total?: number;  // ✅ NUEVO: Total de la venta
        monto_pagado?: number;  // ✅ NUEVO: Monto pagado
        monto_pendiente?: number;  // ✅ NUEVO: Monto pendiente
        tipo_pago_id?: number;  // ✅ NUEVO: ID del tipo de pago
        estado_documento?: {
            id: number;
            codigo: string;
            nombre: string;
        };
        estado_documento_id?: number;
        cliente?: {  // ✅ NUEVO: Cliente asociado
            id: number;
            nombre: string;
        };
        detallesPagoVenta?: Array<{  // ✅ NUEVO: Detalles de pago
            id: number;
            monto: number;
            tipo_pago_id: number;
            tipoPago?: {
                id: number;
                nombre: string;
            };
        }>;
    };
}

export interface AperturaHistorico {
    id: number;
    caja_id: number;
    caja_nombre: string;
    fecha_apertura: string;
    monto_apertura: number | string;
    observaciones_apertura: string;
    fecha_cierre: string | null;
    monto_esperado: number | string | null;
    monto_real: number | string | null;
    diferencia: number | string | null;
    observaciones_cierre: string | null;
    estado: 'Abierta' | 'Cerrada';
    estado_cierre: string | null;
    vendidas_aprobadas?: number;  // ✅ NUEVO: Cantidad de ventas aprobadas en esta apertura
    vendidas_anuladas?: number;   // ✅ NUEVO: Cantidad de ventas anuladas en esta apertura
}

export interface Usuario {
    id: number;
    name: string;
    email: string;
}

export interface EfectivoEsperado {
    apertura: number;
    ventas_efectivo: number;
    pagos_credito: number;
    gastos: number;
    total: number;
}

export interface ResumenEfectivo {
    ventas_en_efectivo: number;
    ventas_a_credito: number;
    pagos_de_credito: number;
    efectivo_real: number;
    deuda_pendiente: number;
    ventas_por_tipo_pago: any;
}

/**
 * ✅ NUEVO: Datos de cierre de caja refactorizado
 */
export interface VentaPorTipoPago {
    tipo: string;
    total: number;
    cantidad: number;
}

export interface DatosResumen {
    apertura: number;
    totalVentas: number;
    ventasAnuladas: number;
    pagosCredito: number;
    totalSalidas: number;
    totalIngresos: number;
    totalEgresos: number;
    efectivoEsperado: number;
    ventasPorTipoPago: VentaPorTipoPago[];
    // ✅ NUEVO (2026-02-11): Desglose de salidas
    sumatorialGastos?: number;
    sumatorialPagosSueldo?: number;
    sumatorialAnticipos?: number;
    sumatorialCompras?: number;  // ✅ NUEVO (2026-02-20): Compras a proveedores
    sumatorialAnulaciones?: number;
}

/**
 * Props para el componente Index de Cajas
 */
export interface CajasIndexProps {
    cajas: Caja[];
    cajaAbiertaHoy: AperturaCaja | null;
    movimientosHoy: MovimientoCaja[];
    totalMovimientos: number;
    historicoAperturas?: AperturaHistorico[];
    tiposOperacion?: TipoOperacion[];
    tiposOperacionClasificados?: Record<string, TipoOperacion[]>; // ✅ NUEVO: Tipos clasificados por ENTRADA/SALIDA/AJUSTE
    tiposPago?: any[]; // ✅ NUEVO: Tipos de pago
    esVistaAdmin?: boolean; // ✅ NUEVO: Identificar si es vista admin
    usuarioDestino?: Usuario; // ✅ NUEVO: Usuario del cual se ve la caja
    efectivoEsperado?: EfectivoEsperado; // ✅ NUEVO: Efectivo esperado en caja
    resumenEfectivo?: ResumenEfectivo; // ✅ NUEVO: Resumen de efectivo
    ventasPorTipoPago?: any; // ✅ NUEVO: Ventas agrupadas por tipo de pago
    ventasPorEstado?: any; // ✅ NUEVO: Ventas agrupadas por estado
    pagosPorTipoPago?: any; // ✅ NUEVO: Pagos agrupados por tipo de pago
    gastosPorTipoPago?: any; // ✅ NUEVO: Gastos agrupados por tipo de pago
    datosResumen?: DatosResumen | null; // ✅ NUEVO (2026-02-11): Datos refactorizados de cierre de caja
    sumatorialCompras?: number;  // ✅ NUEVO (2026-02-20): Sumatoria de compras
    ventasTotales?: number;  // ✅ NUEVO: Total de ventas
    ventasAnuladas?: number;  // ✅ NUEVO: Ventas anuladas
    ventasCredito?: number;  // ✅ NUEVO: Ventas a crédito
}
