// Domain: MovimientosInventario
import type { Id } from './shared';
import type { BaseEntity, BaseFormData } from './generic';
import type { Producto } from './productos';
import type { Almacen } from './almacenes';

export interface MovimientoInventario extends BaseEntity {
    id: Id;
    stock_producto_id: Id;
    cantidad: number;
    fecha: string;
    observacion?: string | null;
    numero_documento?: string | null;
    cantidad_anterior: number;
    cantidad_posterior: number;
    tipo: MovimientoTipo;
    user_id?: Id;
    created_at?: string;
    updated_at?: string;

    // ✅ Tipo de ajuste (relación FK)
    tipo_ajuste_inventario_id?: Id;
    tipoAjusteInventario?: TipoAjusteInventario;

    // ✅ NUEVO (2026-02-18): Información de conversiones de unidades
    es_conversion_aplicada?: boolean;
    cantidad_solicitada?: number | null;
    unidad_venta_id?: Id | null;
    unidad_base_id?: Id | null;
    factor_conversion?: number | null;
    unidad_venta_nombre?: string | null;
    unidad_base_nombre?: string | null;

    // Relaciones
    stockProducto?: StockProducto;
    user?: User;
}

/**
 * Interface para TipoAjusteInventario
 * Contiene configuración y detalles del tipo de ajuste (entrada/salida)
 */
export interface TipoAjusteInventario {
    id: Id;
    clave: string;                           // ej: ENTRADA_COMPRA, SALIDA_VENTA
    label: string;                           // ej: "Entrada por Compra"
    tipo_operacion: 'entrada' | 'salida' | 'ambos';  // ← Para filtrar
    descripcion?: string | null;
    color?: string | null;                   // Color hex: #10b981
    bg_color?: string | null;                // Clase Tailwind: bg-green-50
    text_color?: string | null;              // Clase Tailwind: text-green-800
    activo: boolean;
}

export interface StockProducto {
    id: Id;
    producto_id: Id;
    almacen_id: Id;
    cantidad: number;
    precio_promedio: number;
    stock_minimo: number;
    fecha_vencimiento?: string | null;
    lote?: string | null;

    // Relaciones
    producto?: Producto;
    almacen?: Almacen;
}


export interface Categoria {
    id: Id;
    nombre: string;
    descripcion?: string | null;
}

export interface User {
    id: Id;
    name: string;
    email: string;
}

/**
 * Tipos de movimiento de inventario
 *
 * IMPORTANTE: Estos tipos deben coincidir exactamente con las constantes
 * definidas en app/Models/MovimientoInventario.php
 *
 * @see app/Models/MovimientoInventario.php:54-60
 */
export type MovimientoTipo =
    | 'ENTRADA_COMPRA'      // MovimientoInventario::TIPO_ENTRADA_COMPRA
    | 'ENTRADA_AJUSTE'      // MovimientoInventario::TIPO_ENTRADA_AJUSTE
    | 'SALIDA_VENTA'        // MovimientoInventario::TIPO_SALIDA_VENTA
    | 'SALIDA_AJUSTE'       // MovimientoInventario::TIPO_SALIDA_AJUSTE
    | 'SALIDA_MERMA'        // MovimientoInventario::TIPO_SALIDA_MERMA
    | 'TRANSFERENCIA';      // MovimientoInventario::TIPO_TRANSFERENCIA

/**
 * FormData para crear movimientos de inventario
 *
 * NOTA: Para ajustes de inventario, el backend espera 'nueva_cantidad' (valor objetivo)
 * en lugar de 'cantidad' (diferencia). Ver StoreAjusteInventarioRequest.php
 */
export interface MovimientoInventarioFormData extends BaseFormData {
    stock_producto_id: Id;
    cantidad: number;  // Para movimientos normales (compras, ventas, mermas)
    tipo: MovimientoTipo;
    observacion?: string;
    numero_documento?: string;
}

/**
 * FormData específico para ajustes de inventario
 */
export interface AjusteInventarioFormData extends BaseFormData {
    stock_producto_id: Id;
    nueva_cantidad: number;  // Valor objetivo del stock (no la diferencia)
    observacion?: string;
    tipo_ajuste_id?: Id;
}

export interface MovimientoInventarioFilters {
    tipo?: MovimientoTipo | '';
    almacen_id?: Id | '';
    producto_id?: Id | '';
    fecha_inicio?: string;
    fecha_fin?: string;
    usuario_id?: Id | '';
    numero_documento?: string;
    page?: number;
    per_page?: number;
}

/**
 * Configuración visual y descripción de cada tipo de movimiento
 *
 * IMPORTANTE: Las claves de este objeto deben coincidir con MovimientoTipo
 */
export const TIPOS_MOVIMIENTO: Record<MovimientoTipo, {
    label: string;
    color: string;
    icon: string;
    categoria: 'entrada' | 'salida' | 'transferencia';
}> = {
    ENTRADA_COMPRA: {
        label: 'Entrada por Compra',
        color: 'text-green-800 bg-green-100 dark:bg-green-900 dark:text-green-200',
        icon: '🛒',
        categoria: 'entrada'
    },
    ENTRADA_AJUSTE: {
        label: 'Entrada por Ajuste',
        color: 'text-blue-800 bg-blue-100 dark:bg-blue-900 dark:text-blue-200',
        icon: '⚖️',
        categoria: 'entrada'
    },
    SALIDA_VENTA: {
        label: 'Salida por Venta',
        color: 'text-red-800 bg-red-100 dark:bg-red-900 dark:text-red-200',
        icon: '💰',
        categoria: 'salida'
    },
    SALIDA_AJUSTE: {
        label: 'Salida por Ajuste',
        color: 'text-orange-800 bg-orange-100 dark:bg-orange-900 dark:text-orange-200',
        icon: '📉',
        categoria: 'salida'
    },
    SALIDA_MERMA: {
        label: 'Salida por Merma',
        color: 'text-yellow-800 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200',
        icon: '⚠️',
        categoria: 'salida'
    },
    TRANSFERENCIA: {
        label: 'Transferencia entre Almacenes',
        color: 'text-indigo-800 bg-indigo-100 dark:bg-indigo-900 dark:text-indigo-200',
        icon: '🔄',
        categoria: 'transferencia'
    }
};

export const CATEGORIAS_MOVIMIENTO = {
    entrada: {
        label: 'Entradas',
        color: 'text-green-600',
        icon: '⬆️'
    },
    salida: {
        label: 'Salidas',
        color: 'text-red-600',
        icon: '⬇️'
    },
    transferencia: {
        label: 'Transferencias',
        color: 'text-blue-600',
        icon: '🔄'
    }
} as const;

// ===================================================================
// === SISTEMA UNIFICADO DE MOVIMIENTOS (MovimientoUnificado) ===
// ===================================================================

export type TipoMovimientoUnificado =
    | 'ENTRADA'      // Compras, devoluciones de clientes
    | 'SALIDA'       // Ventas, devoluciones a proveedores
    | 'AJUSTE'       // Ajustes manuales de inventario
    | 'TRANSFERENCIA' // Transferencias entre almacenes
    | 'MERMA'        // Pérdidas, deterioros, vencimientos
    | 'PRODUCCION'   // Entrada por producción (futuro)
    | 'DEVOLUCION';  // Devoluciones internas (futuro)

export type SubtipoMovimiento =
    // Subtipos para ENTRADA
    | 'COMPRA'
    | 'DEVOLUCION_CLIENTE'
    | 'AJUSTE_POSITIVO'
    // Subtipos para SALIDA
    | 'VENTA'
    | 'DEVOLUCION_PROVEEDOR'
    | 'AJUSTE_NEGATIVO'
    // Subtipos para TRANSFERENCIA
    | 'TRANSFERENCIA_SALIDA'
    | 'TRANSFERENCIA_ENTRADA'
    // Subtipos para MERMA
    | 'MERMA_VENCIMIENTO'
    | 'MERMA_DETERIORO'
    | 'MERMA_ROBO'
    | 'MERMA_PERDIDA'
    | 'MERMA_DANO'
    | 'MERMA_OTROS';

export interface MovimientoUnificado extends BaseEntity {
    id: Id;
    tipo: TipoMovimientoUnificado;
    tipo_ajuste_id?: Id;
    subtipo: SubtipoMovimiento;
    numero_documento?: string | null;
    fecha: string;
    hora: string;

    // Referencias a documentos origen
    referencia_id?: Id;
    referencia_tipo?: 'transferencia' | 'merma' | 'compra' | 'venta' | 'ajuste';
    numero_referencia?: string | null;

    // Información del producto y stock
    producto_id: Id;
    producto: Producto;
    almacen_id: Id;
    almacen: Almacen;
    cantidad: number;
    cantidad_anterior: number;
    cantidad_nueva: number;

    // Información financiera
    costo_unitario?: number | null;
    costo_total?: number | null;
    precio_venta?: number | null;
    valor_total?: number | null;

    // Información adicional
    lote?: string | null;
    fecha_vencimiento?: string | null;
    motivo: string;
    observaciones?: string | null;

    // Usuario responsable
    usuario_id: Id;
    usuario: {
        id: Id;
        name: string;
        email?: string;
    };

    // Información de transferencias
    almacen_origen_id?: Id;
    almacen_origen?: Almacen;
    almacen_destino_id?: Id;
    almacen_destino?: Almacen;

    // Estado y aprobaciones
    estado?: 'PENDIENTE' | 'PROCESADO' | 'CANCELADO' | 'APROBADO' | 'RECHAZADO';
    requiere_aprobacion?: boolean;
    aprobado_por_id?: Id;
    aprobado_por?: {
        id: Id;
        name: string;
    };
    fecha_aprobacion?: string | null;
}

export type EstadoMovimiento = 'PENDIENTE' | 'PROCESADO' | 'CANCELADO' | 'APROBADO' | 'RECHAZADO';

export interface FiltrosMovimientos {
    // Filtros básicos
    tipo?: TipoMovimientoUnificado;
    tipos?: TipoMovimientoUnificado[];
    tipo_ajuste_id?: Id;
    subtipo?: SubtipoMovimiento;
    subtipos?: SubtipoMovimiento[];

    // Filtros de ubicación
    almacen_id?: Id;
    almacenes?: Id[];
    almacen_origen_id?: Id;
    almacen_destino_id?: Id;

    // Filtros de producto y usuario
    producto_id?: Id;
    producto_busqueda?: string;  // Búsqueda flexible por ID, SKU, nombre o código de barras
    productos?: Id[];
    usuario_id?: Id;
    usuarios?: Id[];

    // Filtros de estado y tiempo (nombres coinciden con backend)
    estado?: EstadoMovimiento;
    estados?: EstadoMovimiento[];
    fecha_inicio?: string;
    fecha_fin?: string;

    // Filtros de búsqueda
    observaciones?: string;  // Búsqueda en observaciones del movimiento
    numero_documento?: string;  // Búsqueda por número de documento (factura, transferencia, etc)
    numero_referencia?: string;
    lote?: string;

    // Filtros de cantidad y valor
    cantidad_min?: number;
    cantidad_max?: number;
    valor_min?: number;
    valor_max?: number;

    // Filtros booleanos
    requiere_aprobacion?: boolean;
    solo_pendientes?: boolean;
    solo_mermas?: boolean;

    // ✅ NUEVO (2026-03-27): Filtro por tipo de referencia
    referencia_tipo?: string;  // 'proforma', 'venta', etc.
}

export interface EstadisticasMovimientos {
    total_movimientos: number;
    total_entradas: number;
    total_salidas: number;
    total_transferencias: number;
    total_mermas: number;
    total_ajustes: number;
    valor_total_entradas: number;
    valor_total_salidas: number;
    valor_total_mermas: number;
    productos_afectados: number;
    almacenes_activos: number;
    movimientos_pendientes: number;
    tendencia_semanal: {
        fecha: string;
        entradas: number;
        salidas: number;
        transferencias: number;
        mermas: number;
    }[];
}

// Alias para compatibilidad
export type MovimientosStats = EstadisticasMovimientos;
