// Domain: Préstamos de Canastillas y Embases
import type { Id } from './shared';
import type { BaseEntity, BaseFormData } from './generic';

// ============================================
// TIPOS ENUM
// ============================================

export type TipoPrestable = 'CANASTILLA' | 'EMBASES' | 'OTRO';
export type EstadoPrestamo = 'ACTIVO' | 'COMPLETAMENTE_DEVUELTO' | 'PARCIALMENTE_DEVUELTO' | 'CANCELADO';
export type TipoPrecio = 'VENTA' | 'PRESTAMO';

// ============================================
// ENTIDADES PRINCIPALES
// ============================================

export interface PrestablePrice extends BaseEntity {
    id: Id;
    prestable_id: Id;
    tipo: TipoPrecio;
    precio: number;
    activo: boolean;
}

export interface PrestableCondicion extends BaseEntity {
    id: Id;
    prestable_id: Id;
    monto_garantia: number;
    monto_daño_parcial: number;
    monto_daño_total: number;
}

export interface PrestableStock extends BaseEntity {
    id: Id;
    prestable_id: Id;
    almacen_id: Id;
    cantidad_disponible: number;
    cantidad_en_prestamo_cliente: number;
    cantidad_en_prestamo_proveedor: number;
    cantidad_vendida: number;
}

export interface ProductoRelacionadoPrestable extends BaseEntity {
    id: Id;
    prestable_id: Id;
    producto_id: Id;
    descripcion?: string | null;
    es_principal: boolean;
    orden: number;
    // Relaciones
    producto?: {
        id: Id;
        nombre: string;
        sku?: string;
    };
}

export interface Prestable extends BaseEntity {
    id: Id;
    nombre: string;
    codigo: string;
    tipo: TipoPrestable;
    capacidad?: number | null;
    activo: boolean;
    precios: PrestablePrice[];
    condiciones: PrestableCondicion;
    stocks: PrestableStock[];
    productosRelacionados?: ProductoRelacionadoPrestable[];
    prestablePadre?: Prestable | null;
    embasesRelacionados?: Prestable[];
}

export interface DevolucionClienteDetalle extends BaseEntity {
    id: Id;
    devolucion_cliente_id: Id;
    prestamo_cliente_detalle_id: Id;
    cantidad_devuelta: number;
    cantidad_dañada_parcial: number;
    cantidad_dañada_total: number;
    monto_cobrado_daño: number;
    monto_garantia_devuelta: number;
    monto_excedido_detalle: number;
    // Relaciones
    detallePrestamoCliente?: {
        id: Id;
        prestable_id: Id;
        cantidad_prestada: number;
        prestable?: Prestable;
    };
}

export interface DevolucionCliente extends BaseEntity {
    id: Id;
    prestamo_cliente_id: Id;
    fecha_devolucion: string;
    monto_cobrado_daño_total: number;
    monto_garantia_devuelta_total: number;
    monto_excedido_garantia: number;
    observaciones?: string | null;
    chofer_id?: Id | null;
    detalles: DevolucionClienteDetalle[];
    // Relaciones
    prestamo?: {
        id: Id;
        cliente_id: Id;
    };
}

// ✅ NUEVO: Almacenes en los que se distribuyó un préstamo
export interface PrestamoClienteAlmacen extends BaseEntity {
    id: Id;
    prestamo_cliente_detalle_id: Id;
    almacenes_prestables_id: Id;
    cantidad: number;
    es_proveedor: boolean;
    // Relaciones
    almacen?: {
        id: Id;
        nombre: string;
    };
}

export interface PrestamoClienteDetalle extends BaseEntity {
    id: Id;
    prestamo_cliente_id: Id;
    prestable_id: Id;
    cantidad_prestada: number;
    precio_unitario?: number | null;
    precio_prestamo?: number | null;
    estado: EstadoPrestamo;
    devolucion_detalles: DevolucionClienteDetalle[];
    // Legacy compatibility
    devoluciones?: DevolucionClienteDetalle[];
    // ✅ NUEVO: Almacenes en los que se distribuyó este préstamo
    almacenes?: PrestamoClienteAlmacen[];
    // Relaciones
    prestable: Prestable;
}

export interface PrestamoCliente extends BaseEntity {
    id: Id;
    cliente_id: Id;
    chofer_id?: Id | null;
    venta_id?: Id | null;
    almacenes_prestables_id?: Id | null;
    vehiculo_id?: Id | null;
    telefono_cliente_1?: string | null;
    telefono_cliente_2?: string | null;
    es_venta: boolean;
    es_evento?: boolean;
    monto_garantia: number;
    fecha_prestamo: string;
    fecha_esperada_devolucion?: string | null;
    estado: EstadoPrestamo;
    observaciones?: string | null;
    detalles: PrestamoClienteDetalle[];
    devoluciones: DevolucionCliente[];
    // Relaciones
    cliente: {
        id: Id;
        razon_social: string;
        nombre?: string;
    };
    chofer?: {
        id: Id;
        nombre: string;
    } | null;
    almacen?: {
        id: Id;
        nombre: string;
    } | null;
    vehiculo?: {
        id: Id;
        placa: string;
        marca?: string;
        modelo?: string;
    } | null;
}

export interface DevolucionProveedorDetalle extends BaseEntity {
    id: Id;
    devolucion_proveedor_id: Id;
    prestamo_proveedor_detalle_id: Id;
    cantidad_devuelta: number;
    cantidad_dañada_total?: number;
}

export interface DevolucionProveedor extends BaseEntity {
    id: Id;
    prestamo_proveedor_id: Id;
    fecha_devolucion: string;
    monto_cobrado_daño_total?: number;
    observaciones?: string | null;
    detalles?: DevolucionProveedorDetalle[];
}

export interface PrestamoProveedor extends BaseEntity {
    id: Id;
    proveedor_id: Id;
    almacenes_prestables_id?: Id | null;
    chofer_id?: Id | null;
    vehiculo_asignado?: string | null;
    compra_id?: Id | null;
    es_compra: boolean;
    monto_garantia: number;
    fecha_prestamo: string;
    fecha_esperada_devolucion?: string | null;
    observaciones?: string | null;
    estado: EstadoPrestamo;
    detalles: PrestamoProveedorDetalle[];
    devoluciones: DevolucionProveedor[];
    // Relaciones
    proveedor?: {
        id: Id;
        nombre: string;
        razon_social?: string;
    };
    almacen?: {
        id: Id;
        nombre: string;
    } | null;
    chofer?: {
        id: Id;
        name: string;
    } | null;
    compra?: {
        id: Id;
        numero: string;
    } | null;
}

// ✅ NUEVO: Almacenes en los que se distribuyó un préstamo de proveedor
export interface PrestamoProveedorAlmacen extends BaseEntity {
    id: Id;
    prestamo_proveedor_detalle_id: Id;
    almacenes_prestables_id: Id;
    cantidad: number;
    es_proveedor: boolean;
    // Relaciones
    almacen?: {
        id: Id;
        nombre: string;
    };
}

export interface PrestamoProveedorDetalle extends BaseEntity {
    id: Id;
    prestamo_proveedor_id: Id;
    prestable_id: Id;
    cantidad_prestada: number;
    almacenes_ids?: Id[];
    estado: EstadoPrestamo;
    devolucionDetalles?: DevolucionProveedorDetalle[];
    // ✅ NUEVO: Almacenes en los que se distribuyó este préstamo
    almacenes?: PrestamoProveedorAlmacen[];
    // Relaciones
    prestable?: Prestable;
}

export interface ReporteResumen {
    total_canastillas: number;
    disponible: number;
    en_prestamo_clientes: number;
    deuda_proveedores: number;
    vendido: number;
    prestamos_activos_clientes: number;
    prestamos_activos_proveedores: number;
}

// ============================================
// FORMULARIOS
// ============================================

export interface NuevoPrestable extends BaseFormData {
    nombre: string;
    codigo: string;
    tipo: TipoPrestable;
    capacidad?: number;
    producto_id?: Id;
    proveedor_id?: Id;
    prestable_relacionado_id?: Id;
    descripcion?: string;
    crear_embase_asociado?: boolean;
    productos_relacionados?: {
        producto_id: Id;
        es_principal?: boolean;
    }[];
    precios: {
        tipo_precio: string;
        valor: number;
    }[];
    precios_embase?: {
        tipo_precio: string;
        valor: number;
    }[];
    condiciones: {
        monto_garantia: number;
        monto_daño_total?: number;
    };
}

export interface NuevoPrestamoClienteDetalle {
    prestable_id: Id;
    cantidad: number;
    almacenes_ids: Id[];
    precio_unitario?: number;
    precio_prestamo?: number;
}

export interface NuevoPrestamoCliente extends BaseFormData {
    cliente_id: Id;
    almacenes_prestables_id: Id;
    chofer_id?: Id;
    vehiculo_id?: Id;
    venta_id?: Id;
    telefono_cliente_1?: string;
    telefono_cliente_2?: string;
    es_venta: boolean;
    es_evento?: boolean;
    fecha_prestamo: string;
    fecha_esperada_devolucion?: string;
    monto_garantia?: number;
    observaciones?: string;
    detalles: NuevoPrestamoClienteDetalle[];
}

export interface NuevoPrestamoProveedor extends BaseFormData {
    proveedor_id: Id;
    almacenes_prestables_id: Id;
    chofer_id?: Id | null;
    vehiculo_asignado?: string | null;
    compra_id?: Id;
    es_compra: boolean;
    monto_garantia?: number;
    fecha_prestamo: string;
    fecha_esperada_devolucion?: string;
    observaciones?: string;
    detalles: Array<{
        prestable_id: Id;
        cantidad: number;
    }>;
}

// ✅ NUEVO: Almacenes en los que se distribuyó un préstamo de evento
export interface PrestamoEventoAlmacen extends BaseEntity {
    id: Id;
    prestamo_evento_detalle_id: Id;
    almacenes_prestables_id: Id;
    cantidad: number;
    es_proveedor: boolean;
    // Relaciones
    almacen?: {
        id: Id;
        nombre: string;
    };
}

export interface PrestamoEventoDetalle extends BaseEntity {
    id: Id;
    prestamo_evento_id: Id;
    prestable_id: Id;
    cantidad_prestada: number;
    monto_garantia: number;
    estado: EstadoPrestamo;
    devoluciones?: Array<any>;
    // ✅ NUEVO: Almacenes en los que se distribuyó este préstamo
    almacenes?: PrestamoEventoAlmacen[];
    prestable?: Prestable;
}

export interface DevolucionEvento extends BaseEntity {
    id: Id;
    prestamo_evento_id: Id;
    fecha_devolucion: string;
    monto_cobrado_daño_total?: number;
    monto_garantia_devuelta_total?: number;
    observaciones?: string | null;
    chofer_id?: Id | null;
    detalles?: Array<any>;
}

export interface PrestamoEvento extends BaseEntity {
    id: Id;
    cliente_id?: Id | null;
    almacenes_prestables_id?: Id | null;
    nombre_evento: string;
    encargado_evento?: string | null;
    vehiculo_asignado?: string | null;
    direccion_evento?: string | null;
    telefono_uno?: string | null;
    telefono_dos?: string | null;
    venta_id?: Id | null;
    chofer_id?: Id | null;
    cantidad: number;
    monto_garantia: number;
    fecha_prestamo: string;
    fecha_entrega?: string | null;
    fecha_esperada_devolucion?: string | null;
    estado: EstadoPrestamo;
    detalles: PrestamoEventoDetalle[];
    devoluciones: DevolucionEvento[];
    cliente?: { id: Id; nombre?: string; razon_social?: string } | null;
    almacen?: { id: Id; nombre: string } | null;
    chofer?: { id: Id; nombre: string } | null;
    venta?: { id: Id; numero: string } | null;
    ventas?: Array<{ id: Id; numero: string; cliente?: { id: Id; nombre: string } }>;
}

export interface NuevoPrestamoEventoDetalle {
    prestable_id: Id;
    cantidad: number;
    almacenes_ids: Id[];
}

export interface NuevoPrestamoEvento extends BaseFormData {
    nombre_evento: string;
    encargado_evento?: string;
    vehiculo_asignado?: string;
    direccion_evento?: string;
    telefono_uno?: string;
    telefono_dos?: string;
    almacenes_prestables_id?: Id;
    ventas_ids?: Id[];
    chofer_id?: Id;
    fecha_prestamo: string;
    fecha_esperada_devolucion?: string;
    monto_garantia?: number;
    detalles: NuevoPrestamoEventoDetalle[];
}

export interface DetalleDevolucionCliente {
    prestamo_cliente_detalle_id: Id;
    cantidad_devuelta: number;
    cantidad_dañada_parcial?: number;
    cantidad_dañada_total?: number;
    monto_cobrado_daño?: number;
    embases_danados_parcial?: number;
    embases_danados_total?: number;
}

export interface DatosDevolucionCliente extends BaseFormData {
    prestamo_cliente_id: Id;
    fecha_devolucion: string;
    monto_cobrado_daño_total?: number;
    observaciones?: string;
    chofer_id?: Id;
    detalles: DetalleDevolucionCliente[];
}

export interface DatosDevolucionProveedor extends BaseFormData {
    prestamo_proveedor_id?: Id;
    cantidad_devuelta?: number;
    observaciones?: string;
    fecha_devolucion: string;
    monto_cobrado_daño_total?: number;
    devolucion_automatica?: boolean;
    detalles?: Array<{
        prestamo_proveedor_detalle_id: Id;
        cantidad_devuelta: number;
        cantidad_dañada_total?: number;
        devolucion_almacenes?: Array<{
            almacenes_prestables_id: Id;
            cantidad_devuelta: number;
            cantidad_dañada_total: number;
        }>;
    }>;
}

// ============================================
// FILTROS
// ============================================

export interface FiltrosPrestamosCliente {
    estado?: EstadoPrestamo;
    cliente_id?: Id;
    prestable_id?: Id;
    fecha_desde?: string;
    fecha_hasta?: string;
}

export interface FiltrosPrestamosProveedor {
    estado?: EstadoPrestamo;
    proveedor_id?: Id;
    prestable_id?: Id;
    fecha_desde?: string;
    fecha_hasta?: string;
}
