// Domain: Compras
import type { Id } from './shared';
import type { BaseEntity, BaseFormData } from './generic';
import type { EstadoDocumento } from './estados-documento';
import type { Usuario } from './usuarios';
import type { Moneda } from './monedas';
import type { TipoPago } from './tipos-pago';
import type { Proveedor } from './proveedores';
import type { Producto } from './productos';

// =============== INTERFACES BÁSICAS ===============

export interface CuentaPorPagar extends BaseEntity {
    id: Id;
    compra_id: Id;
    compra?: Compra;
    monto_original: number;
    saldo_pendiente: number;
    fecha_vencimiento: string;
    dias_vencido: number;
    estado: 'PENDIENTE' | 'PAGADO' | 'VENCIDO' | 'PARCIAL';
    observaciones?: string | null;

    // Relación con pagos
    pagos?: Pago[];

    // Timestamps
    created_at?: string;
    updated_at?: string;
}

export interface Pago extends BaseEntity {
    id: Id;
    cuenta_por_pagar_id: Id;
    cuenta_por_pagar?: CuentaPorPagar;
    monto: number;
    fecha_pago: string;
    tipo_pago_id: Id;
    tipo_pago?: TipoPago;
    numero_recibo?: string | null;
    numero_cheque?: string | null;
    numero_transferencia?: string | null;
    observaciones?: string | null;
    usuario_id: Id;
    usuario?: Usuario;

    // Timestamps
    created_at?: string;
    updated_at?: string;
}

// =============== ENTIDADES PRINCIPALES ===============

export interface DetalleCompra extends BaseEntity {
    id: Id;
    compra_id: Id;
    producto_id: Id;
    producto: Producto;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
    lote?: string | null;
    fecha_vencimiento?: string | null;
    // ✅ NUEVO 2026-03-24: Stock movement tracking
    cantidad_anterior?: number | null;
    cantidad_posterior?: number | null;
}

export interface Compra extends BaseEntity {
    id: Id;
    numero: string;
    fecha: string;
    numero_factura?: string | null;
    subtotal: number;
    descuento: number;
    impuesto: number;
    total: number;
    observaciones?: string | null;

    // Relaciones
    proveedor_id: Id;
    proveedor?: Proveedor;
    usuario_id: Id;
    usuario?: Usuario;
    estado_documento_id: Id;
    estado_documento?: EstadoDocumento;
    moneda_id: Id;
    moneda?: Moneda;
    tipo_pago_id?: Id | null;
    tipo_pago?: TipoPago | null;

    // Detalles
    detalles?: DetalleCompra[];

    // Timestamps
    created_at?: string;
    updated_at?: string;
}

// =============== FORMULARIOS ===============

export interface DetalleCompraForm {
    producto_id: Id | string;
    cantidad: number | string;
    precio_unitario: number | string;
    lote?: string;
    fecha_vencimiento?: string;
}

export interface CompraFormData extends BaseFormData {
    id?: Id;
    numero?: string;
    fecha: string;
    numero_factura?: string;
    proveedor_id: Id | string;
    estado_documento_id: Id | string;
    moneda_id: Id | string;
    tipo_pago_id?: Id | string;
    observaciones?: string;
    detalles: DetalleCompraForm[];
}

export interface PagoFormData extends BaseFormData {
    id?: Id;
    cuenta_por_pagar_id: Id | string;
    monto: number | string;
    fecha_pago: string;
    tipo_pago_id: Id | string;
    numero_recibo?: string;
    numero_cheque?: string;
    numero_transferencia?: string;
    observaciones?: string;
}

export interface CuentaPorPagarFormData extends BaseFormData {
    id?: Id;
    compra_id: Id | string;
    monto_original: number | string;
    fecha_vencimiento: string;
    observaciones?: string;
}

// =============== FILTROS Y BUSQUEDAS ===============

export interface FiltrosCompras {
    q?: string;
    id?: string | number;
    proveedor_id?: string;
    estado_documento_id?: string;
    moneda_id?: string;
    tipo_pago_id?: string;
    fecha_desde?: string;
    fecha_hasta?: string;
    sort_by?: string;
    sort_dir?: string;
}

export interface FiltrosCuentasPorPagar {
    q?: string;
    proveedor_id?: string;
    estado?: string;
    fecha_vencimiento_desde?: string;
    fecha_vencimiento_hasta?: string;
    solo_vencidas?: boolean;
    sort_by?: string;
    sort_dir?: string;
}

export interface FiltrosPagos {
    q?: string;
    cuenta_por_pagar_id?: string;
    tipo_pago_id?: string;
    fecha_desde?: string;
    fecha_hasta?: string;
    sort_by?: string;
    sort_dir?: string;
}

export interface DatosParaFiltrosCompras {
    proveedores: Proveedor[];
    estados: EstadoDocumento[];
    monedas: Moneda[];
    tipos_pago: TipoPago[];
}

// =============== ESTADÍSTICAS ===============

export interface EstadisticasCompras {
    total_compras: number;
    monto_total: number;
    promedio_compra: number;
    compras_por_estado: Array<{
        nombre: string;
        cantidad: number;
        monto_total: number;
    }>;
    mes_actual: {
        compras: number;
        monto: number;
        variacion_compras: number;
        variacion_monto: number;
    };
}

export interface EstadisticasCuentasPorPagar {
    total_cuentas: number;
    monto_total_pendiente: number;
    monto_total_vencido: number;
    cuentas_vencidas: number;
    promedio_dias_pago: number;
    distribucion_por_estado: Array<{
        estado: string;
        cantidad: number;
        monto_total: number;
    }>;
    distribucion_por_vencimiento: Array<{
        rango: string;
        cantidad: number;
        monto_total: number;
    }>;
}

// =============== RESPUESTAS DE API ===============

export interface ComprasIndexResponse {
    compras: {
        data: Compra[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
    filtros: FiltrosCompras;
    datosParaFiltros: DatosParaFiltrosCompras;
    estadisticas: EstadisticasCompras;
}

export interface ComprasCreateResponse {
    proveedores: Proveedor[];
    productos: Producto[];
    estados_documento: EstadoDocumento[];
    monedas: Moneda[];
}

export interface ComprasShowResponse {
    compra: Compra;
}

export interface CuentasPorPagarIndexResponse {
    cuentas_por_pagar: {
        data: CuentaPorPagar[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
    filtros: FiltrosCuentasPorPagar;
    estadisticas: EstadisticasCuentasPorPagar;
    datosParaFiltros: {
        proveedores: Proveedor[];
        tipos_pago: TipoPago[];
    };
}

export interface PagosIndexResponse {
    pagos: {
        data: Pago[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
    filtros: FiltrosPagos;
    datosParaFiltros: {
        cuentas_por_pagar: CuentaPorPagar[];
        tipos_pago: TipoPago[];
    };
}
