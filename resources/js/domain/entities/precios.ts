// Domain: Precios
import type { Id } from './shared';
import type { BaseEntity } from './generic';
import type { Producto } from './productos';
import type { TipoPrecio } from './tipos-precio';

// =============== TIPO PRECIO ===============

export interface TipoPrecioEntity extends BaseEntity {
    id: Id;
    codigo: string;
    nombre: string;
    descripcion?: string;
    color: string;
    es_ganancia: boolean;
    es_precio_base: boolean;
    orden: number;
    activo: boolean;
}

// =============== PRECIO PRODUCTO ===============

export interface HistorialPrecio extends BaseEntity {
    id: Id;
    precio_producto_id?: Id;
    tipo_precio_id?: Id;
    valor_anterior: number;
    valor_nuevo: number;
    porcentaje_cambio: number;
    motivo: string;
    usuario: string;
    fecha_cambio: string;
    created_at?: string;
    updated_at?: string;
}

export interface PrecioProducto extends BaseEntity {
    id: Id;
    producto_id: Id;
    producto?: Producto;
    tipo_precio_id: Id;
    tipo_precio?: TipoPrecioEntity;
    precio: number;
    margen_ganancia: number;
    porcentaje_ganancia: number;
    motivo_cambio?: string | null;
    activo: boolean;
    updated_at?: string;
    created_at?: string;
    historialPrecios?: HistorialPrecio[];
}

// =============== DTO PARA API ===============

export interface PrecioProductoDTO {
    id: Id;
    tipo_precio_id: Id;
    precio_actual: number;
    margen_ganancia: number;
    porcentaje_ganancia: number;
    motivo_cambio?: string | null;
    updated_at?: string;
    actualizado_recientemente?: boolean;
    requiere_revision?: boolean;
    tipo: {
        id: Id;
        codigo: string;
        nombre: string;
        color: string;
        es_ganancia: boolean;
    };
    historial: HistorialPrecio[];
}

export interface ProductoConPreciosDTO extends BaseEntity {
    id: Id;
    nombre: string;
    sku?: string;
    categoria?: {
        id: Id;
        nombre: string;
    };
    costo_cambio_reciente?: boolean;
    tiene_diferencia_costo_en_compra?: boolean;
    precios: PrecioProductoDTO[];
}

// =============== FILTROS Y BÚSQUEDA ===============

export interface FiltrosPrecio {
    q?: string;
    tipo_precio_id?: Id;
    ordenar_por?: 'producto' | 'tipo_precio' | 'cambio_reciente' | 'precio';
    per_page?: number;
}

export interface PreciosListaResponse {
    data: ProductoConPreciosDTO[];
    links?: any;
    current_page?: number;
    per_page?: number;
    total?: number;
    last_page?: number;
}
