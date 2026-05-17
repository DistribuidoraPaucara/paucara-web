/**
 * Domain Entities: Dashboard de Inventario
 *
 * Define todas las entidades y tipos relacionados con el dashboard
 * de inventario, separando la lógica de dominio de la presentación
 */

/**
 * Estadísticas del inventario
 */
export interface Estadisticas {
    total_productos: number;
    productos_stock_bajo: number;
    productos_proximos_vencer: number;
    productos_vencidos: number;
}

/**
 * Conversión de unidad para productos fraccionados
 */
export interface ConversionUnidad {
    id: number;
    unidad_origen_id: number;
    unidad_destino_id: number;
    unidad_destino_nombre: string;
    factor_conversion: number;
    cantidad_en_conversion: number; // Cantidad en unidad destino (calculated)
}

/**
 * Detalle de lote para un stock de producto
 */
export interface DetalleLote {
    id: number; // stock_producto_id
    lote: string;
    fecha_vencimiento: string | null;
    cantidad: number;
    cantidad_disponible: number;
    cantidad_reservada: number;
    conversiones?: ConversionUnidad[];
}

/**
 * Stock de productos por almacén (detalle de stock_productos)
 */
export interface StockPorAlmacen {
    id: number;
    producto_id: number;
    almacen_id: number;
    cantidad: number;
    cantidad_disponible: number;
    cantidad_reservada: number;
    precio_venta: number;
    producto_nombre: string;
    producto_codigo: string;
    producto_codigo_barra: string;
    producto_sku: string;
    almacen_nombre: string;
    fecha_vencimiento_proximo?: string | null;
    // Campos para productos fraccionados
    es_fraccionado: boolean;
    unidad_medida_nombre?: string; // Unidad base del producto
    conversiones?: ConversionUnidad[]; // Conversiones disponibles
    // Detalles de lotes (para productos con múltiples lotes)
    detalles_lotes?: DetalleLote[];
}

/**
 * Movimiento de inventario reciente
 * ✅ MEJORADO (2026-02-18): Incluir información de conversiones de unidades
 */
export interface MovimientoReciente {
    id: number;
    tipo: string; // 'ENTRADA_COMPRA' | 'SALIDA_VENTA' | etc
    cantidad: number;
    fecha: string;
    numero_documento?: string;
    stockProducto?: {
        id?: number;
        producto?: {
            id?: number;
            nombre: string;
        };
        almacen?: {
            id?: number;
            nombre: string;
        };
    };
    user?: {
        id?: number;
        name: string;
    };
    // ✅ NUEVO (2026-02-18): Campos para conversión de unidades
    es_conversion_aplicada?: boolean;
    cantidad_solicitada?: number;
    factor_conversion?: number;
    unidad_venta_nombre?: string;
    unidad_base_nombre?: string;
}

/**
 * Producto con mayor cantidad de movimientos
 */
export interface ProductoMasMovido {
    producto_id: number;
    nombre_producto: string;
    total_movimientos: number;
}

/**
 * Props de la página del dashboard
 */
export interface DashboardPageProps {
    estadisticas: Estadisticas;
    stock_por_almacen: StockPorAlmacen[];
    movimientos_recientes: MovimientoReciente[];
    productos_mas_movidos: ProductoMasMovido[];
}

/**
 * Datos procesados del dashboard para la vista
 */
export interface DashboardData {
    estadisticas: Estadisticas;
    stockPorAlmacen: StockPorAlmacen[];
    movimientosRecientes: MovimientoReciente[];
    productosMasMovidos: ProductoMasMovido[];
}

/**
 * Constantes para el dashboard
 */
export const DASHBOARD_CONSTANTS = {
    ITEMS_MOVIMIENTOS_RECIENTES: 5,
    ITEMS_PRODUCTOS_MAS_MOVIDOS: 5,
    TIPOS_MOVIMIENTO: {
        ENTRADA: 'entrada',
        SALIDA: 'salida',
        AJUSTE: 'ajuste'
    } as const
} as const;
