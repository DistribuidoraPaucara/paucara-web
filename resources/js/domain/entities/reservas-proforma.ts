/**
 * Entidad: ReservaProforma
 * Reservas de stock para proformas con seguimiento de vencimiento
 */

export interface ReservaProforma {
    id: number;
    proforma_id: number;
    proforma_numero: string;
    proforma_total: number;
    proforma_estado: string;
    cliente_id: number;
    cliente_nombre: string;
    cliente_nit: string;
    usuario_nombre: string;
    stock_producto_id: number;
    producto_id: number;
    producto_nombre: string;
    producto_codigo: string;
    producto_sku: string;
    almacen_id: number;
    almacen_nombre: string;
    cantidad_reservada: number;
    stock_total: number;
    stock_disponible: number;
    stock_reservado: number;
    precio_venta: number;
    valor_reservado: number;
    estado: 'ACTIVA' | 'LIBERADA' | 'CONSUMIDA';
    fecha_reserva: string; // ISO 8601
    fecha_expiracion: string | null; // ISO 8601
    esta_expirada: boolean;
    dias_para_expirar: number | null;
    created_at: string;
    updated_at: string;
}

export interface ReservaProformaDetalle extends ReservaProforma {
    proforma: {
        id: number;
        numero: string;
        total: number;
        estado: string;
        created_at: string;
        cliente: {
            id: number;
            nombre: string;
            nit: string;
            email: string;
        };
        usuario: {
            id: number;
            nombre: string;
        };
        detalles: any[];
    };
    producto: {
        id: number;
        nombre: string;
        codigo: string;
        sku: string;
    };
    almacen: {
        id: number;
        nombre: string;
    };
}

export interface ReservaProformaFilters {
    estado?: 'ACTIVA' | 'LIBERADA' | 'CONSUMIDA';
    proforma_id?: number;
    proforma_numero?: string;
    producto_id?: number;
    almacen_id?: number;
    cliente_id?: number;
    vencimiento?: 'expirada' | 'pronto' | 'vigente';
    fecha_creacion_desde?: string;
    fecha_creacion_hasta?: string;
    fecha_vencimiento_desde?: string;
    fecha_vencimiento_hasta?: string;
    ordenamiento?: string;
    per_page?: number;
    page?: number;
}

export interface ReservaProformaResponse {
    success: boolean;
    data: ReservaProforma[];
    pagination: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    summary: {
        total_registros: number;
        activas: number;
        liberadas: number;
        consumidas: number;
        expiradas: number;
        proximo_a_expirar: number;
        valor_total_reservado: number;
    };
}
